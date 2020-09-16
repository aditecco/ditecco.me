/* ---------------------------------
ITakePictures
--------------------------------- */

import React, { ReactElement } from "react"
import { graphql, Link } from "gatsby"
import Img, { FluidObject } from "gatsby-image"
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
            fluid: FluidObject
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
  function sortImages(a, b) {
    const {
      node: {
        childMarkdownRemark: {
          frontmatter: { order: a_order },
        },
      },
    } = a

    const {
      node: {
        childMarkdownRemark: {
          frontmatter: { order: b_order },
        },
      },
    } = b

    if (a_order < b_order) return -1
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

              const {
                author,
                caption,
                order,
                timestamp,
                title,
                image,
              } = frontmatter

              return (
                <div
                  key={id}
                  className={
                    image.childImageSharp.fluid.originalName.includes("-wd")
                      ? "module full"
                      : "module half"
                  }
                >
                  <Link
                    to={`/projects/itakepictures/photo/${caption
                      .toLowerCase()
                      .replace(" ", "-")}`}
                    state={{
                      image: image.childImageSharp.fluid,
                    }}
                  >
                    <Img
                      fluid={image.childImageSharp.fluid}
                      fadeIn
                      alt={title}
                    />

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
      filter: { sourceInstanceName: { eq: "itakepictures" } }
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
                  fluid(quality: 70) {
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
