import {
  SiDocker,
  SiKubernetes,
  SiTerraform,
  SiGithubactions,
  SiPrometheus,
  SiGrafana,
  SiHelm,
  SiLinux,
  SiAnsible,
  SiNginx,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";

export const hero = {
  status: "All systems operational",
  badge: "Platform & DevOps Engineering",
  intro: "Pratham Chatke — DevOps & Cloud Platform Engineer",
  headline: "Engineering resilient cloud platforms, Kubernetes systems & automated delivery.",
  bio: "I design, automate, and operate production infrastructure on AWS — provisioning multi-AZ architectures with Terraform, orchestrating container workloads on EKS, and building GitOps CI/CD pipelines backed by comprehensive observability.",
  primaryCta: { label: "View Projects & Architecture", target: "projects" },
  secondaryCta: { label: "Get in Touch", target: "contact" },
  toolingLabel: "Production Tooling & Cloud Technologies",
};

export const heroStats = [
  { value: "99.99%", label: "Uptime maintained" },
  { value: "70%", label: "Faster release cycles" },
  { value: "40%", label: "Cloud cost reduction" },
];

export const heroTooling = [
  { name: "AWS", icon: FaAws },
  { name: "Kubernetes", icon: SiKubernetes },
  { name: "Docker", icon: SiDocker },
  { name: "Terraform", icon: SiTerraform },
  { name: "Helm", icon: SiHelm },
  { name: "GitHub Actions", icon: SiGithubactions },
  { name: "Ansible", icon: SiAnsible },
  { name: "Prometheus", icon: SiPrometheus },
  { name: "Grafana", icon: SiGrafana },
  { name: "Nginx", icon: SiNginx },
  { name: "Linux", icon: SiLinux },
];
