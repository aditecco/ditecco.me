/* ---------------------------------
ITakePicturesPost
--------------------------------- */

import React, { ReactElement } from "react"
import Img from "gatsby-image"

interface IOwnProps {}

interface IGatsbyProps {
  location
  pageContext: {
    node: {
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

type TProps = IOwnProps & IGatsbyProps

export default function ITakePicturesPost({
  location,
  pageContext: {
    node: { frontmatter },
  },
}: TProps): ReactElement {
  return <Img fluid={location.state.image} />
}
