
export function filterSpells(spells, filters, selectedClasses, search) {
  let list = [...spells];

  if (search.trim()) {
    list = list.filter((spell) =>
      spell.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (filters.level !== "All") {
    list = list.filter((s) => String(s.level) === filters.level);
  }

  if (filters.school !== "All") {
    list = list.filter((s) => s.school?.name === filters.school);
  }

  if (filters.casting_time !== "All") {
    list = list.filter(
      (s) => s.casting_time === filters.casting_time
    );
  }

  if (filters.damageType !== "All") {
  list = list.filter((s) => s.damageType === filters.damageType);
}

  if (selectedClasses.length > 0) {
    list = list.filter((spell) =>
      spell.classes?.some((c) =>
        selectedClasses.includes(c.name)
      )
    );
  }

  return list.sort(
    (a, b) => a.level - b.level || a.name.localeCompare(b.name)
  );
}