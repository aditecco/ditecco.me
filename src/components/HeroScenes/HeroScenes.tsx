/* ---------------------------------
HeroScenes
--------------------------------- */

import { useEffect, useRef, useState } from "react"
import { SCENES } from "../../lib/scenes/catalog"
import type { Stage } from "../../lib/scenes/stage"
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
  const [index, setIndex] = useState(0)
  const [shown, setShown] = useState(false)
  const reducedMotion = usePrefersReducedMotion()

  // three.js is loaded lazily so it stays out of the critical path
  useEffect(() => {
    let cancelled = false
    let created: Stage | null = null

    import("../../lib/scenes/stage")
      .then(({ createStage }) => {
        if (cancelled || !canvasRef.current) return
        created = createStage(canvasRef.current)
        setStage(created)
      })
      // no WebGL: the card simply keeps its plain background
      .catch(() => {})

    return () => {
      cancelled = true
      created?.dispose()
    }
  }, [])

  useEffect(() => {
    if (!stage) return

    setShown(false)
    const timeout = setTimeout(
      () => {
        stage.show(SCENES[index].id)
        hasSceneRef.current = true
        setShown(true)
      },
      hasSceneRef.current ? FADE_MS : 0,
    )

    return () => clearTimeout(timeout)
  }, [stage, index])

  // only animate while on screen and in a visible tab
  useEffect(() => {
    const canvas = canvasRef.current
    if (!stage || !canvas) return

    let inView = true

    function sync() {
      if (!reducedMotion && inView && !document.hidden) stage.play()
      else stage.pause()
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

  // selecting a scene resets the timer, since `index` changes
  useEffect(() => {
    if (!stage || reducedMotion) return

    const timeout = setTimeout(
      () => setIndex(current => (current + 1) % SCENES.length),
      ROTATE_MS,
    )

    return () => clearTimeout(timeout)
  }, [stage, index, reducedMotion])

  return (
    <div className="HeroScenes">
      <canvas
        ref={canvasRef}
        className={`HeroScenes-canvas${shown ? " is-shown" : ""}`}
        aria-hidden="true"
      />

      {stage && (
        <div
          className="HeroScenes-controls"
          role="group"
          aria-label="Background scene"
        >
          {SCENES.map((scene, i) => (
            <button
              key={scene.id}
              type="button"
              className="HeroScenes-dot"
              title={scene.label}
              aria-label={scene.label}
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
