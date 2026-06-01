import { useLayoutEffect, useRef, useState } from "react";

const LevelOptions = [0,1,2,3,4,5,6,7,8,9];

const LEVEL_COLORS = {
  0: "#6b7280",
  1: "#22c55e",
  2: "#3b82f6",
  3: "#a855f7",
  4: "#ec4899",
  5: "#ef4444",
  6: "#f97316",
  7: "#eab308",
  8: "#14b8a6",
  9: "#ffffff",
};

export default function LevelMultiSelect({
  selectedLevels,
  setSelectedLevels,
}) {
  const [open, setOpen] = useState(false);
  const [dropdownDirection, setDropdownDirection] = useState("down");
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);

  useLayoutEffect(() => {
    if (!open || !containerRef.current || !dropdownRef.current) return;

    const updateDirection = () => {
      if (!containerRef.current || !dropdownRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const dropdownHeight = dropdownRef.current.offsetHeight;
      const spaceBelow = window.innerHeight - containerRect.bottom;
      const spaceAbove = containerRect.top;

      setDropdownDirection(
        spaceBelow < dropdownHeight && spaceAbove > dropdownHeight
          ? "up"
          : "down"
      );
    };

    updateDirection();
    window.addEventListener("resize", updateDirection);
    return () => window.removeEventListener("resize", updateDirection);
  }, [open, selectedLevels]);

  const toggleLevel = (lvl) => {
    setSelectedLevels((prev) =>
      prev.includes(lvl)
        ? prev.filter((c) => c !== lvl)
        : [...prev, lvl]
    );
  };

  return (
    <div className="relative w-full md:w-72">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full rounded-xl px-4 py-3 text-left  ${open ? "bg-zinc-700 border-zinc-700 " : "bg-zinc-900 border border-zinc-800"}`}
        
      >
        {selectedLevels.length === 0
          ? "All Levels"
          : `${selectedLevels.length} Levels Selected`}
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-3 shadow-2xl">
          <div className="flex flex-wrap gap-2">
            {LevelOptions.map((lvl) => {
              const active = selectedLevels.includes(lvl);
              const color = LEVEL_COLORS[lvl];

              return (
                <button
                  key={lvl}
                  onClick={() => toggleLevel(lvl)}
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
                  {lvl === 0 ? "Cantrip" : `Level ${lvl}`}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setSelectedLevels([])}
            className="mt-4 text-sm text-zinc-400 hover:text-white"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}