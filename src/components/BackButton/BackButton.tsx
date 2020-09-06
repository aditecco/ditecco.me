/* ---------------------------------
BackButton
--------------------------------- */

import React, { ReactElement } from "react"
import { Link } from "gatsby"
import "./BackButton.scss"

interface IOwnProps {
  target: string
  label?: string
}

export default function BackButton({ target, label }: IOwnProps): ReactElement {
  return (
    <div className="BackButton">
      <i className="material-icons">keyboard_backspace</i>
      <Link to={target}>
        <span className="label">{label || "Back"}</span>
      </Link>
    </div>
  )
}
