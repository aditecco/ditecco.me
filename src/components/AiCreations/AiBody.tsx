import { PortableText, type PortableTextComponents } from "@portabletext/react"
import { ArrowRight } from "lucide-react"
import { aiImage } from "../../lib/ai-image"
import { isValidUrl } from "../PortableText/PortableText"
import AiImg from "./AiImg"

type Props = {
  value: any[]
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="AiProse">{children}</p>,
    h2: ({ children }) => <h2 className="AiProse AiHeading">{children}</h2>,
    h3: ({ children }) => <h3 className="AiProse AiSubheading">{children}</h3>,
  },
  list: {
    bullet: ({ children }) => <ul className="AiProse">{children}</ul>,
    number: ({ children }) => <ol className="AiProse">{children}</ol>,
  },
  types: {
    imageBlock: ({ value }) => {
      const image = aiImage(value, 960)
      return (
        <figure className="AiFigure">
          <AiImg image={image} label="Image" width={960} height={640} />
          {image?.caption && <figcaption>{image.caption}</figcaption>}
        </figure>
      )
    },
    promptBlock: ({ value }) => (
      <figure className="AiPrompt">
        <figcaption>
          <span>{value.label || "Prompt"}</span>
          {value.note && <span>{value.note}</span>}
        </figcaption>
        <blockquote>{value.text}</blockquote>
      </figure>
    ),
    iterations: ({ value }) => (
      <section className="AiIterations">
        <div className="AiIterations-head">
          {value.title && <h2 className="AiHeading">{value.title}</h2>}
          <span className="AiLabel">Iterations</span>
        </div>
        <div className="AiIterations-grid">
          {(value.items ?? []).map((item: any) => (
            <figure
              key={item._key}
              className={`AiIteration${item.kept ? " is-kept" : ""}`}
            >
              <div className="AiIteration-frame">
                <AiImg
                  image={aiImage(item.image, 320, 240)}
                  label="Image · 4:3"
                  width={320}
                  height={240}
                />
                {item.kept && <span className="AiIteration-kept">Kept</span>}
              </div>
              <figcaption>
                <span className="AiIteration-label">{item.label}</span>
                {item.caption && <span>{item.caption}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    ),
    pullQuote: ({ value }) => (
      <blockquote className="AiPullQuote">{value.text}</blockquote>
    ),
    figureRow: ({ value }) => (
      <section className="AiFigureRow">
        {(value.images ?? []).map((source: any) => {
          const image = aiImage(source, 640, 427)
          return (
            <figure key={source._key} className="AiFigure">
              <AiImg
                image={image}
                label="Image · 3:2"
                width={640}
                height={427}
              />
              {image?.caption && <figcaption>{image.caption}</figcaption>}
            </figure>
          )
        })}
      </section>
    ),
    ctaLink: ({ value }) =>
      isValidUrl(value.href) ? (
        <p className="AiProse">
          <a
            className="AiButton AiButton--accent AiButton--outlined"
            href={value.href}
          >
            {value.label}
            <ArrowRight size={20} aria-hidden />
          </a>
        </p>
      ) : null,
  },
  marks: {
    link: ({ children, value }) => {
      if (!isValidUrl(value.href)) return <>{children}</>

      return (
        <a
          className="AiInline"
          href={value.href}
          target={value.blank ? "_blank" : undefined}
          rel={value.blank ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      )
    },
  },
}

export default function AiBody({ value }: Props) {
  return (
    <div className="AiBody">
      <PortableText value={value} components={components} />
    </div>
  )
}
