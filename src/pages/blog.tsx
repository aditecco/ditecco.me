/* ---------------------------------
Blog
--------------------------------- */

import React, { ReactElement } from "react"
import { graphql, Link } from "gatsby"
import ContentIndex, {
  ContentIndexItem,
} from "../components/ContentIndex/ContentIndex"

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
        <ContentIndexItem
          id={id}
          slug={fields.slug}
          timestamp={frontmatter.timestamp}
          title={frontmatter.title}
          tags={frontmatter.tags}
        />
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
