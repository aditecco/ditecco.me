/* ---------------------------------
HeroScenes
--------------------------------- */

import { useEffect, useRef, useState } from "react"
import {
  getPreferences,
  setPreferences,
  usePreferences,
} from "../../lib/preferences"
import { SCENES } from "../../lib/scenes/catalog"
import type { Stage } from "../../lib/scenes/stage"
import type { Tone } from "../../lib/scenes/types"
import "./HeroScenes.scss"

const ROTATE_MS = 15_000
const FADE_MS = 500

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")

    function update() {
      setReduced(query.matches)
    }

    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  return reduced
}

export default function HeroScenes() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hasSceneRef = useRef(false)
  const [stage, setStage] = useState<Stage | null>(null)
  const [shown, setShown] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [tone, setTone] = useState<Tone | null>(null)
  const { sceneIndex, autoRotate, resolvedTheme, scenesEnabled } =
    usePreferences()
  const reducedMotion = usePrefersReducedMotion()
  const rotating = autoRotate && !reducedMotion && shown

  // lets the settings menu offer scene options on this page
  useEffect(() => {
    setPreferences({ scenesAvailable: true })
    return () => setPreferences({ scenesAvailable: false })
  }, [])

  // three.js is loaded lazily, and not at all when scenes are disabled
  useEffect(() => {
    // read the store directly: during hydration the hook still returns the
    // server snapshot, which would start loading three.js needlessly
    if (!getPreferences().scenesEnabled) return

    let cancelled = false
    let created: Stage | null = null

    import("../../lib/scenes/stage")
      .then(({ createStage }) => {
        if (cancelled || !canvasRef.current) return
        created = createStage(canvasRef.current)
        setStage(created)
      })
      // no WebGL: the card keeps its plain background, and there is
      // nothing to configure
      .catch(() => setPreferences({ scenesAvailable: false }))

    return () => {
      cancelled = true
      created?.dispose()
      hasSceneRef.current = false
      setStage(null)
      setShown(false)
      setTone(null)
    }
  }, [scenesEnabled])

  useEffect(() => {
    if (!stage) return

    setShown(false)
    const timeout = setTimeout(
      () => {
        setTone(stage.show(SCENES[sceneIndex].id, resolvedTheme))
        hasSceneRef.current = true
        setShown(true)
      },
      hasSceneRef.current ? FADE_MS : 0,
    )

    return () => clearTimeout(timeout)
  }, [stage, sceneIndex, resolvedTheme])

  // only animate while on screen and in a visible tab
  useEffect(() => {
    const canvas = canvasRef.current
    if (!stage || !canvas) return

    let inView = true

    function sync() {
      const active = !reducedMotion && inView && !document.hidden
      if (active) stage.play()
      else stage.pause()
      setPlaying(active)
    }

    const intersection = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      sync()
    })
    const resize = new ResizeObserver(() => stage.resize())

    intersection.observe(canvas)
    resize.observe(canvas)
    document.addEventListener("visibilitychange", sync)
    sync()

    return () => {
      intersection.disconnect()
      resize.disconnect()
      document.removeEventListener("visibilitychange", sync)
      stage.pause()
    }
  }, [stage, reducedMotion])

  return (
    <div
      className="HeroScenes"
      data-tone={tone ?? undefined}
      data-paused={playing ? undefined : ""}
    >
      <canvas
        // a disposed renderer loses its context, so each run needs a new canvas
        key={String(scenesEnabled)}
        ref={canvasRef}
        className={`HeroScenes-canvas${shown ? " is-shown" : ""}`}
        aria-hidden="true"
      />
      <div className="HeroScenes-guard" aria-hidden="true" />

      {stage && (
        <div className="HeroScenes-controls">
          <span
            key={sceneIndex}
            className="HeroScenes-label"
            aria-hidden="true"
          >
            {SCENES[sceneIndex].label}
          </span>

          <div
            className="HeroScenes-dots"
            role="group"
            aria-label="Background scene"
          >
            {SCENES.map((scene, i) => {
              const active = i === sceneIndex

              return (
                <button
                  key={scene.id}
                  type="button"
                  className="HeroScenes-dot"
                  title={scene.label}
                  aria-label={scene.label}
                  aria-pressed={active}
                  onClick={() => setPreferences({ sceneIndex: i })}
                >
                  <span className="HeroScenes-pip">
                    {active && rotating && (
                      // the progress bar drives the rotation, so pausing
                      // its animation also pauses the timer
                      <span
                        className="HeroScenes-progress"
                        style={{ animationDuration: `${ROTATE_MS}ms` }}
                        onAnimationEnd={() =>
                          setPreferences({ sceneIndex: sceneIndex + 1 })
                        }
                      />
                    )}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
