import { Fragment, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { architectureNodes } from "../data/architecture";
import { sectionCopy } from "../data/sections";
import { playClickSound } from "../utils/audio";
import SectionHeader from "./SectionHeader";

export default function CloudArchitecture() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef([]);
  const node = architectureNodes[active];

  const select = (idx, focus = false) => {
    if (idx !== active) playClickSound();
    setActive(idx);
    if (focus) tabRefs.current[idx]?.focus();
  };

  // Tabs pattern: arrows move selection, Home/End jump to the ends.
  const onKeyDown = (e) => {
    const last = architectureNodes.length - 1;
    const keys = {
      ArrowRight: active === last ? 0 : active + 1,
      ArrowDown: active === last ? 0 : active + 1,
      ArrowLeft: active === 0 ? last : active - 1,
      ArrowUp: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    };
    if (e.key in keys) {
      e.preventDefault();
      select(keys[e.key], true);
    }
  };

  return (
    <section id="cloudarchitecture" className="section architecture" aria-labelledby="architecture-heading">
      <div className="container">
        <SectionHeader id="architecture-heading" {...sectionCopy.architecture} />

        <div className="architecture__flow" role="tablist" aria-label="Architecture layers" onKeyDown={onKeyDown}>
          {architectureNodes.map(({ title, tech, badge, icon: Icon }, idx) => (
            <Fragment key={title}>
              <button
                ref={(el) => (tabRefs.current[idx] = el)}
                type="button"
                role="tab"
                id={`arch-tab-${idx}`}
                aria-selected={active === idx}
                aria-controls="arch-panel"
                tabIndex={active === idx ? 0 : -1}
                className="arch-node"
                data-active={active === idx}
                onClick={() => select(idx)}
              >
                <Icon className="arch-node__icon" aria-hidden="true" />
                <span className="arch-node__title">{title}</span>
                <span className="arch-node__tech">{tech}</span>
                <span className="badge">{badge}</span>
              </button>
              {idx < architectureNodes.length - 1 && (
                <span className="arch-flow-arrow" aria-hidden="true" data-lit={active >= idx + 1}>
                  <FaArrowRight />
                </span>
              )}
            </Fragment>
          ))}
        </div>

        <motion.div
          key={active}
          id="arch-panel"
          role="tabpanel"
          aria-labelledby={`arch-tab-${active}`}
          tabIndex={0}
          className="panel arch-detail"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="arch-detail__grid">
            <div className="arch-detail__info">
              <div className="arch-detail__header">
                <span className="badge arch-detail__badge">{node.badge}</span>
                <span className="arch-detail__eyebrow">Architecture Tier {active + 1} of {architectureNodes.length}</span>
              </div>
              <h3 className="arch-detail__title">
                {node.title} <span className="arch-detail__tech">({node.tech})</span>
              </h3>
              <p className="arch-detail__desc">{node.description}</p>

              {node.keyFeatures && (
                <div className="arch-detail__features">
                  <h4 className="arch-detail__subhead">Engineered Capabilities</h4>
                  <ul className="check-list">
                    {node.keyFeatures.map((feat) => (
                      <li key={feat}>{feat}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="arch-detail__metrics-wrap">
                <p className="arch-detail__metrics">
                  <strong>Production Guarantee:</strong> ✓ {node.metrics}
                </p>
              </div>
            </div>

            {node.snippet && (
              <div className="arch-detail__code">
                <div className="code-block">
                  <div className="code-block__head">
                    <span className="code-block__file">{node.snippetTitle}</span>
                    <span className="code-block__lang">{node.snippetLanguage.toUpperCase()}</span>
                  </div>
                  <pre className="code-block__body">
                    <code>{node.snippet}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
