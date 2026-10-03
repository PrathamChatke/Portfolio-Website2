import { GITHUB_USERNAME, fallbackRepos } from "../data/repos";

export const REPOS_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`;
export const CACHE_KEY = "gh-repos-cache";
export const CACHE_TTL_MS = 10 * 60 * 1000;

function readCache(now) {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { savedAt, repos } = JSON.parse(raw);
    if (now - savedAt > CACHE_TTL_MS || !Array.isArray(repos) || repos.length === 0) return null;
    return repos;
  } catch {
    return null;
  }
}

function writeCache(repos, now) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: now, repos }));
  } catch {
    /* storage full or unavailable */
  }
}

export function normalizeRepo(repo) {
  return {
    id: repo.id ?? repo.name,
    name: repo.name,
    description: repo.description || "DevOps automation & engineering repository.",
    stars: repo.stargazers_count || 0,
    forks: repo.forks_count || 0,
    language: repo.language || "DevOps",
    html_url: repo.html_url,
    homepage: repo.homepage || "",
    updated_at: repo.updated_at || null,
  };
}

/**
 * Load public repos. Resolves to { status: "success" | "fallback", repos }.
 * Rethrows AbortError so callers can ignore cancelled requests.
 */
export async function loadRepos({ signal, fetchImpl = globalThis.fetch, now = Date.now() } = {}) {
  const cached = readCache(now);
  if (cached) return { status: "success", repos: cached, cached: true };

  try {
    const res = await fetchImpl(REPOS_URL, { signal, headers: { Accept: "application/vnd.github+json" } });
    if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) throw new Error("Empty repository list");

    const repos = data.filter((r) => !r.fork && !r.archived).map(normalizeRepo);
    if (repos.length === 0) throw new Error("No original repositories");

    writeCache(repos, now);
    return { status: "success", repos, cached: false };
  } catch (err) {
    if (err?.name === "AbortError") throw err;
    return { status: "fallback", repos: fallbackRepos.map(normalizeRepo), error: err?.message };
  }
}

export function filterAndSortRepos(repos, { query = "", language = "all", sort = "updated" } = {}) {
  const q = query.trim().toLowerCase();
  const result = repos.filter((r) => {
    if (language !== "all" && r.language !== language) return false;
    if (!q) return true;
    return r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
  });
  const sorters = {
    stars: (a, b) => b.stars - a.stars || a.name.localeCompare(b.name),
    name: (a, b) => a.name.localeCompare(b.name),
    updated: (a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0),
  };
  return [...result].sort(sorters[sort] || sorters.updated);
}
