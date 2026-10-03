export const terminalWelcome = [
  { type: "system", text: "Pratham's cloud shell (v2.6.0) — connected to eks-prod-us-east-1" },
  { type: "system", text: "Type 'help' or pick a command below." },
];

export const terminalShortcuts = ["whoami", "skills", "projects", "status", "deploy", "contact", "clear"];

export const terminalCommands = [
  { name: "help", description: "List available commands" },
  { name: "whoami", description: "Who I am and what I focus on" },
  { name: "skills", description: "Core DevOps & cloud stack" },
  { name: "projects", description: "Featured infrastructure case studies" },
  { name: "status", description: "Show simulated cluster node status" },
  { name: "deploy", description: "Run a simulated zero-downtime EKS release" },
  { name: "demo", description: "Jump to the live Mission Control simulator" },
  { name: "contact", description: "Jump to the contact form" },
  { name: "clear", description: "Clear the terminal" },
];

export const terminalResponses = {
  whoami: [
    "pratham.chatke — DevOps & Cloud Engineer",
    "Location: India (IST, UTC+5:30)",
    "Focus:    AWS · Kubernetes · Terraform · CI/CD · Observability",
  ],
  skills: [
    "CORE STACK:",
    "  Cloud & IaC:    AWS (EKS, EC2, RDS, VPC, IAM), Terraform, Ansible",
    "  Containers:     Docker, Kubernetes, Helm",
    "  CI/CD:          GitHub Actions, Jenkins, SonarQube",
    "  Observability:  Prometheus, Grafana, Alertmanager, ELK",
    "  Systems:        Linux, Bash, Python, Nginx",
  ],
  status: [
    "NAME             STATUS   ZONE         PODS   CPU",
    "worker-node-01   Ready    us-east-1a   3/3    24%",
    "worker-node-02   Ready    us-east-1b   3/3    22%",
  ],
  deploy: [
    "[+] Initializing CI/CD workflow: pratham-cloud-release…",
    "[+] SonarQube SAST: 0 vulnerabilities found.",
    "[+] Docker multi-stage build: pratham/app:latest (78MB).",
    "[+] Helm upgrade applied to AWS EKS production namespace.",
    "[✓] ZERO-DOWNTIME DEPLOYMENT LIVE! P99 Latency: 16ms.",
  ],
  demo: "[+] Opening Mission Control simulator…",
  contact: "[+] Opening contact form…",
};
