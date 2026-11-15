import { syncCTUData } from "../src/lib/sync";

// standalone cli sync script — run via `npm run sync` or `npx tsx scripts/sync-ctu.ts`
async function main() {
  console.log("[ctu-sync] fetching latest institutional data from ctu.edu.ph...");
  const start = Date.now();

  try {
    const result = await syncCTUData();
    const elapsed = ((Date.now() - start) / 1000).toFixed(2);
    const taggedCount = result.posts.filter((p) => p.campusSlugs.length > 0).length;

    console.log(`[ctu-sync] done in ${elapsed}s!`);
    console.log(`  source:          ${result.syncStatus.sourceUsed}`);
    console.log(`  posts cached:    ${result.posts.length}`);
    console.log(`  campus-tagged:   ${taggedCount}`);
    console.log(`  programs total:  ${result.syncStatus.programCount}`);
    console.log(`  scraped memos:   ${result.scrapedResources.length}`);
    console.log(`  last synced at:  ${result.syncStatus.lastSyncedAt}`);
  } catch (err) {
    console.error("[ctu-sync] sync failed:", err);
    process.exit(1);
  }
}

main();
