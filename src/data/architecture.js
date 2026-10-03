import { FaShieldAlt, FaNetworkWired, FaDatabase } from "react-icons/fa";
import { SiKubernetes } from "react-icons/si";

export const architectureNodes = [
  {
    title: "1. Edge CDN & WAF",
    tech: "Cloudflare & AWS Route 53",
    badge: "Edge Security",
    icon: FaShieldAlt,
    metrics: "Edge Response: 14ms | DDoS Shield: Active",
    description:
      "Global DNS resolution, SSL/TLS termination, and anti-DDoS rate-limiting delivering sub-20ms edge response times globally.",
    keyFeatures: [
      "Anycast DNS routing with Route 53 health-check failover",
      "Cloudflare WAF with OWASP Core Ruleset and rate-limiting",
      "TLS 1.3 strict enforcement and HTTP/3 support at the edge",
    ],
    snippetLanguage: "hcl",
    snippetTitle: "route53_latency_routing.tf",
    snippet: `resource "aws_route53_record" "apex" {
  zone_id = aws_route53_zone.primary.zone_id
  name    = "api.prathamchatke.dev"
  type    = "A"

  latency_routing_policy {
    region = "us-east-1"
  }

  alias {
    name                   = aws_lb.ingress.dns_name
    zone_id                = aws_lb.ingress.zone_id
    evaluate_target_health = true
  }
}`,
  },
  {
    title: "2. Load Balancer & Ingress",
    tech: "AWS ALB & Nginx Proxy",
    badge: "Traffic Routing",
    icon: FaNetworkWired,
    metrics: "HTTP/2 Enabled | Auto-SSL | Zero Connection Drops",
    description:
      "Distributes incoming traffic across multi-AZ Kubernetes worker nodes with automated Let's Encrypt TLS certificate rotation.",
    keyFeatures: [
      "AWS ALB Controller synchronizing Ingress objects directly",
      "cert-manager automated ACME Let's Encrypt renewal into Secrets",
      "Connection draining (30s Deregistration Delay) for zero drops",
    ],
    snippetLanguage: "yaml",
    snippetTitle: "ingress-production.yaml",
    snippet: `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: production-ingress
  annotations:
    kubernetes.io/ingress.class: alb
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/target-type: ip
    alb.ingress.kubernetes.io/listen-ports: '[{"HTTPS":443}]'
    alb.ingress.kubernetes.io/ssl-policy: ELBSecurityPolicy-TLS13-1-2-2021-06
spec:
  rules:
    - host: api.prathamchatke.dev
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: app-service
                port:
                  number: 80`,
  },
  {
    title: "3. Kubernetes App Cluster",
    tech: "AWS EKS & Helm & Docker",
    badge: "Container Orchestration",
    icon: SiKubernetes,
    metrics: "Zero-Downtime Rollouts | HPA 70% CPU Threshold",
    description: "Containerized microservices with HPA scaling dynamically from 3 to 20 replicas under traffic bursts.",
    keyFeatures: [
      "Multi-AZ managed node groups across us-east-1a and us-east-1b",
      "HorizontalPodAutoscaler targeting 70% CPU utilization threshold",
      "PodDisruptionBudget ensuring minAvailable: 80% during node drains",
    ],
    snippetLanguage: "yaml",
    snippetTitle: "hpa-deployment.yaml",
    snippet: `apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: production-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: production-app
  minReplicas: 6
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300`,
  },
  {
    title: "4. Database & Caching",
    tech: "AWS RDS PostgreSQL & Redis",
    badge: "Data Persistence",
    icon: FaDatabase,
    metrics: "99.999% SLA | Automated Daily S3 Snapshots",
    description:
      "Multi-AZ relational database with automated read-replicas and an in-memory Redis cluster for sub-5ms query caching.",
    keyFeatures: [
      "Multi-AZ synchronous replication with 60-second automated failover",
      "ElastiCache Redis cluster for sub-5ms session & query caching",
      "KMS-encrypted storage with automated point-in-time recovery",
    ],
    snippetLanguage: "hcl",
    snippetTitle: "rds_multi_az.tf",
    snippet: `resource "aws_db_instance" "production" {
  identifier           = "prod-postgres-cluster"
  engine               = "postgres"
  engine_version       = "16.2"
  instance_class       = "db.r6g.xlarge"
  multi_az             = true
  allocated_storage    = 100
  storage_encrypted    = true
  kms_key_id           = aws_kms_key.database.arn
  backup_retention_period = 30
  auto_minor_version_upgrade = true
  deletion_protection = true
}`,
  },
];
