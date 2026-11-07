import { experience } from '@/data/portfolio'
import SectionHeading from './SectionHeading'

export default function Journey() {
  return <section id="experience" className="section container" tabIndex={-1}>
    <SectionHeading number="02" label="Professional experience" title="Built through hands-on work.">From cloud delivery and production operations to applied AI workflows.</SectionHeading>
    <div className="experience-list"><span className="timeline-line" aria-hidden="true" />{experience.map(item => <article className="experience-row" key={item.org}>
      <span className="timeline-milestone" aria-hidden="true" /><div className="experience-meta"><p className="caption-2">{item.period}</p><p className="caption-2">{item.location}</p>{item.current && <span className="current-badge caption-4">Current role</span>}</div>
      <div><h3 className="heading-5">{item.role}</h3><p className="experience-org title-3">{item.org}</p><ul className="experience-bullets body-6">{item.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul><ul className="tags" aria-label="Technologies">{item.tags.map(tag => <li key={tag}>{tag}</li>)}</ul></div>
    </article>)}</div>
  </section>
}
