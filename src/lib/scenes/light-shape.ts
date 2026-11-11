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

const createLightShape: SceneFactory = size => {
  const scene = new Scene()
  scene.background = new Color("#ffffff")

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

      // cosine palette, tuned towards soft pastels
      vec3 palette(float t) {
        return vec3(0.7) + vec3(0.3) * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67)));
      }

      void main() {
        vec3 n = normalize(vNormal);
        float facing = clamp(dot(n, normalize(vView)), 0.0, 1.0);
        float fresnel = pow(1.0 - facing, 2.0);

        vec3 base = palette(n.y * 0.35 + n.x * 0.2 + vNoise * 0.8 + uTime * 0.03);
        vec3 color = mix(base, vec3(1.0), 0.25 * facing * facing);
        color += fresnel * 0.25 * palette(uTime * 0.05 + 0.5);

        gl_FragColor = vec4(color, 1.0);
        #include <colorspace_fragment>
      }
    `,
  })

  const mesh = new Mesh(new IcosahedronGeometry(1, 40), material)
  scene.add(mesh)

  function layout(aspect: number) {
    // sit low and to the right, leaving room for the heading
    mesh.position.set(aspect * 0.75, -0.55, 0)
  }
  layout(camera.aspect)

  return {
    scene,
    camera,
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
