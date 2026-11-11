// Lightweight metadata, safe to import without pulling in three.js

export const SCENES = [
  { id: "sky", label: "Calm sky" },
  { id: "pixel-clouds", label: "8-bit clouds" },
  { id: "lava-lamp", label: "Lava lamp" },
  { id: "light-shape", label: "Light shape" },
] as const

export type SceneId = (typeof SCENES)[number]["id"]
