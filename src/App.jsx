import { useState, useEffect } from 'react'

function App() {
  const [keyword, setKeyword] = useState('')
  const [selectedClass, setSelectedClass] = useState('')
  const [damageType, setDamageType] = useState('')
  const [school, setSchool] = useState('')
  const [spells, setSpells] = useState([])
  const [filteredSpells, setFilteredSpells] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSpell, setSelectedSpell] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchSpells()
  }, [])

  const fetchSpells = async () => {
    try {
      console.log('Fetching spells...')
      const response = await fetch('https://www.dnd5eapi.co/api/spells')
      const data = await response.json()
      console.log('Fetched spell list:', data.results.length)
      const allSpells = []
      for (const spell of data.results) {
        const res = await fetch(`https://www.dnd5eapi.co${spell.url}`)
        const spellData = await res.json()
        allSpells.push(spellData)
      }
      console.log('Loaded all spells:', allSpells.length)
      setSpells(allSpells)
      setFilteredSpells(allSpells)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching spells:', error)
      setLoading(false)
    }
  }

  const handleSearch = () => {
    const kw = keyword.toLowerCase()
    const filtered = spells.filter(spell => {
      const matchesKeyword = !kw || spell.name.toLowerCase().includes(kw) || spell.desc.some(d => d.toLowerCase().includes(kw))
      const matchesClass = !selectedClass || spell.classes.some(c => c.name.toLowerCase() === selectedClass)
      const matchesDamage = !damageType || (spell.damage && spell.damage.damage_type && spell.damage.damage_type.name.toLowerCase() === damageType)
      const matchesSchool = !school || spell.school.name.toLowerCase() === school
      return matchesKeyword && matchesClass && matchesDamage && matchesSchool
    })
    setFilteredSpells(filtered)
  }

  return (
    <div className="w-full flex flex-col items-start min-h-screen bg-white text-red-800 p-8 font-sans">
      <h1 className="text-red-800 mb-8 self-center">D&D Spell Sorter</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-8">
        <div className="flex flex-col">
          <label className="mb-2 font-bold text-red-800">Keyword:</label>
          <input
            type="text"
            placeholder="Search spells by keyword..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="p-2 border-2 border-red-800 rounded bg-white text-red-800 w-full"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-2 font-bold text-red-800">Class:</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="p-2 border-2 border-red-800 rounded bg-white text-red-800 w-full"
          >
            <option value="">All Classes</option>
            <option value="artificer">Artificer</option>
            <option value="bard">Bard</option>
            <option value="cleric">Cleric</option>
            <option value="druid">Druid</option>
            <option value="paladin">Paladin</option>
            <option value="ranger">Ranger</option>
            <option value="sorcerer">Sorcerer</option>
            <option value="warlock">Warlock</option>
            <option value="wizard">Wizard</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="mb-2 font-bold text-red-800">Damage Type:</label>
          <select
            value={damageType}
            onChange={(e) => setDamageType(e.target.value)}
            className="p-2 border-2 border-red-800 rounded bg-white text-red-800 w-full"
          >
            <option value="">All Damage Types</option>
            <option value="acid">Acid</option>
            <option value="bludgeoning">Bludgeoning</option>
            <option value="cold">Cold</option>
            <option value="fire">Fire</option>
            <option value="force">Force</option>
            <option value="lightning">Lightning</option>
            <option value="necrotic">Necrotic</option>
            <option value="piercing">Piercing</option>
            <option value="poison">Poison</option>
            <option value="psychic">Psychic</option>
            <option value="radiant">Radiant</option>
            <option value="slashing">Slashing</option>
            <option value="thunder">Thunder</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="mb-2 font-bold text-red-800">School:</label>
          <select
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            className="p-2 border-2 border-red-800 rounded bg-white text-red-800 w-full"
          >
            <option value="">All Schools</option>
            <option value="abjuration">Abjuration</option>
            <option value="conjuration">Conjuration</option>
            <option value="divination">Divination</option>
            <option value="enchantment">Enchantment</option>
            <option value="evocation">Evocation</option>
            <option value="illusion">Illusion</option>
            <option value="necromancy">Necromancy</option>
            <option value="transmutation">Transmutation</option>
          </select>
        </div>
        <button onClick={handleSearch} className="p-2 bg-red-800 text-white rounded cursor-pointer hover:bg-red-700 col-span-full justify-self-center mt-4">Search</button>
      </div>
      <div className="w-full text-left text-gray-800">
        {loading ? (
          <p>Loading spells...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {filteredSpells.map(spell => (
              <div
                key={spell.index}
                className="p-2 border border-red-800 rounded bg-white cursor-pointer text-center text-red-800 hover:bg-red-50"
                onClick={() => {
                  setSelectedSpell(spell)
                  setIsModalOpen(true)
                }}
              >
                {spell.name}
              </div>
            ))}
          </div>
        )}
      </div>
      {isModalOpen && selectedSpell && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white p-8 rounded-lg max-w-2xl max-h-4/5 overflow-y-auto text-gray-800" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4">{selectedSpell.name}</h2>
            <p><strong>Level:</strong> {selectedSpell.level}</p>
            <p><strong>School:</strong> {selectedSpell.school.name}</p>
            <p><strong>Classes:</strong> {selectedSpell.classes.map(c => c.name).join(', ')}</p>
            <p><strong>Casting Time:</strong> {selectedSpell.casting_time}</p>
            <p><strong>Range:</strong> {selectedSpell.range}</p>
            <p><strong>Components:</strong> {selectedSpell.components.join(', ')}</p>
            <p><strong>Duration:</strong> {selectedSpell.duration}</p>
            {selectedSpell.ritual && <p><strong>Ritual:</strong> Yes</p>}
            {selectedSpell.concentration && <p><strong>Concentration:</strong> Yes</p>}
            <p className="mt-4"><strong>Description:</strong></p>
            {selectedSpell.desc.map((desc, i) => <p key={i} className="mb-2">{desc}</p>)}
            {selectedSpell.higher_level && selectedSpell.higher_level.length > 0 && (
              <>
                <p className="mt-4"><strong>At Higher Levels:</strong></p>
                {selectedSpell.higher_level.map((hl, i) => <p key={i} className="mb-2">{hl}</p>)}
              </>
            )}
            <button onClick={() => setIsModalOpen(false)} className="mt-4 p-2 bg-red-800 text-white rounded cursor-pointer hover:bg-red-700">Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
