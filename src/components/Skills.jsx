import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { skillCategories, skills } from "../data/skills";
import { sectionCopy } from "../data/sections";
import SectionHeader from "./SectionHeader";
import FilterTabs from "./FilterTabs";

const itemMotion = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
  transition: { duration: 0.25 },
};

export default function Skills() {
  const [category, setCategory] = useState("all");
  const visible = category === "all" ? skills : skills.filter((s) => s.category === category);

  return (
    <section id="skills" className="section skills" aria-labelledby="skills-heading">
      <div className="container">
        <SectionHeader id="skills-heading" {...sectionCopy.skills} />
        <FilterTabs options={skillCategories} value={category} onChange={setCategory} label="Filter skills by category" />

        <motion.ul layout className="skills__grid" aria-live="polite">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map(({ name, category: cat, level, description, icon: Icon }) => (
              <motion.li key={name} layout {...itemMotion} className="card skill-card" data-category={cat}>
                <div className="skill-card__top">
                  <span className="icon-tile" aria-hidden="true">
                    <Icon />
                  </span>
                  <span className="badge" data-level={level.toLowerCase()}>
                    {level}
                  </span>
                </div>
                <h3 className="skill-card__name">{name}</h3>
                <p className="skill-card__desc">{description}</p>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  );
}
