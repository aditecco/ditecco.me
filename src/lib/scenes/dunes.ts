import { createShaderScene } from "./shader-scene"
import type { SceneFactory } from "./types"

const createDunes: SceneFactory = ({ size }) =>
  createShaderScene({
    size,
    tone: "light",
    timeOffset: 30,
    fragmentShader: /* glsl */ `
      const vec3 SKY_TOP = vec3(0.98, 0.9, 0.82);
      const vec3 SKY_BOTTOM = vec3(1.0, 0.96, 0.9);
      const int LAYERS = 5;

      // few octaves: smooth crests without high-frequency shading noise
      float smoothNoise(vec2 p) {
        return vnoise(p) * 0.65 + vnoise(p * 2.1 + 5.0) * 0.35;
      }

      float ridge(float x, float layer) {
        float t = uTime * (0.006 + layer * 0.004);
        float n = smoothNoise(vec2(x * (1.2 + layer * 0.4) + t + layer * 13.0, layer));
        // fold the noise to get sharp crests
        return 1.0 - abs(n * 2.0 - 1.0);
      }

      float heightAt(float x, float layer) {
        float base = 0.55 - layer * 0.11;
        return base + ridge(x, layer) * (0.12 + layer * 0.03);
      }

      void main() {
        vec2 p = aspectUv();
        vec3 color = mix(SKY_BOTTOM, SKY_TOP, vUv.y);

        for (int i = 0; i < LAYERS; i++) {
          float layer = float(i);
          float h = heightAt(p.x, layer);
          // nearer layers are deeper and more saturated
          float depth = layer / float(LAYERS - 1);
          vec3 crest = mix(vec3(0.98, 0.86, 0.7), vec3(0.93, 0.58, 0.3), depth);
          vec3 base = mix(vec3(0.9, 0.74, 0.62), vec3(0.62, 0.28, 0.16), depth);
          // lit crest fading into the shaded trough below it
          vec3 sand = mix(crest, base, smoothstep(0.0, 0.14, h - p.y));

          float edge = fwidth(p.y);
          color = mix(color, sand, smoothstep(h + edge, h - edge, p.y));
        }

        gl_FragColor = vec4(color, 1.0);
        #include <colorspace_fragment>
      }
    `,
  })

export default createDunes
