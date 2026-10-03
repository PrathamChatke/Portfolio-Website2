import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaBolt, FaMicrochip, FaCubes, FaRocket, FaCheckCircle, FaSpinner, FaServer } from "react-icons/fa";
import {
  dashboardInitialState,
  dashboardLabels,
  fluctuation,
  initialLogs,
  MAX_LOGS,
  MAX_PODS,
  PIPELINE_STEP_MS,
  pipelineSequence,
  pipelineStages,
  surgeSequence,
  workerNodes,
} from "../data/dashboard";
import { sectionCopy } from "../data/sections";
import { playClickSound, playSuccessChime, playTerminalSound } from "../utils/audio";
import SectionHeader from "./SectionHeader";

const sounds = { click: playClickSound, terminal: playTerminalSound, success: playSuccessChime };

let logId = 0;
const makeLog = (text) => ({ id: ++logId, text, time: new Date().toLocaleTimeString([], { hour12: false }) });

export function classifyLog(text) {
  if (text.includes("SUCCESS") || text.includes("passed")) return "success";
  if (text.includes("TRIGGERED") || text.includes("ALERT")) return "alert";
  return "normal";
}

export function stageStatus(idx, currentStep, pipelineState) {
  if (currentStep > idx) return "completed";
  if (currentStep === idx && pipelineState === "running") return "current";
  return "pending";
}

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const walk = (v, { step, min, max }) => clamp(v + Math.round((Math.random() * 2 - 1) * step), min, max);
const podName = (start, i) => `pod-${String(start + i).padStart(2, "0")}`;

function Gauge({ icon: Icon, label, value, status, percent, name }) {
  return (
    <div className="gauge" data-gauge={name}>
      <div className="gauge__head">
        <Icon aria-hidden="true" className="gauge__icon" />
        <span className="gauge__label">{label}</span>
      </div>
      <p className="gauge__value">{value}</p>
      {status && <p className="gauge__status">{status}</p>}
      {percent !== undefined && (
        <div
          className="gauge__bar"
          role="progressbar"
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(percent)}
        >
          <div className="gauge__fill" style={{ width: `${clamp(percent, 0, 100)}%` }} />
        </div>
      )}
    </div>
  );
}

export default function MissionControl() {
  const [metrics, setMetrics] = useState(dashboardInitialState);
  const [logs, setLogs] = useState(() => initialLogs.map(makeLog));
  const timeoutsRef = useRef([]);
  const logRef = useRef(null);

  const { pipelineState, currentStep, trafficSurge, podCount, cpuUsage, memoryUsage, deploymentsCount, requestsPerSec } =
    metrics;

  const patch = useCallback((partial) => setMetrics((m) => ({ ...m, ...(typeof partial === "function" ? partial(m) : partial) })), []);
  const addLogs = useCallback((texts) => setLogs((l) => [...l, ...texts.map(makeLog)].slice(-MAX_LOGS)), []);
  const schedule = useCallback((fn, delay) => {
    const id = setTimeout(() => {
      timeoutsRef.current = timeoutsRef.current.filter((t) => t !== id);
      fn();
    }, delay);
    timeoutsRef.current.push(id);
  }, []);

  // Clear every pending timeout on unmount so nothing updates state afterwards.
  useEffect(() => () => timeoutsRef.current.forEach(clearTimeout), []);

  // Random-walk live metrics while there's no surge.
  useEffect(() => {
    if (trafficSurge) return undefined;
    const id = setInterval(() => {
      setMetrics((m) => ({
        ...m,
        cpuUsage: walk(m.cpuUsage, fluctuation.cpu),
        memoryUsage: walk(m.memoryUsage, fluctuation.memory),
        requestsPerSec: walk(m.requestsPerSec, fluctuation.rps),
      }));
    }, fluctuation.intervalMs);
    return () => clearInterval(id);
  }, [trafficSurge]);

  // Keep the log console pinned to the newest line.
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [logs]);

  const runPipeline = () => {
    if (pipelineState === "running") return;
    pipelineSequence.forEach((stage) => {
      const apply = () => {
        sounds[stage.sound]?.();
        patch((m) => ({
          currentStep: stage.step,
          pipelineState: stage.complete ? "completed" : "running",
          deploymentsCount: stage.complete ? m.deploymentsCount + 1 : m.deploymentsCount,
        }));
        addLogs(stage.logs);
      };
      if (stage.at === 0) apply();
      else schedule(apply, stage.at * PIPELINE_STEP_MS);
    });
  };

  const runSurge = () => {
    if (trafficSurge) return;
    surgeSequence.forEach((phase) => {
      const apply = () => {
        sounds[phase.sound]?.();
        patch(phase.state);
        addLogs(phase.logs);
      };
      if (phase.at === 0) apply();
      else schedule(apply, phase.at);
    });
  };

  const nodePods = [Math.ceil(podCount / 2), Math.floor(podCount / 2)];

  return (
    <section id="devopsdashboard" className="section mission-control" aria-labelledby="dashboard-heading">
      <div className="container">
        <SectionHeader id="dashboard-heading" {...sectionCopy.dashboard} />

        <div className="mission-control__gauges" aria-live="off">
          <Gauge
            name="traffic"
            icon={FaBolt}
            label="Traffic Ingress"
            value={`${requestsPerSec.toLocaleString()} req/s`}
            status={trafficSurge ? "Surge" : "Normal"}
          />
          <Gauge name="cpu" icon={FaMicrochip} label="Cluster CPU" value={`${cpuUsage}%`} percent={cpuUsage} status={`Memory ${memoryUsage}%`} />
          <Gauge name="pods" icon={FaCubes} label="Active K8s Pods" value={podCount} percent={(podCount / MAX_PODS) * 100} />
          <Gauge name="deployments" icon={FaRocket} label="Production Deployments" value={deploymentsCount} status="99.99% OK" />
        </div>

        <div className="mission-control__controls">
          <button type="button" className="btn btn--danger" onClick={runSurge} disabled={trafficSurge} data-active={trafficSurge}>
            {trafficSurge ? dashboardLabels.surgeActive : dashboardLabels.surgeIdle}
          </button>
          <button
            type="button"
            className="btn btn--primary"
            onClick={runPipeline}
            disabled={pipelineState === "running"}
            data-state={pipelineState}
          >
            {dashboardLabels.pipeline[pipelineState]}
          </button>
        </div>

        <div className="mission-control__grid">
          <div className="panel topology" aria-label="Kubernetes node topology">
            <h3 className="panel__title">Kubernetes Node Topology</h3>
            <div className="topology__nodes">
              {workerNodes.map((node, n) => (
                <div key={node.id} className="topology__node">
                  <div className="topology__node-head">
                    <FaServer aria-hidden="true" />
                    <span className="topology__node-name">
                      {node.ip} ({node.name})
                    </span>
                    <span className="topology__az">AZ: {node.az}</span>
                  </div>
                  <ul className="topology__pods" aria-label={`${nodePods[n]} pods on ${node.name}`}>
                    <AnimatePresence initial={false}>
                      {Array.from({ length: nodePods[n] }, (_, i) => podName(node.podPrefix, i)).map((pod) => (
                        <motion.li
                          key={pod}
                          layout
                          className="pod"
                          initial={{ opacity: 0, scale: 0.6 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.6 }}
                          transition={{ duration: 0.25 }}
                        >
                          <span className="pod__name">{pod}</span>
                          <span className="pod__status" data-status="running">
                            Running
                          </span>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="panel pipeline" aria-label="CI/CD pipeline">
            <h3 className="panel__title">CI/CD Release Pipeline</h3>
            <ol className="pipeline__stages">
              {pipelineStages.map((stage, idx) => {
                const status = stageStatus(idx, currentStep, pipelineState);
                return (
                  <li key={stage.title} className="pipeline__stage" data-status={status} aria-current={status === "current" ? "step" : undefined}>
                    <span className="pipeline__stage-icon" aria-hidden="true">
                      {status === "completed" ? <FaCheckCircle /> : status === "current" ? <FaSpinner className="spin" /> : null}
                    </span>
                    <span className="pipeline__stage-label">
                      {status === "pending" ? `STAGE 0${idx + 1}` : status === "current" ? "RUNNING" : "PASSED"}
                    </span>
                    <span className="pipeline__stage-title">{stage.title}</span>
                    <span className="pipeline__stage-subtitle">{stage.subtitle}</span>
                  </li>
                );
              })}
            </ol>
            {pipelineState === "running" && (
              <p className="pipeline__progress" role="status">
                Executing deployment stage {Math.min(currentStep + 1, pipelineStages.length)}/{pipelineStages.length}…
              </p>
            )}
          </div>
        </div>

        <div className="panel log-console">
          <h3 className="panel__title">Streaming Cluster Logs</h3>
          <div ref={logRef} className="log-console__output" role="log" aria-live="polite" aria-label="Cluster logs" tabIndex={0}>
            {logs.map((log) => (
              <div key={log.id} className="log-console__line" data-kind={classifyLog(log.text)}>
                <span className="log-console__time">{log.time}</span> {log.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
