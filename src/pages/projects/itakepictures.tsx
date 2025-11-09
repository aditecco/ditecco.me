/* ---------------------------------
ITakePictures
--------------------------------- */

import React, { ReactElement } from "react"
import { graphql, Link } from "gatsby"
import { GatsbyImage, getImage, IGatsbyImageData } from "gatsby-plugin-image"
import "../../styles/itakepictures.scss"
import BackButton from "../../components/BackButton/BackButton"

interface IOwnProps {}

interface IGatsbyProps {
  data: {
    allFile: {
      edges: IGraphQLQueryResponseNode[]
    }
  }
}

interface IGraphQLQueryResponseNode {
  node: {
    childMarkdownRemark: {
      id: string
      frontmatter: {
        author: string
        caption: string
        order: number
        timestamp: string
        title: string
        image: {
          childImageSharp: {
            gatsbyImageData: IGatsbyImageData
          }
        }
      }
    }
  }
}

type TProps = IOwnProps & IGatsbyProps

export default function ITakePictures({
  data: {
    allFile: { edges: images },
  },
}: TProps): ReactElement {
  function sortImages(
    a: IGraphQLQueryResponseNode,
    b: IGraphQLQueryResponseNode,
  ) {
    const a_order = a.node.childMarkdownRemark.frontmatter.order
    const b_order = b.node.childMarkdownRemark.frontmatter.order
    return a_order - b_order
  }

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
          {[...images]
            .sort(sortImages)
            .map((_image: IGraphQLQueryResponseNode) => {
              const {
                node: {
                  childMarkdownRemark: { id, frontmatter },
                },
              } = _image

              const { author, caption, order, timestamp, title, image } =
                frontmatter

              const gatsbyImage = getImage(image)
              if (!gatsbyImage) return null

              // Detect wide images from caption/title instead of filename
              const isWide =
                caption.toLowerCase().includes("wd") ||
                title.toLowerCase().includes("wd")

              return (
                <div
                  key={id}
                  className={isWide ? "module full" : "module half"}
                >
                  <Link
                    to={`/projects/itakepictures/photo/${caption
                      .toLowerCase()
                      .replace(" ", "-")}`}
                    state={{
                      image: gatsbyImage,
                    }}
                  >
                    <GatsbyImage image={gatsbyImage} alt={title} />

                    <div className="caption">
                      <span>{caption}</span>
                    </div>
                  </Link>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}

// TODO take directly from sharp
export const query = graphql`
  query {
    allFile(
      filter: { sourceInstanceName: { eq: "itakepictures" } } # sort: { fields: childMarkdownRemark___frontmatter___order }
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
                  gatsbyImageData(quality: 70, layout: FULL_WIDTH)
                }
              }
            }
          }
        }
      }
    }
  }
`
