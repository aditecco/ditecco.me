import "@fontsource/bebas-neue"
import { useRef } from "react"
import { useSky } from "./useSky"
import "./AiCardHero.scss"

// the home card's hero: the cover's sky, with only the sky-side glitches
export default function AiCardHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useSky(canvasRef, {
    kinds: ["bands", "blocks"],
    pixelRatio: () => Math.min(window.devicePixelRatio || 1, 2),
  })

  return (
    <div className="AiCardHero" aria-hidden>
      <canvas ref={canvasRef} className="AiCardHero-sky" />
      <span className="AiCardHero-mark">AI</span>
    </div>
  )
}
