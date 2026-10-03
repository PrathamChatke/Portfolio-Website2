import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { caseStudyLabels } from "../data/projects";

const FOCUSABLE = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/** Accessible dialog: Escape/backdrop close, scroll lock, focus trap, focus return. */
export default function CaseStudyModal({ project, onClose }) {
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const trigger = document.activeElement;
    const { overflow, paddingRight } = document.body.style;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    dialogRef.current?.querySelector("[data-autofocus]")?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const items = [...dialogRef.current.querySelectorAll(FOCUSABLE)];
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      if (trigger instanceof HTMLElement) trigger.focus({ preventScroll: true });
    };
  }, []);

  const titleId = `case-study-title-${project.id}`;

  return createPortal(
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        ref={dialogRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98, transition: { duration: 0.15 } }}
      >
        <div className="modal__header">
          <h3 id={titleId} className="modal__title">
            {project.title}
          </h3>
          <button type="button" className="icon-btn modal__close" onClick={onClose} aria-label="Close case study">
            <FaTimes aria-hidden="true" />
          </button>
        </div>

        <div className="modal__body">
          {Object.entries(caseStudyLabels).map(([key, label]) => (
            <section key={key} className="case-block" data-block={key}>
              <h4 className="case-block__label">{label}</h4>
              <p className="case-block__text">{project.details[key]}</p>
            </section>
          ))}
          <ul className="tech-list" aria-label="Technologies">
            {project.tech.map((t) => (
              <li key={t} className="tag">
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="modal__footer">
          <button type="button" className="btn btn--secondary" onClick={onClose} data-autofocus>
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}
