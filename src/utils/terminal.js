import { terminalCommands, terminalResponses } from "../data/terminal";
import { featuredProjects } from "../data/projects";

const line = (type, text) => ({ type, text });

/**
 * Pure command interpreter. Returns the lines to print plus side effects for
 * the UI layer to perform (clear history, scroll, play a sound).
 * Returns null for empty input.
 */
export function executeCommand(rawInput) {
  const cmd = String(rawInput ?? "").trim().toLowerCase();
  if (!cmd) return null;

  const result = { command: cmd, lines: [], clear: false, scrollTo: null, sound: "terminal" };

  switch (cmd) {
    case "help":
      result.lines = [
        line("output", "Available commands:"),
        ...terminalCommands.map((c) => line("output", `  ${c.name.padEnd(9)} ${c.description}`)),
      ];
      break;
    case "whoami":
      result.lines = terminalResponses.whoami.map((t, i) => line(i === 0 ? "success" : "output", t));
      break;
    case "skills":
      result.lines = terminalResponses.skills.map((t, i) => line(i === 0 ? "success" : "output", t));
      break;
    case "status":
      result.lines = terminalResponses.status.map((t, i) => line(i === 0 ? "system" : "output", t));
      break;
    case "deploy":
      result.lines = terminalResponses.deploy.map((t) => line("success", t));
      result.sound = "success";
      break;
    case "projects":
      result.lines = [
        line("success", "FEATURED CASE STUDIES:"),
        ...featuredProjects.map((p, i) => line("output", `  ${i + 1}. ${p.title} [${p.metric}]`)),
      ];
      break;
    case "demo":
      result.lines = [line("success", terminalResponses.demo)];
      result.scrollTo = "devopsdashboard";
      break;
    case "contact":
      result.lines = [line("success", terminalResponses.contact)];
      result.scrollTo = "contact";
      break;
    case "clear":
      result.clear = true;
      break;
    default:
      result.lines = [line("error", `Command '${cmd}' not recognized. Type 'help' for available commands.`)];
  }
  return result;
}

/** Tab completion: the single matching command, or the longest common prefix of several. */
export function autocomplete(partial) {
  const input = String(partial ?? "").trim().toLowerCase();
  if (!input) return partial;
  const matches = terminalCommands.map((c) => c.name).filter((n) => n.startsWith(input));
  if (matches.length === 0) return partial;
  if (matches.length === 1) return matches[0];
  let prefix = matches[0];
  for (const m of matches) {
    while (!m.startsWith(prefix)) prefix = prefix.slice(0, -1);
  }
  return prefix.length > input.length ? prefix : partial;
}
