import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  try {
    const { data, error } = await supabase
      .from("spells")
      .select("spell_data");

    if (error) throw error;

    const spells = data.map((row) => row.spell_data);

    return res.status(200).json(spells);
  } catch (error) {
    console.error("GET SPELLS FAILED:", error);
    return res.status(500).json({ error: error.message });
  }
}
