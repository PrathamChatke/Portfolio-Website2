import { FaCloud, FaCubes, FaCodeBranch, FaChartLine } from "react-icons/fa";

export const about = {
  paragraphs: [
    "I am a DevOps and Cloud Platform Engineer focused on architecting resilient, automated cloud infrastructure. My philosophy centers on eliminating manual toil, codifying entire environments in Terraform, and making production rollouts so predictable and reliable that releases are a non-event.",
    "My hands-on work bridges development and site reliability: provisioning multi-AZ AWS foundations, managing containerized microservices on Kubernetes (EKS), engineering zero-downtime CI/CD pipelines, and establishing observability that catches anomalies long before they impact users.",
  ],
  facts: [
    { label: "Based in", value: "India (IST, UTC+5:30)" },
    { label: "Primary Cloud", value: "AWS (Multi-AZ Architecture)" },
    { label: "Orchestration", value: "Kubernetes (AWS EKS)" },
    { label: "Infrastructure as Code", value: "Terraform · Ansible" },
    { label: "Delivery & GitOps", value: "GitHub Actions · Helm" },
    { label: "Observability Stack", value: "Prometheus · Grafana · Alertmanager" },
  ],
};

export const focusAreas = [
  {
    id: "cloud",
    icon: FaCloud,
    title: "Cloud Infrastructure & IaC",
    description: "Multi-AZ AWS environments defined entirely in code, reproducible from a single pipeline run.",
    points: ["Terraform modules with S3/DynamoDB state locking", "VPC networking, IAM least-privilege", "Ansible configuration management"],
  },
  {
    id: "containers",
    icon: FaCubes,
    title: "Containers & Kubernetes",
    description: "Right-sized container images and Kubernetes platforms that scale with traffic automatically.",
    points: ["Multi-stage Docker builds", "EKS, Helm charts, Ingress", "HPA auto-scaling and rolling updates"],
  },
  {
    id: "cicd",
    icon: FaCodeBranch,
    title: "CI/CD & Release Engineering",
    description: "Pipelines that test, scan, build, and deploy every change safely with zero downtime.",
    points: ["GitHub Actions & Jenkins", "SonarQube SAST gates", "Blue/Green and rolling deployments"],
  },
  {
    id: "observability",
    icon: FaChartLine,
    title: "Observability & Reliability",
    description: "Metrics, dashboards, and alerting that shorten time-to-detect and time-to-recover.",
    points: ["Prometheus & Grafana", "Alertmanager SLA alerts", "Cost and performance tuning"],
  },
];
