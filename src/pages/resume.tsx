/* ---------------------------------
Resume
--------------------------------- */

import React, { ReactElement } from "react"
import { Link } from "gatsby"
import Footer from "../components/footer"
import { Helmet } from "react-helmet"
import "../styles/resume.scss"

interface IOwnProps {}

export default function Resume(props: IOwnProps): ReactElement {
  return (
    <>
      <Helmet>
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

      <Footer />
    </>
  )
}
