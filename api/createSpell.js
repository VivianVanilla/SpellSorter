import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  try {
    const spell = req.body;

    const spellName = spell.name.toLowerCase().replaceAll(" ", "-");

    const { error } = await supabase
      .from("spells")
      .upsert({ spell_name: spellName, spell_data: spell }, { onConflict: "spell_name" });

    if (error) throw error;

    return res.status(200).json({ message: "Spell saved", spell_name: spellName });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
