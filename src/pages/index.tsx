import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import { GITLAB_URL, TWITTER_URL } from "../constants"
import "../styles/home.scss"
import Img from "gatsby-image"

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
      frontmatter: {
        master: boolean
        expanded: boolean
        href: string
        title: string
        subtitle: string
        body: string
        tags: string[]
        heroImg: "" // TODO
        heroAlt: string
        order: number
        image: {
          childImageSharp: {
            fixed: {
              originalName: string
              // ...GatsbyImageSharpFixed
            }
          }
        }
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
  return (
    <Layout title="Home">
      <div className="Home">
        <main className="card-list-container">
          <ul className="card-list">
            {cards.map(card => {
              const {
                node: {
                  childMarkdownRemark: { id, frontmatter },
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
                        <div className="card-list-item-hero">
                          <h2>
                            Hi, I'm Alessandro
                            <br />
                            Di Tecco.
                          </h2>
                        </div>
                      ) : expanded ? (
                        <div className="card-list-item-hero">
                          <Img fixed={heroImg.childImageSharp.fixed} />
                        </div>
                      ) : null}

                      <div className="card-list-item-body">
                        {master && (
                          <>
                            <p>
                              Hi there! I'm Alessandro Di Tecco, front-end
                              developer.
                            </p>

                            <p>
                              I love the open web and I'm passionate about
                              building products &amp; experiences with code.
                            </p>

                            <p>
                              This website is a collection of my most
                              significant works and projects.
                            </p>

                            <p>
                              To get in touch with me you can{" "}
                              <a href="mailto:&#x61;&#x6C;&#x65;&#x73;&#x73;&#x61;&#x6E;&#x64;&#x72;&#x6F;&#x40;&#x64;&#x69;&#x74;&#x65;&#x63;&#x63;&#x6F;&#x2E;&#x6D;&#x65;">
                                send me an email
                              </a>{" "}
                              (old fashioned!)
                            </p>
                          </>
                        )}

                        {subtitle && <h5>{subtitle}</h5>}
                        {title && <h3>{title}</h3>}
                        {body && <p>{body}</p>}

                        {tags.length
                          ? tags.map(tag => (
                              <span className="card-list-item-tag">{tag}</span>
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
      filter: { absolutePath: { glob: "/**/content/home/*.md" } }
      sort: { fields: childMarkdownRemark___frontmatter___order }
    ) {
      edges {
        node {
          childMarkdownRemark {
            id
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
                  fixed(width: 300, height: 208) {
                    originalName
                    ...GatsbyImageSharpFixed
                  }
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
