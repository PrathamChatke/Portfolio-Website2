import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router";
import { scrollToSection } from "../utils/scroll";
import { playClickSound } from "../utils/audio";

/**
 * Returns goTo(id): scrolls to a homepage section, or navigates home first
 * (with router state) when called from another route.
 */
export function useSectionNavigation() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return useCallback(
    (id, { sound = true } = {}) => {
      if (sound) playClickSound();
      if (pathname === "/") scrollToSection(id);
      else navigate("/", { state: { scrollTo: id } });
    },
    [pathname, navigate]
  );
}
