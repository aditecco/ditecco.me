/* ---------------------------------
Resume
--------------------------------- */

import { graphql, Link } from "gatsby"
import React, { ReactElement, useState } from "react"
import Layout from "../components/layout"
import itFlag from "../images/resume/it-flag.svg"
import usFlag from "../images/resume/us-flag.svg"
import "../styles/resume.scss"

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
      language: string
    }
  }
}

type TProps = IOwnProps & IGatsbyProps

export default function Resume({ data }: TProps): ReactElement {
  const [visibleStory, toggleVisibleStory] = useState({})
  const [lang, setLang] = useState("EN")

  // TODO
  const currYear = 2020
  const startYear = 2011
  const since = currYear - startYear
  // - var encodedEmail = '&#x61;&#x6C;&#x65;&#x73;&#x73;&#x61;&#x6E;&#x64;&#x72;&#x6F;&#x40;&#x64;&#x69;&#x74;&#x65;&#x63;&#x63;&#x6F;&#x2E;&#x6D;&#x65;'

  const {
    allMarkdownRemark: { edges: stories },
  } = data

  const storyIds = stories
    .filter(filterStoriesByLanguage)
    .map((story: IGraphQLQueryResponseNode) => story.node.id)

  /**
   * handles language switching
   */
  function handleChangeLanguage() {
    setLang(lang => (lang === "EN" ? "IT" : "EN"))
    // also reset the toggle state
    toggleVisibleStory({})
  }

  /**
   * toggles visibility for all stories
   */
  function handleToggleAll(e) {
    e.preventDefault()

    const keys = Object.keys(visibleStory)

    function reduceFn(value: boolean) {
      return function (acc, id) {
        acc[id] = value
        return acc
      }
    }

    // initial state, toggle all open
    if (!keys.length) {
      toggleVisibleStory(storyIds.reduce(reduceFn(true), {}))
      return
    }

    // all are open: toggle all closed
    if (keys.length === storyIds.length && keys.every(k => visibleStory[k])) {
      toggleVisibleStory(storyIds.reduce(reduceFn(false), {}))
      return
    }

    // all are closed: toggle all open
    if (keys.length === storyIds.length && keys.every(k => !visibleStory[k])) {
      toggleVisibleStory(storyIds.reduce(reduceFn(true), {}))
      return
    }

    // some are open: toggle all open
    if (keys.some(k => visibleStory[k])) {
      toggleVisibleStory(storyIds.reduce(reduceFn(true), {}))
      return
    }
  }

  /**
   * filters stories based on language
   */
  function filterStoriesByLanguage({ node }: IGraphQLQueryResponseNode) {
    return node.frontmatter.language === lang
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
          {/* indicator on 1st story */}
          {frontmatter.order === 1 && (
            <span className="story-block-current-indicator" />
          )}

          <h2>
            {frontmatter.title}
            {/* TODO */}
            {/* <span className="rhide"></span>
            <br className="rbreak" /> */}
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
        {/* NOTIFS & UI HELPERS */}
        <button className="elevator" onClick={() => window.scrollTo(0, 0)}>
          &#x25B2; top
        </button>

        {/* TODO */}
        <div className="notification-bar" />

        {/* NAV */}
        <nav className="page-controls">
          <ul className="subtext">
            <li>
              <Link to="/">&#8592; Back to homepage</Link>
            </li>

            <li>
              <button className="lang-switcher" onClick={handleChangeLanguage}>
                {lang === "EN" ? "Versione italiana" : "English version"}

                <img
                  src={lang === "EN" ? itFlag : usFlag}
                  alt="change language"
                  width="16"
                  height="auto"
                />
              </button>
            </li>
          </ul>
        </nav>

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
                <h2 className="outline-block-list-heading">
                  {lang === "EN" ? `Profile` : `Profilo`}
                </h2>

                <ul>
                  {lang === "EN" ? (
                    <>
                      <li>
                        <h3>Front-End Developer</h3>I code web &amp; mobile
                        layouts and interfaces, with modern CSS and JavaScript.
                      </li>

                      <li>
                        <h3>Design background</h3>
                        From {startYear} to 2016 I’ve been designing interfaces
                        for a diverse range of digital products.
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <h3>Front-End Developer</h3>
                        Sviluppo layout e interfacce web &amp; mobile, con i
                        pi&ugrave; recenti standard CSS e JavaScript.
                      </li>

                      <li>
                        <h3>Design background</h3>
                        Dal {startYear} al 2016 ho creato UI Design per una
                        vasta gamma di prodotti digitali.
                      </li>
                    </>
                  )}
                </ul>
              </div>

              <div className="outline-block quick-outline--skills">
                <h2 className="outline-block-list-heading">Skills</h2>

                <h4>Areas/Languages</h4>
                <ul className="skill-list">
                  {[
                    "React",
                    "JavaScript ES6",
                    "TypeScript",
                    "CSS3",
                    "Sass",
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
                    "git",
                    "fish shell",
                    "Unix CLI",
                    "Dev Tools",
                    "npm, yarn",
                    "gulp, webpack, parcel",
                    "Cypress",
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
                <h2 className="outline-block-list-heading">
                  {lang === "EN" ? `Contacts` : `Contatti`}
                </h2>

                <div className="quick-outline--contact-inner">
                  <p>
                    {lang === "EN"
                      ? `The best way to get in touch with me is via good-old e-mail.`
                      : `Il modo migliore per contattarmi è via e-mail.`}
                  </p>

                  <a
                    href="mailto:&#x61;&#x6C;&#x65;&#x73;&#x73;&#x61;&#x6E;&#x64;&#x72;&#x6F;&#x40;&#x64;&#x69;&#x74;&#x65;&#x63;&#x63;&#x6F;&#x2E;&#x6D;&#x65;"
                    className="cta-button contact-button"
                  >
                    {lang === "EN" ? `Contact me` : `Contattami`}
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
                {lang === "EN" ? (
                  <>
                    <h1 className="section-heading">
                      <span className="underline">Work experience</span>
                    </h1>

                    <p>
                      Here's a timeline of my professional path; click on a
                      section to reveal its contents, or{" "}
                      <a
                        href="#"
                        className="toggleAllButton"
                        onClick={handleToggleAll}
                      >
                        toggle all.
                      </a>
                    </p>
                  </>
                ) : (
                  <>
                    <h1 className="section-heading">
                      <span className="underline">Esperienze lavorative</span>
                    </h1>

                    <p>
                      Segue una storia del mio percorso professionale fino ad
                      oggi; clicca su una sezione per rivelare i suoi contenuti,
                      o{" "}
                      <a
                        href="#"
                        className="toggleAllButton"
                        onClick={handleToggleAll}
                      >
                        mostra/nascondi tutti.
                      </a>
                    </p>
                  </>
                )}
              </header>

              {stories
                .filter(filterStoriesByLanguage)
                .slice(0, 10)
                .map(renderStories)}

              <hr className="separator" />

              {/* OTHER XP */}
              <header className="section-header">
                <h1 className="section-heading">
                  <span className="underline">
                    {lang === "EN" ? `Other experiences` : `Altre esperienze`}
                  </span>
                </h1>
              </header>

              {stories
                .filter(filterStoriesByLanguage)
                .slice(10)
                .map(renderStories)}
            </section>
          </div>
        </div>
      </div>
    </Layout>
  )
}

/* ---------------------------------
Resume query
--------------------------------- */

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
            language
          }
        }
      }
    }
  }
`
