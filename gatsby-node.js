/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

const path = require("path")
const { createFilePath } = require(`gatsby-source-filesystem`)

/**
 * onCreateNode
 */
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions

  // TODO execute only on /blog posts
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `content` })

    const slugParts = slug.split("--")

    createNodeField({
      node,
      name: `slug`,
      value:
        "/blog/" + slugParts.shift().match(/[\d]{4}/g) + "/" + slugParts.pop(),
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
