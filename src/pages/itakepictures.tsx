/* ---------------------------------
ITakePictures
--------------------------------- */

import React, { ReactElement } from "react"
import { graphql, Link } from "gatsby"
import Img from "gatsby-image"
import posts from "../content/projects/itakepictures/data"
import "../styles/itakepictures.scss"

interface IOwnProps {}

interface IGatsbyProps {
  data // TODO the right type?
}

interface IGraphQLQueryResponseNode {
  node: {}
}

type TProps = IOwnProps & IGatsbyProps

export default function ITakePictures({ data }: TProps): ReactElement {
  return (
    <div className="ITakePictures">
      <div className="wrapper">
        <header className="header">
          <h1 className="title">I take pictures.</h1>
          <h5 className="subtitle">photos by Alessandro Di Tecco.</h5>
        </header>

        <div className="container">
          {/* TODO sorting */}
          {[...data.allFile.edges].sort().map(image => (
            <div
              className={
                image.node.childImageSharp.fluid.originalName.includes("-wd")
                  ? "module full"
                  : "module half"
              }
            >
              {/* TODO link to detail page */}
              <Link
                to={"/projects"}
                state={{ from: image.node.childImageSharp.fluid.originalName }}
              >
                <Img fluid={image.node.childImageSharp.fluid} fadeIn alt="" />

                {posts[image.node.childImageSharp.fluid.originalName] && (
                  <div className="caption">
                    <span>
                      {
                        posts[image.node.childImageSharp.fluid.originalName]
                          .caption
                      }
                    </span>
                  </div>
                )}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// TODO take directly from sharp
export const query = graphql`
  query {
    allFile(filter: { absolutePath: { glob: "/**/images/itakepictures/*" } }) {
      edges {
        node {
          childImageSharp {
            fluid {
              originalName
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`
