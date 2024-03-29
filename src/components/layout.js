/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import PropTypes from "prop-types"
import React from "react"
import Footer from "./Footer/Footer"
import SEO from "./seo"

const Layout = ({ title, children }) => {
  return (
    <>
      <SEO title={title} />
      {/* <Header siteTitle={data.site.siteMetadata.title} /> */}
      {children}
      <Footer />
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
