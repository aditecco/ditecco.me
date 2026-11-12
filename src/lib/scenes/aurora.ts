import { createShaderScene } from "./shader-scene"
import type { SceneFactory } from "./types"

const createAurora: SceneFactory = ({ size }) =>
  createShaderScene({
    size,
    tone: "dark",
    timeOffset: 10,
    maxPixelRatio: 1,
    fragmentShader: /* glsl */ `
      const vec3 SKY_TOP = vec3(0.01, 0.02, 0.06);
      const vec3 SKY_BOTTOM = vec3(0.03, 0.08, 0.13);
      const vec3 GREEN = vec3(0.15, 1.0, 0.6);
      const vec3 VIOLET = vec3(0.55, 0.3, 1.0);

      float curtain(vec2 p, float seed) {
        float t = uTime * 0.05;
        float base = 0.42 + seed * 0.12
          + 0.1 * sin(p.x * 1.7 + t * 2.0 + seed * 4.0)
          + 0.08 * (fbm(vec2(p.x * 1.2 + t + seed * 10.0, t)) - 0.5) * 2.0;
        float above = p.y - base;
        // sharp lower edge, long soft fade upwards
        float shape = smoothstep(-0.015, 0.02, above) * exp(-max(above, 0.0) * 3.2);
        float rays = 0.55 + 0.45 * vnoise(vec2(p.x * 38.0 + seed * 7.0, uTime * 0.25));
        return shape * rays;
      }

      void main() {
        vec2 p = aspectUv();
        vec3 color = mix(SKY_BOTTOM, SKY_TOP, vUv.y);

        vec2 cell = floor(p * 90.0);
        float star = step(0.996, hash12(cell));
        color += star * 0.6 * (0.6 + 0.4 * sin(uTime * 2.0 + hash12(cell + 3.0) * 30.0));

        for (int i = 0; i < 3; i++) {
          float seed = float(i);
          float c = curtain(p, seed);
          float height = clamp((p.y - 0.35) * 1.6, 0.0, 1.0);
          vec3 tint = mix(GREEN, VIOLET, height + seed * 0.15);
          color += tint * c * (0.55 - seed * 0.12);
        }

        gl_FragColor = vec4(color, 1.0);
        #include <colorspace_fragment>
      }
    `,
  })

export default createAurora
