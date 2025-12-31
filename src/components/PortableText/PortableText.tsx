import React from "react"
import { PortableText as PortableTextReact } from "@portabletext/react"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { Link } from "gatsby"

type PortableTextProps = {
  value: any[]
}

// Validate URLs to prevent javascript: and data: protocol attacks
const isValidUrl = (url: string): boolean => {
  if (!url) return false
  try {
    const parsed = new URL(url, "https://example.com") // Use base for relative URLs
    return ["http:", "https:", "mailto:", "tel:"].includes(parsed.protocol)
  } catch {
    return false
  }
}

const components = {
  types: {
    image: ({ value }: any) => {
      const image = getImage(value.asset)

      return (
        <figure>
          {image && <GatsbyImage image={image} alt={value.alt || ""} />}
          {value.caption && <figcaption>{value.caption}</figcaption>}
        </figure>
      )
    },
    codeBlock: ({ value }: any) => {
      return (
        <pre className={`language-${value.language || "javascript"}`}>
          {value.filename && (
            <div className="code-filename">{value.filename}</div>
          )}
          <code>{value.code}</code>
        </pre>
      )
    },
  },
  marks: {
    link: ({ children, value }: any) => {
      // Validate URL to prevent XSS attacks via javascript: or data: protocols
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
    internalLink: ({ children, value }: any) => {
      const slug = value.reference?.slug?.current
      if (!slug) return <>{children}</>

      return <Link to={`/${slug}`}>{children}</Link>
    },
  },
  block: {
    h1: ({ children }: any) => <h1>{children}</h1>,
    h2: ({ children }: any) => <h2>{children}</h2>,
    h3: ({ children }: any) => <h3>{children}</h3>,
    h4: ({ children }: any) => <h4>{children}</h4>,
    blockquote: ({ children }: any) => <blockquote>{children}</blockquote>,
  },
}

export default function PortableText({ value }: PortableTextProps) {
  return <PortableTextReact value={value} components={components} />
}
