// Chrome CDP verification for the margin signal system. Node 22+, Chrome :9333.
import fs from 'node:fs/promises'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { execFileSync } from 'node:child_process'
import crypto from 'node:crypto'
const require=createRequire(import.meta.url)
const base=process.env.PREVIEW_URL || 'http://localhost:3000'
const debug='http://127.0.0.1:9333'
await fs.mkdir('artifacts/background',{recursive:true})
const target=await(await fetch(debug+'/json/new?about:blank',{method:'PUT'})).json()
const socket=new WebSocket(target.webSocketDebuggerUrl)
await new Promise((resolve,reject)=>{socket.onopen=resolve;socket.onerror=reject})
let next=0
const pending=new Map(), errors=[]
socket.onmessage=event=>{
  const message=JSON.parse(event.data)
  if(message.id&&pending.has(message.id)){const task=pending.get(message.id);pending.delete(message.id);message.error?task.reject(new Error(message.error.message)):task.resolve(message.result)}
  if(message.method==='Runtime.exceptionThrown')errors.push(message.params.exceptionDetails.text)
}
function cdp(method,params={}){return new Promise((resolve,reject)=>{const id=++next;pending.set(id,{resolve,reject});socket.send(JSON.stringify({id,method,params}))})}
async function evaluate(expression){const response=await cdp('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(response.exceptionDetails)throw new Error(JSON.stringify(response.exceptionDetails));return response.result.value}
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms))
const root='document.querySelector("[data-background=signal-routes]")'
const activity='[...document.querySelectorAll("[data-signal-runner]")].flatMap(e=>e.getAnimations()).length'
async function navigate(){
 await cdp('Page.navigate',{url:base})
 for(let i=0;i<100;i++){if(await evaluate('document.readyState==="complete"&&!!'+root))return;await sleep(100)}
 throw new Error('Page did not load')
}
async function signal(){
 for(let i=0;i<60;i++){if(await evaluate(root+'.dataset.phase==="signal"'))return;await sleep(100)}
 throw new Error('Expected a finite background pass')
}
async function screenshot(name){
 const shot=await cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:false})
 await fs.writeFile('artifacts/background/'+name+'.png',Buffer.from(shot.data,'base64'))
}
await cdp('Runtime.enable');await cdp('Page.enable');await cdp('Page.bringToFront')
await cdp('Page.addScriptToEvaluateOnNewDocument',{source:'window.__backgroundCLS=[];new PerformanceObserver(list=>window.__backgroundCLS.push(...list.getEntries().filter(e=>!e.hadRecentInput).map(e=>e.value))).observe({type:"layout-shift",buffered:true})'})
const axe=await fs.readFile(require.resolve('axe-core/axe.min.js'),'utf8')
const report={viewports:[]}
try{
 for(const[width,height]of [[1440,1000],[768,1024],[390,844],[320,740]]){
  await cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<768})
  await cdp('Emulation.setTouchEmulationEnabled',{enabled:width<768})
  await cdp('Emulation.setEmulatedMedia',{features:[]})
  await navigate();await signal();await sleep(700)
  const first=await evaluate('(()=>{const r='+root+';return{phase:r.dataset.phase,runners:[...r.querySelectorAll("[data-signal-runner]")].filter(e=>e.getAnimations().length).map(e=>({side:e.dataset.signalRunner,opacity:getComputedStyle(e).opacity,transform:getComputedStyle(e).transform}))}})()')
  assert.equal(first.runners.length,width<768?1:2)
  assert.ok(first.runners.some(r=>Number(r.opacity)>0),'Signal visibly interpolates')
  await screenshot(width+'-normal')
  await sleep(450)
  const second=await evaluate('[...document.querySelectorAll("[data-signal-runner]")].map(e=>getComputedStyle(e).transform)')
  assert.notEqual(first.runners[0].transform,second[0],'Signal actually travels')
  const geometry=await evaluate('(()=>{const r='+root+',c=document.querySelector(".hero").getBoundingClientRect(),rails=[...r.querySelectorAll("[data-signal-rail]")].map(e=>{const b=e.getBoundingClientRect();return{side:e.dataset.signalRail,left:b.left,right:b.right,width:b.width}}),button=document.querySelector(".hero-actions .button-primary"),b=button.getBoundingClientRect();return{position:getComputedStyle(r).position,pointerEvents:getComputedStyle(r).pointerEvents,hidden:r.getAttribute("aria-hidden"),focusable:r.querySelectorAll("a,button,input,[tabindex]").length,leftClear:rails[0].right<=c.left,rightClear:rails[1].left>=c.right,buttonHit:document.elementFromPoint(b.x+b.width/2,b.y+b.height/2)?.closest(".button")===button,overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth,rails,bursts:r.dataset.bursts}})()')
  assert.equal(geometry.position,'fixed');assert.equal(geometry.pointerEvents,'none')
  assert.equal(geometry.hidden,'true');assert.equal(geometry.focusable,0)
  assert.ok(geometry.leftClear&&geometry.rightClear&&geometry.buttonHit)
  assert.equal(geometry.overflow,false)
  // Removing the decorative layer must not change any section geometry.
  const layout=await evaluate('(()=>{const r='+root+';const measure=()=>[document.documentElement.scrollHeight,...[...document.querySelectorAll("main > section")].flatMap(e=>{const b=e.getBoundingClientRect();return[b.x,b.y,b.width,b.height]})];const before=measure();r.style.display="none";const absent=measure();r.style.display="";return{before,absent}})()')
  assert.deepEqual(layout.before,layout.absent)
  await sleep(2600)
  assert.equal(await evaluate(activity),0,'Pass settles without an idle loop')
  await evaluate(axe)
  const a11y=await evaluate('axe.run(document,{runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21aa"]}}).then(r=>({violations:r.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),manualReview:r.incomplete.map(v=>v.id)}))')
  assert.deepEqual(a11y.violations,[])
  await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]})
  await navigate();await sleep(1500)
  assert.equal(await evaluate(activity),0)
  assert.equal(await evaluate(root+'.dataset.bursts'),'0')
  assert.equal(await evaluate('getComputedStyle('+root+').display==="none"'),false,'Static routes remain')
  await screenshot(width+'-reduced')
  report.viewports.push({width,first,geometry,noLayoutChange:true,finite:true,reducedMotion:true,a11y,layoutShift:await evaluate('window.__backgroundCLS.reduce((a,b)=>a+b,0)')})
 }
 await cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false})
 await cdp('Emulation.setTouchEmulationEnabled',{enabled:false})
 await cdp('Emulation.setEmulatedMedia',{features:[]})
 await navigate();await signal()
 await evaluate('document.querySelector("#contact-name").focus({preventScroll:true})')
 assert.equal(await evaluate(activity),0)
 assert.equal(await evaluate(root+'.dataset.reason'),'focus')
 await navigate();await signal()
 await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9})
 await cdp('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9})
 assert.equal(await evaluate(activity),0)
 assert.equal(await evaluate(root+'.dataset.reason'),'keyboard')
 await navigate();await signal()
 await evaluate('document.querySelector("#projects").scrollIntoView({behavior:"instant"})');await sleep(300)
 assert.equal(await evaluate(activity),0)
 await evaluate('document.dispatchEvent(new CustomEvent("portfolio:workflow",{detail:"ledgerguard"}))')
 assert.equal(await evaluate(root+'.dataset.reason'),'workflow')
 // No burst on rapid repeated section navigation (cooldown + seen-section guard).
 await evaluate('document.querySelector("#skills").scrollIntoView({behavior:"instant"})');await sleep(100)
 await evaluate('document.querySelector("#about").scrollIntoView({behavior:"instant"})');await sleep(100)
 assert.equal(await evaluate(root+'.dataset.bursts'),'1')
 await navigate();await signal()
 await evaluate('Object.defineProperty(document,"hidden",{configurable:true,get:()=>true});document.dispatchEvent(new Event("visibilitychange"))')
 assert.equal(await evaluate(activity),0)
 assert.equal(await evaluate(root+'.dataset.reason'),'hidden')
 await navigate();await signal()
 await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]})
 await sleep(80)
 assert.equal(await evaluate(activity),0,'Preference changes stop in-flight motion')
 // Profile the actual active background under 4x CPU, after the hero has settled.
 await cdp('Emulation.setEmulatedMedia',{features:[]})
 await cdp('Emulation.setCPUThrottlingRate',{rate:4})
 await navigate();await signal()
 const performanceSample=await evaluate('new Promise(resolve=>{const gaps=[],tasks=[];let last=0;const observer=new PerformanceObserver(list=>tasks.push(...list.getEntries().map(e=>e.duration)));observer.observe({type:"longtask",buffered:false});function tick(time){if(last)gaps.push(time-last);last=time;if(gaps.length<120)requestAnimationFrame(tick);else{observer.disconnect();gaps.sort((a,b)=>a-b);resolve({frames:gaps.length,p95FrameGapMs:gaps[Math.floor(gaps.length*.95)],maxFrameGapMs:Math.max(...gaps),longTasksMs:tasks,activeSignals:'+activity+'})}}requestAnimationFrame(tick)})')
 await sleep(2200)
 assert.equal(await evaluate(activity),0)
 assert.ok(performanceSample.activeSignals>0,'Performance sample includes actual background motion')
 const staticBaseline=await evaluate('new Promise(resolve=>{const gaps=[];let last=0;function tick(time){if(last)gaps.push(time-last);last=time;if(gaps.length<120)requestAnimationFrame(tick);else{gaps.sort((a,b)=>a-b);resolve({frames:gaps.length,p95FrameGapMs:gaps[Math.floor(gaps.length*.95)],maxFrameGapMs:Math.max(...gaps)})}}requestAnimationFrame(tick)})')
 await cdp('Emulation.setCPUThrottlingRate',{rate:1})
 await cdp('Emulation.setEmulatedMedia',{features:[{name:'forced-colors',value:'active'}]})
 assert.equal(await evaluate('getComputedStyle('+root+').display'),'none')
 await cdp('Emulation.setEmulatedMedia',{features:[]})
 await cdp('Emulation.setScriptExecutionDisabled',{value:true})
 await navigate();await sleep(300)
 assert.equal(await evaluate('!!'+root+'&&'+root+'.querySelectorAll("svg").length===2'),true)
 assert.equal(await evaluate('document.querySelector("#hero-title").textContent.includes("Cloud infrastructure")'),true)
 await screenshot('1440-no-javascript')
 await cdp('Emulation.setScriptExecutionDisabled',{value:false})
 for(const file of ['src/data/projects.js','src/data/portfolio.js']){
  const expected=execFileSync('git',['show','HEAD:'+file])
  const actual=await fs.readFile(file)
  assert.equal(crypto.createHash('sha256').update(actual).digest('hex'),crypto.createHash('sha256').update(expected).digest('hex'),'Original content unchanged')
 }
 assert.deepEqual(errors,[])
 Object.assign(report,{focusStops:true,keyboardStops:true,projectQuiet:true,workflowQuiet:true,cooldown:true,hiddenEventStops:true,liveReducedMotion:true,forcedColors:true,noJavaScript:true,contentUnchanged:true,performanceSample,staticBaseline,runtimeErrors:errors})
 await fs.writeFile('artifacts/background/report.json',JSON.stringify(report,null,2))
 console.log(JSON.stringify(report,null,2))
}finally{
 await fetch(debug+'/json/close/'+target.id).catch(()=>{})
 if(socket.readyState!==WebSocket.CLOSED){const closed=new Promise(resolve=>socket.addEventListener('close',resolve,{once:true}));socket.close();await closed}
}
