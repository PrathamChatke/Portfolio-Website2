const GITHUB = "https://github.com/PrathamChatke";

export const projectCategories = [
  { id: "all", label: "All" },
  { id: "cicd", label: "CI/CD" },
  { id: "kubernetes", label: "Kubernetes & Observability" },
  { id: "iac", label: "Infrastructure as Code" },
  { id: "containers", label: "Containers" },
];

// TODO: point github/live at the real repositories and demos.
export const featuredProjects = [
  {
    id: 1,
    category: "cicd",
    title: "Zero-Downtime CI/CD & EKS Deployment",
    description:
      "Automated release pipeline that builds, scans, and ships containers to AWS EKS using Helm Blue/Green rollouts.",
    metric: "70% Faster Releases",
    tech: ["GitHub Actions", "Docker", "AWS EKS", "Helm", "Nginx"],
    github: GITHUB,
    live: GITHUB,
    details: {
      challenge: "Manual deployments caused up to 45 minutes of downtime on every release.",
      solution: "Multi-stage Docker builds plus Helm Blue/Green deployments on AWS EKS, fully automated through GitHub Actions.",
      result: "Release window cut from 45 minutes to under 3 minutes with zero downtime.",
    },
  },
  {
    id: 2,
    category: "kubernetes",
    title: "Kubernetes Observability & Auto-Scaling",
    description: "Full observability stack with SLA alerting and Horizontal Pod Autoscaling for traffic spikes.",
    metric: "99.99% Uptime SLA",
    tech: ["Kubernetes", "Prometheus", "Grafana", "Alertmanager", "Helm"],
    github: GITHUB,
    live: GITHUB,
    details: {
      challenge: "No cluster visibility at peak traffic meant pod crashes went undetected.",
      solution: "Prometheus Operator and Grafana dashboards with SLA alerts routed to Discord/Slack.",
      result: "99.99% uptime achieved and MTTR reduced by 80%.",
    },
  },
  {
    id: 3,
    category: "iac",
    title: "Terraform Multi-AZ Cloud Infrastructure",
    description: "Reusable Terraform modules provisioning a secure, multi-AZ AWS foundation with remote state locking.",
    metric: "40% Cloud Cost Savings",
    tech: ["Terraform", "AWS VPC", "S3", "IAM", "DynamoDB"],
    github: GITHUB,
    live: GITHUB,
    details: {
      challenge: "Infrastructure drift from manual AWS console configuration.",
      solution: "Reusable Terraform modules, S3 remote state with DynamoDB locking, and CI plan checks on every pull request.",
      result: "Identical staging environments provisioned in 10 minutes with no manual console errors.",
    },
  },
  {
    id: 4,
    category: "containers",
    title: "Containerized Environment Parity Platform",
    description: "Multi-service application stack containerized with Docker Compose so local, CI, and production environments match exactly.",
    metric: "5-min Onboarding",
    tech: ["Docker", "Docker Compose", "Nginx", "PostgreSQL", "GitHub Actions"],
    github: GITHUB,
    live: GITHUB,
    details: {
      challenge: "\"Works on my machine\" bugs slowed every release.",
      solution: "A single-command `docker-compose up` environment that mirrors production.",
      result: "Developers onboarded in 5 minutes with 100% environment parity.",
    },
  },
];

export const caseStudyLabels = {
  challenge: "The Technical Challenge",
  solution: "Architectural Solution",
  result: "Measured Business Outcome",
};
