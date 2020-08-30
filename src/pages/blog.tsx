/* ---------------------------------
Blog
--------------------------------- */

import React, { ReactElement } from "react"
import { graphql, Link } from "gatsby"
import ContentIndex from "../components/ContentIndex/ContentIndex"

interface IOwnProps {}
interface IGatsbyProps {
  data
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
      contentRenderer={({ node: { id, timeToRead, excerpt, frontmatter } }) => (
        <li className="index-item" key={id}>
          {/* TODO path */}
          <Link to={"/"}>
            <article className="index-item-inner">
              <span className="index-item-timestamp">
                {frontmatter.timestamp}
              </span>

              <h3 className="index-item-title">{frontmatter.title}</h3>

              <span className="index-item-tag">{frontmatter.tags}</span>
              {/* {excerpt}
{timeToRead} */}
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
