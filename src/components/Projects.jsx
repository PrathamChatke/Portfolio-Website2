import { useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { FaGithub, FaArrowRight } from "react-icons/fa";
import { featuredProjects, projectCategories } from "../data/projects";
import { sectionCopy } from "../data/sections";
import { playClickSound } from "../utils/audio";
import SectionHeader from "./SectionHeader";
import FilterTabs from "./FilterTabs";
import CaseStudyModal from "./CaseStudyModal";

export default function Projects() {
  const [category, setCategory] = useState("all");
  const [openProject, setOpenProject] = useState(null);
  const visible = category === "all" ? featuredProjects : featuredProjects.filter((p) => p.category === category);

  const openModal = (project) => {
    playClickSound();
    setOpenProject(project);
  };

  return (
    <section id="projects" className="section projects" aria-labelledby="projects-heading">
      <div className="container">
        <SectionHeader id="projects-heading" {...sectionCopy.projects} />
        <FilterTabs options={projectCategories} value={category} onChange={setCategory} label="Filter projects by category" />

        <motion.ul layout className="projects__grid">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((project) => (
              <motion.li
                key={project.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8, transition: { duration: 0.15 } }}
                className="card project-card"
                data-category={project.category}
              >
                <p className="project-card__metric">{project.metric}</p>
                <h3 className="project-card__title">{project.title}</h3>
                <p className="project-card__desc">{project.description}</p>
                <ul className="tech-list" aria-label="Technologies">
                  {project.tech.map((t) => (
                    <li key={t} className="tag">
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="project-card__actions">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn--ghost"
                    onClick={playClickSound}
                    aria-label={`Source code for ${project.title} (opens in a new tab)`}
                  >
                    <FaGithub aria-hidden="true" /> Source Code
                  </a>
                  <button type="button" className="btn btn--secondary" onClick={() => openModal(project)}>
                    Case Study
                  </button>
                  <button type="button" className="btn btn--ghost" onClick={() => openModal(project)}>
                    View Architecture
                  </button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        <Link to="/projects" className="link-arrow projects__all" onClick={playClickSound}>
          View all GitHub repositories <FaArrowRight aria-hidden="true" />
        </Link>
      </div>

      <AnimatePresence>
        {openProject && <CaseStudyModal key={openProject.id} project={openProject} onClose={() => setOpenProject(null)} />}
      </AnimatePresence>
    </section>
  );
}
