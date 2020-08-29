/* ---------------------------------
Footer
--------------------------------- */

import React, { ReactElement } from "react"
import { useStaticQuery, graphql } from "gatsby"
import "../styles/footer.scss"

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
        All rights reserved. &bull; v{site?.siteMetadata?.version} &bull; last
        build @{site?.buildTime} &bull; hand-coded with love &{" "}
        <a href="https://www.gatsbyjs.com/" target="_blank">
          Gatsby
        </a>
      </small>
    </footer>
  )
}
