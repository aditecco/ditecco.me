/* ---------------------------------
ITakePictures
--------------------------------- */

import React, { ReactElement } from "react"
import { graphql, Link } from "gatsby"
import Img from "gatsby-image"
import "../../styles/itakepictures.scss"
import BackButton from "../../components/BackButton/BackButton"

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
      <BackButton
        target="/projects"
        style={{
          position: "fixed",
          bottom: 20,
          left: 20,
          zIndex: 1,
          backgroundColor: "#0000004d",
          color: "#ffffffd6",
          border: "2px solid #ffffffd6",
        }}
      />

      <div className="wrapper">
        <header className="header">
          <div className="heading">
            <h1 className="title">I take pictures.</h1>
            <h5 className="subtitle">
              photographic experiments by Alessandro Di Tecco.
            </h5>
          </div>
        </header>

        <div className="container">
          {/* TODO sorting */}
          {[...data.allFile.edges].sort().map((image, i) => (
            <div
              key={i}
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
