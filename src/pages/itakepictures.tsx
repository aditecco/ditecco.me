/* ---------------------------------
ITakePictures
--------------------------------- */

import React, { ReactElement } from "react"
import { graphql, Link } from "gatsby"
import ContentIndex from "../components/ContentIndex/ContentIndex"
import Img from "gatsby-image"

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

export default function ITakePictures({ data }: TProps): ReactElement {
  // const {
  //   allMarkdownRemark: { edges: posts },
  // } = data
  console.log(data)

  return (
    <ContentIndex
      title="ITakePictures"
      content={data.allFile.edges}
      contentRenderer={image => (
        <Img fluid={image.node.childImageSharp.fluid} alt="" />
      )}
    />
  )
}

export const query = graphql`
  query {
    allFile(filter: { absolutePath: { glob: "/**/images/itakepictures/*" } }) {
      edges {
        node {
          childImageSharp {
            fluid {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`
