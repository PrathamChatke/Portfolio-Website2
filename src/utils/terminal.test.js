import { describe, expect, it } from "vitest";
import { autocomplete, executeCommand } from "./terminal";

describe("executeCommand", () => {
  it("ignores empty or whitespace input", () => {
    expect(executeCommand("")).toBeNull();
    expect(executeCommand("   ")).toBeNull();
  });

  it("is case-insensitive and trims input", () => {
    const result = executeCommand("  HeLp ");
    expect(result.command).toBe("help");
    expect(result.lines.some((l) => l.text.includes("deploy"))).toBe(true);
  });

  it("deploy prints success lines and requests the success chime", () => {
    const result = executeCommand("deploy");
    expect(result.sound).toBe("success");
    expect(result.lines).toHaveLength(5);
    expect(result.lines.every((l) => l.type === "success")).toBe(true);
    expect(result.lines.at(-1).text).toContain("ZERO-DOWNTIME DEPLOYMENT LIVE");
  });

  it("demo and contact request a scroll", () => {
    expect(executeCommand("demo").scrollTo).toBe("devopsdashboard");
    expect(executeCommand("contact").scrollTo).toBe("contact");
  });

  it("projects lists the four case studies with metrics", () => {
    const lines = executeCommand("projects").lines;
    expect(lines).toHaveLength(5);
    expect(lines[1].text).toContain("70% Faster Releases");
  });

  it("whoami and status describe the engineer and cluster", () => {
    expect(executeCommand("whoami").lines[0].text).toContain("DevOps");
    expect(executeCommand("status").lines).toHaveLength(3);
  });

  it("clear requests a history reset", () => {
    expect(executeCommand("clear")).toMatchObject({ clear: true, lines: [] });
  });

  it("returns an error line for unknown commands", () => {
    expect(executeCommand("rm -rf /").lines).toEqual([
      { type: "error", text: "Command 'rm -rf /' not recognized. Type 'help' for available commands." },
    ]);
  });
});

describe("autocomplete", () => {
  it("completes a unique prefix", () => {
    expect(autocomplete("dep")).toBe("deploy");
    expect(autocomplete("WH")).toBe("whoami");
  });

  it("leaves ambiguous or unknown input unchanged", () => {
    expect(autocomplete("c")).toBe("c"); // clear, contact: common prefix is just "c"
    expect(autocomplete("xyz")).toBe("xyz");
  });
});
