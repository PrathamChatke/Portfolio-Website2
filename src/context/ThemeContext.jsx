import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "theme";
const ThemeContext = createContext({ darkMode: true, toggleTheme: () => {} });

function readInitialTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "light";
  } catch {
    return true;
  }
}

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(readInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", darkMode);
    root.setAttribute("data-theme", darkMode ? "dark" : "light");
    try {
      localStorage.setItem(STORAGE_KEY, darkMode ? "dark" : "light");
    } catch {
      /* storage unavailable */
    }
  }, [darkMode]);

  const toggleTheme = useCallback(() => setDarkMode((d) => !d), []);
  const value = useMemo(() => ({ darkMode, toggleTheme }), [darkMode, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
