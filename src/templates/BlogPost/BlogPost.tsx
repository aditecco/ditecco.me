/* ---------------------------------
BlogPost
--------------------------------- */

import React, { ReactElement } from "react"
import "./BlogPost.scss"
import { Link } from "gatsby"
import Layout from "../../components/layout"
import { TWITTER_SHARE_URL, TWITTER_FOLLOW_URL } from "../../constants"
import BackButton from "../../components/BackButton/BackButton"

interface IOwnProps {}

interface IGatsbyProps {
  pageContext: {
    node: {
      childMarkdownRemark: {
        id: string
        html: string
        timeToRead: number
        excerpt: string
        frontmatter: {
          title: string
          subtitle: string
          language: string
          timestamp: string
          author: string
          tags: string[]
        }
      }
    }
  }
}

type TProps = IOwnProps & IGatsbyProps

export default function BlogPost({
  pageContext: { node },
}: TProps): ReactElement {
  const {
    childMarkdownRemark: {
      frontmatter: { author, language, subtitle, title, timestamp, tags },
    },
  } = node

  // TMP
  const bgImage = undefined

  return (
    <Layout title={title}>
      <div className="BlogPost">
        <article className="blog-post-content">
          <header
            className="blog-post-header"
            // TODO
            style={
              bgImage ? { background: `url(${bgImage})`, color: "#efefef" } : {}
            }
          >
            <div className="blog-post-header-text container">
              <BackButton target="/blog" label="index" />

              <h1 className="blog-post-title">{title}</h1>

              <div className="blog-post-meta">
                <h5 className="blog-post-timestamp">{timestamp}</h5>

                <h5 className="blog-post-author">{author}</h5>

                <span className="blog-post-time-to-read">
                  Reading time: {node.childMarkdownRemark.timeToRead} minute
                </span>

                <span className="blog-post-lang">
                  {language === "EN" ? "English" : "Italiano"}
                </span>
              </div>
            </div>
          </header>

          {/* POST CONTENT */}
          <div
            className="blog-post-body container"
            dangerouslySetInnerHTML={{ __html: node.childMarkdownRemark.html }}
          />

          <div className="blog-post-footer container">
            <h6 className="footer-header">Filed under:</h6>

            <ul className="blog-post-tags">
              {tags.map(tag => (
                <li className="blog-post-tag">{tag}</li>
              ))}
            </ul>

            <div className="blog-post-notes"></div>
          </div>
        </article>

        <ul className="blog-post-cta container">
          <li className="blog-post-cta-item">
            <a href={TWITTER_SHARE_URL} className="blog-post-cta-button">
              Share on Twitter
            </a>
          </li>
          <li className="blog-post-cta-item">
            <a href={TWITTER_FOLLOW_URL} className="blog-post-cta-button">
              Follow {author}
            </a>
          </li>
        </ul>
      </div>
    </Layout>
  )
}
