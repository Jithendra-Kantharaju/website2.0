// Actual motion verification against the running Next development server.
import fs from 'node:fs/promises'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
if (process.argv.includes('--write-baseline')) {
  await fs.mkdir('artifacts', {recursive:true})
  const entries = await Promise.all(['src/data/projects.js','src/data/portfolio.js'].map(async file => [file,crypto.createHash('sha256').update(await fs.readFile(file)).digest('hex')]))
  await fs.writeFile('artifacts/animation-content-baseline.json',JSON.stringify(Object.fromEntries(entries),null,2))
  console.log('Saved the current content hashes for subsequent motion checks.')
  process.exit(0)
}
const base='http://localhost:3000', debug='http://127.0.0.1:9333'
await fs.mkdir('artifacts/motion-frames',{recursive:true})
const target=await(await fetch(debug+'/json/new?about:blank',{method:'PUT'})).json()
const socket=new WebSocket(target.webSocketDebuggerUrl)
await new Promise((resolve,reject)=>{socket.onopen=resolve;socket.onerror=reject})
let id=0;const pending=new Map(), errors=[],screens=[]
socket.onmessage=event=>{
  const message=JSON.parse(event.data)
  if(message.id&&pending.has(message.id)){const task=pending.get(message.id);pending.delete(message.id);message.error?task.reject(new Error(message.error.message)):task.resolve(message.result)}
  if(message.method==='Runtime.exceptionThrown')errors.push(message.params.exceptionDetails.text)
  if(message.method==='Runtime.bindingCalled'&&message.params.name==='motionFrame'){
    const label=message.params.payload
    screens.push(cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:false}).then(image=>fs.writeFile('artifacts/motion-frames/'+label+'.png',Buffer.from(image.data,'base64'))))
  }
}
function cdp(method,params={}){return new Promise((resolve,reject)=>{const next=++id;pending.set(next,{resolve,reject});socket.send(JSON.stringify({id:next,method,params}))})}
async function evaluate(expression){const response=await cdp('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(response.exceptionDetails)throw new Error(JSON.stringify(response.exceptionDetails));return response.result.value}
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms))
async function click(selector){
  const point=await evaluate('(()=>{const e=document.querySelector('+JSON.stringify(selector)+');e.scrollIntoView({block:"center",behavior:"instant"});const r=e.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}})()')
  await cdp('Input.dispatchMouseEvent',{type:'mousePressed',...point,button:'left',clickCount:1})
  await cdp('Input.dispatchMouseEvent',{type:'mouseReleased',...point,button:'left',clickCount:1})
}
async function key(value,code){const keyCode=value==='Enter'?13:27;await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:value,code,windowsVirtualKeyCode:keyCode,text:value==='Enter'?'\r':undefined});await cdp('Input.dispatchKeyEvent',{type:'keyUp',key:value,code,windowsVirtualKeyCode:keyCode})}
async function ready(){for(let i=0;i<100;i++){if(await evaluate('document.readyState==="complete"&&!!document.querySelector(".architecture")&&!!window.__heroSamples'))return;await sleep(100)}throw new Error('Hydration timeout')}
await cdp('Runtime.enable');await cdp('Page.enable')
await cdp('Runtime.addBinding',{name:'motionFrame'})
await cdp('Page.addScriptToEvaluateOnNewDocument',{source:`
  window.__motionRuns=[];window.__heroSamples=[];window.__layoutShifts=[];
  new PerformanceObserver(list=>window.__layoutShifts.push(...list.getEntries().filter(e=>!e.hadRecentInput).map(e=>e.value))).observe({type:'layout-shift',buffered:true});
  const native=Element.prototype.animate;
  Element.prototype.animate=function(frames,options){
    const animation=native.call(this,frames,options);
    window.__motionRuns.push({target:this.getAttribute('data-hero-motion')||this.className,duration:options?.duration,delay:options?.delay||0});
    if(this.getAttribute('data-hero-motion')==='status'&&!window.__heroScheduled){
      window.__heroScheduled=true;
      for(const ms of [120,420,950])setTimeout(()=>{
        window.__heroSamples.push({at:ms,items:[...document.querySelectorAll('[data-hero-motion]')].filter(e=>e.getClientRects().length).map(e=>({role:e.dataset.heroMotion,opacity:getComputedStyle(e).opacity,transform:getComputedStyle(e).transform}))});
        window.motionFrame(innerWidth+'-hero-'+ms);
      },ms);
    }
    return animation;
  };
`})
const report={viewports:[],workflows:[],hero:null,menu:null}
try{
  for(const [width,height]of [[1440,1000],[768,1024],[390,844],[320,740]]){
    await cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<768})
    await cdp('Emulation.setTouchEmulationEnabled',{enabled:width<768})
    await cdp('Page.navigate',{url:base});await ready();await sleep(1400)
    const hero=await evaluate('window.__heroSamples')
    assert.ok(hero.length>=3,'Hero samples exist at '+width)
    assert.ok(hero[0].items.some(item=>Number(item.opacity)>0&&Number(item.opacity)<1),'Hero visibly interpolates at '+width)
    assert.ok(hero.at(-1).items.every(item=>Number(item.opacity)===1),'Hero settles promptly at '+width)
    if(width===1440)report.hero=hero
    const entryCount=await evaluate('window.__motionRuns.length')
    // All supporting sections reveal on first visibility, not on every return.
    for(const selector of ['#about','#experience','#skills','#credentials','#contact']){
      await evaluate('document.querySelector('+JSON.stringify(selector)+').scrollIntoView({behavior:"instant"})');await sleep(1000)
    }
    const count=await evaluate('window.__motionRuns.length')
    assert.ok(count>entryCount,'Scroll entrances execute at '+width)
    await evaluate('document.querySelector("#skills").scrollIntoView({behavior:"instant"})');await sleep(600)
    const repeat=await evaluate('window.__motionRuns.filter(r=>typeof r.target==="string"&&r.target.includes("skill-group")).length')
    await evaluate('document.querySelector("#home").scrollIntoView({behavior:"instant"})')
    await evaluate('document.querySelector("#skills").scrollIntoView({behavior:"instant"})');await sleep(600)
    assert.equal(await evaluate('window.__motionRuns.filter(r=>typeof r.target==="string"&&r.target.includes("skill-group")).length'),repeat,'No repeated skill entrance')
    // Workflow stages and actual packet interpolation, with all architecture text retained.
    for(const project of ['ledgerguard','cloudops']){
      const selector='.'+project+'.architecture'
      await evaluate('document.querySelector('+JSON.stringify(selector)+').scrollIntoView({behavior:"instant"})');await sleep(100)
      if(await evaluate('document.querySelector('+JSON.stringify(selector)+').dataset.playing==="true"'))await click(selector+' .workflow-replay')
      await evaluate(`window.__stages=[];window.__stageObserver?.disconnect();window.__stageObserver=new MutationObserver(()=>window.__stages.push(Number(document.querySelector('${selector}').dataset.stage)));window.__stageObserver.observe(document.querySelector('${selector}'),{attributes:true,attributeFilter:['data-stage']})`)
      await click(selector+' .workflow-replay')
      await evaluate('window.__stages.unshift(Number(document.querySelector('+JSON.stringify(selector)+').dataset.stage))')
      await sleep(project==='cloudops'?1210:690)
      const packet=await evaluate('(()=>{const e=document.querySelector('+JSON.stringify(selector+' .workflow-packet')+');return {opacity:getComputedStyle(e).opacity,transform:getComputedStyle(e).transform}})()')
      assert.ok(Number(packet.opacity)>0,'Data packet visibly travels: '+project+' at '+width)
      const shot=await cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:false})
      await fs.writeFile('artifacts/motion-frames/'+project+'-'+width+'.png',Buffer.from(shot.data,'base64'))
      await sleep(3300)
      const flow=await evaluate('(()=>{const e=document.querySelector('+JSON.stringify(selector)+');return {stages:[...new Set(window.__stages)],playing:e.dataset.playing,stage:Number(e.dataset.stage),count:e.querySelectorAll(".workflow-stage-list li").length,status:e.querySelector("[role=status]").textContent}})()')
      assert.equal(flow.playing,'false');assert.equal(flow.stage,flow.count)
      assert.deepEqual(flow.stages,Array.from({length:flow.count+1},(_,i)=>i),'Ordered workflow '+project+' '+width)
      report.workflows.push({project,width,...flow,packet})
      // Mid-flight replay is cancellable and bounded.
      await click(selector+' .workflow-replay');await sleep(100);await click(selector+' .workflow-replay')
      const paused=await evaluate('document.querySelector('+JSON.stringify(selector)+').dataset.stage')
      await sleep(650);assert.equal(await evaluate('document.querySelector('+JSON.stringify(selector)+').dataset.stage'),paused)
      // Keyboard replay shows the final static explanation immediately.
      await evaluate('document.querySelector('+JSON.stringify(selector+' .workflow-replay')+').focus()')
      await key('Enter','Enter');await sleep(30)
      assert.equal(await evaluate('Number(document.querySelector('+JSON.stringify(selector)+').dataset.stage)'),flow.count)
      if(project==='cloudops'){
        await click(selector+' .workflow-choice:last-child')
        await click(selector+' .workflow-replay');await sleep(2300)
        assert.equal(await evaluate('document.querySelector('+JSON.stringify(selector)+').dataset.stage'),'4')
        assert.equal(await evaluate('document.querySelector('+JSON.stringify(selector)+').dataset.workflow'),'incident')
      }
    }
    await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]})
    await evaluate('document.querySelector("#home").scrollIntoView({behavior:"instant"})');await sleep(100)
    assert.equal(await evaluate('document.getAnimations().length'),0)
    assert.equal(await evaluate('[...document.querySelectorAll("[data-hero-motion]")].filter(e=>e.getClientRects().length).every(e=>getComputedStyle(e).opacity==="1")'),true)
    const overflow=await evaluate('document.documentElement.scrollWidth>document.documentElement.clientWidth')
    assert.equal(overflow,false)
    report.viewports.push({width,heroInterpolates:true,heroSettles:true,oneTimeReveals:true,reducedMotion:true,overflow:false,layoutShift:await evaluate('window.__layoutShifts.reduce((a,b)=>a+b,0)')})
    await cdp('Emulation.setEmulatedMedia',{features:[]})
  }
  // Normal menu entry/exit, rapid reversal, then keyboard immediate state.
  await cdp('Page.navigate',{url:base});await ready();await sleep(1200)
  await click('.menu-toggle');await sleep(70)
  const midway=await evaluate('(()=>{const e=document.querySelector(".mobile-navigation");return{opacity:getComputedStyle(e).opacity,transform:getComputedStyle(e).transform}})()')
  assert.ok(Number(midway.opacity)>0&&Number(midway.opacity)<1,'Menu interpolates')
  await click('.menu-toggle');await sleep(40);await click('.menu-toggle');await sleep(300)
  assert.equal(await evaluate('document.querySelectorAll(".mobile-navigation").length'),1)
  assert.equal(await evaluate('document.querySelector(".menu-toggle").getAttribute("aria-expanded")'),'true')
  await key('Escape','Escape')
  assert.equal(await evaluate('document.querySelector(".mobile-navigation")'),null)
  assert.equal(await evaluate('document.activeElement.classList.contains("menu-toggle")'),true)
  await key('Enter','Enter');await sleep(30)
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".mobile-navigation")).opacity'),'1')
  await key('Escape','Escape')
  report.menu={interpolation:midway,reversal:true,keyboardImmediate:true}
  assert.deepEqual(errors,[])
  const baseline=JSON.parse(await fs.readFile('artifacts/animation-content-baseline.json','utf8'))
  for(const[file,hash]of Object.entries(baseline))assert.equal(crypto.createHash('sha256').update(await fs.readFile(file)).digest('hex'),hash,'Verified content unchanged')
  report.contentHashesUnchanged=true;report.runtimeErrors=errors
  await Promise.all(screens)
  await fs.writeFile('artifacts/motion-report.json',JSON.stringify(report,null,2))
  console.log(JSON.stringify(report,null,2))
}finally{await fetch(debug+'/json/close/'+target.id).catch(()=>{});socket.close()}
