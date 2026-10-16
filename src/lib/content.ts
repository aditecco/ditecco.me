import { createClient } from "@sanity/client"
import { sanityImageUrl } from "./sanity-image"

/* ---------------------------------
Types
--------------------------------- */

// Portable Text blocks, rendered by components/PortableText
export type PortableTextValue = any[]

export type HeroImage = {
  src: string
  srcSet?: string
}

export type HomeCard = {
  id: string
  master: boolean
  expanded: boolean
  href: string
  title?: string
  subtitle?: string
  body?: string
  intro?: PortableTextValue
  tags: string[]
  heroImg?: HeroImage
  heroAlt?: string
  order: number
}

export type ResumeEntry = {
  id: string
  title: string
  subtitle?: string
  language: "EN" | "IT"
  category: "work" | "other"
  order: number
  body: PortableTextValue
}

export type NoteSummary = {
  id: string
  title: string
  slug: string
  publishedAt: string
  tags: string[]
}

export type Note = NoteSummary & {
  subtitle?: string
  language: "EN" | "IT"
  estimatedReadingTime?: number
  author: { name: string }
  content: PortableTextValue
}

/* ---------------------------------
Sanity client
--------------------------------- */

const projectId = import.meta.env.SANITY_PROJECT_ID
const dataset = import.meta.env.SANITY_DATASET

// without a project id (local dev, CI, visual checks) the site renders
// the fixtures generated from src/content: `npm run fixtures`
export const usesFixtures = !projectId

const client = projectId
  ? createClient({
      projectId,
      dataset: dataset || "production",
      apiVersion: "2025-01-01",
      useCdn: true,
    })
  : null

async function query<T>(groq: string, params: Record<string, string> = {}) {
  return client!.fetch<T>(groq, params)
}

/* ---------------------------------
Home cards
--------------------------------- */

const fixtureImages = import.meta.glob("../../fixtures/images/home/*", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>

function fixtureImage(file?: string | null): HeroImage | undefined {
  if (!file) return undefined

  const key = Object.keys(fixtureImages).find(k => k.endsWith(`/${file}`))
  return key ? { src: fixtureImages[key] } : undefined
}

// hero images are rendered at 300x208 (CSS px)
function sanityHero(source: unknown): HeroImage | undefined {
  if (!source) return undefined

  return {
    src: sanityImageUrl(source, 300, 208),
    srcSet: `${sanityImageUrl(source, 600, 416)} 2x`,
  }
}

export async function getHomeCards(): Promise<HomeCard[]> {
  if (!client) {
    const cards = (await import("../../fixtures/home-cards.json"))
      .default as any[]

    return cards.map(c => ({
      ...c,
      id: c._id,
      heroImg: fixtureImage(c.heroImgFile),
    }))
  }

  const cards = await query<any[]>(
    `*[_type == "homeCard"] | order(order asc){
      _id, master, expanded, href, title, subtitle, body, intro,
      "tags": coalesce(tags, []), heroImg, heroAlt, order
    }`,
  )

  return cards.map(c => ({
    ...c,
    id: c._id,
    heroImg: sanityHero(c.heroImg),
  }))
}

/* ---------------------------------
Resume
--------------------------------- */

export async function getResumeEntries(): Promise<ResumeEntry[]> {
  if (!client) {
    const entries = (await import("../../fixtures/resume-entries.json"))
      .default as any[]

    return entries.map(e => ({ ...e, id: e._id }))
  }

  const entries = await query<any[]>(
    `*[_type == "resumeEntry"] | order(order asc){
      _id, title, subtitle, language, category, order, body
    }`,
  )

  return entries.map(e => ({ ...e, id: e._id }))
}

/* ---------------------------------
Notes
--------------------------------- */

const noteFields = `
  _id, title, "slug": slug.current, publishedAt,
  "tags": coalesce(tags[]->title, [])
`

// optional: fixtures/notes.json holds Sanity-shaped note documents
const fixtureNotes = Object.values(
  import.meta.glob("../../fixtures/notes.json", {
    eager: true,
    import: "default",
  }),
)[0] as any[] | undefined

function fixtureNote(n: any): Note {
  return {
    ...n,
    id: n._id,
    slug: n.slug.current,
    tags: (n.tags ?? []).map((t: any) => t.title),
  }
}

export async function getNotes(): Promise<NoteSummary[]> {
  if (!client) return (fixtureNotes ?? []).map(fixtureNote)

  const notes = await query<any[]>(
    `*[_type == "note" && defined(slug.current)] | order(publishedAt desc){${noteFields}}`,
  )

  return notes.map(n => ({ ...n, id: n._id }))
}

export async function getNote(slug: string): Promise<Note | null> {
  if (!client) {
    return (
      (fixtureNotes ?? []).map(fixtureNote).find(n => n.slug === slug) ?? null
    )
  }

  const note = await query<any>(
    `*[_type == "note" && slug.current == $slug][0]{
      ${noteFields}, subtitle, language, estimatedReadingTime,
      "author": author->{name}, content
    }`,
    { slug },
  )

  return note ? { ...note, id: note._id } : null
}
