import { Trash2 } from "lucide-react";
import { CLASS_COLORS } from "../constants/spellData";

export default function SpellCard({
  spell,
  adminMode,
  removeSpell,
  setSelectedSpell,
}) {
  return (
    <div
      onClick={() => setSelectedSpell(spell)}
      className="bg-zinc-950 border border-zinc-800 p-4 rounded-2xl cursor-pointer hover:border-zinc-600 transition"
    >
      <div className="grid gap-3">
        <h3 className="font-bold">{spell.name}</h3>

        <div className="text-sm text-zinc-400 mb-2">
          <div>
            <span className="text-zinc-500">Casting:</span>{" "}
            {spell.casting_time}
          </div>

          <div>
            <span className="text-zinc-500">Range:</span>{" "}
            {spell.range}
          </div>

          <div>
            <span className="text-zinc-500">Duration:</span>{" "}
            {spell.duration}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {spell.classes.map((c) => {
            const color = CLASS_COLORS[c.name];

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

          {adminMode && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeSpell(spell.index);
              }}
            >
              <Trash2 />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}