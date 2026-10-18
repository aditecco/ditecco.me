import { PortableText as PortableTextReact } from "@portabletext/react"
import { sanityImageUrl } from "../../lib/sanity-image"

type Props = {
  value: any[]
}

// Validate URLs to prevent javascript: and data: protocol attacks
function isValidUrl(url: string): boolean {
  if (!url) return false

  try {
    const parsed = new URL(url, "https://example.com") // base for relative URLs
    return ["http:", "https:", "mailto:", "tel:"].includes(parsed.protocol)
  } catch {
    return false
  }
}

const components = {
  types: {
    imageBlock: ({ value }: any) => (
      <figure>
        <img
          src={sanityImageUrl(value, 1200)}
          alt={value.alt || ""}
          loading="lazy"
        />
        {value.caption && <figcaption>{value.caption}</figcaption>}
      </figure>
    ),
    codeBlock: ({ value }: any) => (
      <pre className={`language-${value.language || "javascript"}`}>
        {value.filename && (
          <div className="code-filename">{value.filename}</div>
        )}
        <code>{value.code}</code>
      </pre>
    ),
  },
  marks: {
    link: ({ children, value }: any) => {
      if (!isValidUrl(value.href)) {
        return <>{children}</>
      }

      const target = value.blank ? "_blank" : undefined
      const rel = value.blank ? "noopener noreferrer" : undefined

      return (
        <a href={value.href} target={target} rel={rel}>
          {children}
        </a>
      )
    },
  },
}

export default function PortableText({ value }: Props) {
  return <PortableTextReact value={value} components={components} />
}
