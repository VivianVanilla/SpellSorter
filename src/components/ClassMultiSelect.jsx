import { useState } from "react";
import {
  CLASS_OPTIONS,
  CLASS_COLORS,
} from "../constants/spellData";

export default function ClassMultiSelect({
  selectedClasses,
  setSelectedClasses,
}) {
  const [open, setOpen] = useState(false);

  const toggleClass = (cls) => {
    setSelectedClasses((prev) =>
      prev.includes(cls)
        ? prev.filter((c) => c !== cls)
        : [...prev, cls]
    );
  };

  return (
    <div className="relative w-full md:w-72">
      <button
        onClick={() => setOpen(!open)}
        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-left"
      >
        {selectedClasses.length === 0
          ? "All Classes"
          : `${selectedClasses.length} Classes Selected`}
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-3 shadow-2xl">
          <div className="flex flex-wrap gap-2">
            {CLASS_OPTIONS.map((cls) => {
              const active = selectedClasses.includes(cls);
              const color = CLASS_COLORS[cls];

              return (
                <button
                  key={cls}
                  onClick={() => toggleClass(cls)}
                  className="px-3 py-2 rounded-xl border text-sm transition"
                  style={{
                    backgroundColor: active
                      ? `${color}66`
                      : "black",
                    border: `1px solid ${color}`,
                    color: "white",
                    boxShadow: active
                      ? `0 0 10px ${color}55`
                      : "none",
                  }}
                >
                  {cls}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setSelectedClasses([])}
            className="mt-4 text-sm text-zinc-400 hover:text-white"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}