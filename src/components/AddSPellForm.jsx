import { Plus } from "lucide-react";

import {
  CLASS_OPTIONS,
  CLASS_COLORS,
  DAMAGE_TYPES,
  SCHOOLS,
} from "../constants/spellData";

export default function AddSpellForm({
  newSpell,
  setNewSpell,
  toggleClass,
  addSpell,
}) {
  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl mb-8">

      <h2 className="flex items-center gap-2 text-xl mb-4">
        <Plus /> Add Spell
      </h2>

      <div className="grid grid-cols-2 gap-4">

        {/* NAME */}
        <input
          placeholder="Name"
          value={newSpell.name}
          onChange={(e) =>
            setNewSpell((p) => ({
              ...p,
              name: e.target.value,
            }))
          }
          className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2"
        />

        {/* LEVEL */}
        <input
          type="number"
          placeholder="Level"
          min={0}
          max={9}
          value={newSpell.level}
          onChange={(e) =>
            setNewSpell((p) => ({
              ...p,
              level: e.target.value,
            }))
          }
          className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2"
        />

        {/* SCHOOL */}
        <select
          value={newSpell.school}
          onChange={(e) =>
            setNewSpell((p) => ({
              ...p,
              school: e.target.value,
            }))
          }
          className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2"
        >
          {SCHOOLS.map((s) => (
            <option key={s}>
              {s}
            </option>
          ))}
        </select>

        {/* DAMAGE */}
        <select
          value={newSpell.damageType}
          onChange={(e) =>
            setNewSpell((p) => ({
              ...p,
              damageType: e.target.value,
            }))
          }
          className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2"
        >
          {DAMAGE_TYPES.map((d) => (
            <option key={d}>
              {d}
            </option>
          ))}
        </select>

        {/* DESCRIPTION */}
        <textarea
          placeholder="Description"
          value={newSpell.desc}
          onChange={(e) =>
            setNewSpell((p) => ({
              ...p,
              desc: e.target.value,
            }))
          }
          className="col-span-2 bg-zinc-900 border border-zinc-700 rounded-xl p-3"
        />

        {/* CLASSES */}
        <div className="col-span-2">

          <label className="text-xs text-zinc-400 mb-2 block">
            Spell Classes
          </label>

          <div className="flex flex-wrap gap-2">

            {CLASS_OPTIONS.map((cls) => {
              const active =
                newSpell.classes.includes(cls);

              const color =
                CLASS_COLORS[cls] || "#6B7280";

              return (
                <button
                  key={cls}
                  type="button"
                  onClick={() => toggleClass(cls)}
                  className="px-3 py-2 rounded-xl border text-sm transition hover:scale-105"
                  style={{
                    backgroundColor: active
                      ? `${color}74`
                      : "black",

                    border: `1px solid ${color}`,

                    color: "#FFFFFF",

                    boxShadow: active
                      ? `0 0 12px ${color}55`
                      : "none",
                  }}
                >
                  {cls}
                </button>
              );
            })}

          </div>
        </div>
      </div>

      <button
        onClick={addSpell}
        className="mt-4 bg-purple-600 hover:bg-purple-500 px-6 py-2 rounded-xl"
      >
        Create Spell
      </button>

    </div>
  );
}