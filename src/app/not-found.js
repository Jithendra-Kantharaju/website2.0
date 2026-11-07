import Link from 'next/link'

export default function NotFound() {
  return <main className="container not-found"><p className="eyebrow">404 / Page not found</p><h1 className="heading-2">This route is not here.</h1><p className="body-3">Return to the portfolio to explore my engineering work.</p><Link href="/" className="button button-primary">Back to portfolio →</Link></main>
}
