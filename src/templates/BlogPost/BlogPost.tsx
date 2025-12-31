/* ---------------------------------
BlogPost
--------------------------------- */

import React, { ReactElement } from "react"
import "./BlogPost.scss"
import { graphql } from "gatsby"
import Layout from "../../components/layout"
import { TWITTER_SHARE_URL, TWITTER_FOLLOW_URL } from "../../constants"
import BackButton from "../../components/BackButton/BackButton"
import PortableText from "../../components/PortableText/PortableText"

interface IOwnProps {}

interface IGatsbyProps {
  data: {
    sanityBlogPost: {
      _id: string
      title: string
      subtitle?: string
      publishedAt: string
      language: string
      estimatedReadingTime?: number
      author: {
        name: string
      }
      tags?: Array<{
        title: string
      }>
      featuredImage?: {
        asset: any
        alt: string
      }
      _rawContent: any[]
    }
  }
}

type TProps = IOwnProps & IGatsbyProps

export default function BlogPost({ data }: TProps): ReactElement {
  const post = data.sanityBlogPost
  const timestamp = new Date(post.publishedAt)
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "/")

  return (
    <Layout title={post.title}>
      <div className="BlogPost">
        <article className="blog-post-content">
          <header className="blog-post-header">
            <div className="blog-post-header-text container">
              <BackButton target="/blog" label="index" />

              <h1 className="blog-post-title">{post.title}</h1>

              <div className="blog-post-meta">
                <h5 className="blog-post-timestamp">{timestamp}</h5>

                <h5 className="blog-post-author">{post.author.name}</h5>

                {post.estimatedReadingTime && (
                  <span className="blog-post-time-to-read">
                    Reading time: {post.estimatedReadingTime} minute
                  </span>
                )}

                <span className="blog-post-lang">
                  {post.language === "EN" ? "English" : "Italiano"}
                </span>
              </div>
            </div>
          </header>

          {/* POST CONTENT */}
          <div className="blog-post-body container">
            <PortableText value={post._rawContent} />
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="blog-post-footer container">
              <h6 className="footer-header">Filed under:</h6>

              <ul className="blog-post-tags">
                {post.tags.map((tag, index) => (
                  <li key={index} className="blog-post-tag">
                    {tag.title}
                  </li>
                ))}
              </ul>

              <div className="blog-post-notes"></div>
            </div>
          )}
        </article>

        <ul className="blog-post-cta container">
          <li className="blog-post-cta-item">
            <a href={TWITTER_SHARE_URL} className="blog-post-cta-button">
              Share on Twitter
            </a>
          </li>
          <li className="blog-post-cta-item">
            <a href={TWITTER_FOLLOW_URL} className="blog-post-cta-button">
              Follow {post.author.name}
            </a>
          </li>
        </ul>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query BlogPostQuery($id: String!) {
    sanityBlogPost(_id: { eq: $id }) {
      _id
      title
      subtitle
      publishedAt
      language
      estimatedReadingTime
      author {
        name
      }
      tags {
        title
      }
      featuredImage {
        asset {
          gatsbyImageData(width: 1200)
        }
      }
      _rawContent(resolveReferences: { maxDepth: 10 })
    }
  }
`
