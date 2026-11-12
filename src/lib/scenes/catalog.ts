// Lightweight metadata, safe to import without pulling in three.js
// Order alternates light and dark scenes for the rotation

export const SCENES = [
  { id: "sky", label: "Sky" },
  { id: "dunes", label: "Dunes" },
  { id: "aurora", label: "Aurora" },
  { id: "pixel-clouds", label: "8-bit clouds" },
  { id: "lava-lamp", label: "Lava lamp" },
  { id: "topography", label: "Topography" },
  { id: "night", label: "Night sky" },
  { id: "flock", label: "Flock" },
  { id: "rain", label: "Rain on glass" },
  { id: "horizon", label: "Horizon" },
  { id: "light-shape", label: "Light shape" },
  { id: "life", label: "Life" },
  { id: "orbits", label: "Orbits" },
] as const

export type SceneId = (typeof SCENES)[number]["id"]
