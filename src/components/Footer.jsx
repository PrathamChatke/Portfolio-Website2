import { footerLinks, site, socialLinks } from "../data/site";
import { useSectionNavigation } from "../context/useSectionNavigation";
import { playClickSound } from "../utils/audio";

export default function Footer() {
  const goTo = useSectionNavigation();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__about">
          <button type="button" className="brand" onClick={() => goTo("home")} aria-label={`${site.name}, back to top`}>
            <span className="brand__mark" aria-hidden="true">
              {site.initials}
            </span>
            <span className="brand__name">{site.name}</span>
          </button>
          <p className="footer__tagline">{site.tagline}</p>
          <ul className="footer__social">
            {socialLinks.map(({ id, label, href, icon: Icon }) => (
              <li key={id}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="icon-btn icon-btn--ghost"
                  onClick={playClickSound}
                  aria-label={`${site.name} on ${label} (opens in a new tab)`}
                >
                  <Icon aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav className="footer__nav" aria-label="Footer">
          <p className="footer__heading">Navigate</p>
          <ul className="footer__list">
            {footerLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`/#${link.id}`}
                  className="footer__link"
                  onClick={(e) => {
                    e.preventDefault();
                    goTo(link.id);
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="container footer__bottom">
        <p>
          © {new Date().getFullYear()} {site.name}.
        </p>
        <p className="footer__status">
          <span className="status-pill__dot" aria-hidden="true" /> All systems operational
        </p>
      </div>
    </footer>
  );
}
