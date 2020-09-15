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
  if (
    node.internal.type === `MarkdownRemark`
    // && node.sourceInstanceName === "blog"
  ) {
    const slug = createFilePath({ node, getNode, basePath: `content/blog/` })

    // blog posts will be conventionally named
    // using this format: DD-MM-YYYY--title
    const slugParts = slug.split("--")

    createNodeField({
      node,
      name: `slug`,
      value: slugParts.shift().match(/[\d]{4}/g) + "/" + slugParts.pop(),
    })
  }
}

/**
 * createPages
 */
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  // blog pages
  const blogPages = await graphql(`
    {
      allFile(filter: { sourceInstanceName: { eq: "blog" } }) {
        edges {
          node {
            childMarkdownRemark {
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
    }
  `)

  const iTakePicturesPages = await graphql(`
    query {
      allMarkdownRemark(
        filter: {
          fileAbsolutePath: { glob: "/**/projects/itakepictures/**/*" }
        }
      ) {
        edges {
          node {
            id
            frontmatter {
              author
              caption
              image {
                childImageSharp {
                  fluid {
                    originalName
                  }
                }
              }
              order
              timestamp
              title
            }
          }
        }
      }
    }
  `)

  blogPages.data.allFile.edges.forEach(({ node }) => {
    createPage({
      // TODO add year /blog/<year>/<slug>
      path: `/blog/${node.childMarkdownRemark.fields.slug}`,
      component: path.resolve(`./src/templates/BlogPost/BlogPost.tsx`),
      context: {
        node,
      },
    })
  })

  iTakePicturesPages.data.allMarkdownRemark.edges.forEach(({ node }) => {
    const slug = node.frontmatter.caption.toLowerCase().replace(" ", "-")
    createPage({
      path: `/projects/itakepictures/photo/` + slug,
      component: path.resolve(
        `./src/templates/ITakePicturesPost/ITakePicturesPost.tsx`
      ),
      context: {
        node,
        slug,
      },
    })
  })
}
