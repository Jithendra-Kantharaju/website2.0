import { profile } from '@/data/portfolio'
import Arrow from './Arrow'

export default function Footer() {
  return <footer className="site-footer container"><div><a href="#home" className="footer-name title-3">{profile.name}</a><p className="caption-2">Cloud infrastructure. Reliable delivery. Applied AI.</p></div><div className="footer-links"><a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub <Arrow diagonal /></a><a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <Arrow diagonal /></a><a href="#home">Back to top ↑</a></div><p className="copyright caption-2">© {new Date().getFullYear()} Jithendra Kantharaju</p></footer>
}
