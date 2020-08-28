/* ---------------------------------
Resume
--------------------------------- */

import React, { ReactElement, useState } from "react"
import { Link } from "gatsby"
import Footer from "../components/footer"
import { Helmet } from "react-helmet"
import { stories } from "../data/data"
import "../styles/resume.scss"

interface IOwnProps {}

export default function Resume(props: IOwnProps): ReactElement {
  const currYear = 2020
  const startYear = 2011
  const since = currYear - startYear
  // - var encodedEmail = '&#x61;&#x6C;&#x65;&#x73;&#x73;&#x61;&#x6E;&#x64;&#x72;&#x6F;&#x40;&#x64;&#x69;&#x74;&#x65;&#x63;&#x63;&#x6F;&#x2E;&#x6D;&#x65;'

  const [visibleStory, setVisibleStory] = useState({})

  return (
    <div className="Resume">
      <Helmet>
        {/* TODO move to SEO */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Arvo:400|Kaushan+Script:400|Karla:400"
          type="text/css"
        />
      </Helmet>

      <nav className="page-controls">
        <ul className="subtext">
          <li>
            <Link to="/">&#8592; Back to homepage</Link>
          </li>

          <li>
            <button className="lang-switcher">Versione italiana</button>

            <img
              src="img/it-flag.svg"
              alt="change language"
              width="16"
              height="auto"
            />
          </li>
        </ul>
      </nav>

      <button className="elevator">&#x25B2; top</button>

      <div className="notification-bar" />

      {/* CONTENT */}
      <div className="wrapper">
        <div className="hero">
          <h1 className="hero-head">R&eacute;sum&eacute;</h1>
          <h4 className="hero-sub-head">of Alessandro Di Tecco</h4>
        </div>

        <div className="container">
          {/* QUICK-OUTLINE */}
          <section className="quick-outline">
            <div className="outline-block quick-outline--profile">
              <h2 className="outline-block-list-heading">Profile</h2>

              <ul>
                <li>
                  <h3>Front-End Developer</h3>I code web &amp; mobile layouts
                  and interfaces, with modern CSS and JavaScript.
                </li>

                <li>
                  <h3>Design background</h3>
                  From {startYear} to 2016 I’ve been designing interfaces for a
                  diverse range of digital products.
                </li>
              </ul>
            </div>

            <div className="outline-block quick-outline--skills">
              <h2 className="outline-block-list-heading">Skills</h2>

              <h4>Areas/Languages</h4>
              <ul className="skill-list">
                {[
                  "CSS3",
                  "Sass",
                  "JavaScript ES6",
                  "React",
                  "HTML5",
                  "UI Design",
                ].map(skill => (
                  <li className="skill-list-item">{skill}</li>
                ))}
              </ul>

              <h4>Toolbox</h4>
              <ul className="skill-list">
                {[
                  "Visual Studio Code",
                  "Sublime Text",
                  "git",
                  "fish shell",
                  "Unix CLI",
                  "Dev Tools",
                  "npm, yarn",
                  "gulp",
                  "Sketch",
                  "Adobe XD",
                  "Photoshop",
                  "macOS",
                ].map(skill => (
                  <li className="skill-list-item">{skill}</li>
                ))}
              </ul>
            </div>

            <div className="outline-block quick-outline--contact">
              <h2 className="outline-block-list-heading">Contacts</h2>

              <div className="quick-outline--contact-inner">
                <p>
                  The best way to get in touch with me is via good-old e-mail.
                </p>

                <a
                  href="mailto:&#x61;&#x6C;&#x65;&#x73;&#x73;&#x61;&#x6E;&#x64;&#x72;&#x6F;&#x40;&#x64;&#x69;&#x74;&#x65;&#x63;&#x63;&#x6F;&#x2E;&#x6D;&#x65;"
                  className="cta-button contact-button"
                >
                  Contact me
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="wrapper">
        <div className="container">
          {/* FULL STORY */}
          <section className="full-story">
            <header className="section-header">
              <h1 className="section-heading">
                <span className="underline"></span>Work experience
              </h1>

              <p>
                Here's a story of my professional path so far; click on a
                section to show/hide its contents.
              </p>
            </header>

            {stories.map(story => (
              <div
                className="story-block"
                onClick={() =>
                  setVisibleStory(visibleStories => ({
                    ...visibleStories,
                    [story.title]: !visibleStories[story.title],
                  }))
                }
              >
                <header className="story-block-header">
                  <h2>
                    {story.title}
                    <span className="rhide"></span>
                    <br className="rbreak" />
                  </h2>

                  <h4>{story.subtitle}</h4>
                </header>

                {visibleStory[story.title] && (
                  <div className="story-block-body">
                    <p>{story.body}</p>
                  </div>
                )}
              </div>
            ))}
          </section>
        </div>
      </div>

      <Footer />
    </div>
  )
}
