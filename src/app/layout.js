import './globals.css'

export const metadata = {
  title: 'Jithendra Kantharaju — AI Engineer',
  description: 'AI Engineer | Forward Deployed Engineer | DevOps · Cloud · SRE · AIOps. Building LLM agents, RAG pipelines, and AIOps tooling on AWS EKS.',
  keywords: ['AI Engineer', 'DevOps', 'Cloud', 'AWS', 'LLM', 'RAG', 'Kubernetes', 'MLOps'],
  openGraph: {
    title: 'Jithendra Kantharaju — AI Engineer',
    description: 'AI Engineer building production LLM agents, RAG pipelines and AIOps tooling.',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body>{children}</body>
    </html>
  )
}