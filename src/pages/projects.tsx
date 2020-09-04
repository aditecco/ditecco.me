/* ---------------------------------
Projects
--------------------------------- */

import { Link } from "gatsby"
import React, { ReactElement } from "react"
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

export default function Projects({ data }: TProps): ReactElement {
  // const {
  //   allMarkdownRemark: { edges: posts },
  // } = data

  return (
    <ContentIndex
      title="Projects index"
      content={[1]}
      contentRenderer={_ => <Link to="/itakepictures">Itakepictures</Link>}
    />
  )
}
