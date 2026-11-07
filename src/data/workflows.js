// Explanatory stages only. Original case-study content and results live unchanged in projects.js.
export const workflows = {
  ledgerguard: [{
    id: 'review', label: 'Invoice review route',
    description: 'Architecture illustration, not live processing. One exception route is shown; other invoices may be rejected or shadow-approved by policy.',
    steps: [
      { label: 'Invoice intake', node: [1,0], detail: 'A synthetic invoice enters the durable job queue.' },
      { label: 'AI extraction', node: [1,1], detail: 'PDF parsing or OCR feeds structured field extraction.' },
      { label: 'Policy validation', node: [1,2], detail: 'Deterministic rules check totals, vendor, currency, and customer policy.' },
      { label: 'Three-way matching', node: [1,2], detail: 'Invoice lines are matched to purchase orders and goods receipts.' },
      { label: 'Human review', node: [1,3], detail: 'This illustrated exception pauses for an authorized reviewer. Corrections and authorization are revalidated.', duration: 900 },
      { label: 'Auditable decision', node: [1,3], detail: 'The decision is audited in shadow mode. No QuickBooks Bill is posted.' }
    ]
  }],
  cloudops: [
    { id: 'delivery', label: 'Cloud delivery',
      description: 'Architecture illustration, not live deployment. Git drives delivery; observability describes the resulting platform.',
      steps: [
        { label: 'Git commit', node: [0,0], detail: 'An application change triggers the configured CI workflow.' },
        { label: 'GitHub Actions', node: [0,0], detail: 'Parallel builds package the service images.' },
        { label: 'Amazon ECR', node: [0,1], detail: 'Images are pushed and Kustomize image tags are updated in Git.' },
        { label: 'ArgoCD', node: [0,2], detail: 'ArgoCD reconciles the Git-declared state.' },
        { label: 'AWS EKS', node: [0,2], detail: 'Kubernetes runs the declared workloads.' },
        { label: 'Observability', node: [2,0], detail: 'Prometheus, Grafana, and CloudWatch make service health inspectable.' }
      ]
    },
    { id: 'incident', label: 'AI incident workflow',
      description: 'Architecture illustration, not a live incident. Documented offline evaluation used mocked tool outputs.',
      steps: [
        { label: 'CloudWatch / Prometheus / EKS', node: [2,0], detail: 'Logs, metrics, and service health provide diagnostic evidence.' },
        { label: 'LangGraph incident agent', node: [2,1], detail: 'Kira classifies intent, selects tools, gathers evidence, and correlates results.' },
        { label: 'Incident classification', node: [2,1], detail: 'The diagnosis category reflects the collected evidence; further tool calls can refine it.' },
        { label: 'Diagnostic summary / Slack alert', node: [2,2], detail: 'The agent exposes a diagnostic trace and can send a Slack notification.' }
      ]
    }
  ]
}
