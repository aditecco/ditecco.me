import {
  IcosahedronGeometry,
  Mesh,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  Color,
} from "three"
import type { SceneFactory } from "./types"
import { NOISE_3D, disposeObject } from "./utils"

const BACKGROUNDS = { light: "#ffffff", dark: "#111317" }

const createLightShape: SceneFactory = ({ size, theme }) => {
  const scene = new Scene()
  scene.background = new Color(BACKGROUNDS[theme])

  const camera = new PerspectiveCamera(35, size.width / size.height, 0.1, 20)
  camera.position.z = 5

  const material = new ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
    },
    vertexShader: /* glsl */ `
      uniform float uTime;
      varying vec3 vNormal;
      varying vec3 vView;
      varying float vNoise;

      ${NOISE_3D}

      float displacement(vec3 p) {
        float t = uTime * 0.22;
        return 0.32 * noise3(p * 1.3 + vec3(t, t * 0.7, -t * 0.4))
             + 0.08 * noise3(p * 3.1 - vec3(t * 0.5));
      }

      vec3 displaced(vec3 p) {
        return p + normalize(p) * displacement(p);
      }

      void main() {
        vec3 n = normalize(position);
        vec3 helper = abs(n.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
        vec3 tangent = normalize(cross(n, helper));
        vec3 bitangent = cross(n, tangent);

        float eps = 0.01;
        vec3 p = displaced(position);
        vec3 pt = displaced(position + tangent * eps);
        vec3 pb = displaced(position + bitangent * eps);
        vec3 objectNormal = normalize(cross(pt - p, pb - p));

        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        vNormal = normalize(normalMatrix * objectNormal);
        vView = normalize(-mv.xyz);
        vNoise = displacement(position);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      varying vec3 vNormal;
      varying vec3 vView;
      varying float vNoise;

      // cosine palette in deep jewel tones
      vec3 palette(float t) {
        return vec3(0.45, 0.3, 0.55) + vec3(0.45, 0.35, 0.4) * cos(6.28318 * (t + vec3(0.0, 0.25, 0.55)));
      }

      void main() {
        vec3 n = normalize(vNormal);
        float facing = clamp(dot(n, normalize(vView)), 0.0, 1.0);
        float fresnel = pow(1.0 - facing, 2.5);

        vec3 base = palette(n.y * 0.3 + n.x * 0.2 + vNoise * 0.9 + uTime * 0.03);
        // soft key light from the top left
        float key = clamp(dot(n, normalize(vec3(-0.5, 0.7, 0.6))), 0.0, 1.0);
        vec3 color = base * (0.55 + 0.6 * key);
        color += fresnel * 0.6 * palette(uTime * 0.05 + 0.5);

        gl_FragColor = vec4(color, 1.0);
        #include <colorspace_fragment>
      }
    `,
  })

  const mesh = new Mesh(new IcosahedronGeometry(1, 28), material)
  scene.add(mesh)

  function layout(aspect: number) {
    // sit low and to the right, leaving room for the heading
    mesh.position.set(aspect * 0.75, -0.55, 0)
  }
  layout(camera.aspect)

  return {
    scene,
    camera,
    tone: theme,
    update(elapsed) {
      material.uniforms.uTime.value = elapsed
      mesh.rotation.y = elapsed * 0.08
      mesh.rotation.x = Math.sin(elapsed * 0.05) * 0.3
    },
    resize({ width, height }) {
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      layout(camera.aspect)
    },
    dispose() {
      disposeObject(scene)
    },
  }
}

export default createLightShape
