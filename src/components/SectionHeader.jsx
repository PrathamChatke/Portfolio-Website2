import { motion, useReducedMotion } from "framer-motion";

export default function SectionHeader({ id, eyebrow, title, subtitle }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.header
      className="section-header"
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {eyebrow && <p className="section-header__eyebrow">{eyebrow}</p>}
      <h2 id={id} className="section-header__title">
        {title}
      </h2>
      {subtitle && <p className="section-header__subtitle">{subtitle}</p>}
    </motion.header>
  );
}
