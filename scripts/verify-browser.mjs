// Dependency-free Chrome DevTools Protocol harness. Requires Node 22+ and
// headless Chrome on port 9333; run scripts/serve-preview.mjs after npm run build.
import fs from 'node:fs/promises'
import { createRequire } from 'node:module'
import assert from 'node:assert/strict'
const require = createRequire(import.meta.url)
const origin = process.env.PREVIEW_URL || 'http://localhost:3000'
const debug = process.env.CHROME_DEBUG_URL || 'http://127.0.0.1:9333'
await fs.mkdir('artifacts', { recursive: true })
const target = await (await fetch(debug + '/json/new?about:blank', { method: 'PUT' })).json()
const socket = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject })
let nextId = 0
const pending = new Map()
const errors = []
socket.onmessage = event => {
  const message = JSON.parse(event.data)
  if (message.id) {
    const task = pending.get(message.id)
    if (task) { pending.delete(message.id); message.error ? task.reject(new Error(message.error.message)) : task.resolve(message.result) }
  }
  if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text)
}
function cdp(method, params = {}) {
  return new Promise((resolve, reject) => { const id = ++nextId; pending.set(id, { resolve, reject }); socket.send(JSON.stringify({ id, method, params })) })
}
async function evaluate(expression) {
  const response = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (response.exceptionDetails) throw new Error(JSON.stringify(response.exceptionDetails))
  return response.result.value
}
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
async function key(key, code, modifiers = 0) {
  await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key, code, modifiers })
  await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key, code, modifiers })
}
async function click(selector) {
  const point = await evaluate('(() => { const el=document.querySelector(' + JSON.stringify(selector) + '); el.scrollIntoView({block:"center"}); const r=el.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2} })()')
  await cdp('Input.dispatchMouseEvent', { type: 'mousePressed', ...point, button: 'left', clickCount: 1 })
  await cdp('Input.dispatchMouseEvent', { type: 'mouseReleased', ...point, button: 'left', clickCount: 1 })
}
async function fill(selector, value) {
  await evaluate('document.querySelector(' + JSON.stringify(selector) + ').focus()')
  await cdp('Input.insertText', { text: value })
}
await cdp('Runtime.enable')
await cdp('Page.enable')
await cdp('Network.enable')
const requests = []
socket.addEventListener('message', event => {
  const message = JSON.parse(event.data)
  if (message.method === 'Network.requestWillBeSent') requests.push(message.params.request.url)
})
const results = []
const axe = await fs.readFile(require.resolve('axe-core/axe.min.js'), 'utf8')
try {
  for (const [width, height] of [[1440,1000], [1024,900], [768,1024], [390,844], [320,740]]) {
    await cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 768 })
    await cdp('Page.navigate', { url: origin })
    for (let i=0; i<60; i++) { if (await evaluate('document.readyState === "complete" && !!document.querySelector("#contact")')) break; await sleep(100) }
    await evaluate('document.fonts.ready.then(() => true)')
    await evaluate('Promise.all([...document.images].map(image => { image.loading = "eager"; return image.decode().catch(() => null) }))')
    await sleep(1200)
    const layout = await evaluate(`(() => ({
      width:innerWidth, clientWidth:document.documentElement.clientWidth, scrollWidth:document.documentElement.scrollWidth,
      h1:document.querySelectorAll('h1').length,
      brokenImages:[...document.images].filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.src),
      missingAnchors:[...document.querySelectorAll('a[href^="#"]')].filter(a=>!document.getElementById(a.hash.slice(1))).map(a=>a.hash),
      primaryVisible:document.querySelector('.hero-actions .button-primary').getBoundingClientRect().bottom<=innerHeight,
      font:getComputedStyle(document.body).fontFamily
    }))()`)
    assert.equal(layout.scrollWidth, layout.clientWidth, 'Horizontal overflow at ' + width)
    assert.equal(layout.h1, 1)
    assert.deepEqual(layout.brokenImages, [])
    assert.deepEqual(layout.missingAnchors, [])
    assert.equal(layout.primaryVisible, true, 'Primary contact action below first screen at ' + width)
    await evaluate(axe)
    const accessibility = await evaluate(`axe.run(document, {runOnly:{type:'tag', values:['wcag2a','wcag2aa','wcag21aa']}}).then(r=>({violations:r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)})),passes:r.passes.length,incomplete:r.incomplete.map(v=>v.id)}))`)
    assert.deepEqual(accessibility.violations, [], 'Accessibility violations at ' + width + ': ' + JSON.stringify(accessibility.violations))
    const shot = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
    await fs.writeFile('artifacts/viewport-' + width + '.png', Buffer.from(shot.data, 'base64'))
    const full = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x:0,y:0,width,height:await evaluate('document.documentElement.scrollHeight'),scale:1 } })
    await fs.writeFile('artifacts/page-' + width + '.png', Buffer.from(full.data, 'base64'))
    if (width === 1440 || width === 390) {
      for (const section of ['ledgerguard', 'cloudops', 'credentials', 'contact']) {
        await evaluate('document.querySelector("#' + section + '").scrollIntoView({block:"start"})')
        await sleep(250)
        const image = await cdp('Page.captureScreenshot', {format:'png',captureBeyondViewport:false})
        await fs.writeFile('artifacts/' + section + '-' + width + '.png',Buffer.from(image.data,'base64'))
      }
    }
    results.push({ viewport: width+'x'+height, ...layout, accessibility })
  }
  // Menu focus, focus trap, Escape, anchor navigation and scroll unlocking.
  await cdp('Emulation.setDeviceMetricsOverride', { width:390,height:844,deviceScaleFactor:1,mobile:true })
  await cdp('Page.navigate', { url:origin })
  await sleep(1200)
  await key('Tab','Tab')
  assert.equal(await evaluate('document.activeElement.classList.contains("skip-link")'),true)
  await key('Enter','Enter')
  assert.equal(await evaluate('document.activeElement.id'),'main')
  await click('.menu-toggle')
  assert.equal(await evaluate('document.querySelector(".menu-toggle").getAttribute("aria-expanded")'), 'true')
  assert.equal(await evaluate('document.activeElement.textContent.includes("About")'), true)
  await sleep(300) // Evaluate settled menu contrast; motion interpolation is tested separately.
  await evaluate(axe)
  const menuAxe = await evaluate('axe.run(document,{runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21aa"]}}).then(r=>r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})))')
  assert.deepEqual(menuAxe,[],'Mobile navigation accessibility')
  const menuImage = await cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:false})
  await fs.writeFile('artifacts/menu-390.png',Buffer.from(menuImage.data,'base64'))
  await evaluate('document.querySelector("#mobile-navigation a:last-of-type").focus()')
  await key('Tab','Tab')
  assert.equal(await evaluate('document.activeElement.classList.contains("menu-toggle")'), true)
  await key('Tab','Tab',8)
  assert.equal(await evaluate('document.activeElement === document.querySelector("#mobile-navigation a:last-of-type")'), true)
  await key('Escape','Escape')
  assert.equal(await evaluate('document.querySelector(".menu-toggle").getAttribute("aria-expanded")'), 'false')
  assert.equal(await evaluate('document.activeElement.classList.contains("menu-toggle")'), true)
  await click('.menu-toggle')
  await click('#mobile-navigation a[href="#projects"]')
  await sleep(200)
  assert.equal(await evaluate('document.activeElement.id'), 'projects')
  assert.equal(await evaluate('document.body.style.overflow'), '')
  // Form verification uses intercepted EmailJS responses; no real message is sent.
  await cdp('Fetch.enable', { patterns: [{urlPattern:'*api.emailjs.com*'}] })
  let emailResponse = 'success'
  let emailRequests = 0
  socket.addEventListener('message', async event => {
    const message = JSON.parse(event.data)
    if (message.method === 'Fetch.requestPaused') {
      emailRequests++
      const success=emailResponse==='success'
      await cdp('Fetch.fulfillRequest', { requestId:message.params.requestId,responseCode:success?200:500,responseHeaders:[{name:'Access-Control-Allow-Origin',value:'*'},{name:'Access-Control-Allow-Methods',value:'POST, OPTIONS'},{name:'Access-Control-Allow-Headers',value:'Content-Type'},{name:'Content-Type',value:'text/plain'}],body:Buffer.from(success?'OK':'Test failure').toString('base64') })
    }
  })
  await click('.contact-form button[type="submit"]')
  assert.equal(await evaluate('document.querySelector("#contact-name").validity.valueMissing'), true)
  await fill('#contact-name','Portfolio verification')
  await fill('#contact-email','portfolio-test@example.com')
  await fill('#contact-message','Local automated verification. Network delivery is intercepted.')
  await click('.contact-form button[type="submit"]')
  await sleep(900)
  const formState = await evaluate('document.querySelector(".form-status").textContent')
  const configured = !formState.includes('unavailable')
  if (configured) {
    assert.ok(formState.includes('Message sent'), formState + '; intercepted requests: ' + emailRequests)
    emailResponse='error'
    await fill('#contact-name','Portfolio verification')
    await fill('#contact-email','portfolio-test@example.com')
    await fill('#contact-message','Intercepted failure response.')
    await click('.contact-form button[type="submit"]')
    await sleep(900)
    assert.equal(await evaluate('document.querySelector(".form-status").textContent.includes("could not be sent")'), true)
  } else assert.ok(formState.includes('email link'))
  await cdp('Fetch.disable')
  // A finite workflow trace under 4x CPU throttling. This is a desktop
  // simulation, not a claim about physical mobile GPU performance.
  await cdp('Page.navigate', {url:origin})
  await sleep(600)
  await cdp('Emulation.setCPUThrottlingRate', {rate:4})
  const performanceSample = await evaluate(`new Promise(resolve => {
    const gaps=[]; let last=0; let frames=0;
    const longTasks=[];
    const observer=new PerformanceObserver(list=>longTasks.push(...list.getEntries().map(e=>e.duration)));
    observer.observe({type:'longtask',buffered:false});
    document.querySelector('#cloudops').scrollIntoView();
    function frame(time) {
      if(last)gaps.push(time-last); last=time; frames++;
      if(frames<150)requestAnimationFrame(frame);
      else {
        observer.disconnect(); gaps.sort((a,b)=>a-b);
        resolve({cpuThrottle:4,frames:gaps.length,p95FrameGapMs:gaps[Math.floor(gaps.length*.95)],maxFrameGapMs:Math.max(...gaps),longTasksMs:longTasks,remainingAnimations:document.getAnimations().length});
      }
    }
    requestAnimationFrame(frame);
  })`)
  await cdp('Emulation.setCPUThrottlingRate', {rate:1})
  await sleep(2200)
  performanceSample.remainingAnimations = await evaluate('document.getAnimations().length')
  assert.equal(performanceSample.remainingAnimations,0,'Workflow should finish without continuous animation')
  // Reduced motion leaves every diagram and statement readable.
  await cdp('Emulation.setEmulatedMedia', { features: [{name:'prefers-reduced-motion',value:'reduce'}] })
  await cdp('Page.navigate', {url:origin})
  await sleep(800)
  await evaluate('document.querySelector("#cloudops").scrollIntoView()')
  await sleep(300)
  assert.equal(await evaluate('document.getAnimations().length'), 0)
  assert.equal(await evaluate('[...document.querySelectorAll("[data-word]")].every(e=>getComputedStyle(e).opacity==="1")'), true)
  assert.equal(await evaluate('document.querySelector(".architecture").dataset.playing'), 'false')
  // No-JS document retains primary content.
  await cdp('Emulation.setScriptExecutionDisabled',{value:true})
  await cdp('Page.navigate',{url:origin})
  await sleep(500)
  assert.equal(await evaluate('document.querySelector("#hero-title").textContent.includes("Cloud infrastructure")'),true)
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".hero-actions")).opacity'), '1')
  await cdp('Emulation.setScriptExecutionDisabled',{value:false})
  assert.deepEqual(errors, [], 'Browser runtime exceptions')
  assert.equal(requests.some(url=>/\/frames\/|hero-fwd|hero-rev|fonts.googleapis/.test(url)),false)
  const report={results,menu:'passed',form:{configured,interceptedRequests:emailRequests,realMessagesSent:0},performanceSample,reducedMotion:'passed',noJavaScript:'passed',runtimeErrors:errors}
  await fs.writeFile('artifacts/browser-report.json',JSON.stringify(report,null,2))
  console.log(JSON.stringify(report,null,2))
} finally {
  await fetch(debug+'/json/close/'+target.id).catch(()=>{})
  socket.close()
}
