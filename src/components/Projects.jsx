import { projects } from '@/data/projects'
import SectionHeading from './SectionHeading'
import ArchitectureDiagram from './ArchitectureDiagram'
import Arrow from './Arrow'

const otherProjects = [
  ['DevSecOps Reference Infrastructure', 'Vault, Trivy, OPA policy gates, and runtime security.', 'devsecops-reference-infrastructure'],
  ['GitOps CI/CD Pipeline on AWS EKS', 'Infrastructure and application delivery in separate repositories.', 'GitOps-CICD-Pipeline-AWS-EKS-Actions'],
  ['Multi-Tier Cloud App on AWS', 'Jenkins, container scanning, and Terraform infrastructure.', 'Multi-Tier-Cloud-Application-AWS'],
  ['Detecting Voice Clones in Assistants', 'MFCC audio features and an SVM classification pipeline.', 'Detecting-Voice-Clones-in-Voice-Assistants']
]

export default function Projects() {
  return <section id="projects" className="section container" tabIndex={-1}>
    <SectionHeading number="03" label="Selected engineering" title="The systems. The decisions. The evidence.">Two projects at the intersection of cloud infrastructure, operational reliability, and applied AI.</SectionHeading>
    <div className="featured-projects">{projects.map(project => <article id={project.id} key={project.id} className={'project ' + project.id}>
      <div className="project-top"><p className="eyebrow"><span className="project-number">{project.number}</span>{project.category}</p><a className="text-link" href={project.github} target="_blank" rel="noopener noreferrer">Repository <Arrow diagonal /><span className="sr-only"> for {project.name}</span></a></div>
      <div className="project-intro"><h3 className="heading-3">{project.name}</h3><div><p className="title-1">{project.headline}</p><p className="body-6">{project.description}</p></div></div>
      <ArchitectureDiagram project={project} />
      <div className="project-details"><div className="project-problem"><h4 className="eyebrow">The problem</h4><p className="body-3">{project.problem}</p><h4 className="eyebrow stack-label">Built with</h4><ul className="tags">{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul></div><div><h4 className="eyebrow">Engineering decisions</h4><ol className="decision-list">{project.decisions.map(([title, description], index) => <li key={title}><span className="caption-4" aria-hidden="true">0{index + 1}</span><div><h5 className="title-3">{title}</h5><p className="body-6">{description}</p></div></li>)}</ol></div></div>
      <div className="project-evaluation"><div className="evaluation-numbers">{project.metrics.map(([value, label, context]) => <div key={label}><p className="heading-3 metric-value">{value}</p><p className="title-4">{label}</p><p className="caption-2">{context}</p></div>)}</div><div className="evaluation-context"><h4 className="eyebrow">Evaluation, with context</h4><p className="body-6">{project.evaluation}</p><a className="text-link" href={project.report} target="_blank" rel="noopener noreferrer">Read evaluation evidence <Arrow diagonal /><span className="sr-only"> for {project.name}</span></a></div></div>
      <p className="project-limitation caption-2"><strong>Scope & status.</strong> {project.limitation}</p>
    </article>)}</div>
    <details className="more-projects"><summary className="title-3">More engineering work <span aria-hidden="true">+</span></summary><div>{otherProjects.map(([title, description, repo]) => <a href={'https://github.com/Jithendra-Kantharaju/' + repo} key={repo} target="_blank" rel="noopener noreferrer"><div><h3 className="title-3">{title}</h3><p className="body-6">{description}</p></div><Arrow diagonal /></a>)}</div></details>
  </section>
}
