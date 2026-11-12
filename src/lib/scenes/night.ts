import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Mesh,
  PlaneGeometry,
  Points,
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

const STAR_COUNT = 140
const SHOOTING_STAR_DURATION = 0.9

function createStars({ width, height }: Size) {
  const positions = new Float32Array(STAR_COUNT * 3)
  const sizes = new Float32Array(STAR_COUNT)
  const phases = new Float32Array(STAR_COUNT)

  for (let i = 0; i < STAR_COUNT; i++) {
    positions.set([Math.random() * width, Math.random() * height, 1], i * 3)
    // mostly tiny stars, a few brighter ones
    sizes[i] =
      Math.random() < 0.9 ? randomBetween(1, 2) : randomBetween(2.5, 3.5)
    phases[i] = Math.random() * Math.PI * 2
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute("position", new BufferAttribute(positions, 3))
  geometry.setAttribute("aSize", new BufferAttribute(sizes, 1))
  geometry.setAttribute("aPhase", new BufferAttribute(phases, 1))

  const material = new ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    },
    vertexShader: /* glsl */ `
      uniform float uTime;
      uniform float uPixelRatio;
      attribute float aSize;
      attribute float aPhase;
      varying float vTwinkle;

      void main() {
        vTwinkle = 0.55 + 0.45 * sin(uTime * (0.8 + fract(aPhase) * 1.5) + aPhase);
        gl_PointSize = aSize * uPixelRatio * 2.0;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      varying float vTwinkle;

      void main() {
        float d = length(gl_PointCoord - 0.5);
        float glow = smoothstep(0.5, 0.0, d);
        gl_FragColor = vec4(vec3(0.95, 0.96, 1.0), glow * glow * vTwinkle);
        #include <colorspace_fragment>
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  })

  return { points: new Points(geometry, material), material }
}

function createShootingStar() {
  const material = new ShaderMaterial({
    uniforms: { uOpacity: { value: 0 } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uOpacity;
      varying vec2 vUv;
      void main() {
        // bright head on the right, fading tail
        float tail = pow(vUv.x, 2.5);
        float core = 1.0 - abs(vUv.y - 0.5) * 2.0;
        gl_FragColor = vec4(vec3(1.0), tail * core * uOpacity);
        #include <colorspace_fragment>
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  })

  const mesh = new Mesh(new PlaneGeometry(90, 1.5), material)
  mesh.position.z = 2
  mesh.visible = false
  return { mesh, material }
}

const createNight: SceneFactory = context => {
  let size = context.size
  const scene = new Scene()
  scene.background = new Color("#0a1024")
  const camera = createPixelCamera(size)

  const sky = new Mesh(
    new PlaneGeometry(1, 1),
    new ShaderMaterial({
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vec3 top = vec3(0.02, 0.03, 0.09);
          vec3 bottom = vec3(0.1, 0.12, 0.26);
          gl_FragColor = vec4(mix(bottom, top, vUv.y), 1.0);
          #include <colorspace_fragment>
        }
      `,
      depthWrite: false,
    }),
  )
  scene.add(sky)

  function layoutSky() {
    sky.scale.set(size.width, size.height, 1)
    sky.position.set(size.width / 2, size.height / 2, 0)
  }
  layoutSky()

  const stars = createStars(size)
  scene.add(stars.points)

  const shooting = createShootingStar()
  scene.add(shooting.mesh)

  let nextShot = randomBetween(2, 5)
  let shotStart = -1
  let shotFrom = { x: 0, y: 0 }
  let shotAngle = 0

  return {
    scene,
    camera,
    tone: "dark",
    update(elapsed) {
      stars.material.uniforms.uTime.value = elapsed

      if (shotStart < 0 && elapsed >= nextShot) {
        shotStart = elapsed
        shotFrom = {
          x: randomBetween(size.width * 0.3, size.width),
          y: randomBetween(size.height * 0.6, size.height),
        }
        shotAngle = randomBetween(Math.PI * 1.1, Math.PI * 1.25)
        shooting.mesh.rotation.z = shotAngle + Math.PI
        shooting.mesh.visible = true
      }

      if (shotStart >= 0) {
        const progress = (elapsed - shotStart) / SHOOTING_STAR_DURATION
        const distance = progress * 160
        shooting.mesh.position.x = shotFrom.x + Math.cos(shotAngle) * distance
        shooting.mesh.position.y = shotFrom.y + Math.sin(shotAngle) * distance
        shooting.material.uniforms.uOpacity.value = Math.sin(
          Math.min(progress, 1) * Math.PI,
        )

        if (progress >= 1) {
          shotStart = -1
          shooting.mesh.visible = false
          nextShot = elapsed + randomBetween(5, 11)
        }
      }
    },
    resize(next) {
      size = next
      resizePixelCamera(camera, size)
      layoutSky()
    },
    dispose() {
      disposeObject(scene)
      stars.points.geometry.dispose()
      stars.material.dispose()
    },
  }
}

export default createNight
