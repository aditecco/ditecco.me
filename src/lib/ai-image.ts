import { sanityImageUrl } from "./sanity-image"

export type AiImage = {
  src: string
  srcSet?: string
  alt: string
  caption?: string
}

// width/height in CSS px; a 2x candidate is added
export function aiImage(
  source: any,
  width: number,
  height?: number,
): AiImage | undefined {
  if (!source?.asset) return undefined

  return {
    src: sanityImageUrl(source, width, height),
    srcSet: `${sanityImageUrl(source, width * 2, height && height * 2)} 2x`,
    alt: source.alt ?? "",
    caption: source.caption,
  }
}
