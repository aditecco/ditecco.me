/* ---------------------------------
ITakePicturesPost
--------------------------------- */

import React, { ReactElement } from "react"
import { GatsbyImage } from "gatsby-plugin-image"
import BackButton from "../../components/BackButton/BackButton"
import "./ITakePicturesPost.scss"

interface IOwnProps {}

interface IGatsbyProps {
  location: {
    state?: {
      image?: any
    }
  }
  pageContext: {
    node: {
      childMarkdownRemark: {
        id: string
        frontmatter: {
          author: string
          caption: string
          image: string
          order: number
          timestamp: string
          title: string
        }
      }
    }
  }
}

type TProps = IOwnProps & IGatsbyProps

export default function ITakePicturesPost({
  location,
  pageContext: {
    node: {
      childMarkdownRemark: { frontmatter },
    },
  },
}: TProps): ReactElement {
  return (
    <div className="ITakePicturesPost">
      <BackButton
        target="/projects/itakepictures"
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
        <header className="postHeader">
          <h3 className="postTitle">{frontmatter.caption}</h3>
        </header>

        <div className="imageContainer">
          {/* TODO */}
          {location.state && location.state.image && (
            <GatsbyImage
              image={location.state.image}
              alt={frontmatter.caption}
            />
          )}
        </div>
      </div>
    </div>
  )
}
