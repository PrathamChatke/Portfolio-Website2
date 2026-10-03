import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "./context/ThemeContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";

const ReposPage = lazy(() => import("./pages/ReposPage"));

export default function App() {
  return (
    <ThemeProvider>
      {/* Honour prefers-reduced-motion for every Framer Motion animation. */}
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route
                path="projects"
                element={
                  <Suspense fallback={<p className="route-loading" role="status">Loading…</p>}>
                    <ReposPage />
                  </Suspense>
                }
              />
              <Route path="*" element={<Home />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </MotionConfig>
    </ThemeProvider>
  );
}
