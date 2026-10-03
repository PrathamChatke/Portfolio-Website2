import { useEffect } from "react";
import { useLocation } from "react-router";
import { site } from "../data/site";
import { useDocumentTitle } from "../utils/hooks";
import { scrollToSection } from "../utils/scroll";
import ErrorBoundary from "../components/ErrorBoundary";
import Hero from "../components/hero/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import MissionControl from "../components/MissionControl";
import CloudArchitecture from "../components/CloudArchitecture";
import Contact from "../components/Contact";

export default function Home() {
  useDocumentTitle(site.homeTitle);
  const location = useLocation();

  // Cross-route navigation: scroll to the requested section, then clear the
  // history state so a refresh doesn't scroll again.
  useEffect(() => {
    const target = location.state?.scrollTo;
    if (!target) return undefined;
    const id = setTimeout(() => {
      scrollToSection(target);
      window.history.replaceState({}, document.title);
    }, 100);
    return () => clearTimeout(id);
  }, [location.state]);

  return (
    <>
      <ErrorBoundary name="Hero">
        <Hero />
      </ErrorBoundary>
      <ErrorBoundary name="About">
        <About />
      </ErrorBoundary>
      <ErrorBoundary name="Skills">
        <Skills />
      </ErrorBoundary>
      <ErrorBoundary name="Projects">
        <Projects />
      </ErrorBoundary>
      <ErrorBoundary name="MissionControl">
        <MissionControl />
      </ErrorBoundary>
      <ErrorBoundary name="CloudArchitecture">
        <CloudArchitecture />
      </ErrorBoundary>
      <ErrorBoundary name="Contact">
        <Contact />
      </ErrorBoundary>
    </>
  );
}
