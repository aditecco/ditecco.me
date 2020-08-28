/* ---------------------------------
Resume
--------------------------------- */

import React, { ReactElement, useState } from "react"
import {
  Link,
  GatsbyGraphQLInputObjectType,
  graphql,
  GatsbyGraphQLObjectType,
} from "gatsby"
import Footer from "../components/footer"
import { Helmet } from "react-helmet"
// import { stories } from "../content/data"
import "../styles/resume.scss"
import itFlag from "../images/resume/it-flag.svg"
import usFlag from "../images/resume/us-flag.svg"
import bullet from "../images/resume/bullet-01.svg"
import Layout from "../components/layout"

interface IOwnProps {}

interface IGatsbyProps {
  data // TODO the right type?
}

interface IGraphQLQueryResponseNode {
  node: {
    id: string
    html: string
    frontmatter: {
      order: number
      title: string
      subtitle: string
    }
  }
}

type TProps = IOwnProps & IGatsbyProps

export default function Resume({ data }: TProps): ReactElement {
  const currYear = 2020
  const startYear = 2011
  const since = currYear - startYear
  // - var encodedEmail = '&#x61;&#x6C;&#x65;&#x73;&#x73;&#x61;&#x6E;&#x64;&#x72;&#x6F;&#x40;&#x64;&#x69;&#x74;&#x65;&#x63;&#x63;&#x6F;&#x2E;&#x6D;&#x65;'

  const {
    allMarkdownRemark: { edges: stories },
  } = data

  const [visibleStory, toggleVisibleStory] = useState({})
  const [lang, setLang] = useState("us")

  /**
   * handles language switching
   */
  function handleChangeLanguage() {
    setLang(lang => (lang === "us" ? "it" : "us"))
  }

  /**
   * renders data into resume stories
   */
  function renderStories(
    { node: { id, html, frontmatter } }: IGraphQLQueryResponseNode,
    i
  ) {
    return (
      <div
        key={i}
        className="story-block"
        onClick={() =>
          toggleVisibleStory(visibleStories => ({
            ...visibleStories,
            [id]: !visibleStories[id],
          }))
        }
      >
        <header className="story-block-header">
          <h2>
            {frontmatter.title}
            <span className="rhide"></span>
            <br className="rbreak" />
          </h2>

          <h4>{frontmatter.subtitle}</h4>
        </header>

        {visibleStory[id] && (
          <div className="story-block-body">
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        )}
      </div>
    )
  }

  return (
    <Layout title="Resume">
      <div className="Resume">
        {/* <Helmet
      >
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Arvo:400|Kaushan+Script:400|Karla:400"
          type="text/css"
        />
      </Helmet> */}

        <nav className="page-controls">
          <ul className="subtext">
            <li>
              <Link to="/">&#8592; Back to homepage</Link>
            </li>

            <li>
              <button className="lang-switcher" onClick={handleChangeLanguage}>
                {lang === "us" ? "Versione italiana" : "English version"}
              </button>

              <img
                src={lang === "us" ? itFlag : usFlag}
                alt="change language"
                width="16"
                height="auto"
              />
            </li>
          </ul>
        </nav>

        <button className="elevator" onClick={() => window.scrollTo(0, 0)}>
          &#x25B2; top
        </button>

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
                    From {startYear} to 2016 I’ve been designing interfaces for
                    a diverse range of digital products.
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
              {/* WORK */}
              <header className="section-header">
                <h1 className="section-heading">
                  <span className="underline"></span>Work experience
                </h1>

                <p>
                  Here's a story of my professional path so far; click on a
                  section to show/hide its contents.
                </p>

                <button onClick={handleToggleAll}>TODO toggle all</button>
              </header>

              {stories.slice(0, 10).map(renderStories)}

              <hr className="separator" />

              {/* OTHER XP */}
              <header className="section-header">
                <h1 className="section-heading">
                  <span className="underline"></span>Other experiences
                </h1>
              </header>

              {stories.slice(10).map(renderStories)}
            </section>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query {
    allMarkdownRemark(sort: { fields: frontmatter___order }) {
      edges {
        node {
          id
          html
          frontmatter {
            order
            title
            subtitle
          }
        }
      }
    }
  }
`
