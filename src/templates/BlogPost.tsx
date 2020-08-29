/* ---------------------------------
BlogPost
--------------------------------- */

import React, { ReactElement } from "react"

interface IOwnProps {}
interface IGatsbyProps {
  pageContext: {
    node: {
      excerpt: string
      html: string
      id: string
      timeToRead: number
      frontmatter: {
        title: string
        subtitle: string
        language: string
        timestamp: string
        author: string
      }
    }
  }
}
type TProps = IOwnProps & IGatsbyProps

export default function BlogPost({
  pageContext: { node },
}: TProps): ReactElement {
  return (
    <div>
      {node.frontmatter.title}
      {node.html}
    </div>
  )
}
