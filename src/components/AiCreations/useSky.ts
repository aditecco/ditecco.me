import { useEffect, useRef, useState, type RefObject } from "react"
import { getPreferences, usePreferences } from "../../lib/preferences"
import type { GlitchKind, GlitchState } from "../../lib/ai-sky/glitch"
import type { SkyLoop, SkyTier } from "../../lib/ai-sky/loop"

type Options = {
  // the visitor's own choice, which wins over reduced motion and the site
  // setting; null until they press play or pause
  playing?: boolean | null
  kinds: GlitchKind[]
  pixelRatio: () => number
  maxWidth?: number
  onGlitch?: (state: GlitchState) => void
}

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

// Drives the sky on `canvasRef`. Without WebGL the canvas stays transparent
// and `failed` turns true; callers keep a CSS sky behind it as the fallback.
export function useSky(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  { playing = null, kinds, pixelRatio, maxWidth, onGlitch }: Options,
) {
  const [loop, setLoop] = useState<SkyLoop | null>(null)
  const [failed, setFailed] = useState(false)
  // what the device can do; only ever moves down
  const [deviceTier, setDeviceTier] = useState<SkyTier>("full")
  const reducedMotion = usePrefersReducedMotion()
  const { scenesEnabled } = usePreferences()
  const onGlitchRef = useRef(onGlitch)
  onGlitchRef.current = onGlitch

  const still = playing === null ? reducedMotion || !scenesEnabled : !playing
  // pressing play on a device that was downgraded to still: try lite
  const tier: SkyTier = still
    ? "still"
    : playing && deviceTier === "still"
      ? "lite"
      : deviceTier

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let created: SkyLoop | null = null
    let cancelled = false

    // a separate chunk, so the page paints before the shader compiles
    import("../../lib/ai-sky/loop").then(({ createSkyLoop, getAutoTier }) => {
      if (cancelled) return

      const auto = getAutoTier()
      const motion =
        !matchMedia("(prefers-reduced-motion: reduce)").matches &&
        getPreferences().scenesEnabled

      created = createSkyLoop(canvas, {
        tier: motion ? auto : "still",
        glitch: true,
        kinds,
        pixelRatio: pixelRatio(),
        maxWidth,
        onGlitch: state => onGlitchRef.current?.(state),
        onDowngrade: setDeviceTier,
      })
      setDeviceTier(auto)
      setLoop(created)
      setFailed(!created)
    })

    return () => {
      cancelled = true
      created?.dispose()
      setLoop(null)
    }
    // the loop is created once per canvas
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef])

  useEffect(() => {
    loop?.setTier(tier)
  }, [loop, tier])

  // only run while on screen and in a visible tab
  useEffect(() => {
    const canvas = canvasRef.current
    if (!loop || !canvas) return

    let inView = true

    function sync() {
      if (inView && !document.hidden) loop.play()
      else loop.pause()
    }

    const intersection = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      sync()
    })
    const resize = new ResizeObserver(() => loop.resize())

    intersection.observe(canvas)
    resize.observe(canvas)
    document.addEventListener("visibilitychange", sync)
    sync()

    return () => {
      intersection.disconnect()
      resize.disconnect()
      document.removeEventListener("visibilitychange", sync)
      loop.pause()
    }
  }, [loop, canvasRef])

  return { failed, tier }
}
