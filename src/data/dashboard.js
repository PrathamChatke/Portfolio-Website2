export const dashboardInitialState = {
  pipelineState: "idle",
  currentStep: 0,
  trafficSurge: false,
  podCount: 6,
  cpuUsage: 24,
  memoryUsage: 38,
  deploymentsCount: 148,
  requestsPerSec: 850,
};

export const initialLogs = [
  "[SYSTEM] AWS EKS Production Cluster: Healthy (us-east-1, Multi-AZ)",
  "[PROMETHEUS] P99 Latency: 16ms | Error Rate: 0.00% | SLA: 99.99%",
  "[INFO] Ready for automated zero-downtime deployment or traffic surge simulation.",
];

export const MAX_LOGS = 100;
export const MAX_PODS = 16;

export const fluctuation = {
  intervalMs: 2500,
  cpu: { step: 2, min: 18, max: 65 },
  memory: { step: 2, min: 30, max: 75 },
  rps: { step: 40, min: 650, max: 1200 },
};

export const workerNodes = [
  { id: "node-1", ip: "ip-10-0-1-42", name: "worker-node-01", az: "us-east-1a", podPrefix: 1 },
  { id: "node-2", ip: "ip-10-0-2-89", name: "worker-node-02", az: "us-east-1b", podPrefix: 10 },
];

export const pipelineStages = [
  { title: "SonarQube SAST", subtitle: "Security & Vulnerability Audit" },
  { title: "Docker Build", subtitle: "Multi-Stage Caching Build (78MB)" },
  { title: "Kubernetes Deploy", subtitle: "Helm Rolling Update on AWS EKS" },
  { title: "Health & Observability", subtitle: "Prometheus Metric Verification" },
];

export const PIPELINE_STEP_MS = 1500;

// Each step: when (in stepDuration units), what state to set, which logs, which sound.
export const pipelineSequence = [
  { at: 0, step: 0, sound: "click", logs: ["[CI/CD PIPELINE TRIGGERED] Starting automated production rollout…"] },
  { at: 1, step: 1, sound: "terminal", logs: ["[SAST] SonarQube scan completed: 0 vulnerabilities, 0 code smells."] },
  {
    at: 2,
    step: 2,
    logs: ["[DOCKER] Built optimized image: pratham-app:v2.5.0 (Alpine Linux, 78MB)", "[ECR] Image pushed to AWS Elastic Container Registry."],
  },
  {
    at: 3,
    step: 3,
    logs: [
      "[HELM] Upgraded release 'production-app' in namespace 'prod'.",
      "[KUBERNETES] Rolling replacement strategy executed without dropping connections.",
    ],
  },
  {
    at: 4,
    step: 4,
    complete: true,
    sound: "success",
    logs: ["[GRAFANA] HTTP 200 OK - P99 Latency: 14ms.", "[✓ SUCCESS] Version v2.5.0 deployed live to AWS EKS with 100% SLA!"],
  },
];

export const surgeSequence = [
  {
    at: 0,
    sound: "click",
    state: { trafficSurge: true, requestsPerSec: 10450, cpuUsage: 84, memoryUsage: 78 },
    logs: [
      "[ALERT: TRAFFIC SURGE] Inbound traffic spiked to 10,450 req/sec!",
      "[HPA] Horizontal Pod Autoscaler triggered: Scaling Pods from 6 ➔ 14 replicas…",
    ],
  },
  {
    at: 1800,
    sound: "terminal",
    state: { podCount: 14, cpuUsage: 42 },
    logs: [
      "[K8S CLUSTER] 14/14 Pods active across worker-node-01 and worker-node-02.",
      "[NGINX INGRESS] Load balanced across 14 replicas. CPU stabilizing to 42%.",
    ],
  },
  {
    at: 8000,
    sound: "success",
    state: { trafficSurge: false, requestsPerSec: 890, podCount: 6, cpuUsage: 26, memoryUsage: 39 },
    logs: ["[HPA] Traffic normalized. Gracefully scaled down to 6 base replicas (Zero dropped requests)."],
  },
];

export const dashboardLabels = {
  surgeIdle: "Simulate 10k Req/s Traffic Surge",
  surgeActive: "Surging 10k req/s (Auto-Scaling)…",
  pipeline: {
    idle: "Trigger CI/CD Deployment",
    running: "Running Pipeline…",
    completed: "Run Release Pipeline Again",
  },
};
