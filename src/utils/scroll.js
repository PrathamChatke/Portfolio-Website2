import { prefersReducedMotion } from "./motion";

export const HEADER_OFFSET = 80;

let activeFrame = null;

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Smoothly scroll to a section by id, compensating for the fixed header.
 * Returns false when the element is not on the page.
 */
export function scrollToSection(id, { duration = 500, offset = HEADER_OFFSET } = {}) {
  const el = document.getElementById(id);
  if (!el) return false;

  const target = Math.max(0, el.getBoundingClientRect().top + window.scrollY - (id === "home" ? 0 : offset));
  if (activeFrame) cancelAnimationFrame(activeFrame);

  if (prefersReducedMotion() || duration <= 0) {
    window.scrollTo(0, target);
    return true;
  }

  const start = window.scrollY;
  const distance = target - start;
  const startTime = performance.now();

  const step = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    window.scrollTo(0, start + distance * easeInOutCubic(progress));
    activeFrame = progress < 1 ? requestAnimationFrame(step) : null;
  };
  activeFrame = requestAnimationFrame(step);
  return true;
}
