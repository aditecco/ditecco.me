import {
  BufferAttribute,
  BufferGeometry,
  Color,
  DynamicDrawUsage,
  InstancedMesh,
  Matrix4,
  MeshBasicMaterial,
  Quaternion,
  Scene,
  Vector3,
} from "three"
import type { SceneFactory } from "./types"
import { createPixelCamera, disposeObject, resizePixelCamera } from "./utils"

const COUNT = 36
const VIEW_RADIUS = 42
const SEPARATION_RADIUS = 14
const MAX_SPEED = 34
const MIN_SPEED = 18
const MARGIN = 20

type Boid = { x: number; y: number; vx: number; vy: number }

// a tiny gull-like chevron, pointing along +x
function createBirdGeometry() {
  const geometry = new BufferGeometry()
  const vertices = new Float32Array([
    3, 0, 0, -2, 4, 0, -1, 0, 0, 3, 0, 0, -1, 0, 0, -2, -4, 0,
  ])
  geometry.setAttribute("position", new BufferAttribute(vertices, 3))
  return geometry
}

const createFlock: SceneFactory = ({ size: initialSize, theme }) => {
  let size = initialSize
  const scene = new Scene()
  scene.background = new Color(theme === "dark" ? "#1a1d24" : "#eef1f4")
  const camera = createPixelCamera(size)

  const mesh = new InstancedMesh(
    createBirdGeometry(),
    new MeshBasicMaterial({ color: theme === "dark" ? "#c9d1db" : "#2c3138" }),
    COUNT,
  )
  mesh.instanceMatrix.setUsage(DynamicDrawUsage)
  scene.add(mesh)

  const boids: Boid[] = Array.from({ length: COUNT }, () => {
    const angle = Math.random() * Math.PI * 2
    return {
      x: size.width * (0.3 + Math.random() * 0.4),
      y: size.height * (0.3 + Math.random() * 0.4),
      vx: Math.cos(angle) * MIN_SPEED,
      vy: Math.sin(angle) * MIN_SPEED,
    }
  })

  const matrix = new Matrix4()
  const rotation = new Quaternion()
  const position = new Vector3()
  const scale = new Vector3(1, 1, 1)
  const axis = new Vector3(0, 0, 1)

  function step(delta: number) {
    for (const boid of boids) {
      let alignX = 0
      let alignY = 0
      let centerX = 0
      let centerY = 0
      let separateX = 0
      let separateY = 0
      let neighbours = 0

      for (const other of boids) {
        if (other === boid) continue
        const dx = other.x - boid.x
        const dy = other.y - boid.y
        const distance = Math.hypot(dx, dy)
        if (distance > VIEW_RADIUS) continue

        neighbours++
        alignX += other.vx
        alignY += other.vy
        centerX += other.x
        centerY += other.y

        if (distance < SEPARATION_RADIUS && distance > 0) {
          separateX -= dx / distance
          separateY -= dy / distance
        }
      }

      if (neighbours > 0) {
        boid.vx += (alignX / neighbours - boid.vx) * 0.8 * delta
        boid.vy += (alignY / neighbours - boid.vy) * 0.8 * delta
        boid.vx += (centerX / neighbours - boid.x) * 0.5 * delta
        boid.vy += (centerY / neighbours - boid.y) * 0.5 * delta
      }

      boid.vx += separateX * 60 * delta
      boid.vy += separateY * 60 * delta

      // steer softly away from the edges
      if (boid.x < MARGIN) boid.vx += 40 * delta
      if (boid.x > size.width - MARGIN) boid.vx -= 40 * delta
      if (boid.y < MARGIN) boid.vy += 40 * delta
      if (boid.y > size.height - MARGIN) boid.vy -= 40 * delta

      const speed = Math.hypot(boid.vx, boid.vy)
      const clamped = Math.min(MAX_SPEED, Math.max(MIN_SPEED, speed))
      boid.vx = (boid.vx / speed) * clamped
      boid.vy = (boid.vy / speed) * clamped
    }

    for (const boid of boids) {
      boid.x += boid.vx * delta
      boid.y += boid.vy * delta
    }
  }

  function sync() {
    boids.forEach((boid, i) => {
      position.set(boid.x, boid.y, 1)
      rotation.setFromAxisAngle(axis, Math.atan2(boid.vy, boid.vx))
      matrix.compose(position, rotation, scale)
      mesh.setMatrixAt(i, matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  }

  sync()

  return {
    scene,
    camera,
    tone: theme,
    update(_elapsed, delta) {
      if (delta > 0) step(delta)
      sync()
    },
    resize(next) {
      size = next
      resizePixelCamera(camera, size)
    },
    dispose() {
      disposeObject(scene)
      mesh.dispose()
    },
  }
}

export default createFlock
