import { ArrowLeft, ArrowRight } from "lucide-react"
import { useRef, useState, type CSSProperties } from "react"
import type { GlitchState } from "../../lib/ai-sky/glitch"
import { useSky } from "./useSky"

type Props = {
  allHref: string
  latestHref?: string
}

const KINDS = ["bands", "blocks", "ghost", "slice"] as const
const LINES = ["AI", "Creations"]

// deterministic 0..1 from a glitch seed, so a frozen frame stays put
function rand(seed: number, k: number) {
  const v = Math.sin(seed * 12.9898 + k * 78.233) * 43758.5453
  return v - Math.floor(v)
}

// a copy of the headline, shifted sideways and clipped to a horizontal strip
function ghostStyle(
  seed: number,
  dx: number,
  top: number,
  height: number,
): CSSProperties {
  if (!seed) return { display: "none" }

  const bottom = Math.max(0, 100 - top - height)
  return {
    transform: `translateX(${dx.toFixed(1)}px)`,
    clipPath: `inset(${top.toFixed(1)}% 0 ${bottom.toFixed(1)}% 0)`,
  }
}

function Ghost({
  className,
  style,
}: {
  className: string
  style: CSSProperties
}) {
  return (
    <div className={`AiCover-ghost ${className}`} style={style} aria-hidden>
      {LINES.map(line => (
        <span key={line}>{line}</span>
      ))}
    </div>
  )
}

export default function AiCover({ allHref, latestHref }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [playing, setPlaying] = useState<boolean | null>(null)
  const [glitch, setGlitch] = useState({ ghost: 0, slice: 0 })
  const { failed, tier } = useSky(canvasRef, {
    playing,
    kinds: [...KINDS],
    pixelRatio: () => 1,
    maxWidth: 1600,
    onGlitch: ({ ghost, slice }: GlitchState) => setGlitch({ ghost, slice }),
  })
  const still = tier === "still"
  const { ghost: g, slice: s } = glitch

  return (
    <div className="AiCover">
      <canvas ref={canvasRef} className="AiCover-sky" aria-hidden />

      <header className="AiCover-header">
        <a className="AiChip" href="/">
          <ArrowLeft size={16} aria-hidden />
          ditecco.me
        </a>
      </header>

      <main className="AiCover-main">
        <div className="AiCover-title">
          <h1>
            {LINES.map(line => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <Ghost
            className="AiCover-ghost--red"
            style={ghostStyle(
              g,
              -(4 + rand(g, 1) * 8),
              rand(g, 2) * 60,
              12 + rand(g, 3) * 24,
            )}
          />
          <Ghost
            className="AiCover-ghost--cyan"
            style={ghostStyle(
              g,
              4 + rand(g, 4) * 8,
              rand(g, 5) * 60,
              12 + rand(g, 6) * 24,
            )}
          />
          <Ghost
            className="AiCover-ghost--slice"
            style={ghostStyle(
              s,
              (rand(s, 7) - 0.5) * 120,
              8 + rand(s, 8) * 76,
              4 + rand(s, 9) * 7,
            )}
          />
        </div>
      </main>

      <footer className="AiCover-footer">
        <div className="AiCover-actions">
          <a className="AiButton AiButton--accent" href={allHref}>
            Browse the creations
            <ArrowRight size={20} aria-hidden />
          </a>
          {latestHref && (
            <a className="AiButton AiButton--ink" href={latestHref}>
              Latest
            </a>
          )}
        </div>
        {!failed && (
          <button
            type="button"
            className="AiChip AiChip--paper"
            onClick={() => setPlaying(still)}
          >
            {still ? "Play motion" : "Pause motion"}
          </button>
        )}
      </footer>
    </div>
  )
}
