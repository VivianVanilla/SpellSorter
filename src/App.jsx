import { useMemo, useState } from "react";
import { Plus, Shield, Trash2, Pencil, Sparkles, Search } from "lucide-react";

/* ------------------ DATA OPTIONS ------------------ */

const CLASS_OPTIONS = [
  "Wizard",
  "Sorcerer",
  "Warlock",
  "Cleric",
  "Druid",
  "Bard",
  "Paladin",
  "Ranger",
  "Artificer",
];

const CLASS_COLORS = {
  Wizard: "#1E2FE3",
  Warlock: "#411182",
  Sorcerer: "#A10A14",
  Druid: "#B0D96F",
  Cleric: "#FFFFFF",
  Bard: "#E88ED6",
  Ranger: "#11520E",
  Artificer: "#AD9366",
};

const DAMAGE_TYPES = [
  "Acid",
  "Bludgeoning",
  "Cold",
  "Fire",
  "Force",
  "Lightning",
  "Necrotic",
  "Piercing",
  "Poison",
  "Psychic",
  "Radiant",
  "Slashing",
  "Thunder",
];

const SCHOOLS = [
  "Abjuration",
  "Conjuration",
  "Divination",
  "Enchantment",
  "Evocation",
  "Illusion",
  "Necromancy",
  "Transmutation",
];

/* ------------------ SAMPLE DATA ------------------ */

const SAMPLE_SPELLS = [
  {
    index: "fire-bolt",
    name: "Fire Bolt",
    level: 0,
    school: { name: "Evocation" },
    classes: [{ name: "Wizard" }, { name: "Sorcerer" }],
    casting_time: "1 Action",
    range: "120 Feet",
    duration: "Instantaneous",
    components: ["V", "S"],
    desc: ["You hurl a mote of fire at a target within range."],
  },
  {
    index: "magic-missile",
    name: "Magic Missile",
    level: 1,
    school: { name: "Evocation" },
    classes: [{ name: "Wizard" }],
    casting_time: "1 Action",
    range: "120 Feet",
    duration: "Instantaneous",
    components: ["V", "S"],
    desc: ["Three glowing darts of magical force."],
  },
];

/* ------------------ APP ------------------ */

export default function App() {
  const [spells, setSpells] = useState(SAMPLE_SPELLS);

  const [selectedClass, setSelectedClass] = useState("All");
  const [search, setSearch] = useState("");

  const [adminMode, setAdminMode] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const [newSpell, setNewSpell] = useState({
    name: "",
    level: 0,
    school: "Evocation",
    classes: [],
    damageType: "Fire",
    components: ["V", "S"],
    range: "Self",
    duration: "Instantaneous",
    desc: "",
  });

  /* ------------------ ADMIN LOGIN ------------------ */

  const handleAdminLogin = () => {
    if (passwordInput === "archmage") {
      setAdminMode(true);
      setPasswordInput("");
    } else {
      alert("Wrong password");
    }
  };

  /* ------------------ CLASS TOGGLE ------------------ */

  const toggleClass = (cls) => {
    setNewSpell((prev) => {
      const exists = prev.classes.includes(cls);

      return {
        ...prev,
        classes: exists
          ? prev.classes.filter((c) => c !== cls)
          : [...prev.classes, cls],
      };
    });
  };

  /* ------------------ CREATE SPELL ------------------ */

  const addSpell = () => {
    if (!newSpell.name.trim()) return;

    const slug = newSpell.name.toLowerCase().replaceAll(" ", "-");

    const createdSpell = {
      index: slug,
      name: newSpell.name,
      level: Number(newSpell.level),

      school: {
        name: newSpell.school,
      },

      classes: newSpell.classes.map((c) => ({
        name: c,
      })),

      casting_time: "1 Action",
      range: newSpell.range,
      duration: newSpell.duration,
      components: newSpell.components,

      desc: [newSpell.desc],

      updated_at: new Date().toISOString(),
    };

    setSpells((prev) => [...prev, createdSpell]);

    setNewSpell({
      name: "",
      level: 0,
      school: "Evocation",
      classes: [],
      damageType: "Fire",
      components: ["V", "S"],
      range: "Self",
      duration: "Instantaneous",
      desc: "",
    });
  };

  /* ------------------ DELETE SPELL ------------------ */

  const removeSpell = (index) => {
    setSpells((prev) => prev.filter((s) => s.index !== index));
  };

  /* ------------------ FILTER + SORT ------------------ */

  const filteredSpells = useMemo(() => {
    let list = [...spells];

    if (selectedClass !== "All") {
      list = list.filter((spell) =>
        spell.classes.some((c) => c.name === selectedClass)
      );
    }

    if (search.trim()) {
      list = list.filter((spell) =>
        spell.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    return list.sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
  }, [spells, selectedClass, search]);

  /* ------------------ GROUP BY LEVEL ------------------ */

  const grouped = useMemo(() => {
    const g = {};

    filteredSpells.forEach((spell) => {
      if (!g[spell.level]) g[spell.level] = [];
      g[spell.level].push(spell);
    });

    return g;
  }, [filteredSpells]);

  /* ------------------ UI ------------------ */

  return (
    <div className="flex flex-col md:flex-row h-screen bg-black text-white overflow-hidden">

      {/* SIDEBAR */}
     <aside className="w-full md:w-64 border-r border-zinc-800 bg-zinc-950 p-4 flex flex-col md:h-auto h-auto">
        <div className="space-y-2 max-h-48 md:max-h-none overflow-y-auto">
          <Sparkles className="text-purple-400" />
          <h1 className="text-2xl font-bold">Spell Blob</h1>
        </div>

             {/* Mobile */}

        <div className="md:hidden mb-4">
  <label className="text-xs text-zinc-400">Class Filter</label>

  <select
    value={selectedClass}
    onChange={(e) => setSelectedClass(e.target.value)}
    className="w-full mt-2 bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2"
  >
    <option value="All">All Classes</option>
    {CLASS_OPTIONS.map((cls) => (
      <option key={cls} value={cls}>
        {cls}
      </option>
    ))}
  </select>
</div>

 {/* Desktop */}

       <div className="hidden md:block space-y-2">
  <button
    onClick={() => setSelectedClass("All")}
    className={`w-full text-left px-4 py-2 rounded-xl ${
      selectedClass === "All" ? "bg-purple-600" : "bg-zinc-900"
    }`}
  >
    All
  </button>

  {CLASS_OPTIONS.map((cls) => (
    <button
      key={cls}
      onClick={() => setSelectedClass(cls)}
      className={`w-full text-left px-4 py-2 rounded-xl mb-1 ${
        selectedClass === cls ? "bg-purple-600" : "bg-zinc-900"
      }`}
    >
      {cls}
    </button>
  ))}
</div>

        {/* ADMIN */}
        <div className="hidden md:block mt-auto pt-6">
          {!adminMode ? (
            <>
              <div className="text-sm text-zinc-400 flex items-center gap-2 mb-2">
                <Shield size={16} />
                Admin Mode
              </div>

              <input
                type="password"
                placeholder="Enter password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 mb-2"
              />

              <button
                onClick={handleAdminLogin}
                className="w-full bg-purple-600 hover:bg-purple-500 rounded-lg py-2"
              >
                Enter
              </button>
            </>
          ) : (
            <div className="text-green-400 bg-green-900/30 border border-green-700 p-3 rounded-xl">
              Admin Enabled |
               <button onClick={() => setAdminMode(false)} className="ml-2 bg-red-600 text-white hover:bg-red-500 rounded-lg py-1 px-2">
                Disable
               </button>
            </div>

           
          )}
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">

        {/* SEARCH */}
        <div className="mb-8 flex gap-4">
          <div className="relative w-80">
            <Search className="absolute left-3 top-3 text-zinc-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search spells..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 py-3"
            />
          </div>
        </div>

        {/* CREATE SPELL */}
        {adminMode && (
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl mb-8">
            <h2 className="flex items-center gap-2 text-xl mb-4">
              <Plus /> Add Spell
            </h2>

            <div className="grid grid-cols-2 gap-4">

              <input
                placeholder="Name"
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
                  setNewSpell((p) => ({ ...p, level: e.target.value }))
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

              <textarea
                placeholder="Description"
                value={newSpell.desc}
                onChange={(e) =>
                  setNewSpell((p) => ({ ...p, desc: e.target.value }))
                }
                className="col-span-2 bg-zinc-900 border border-zinc-700 rounded-xl p-3"
              />

              {/* CLASS SELECT */}
            <div className="mb-4">
  <label className="text-xs text-zinc-400">Filter Class</label>

  <select
    value={selectedClass}
    onChange={(e) => setSelectedClass(e.target.value)}
    className="w-full mt-1 bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2"
  >
    <option value="All">All Classes</option>

    {CLASS_OPTIONS.map((cls) => (
      <option key={cls} value={cls}>
        {cls}
      </option>
    ))}
  </select>
</div>

            </div>

            <button
              onClick={addSpell}
              className="mt-4 bg-purple-600 px-6 py-2 rounded-xl"
            >
              Create Spell
            </button>
          </div>
        )}

        {/* SPELL LIST */}
        <div className="space-y-10">
          {Object.entries(grouped).map(([level, spells]) => (
            <section key={level}>
              <h2 className="text-2xl mb-4 border-b border-zinc-800 pb-2">
                {level === "0" ? "Cantrips" : `Level ${level}`}
              </h2>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                {spells.map((spell) => (
                  <div
                    key={spell.index}
                    className="bg-zinc-950 border border-zinc-800 p-4 rounded-2xl"
                  >
                    <div className="flex justify-between">
                      <h3 className="font-bold">{spell.name}</h3>

                      {adminMode && (
                        <button onClick={() => removeSpell(spell.index)}>
                          <Trash2 />
                        </button>
                      )}
                    </div>

                    <p className="text-sm text-zinc-400 mt-2">
                      {spell.school?.name}
                    </p>

                    <p className="mt-3 text-sm">{spell.desc?.[0]}</p>

                   <div className="space-y-1 text-sm text-zinc-300 mb-4">
                      <div>
                        <span className="text-zinc-500">
                          Casting Time:
                        </span>{" "}
                        {spell.casting_time}
                      </div>

                      <div>
                        <span className="text-zinc-500">
                          Range:
                        </span>{" "}
                        {spell.range}
                      </div>

                      <div>
                        <span className="text-zinc-500">
                          Duration:
                        </span>{" "}
                        {spell.duration}
                      </div>
                    </div>

                    <p className="text-zinc-200 leading-relaxed">
                      {spell.desc?.[0]}
                    </p>

                      {/* Color Coded Spell Tags*/}

                    <div className="mt-4 flex flex-wrap gap-2">
                     {spell.classes.map((c) => {
  const color = CLASS_COLORS[c.name] || "#6B7280"; // fallback gray

  return (
    <span
      key={c.name}
      className="text-xs px-2 py-1 rounded"
      style={{
        backgroundColor: `${color}33`, // translucent background
        border: `1px solid ${color}`,
        color: "white",
      }}
    >
      {c.name}
    </span>
  );
})}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
