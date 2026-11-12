import { createShaderScene } from "./shader-scene"
import type { SceneFactory } from "./types"

const createLavaLamp: SceneFactory = ({ size }) =>
  createShaderScene({
    size,
    tone: "dark",
    timeOffset: 40,
    fragmentShader: /* glsl */ `
      const vec3 LIQUID_TOP = vec3(0.06, 0.02, 0.12);
      const vec3 LIQUID_BOTTOM = vec3(0.24, 0.03, 0.16);
      const vec3 WAX_RIM = vec3(0.62, 0.03, 0.12);
      const vec3 WAX_CORE = vec3(1.0, 0.36, 0.08);
      const vec3 WAX_HOT = vec3(1.0, 0.72, 0.25);
      const int BLOBS = 7;

      float field(vec2 p, float aspect) {
        float sum = 0.0;
        for (int i = 0; i < BLOBS; i++) {
          float fi = float(i);
          vec2 center = vec2(
            0.5 + 0.34 * sin(uTime * 0.09 * (1.0 + fi * 0.21) + fi * 1.7),
            0.5 + 0.62 * sin(uTime * 0.06 * (1.0 + fi * 0.29) + fi * 2.3)
          );
          center.x *= aspect;
          float radius = 0.085 + 0.035 * sin(fi * 3.1 + uTime * 0.17);
          vec2 d = p - center;
          sum += radius * radius / max(dot(d, d), 1e-4);
        }
        return sum;
      }

      void main() {
        float aspect = uResolution.x / uResolution.y;
        vec2 p = aspectUv();
        float f = field(p, aspect);

        // the lamp's heat source glows from below
        vec3 liquid = mix(LIQUID_BOTTOM, LIQUID_TOP, smoothstep(0.0, 1.0, vUv.y));
        liquid += WAX_RIM * 0.35 * smoothstep(0.4, 0.0, vUv.y);
        liquid += WAX_RIM * 0.4 * smoothstep(0.3, 1.0, f);

        float edge = fwidth(f);
        float mask = smoothstep(1.0 - edge, 1.0 + edge, f);

        vec3 wax = mix(WAX_RIM, WAX_CORE, smoothstep(1.0, 2.2, f));
        wax = mix(wax, WAX_HOT, smoothstep(2.5, 6.0, f) * (1.0 - vUv.y * 0.6));

        gl_FragColor = vec4(mix(liquid, wax, mask), 1.0);
        #include <colorspace_fragment>
      }
    `,
  })

export default createLavaLamp
