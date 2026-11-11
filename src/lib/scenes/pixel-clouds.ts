import {
  CanvasTexture,
  Color,
  Mesh,
  MeshBasicMaterial,
  NearestFilter,
  PlaneGeometry,
  SRGBColorSpace,
  Scene,
} from "three"
import type { SceneFactory, Size } from "./types"
import {
  createPixelCamera,
  disposeObject,
  randomBetween,
  resizePixelCamera,
} from "./utils"

// CSS pixels per art pixel
const PIXEL = 4

const SKY = "#86bdf7"
const FILL = "#ffffff"
const SHADE = "#cfe6fb"
const OUTLINE = "#1f2a44"

type Cloud = {
  mesh: Mesh
  x: number
  speed: number
  width: number
}

function createCloudTexture() {
  const cols = Math.round(randomBetween(18, 30))
  const rows = 11
  const baseline = rows - 2
  const puffCount = Math.max(3, Math.round(cols / 6))
  const puffs = Array.from({ length: puffCount }, (_, i) => {
    const r = randomBetween(3.4, 4.6)
    return {
      x: r + (i / (puffCount - 1)) * (cols - 2 * r),
      y: baseline - r + randomBetween(-1.5, 1),
      r,
    }
  })
  const first = puffs[0]
  const last = puffs[puffs.length - 1]

  function filled(x: number, y: number) {
    if (x < 0 || x >= cols || y < 0 || y > baseline) return false

    // a solid belly joins the puffs into a single cloud
    if (y >= baseline - 3 && x + 0.5 >= first.x && x + 0.5 <= last.x) {
      return true
    }

    return puffs.some(
      p => (x + 0.5 - p.x) ** 2 + (y + 0.5 - p.y) ** 2 <= p.r ** 2,
    )
  }

  // one cell of padding on each side for the outline
  const canvas = document.createElement("canvas")
  canvas.width = cols + 2
  canvas.height = rows + 2
  const ctx = canvas.getContext("2d")

  for (let y = -1; y <= rows; y++) {
    for (let x = -1; x <= cols; x++) {
      let color: string | null = null

      if (filled(x, y)) {
        color = y >= baseline - 1 ? SHADE : FILL
      } else if (
        filled(x - 1, y) ||
        filled(x + 1, y) ||
        filled(x, y - 1) ||
        filled(x, y + 1)
      ) {
        color = OUTLINE
      }

      if (color) {
        ctx.fillStyle = color
        ctx.fillRect(x + 1, y + 1, 1, 1)
      }
    }
  }

  const texture = new CanvasTexture(canvas)
  texture.magFilter = NearestFilter
  texture.minFilter = NearestFilter
  texture.generateMipmaps = false
  texture.colorSpace = SRGBColorSpace

  return { texture, width: canvas.width * PIXEL, height: canvas.height * PIXEL }
}

function snap(value: number) {
  return Math.round(value / PIXEL) * PIXEL
}

const createPixelClouds: SceneFactory = initialSize => {
  let size: Size = initialSize
  const scene = new Scene()
  scene.background = new Color(SKY)
  const camera = createPixelCamera(size)

  const clouds: Cloud[] = []
  const count = 3

  for (let i = 0; i < count; i++) {
    const { texture, width, height } = createCloudTexture()
    const mesh = new Mesh(
      new PlaneGeometry(width, height),
      new MeshBasicMaterial({ map: texture, transparent: true }),
    )
    const x = ((i + Math.random() * 0.5) / count) * size.width
    mesh.position.y = snap(randomBetween(height, size.height - height / 2))
    scene.add(mesh)
    clouds.push({ mesh, x, speed: randomBetween(5, 9), width })
  }

  return {
    scene,
    camera,
    update(_elapsed, delta) {
      for (const cloud of clouds) {
        cloud.x += cloud.speed * delta

        if (cloud.x - cloud.width / 2 > size.width) {
          cloud.x = -cloud.width / 2
        }

        // move in whole art pixels for that chunky, stepped drift
        cloud.mesh.position.x = snap(cloud.x)
      }
    },
    resize(next) {
      size = next
      resizePixelCamera(camera, size)
    },
    dispose() {
      disposeObject(scene)
    },
  }
}

export default createPixelClouds
