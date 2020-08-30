/* ---------------------------------
ContentIndex
--------------------------------- */

import { Link } from "gatsby"
import React, { ReactElement } from "react"
import Layout from "../layout"
import "./ContentIndex.scss"

interface IContentNode {
  node: object // TODO
}

interface IOwnProps {
  content: IContentNode[]
  contentRenderer: (...args) => ReactElement
  title: string
}

export default function ContentIndex({
  content,
  contentRenderer,
  title,
}: IOwnProps) {
  return (
    <Layout title={title}>
      <div className="ContentIndex">
        <nav className="index-nav">
          <ul>
            <li>
              <Link to="/">&larr; Back</Link>
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
