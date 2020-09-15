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

interface IGraphQLQueryResponseNode {}

type TProps = IOwnProps & IGatsbyProps

export default function Archive({ data }: TProps): ReactElement {
  const content = [
    {
      id: "06c699dd1a7e41689d877ad49b3f7a30",
      fields: { slug: "/archive/simplest/" },
      frontmatter: {
        title: "Simplest",
        tags: ["UI Design"],
        timestamp: "2011 - 2016",
      },
    },
    {
      id: "1270be44060d48459278e094fd7fd6bd",
      fields: { slug: "/archive/geekville/en/" },
      frontmatter: {
        title: "Geekville",
        tags: ["Business"],
        timestamp: "2013 - 2016",
      },
    },
    {
      id: "92d58424cd0045208fda1a375462363e",
      fields: { slug: "/archive/the-collective/" },
      frontmatter: {
        title: "The Collective",
        tags: ["Community"],
        timestamp: "2012 - 2013",
      },
    },
    {
      id: "a72d0249de0045e1acb8766f1cc411e7",
      fields: { slug: "/archive/the-digital-league/" },
      frontmatter: {
        title: "The Digital League",
        tags: ["Community"],
        timestamp: "2011 - 2013",
      },
    },
  ]

  // TODO get content dynamically
  return (
    <ContentIndex
      title="Archive index"
      content={content}
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
