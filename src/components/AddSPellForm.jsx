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

      <h2 className="flex items-center gap-2 text-xl mb-6">
        <Plus /> Add Spell
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <input
          placeholder="Spell Name"
          value={newSpell.name}
          onChange={(e) =>
            setNewSpell((p) => ({ ...p, name: e.target.value }))
          }
          className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2"
        />

        <input
          type="number"
          placeholder="Level"
          value={newSpell.level}
          onChange={(e) =>
            setNewSpell((p) => ({ ...p, level: Number(e.target.value) }))
          }
          className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2"
        />

        <select
          value={newSpell.school}
          onChange={(e) =>
            setNewSpell((p) => ({ ...p, school: e.target.value }))
          }
          className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2"
        >
          {SCHOOLS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <select
          value={newSpell.damageType}
          onChange={(e) =>
            setNewSpell((p) => ({ ...p, damageType: e.target.value }))
          }
          className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2"
        >
          {DAMAGE_TYPES.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>

        <select
  value={newSpell.casting_time}
  onChange={(e) =>
    setNewSpell((p) => ({ ...p, casting_time: e.target.value }))
  }
  className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2"
>
  <option value="">Select Casting Time</option>
  <option value="1 Action">1 Action</option>
  <option value="Bonus Action">1 Bonus Action</option>
  <option value="Reaction">1 Reaction</option>
</select>

        <input
          placeholder="Range"
          value={newSpell.range}
          onChange={(e) =>
            setNewSpell((p) => ({ ...p, range: e.target.value }))
          }
          className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2"
        />

        <input
          placeholder="Duration"
          value={newSpell.duration}
          onChange={(e) =>
            setNewSpell((p) => ({ ...p, duration: e.target.value }))
          }
          className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2"
        />

        {/* MATERIALS TOGGLE */}
        <label className="flex items-center gap-3 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 cursor-pointer">
          <input
            type="checkbox"
            checked={newSpell.materialComponents}
            onChange={(e) =>
              setNewSpell((p) => ({
                ...p,
                materialComponents: e.target.checked,
                materials: e.target.checked ? p.materials : "",
              }))
            }
          />
          Material Components
        </label>

        {newSpell.materialComponents && (
          <input
            placeholder="Materials"
            value={newSpell.materials}
            onChange={(e) =>
              setNewSpell((p) => ({ ...p, materials: e.target.value }))
            }
            className="col-span-1 md:col-span-2 bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2"
          />
        )}

        {/* COMPONENTS */}
        <input
          placeholder="Components (V,S,M)"
          value={newSpell.components.join(", ")}
          onChange={(e) =>
            setNewSpell((p) => ({
              ...p,
              components: e.target.value.split(",").map((c) => c.trim()),
            }))
          }
          className="col-span-1 md:col-span-2 bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2"
        />





        <label className="flex items-center gap-3 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3">
          <input
            type="checkbox"
            checked={newSpell.ritual}
            onChange={(e) =>
              setNewSpell((p) => ({
                ...p,
                ritual: e.target.checked,
              }))
            }
          />
          Ritual
        </label>

           <select
  value={newSpell.ctag}
  onChange={(e) =>
    setNewSpell((p) => ({ ...p, ctag: e.target.value }))
  }
  className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2"
>
  <option value="">Select Campaign Tag</option>
  <option value="Twilight">Twilight</option>
  <option value="Approved">Approved</option>
  <option value="Special-Banned">Special/Banned</option>
</select>

        <textarea
          placeholder="Description"
          value={
            Array.isArray(newSpell.desc)
              ? newSpell.desc.join("\n\n")
              : newSpell.desc
          }
         onChange={(e) =>
  setNewSpell((p) => ({
    ...p,
    desc: e.target.value
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== ""),
  }))
}
          className="col-span-1 md:col-span-2 bg-zinc-900 border border-zinc-700 rounded-xl p-3 min-h-[160px]"
        />

        {/* CLASSES */}
        <div className="col-span-1 md:col-span-2 flex flex-wrap gap-2">
          {CLASS_OPTIONS.map((cls) => {
            const active = newSpell.classes.includes(cls);
            const color = CLASS_COLORS[cls] || "#6B7280";

            return (
              <button
                key={cls}
                type="button"
                onClick={() => toggleClass(cls)}
                className="px-3 py-2 rounded-xl border text-sm"
                style={{
                  backgroundColor: active ? `${color}55` : "black",
                  border: `1px solid ${color}`,
                }}
              >
                {cls}
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={addSpell}
        className="mt-6 bg-purple-600 hover:bg-purple-500 px-6 py-2 rounded-xl"
      >
        Create Spell
      </button>
    </div>
  );
}