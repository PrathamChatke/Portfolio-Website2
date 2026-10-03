import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import App from "./App";

beforeAll(() => {
  window.matchMedia ??= () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
  window.IntersectionObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  window.scrollTo = vi.fn();
  globalThis.fetch = vi.fn().mockResolvedValue({ ok: false, status: 403, json: async () => ({}) });
});

describe("App smoke test", () => {
  it("renders every homepage section with the exact anchor ids", () => {
    const { container } = render(<App />);
    for (const id of ["home", "about", "skills", "projects", "devopsdashboard", "cloudarchitecture", "contact"]) {
      expect(container.querySelector(`section#${id}`)).not.toBeNull();
    }
    expect(container.querySelector("#services, #reviews")).toBeNull();
    expect(document.title).toBe("Pratham Chatke | DevOps Engineer");
    expect(container.textContent).not.toMatch(/freelance|hire me/i);
  });

  it("runs terminal commands, history and tab completion", () => {
    render(<App />);
    const input = screen.getByLabelText("Terminal command");
    fireEvent.change(input, { target: { value: "WHO" } });
    fireEvent.keyDown(input, { key: "Tab" });
    expect(input.value).toBe("whoami");
    fireEvent.submit(input.closest("form"));
    const log = screen.getByRole("log", { name: "Terminal output" });
    expect(within(log).getByText("$ whoami")).toBeInTheDocument();
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(input.value).toBe("whoami");
    fireEvent.click(screen.getByRole("button", { name: "clear" }));
    expect(log.children).toHaveLength(0);
  });

  it("filters skills by category", () => {
    render(<App />);
    const skills = document.getElementById("skills");
    fireEvent.click(within(skills).getByRole("button", { name: "CI/CD" }));
    expect(within(skills).getByText("Jenkins")).toBeInTheDocument();
    expect(within(skills).getByText("GitHub Actions")).toBeInTheDocument();
    expect(within(skills).getByRole("button", { name: "CI/CD" })).toHaveAttribute("aria-pressed", "true");
  });

  it("contact form keeps input and offers a mailto fallback when sending fails", async () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Ada" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "ada@example.com" } });
    fireEvent.change(screen.getByLabelText("Subject"), { target: { value: "Collaboration" } });
    fireEvent.change(screen.getByLabelText("Message"), { target: { value: "Hello" } });
    await act(async () => {
      fireEvent.submit(screen.getByLabelText("Message").closest("form"));
    });
    // No EmailJS env vars in tests, so sending fails.
    expect(await screen.findByRole("alert")).toHaveTextContent("couldn't be sent");
    expect(screen.getByLabelText("Name").value).toBe("Ada");
  });

  it("runs the CI/CD pipeline and traffic surge simulations", () => {
    vi.useFakeTimers();
    const { unmount } = render(<App />);
    const dash = document.getElementById("devopsdashboard");

    fireEvent.click(within(dash).getByRole("button", { name: "Trigger CI/CD Deployment" }));
    expect(within(dash).getByRole("button", { name: "Running Pipeline…" })).toBeDisabled();
    act(() => vi.advanceTimersByTime(6000));
    expect(within(dash).getByRole("button", { name: "Run Release Pipeline Again" })).toBeEnabled();
    expect(within(dash).getByText("149")).toBeInTheDocument();

    fireEvent.click(within(dash).getByRole("button", { name: "Simulate 10k Req/s Traffic Surge" }));
    expect(within(dash).getByText("10,450 req/s")).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1800));
    expect(within(dash).getAllByText("Running")).toHaveLength(14);
    act(() => vi.advanceTimersByTime(6200));
    expect(within(dash).getByText("890 req/s")).toBeInTheDocument();

    // Pending timers must not fire after unmount.
    fireEvent.click(within(dash).getByRole("button", { name: "Simulate 10k Req/s Traffic Surge" }));
    const errors = vi.spyOn(console, "error");
    unmount();
    act(() => vi.advanceTimersByTime(10000));
    expect(errors).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it("opens the case study modal", () => {
    render(<App />);
    fireEvent.click(screen.getAllByRole("button", { name: "Case Study" })[0]);
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("The Technical Challenge")).toBeInTheDocument();
    expect(document.body.style.overflow).toBe("hidden");
    fireEvent.keyDown(document, { key: "Escape" });
  });

  it("switches architecture layers with the keyboard", () => {
    render(<App />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    fireEvent.keyDown(tabs[0], { key: "ArrowRight" });
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("AWS ALB & Nginx Proxy");
  });
});
