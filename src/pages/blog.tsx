/* ---------------------------------
Blog
--------------------------------- */

import React, { ReactElement } from "react"
import { graphql } from "gatsby"
import ContentIndex, {
  ContentIndexItem,
} from "../components/ContentIndex/ContentIndex"

interface IOwnProps {}

interface ISanityBlogPost {
  _id: string
  title: string
  slug: {
    current: string
  }
  publishedAt: string
  tags?: Array<{
    title: string
  }>
}

interface IGatsbyProps {
  data: {
    allSanityBlogPost: { nodes: ISanityBlogPost[] }
  }
}

type TProps = IOwnProps & IGatsbyProps

export default function Blog({ data }: TProps): ReactElement {
  const posts = data.allSanityBlogPost.nodes

  const content = posts.map(post => {
    const year = new Date(post.publishedAt).getFullYear()
    const timestamp = new Date(post.publishedAt).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    })

    return {
      id: post._id,
      slug: `${year}/${post.slug.current}`,
      timestamp,
      title: post.title,
      tags: post.tags ? post.tags.map(t => t.title) : [],
    }
  })

  return (
    <ContentIndex
      title="Blog index"
      content={content}
      contentRenderer={post => (
        <ContentIndexItem
          id={post.id}
          slug={post.slug}
          timestamp={post.timestamp}
          title={post.title}
          tags={post.tags}
        />
      )}
    />
  )
}

export const query = graphql`
  {
    allSanityBlogPost(sort: { publishedAt: DESC }) {
      nodes {
        _id
        title
        slug {
          current
        }
        publishedAt
        tags {
          title
        }
      }
    }
  }
`
