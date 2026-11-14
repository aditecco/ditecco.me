/* ---------------------------------
Home
--------------------------------- */

import type { ReactNode } from "react"
import PortableText from "./PortableText/PortableText"
import type { HomeCard } from "../lib/content"
import { GITHUB_URL, TWITTER_URL } from "../lib/site"
import "../styles/home.scss"

type Props = {
  cards: HomeCard[]
  hero?: ReactNode
  // live hero for cards with heroScene "ai-sky"
  aiHero?: ReactNode
}

type CardProps = HomeCard & {
  hero?: ReactNode
}

function Card({
  master,
  expanded,
  title,
  subtitle,
  body,
  intro,
  tags,
  heroImg,
  heroAlt,
  hero,
}: CardProps) {
  return (
    <article>
      {master ? (
        <div className="card-list-item-hero">
          {hero}
          <h2>
            Hi, I'm Alessandro
            <br />
            Di Tecco.
          </h2>
        </div>
      ) : expanded ? (
        <div className="card-list-item-hero">
          {hero}
          {!hero && heroImg && (
            <img
              src={heroImg.src}
              srcSet={heroImg.srcSet}
              alt={heroAlt || ""}
              width={300}
              height={208}
              style={{ objectFit: "cover" }}
            />
          )}
        </div>
      ) : null}

      <div className="card-list-item-body">
        {master && intro && (
          <div className="post-html">
            <PortableText value={intro} />
          </div>
        )}

        {subtitle && <h5>{subtitle}</h5>}
        {title && <h3>{title}</h3>}
        {body && <p>{body}</p>}

        {tags.map(tag => (
          <span key={tag} className="card-list-item-tag">
            {tag}
          </span>
        ))}
      </div>

      {master && (
        <div className="card-list-item-footer">
          <h6>Find me also on:</h6>
          <ul className="contact-list">
            <li>
              <a href="mailto:alessandro@ditecco.me">Email</a>
            </li>
            <li>&middot;</li>
            <li>
              <a href={GITHUB_URL}>GitHub</a>
            </li>
            <li>&middot;</li>
            <li>
              <a href={TWITTER_URL}>Twitter</a>
            </li>
          </ul>
        </div>
      )}
    </article>
  )
}

export default function Home({ cards, hero, aiHero }: Props) {
  const sorted = [...cards].sort((a, b) => a.order - b.order)

  return (
    <div className="Home">
      <main className="card-list-container">
        <ul className="card-list">
          {sorted.map(card => {
            const { id, master, expanded, href, heroScene } = card
            const isAi = heroScene === "ai-sky"
            const className = `card-list-item${
              master
                ? " card-list-item--master card-list-item--3rows"
                : expanded
                  ? " card-list-item--2rows"
                  : ""
            }${isAi ? " card-list-item--ai" : ""}`

            let content: ReactNode = (
              <Card
                {...card}
                hero={master ? hero : isAi ? aiHero : undefined}
              />
            )

            // the master card holds its own links, and anchors can't nest
            if (!master && href) {
              content = <a href={href}>{content}</a>
            }

            return (
              <li key={id} className={className}>
                {content}
              </li>
            )
          })}
        </ul>
      </main>
    </div>
  )
}
