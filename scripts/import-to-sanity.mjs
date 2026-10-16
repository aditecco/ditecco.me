// One-off, idempotent import of the markdown content into Sanity.
//
//   SANITY_PROJECT_ID=... SANITY_DATASET=... SANITY_WRITE_TOKEN=... npm run import
//
// Documents use deterministic ids, so re-running replaces them in place.
import fs from "node:fs"
import path from "node:path"
import { createClient } from "@sanity/client"
import { loadHomeCards, loadResumeEntries, root } from "./lib/load-content.mjs"

const { SANITY_PROJECT_ID, SANITY_DATASET, SANITY_WRITE_TOKEN } = process.env

if (!SANITY_PROJECT_ID || !SANITY_DATASET || !SANITY_WRITE_TOKEN) {
  console.error(
    "Set SANITY_PROJECT_ID, SANITY_DATASET and SANITY_WRITE_TOKEN (an Editor token).",
  )
  process.exit(1)
}

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  token: SANITY_WRITE_TOKEN,
  apiVersion: "2025-01-01",
  useCdn: false,
})

async function uploadImage(file) {
  const asset = await client.assets.upload(
    "image",
    fs.createReadStream(path.join(root, "fixtures/images/home", file)),
    { filename: file },
  )

  return { _type: "image", asset: { _type: "reference", _ref: asset._id } }
}

const docs = []

for (const card of loadHomeCards()) {
  const { heroImgFile, ...doc } = card
  if (heroImgFile) doc.heroImg = await uploadImage(heroImgFile)
  docs.push(doc)
}

docs.push(...loadResumeEntries())

const tx = client.transaction()
for (const doc of docs) tx.createOrReplace(doc)
await tx.commit()

console.log(`imported ${docs.length} documents`)
