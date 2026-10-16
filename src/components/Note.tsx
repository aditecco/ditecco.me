/* ---------------------------------
Note
--------------------------------- */

import BackButton from "./BackButton/BackButton"
import PortableText from "./PortableText/PortableText"
import type { Note as NoteData } from "../lib/content"
import { TWITTER_FOLLOW_URL, TWITTER_SHARE_URL } from "../lib/site"
import "./Note.scss"

type Props = {
  note: NoteData
}

export default function Note({ note }: Props) {
  const timestamp = new Date(note.publishedAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  return (
    <div className="Note">
      <article className="blog-post-content">
        <header className="blog-post-header">
          <div className="blog-post-header-text container">
            <BackButton target="/notes/" label="index" />

            <h1 className="blog-post-title">{note.title}</h1>

            <div className="blog-post-meta">
              <h5 className="blog-post-timestamp">{timestamp}</h5>

              <h5 className="blog-post-author">{note.author.name}</h5>

              {note.estimatedReadingTime && (
                <span className="blog-post-time-to-read">
                  Reading time: {note.estimatedReadingTime} minute
                </span>
              )}

              <span className="blog-post-lang">
                {note.language === "EN" ? "English" : "Italiano"}
              </span>
            </div>
          </div>
        </header>

        <div className="blog-post-body container">
          <PortableText value={note.content} />
        </div>

        {note.tags.length > 0 && (
          <div className="blog-post-footer container">
            <h6 className="footer-header">Filed under:</h6>

            <ul className="blog-post-tags">
              {note.tags.map(tag => (
                <li key={tag} className="blog-post-tag">
                  {tag}
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
            Follow {note.author.name}
          </a>
        </li>
      </ul>
    </div>
  )
}
