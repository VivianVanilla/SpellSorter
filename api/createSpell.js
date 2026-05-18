import { put } from "@vercel/blob";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  try {
    const spell = req.body;

    // turn name into safe filename
    const slug = spell.name
      .toLowerCase()
      .replaceAll(" ", "-");

    const filePath = `spells/${slug}.json`;

    const blob = await put(filePath, JSON.stringify(spell, null, 2), {
      access: "public",
      contentType: "application/json",
      allowOverwrite: true,
    });

    return res.status(200).json({
      message: "Spell uploaded",
      url: blob.url,
      path: blob.pathname,
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}