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
              photographic experiments <br className="mobileToggle" />
              by Alessandro Di Tecco.
            </h5>
          </div>
        </header>

        <div className="container">
          {data.allFile.edges.map(edge => (
            <div
              key={edge.node.childMarkdownRemark.id}
              className={
                edge.node.childMarkdownRemark.frontmatter.image.childImageSharp.fluid.originalName.includes(
                  "-wd"
                )
                  ? "module full"
                  : "module half"
              }
            >
              <Link
                to={`/projects/itakepictures/photo/${edge.node.childMarkdownRemark.frontmatter.caption
                  .toLowerCase()
                  .replace(" ", "-")}`}
                state={{
                  image:
                    edge.node.childMarkdownRemark.frontmatter.image
                      .childImageSharp.fluid,
                }}
              >
                <Img
                  fluid={
                    edge.node.childMarkdownRemark.frontmatter.image
                      .childImageSharp.fluid
                  }
                  fadeIn
                  alt={edge.node.childMarkdownRemark.frontmatter.title}
                />

                <div className="caption">
                  <span>
                    {edge.node.childMarkdownRemark.frontmatter.caption}
                  </span>
                </div>
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
    allFile(
      filter: {
        absolutePath: { glob: "/**/content/projects/itakepictures/*.md" }
      }
      sort: { fields: childMarkdownRemark___frontmatter___order }
    ) {
      edges {
        node {
          childMarkdownRemark {
            id
            frontmatter {
              author
              caption
              order
              timestamp
              title
              image {
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
      }
    }
  }
`
