import { WebGLRenderer } from "three"
import type { SceneId } from "./catalog"
import createLavaLamp from "./lava-lamp"
import createLightShape from "./light-shape"
import createPixelClouds from "./pixel-clouds"
import createSky from "./sky"
import type { SceneFactory, SceneInstance, Size } from "./types"

const FACTORIES: Record<SceneId, SceneFactory> = {
  sky: createSky,
  "pixel-clouds": createPixelClouds,
  "lava-lamp": createLavaLamp,
  "light-shape": createLightShape,
}

// avoid a big jump after the tab was hidden or the loop paused
const MAX_DELTA = 0.1

export type Stage = ReturnType<typeof createStage>

export function createStage(canvas: HTMLCanvasElement) {
  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: "low-power",
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  let size = measure()
  renderer.setSize(size.width, size.height, false)

  let current: SceneInstance | null = null
  let elapsed = 0
  let last: number | null = null

  function measure(): Size {
    return {
      width: Math.max(1, canvas.clientWidth),
      height: Math.max(1, canvas.clientHeight),
    }
  }

  function render() {
    if (current) renderer.render(current.scene, current.camera)
  }

  function tick(now: number) {
    const delta = last === null ? 0 : Math.min((now - last) / 1000, MAX_DELTA)
    last = now
    elapsed += delta
    current?.update(elapsed, delta)
    render()
  }

  return {
    show(id: SceneId) {
      current?.dispose()
      elapsed = 0
      current = FACTORIES[id](size)
      current.update(0, 0)
      render()
    },
    play() {
      last = null
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
    },
  }
}
