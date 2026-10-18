/* ---------------------------------
ContentIndex
--------------------------------- */

import BackButton from "../BackButton/BackButton"
import "./ContentIndex.scss"

export type ContentIndexItemProps = {
  id: string
  slug: string
  timestamp: string
  title: string
  tags: string[]
}

type Props = {
  content: ContentIndexItemProps[]
  title: string
}

export function ContentIndexItem({
  slug,
  timestamp,
  title,
  tags,
}: ContentIndexItemProps) {
  return (
    <li className="index-item">
      <a href={slug}>
        <article className="index-item-inner">
          <span className="index-item-timestamp">{timestamp}</span>
          <h3 className="index-item-title">{title}</h3>
          <ul className="index-item-tag-list">
            {tags.map(tag => (
              <li key={tag} className="index-item-tag">
                {tag}
              </li>
            ))}
          </ul>
        </article>
      </a>
    </li>
  )
}

export default function ContentIndex({ content, title }: Props) {
  return (
    <div className="ContentIndex">
      <nav className="index-nav">
        <ul>
          <li>
            <BackButton target="/" label="home" />
          </li>
        </ul>
      </nav>

      <main>
        <section>
          <div className="index-hero">
            <h1>{title}</h1>
          </div>
        </section>

        <section>
          {content.length ? (
            <ul className="index-item-list">
              {content.map(item => (
                <ContentIndexItem key={item.id} {...item} />
              ))}
            </ul>
          ) : (
            <div style={{ font: "inherit", padding: 16 }}>
              No posts for now!
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
