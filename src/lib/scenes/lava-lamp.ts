import {
  Color,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
} from "three"
import type { SceneFactory } from "./types"
import { FULLSCREEN_VERTEX, disposeObject } from "./utils"

const createLavaLamp: SceneFactory = size => {
  const scene = new Scene()
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)

  const material = new ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: new Vector2(size.width, size.height) },
      uBackground: { value: new Color("#fff5ec") },
      uLow: { value: new Color("#ff8f6b") },
      uHigh: { value: new Color("#ffc977") },
    },
    vertexShader: FULLSCREEN_VERTEX,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec3 uBackground;
      uniform vec3 uLow;
      uniform vec3 uHigh;
      varying vec2 vUv;

      const int BLOBS = 6;

      float field(vec2 p, float aspect) {
        float sum = 0.0;
        for (int i = 0; i < BLOBS; i++) {
          float fi = float(i);
          vec2 center = vec2(
            0.5 + 0.32 * sin(uTime * 0.09 * (1.0 + fi * 0.21) + fi * 1.7),
            0.5 + 0.6 * sin(uTime * 0.06 * (1.0 + fi * 0.29) + fi * 2.3)
          );
          center.x *= aspect;
          float radius = 0.09 + 0.035 * sin(fi * 3.1 + uTime * 0.17);
          vec2 d = p - center;
          sum += radius * radius / max(dot(d, d), 1e-4);
        }
        return sum;
      }

      void main() {
        float aspect = uResolution.x / uResolution.y;
        vec2 p = vec2(vUv.x * aspect, vUv.y);
        float f = field(p, aspect);

        float edge = fwidth(f);
        float mask = smoothstep(1.0 - edge, 1.0 + edge, f);

        vec3 wax = mix(uLow, uHigh, clamp(vUv.y + (f - 1.0) * 0.08, 0.0, 1.0));
        vec3 glow = uBackground + (uLow - uBackground) * 0.18 * smoothstep(0.35, 1.0, f);

        gl_FragColor = vec4(mix(glow, wax, mask), 1.0);
        #include <colorspace_fragment>
      }
    `,
    depthTest: false,
    depthWrite: false,
  })

  scene.add(new Mesh(new PlaneGeometry(2, 2), material))

  return {
    scene,
    camera,
    update(elapsed) {
      // start mid-flow so the first frame isn't a symmetric cluster
      material.uniforms.uTime.value = elapsed + 40
    },
    resize({ width, height }) {
      material.uniforms.uResolution.value.set(width, height)
    },
    dispose() {
      disposeObject(scene)
    },
  }
}

export default createLavaLamp
