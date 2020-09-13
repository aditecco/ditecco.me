/* ---------------------------------
Projects
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

export default function Projects({ data }: TProps): ReactElement {
  // TODO get content dynamically
  return (
    <ContentIndex
      title="Projects index"
      content={[
        {
          id: "4b2b81a2037543969db96dfdfc9f7fe7",
          fields: { slug: "/projects/itakepictures/" },
          frontmatter: {
            title: "I take pictures",
            timestamp: "",
            tags: ["photography"],
          },
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
