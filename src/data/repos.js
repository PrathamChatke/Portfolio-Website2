export const GITHUB_USERNAME = "PrathamChatke";
const PROFILE = `https://github.com/${GITHUB_USERNAME}`;

// Shown when the GitHub API is unavailable or rate limited.
export const fallbackRepos = [
  {
    id: "fallback-1",
    name: "DevOps-CI-CD-Pipeline",
    description: "End-to-end CI/CD pipeline with GitHub Actions, Docker multi-stage builds, and Helm deployments to AWS EKS.",
    language: "HCL / Shell",
    stargazers_count: 12,
    forks_count: 5,
    html_url: PROFILE,
    homepage: PROFILE,
  },
  {
    id: "fallback-2",
    name: "Kubernetes-Observability-Stack",
    description: "Prometheus Operator, Grafana dashboards, and Alertmanager SLA alerting for Kubernetes clusters.",
    language: "YAML / Go",
    stargazers_count: 18,
    forks_count: 7,
    html_url: PROFILE,
    homepage: PROFILE,
  },
  {
    id: "fallback-3",
    name: "Terraform-AWS-MultiAZ-Infra",
    description: "Reusable Terraform modules for a multi-AZ AWS VPC, IAM, and S3/DynamoDB remote state.",
    language: "Terraform",
    stargazers_count: 24,
    forks_count: 9,
    html_url: PROFILE,
    homepage: PROFILE,
  },
  {
    id: "fallback-4",
    name: "FullStack-Containerized-Web-App",
    description: "React, Node.js, and PostgreSQL platform with a one-command Docker Compose environment.",
    language: "JavaScript",
    stargazers_count: 15,
    forks_count: 4,
    html_url: PROFILE,
    homepage: PROFILE,
  },
];

export const repoSortOptions = [
  { value: "updated", label: "Recently updated" },
  { value: "stars", label: "Most stars" },
  { value: "name", label: "Name (A–Z)" },
];
