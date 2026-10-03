import {
  SiDocker,
  SiKubernetes,
  SiTerraform,
  SiGithubactions,
  SiLinux,
  SiPython,
  SiNginx,
  SiPrometheus,
  SiHelm,
  SiAnsible,
  SiJenkins,
  SiPostgresql,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";

export const skillCategories = [
  { id: "all", label: "All" },
  { id: "cloud", label: "Cloud & IaC" },
  { id: "containers", label: "Containers" },
  { id: "cicd", label: "CI/CD" },
  { id: "observability", label: "Observability & Networking" },
  { id: "systems", label: "Linux & Scripting" },
];

export const skills = [
  { name: "AWS", category: "cloud", level: "Production", icon: FaAws, description: "EC2, EKS, S3, RDS Multi-AZ, IAM, VPC networking, CloudWatch." },
  { name: "Terraform", category: "cloud", level: "Expert", icon: SiTerraform, description: "Modular IaC, remote state locking in S3/DynamoDB, automated plan checks." },
  { name: "Ansible", category: "cloud", level: "Advanced", icon: SiAnsible, description: "Idempotent playbooks for server provisioning and configuration." },
  { name: "Docker", category: "containers", level: "Expert", icon: SiDocker, description: "Multi-stage caching builds, image size reduction, Compose environments." },
  { name: "Kubernetes (EKS)", category: "containers", level: "Expert", icon: SiKubernetes, description: "Ingress controllers, HPA, zero-downtime rollouts, multi-AZ node groups." },
  { name: "Helm", category: "containers", level: "Advanced", icon: SiHelm, description: "Reusable charts, per-environment values, versioned releases and rollbacks." },
  { name: "GitHub Actions", category: "cicd", level: "Expert", icon: SiGithubactions, description: "Reusable workflows, matrix builds, OIDC to AWS, automated releases." },
  { name: "Jenkins", category: "cicd", level: "Advanced", icon: SiJenkins, description: "Declarative pipelines, shared libraries, SonarQube quality gates." },
  { name: "Prometheus & Grafana", category: "observability", level: "Advanced", icon: SiPrometheus, description: "Cluster metrics, custom dashboards, Alertmanager, SLA tracking." },
  { name: "Nginx", category: "observability", level: "Expert", icon: SiNginx, description: "Reverse proxying, TLS with Let's Encrypt, load balancing, rate limiting." },
  { name: "PostgreSQL & Redis Ops", category: "observability", level: "Advanced", icon: SiPostgresql, description: "RDS operations, backups, read replicas, query and cache tuning." },
  { name: "Linux & Bash", category: "systems", level: "Expert", icon: SiLinux, description: "Kernel tuning, SSH hardening, systemd services, shell automation." },
  { name: "Python", category: "systems", level: "Advanced", icon: SiPython, description: "Automation scripts, internal tooling, and cloud API integrations." },
];
