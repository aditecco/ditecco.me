import {
  CircleGeometry,
  Color,
  Group,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
} from "three"
import type { SceneFactory, Size } from "./types"
import {
  createPixelCamera,
  disposeObject,
  randomBetween,
  resizePixelCamera,
} from "./utils"

type Cloud = {
  group: Group
  speed: number
  halfWidth: number
}

const PUFFS = [
  { x: -22, y: 0, r: 11 },
  { x: -6, y: 7, r: 15 },
  { x: 12, y: 4, r: 13 },
  { x: 26, y: -1, r: 9 },
]

const LAYERS = [
  { count: 3, scale: [0.55, 0.75], speed: [3, 5], color: "#f2f8fc", z: 1 },
  { count: 3, scale: [0.9, 1.3], speed: [7, 10], color: "#ffffff", z: 2 },
]

function createCloud(material: MeshBasicMaterial, scale: number) {
  const group = new Group()

  for (const { x, y, r } of PUFFS) {
    const puff = new Mesh(new CircleGeometry(r, 32), material)
    puff.position.set(x, y, 0)
    group.add(puff)
  }

  // flat base so the cloud reads as one silhouette
  const base = new Mesh(new PlaneGeometry(52, 12), material)
  base.position.set(2, -4, 0)
  group.add(base)

  group.scale.setScalar(scale)
  return group
}

const createSky: SceneFactory = initialSize => {
  let size: Size = initialSize
  const scene = new Scene()
  const camera = createPixelCamera(size)

  const background = new Mesh(
    new PlaneGeometry(1, 1),
    new ShaderMaterial({
      uniforms: {
        uTop: { value: new Color("#9fcfee") },
        uBottom: { value: new Color("#eef7fc") },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uTop;
        uniform vec3 uBottom;
        varying vec2 vUv;
        void main() {
          gl_FragColor = vec4(mix(uBottom, uTop, smoothstep(0.0, 1.0, vUv.y)), 1.0);
          #include <colorspace_fragment>
        }
      `,
      depthWrite: false,
    }),
  )
  scene.add(background)

  function layoutBackground() {
    background.scale.set(size.width, size.height, 1)
    background.position.set(size.width / 2, size.height / 2, 0)
  }
  layoutBackground()

  const clouds: Cloud[] = []

  for (const layer of LAYERS) {
    const material = new MeshBasicMaterial({ color: layer.color })

    for (let i = 0; i < layer.count; i++) {
      const scale = randomBetween(layer.scale[0], layer.scale[1])
      const group = createCloud(material, scale)
      group.position.set(
        ((i + Math.random() * 0.6) / layer.count) * size.width,
        randomBetween(size.height * 0.15, size.height * 0.85),
        layer.z,
      )
      scene.add(group)
      clouds.push({
        group,
        speed: randomBetween(layer.speed[0], layer.speed[1]),
        halfWidth: 40 * scale,
      })
    }
  }

  return {
    scene,
    camera,
    update(_elapsed, delta) {
      for (const cloud of clouds) {
        const { position } = cloud.group
        position.x += cloud.speed * delta

        if (position.x - cloud.halfWidth > size.width) {
          position.x = -cloud.halfWidth
          position.y = randomBetween(size.height * 0.15, size.height * 0.85)
        }
      }
    },
    resize(next) {
      size = next
      resizePixelCamera(camera, size)
      layoutBackground()
    },
    dispose() {
      disposeObject(scene)
    },
  }
}

export default createSky
