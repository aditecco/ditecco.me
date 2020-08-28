/* ---------------------------------
Footer
--------------------------------- */

import React, { ReactElement } from "react"
import { useStaticQuery, graphql } from "gatsby"

interface IOwnProps {}

export default function Footer(props: IOwnProps): ReactElement {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            author
            currentYear
            version
          }

          buildTime
        }
      }
    `
  )

  return (
    <footer>
      <small>
        &copy; {site?.siteMetadata?.currentYear} {site?.siteMetadata?.author},
        All rights reserved. &mdash; v.
        {site?.siteMetadata?.version} &bull; {site?.buildTime}
      </small>
    </footer>
  )
}
