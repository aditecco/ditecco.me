/* ---------------------------------
ITakePictures
--------------------------------- */

import React, { ReactElement } from "react"
import { graphql, Link } from "gatsby"
import Img from "gatsby-image"
import "../styles/itakepictures.scss"

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
    <div className="wrapper">
      <header className="header">
        <h1>I take pictures.</h1>
        <h2>photos by Alessandro Di Tecco.</h2>
      </header>

      <div className="container">
        {data.allFile.edges.map(image => (
          <div className="module">
            <Link to={"/projects"}>
              <Img fixed={image.node.childImageSharp.fixed} fadeIn alt="" />

              <div className="capt">
                <p>Grass</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export const query = graphql`
  query {
    allFile(filter: { absolutePath: { glob: "/**/images/itakepictures/*" } }) {
      edges {
        node {
          childImageSharp {
            fixed {
              ...GatsbyImageSharpFixed
            }
          }
        }
      }
    }
  }
`
