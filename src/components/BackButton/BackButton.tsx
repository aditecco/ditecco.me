/* ---------------------------------
BackButton
--------------------------------- */

import React, { ReactElement, CSSProperties } from "react"
import { Link } from "gatsby"
import "./BackButton.scss"

interface IOwnProps {
  target: string
  label?: string
  style?: CSSProperties
}

export default function BackButton({
  target,
  label,
  style,
}: IOwnProps): ReactElement {
  return (
    <div className="BackButton" style={style || {}}>
      <Link to={target} className="BackButtonLink">
        <i className="material-icons">keyboard_backspace</i>
        <span className="label">{label || "Back"}</span>
      </Link>
    </div>
  )
}
