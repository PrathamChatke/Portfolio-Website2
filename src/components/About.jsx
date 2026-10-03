import { FaCheck } from "react-icons/fa";
import { about, focusAreas } from "../data/about";
import { sectionCopy } from "../data/sections";
import SectionHeader from "./SectionHeader";

export default function About() {
  return (
    <section id="about" className="section about" aria-labelledby="about-heading">
      <div className="container">
        <div className="about__intro">
          <div>
            <SectionHeader id="about-heading" {...sectionCopy.about} />
            {about.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className="about__text">
                {p}
              </p>
            ))}
          </div>
          <dl className="card about__facts">
            {about.facts.map((f) => (
              <div key={f.label} className="about__fact">
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <h3 className="subheading">What I work on</h3>
        <ul className="focus-grid">
          {focusAreas.map(({ id, icon: Icon, title, description, points }) => (
            <li key={id} className="card focus-card" data-area={id}>
              <span className="icon-tile" aria-hidden="true">
                <Icon />
              </span>
              <h4 className="focus-card__title">{title}</h4>
              <p className="focus-card__desc">{description}</p>
              <ul className="check-list">
                {points.map((p) => (
                  <li key={p}>
                    <FaCheck aria-hidden="true" /> {p}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
