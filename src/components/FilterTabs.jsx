import { playClickSound } from "../utils/audio";

/** Category filter as a toggle-button group (each button reports aria-pressed). */
export default function FilterTabs({ options, value, onChange, label }) {
  return (
    <div className="filter-tabs" role="group" aria-label={label}>
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          className="filter-tabs__tab"
          data-active={value === opt.id}
          aria-pressed={value === opt.id}
          onClick={() => {
            playClickSound();
            onChange(opt.id);
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
