import {
  Color,
  DynamicDrawUsage,
  InstancedMesh,
  Matrix4,
  MeshBasicMaterial,
  PlaneGeometry,
  Scene,
} from "three"
import type { SceneFactory } from "./types"
import { createPixelCamera, disposeObject, resizePixelCamera } from "./utils"

const CELL = 10
const GAP = 2
const STEP_SECONDS = 0.6
// how fast a cell fades in and out, per second
const FADE_SPEED = 3

const PALETTES = {
  light: { background: "#fafaf8", cell: "#1abc9c" },
  dark: { background: "#121519", cell: "#1abc9c" },
}

const createLife: SceneFactory = ({ size: initialSize, theme }) => {
  const palette = PALETTES[theme]
  let size = initialSize
  const scene = new Scene()
  const background = new Color(palette.background)
  const cellColor = new Color(palette.cell)
  scene.background = background
  const camera = createPixelCamera(size)

  // sized once for the initial card; resizes keep the same grid
  const cols = Math.ceil(size.width / CELL)
  const rows = Math.ceil(size.height / CELL)
  const count = cols * rows

  let cells = new Uint8Array(count)
  let next = new Uint8Array(count)
  const shown = new Float32Array(count)
  const history: string[] = []

  const mesh = new InstancedMesh(
    new PlaneGeometry(CELL - GAP, CELL - GAP),
    new MeshBasicMaterial(),
    count,
  )
  mesh.instanceColor?.setUsage(DynamicDrawUsage)
  scene.add(mesh)

  const matrix = new Matrix4()
  const color = new Color()

  for (let i = 0; i < count; i++) {
    const x = i % cols
    const y = Math.floor(i / cols)
    matrix.makeTranslation(x * CELL + CELL / 2, y * CELL + CELL / 2, 1)
    mesh.setMatrixAt(i, matrix)
  }

  function seed() {
    for (let i = 0; i < count; i++) cells[i] = Math.random() < 0.28 ? 1 : 0
    history.length = 0
  }

  function step() {
    let population = 0

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        let neighbours = 0

        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue
            const nx = (x + dx + cols) % cols
            const ny = (y + dy + rows) % rows
            neighbours += cells[ny * cols + nx]
          }
        }

        const i = y * cols + x
        const alive = neighbours === 3 || (cells[i] === 1 && neighbours === 2)
        next[i] = alive ? 1 : 0
        population += next[i]
      }
    }

    ;[cells, next] = [next, cells]

    // reseed when the board dies out or settles into a short loop
    const signature = cells.join("")
    if (population < count * 0.04 || history.includes(signature)) seed()
    else {
      history.push(signature)
      if (history.length > 6) history.shift()
    }
  }

  function paint(delta: number) {
    for (let i = 0; i < count; i++) {
      const target = cells[i]
      shown[i] +=
        Math.sign(target - shown[i]) *
        Math.min(Math.abs(target - shown[i]), FADE_SPEED * delta)
      color.copy(background).lerp(cellColor, shown[i] * 0.85)
      mesh.setColorAt(i, color)
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }

  seed()
  for (let i = 0; i < 12; i++) step()
  shown.set(cells)
  paint(0)

  let accumulator = 0

  return {
    scene,
    camera,
    tone: theme,
    update(_elapsed, delta) {
      accumulator += delta
      if (accumulator >= STEP_SECONDS) {
        accumulator -= STEP_SECONDS
        step()
      }
      paint(delta)
    },
    resize(nextSize) {
      size = nextSize
      resizePixelCamera(camera, size)
    },
    dispose() {
      disposeObject(scene)
      mesh.dispose()
    },
  }
}

export default createLife
