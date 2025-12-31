/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require("path")

/**
 * createPages
 */
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  // Sanity blog pages
  const sanityBlogPages = await graphql(`
    {
      allSanityBlogPost {
        nodes {
          _id
          slug {
            current
          }
          publishedAt
        }
      }
    }
  `)

  const iTakePicturesPages = await graphql(`
    {
      allFile(
        filter: { sourceInstanceName: { eq: "itakepictures" } }
        sort: { childMarkdownRemark: { frontmatter: { order: ASC } } }
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

  // Create Sanity blog post pages
  sanityBlogPages.data.allSanityBlogPost.nodes.forEach(post => {
    const year = new Date(post.publishedAt).getFullYear()

    createPage({
      path: `/blog/${year}/${post.slug.current}/`,
      component: path.resolve(`./src/templates/BlogPost/BlogPost.tsx`),
      context: {
        id: post._id,
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
        `./src/templates/ITakePicturesPost/ITakePicturesPost.tsx`,
      ),
      context: {
        node,
        slug,
      },
    })
  })
}
