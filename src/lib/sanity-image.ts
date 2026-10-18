import { createImageUrlBuilder } from "@sanity/image-url"

const projectId = import.meta.env.SANITY_PROJECT_ID
const dataset = import.meta.env.SANITY_DATASET || "production"

const builder = projectId ? createImageUrlBuilder({ projectId, dataset }) : null

export function sanityImageUrl(
  source: unknown,
  width: number,
  height?: number,
): string {
  if (!builder) return ""

  let image = builder
    .image(source as any)
    .width(width)
    .auto("format")
    .quality(90)

  if (height) image = image.height(height).fit("crop")

  return image.url()
}
