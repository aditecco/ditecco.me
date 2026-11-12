import {
  BufferGeometry,
  CircleGeometry,
  Color,
  EllipseCurve,
  Group,
  LineBasicMaterial,
  LineLoop,
  Mesh,
  MeshBasicMaterial,
  Scene,
} from "three"
import type { SceneFactory, Size } from "./types"
import {
  createPixelCamera,
  disposeObject,
  randomBetween,
  resizePixelCamera,
} from "./utils"

const PALETTES = {
  light: {
    background: "#ffffff",
    line: "#d9dde1",
    body: "#2c3e50",
    sun: "#f39c12",
  },
  dark: {
    background: "#111317",
    line: "#2c323a",
    body: "#dfe6ec",
    sun: "#f5b041",
  },
}

type Orbit = {
  a: number
  b: number
  speed: number
  phase: number
  planet: Mesh
}

const createOrbits: SceneFactory = ({ size: initialSize, theme }) => {
  const palette = PALETTES[theme]
  let size: Size = initialSize
  const scene = new Scene()
  scene.background = new Color(palette.background)
  const camera = createPixelCamera(size)

  // tilted system, centred low and to the right of the heading
  const system = new Group()
  system.rotation.z = -0.35
  scene.add(system)

  function layout() {
    system.position.set(size.width * 0.72, size.height * 0.42, 0)
  }
  layout()

  const sun = new Mesh(
    new CircleGeometry(6, 32),
    new MeshBasicMaterial({ color: palette.sun }),
  )
  system.add(sun)

  const lineMaterial = new LineBasicMaterial({ color: palette.line })
  const bodyMaterial = new MeshBasicMaterial({ color: palette.body })

  const orbits: Orbit[] = [24, 42, 62, 86, 114].map((a, i) => {
    const b = a * 0.42
    const points = new EllipseCurve(0, 0, a, b).getPoints(96)
    system.add(
      new LineLoop(new BufferGeometry().setFromPoints(points), lineMaterial),
    )

    const planet = new Mesh(
      new CircleGeometry(i === 3 ? 4 : 2.5, 24),
      bodyMaterial,
    )
    system.add(planet)

    // Kepler-ish: outer bodies move slower
    return {
      a,
      b,
      speed: (9 / Math.pow(a, 1.5)) * 6,
      phase: randomBetween(0, Math.PI * 2),
      planet,
    }
  })

  return {
    scene,
    camera,
    tone: theme,
    update(elapsed) {
      for (const orbit of orbits) {
        const angle = orbit.phase + elapsed * orbit.speed
        orbit.planet.position.set(
          Math.cos(angle) * orbit.a,
          Math.sin(angle) * orbit.b,
          1,
        )
      }
    },
    resize(next) {
      size = next
      resizePixelCamera(camera, size)
      layout()
    },
    dispose() {
      disposeObject(scene)
      scene.traverse(object => {
        if (object instanceof LineLoop) object.geometry.dispose()
      })
      lineMaterial.dispose()
    },
  }
}

export default createOrbits
