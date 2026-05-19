import { useMemo, useState } from "react";
import { Plus, Shield, Pencil, Sparkles, Search } from "lucide-react";
import { CLASS_COLORS, CLASS_OPTIONS, DAMAGE_TYPES, SCHOOLS, CASTING } from "./constants/spellData";
import { filterSpells } from "./utils/filterSpells";
import ClassMultiSelect from "./components/ClassMultiSelect";
import LevelMultiSelect from "./components/LevelMultiSelect";
import SpellModal from "./components/SpellModal";
import SpellCard from "./components/SpellCard";
import AddSpellForm from "./components/AddSPellForm";
import { useEffect } from "react";

/* ------------------ APP ------------------ */

export default function App() {
  const [spells, setSpells] = useState([]);


  
 useEffect(() => {
  fetch("/api/getSpells")
    .then((r) => r.json())
    .then(setSpells);
}, []);


  const [filters, setFilters] = useState({
  level: "All",
  school: "All",
  casting_time: "All",
  damageType: "All",
});

  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [search, setSearch] = useState("");
const [editingIndex, setEditingIndex] = useState(null);
  

  const [selectedSpell, setSelectedSpell] = useState(null);
  const [adminMode, setAdminMode] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const [newSpell, setNewSpell] = useState({
    name: "",
    level: 0,
    school: "Evocation",
    classes: [],
    damageType: "Fire",
    components: [""],
    range: "",
    duration: "",
    desc: "",
    casting_time: "None",
    ctag: "",
    materialComponents: false,
    materials: "",
    ritual: false,
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

  const filteredSpells = useMemo(() => {
  return filterSpells(
    spells,
    filters,
    selectedClasses,
    search
  );
}, [spells, filters, selectedClasses, search]);

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

const addSpell = async () => {
  if (!newSpell.name.trim()) return;

  const spellToSend = {
    index: newSpell.name.toLowerCase().replaceAll(" ", "-"),
    name: newSpell.name,
    level: Number(newSpell.level),
    school: { name: newSpell.school },
    classes: newSpell.classes.map((c) => ({ name: c })),
    casting_time: newSpell.casting_time,
    range: newSpell.range,
    duration: newSpell.duration,
    components: newSpell.components,
    materialComponents: newSpell.materialComponents,
    materials: newSpell.materials,
    damageType: newSpell.damageType,
    ctag: newSpell.ctag,
    ritual: newSpell.ritual,
    desc: newSpell.desc
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line !== ""),
  };

  try {
    const res = await fetch("/api/createSpell", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(spellToSend),
    });

    const data = await res.json();
    console.log("Uploaded:", data);

    // update UI
    setSpells((prev) => [...prev, spellToSend]);

    // reset form
    setNewSpell({
      name: "",
      level: 0,
      school: "Evocation",
      classes: [],
      damageType: "Fire",
      components: ["V"],
      range: "",
      duration: "",
      casting_time: "None",
      ctag: "",
      desc: "",
      materialComponents: false,
      materials: "",
      ritual: false,
    });
  } catch (err) {
    console.error("Upload failed:", err);
  }
};
  /* ------------------ EDIT SPELL ------------------ */

 const handleEditSpell = (spell) => {
  setAdminMode(true);

  setEditingIndex(spell.index); 

  setNewSpell({
    name: spell.name || "",
    level: spell.level || 0,
    school: spell.school?.name || "Evocation",
    classes: spell.classes?.map((c) => c.name) || [],
    damageType: spell.damageType || "Fire",
    components: spell.components || ["V"],
    range: spell.range || "",
    duration: spell.duration || "",
    desc: Array.isArray(spell.desc) ? spell.desc.join("\n") : "",
    casting_time: spell.casting_time || "",
    ctag: spell.ctag || "",
    materialComponents: spell.materialComponents || false,
    materials: spell.materials || "",
    ritual: spell.ritual || false,
  });
};


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

           


        {/* ADMIN */}
        <div className="mt-auto pt-6">
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

       <div className="mb-8 flex flex-col md:flex-row gap-3 md:items-end">

  {/* SEARCH */}
  <div className="relative w-full md:w-80">
    <Search className="absolute left-3 top-3 text-zinc-500" />
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search spells..."
      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 py-3"
    />
  </div>

   {/* CLASS FILTER */}
<ClassMultiSelect
    selectedClasses={selectedClasses}
    setSelectedClasses={setSelectedClasses}
/>

  <LevelMultiSelect
    selectedLevels={selectedLevels}
    setSelectedLevels={setSelectedLevels}
  />

  {/* FILTERS */}
  <div className="flex flex-wrap gap-2">

    



    {/* SCHOOL */}
    <select
      value={filters.school}
      onChange={(e) =>
        setFilters((f) => ({ ...f, school: e.target.value }))
      }
      className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2"
    >
      <option value="All">All Schools</option>
      {SCHOOLS.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>

    {/* CASTING TIME */}
    <select
  value={filters.casting_time}
  onChange={(e) =>
    setFilters((f) => ({ ...f, casting_time: e.target.value }))
  }
  className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2"
>
  <option value="All">Casting Type</option>

  {CASTING.map((t) => (
    <option key={t} value={t}>
      {t}
    </option>
  ))}
</select>

    {/* DAMAGE TYPE */}
    <select
      value={filters.damageType}
      onChange={(e) =>
        setFilters((f) => ({ ...f, damageType: e.target.value }))
      }
      className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2"
    >
      <option value="All">Damage Type</option>
      {DAMAGE_TYPES.map((d) => (
        <option key={d} value={d}>
          {d}
        </option>
      ))}
    </select>

  </div>
</div>



        {/* CREATE SPELL */}
        
         {adminMode && (
  <AddSpellForm
    newSpell={newSpell}
    setNewSpell={setNewSpell}
    toggleClass={toggleClass}
    addSpell={addSpell}
  />
)}

{/* SPELL LIST */}
<div className="space-y-10 mt-8">
  {Object.entries(grouped).map(([level, spells]) => (
    <section key={level}>
      <h2 className="text-xl mb-4 border-b border-zinc-800 pb-2">
        {level === "0" ? "Cantrips" : `Level ${level}`}
      </h2>

      <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-5">
        {spells.map((spell) => (
          <SpellCard
            key={spell.index}
            spell={spell}
            adminMode={adminMode}
            setSelectedSpell={setSelectedSpell}
             onEdit={handleEditSpell}
          />
        ))}
      </div>
    </section>
  ))}
</div>
 <SpellModal
  selectedSpell={selectedSpell}
  setSelectedSpell={setSelectedSpell}
/>
      </main>
    </div>
  );
}
