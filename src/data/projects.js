// Sources reviewed: repository READMEs and linked evaluation reports, November 2026.
// Metrics describe the documented test sets, not live customer performance.
export const projects = [
  {
    id: 'ledgerguard', number: '01', name: 'LedgerGuard',
    category: 'DOCUMENT AI / FINANCIAL CONTROLS',
    headline: 'Document AI with a deliberate approval boundary.',
    description: 'An accounts payable workflow that combines structured invoice extraction, deterministic validation, and authorized human review.',
    problem: 'Invoice formats vary, and extraction errors can become financial errors. An LLM’s confidence cannot authorize a payment.',
    decisions: [
      ['Separate extraction from authorization', 'PDF parsing and OCR feed structured extraction. Financial checks, three-way matching, and customer policy decide the route.'],
      ['Make review durable', 'PostgreSQL job leases, LangGraph checkpoints, tenant isolation, and an audit trail preserve workflow state. Human decisions are revalidated.'],
      ['Keep execution controlled', 'The AWS demonstration used shadow execution. Outbox and idempotency behavior were exercised with local/mock accounting adapters.']
    ],
    metrics: [['0', 'Wrong auto-approvals', '425 synthetic invoice tests'], ['225 / 225', 'Problem cases held', 'Stopped from auto-approval']],
    evaluation: 'Documented frozen test split using offline rules/OCR extraction. These results do not establish live LLM accuracy or real customer invoice performance.',
    limitation: 'Previously demonstrated on AWS ECS Fargate; the demo stack was decommissioned. Shadow mode recorded intended actions without posting QuickBooks Bills.',
    tags: ['Python', 'FastAPI', 'LangGraph', 'OpenAI', 'PostgreSQL / pgvector', 'React / TypeScript', 'ECS Fargate', 'Terraform', 'GitHub Actions OIDC'],
    github: 'https://github.com/Jithendra-Kantharaju/ledgerguard',
    report: 'https://github.com/Jithendra-Kantharaju/ledgerguard/blob/main/docs/reference-results/test-report.md',
    lanes: [
      { label: '01 / CLOUD ACCESS', steps: [['Review UI', 'CloudFront + private S3; Cognito sign-in'], ['Authenticated API', 'WAF → ALB → FastAPI on ECS Fargate'], ['Private data', 'RDS PostgreSQL + private invoice S3']] },
      { label: '02 / DOCUMENT WORKFLOW', steps: [['Durable worker', 'Postgres job queue → LangGraph worker'], ['Extract fields', 'PDF / OCR → structured extraction'], ['Validate & match', 'Totals + PO + receipt + tenant policy'], ['Route decision', 'Reject · human review · shadow approval']] }
    ],
    diagramNote: 'Review corrections return to the API for authorization and revalidation. Jobs, checkpoints, and audit events persist in PostgreSQL. External accounting execution stayed disabled in the cloud demo.'
  },
  {
    id: 'cloudops', number: '02', name: 'Enterprise CloudOps AI Platform',
    category: 'CLOUD PLATFORM / AGENTIC AIOPS',
    headline: 'From a commit to an observable, AI-assisted platform.',
    description: 'A microservices platform on AWS EKS with infrastructure as code, GitOps delivery, a RAG shopping assistant, and an incident diagnosis agent.',
    problem: 'Delivery, service health, and AI behavior need a shared operational foundation. Deploying a model is only part of making the system understandable.',
    decisions: [
      ['Declare delivery in Git', 'Modular Terraform provisions the AWS footprint. Parallel image builds update Kustomize manifests; ArgoCD reconciles the cluster.'],
      ['Separate the AI service', 'FastAPI serves the assistant independently of the Node.js gateway, with ChromaDB retrieval and on-topic guardrails.'],
      ['Measure before claiming reliability', 'Kira uses a LangGraph classify, select tool, correlate, and diagnose workflow. Fixed evaluations expose routing errors and over-refusal.']
    ],
    metrics: [['93.8%', 'Incident classification', '15 / 16 mocked scenarios'], ['95.5%', 'RAG refusal accuracy', '21 / 22 scored cases']],
    evaluation: 'Incident classification uses offline scenarios with mocked tool outputs. The RAG suite contains 26 cases, with 22 contributing to the refusal metric. One return-policy question was incorrectly refused.',
    limitation: 'The repository documents an EKS deployment; this portfolio does not imply a currently maintained live service. The Bedrock/Lambda integration is a separate optional live path, not the mocked evaluation path.',
    tags: ['AWS EKS', 'Terraform', 'GitHub Actions', 'ArgoCD', 'Kustomize', 'FastAPI', 'ChromaDB', 'LangGraph', 'Prometheus / Grafana', 'AWS Bedrock'],
    github: 'https://github.com/Jithendra-Kantharaju/enterprise-cloudops-ai-platform',
    report: 'https://github.com/Jithendra-Kantharaju/enterprise-cloudops-ai-platform/tree/main/projects/boutique-microservices/eval',
    lanes: [
      { label: '01 / BUILD & DELIVER', steps: [['GitHub Actions', 'Parallel builds for eight service images'], ['ECR + Git', 'Push images; update Kustomize tags'], ['ArgoCD → EKS', 'Reconcile desired state; self-heal drift']] },
      { label: '02 / APPLICATION & AI', steps: [['Storefront + gateway', 'React → Node.js / TypeScript'], ['Application services', 'Service APIs + PostgreSQL'], ['RAG assistant', 'FastAPI → ChromaDB → OpenAI / Anthropic']] },
      { label: '03 / OBSERVE & DIAGNOSE', steps: [['Service telemetry', 'Prometheus / Grafana; CloudWatch logs'], ['Kira · LangGraph', 'Classify → tool → correlate → diagnose'], ['Diagnosis + trace', 'Visible decisions; optional Slack notification']] }
    ],
    diagramNote: 'Kira reads logs, metrics, and service health through tools. Offline tests mock those tool outputs. An optional AWS Bedrock agent uses Lambda tools for the live AWS path.'
  }
]
