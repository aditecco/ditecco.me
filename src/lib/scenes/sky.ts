import { createShaderScene } from "./shader-scene"
import type { SceneFactory } from "./types"

const createSky: SceneFactory = ({ size }) =>
  createShaderScene({
    size,
    tone: "dark",
    timeOffset: 20,
    fragmentShader: /* glsl */ `
      const vec3 ZENITH = vec3(0.16, 0.38, 0.72);
      const vec3 HORIZON = vec3(0.62, 0.78, 0.93);
      const vec3 SUNLIGHT = vec3(1.0, 0.97, 0.9);
      const vec3 SHADOW = vec3(0.5, 0.57, 0.68);

      float density(vec2 p) {
        vec2 drift = vec2(uTime * 0.03, 0.0);
        vec2 q = p * 1.8 + drift;
        float warp = fbm(q * 0.6 - drift * 0.4);
        float d = fbm(q + vec2(warp * 1.2, warp * 0.4));
        // fair-weather cumulus: more cover lower in the sky
        float cover = mix(0.5, 0.62, smoothstep(0.1, 0.9, vUv.y));
        return smoothstep(cover, cover + 0.22, d);
      }

      void main() {
        vec2 p = aspectUv();
        vec2 sun = vec2(uResolution.x / uResolution.y * 0.9, 1.05);

        vec3 sky = mix(HORIZON, ZENITH, pow(vUv.y, 0.7));
        sky += SUNLIGHT * 0.35 * exp(-length(p - sun) * 3.0);

        float d = density(p);
        vec2 toSun = normalize(sun - p) * 0.035;
        // self-shadowing: denser towards the sun means less light here
        float occlusion = density(p + toSun) * 0.6 + density(p + toSun * 2.5) * 0.4;
        float light = clamp(1.0 - occlusion * 0.75 + (1.0 - d) * 0.35, 0.0, 1.0);

        vec3 cloud = mix(SHADOW, SUNLIGHT, light);
        // brighter, translucent rims
        cloud = mix(cloud, SUNLIGHT, (1.0 - d) * 0.5);

        gl_FragColor = vec4(mix(sky, cloud, smoothstep(0.0, 0.6, d)), 1.0);
        #include <colorspace_fragment>
      }
    `,
  })

export default createSky
