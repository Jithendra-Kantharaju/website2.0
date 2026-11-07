export default function SectionHeading({ number, label, title, children = null }) {
  return <div className="section-heading">
    <p className="eyebrow"><span className="section-number">{number}</span>{label}</p>
    <h2 className="heading-2">{title}</h2>
    {children && <p className="section-description body-3">{children}</p>}
  </div>
}
