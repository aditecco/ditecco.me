/* ---------------------------------
ContentIndex
--------------------------------- */

import { Link } from "gatsby"
import React, { ReactElement, useRef, useEffect } from "react"
import Layout from "../layout"
import BackButton from "../BackButton/BackButton"
import "./ContentIndex.scss"

interface IContentNode {
  node: object // TODO
}

interface IOwnProps {
  content: IContentNode[]
  contentRenderer: (...args) => ReactElement
  title: string
}

export interface ContentIndexItemProps {
  id: string
  slug: string
  timestamp: string
  title: string
  tags: string[]
}

// we export the default list item,
// which has all the right CSS classes

export function ContentIndexItem({
  id,
  slug,
  timestamp,
  title,
  tags,
}: ContentIndexItemProps): ReactElement {
  return (
    <li className="index-item" key={id}>
      <Link to={slug}>
        <article className="index-item-inner">
          <span className="index-item-timestamp">{timestamp}</span>
          <h3 className="index-item-title">{title}</h3>
          <ul className="index-item-tag-list">
            {tags.map(tag => (
              <li className="index-item-tag">{tag}</li>
            ))}
          </ul>
        </article>
      </Link>
    </li>
  )
}

export default function ContentIndex({
  content,
  contentRenderer,
  title,
}: IOwnProps) {
  const footer = useRef<HTMLElement>(null)
  const contentIndexItemList = useRef<HTMLLIElement>(null)

  useEffect(() => {
    footer.current = document.querySelector("footer")
    contentIndexItemList.current = document.querySelector(".index-item-list")

    if (footer.current && contentIndexItemList.current) {
      const footerHeight = footer.current.getBoundingClientRect().height

      contentIndexItemList.current.setAttribute(
        "style",
        `margin-bottom: ${footerHeight}px`
      )
    }
  }, [])

  return (
    <Layout title={title}>
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
            <ul className="index-item-list">{content.map(contentRenderer)}</ul>
          </section>
        </main>
      </div>
    </Layout>
  )
}
