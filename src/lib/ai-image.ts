import { sanityImageUrl } from "./sanity-image"

export type AiImage = {
  // missing for fixtures without a file: the templates draw a placeholder
  src?: string
  srcSet?: string
  alt: string
  caption?: string
}

// fixture images live in fixtures/images/ai and are referenced by `file`
const fixtureImages = import.meta.glob("../../fixtures/images/ai/*", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>

function fixtureUrl(file: string) {
  const key = Object.keys(fixtureImages).find(k => k.endsWith(`/${file}`))
  return key ? fixtureImages[key] : undefined
}

// width/height in CSS px; a 2x candidate is added for Sanity images
export function aiImage(
  source: any,
  width: number,
  height?: number,
): AiImage | undefined {
  if (!source) return undefined

  const { alt = "", caption } = source

  if (source.asset) {
    return {
      src: sanityImageUrl(source, width, height),
      srcSet: `${sanityImageUrl(source, width * 2, height && height * 2)} 2x`,
      alt,
      caption,
    }
  }

  return { src: source.file && fixtureUrl(source.file), alt, caption }
}
