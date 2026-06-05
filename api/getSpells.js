import { list } from "@vercel/blob";

export default async function handler(req, res) {
  try {
    const { blobs } = await list({
      prefix: "spells/",
    });

    console.log("ALL BLOBS FOUND:", blobs);

    const spellFiles = blobs.filter((blob) =>
      blob.pathname.endsWith(".json")
    );

    

    const spells = await Promise.all(
      spellFiles.map(async (file) => {
        console.log("FETCHING:", file.url);

        const response = await fetch(file.url);

        const data = await response.json();

        console.log("SPELL LOADED:", data);

        return data;
      })
    );

    

    return res.status(200).json(spells);
  } catch (error) {
    console.error("GET SPELLS FAILED:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
} 

