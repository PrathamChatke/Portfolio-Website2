import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { FaStar, FaCodeBranch, FaGithub, FaExternalLinkAlt, FaArrowLeft } from "react-icons/fa";
import { site } from "../data/site";
import { sectionCopy } from "../data/sections";
import { repoSortOptions } from "../data/repos";
import { filterAndSortRepos, loadRepos } from "../utils/github";
import { useDocumentTitle } from "../utils/hooks";
import { playClickSound } from "../utils/audio";
import ErrorBoundary from "../components/ErrorBoundary";

export default function ReposPage() {
  useDocumentTitle(site.reposTitle);
  const [status, setStatus] = useState("loading"); // loading | success | fallback
  const [repos, setRepos] = useState([]);
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("all");
  const [sort, setSort] = useState("updated");

  useEffect(() => {
    const controller = new AbortController();
    loadRepos({ signal: controller.signal })
      .then((result) => {
        setRepos(result.repos);
        setStatus(result.status);
      })
      .catch(() => {
        /* aborted on unmount */
      });
    return () => controller.abort();
  }, []);

  const languages = useMemo(() => [...new Set(repos.map((r) => r.language))].sort(), [repos]);
  const visible = useMemo(() => filterAndSortRepos(repos, { query, language, sort }), [repos, query, language, sort]);

  return (
    <section className="section repos" aria-labelledby="repos-heading">
      <div className="container">
        <Link to="/" className="link-arrow repos__back" onClick={playClickSound}>
          <FaArrowLeft aria-hidden="true" /> Back to portfolio
        </Link>
        <header className="section-header">
          <h1 id="repos-heading" className="section-header__title">
            {sectionCopy.repos.title}
          </h1>
          <p className="section-header__subtitle">{sectionCopy.repos.subtitle}</p>
        </header>

        {status === "loading" ? (
          <p className="repos__loading" role="status">
            Loading repositories from GitHub…
          </p>
        ) : (
          <ErrorBoundary name="RepoList">
            {status === "fallback" && (
              <p className="notice" role="note">
                Showing a cached snapshot: the GitHub API is unavailable or rate-limited right now.
              </p>
            )}

            <div className="repos__toolbar" role="search">
              <div className="field">
                <label htmlFor="repo-search">Search</label>
                <input
                  id="repo-search"
                  type="search"
                  placeholder="Name or description"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="repo-language">Language</label>
                <select id="repo-language" value={language} onChange={(e) => setLanguage(e.target.value)}>
                  <option value="all">All languages</option>
                  {languages.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="repo-sort">Sort by</label>
                <select id="repo-sort" value={sort} onChange={(e) => setSort(e.target.value)}>
                  {repoSortOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <p className="repos__count" aria-live="polite">
              {visible.length} of {repos.length} repositories
            </p>

            {visible.length === 0 ? (
              <p className="repos__empty">No repositories match your filters.</p>
            ) : (
              <ul className="repos__grid">
                {visible.map((repo) => (
                  <li key={repo.id} className="card repo-card">
                    <h2 className="repo-card__name">{repo.name}</h2>
                    <p className="repo-card__desc">{repo.description}</p>
                    <dl className="repo-card__meta">
                      <div>
                        <dt className="sr-only">Language</dt>
                        <dd className="tag">{repo.language}</dd>
                      </div>
                      <div>
                        <dt>
                          <FaStar aria-hidden="true" />
                          <span className="sr-only">Stars</span>
                        </dt>
                        <dd>{repo.stars}</dd>
                      </div>
                      <div>
                        <dt>
                          <FaCodeBranch aria-hidden="true" />
                          <span className="sr-only">Forks</span>
                        </dt>
                        <dd>{repo.forks}</dd>
                      </div>
                    </dl>
                    <div className="repo-card__actions">
                      <a href={repo.html_url} target="_blank" rel="noreferrer" className="btn btn--secondary" aria-label={`View code for ${repo.name} (opens in a new tab)`}>
                        <FaGithub aria-hidden="true" /> View Code
                      </a>
                      {repo.homepage && (
                        <a href={repo.homepage} target="_blank" rel="noreferrer" className="btn btn--ghost" aria-label={`Live site for ${repo.name} (opens in a new tab)`}>
                          <FaExternalLinkAlt aria-hidden="true" /> Live
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </ErrorBoundary>
        )}
      </div>
    </section>
  );
}
