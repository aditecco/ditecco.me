/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

// exports.onCreateNode = ({ node }) => {
// }

const path = require("path")

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
      path: `/blog/${node.frontmatter.title
        .toLowerCase()
        .replace(" ", "-")
        .replace("!", "")}/`,
      component: path.resolve(`./src/templates/BlogPost/BlogPost.tsx`),
      context: {
        node,
      },
    })
  })
}
