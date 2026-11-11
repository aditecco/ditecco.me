import type { Camera, Scene } from "three"

export type Size = {
  width: number
  height: number
}

export type SceneInstance = {
  scene: Scene
  camera: Camera
  update(elapsed: number, delta: number): void
  resize(size: Size): void
  dispose(): void
}

export type SceneFactory = (size: Size) => SceneInstance
