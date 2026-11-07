import localFont from 'next/font/local'
import './globals.css'

const geist = localFont({ src: [
  { path: '../../public/fonts/geist-regular.ttf', weight: '400', style: 'normal' },
  { path: '../../public/fonts/geist-medium.ttf', weight: '500', style: 'normal' },
  { path: '../../public/fonts/geist-semibold.ttf', weight: '600', style: 'normal' }
], variable: '--font-geist', display: 'swap' })

export const metadata = {
  metadataBase: new URL('https://jithendra-kantharaju.site'),
  title: 'Jithendra Kantharaju | Cloud, DevOps & AI Engineer',
  description: 'US-based engineer working across DevOps, cloud infrastructure, reliability, and applied AI. Explore LedgerGuard, CloudOps, architecture, and evaluation evidence.',
  alternates: { canonical: '/' },
  keywords: ['Jithendra Kantharaju', 'DevOps Engineer', 'Cloud Engineer', 'SRE', 'Forward Deployed Engineer', 'AI Engineer', 'AWS', 'Kubernetes', 'Terraform'],
  openGraph: { title: 'Jithendra Kantharaju | Cloud, DevOps & AI Engineer', description: 'Cloud infrastructure. Reliable delivery. Applied AI.', url: '/', siteName: 'Jithendra Kantharaju', type: 'website', locale: 'en_US', images: [{ url: '/social-card.png', width: 1200, height: 630, alt: 'Jithendra Kantharaju — Cloud infrastructure. Reliable delivery. Applied AI.' }] },
  twitter: { card: 'summary_large_image', title: 'Jithendra Kantharaju | Cloud, DevOps & AI Engineer', description: 'Cloud infrastructure. Reliable delivery. Applied AI.', images: ['/social-card.png'] },
  icons: { icon: '/icon.svg' },
  robots: { index: true, follow: true }
}
export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#000000' }

export default function RootLayout({ children }) {
  return <html lang="en" className={geist.variable}><body>{children}</body></html>
}
