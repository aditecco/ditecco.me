import { Color } from "three"
import { createShaderScene } from "./shader-scene"
import type { SceneFactory } from "./types"

const PALETTES = {
  light: { background: "#f7f4ee", line: "#b7ab96", accent: "#1abc9c" },
  dark: { background: "#14171b", line: "#4a5361", accent: "#1abc9c" },
}

const createTopography: SceneFactory = ({ size, theme }) => {
  const palette = PALETTES[theme]

  return createShaderScene({
    size,
    tone: theme,
    timeOffset: 5,
    uniforms: {
      uBackground: { value: new Color(palette.background) },
      uLine: { value: new Color(palette.line) },
      uAccent: { value: new Color(palette.accent) },
    },
    fragmentShader: /* glsl */ `
      uniform vec3 uBackground;
      uniform vec3 uLine;
      uniform vec3 uAccent;

      void main() {
        vec2 p = aspectUv() * 1.4;
        float t = uTime * 0.015;
        float height = fbm(p + vec2(t, -t * 0.6) + fbm(p * 0.5 - t) * 0.6);

        float levels = height * 14.0;
        float dist = abs(fract(levels - 0.5) - 0.5) / fwidth(levels);
        float line = 1.0 - smoothstep(0.0, 1.0, dist);

        // every fifth contour is an index line
        float indexLevel = levels / 5.0;
        float indexDistance = abs(fract(indexLevel - 0.5) - 0.5) / fwidth(indexLevel);
        float indexLine = 1.0 - smoothstep(0.5, 1.8, indexDistance);

        vec3 color = mix(uBackground, uLine, line * 0.7);
        color = mix(color, uAccent, indexLine * 0.8);

        gl_FragColor = vec4(color, 1.0);
        #include <colorspace_fragment>
      }
    `,
  })
}

export default createTopography
