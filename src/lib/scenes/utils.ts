import {
  Material,
  Mesh,
  OrthographicCamera,
  Texture,
  type Object3D,
} from "three"
import type { Size } from "./types"

export function disposeObject(root: Object3D) {
  root.traverse(object => {
    if (!(object instanceof Mesh)) return

    object.geometry.dispose()

    const materials: Material[] = Array.isArray(object.material)
      ? object.material
      : [object.material]

    for (const material of materials) {
      for (const value of Object.values(material)) {
        if (value instanceof Texture) value.dispose()
      }
      material.dispose()
    }
  })
}

// 1 world unit = 1 CSS pixel, origin at bottom-left
export function createPixelCamera({ width, height }: Size) {
  const camera = new OrthographicCamera(0, width, height, 0, -100, 100)
  camera.position.z = 10
  return camera
}

export function resizePixelCamera(
  camera: OrthographicCamera,
  { width, height }: Size,
) {
  camera.right = width
  camera.top = height
  camera.updateProjectionMatrix()
}

export function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

export const FULLSCREEN_VERTEX = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

// gradient noise, returns roughly [-1, 1]
export const NOISE_3D = /* glsl */ `
  vec3 hash3(vec3 p) {
    p = vec3(
      dot(p, vec3(127.1, 311.7, 74.7)),
      dot(p, vec3(269.5, 183.3, 246.1)),
      dot(p, vec3(113.5, 271.9, 124.6))
    );
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  float corner(vec3 i, vec3 f, vec3 o) {
    return dot(hash3(i + o), f - o);
  }

  float noise3(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    vec3 u = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(
        mix(corner(i, f, vec3(0, 0, 0)), corner(i, f, vec3(1, 0, 0)), u.x),
        mix(corner(i, f, vec3(0, 1, 0)), corner(i, f, vec3(1, 1, 0)), u.x),
        u.y
      ),
      mix(
        mix(corner(i, f, vec3(0, 0, 1)), corner(i, f, vec3(1, 0, 1)), u.x),
        mix(corner(i, f, vec3(0, 1, 1)), corner(i, f, vec3(1, 1, 1)), u.x),
        u.y
      ),
      u.z
    );
  }
`
