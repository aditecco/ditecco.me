/* ---------------------------------
BackButton
--------------------------------- */

import type { CSSProperties } from "react"
import "./BackButton.scss"

type Props = {
  target: string
  label?: string
  style?: CSSProperties
}

export default function BackButton({ target, label, style }: Props) {
  return (
    <div className="BackButton" style={style || {}}>
      <a href={target} className="BackButtonLink">
        <i className="material-icons">keyboard_backspace</i>
        <span className="label">{label || "Back"}</span>
      </a>
    </div>
  )
}
