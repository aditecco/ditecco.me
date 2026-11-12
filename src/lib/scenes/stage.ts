import { WebGLRenderer } from "three"
import createAurora from "./aurora"
import type { SceneId } from "./catalog"
import createDunes from "./dunes"
import createFlock from "./flock"
import createHorizon from "./horizon"
import createLavaLamp from "./lava-lamp"
import createLife from "./life"
import createLightShape from "./light-shape"
import createNight from "./night"
import createOrbits from "./orbits"
import createPixelClouds from "./pixel-clouds"
import createRain from "./rain"
import createSky from "./sky"
import createTopography from "./topography"
import type { SceneFactory, SceneInstance, Size, Theme, Tone } from "./types"

const FACTORIES: Record<SceneId, SceneFactory> = {
  sky: createSky,
  dunes: createDunes,
  aurora: createAurora,
  "pixel-clouds": createPixelClouds,
  "lava-lamp": createLavaLamp,
  topography: createTopography,
  night: createNight,
  flock: createFlock,
  rain: createRain,
  horizon: createHorizon,
  "light-shape": createLightShape,
  life: createLife,
  orbits: createOrbits,
}

// avoid a big jump after the tab was hidden or the loop paused
const MAX_DELTA = 0.1
// the scenes are slow and calm: 30 fps is plenty and halves the GPU work
const FRAME_INTERVAL = 1000 / 30
// if rendered frames keep arriving slower than this, lower the resolution
const SLOW_FRAME_INTERVAL = 1000 / 20
const SLOW_FRAMES_BEFORE_DOWNGRADE = 45
const QUALITY_STEPS = [1, 0.75, 0.5]

export type Stage = ReturnType<typeof createStage>

export function createStage(canvas: HTMLCanvasElement) {
  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: "low-power",
  })
  let size = measure()
  renderer.setSize(size.width, size.height, false)

  let current: SceneInstance | null = null
  let elapsed = 0
  let last: number | null = null
  // device-level, so it carries over between scenes
  let quality = 0
  let slowFrames = 0

  function measure(): Size {
    return {
      width: Math.max(1, canvas.clientWidth),
      height: Math.max(1, canvas.clientHeight),
    }
  }

  function applyPixelRatio() {
    const base = Math.min(window.devicePixelRatio, current?.maxPixelRatio ?? 2)
    renderer.setPixelRatio(base * QUALITY_STEPS[quality])
  }

  function adaptQuality(interval: number) {
    if (interval > SLOW_FRAME_INTERVAL) slowFrames++
    else slowFrames = Math.max(0, slowFrames - 1)

    if (
      slowFrames > SLOW_FRAMES_BEFORE_DOWNGRADE &&
      quality < QUALITY_STEPS.length - 1
    ) {
      quality++
      slowFrames = 0
      applyPixelRatio()
    }
  }

  function render() {
    if (current) renderer.render(current.scene, current.camera)
  }

  function tick(now: number) {
    // 1 ms of slack so 60 Hz displays reliably render every other frame
    if (last !== null && now - last < FRAME_INTERVAL - 1) return

    const interval = last === null ? 0 : now - last
    const delta = Math.min(interval / 1000, MAX_DELTA)
    last = now
    if (interval > 0) adaptQuality(interval)
    elapsed += delta
    current?.update(elapsed, delta)
    render()
  }

  return {
    show(id: SceneId, theme: Theme): Tone {
      current?.dispose()
      elapsed = 0
      current = FACTORIES[id]({ size, theme })
      applyPixelRatio()
      current.update(0, 0)
      render()
      return current.tone
    },
    play() {
      last = null
      slowFrames = 0
      renderer.setAnimationLoop(tick)
    },
    pause() {
      renderer.setAnimationLoop(null)
    },
    resize() {
      size = measure()
      renderer.setSize(size.width, size.height, false)
      current?.resize(size)
      render()
    },
    dispose() {
      renderer.setAnimationLoop(null)
      current?.dispose()
      current = null
      renderer.dispose()
      // free the GPU context now rather than whenever GC gets to it
      renderer.forceContextLoss()
    },
  }
}
