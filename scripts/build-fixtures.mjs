// Generates fixtures/*.json from the markdown in src/content, in the same
// shape the Sanity import script writes. The site falls back to these when
// SANITY_PROJECT_ID is not set (local dev, CI, visual checks).
import fs from "node:fs"
import path from "node:path"
import { loadHomeCards, loadResumeEntries, root } from "./lib/load-content.mjs"

function write(name, data) {
  fs.writeFileSync(
    path.join(root, "fixtures", name),
    JSON.stringify(data, null, 2) + "\n",
  )
}

write("home-cards.json", loadHomeCards())
write("resume-entries.json", loadResumeEntries())

console.log("fixtures written")
