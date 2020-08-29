/* ---------------------------------
Blog
--------------------------------- */

import React, { ReactElement } from "react"
import { graphql } from "gatsby"
import { link } from "../../../../../../../Library/Caches/typescript/3.9/node_modules/@types/graceful-fs"

interface IOwnProps {}
interface IGatsbyProps {
  data
}
type TProps = IOwnProps & IGatsbyProps

export default function Blog({ data }: TProps): ReactElement {
  const {
    allMarkdownRemark: { edges: posts },
  } = data

  console.log(posts)

  return (
    <ul>
      {posts.map(({ node: { id, timeToRead, excerpt, frontmatter } }) => (
        <li key={id}>
          {frontmatter.title}
          {frontmatter.author}
          {frontmatter.timestamp}
          {excerpt}
          {timeToRead}
        </li>
      ))}
    </ul>
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
