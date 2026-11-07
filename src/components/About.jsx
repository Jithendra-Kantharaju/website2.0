import SectionHeading from './SectionHeading'
import Tagline from './Tagline'

export default function About() {
  return <section id="about" className="section container" tabIndex={-1}>
    <SectionHeading number="01" label="About" title="An infrastructure mindset. An applied AI focus." />
    <div className="about-grid">
      <div className="prose body-3"><p>I’m an engineer with a background in DevOps, cloud infrastructure, and technical operations in India and the United States. I work across Terraform, Kubernetes, delivery pipelines, and observability, with a growing focus on AI systems.</p><p>Today, I build document processing workflows, retrieval systems, and incident diagnosis agents. I care about the decisions around the model: how a system is deployed, how it fails, what gets measured, and when a person needs to stay in control.</p><p>I’m pursuing an MS in Computer Engineering at the University of South Florida and working as an AI Systems Engineer at Face Friends Foundation.</p></div>
      <dl className="about-facts"><div><dt className="caption-4">Background</dt><dd className="title-3">DevOps → cloud → applied AI</dd></div><div><dt className="caption-4">Current work</dt><dd className="title-3">AI Systems Engineer<br /><span>Face Friends Foundation</span></dd></div><div><dt className="caption-4">Looking ahead</dt><dd className="title-3">DevOps, Cloud, SRE,<br />Forward Deployed & AI Engineering</dd></div></dl>
    </div>
    <Tagline />
  </section>
}
