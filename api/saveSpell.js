import { put } from "@vercel/blob";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const spell = req.body;

    const filename =
      spell.name.toLowerCase().replaceAll(" ", "-") +
      ".json";

    const blob = await put(
      `spells/${filename}`,
      JSON.stringify(spell, null, 2),
      {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      }
    );

    return res.status(200).json(blob);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}