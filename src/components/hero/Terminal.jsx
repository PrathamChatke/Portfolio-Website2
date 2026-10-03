import { useEffect, useRef, useState } from "react";
import { terminalShortcuts, terminalWelcome } from "../../data/terminal";
import { autocomplete, executeCommand } from "../../utils/terminal";
import { playSuccessChime, playTerminalSound } from "../../utils/audio";
import { scrollToSection } from "../../utils/scroll";

let lineId = 0;
const withIds = (lines) => lines.map((l) => ({ ...l, id: ++lineId }));

export default function Terminal() {
  const [history, setHistory] = useState(() => withIds(terminalWelcome));
  const [input, setInput] = useState("");
  const [commandLog, setCommandLog] = useState([]);
  const [logIndex, setLogIndex] = useState(null); // null = editing a fresh line
  const outputRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to the newest line (inside the terminal only, not the page).
  useEffect(() => {
    const el = outputRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [history]);

  const run = (raw) => {
    const result = executeCommand(raw);
    if (!result) return;

    playTerminalSound();
    if (result.sound === "success") playSuccessChime();

    setCommandLog((log) => [...log, result.command]);
    setLogIndex(null);
    setInput("");

    if (result.clear) {
      setHistory([]);
      return;
    }
    setHistory((h) => [...h, ...withIds([{ type: "user", text: `$ ${result.command}` }, ...result.lines])]);
    if (result.scrollTo) scrollToSection(result.scrollTo);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      if (commandLog.length === 0) return;
      e.preventDefault();
      const next = logIndex === null ? commandLog.length - 1 : Math.max(0, logIndex - 1);
      setLogIndex(next);
      setInput(commandLog[next]);
    } else if (e.key === "ArrowDown") {
      if (logIndex === null) return;
      e.preventDefault();
      const next = logIndex + 1;
      if (next >= commandLog.length) {
        setLogIndex(null);
        setInput("");
      } else {
        setLogIndex(next);
        setInput(commandLog[next]);
      }
    } else if (e.key === "Tab" && input.trim()) {
      // Only capture Tab when there's something to complete, so keyboard users can still tab out.
      const completed = autocomplete(input);
      if (completed !== input) {
        e.preventDefault();
        setInput(completed);
      }
    }
  };

  return (
    <div className="terminal" role="region" aria-label="Interactive DevOps shell">
      <div className="terminal__header">
        <span className="terminal__dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className="terminal__title">pratham@aws-eks-cluster: ~</span>
        <span className="terminal__badge">us-east-1 · healthy</span>
      </div>

      <div
        ref={outputRef}
        className="terminal__output"
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
        onClick={() => inputRef.current?.focus({ preventScroll: true })}
      >
        {history.map((l) => (
          <div key={l.id} className="terminal__line" data-type={l.type}>
            {l.text}
          </div>
        ))}
      </div>

      <form
        className="terminal__form"
        onSubmit={(e) => {
          e.preventDefault();
          run(input);
        }}
      >
        <span className="terminal__prompt" aria-hidden="true">
          $
        </span>
        <label htmlFor="terminal-input" className="sr-only">
          Terminal command
        </label>
        <input
          id="terminal-input"
          ref={inputRef}
          className="terminal__input"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setLogIndex(null);
          }}
          onKeyDown={onKeyDown}
          placeholder="type a command…"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        <button type="submit" className="btn btn--small terminal__run">
          Run
        </button>
      </form>

      <div className="terminal__chips" role="group" aria-label="Command shortcuts">
        {terminalShortcuts.map((cmd) => (
          <button key={cmd} type="button" className="chip" onClick={() => run(cmd)}>
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
}
