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
      <i className="material-icons">keyboard_backspace</i>
      <Link to={target}>
        <span className="label">{label || "Back"}</span>
      </Link>
    </div>
  )
}
