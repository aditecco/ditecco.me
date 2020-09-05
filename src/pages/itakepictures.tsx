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
  node: {}
}

type TProps = IOwnProps & IGatsbyProps

export default function ITakePictures({ data }: TProps): ReactElement {
  const x = [
    "itp-ph-01-sq.jpg",
    "itp-ph-02-sq.jpg",
    "itp-ph-02-wd.jpg",
    "itp-ph-03-sq.jpg",
    "itp-ph-03-wd.jpg",
    "itp-ph-04-sq.jpg",
    "itp-ph-04-wd.jpg",
    "itp-ph-05-sq.jpg",
    "itp-ph-05-wd.jpg",
    "itp-ph-06-sq.jpg",
    "itp-ph-06-wd.jpg",
    "itp-ph-07-sq.jpg",
    "itp-ph-07-wd.jpg",
    "itp-ph-08-sq.jpg",
    "itp-ph-08-wd.jpg",
    "itp-ph-09-sq.jpg",
    "itp-ph-09-wd.jpg",
    "itp-ph-10-sq.jpg",
    "itp-ph-10-wd.jpg",
    "itp-ph-11-sq.jpg",
    "itp-ph-11-wd.jpg",
    "itp-ph-12-sq.jpg",
    "itp-ph-12-wd.jpg",
    "itp-ph-13-sq.jpg",
    "itp-ph-13-wd.jpg",
    "itp-ph-14-wd.jpg",
    "itp-ph-15-wd.jpg",
    "itp-ph-16-wd.jpg",
    "itp-ph-17-wd.jpg",
    "itp-ph-18-wd.jpg",
    "itp-ph-19-wd.jpg",
  ]

  return (
    <div className="wrapper">
      <header className="header">
        <h1 className="title">I take pictures.</h1>
        <h5 className="subtitle">photos by Alessandro Di Tecco.</h5>
      </header>

      <div className="container">
        {data.allFile.edges.map(image => (
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

              <div className="caption">
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
