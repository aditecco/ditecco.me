/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

// exports.onCreateNode = ({ node }) => {
// }

const path = require("path")
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `pages/blog` })

    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(`
    query {
      allMarkdownRemark(
        filter: { fileAbsolutePath: { glob: "/**/blog/**/*" } }
      ) {
        edges {
          node {
            id
            html
            timeToRead
            excerpt
            fields {
              slug
            }
            frontmatter {
              title
              subtitle
              language
              timestamp
              author
              tags
            }
          }
        }
      }
    }
  `)
  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.fields.slug,
      component: path.resolve(`./src/templates/BlogPost/BlogPost.tsx`),
      context: {
        node,
      },
    })
  })
}
