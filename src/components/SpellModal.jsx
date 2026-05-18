import { CLASS_COLORS } from "../constants/spellData";

export default function SpellModal({
  selectedSpell,
  setSelectedSpell,
}) {
  if (!selectedSpell) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl p-6 relative">

        {/* CLOSE */}
        <button
          onClick={() => setSelectedSpell(null)}
          className="absolute top-3 right-3 text-zinc-400 hover:text-white"
        >
          ✕
        </button>

        {/* TITLE */}
        <h2 className="text-2xl font-bold mb-2">
          {selectedSpell.name}
        </h2>

        <p className="text-sm text-zinc-400 mb-4">
          {selectedSpell.school?.name} • Level{" "}
          {selectedSpell.level}
        </p>

        {/* STATS */}
        <div className="text-sm space-y-1 mb-4 text-zinc-300">

          <div>
            <span className="text-zinc-500">
              Casting Time:
            </span>{" "}
            {selectedSpell.casting_time}
          </div>

          <div>
            <span className="text-zinc-500">
              Range:
            </span>{" "}
            {selectedSpell.range}
          </div>

          <div>
            <span className="text-zinc-500">
              Duration:
            </span>{" "}
            {selectedSpell.duration}
          </div>

          <div>
            <span className="text-zinc-500">
              Components:
            </span>{" "}
            {selectedSpell.components?.join(", ")}
          </div>

    

{selectedSpell?.materialComponents === true && (
  <div className="text-sm text-zinc-500 ">
    Material Components: 
     
    <span className="text-white">{selectedSpell.materials}</span>
    
  </div>
)}

  {selectedSpell?.ritual === true && (
  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold tracking-wide border border-fuchsia-400/40 bg-gradient-to-r from-fuchsia-900/40 to-purple-900/40 text-fuchsia-100 backdrop-blur-sm">
    ✦ Ritual
  </span>
)}

        </div>

        {/* DESCRIPTION */}
        <div className="text-zinc-200 leading-relaxed mb-4">
          {selectedSpell.desc?.map((d, i) => (
            <p key={i} className="mb-2">
              {d}
            </p>
          ))}
        </div>

        {/* CLASSES */}
        <div className="flex flex-wrap gap-2">
          {selectedSpell.classes?.map((c) => {
            const color =
              CLASS_COLORS[c.name] || "#6B7280";

            return (
              <span
                key={c.name}
                className="text-xs px-2 py-1 rounded"
                style={{
                  backgroundColor: `${color}33`,
                  border: `1px solid ${color}`,
                  color: "white",
                }}
              >
                {c.name}
              </span>
            );
          })}
        </div>

<div className="flex flex-wrap gap-2 items-center">
  {selectedSpell.ctag && (
    <span
      className="px-2 py-1 text-xs rounded-md border border-purple-500/50 bg-purple-900/30 text-purple-200"
    >
      {selectedSpell.ctag}
    </span>
  )}
</div>

      </div>
    </div>
  );
}