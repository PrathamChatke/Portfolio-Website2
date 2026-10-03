import { beforeEach, describe, expect, it, vi } from "vitest";
import { CACHE_KEY, CACHE_TTL_MS, filterAndSortRepos, loadRepos } from "./github";
import { fallbackRepos } from "../data/repos";

const okResponse = (data) => ({ ok: true, json: async () => data });
const repo = (overrides) => ({
  id: Math.random(),
  name: "repo",
  description: "desc",
  stargazers_count: 1,
  forks_count: 0,
  language: "Go",
  html_url: "https://github.com/x/repo",
  homepage: "",
  fork: false,
  archived: false,
  updated_at: "2026-01-01T00:00:00Z",
  ...overrides,
});

describe("loadRepos", () => {
  beforeEach(() => sessionStorage.clear());

  it("falls back when the response is not ok", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: false, status: 403, json: async () => ({}) });
    const result = await loadRepos({ fetchImpl });
    expect(result.status).toBe("fallback");
    expect(result.repos.map((r) => r.name)).toEqual(fallbackRepos.map((r) => r.name));
    expect(result.repos[2]).toMatchObject({ stars: 24, forks: 9, language: "Terraform" });
  });

  it("falls back on empty or non-array data", async () => {
    expect((await loadRepos({ fetchImpl: vi.fn().mockResolvedValue(okResponse([])) })).status).toBe("fallback");
    expect((await loadRepos({ fetchImpl: vi.fn().mockResolvedValue(okResponse({ message: "x" })) })).status).toBe("fallback");
  });

  it("falls back when fetch throws", async () => {
    const result = await loadRepos({ fetchImpl: vi.fn().mockRejectedValue(new TypeError("network")) });
    expect(result.status).toBe("fallback");
  });

  it("rethrows AbortError so cancelled requests are ignored", async () => {
    const abort = Object.assign(new Error("aborted"), { name: "AbortError" });
    await expect(loadRepos({ fetchImpl: vi.fn().mockRejectedValue(abort) })).rejects.toThrow("aborted");
  });

  it("filters forks/archived repos, applies defaults, and caches", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      okResponse([
        repo({ name: "keep", description: null, language: null, stargazers_count: null }),
        repo({ name: "forked", fork: true }),
        repo({ name: "old", archived: true }),
      ])
    );
    const result = await loadRepos({ fetchImpl, now: 1000 });
    expect(result.status).toBe("success");
    expect(result.repos).toHaveLength(1);
    expect(result.repos[0]).toMatchObject({
      name: "keep",
      description: "DevOps automation & engineering repository.",
      language: "DevOps",
      stars: 0,
    });
    expect(JSON.parse(sessionStorage.getItem(CACHE_KEY)).repos).toHaveLength(1);

    // Served from cache within the TTL, refetched after it.
    const again = await loadRepos({ fetchImpl, now: 1000 + CACHE_TTL_MS - 1 });
    expect(again.cached).toBe(true);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    await loadRepos({ fetchImpl, now: 1000 + CACHE_TTL_MS + 1 });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });
});

describe("filterAndSortRepos", () => {
  const repos = [
    { name: "b-infra", description: "terraform modules", stars: 5, language: "HCL", updated_at: "2026-03-01" },
    { name: "a-web", description: "react app", stars: 9, language: "JavaScript", updated_at: "2026-01-01" },
    { name: "c-k8s", description: "helm charts", stars: 1, language: "HCL", updated_at: "2026-05-01" },
  ];

  it("searches name and description", () => {
    expect(filterAndSortRepos(repos, { query: "HELM" }).map((r) => r.name)).toEqual(["c-k8s"]);
  });

  it("filters by language and sorts", () => {
    expect(filterAndSortRepos(repos, { language: "HCL", sort: "stars" }).map((r) => r.name)).toEqual(["b-infra", "c-k8s"]);
    expect(filterAndSortRepos(repos, { sort: "name" }).map((r) => r.name)).toEqual(["a-web", "b-infra", "c-k8s"]);
    expect(filterAndSortRepos(repos, { sort: "updated" }).map((r) => r.name)).toEqual(["c-k8s", "b-infra", "a-web"]);
  });
});
