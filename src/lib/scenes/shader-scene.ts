import {
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  type IUniform,
} from "three"
import type { SceneInstance, Size, Tone } from "./types"
import { disposeObject } from "./utils"

type Options = {
  size: Size
  tone: Tone
  fragmentShader: string
  uniforms?: Record<string, IUniform>
  // start mid-animation so the first frame is already interesting
  timeOffset?: number
}

const VERTEX = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

// shared by every full-screen shader: uniforms, varyings and 2D noise
export const SHADER_HEADER = /* glsl */ `
  uniform float uTime;
  uniform vec2 uResolution;
  varying vec2 vUv;

  float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  vec2 hash22(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.xx + p3.yz) * p3.zy);
  }

  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash12(i), hash12(i + vec2(1.0, 0.0)), u.x),
      mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    mat2 rotate = mat2(1.6, 1.2, -1.2, 1.6);
    for (int i = 0; i < 6; i++) {
      value += amplitude * vnoise(p);
      p = rotate * p;
      amplitude *= 0.5;
    }
    return value;
  }

  // aspect-corrected coordinates: y in [0, 1], x in [0, aspect]
  vec2 aspectUv() {
    return vec2(vUv.x * uResolution.x / uResolution.y, vUv.y);
  }
`

export function createShaderScene({
  size,
  tone,
  fragmentShader,
  uniforms = {},
  timeOffset = 0,
}: Options): SceneInstance {
  const scene = new Scene()
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)

  const material = new ShaderMaterial({
    uniforms: {
      uTime: { value: timeOffset },
      uResolution: { value: new Vector2(size.width, size.height) },
      ...uniforms,
    },
    vertexShader: VERTEX,
    fragmentShader: SHADER_HEADER + fragmentShader,
    depthTest: false,
    depthWrite: false,
  })

  scene.add(new Mesh(new PlaneGeometry(2, 2), material))

  return {
    scene,
    camera,
    tone,
    update(elapsed) {
      material.uniforms.uTime.value = elapsed + timeOffset
    },
    resize({ width, height }) {
      material.uniforms.uResolution.value.set(width, height)
    },
    dispose() {
      disposeObject(scene)
    },
  }
}
