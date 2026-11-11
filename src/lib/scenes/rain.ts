import { createShaderScene } from "./shader-scene"
import type { SceneFactory } from "./types"

const createRain: SceneFactory = ({ size }) =>
  createShaderScene({
    size,
    tone: "dark",
    timeOffset: 12,
    fragmentShader: /* glsl */ `
      // blurry city lights behind the glass
      vec3 bokeh(vec2 p) {
        vec3 color = mix(vec3(0.03, 0.04, 0.08), vec3(0.09, 0.06, 0.13), vUv.y);
        for (int i = 0; i < 14; i++) {
          float fi = float(i);
          vec2 h = hash22(vec2(fi, fi * 1.7 + 3.0));
          vec2 center = vec2(h.x * uResolution.x / uResolution.y, h.y * 0.8 + 0.1);
          float radius = 0.05 + 0.07 * hash12(vec2(fi, 9.0));
          vec3 tint = mix(vec3(1.0, 0.55, 0.2), vec3(0.3, 0.6, 1.0), step(0.6, h.x * h.y * 2.0));
          tint = mix(tint, vec3(1.0, 0.25, 0.35), step(0.85, hash12(vec2(fi, 4.0))));
          float flicker = 0.8 + 0.2 * sin(uTime * 0.5 + fi);
          color += tint * 0.22 * flicker * smoothstep(radius, radius * 0.6, length(p - center));
        }
        return color;
      }

      // returns the refraction offset (xy) and coverage (z)
      vec3 slidingDrops(vec2 p) {
        vec2 grid = vec2(9.0, 1.5);
        vec2 cellP = p * grid;
        float column = floor(cellP.x);
        float seed = hash12(vec2(column, 1.0));
        float speed = 0.04 + seed * 0.05;
        cellP.y += uTime * speed * grid.y + seed * 10.0;
        vec2 local = fract(cellP) - 0.5;
        float wobble = sin(cellP.y * 6.0 + seed * 20.0) * 0.12;
        vec2 drop = vec2(local.x - wobble, local.y * grid.x / grid.y * 0.5);
        float r = length(drop);
        float body = smoothstep(0.3, 0.24, r) * step(0.3, seed);
        // a short trail of droplets above the drop
        float trailRow = fract(local.y * 8.0) - 0.5;
        float trail = smoothstep(0.12, 0.08, length(vec2(local.x - wobble, trailRow * 0.25)))
          * smoothstep(-0.1, 0.4, local.y) * step(0.3, seed);
        vec2 normal = drop / max(r, 1e-3);
        return vec3(normal * body * 0.08, max(body, trail * 0.8));
      }

      vec3 staticDrops(vec2 p) {
        vec2 cellP = p * 26.0;
        vec2 id = floor(cellP);
        vec2 offset = hash22(id) - 0.5;
        vec2 local = fract(cellP) - 0.5 - offset * 0.6;
        float life = fract(uTime * 0.05 + hash12(id + 7.0));
        float size = 0.38 * hash12(id + 2.0) * smoothstep(1.0, 0.7, life) * smoothstep(0.0, 0.1, life);
        float drop = smoothstep(size, size * 0.6, length(local));
        return vec3(local * drop * 0.08, drop);
      }

      void main() {
        vec2 p = aspectUv();
        vec3 a = slidingDrops(p);
        vec3 b = staticDrops(p);

        float coverage = max(a.z, b.z);
        vec2 offset = a.xy + b.xy;

        vec3 blurred = bokeh(p) * 0.85;
        // inside drops the view is sharper, flipped and slightly brighter
        vec3 through = bokeh(p - offset * 4.0) * 1.25;
        vec3 color = mix(blurred, through, coverage);
        // darker rims and a faint highlight give the drops some volume
        float rim = coverage * (1.0 - coverage) * 4.0;
        color *= 1.0 - rim * 0.45;
        color += coverage * 0.05 + smoothstep(0.02, 0.0, length(offset + vec2(0.02, -0.02))) * coverage * 0.15;

        gl_FragColor = vec4(color, 1.0);
        #include <colorspace_fragment>
      }
    `,
  })

export default createRain
