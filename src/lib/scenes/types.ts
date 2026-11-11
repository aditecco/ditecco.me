import type { Camera, Scene } from "three"

export type Size = {
  width: number
  height: number
}

export type Theme = "light" | "dark"

// whether the heading over the scene needs dark or light text
export type Tone = "light" | "dark"

export type SceneContext = {
  size: Size
  theme: Theme
}

export type SceneInstance = {
  scene: Scene
  camera: Camera
  tone: Tone
  update(elapsed: number, delta: number): void
  resize(size: Size): void
  dispose(): void
}

export type SceneFactory = (context: SceneContext) => SceneInstance
