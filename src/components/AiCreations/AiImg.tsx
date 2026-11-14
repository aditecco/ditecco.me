import type { AiImage } from "../../lib/ai-image"

type Props = {
  image?: AiImage
  // shown in the placeholder drawn when the image is missing
  label: string
  className?: string
  width: number
  height: number
  eager?: boolean
}

export default function AiImg({
  image,
  label,
  className = "",
  width,
  height,
  eager,
}: Props) {
  if (!image?.src) {
    return (
      <span
        className={`AiImg AiImg--placeholder ${className}`}
        role={image?.alt ? "img" : undefined}
        aria-label={image?.alt || undefined}
      >
        <span aria-hidden>{label}</span>
      </span>
    )
  }

  return (
    <img
      className={`AiImg ${className}`}
      src={image.src}
      srcSet={image.srcSet}
      alt={image.alt}
      width={width}
      height={height}
      loading={eager ? undefined : "lazy"}
      decoding="async"
    />
  )
}
