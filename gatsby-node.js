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
    {
      allFile(
        filter: { sourceInstanceName: { eq: "itakepictures" } }
        sort: { fields: childMarkdownRemark___frontmatter___order }
      ) {
        edges {
          node {
            childMarkdownRemark {
              id
              frontmatter {
                author
                caption
                order
                timestamp
                title
                image {
                  childImageSharp {
                    fluid {
                      originalName
                    }
                  }
                }
              }
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

  iTakePicturesPages.data.allFile.edges.forEach(({ node }) => {
    // TODO create slugs w/ createFilePath
    const slug = node.childMarkdownRemark.frontmatter.caption
      .toLowerCase()
      .replace(" ", "-")
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
