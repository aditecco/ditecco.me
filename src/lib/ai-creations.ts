import type { AiCreationSummary, AiMedium } from "./content"

export const AI_BASE = "/ai-creations/"
export const AI_ALL = `${AI_BASE}all/`

export function aiHref(slug: string) {
  return `${AI_BASE}${slug}/`
}

export function aiMediumHref(slug: string) {
  return `${AI_ALL}?medium=${encodeURIComponent(slug)}`
}

// every medium in use, once, alphabetically
export function aiMediums(creations: AiCreationSummary[]) {
  const bySlug = new Map<string, AiMedium>()
  for (const { medium } of creations) {
    if (medium?.slug) bySlug.set(medium.slug, medium)
  }
  return [...bySlug.values()].sort((a, b) => a.title.localeCompare(b.title))
}

// "01", "02", …
export function aiNumber(index: number) {
  return String(index + 1).padStart(2, "0")
}

export function aiDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })
}

const COUNT_WORDS = [
  "No",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
]

// "Two things", "One thing"
export function aiThings(n: number) {
  return `${COUNT_WORDS[n] ?? n} ${n === 1 ? "thing" : "things"}`
}

// the next older creation, wrapping round to the newest
export function aiNext(all: AiCreationSummary[], slug: string) {
  if (all.length < 2) return null
  const index = all.findIndex(c => c.slug === slug)
  const next = (index + 1) % all.length
  return { creation: all[next], number: aiNumber(next) }
}
