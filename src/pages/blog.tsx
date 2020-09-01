/* ---------------------------------
Blog
--------------------------------- */

import React, { ReactElement } from "react"
import { graphql, Link } from "gatsby"
import ContentIndex from "../components/ContentIndex/ContentIndex"

interface IOwnProps {}

interface IGatsbyProps {
  data // TODO the right type?
}

interface IGraphQLQueryResponseNode {
  node: {
    id: string
    timeToRead: number
    excerpt: string
    fields: {
      slug: string
    }
    frontmatter: {
      title: string
      subtitle: string | null
      language: string
      timestamp: string
      author: string
      tags: string
    }
  }
}

type TProps = IOwnProps & IGatsbyProps

export default function Blog({ data }: TProps): ReactElement {
  const {
    allMarkdownRemark: { edges: posts },
  } = data

  return (
    <ContentIndex
      title="Blog index"
      content={posts}
      contentRenderer={({
        node: { id, timeToRead, excerpt, fields, frontmatter },
      }: IGraphQLQueryResponseNode) => (
        <li className="index-item" key={id}>
          <Link to={fields.slug}>
            <article className="index-item-inner">
              <span className="index-item-timestamp">
                {frontmatter.timestamp}
              </span>

              <h3 className="index-item-title">{frontmatter.title}</h3>
              <span className="index-item-tag">{frontmatter.tags}</span>
            </article>
          </Link>
        </li>
      )}
    />
  )
}

export const query = graphql`
  query {
    allMarkdownRemark(filter: { fileAbsolutePath: { glob: "/**/blog/**/*" } }) {
      edges {
        node {
          id
          timeToRead
          excerpt
          fields {
            slug
          }
          frontmatter {
            title
            subtitle
            language
            timestamp
            author
            tags
          }
        }
      }
    }
  }
`
