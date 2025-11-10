import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import { GITHUB_URL, TWITTER_URL } from "../constants"
import "../styles/home.scss"
import { GatsbyImage, getImage, IGatsbyImageData } from "gatsby-plugin-image"

interface IOwnProps {}

interface IGatsbyProps {
  data: {
    allFile: {
      edges: IGraphQLQueryResponseNode[]
    }
  }
}

interface IGraphQLQueryResponseNode {
  node: {
    childMarkdownRemark: {
      id: string
      html: string
      frontmatter: {
        master: boolean
        expanded: boolean
        href: string
        title: string
        subtitle: string
        body: string
        tags: string[]
        heroImg: {
          childImageSharp: {
            gatsbyImageData: IGatsbyImageData
          }
        }
        heroAlt: string
        order: number
      }
    }
  }
}

type TProps = IOwnProps & IGatsbyProps

export default function IndexPage({
  data: {
    allFile: { edges: cards },
  },
}: TProps) {
  function sortCards(
    a: IGraphQLQueryResponseNode,
    b: IGraphQLQueryResponseNode,
  ) {
    const a_order = a.node.childMarkdownRemark.frontmatter.order
    const b_order = b.node.childMarkdownRemark.frontmatter.order
    return a_order - b_order
  }

  return (
    <Layout title="Home">
      <div className="Home">
        <main className="card-list-container">
          <ul className="card-list">
            {[...cards]
              .sort(sortCards)
              .map((card: IGraphQLQueryResponseNode) => {
                const {
                  node: {
                    childMarkdownRemark: { id, html: __html, frontmatter },
                  },
                } = card

                const {
                  master,
                  expanded,
                  href,
                  title,
                  subtitle,
                  body,
                  tags,
                  heroImg,
                  heroAlt,
                } = frontmatter

                return (
                  <li
                    key={id}
                    className={`card-list-item${
                      master
                        ? " card-list-item--master card-list-item--3rows"
                        : expanded
                          ? " card-list-item--2rows"
                          : ""
                    }`}
                  >
                    <Link to={href}>
                      <article>
                        {master ? (
                          <div
                            // TODO convert to Img?
                            className="card-list-item-hero"
                          >
                            <h2>
                              Hi, I'm Alessandro
                              <br />
                              Di Tecco.
                            </h2>
                          </div>
                        ) : expanded ? (
                          <div className="card-list-item-hero">
                            {heroImg &&
                              (() => {
                                const image = getImage(heroImg)
                                return image ? (
                                  <GatsbyImage
                                    image={image}
                                    alt={heroAlt || ""}
                                  />
                                ) : null
                              })()}
                          </div>
                        ) : null}

                        <div className="card-list-item-body">
                          {master && (
                            <div
                              className="post-html"
                              dangerouslySetInnerHTML={{ __html }}
                            />
                          )}

                          {subtitle && <h5>{subtitle}</h5>}
                          {title && <h3>{title}</h3>}
                          {body && <p>{body}</p>}

                          {tags.length
                            ? tags.map((tag, i) => (
                                <span key={i} className="card-list-item-tag">
                                  {tag}
                                </span>
                              ))
                            : null}
                        </div>

                        {master && (
                          <div className="card-list-item-footer">
                            <h6>Find me also on:</h6>
                            <ul className="contact-list">
                              <li>
                                <a href="mailto:&#x61;&#x6C;&#x65;&#x73;&#x73;&#x61;&#x6E;&#x64;&#x72;&#x6F;&#x40;&#x64;&#x69;&#x74;&#x65;&#x63;&#x63;&#x6F;&#x2E;&#x6D;&#x65;">
                                  Email
                                </a>
                              </li>
                              <li>&middot;</li>
                              <li>
                                <a href={GITLAB_URL}>GitLab</a>
                              </li>
                              <li>&middot;</li>
                              <li>
                                <a href={TWITTER_URL}>Twitter</a>
                              </li>
                            </ul>
                          </div>
                        )}
                      </article>
                    </Link>
                  </li>
                )
              })}
          </ul>
        </main>
      </div>
    </Layout>
  )
}

// homepage query
export const query = graphql`
  query {
    allFile(
      filter: { sourceInstanceName: { eq: "home" } } # sort: { fields: childMarkdownRemark___frontmatter___order }
    ) {
      edges {
        node {
          childMarkdownRemark {
            id
            html
            frontmatter {
              master
              expanded
              href
              title
              subtitle
              body
              tags
              heroImg {
                childImageSharp {
                  gatsbyImageData(
                    width: 300
                    height: 208
                    quality: 90
                    layout: FIXED
                  )
                }
              }
              heroAlt
              order
            }
          }
        }
      }
    }
  }
`
