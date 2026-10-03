import { motion, useReducedMotion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { hero, heroStats, heroTooling } from "../../data/hero";
import { site, socialLinks } from "../../data/site";
import { useSectionNavigation } from "../../context/useSectionNavigation";
import { playClickSound } from "../../utils/audio";
import Terminal from "./Terminal";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.08, ease: "easeOut" } }),
};

export default function Hero() {
  const goTo = useSectionNavigation();
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? false : "hidden";

  return (
    <section id="home" className="hero" aria-labelledby="hero-heading">
      <div className="hero__backdrop" aria-hidden="true" />

      <div className="container hero__grid">
        <motion.div className="hero__content" initial={initial} animate="visible">
          <motion.div className="hero__badge-row" variants={fadeUp} custom={0}>
            <p className="status-pill">
              <span className="status-pill__dot" aria-hidden="true" />
              {hero.status}
            </p>
            <span className="hero__location-badge">AWS Multi-AZ · EKS · Terraform</span>
          </motion.div>

          <motion.p className="hero__intro" variants={fadeUp} custom={1}>
            {hero.intro}
          </motion.p>

          <motion.h1 id="hero-heading" className="hero__headline" variants={fadeUp} custom={2}>
            {hero.headline}
          </motion.h1>

          <motion.p className="hero__bio" variants={fadeUp} custom={3}>
            {hero.bio}
          </motion.p>

          <motion.div className="hero__ctas" variants={fadeUp} custom={4}>
            <button type="button" className="btn btn--primary btn--lg" onClick={() => goTo(hero.primaryCta.target)}>
              {hero.primaryCta.label} <FaArrowRight aria-hidden="true" />
            </button>
            <button type="button" className="btn btn--secondary btn--lg" onClick={() => goTo(hero.secondaryCta.target)}>
              {hero.secondaryCta.label}
            </button>
            <ul className="hero__social">
              {socialLinks.map(({ id, label, href, icon: Icon }) => (
                <li key={id}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="icon-btn"
                    onClick={playClickSound}
                    aria-label={`${site.name} on ${label} (opens in a new tab)`}
                  >
                    <Icon aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.dl className="hero__stats" variants={fadeUp} custom={5}>
            {heroStats.map((s) => (
              <div key={s.label} className="hero__stat">
                <dt className="hero__stat-label">{s.label}</dt>
                <dd className="hero__stat-value">{s.value}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <motion.div
          className="hero__terminal"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
        >
          <Terminal />
        </motion.div>
      </div>

      <div className="container hero__tooling">
        <p className="hero__tooling-label">{hero.toolingLabel}</p>
        <ul className="tooling-strip">
          {heroTooling.map(({ name, icon: Icon }) => (
            <li key={name} className="tooling-strip__item">
              <Icon aria-hidden="true" />
              <span>{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
