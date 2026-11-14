import {
  createGlitchClock,
  NO_GLITCH,
  STILL_GLITCH,
  type GlitchKind,
  type GlitchState,
} from "./glitch"
import { createSkyRenderer } from "./renderer"

// full: every frame up to 60 fps; lite: half resolution, 3 octaves, 30 fps;
// still: one frame, redrawn only on resize
export type SkyTier = "full" | "lite" | "still"

type Options = {
  tier: SkyTier
  glitch: boolean
  kinds: GlitchKind[]
  // canvas pixels per CSS pixel at the full tier; clouds are soft, so the
  // cover renders at 1 and caps its width
  pixelRatio: number
  maxWidth?: number
  onGlitch?: (state: GlitchState) => void
  // the device couldn't keep up with the requested tier
  onDowngrade?: (tier: SkyTier) => void
}

const FRAME_INTERVAL: Record<Exclude<SkyTier, "still">, number> = {
  full: 1000 / 60,
  lite: 1000 / 30,
}
// sustained frames slower than this move down a tier
const SLOW_INTERVAL: Record<Exclude<SkyTier, "still">, number> = {
  full: 1000 / 40,
  lite: 1000 / 20,
}
const SLOW_FRAMES_BEFORE_DOWNGRADE = 45
const MAX_DELTA = 0.05
const STILL_TIME = 20

export function getAutoTier(): SkyTier {
  const nav = navigator as Navigator & {
    deviceMemory?: number
    connection?: { saveData?: boolean }
  }

  if (nav.connection?.saveData) return "still"

  const lowMemory = nav.deviceMemory !== undefined && nav.deviceMemory <= 4
  const fewCores = nav.hardwareConcurrency > 0 && nav.hardwareConcurrency <= 4

  return lowMemory || fewCores ? "lite" : "full"
}

// returns null without WebGL: callers keep their CSS sky
export function createSkyLoop(canvas: HTMLCanvasElement, options: Options) {
  const renderer = createSkyRenderer(canvas)
  if (!renderer) return null

  let { tier, glitch } = options
  let clock = createGlitchClock(options.kinds)
  let time = 0
  let raf = 0
  let running = false
  let lastFrame: number | null = null
  let lastDraw = 0
  let slowFrames = 0
  let stillDrawn = false
  let lastGlitch: GlitchState | null = null

  function emit(state: GlitchState) {
    if (
      lastGlitch &&
      lastGlitch.ghost === state.ghost &&
      lastGlitch.slice === state.slice
    ) {
      return
    }
    lastGlitch = state
    options.onGlitch?.(state)
  }

  function fit() {
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    if (!width || !height) return false

    let scale = options.pixelRatio
    if (options.maxWidth) scale = Math.min(scale, options.maxWidth / width)
    if (tier === "lite") scale *= 0.5

    const w = Math.max(2, Math.round(width * scale))
    const h = Math.max(2, Math.round(height * scale))
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
      stillDrawn = false
    }
    return true
  }

  function drawStill() {
    if (!fit() || stillDrawn) return

    const state = glitch ? STILL_GLITCH : NO_GLITCH
    renderer.draw({ ...state, time: STILL_TIME, lite: false })
    emit(state)
    stillDrawn = true
  }

  function downgrade() {
    const next: SkyTier = tier === "full" ? "lite" : "still"
    setTier(next)
    options.onDowngrade?.(next)
  }

  function frame(now: number) {
    raf = requestAnimationFrame(frame)
    if (tier === "still") return

    const interval = FRAME_INTERVAL[tier]
    // a little slack so a 60 Hz display doesn't skip frames at the full tier
    if (now - lastDraw < interval - 2) return

    const delta = lastFrame === null ? 0 : now - lastFrame
    lastFrame = now
    lastDraw = now

    if (delta > SLOW_INTERVAL[tier]) slowFrames++
    else slowFrames = Math.max(0, slowFrames - 1)
    if (slowFrames > SLOW_FRAMES_BEFORE_DOWNGRADE) {
      downgrade()
      return
    }

    if (!fit()) return

    time += Math.min(delta / 1000, MAX_DELTA)
    const state = glitch ? clock.step(time) : NO_GLITCH
    renderer.draw({ ...state, time, lite: tier === "lite" })
    emit(state)
  }

  function play() {
    if (running) return
    running = true
    lastFrame = null
    slowFrames = 0
    if (tier === "still") drawStill()
    else raf = requestAnimationFrame(frame)
  }

  function pause() {
    running = false
    cancelAnimationFrame(raf)
  }

  function setTier(next: SkyTier) {
    if (next === tier) return
    tier = next
    stillDrawn = false
    lastFrame = null
    slowFrames = 0
    if (!running) return
    cancelAnimationFrame(raf)
    if (tier === "still") drawStill()
    else raf = requestAnimationFrame(frame)
  }

  function setGlitch(next: boolean) {
    glitch = next
    clock = createGlitchClock(options.kinds)
    stillDrawn = false
    if (running && tier === "still") drawStill()
  }

  // the canvas size changed: a running loop picks it up on the next frame
  function resize() {
    if (running && tier === "still") {
      stillDrawn = false
      drawStill()
    }
  }

  function dispose() {
    pause()
    renderer.dispose()
  }

  return { play, pause, setTier, setGlitch, resize, dispose }
}

export type SkyLoop = NonNullable<ReturnType<typeof createSkyLoop>>
