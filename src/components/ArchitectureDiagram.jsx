'use client'

import { useEffect, useRef, useState } from 'react'
import { workflows } from '@/data/workflows'

export default function ArchitectureDiagram({ project }) {
  const ref = useRef(null)
  const timer = useRef(null)
  const animations = useRef([])
  const reduce = useRef(false)
  const generation = useRef(0)
  const selectedRef = useRef(0)
  const [selected, setSelected] = useState(0)
  const [stage, setStage] = useState(-1)
  const [playing, setPlaying] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const flows = workflows[project.id]
  const flow = flows[selected]
  const finished = stage === flow.steps.length

  function invalidate() { generation.current++ }
  function stop() {
    invalidate()
    clearTimeout(timer.current)
    animations.current.forEach(animation => animation.cancel())
    animations.current = []
    setPlaying(false)
  }
  function nodeAt(address) {
    const lanes = ref.current.querySelectorAll('.diagram-lane')
    return lanes[address[0]]?.querySelectorAll('.diagram-node')[address[1]]
  }
  function packet(from, to) {
    if (!from || !to || from === to || from.parentElement !== to.parentElement) return
    const parent = ref.current.getBoundingClientRect()
    const a = from.getBoundingClientRect()
    const b = to.getBoundingClientRect()
    const vertical = b.top > a.bottom
    const x1 = (vertical ? a.left + a.width / 2 : a.right) - parent.left
    const y1 = (vertical ? a.bottom : a.top + a.height / 2) - parent.top
    const x2 = (vertical ? b.left + b.width / 2 : b.left) - parent.left
    const y2 = (vertical ? b.top : b.top + b.height / 2) - parent.top
    const indicator = ref.current.querySelector('.workflow-packet')
    indicator.style.left = x1 + 'px'
    indicator.style.top = y1 + 'px'
    const animation = indicator.animate([
      {opacity:0,transform:'translate(-50%, -50%)'},
      {opacity:1,offset:.2},
      {opacity:1,offset:.8},
      {opacity:0,transform:'translate(calc(-50% + ' + (x2-x1) + 'px), calc(-50% + ' + (y2-y1) + 'px))'}
    ], {duration:350,easing:getComputedStyle(ref.current).getPropertyValue('--ease-in-out').trim()})
    animations.current.push(animation)
  }
  function play(instant = false, index = selectedRef.current) {
    stop()
    document.dispatchEvent(new CustomEvent('portfolio:workflow', {detail:project.id}))
    const currentFlow = flows[index]
    if (instant || reduce.current) {
      setStage(currentFlow.steps.length)
      setAnnouncement(currentFlow.label + ': illustration complete. ' + currentFlow.steps.at(-1).detail)
      return
    }
    setStage(-1)
    setPlaying(true)
    setAnnouncement('')
    const run = generation.current
    function advance(position) {
      if (generation.current !== run) return
      if (position === currentFlow.steps.length) {
        timer.current = null
        setStage(position); setPlaying(false)
        setAnnouncement(currentFlow.label + ': illustration complete. ' + currentFlow.steps.at(-1).detail)
        return
      }
      setStage(position)
      const step = currentFlow.steps[position]
      if (position) packet(nodeAt(currentFlow.steps[position-1].node),nodeAt(step.node))
      timer.current = setTimeout(() => advance(position+1), step.duration || 520)
    }
    advance(0)
  }
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    function preference() { reduce.current = media.matches; if (media.matches) { stop(); setStage(-1) } }
    function other(event) { if (event.detail !== project.id) stop() }
    function onKeyboard() { if (timer.current) stop() }
    preference()
    let entered = false
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) { stop(); return }
      if (!entered) { entered = true; if (!media.matches && !document.documentElement.hasAttribute('data-keyboard')) play() }
    }), {threshold:0.12})
    observer.observe(ref.current)
    media.addEventListener('change',preference)
    document.addEventListener('portfolio:workflow',other)
    document.addEventListener('keydown',onKeyboard)
    function onHidden() { if (document.hidden) stop() }
    document.addEventListener('visibilitychange',onHidden)
    window.addEventListener('resize',stop)
    return () => {
      invalidate(); clearTimeout(timer.current)
      animations.current.forEach(animation=>animation.cancel())
      observer.disconnect(); media.removeEventListener('change',preference)
      document.removeEventListener('portfolio:workflow',other)
      document.removeEventListener('keydown',onKeyboard)
      document.removeEventListener('visibilitychange',onHidden)
      window.removeEventListener('resize',stop)
    }
    // Project identity and workflow data are stable for this mounted case study.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.id])

  function select(index) {
    stop(); selectedRef.current=index; setSelected(index); setStage(-1); setAnnouncement('')
  }
  const current = flow.steps[Math.min(Math.max(stage,0),flow.steps.length-1)]
  return <figure ref={ref} className={'architecture ' + project.id} data-workflow={flow.id} data-stage={stage} data-playing={playing} aria-labelledby={project.id + '-architecture-title'}>
    <div className="diagram-header">
      <figcaption id={project.id + '-architecture-title'} className="title-4">System architecture</figcaption>
      <button className="workflow-replay replay-button caption-4" onClick={event => playing ? stop() : play(event.detail === 0)}>{playing ? 'Pause illustration' : 'Replay illustration'}<span aria-hidden="true">↗</span></button>
    </div>
    <div className="workflow-controls" role="group" aria-label={project.name + ' architecture illustrations'}>
      {flows.map((item,index)=><button key={item.id} className="workflow-choice caption-4" aria-pressed={selected===index} onClick={()=>select(index)}>{item.label}</button>)}
    </div>
    <p className="workflow-disclaimer caption-2">{flow.description}</p>
    {project.lanes.map((lane,laneIndex)=><div className="diagram-lane" key={lane.label}>
      <p className="lane-label caption-4">{lane.label}</p>
      <ol tabIndex={-1} aria-label={lane.label} className={'diagram-steps steps-' + lane.steps.length}>
        {lane.steps.map(([title,detail],nodeIndex)=>{
          const matching = flow.steps.map((item,index)=>item.node[0]===laneIndex && item.node[1]===nodeIndex ? index : -1).filter(index=>index>=0)
          const active = matching.includes(stage)
          const complete = matching.length>0 && (finished || matching.at(-1)<stage)
          return <li className={'diagram-node' + (active?' is-current':'') + (complete?' is-complete':'')} key={title}>
            {nodeIndex > 0 && <span className="connection-segment" aria-hidden="true" />}
            <span className="flow-marker" aria-hidden="true" /><span className="node-index caption-4" aria-hidden="true">{String(nodeIndex+1).padStart(2,'0')}</span>
            <strong className="title-4">{title}</strong><span className="body-6">{detail}</span>
          </li>
        })}
      </ol>
    </div>)}
    <span className="workflow-packet" aria-hidden="true" />
    <div className="workflow-progress" role="group" aria-label={flow.label + ' sequence'}>
      <ol className="workflow-stage-list caption-4">{flow.steps.map((item,index)=><li key={item.label} className={stage===index?'is-current':(finished||stage>index)?'is-complete':''}><span aria-hidden="true">{index+1}.</span> {item.label}</li>)}</ol>
      <div className="workflow-explanation body-6" aria-hidden="true"><strong>{stage<0 ? 'Illustrated sequence' : finished ? 'Illustration complete' : current.label}</strong><span>{stage<0 ? 'Follow the numbered stages, or replay this workflow. No live requests or business actions are performed.' : current.detail}</span></div>
      <p className="sr-only" role="status">{announcement}</p>
    </div>
    <p className="diagram-note caption-2">{project.diagramNote}</p>
  </figure>
}
