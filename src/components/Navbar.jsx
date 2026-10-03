import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { FaBars, FaTimes, FaMoon, FaSun, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { navCta, navItems, site, spySections } from "../data/site";
import { useTheme } from "../context/ThemeContext";
import { useSectionNavigation } from "../context/useSectionNavigation";
import { getSoundStatus, playClickSound, toggleSound } from "../utils/audio";
import { HEADER_OFFSET } from "../utils/scroll";

function useScrolled(threshold = 30) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

function useScrollSpy(ids, enabled) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    if (!enabled) return undefined;
    let frame = null;
    const update = () => {
      frame = null;
      const position = window.scrollY + HEADER_OFFSET + 1;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= position) current = id;
      }
      // At the very bottom, the last section wins even if it's short.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) current = ids[ids.length - 1];
      setActive(current);
    };
    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [ids, enabled]);
  return enabled ? active : null;
}

export default function Navbar() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const scrolled = useScrolled();
  const activeId = useScrollSpy(spySections, isHome);
  const goTo = useSectionNavigation();
  const { darkMode, toggleTheme } = useTheme();
  const [soundOn, setSoundOn] = useState(getSoundStatus);
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the drawer on route change and on Escape.
  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const handleNav = (id) => {
    setMenuOpen(false);
    goTo(id);
  };

  const handleSound = () => {
    const next = toggleSound();
    setSoundOn(next);
    if (next) playClickSound();
  };

  const handleTheme = () => {
    playClickSound();
    toggleTheme();
  };

  const renderLinks = (linkClass) => (
    <>
      {navItems.map((item) => (
        <li key={item.id}>
          <a
            href={`/#${item.id}`}
            className={linkClass}
            data-active={activeId === item.id}
            aria-current={activeId === item.id ? "location" : undefined}
            onClick={(e) => {
              e.preventDefault();
              handleNav(item.id);
            }}
          >
            {item.label}
          </a>
        </li>
      ))}
      <li>
        <Link
          to="/projects"
          className={linkClass}
          data-active={pathname === "/projects"}
          aria-current={pathname === "/projects" ? "page" : undefined}
          onClick={playClickSound}
        >
          Repositories
        </Link>
      </li>
    </>
  );

  return (
    <header className="navbar" data-scrolled={scrolled || !isHome} data-menu-open={menuOpen}>
      <div className="navbar__inner container">
        <button type="button" className="brand" onClick={() => handleNav("home")} aria-label={`${site.name}, back to top`}>
          <span className="brand__mark" aria-hidden="true">
            {site.initials}
          </span>
          <span className="brand__text">
            <span className="brand__name">{site.name}</span>
            <span className="brand__role">{site.role}</span>
          </span>
        </button>

        <nav className="navbar__nav" aria-label="Primary">
          <ul className="navbar__list">{renderLinks("navbar__link")}</ul>
        </nav>

        <div className="navbar__actions">
          <button
            type="button"
            className="icon-btn icon-btn--ghost"
            onClick={handleSound}
            aria-label={soundOn ? "Mute UI sounds" : "Enable UI sounds"}
            aria-pressed={soundOn}
          >
            {soundOn ? <FaVolumeUp aria-hidden="true" /> : <FaVolumeMute aria-hidden="true" />}
          </button>
          <button
            type="button"
            className="icon-btn icon-btn--ghost"
            onClick={handleTheme}
            aria-label={darkMode ? "Switch to light theme" : "Switch to dark theme"}
          >
            {darkMode ? <FaSun aria-hidden="true" /> : <FaMoon aria-hidden="true" />}
          </button>
          <button type="button" className="btn btn--primary btn--sm navbar__cta" onClick={() => handleNav(navCta.id)}>
            {navCta.label}
          </button>
          <button
            type="button"
            className="icon-btn icon-btn--ghost navbar__toggle"
            onClick={() => {
              playClickSound();
              setMenuOpen((o) => !o);
            }}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="mobile-menu" className="mobile-menu" aria-label="Mobile">
          <ul className="mobile-menu__list container">{renderLinks("mobile-menu__link")}</ul>
          <div className="mobile-menu__footer container">
            <button type="button" className="btn btn--primary btn--block" onClick={() => handleNav(navCta.id)}>
              {navCta.label}
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
