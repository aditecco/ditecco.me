require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  // Gatsby 5 config
  trailingSlash: "always",

  // metadata
  siteMetadata: {
    title: `ditecco.me`,
    description: `Personal website of Alessandro Di Tecco, Front-End Developer.`,
    author: `Alessandro Di Tecco`,
    version: "6",
    currentYear: new Date().getFullYear(),
  },

  // plugins
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-image`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-sass`,
    `gatsby-transformer-remark`,
    {
      resolve: "gatsby-source-sanity",
      options: {
        projectId: process.env.SANITY_PROJECT_ID,
        dataset: process.env.SANITY_DATASET,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `home`,
        path: `${__dirname}/src/content/home`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `itakepictures`,
        path: `${__dirname}/src/content/projects/itakepictures`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `itakepictures-images`,
        path: `${__dirname}/src/images/itakepictures`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `resume`,
        path: `${__dirname}/src/content/resume`,
      },
    },
  ],
}
