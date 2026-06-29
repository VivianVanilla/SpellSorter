/**
 * One-time migration: Vercel Blob → Supabase public.spells table
 *
 * Required env vars (add to .env.local or export before running):
 *   BLOB_READ_WRITE_TOKEN   – from your Vercel dashboard → Storage → Blob → Tokens
 *   SUPABASE_URL            – your project URL  (e.g. https://xxx.supabase.co)
 *   SUPABASE_SERVICE_KEY    – service_role key (Settings → API) — NOT the anon key
 *
 * Run:
 *   node --env-file=.env.local scripts/migrate-blob-to-supabase.js
 */

import { list } from "@vercel/blob";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_PUBLIC_SUPABASE_URL,
  process.env.VITE_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

async function migrate() {
  console.log("Listing spells from Vercel Blob...");

  const { blobs } = await list({ prefix: "spells/" });
  const spellFiles = blobs.filter((b) => b.pathname.endsWith(".json"));

  console.log(`Found ${spellFiles.length} spell files.`);

  let inserted = 0;
  let failed = 0;

  for (const file of spellFiles) {
    try {
      const res = await fetch(file.url);
      const spellData = await res.json();

      const spellName = spellData.index ?? spellData.name.toLowerCase().replaceAll(" ", "-");

      const { error } = await supabase
        .from("spells")
        .upsert({ spell_name: spellName, spell_data: spellData }, { onConflict: "spell_name" });

      if (error) throw error;

      console.log(`  ✓ ${spellName}`);
      inserted++;
    } catch (err) {
      console.error(`  ✗ ${file.pathname}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone. ${inserted} inserted, ${failed} failed.`);
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
