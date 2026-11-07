import { skills } from '@/data/portfolio'
import SectionHeading from './SectionHeading'

export default function Skills() {
  return <section id="skills" className="section container" tabIndex={-1}>
    <SectionHeading number="04" label="Technical skills" title="A toolkit for the whole system.">Infrastructure, delivery, observability, and the AI layer above them.</SectionHeading>
    <div className="skills-grid">{skills.map((category, index) => <div className="skill-group" key={category.name}><span className="caption-4 skill-number">0{index + 1}</span><div><h3 className="title-2">{category.name}</h3><p className="body-6">{category.skills.join(' · ')}</p></div></div>)}</div>
  </section>
}
