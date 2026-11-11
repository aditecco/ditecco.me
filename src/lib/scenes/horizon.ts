import { createShaderScene } from "./shader-scene"
import type { SceneFactory } from "./types"

const createHorizon: SceneFactory = ({ size }) =>
  createShaderScene({
    size,
    tone: "light",
    fragmentShader: /* glsl */ `
      const float HORIZON = 0.3;
      const vec3 SKY_TOP = vec3(0.86, 0.84, 0.95);
      const vec3 SKY_LOW = vec3(1.0, 0.86, 0.76);
      const vec3 SUN_TOP = vec3(1.0, 0.62, 0.38);
      const vec3 SUN_LOW = vec3(0.95, 0.33, 0.42);
      const vec3 SEA_NEAR = vec3(0.2, 0.25, 0.45);
      const vec3 SEA_FAR = vec3(0.55, 0.52, 0.7);

      void main() {
        float aspect = uResolution.x / uResolution.y;
        vec2 p = aspectUv();
        vec2 sun = vec2(aspect * 0.72, HORIZON + 0.12 + 0.02 * sin(uTime * 0.1));
        float radius = 0.2;

        vec3 color = mix(SKY_LOW, SKY_TOP, smoothstep(HORIZON, 1.0, p.y));

        float d = length(p - sun);
        float aa = fwidth(d);
        // horizontal cuts that thicken towards the bottom of the disc
        float band = fract((p.y - uTime * 0.01) * 22.0);
        float cut = step(band, mix(1.0, 0.25, smoothstep(sun.y + 0.05, sun.y - radius, p.y)));
        float disc = smoothstep(radius + aa, radius - aa, d) * cut;
        vec3 sunColor = mix(SUN_LOW, SUN_TOP, smoothstep(sun.y - radius, sun.y + radius, p.y));
        color = mix(color, sunColor, disc);
        color += SUN_TOP * 0.15 * exp(-d * 5.0);

        if (p.y < HORIZON) {
          float depth = p.y / HORIZON;
          vec3 sea = mix(SEA_NEAR, SEA_FAR, depth);
          // perspective-compressed swell lines
          float rows = 1.0 / max(depth, 0.03);
          float wave = vnoise(vec2(p.x * 6.0 * depth + uTime * 0.2, rows * 3.0 - uTime * 0.6));
          float glint = smoothstep(0.3, 0.0, abs(p.x - sun.x) - (1.0 - depth) * 0.1)
            * smoothstep(0.55, 0.85, wave);
          sea = mix(sea, SUN_TOP, glint * 0.8);
          sea += (wave - 0.5) * 0.05;
          color = sea;
        }

        gl_FragColor = vec4(color, 1.0);
        #include <colorspace_fragment>
      }
    `,
  })

export default createHorizon
