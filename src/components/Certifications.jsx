import Image from 'next/image'
import { education, certifications } from '@/data/portfolio'
import SectionHeading from './SectionHeading'

export default function Certifications() {
  return <section id="credentials" className="section container" tabIndex={-1}>
    <SectionHeading number="05" label="Education & certifications" title="A foundation to keep building on." />
    <div className="education-list">{education.map(item => <article key={item.org}><p className="caption-2">{item.period} · {item.location}</p><h3 className="heading-5">{item.role}</h3><p className="title-3">{item.org}</p><p className="body-6">{item.bullets[0]}</p></article>)}</div>
    <div className="credentials-heading"><h3 className="title-1">Cloud & AI certifications</h3><p className="caption-2">AWS · Google Cloud · Azure · Oracle · Anthropic · Redis</p></div>
    <ul className="credentials-list">{certifications.map(cert => <li key={cert.name}><Image src={cert.img} alt="" width={48} height={48} className="cert-image" sizes="48px" /><div><p className="caption-4">{cert.issuer}</p><h4 className="title-4">{cert.name}</h4></div><span className="caption-2">{cert.year}</span></li>)}</ul>
  </section>
}
