/* ---------------------------------
Archive
--------------------------------- */

import React, { ReactElement } from "react"
import ContentIndex, {
  ContentIndexItem,
} from "../../components/ContentIndex/ContentIndex"

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

export default function Archive({ data }: TProps): ReactElement {
  // const {
  //   allMarkdownRemark: { edges: posts },
  // } = data

  // TODO get content dynamically
  return (
    <ContentIndex
      title="Archive index"
      content={[
        {
          id: "06c699dd1a7e41689d877ad49b3f7a30",
          fields: { slug: "/archive/simplest/" },
          frontmatter: { title: "Simplest" },
          timestamp: "",
          tags: "archive",
        },
        {
          id: "1270be44060d48459278e094fd7fd6bd",
          fields: { slug: "/archive/geekville/" },
          frontmatter: { title: "Geekville" },
          timestamp: "",
          tags: "archive",
        },
        {
          id: "92d58424cd0045208fda1a375462363e",
          fields: { slug: "/archive/the-collective/" },
          frontmatter: { title: "The Collective" },
          timestamp: "",
          tags: "archive",
        },
        {
          id: "a72d0249de0045e1acb8766f1cc411e7",
          fields: { slug: "/archive/the-digital-league/" },
          frontmatter: { title: "The Digital League" },
          timestamp: "",
          tags: "archive",
        },
      ]}
      contentRenderer={_ => (
        <ContentIndexItem
          id={_.id}
          slug={_.fields.slug}
          timestamp={_.frontmatter.timestamp}
          title={_.frontmatter.title}
          tags={_.frontmatter.tags}
        />
      )}
    />
  )
}
