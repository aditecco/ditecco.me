import { useSyncExternalStore } from "react"
import { SCENES } from "./scenes/catalog"
import type { Theme } from "./scenes/types"

export type ThemePreference = "system" | "light" | "dark"
export type { Theme }

export type Preferences = {
  theme: ThemePreference
  resolvedTheme: Theme
  sceneIndex: number
  autoRotate: boolean
  scenesEnabled: boolean
  // true while the current page has a scene stage that can run
  scenesAvailable: boolean
}

export const THEME_STORAGE_KEY = "ditecco:theme"
const AUTO_ROTATE_STORAGE_KEY = "ditecco:auto-rotate"
const SCENES_ENABLED_STORAGE_KEY = "ditecco:scenes-enabled"
export const DEFAULT_THEME: ThemePreference = "dark"

const SERVER_STATE: Preferences = {
  theme: DEFAULT_THEME,
  resolvedTheme: "dark",
  sceneIndex: 0,
  autoRotate: true,
  scenesEnabled: true,
  scenesAvailable: false,
}

let state = SERVER_STATE
const listeners = new Set<() => void>()
const darkQuery =
  typeof window === "undefined"
    ? null
    : window.matchMedia("(prefers-color-scheme: dark)")

function readStorage(key: string) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // storage can be unavailable (private mode, blocked cookies)
  }
}

function resolveTheme(theme: ThemePreference): Theme {
  if (theme !== "system") return theme
  return darkQuery?.matches ? "dark" : "light"
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (root.hasAttribute("data-theme-locked")) return
  root.dataset.theme = theme
}

function emit() {
  for (const listener of listeners) listener()
}

function isThemePreference(value: unknown): value is ThemePreference {
  return value === "system" || value === "light" || value === "dark"
}

if (darkQuery) {
  const stored = readStorage(THEME_STORAGE_KEY)
  const theme = isThemePreference(stored) ? stored : DEFAULT_THEME

  state = {
    ...SERVER_STATE,
    theme,
    resolvedTheme: resolveTheme(theme),
    autoRotate: readStorage(AUTO_ROTATE_STORAGE_KEY) !== "false",
    scenesEnabled: readStorage(SCENES_ENABLED_STORAGE_KEY) !== "false",
  }
  applyTheme(state.resolvedTheme)

  darkQuery.addEventListener("change", () => {
    if (state.theme === "system") setPreferences({ theme: "system" })
  })
}

export function getPreferences() {
  return state
}

export function setPreferences(next: Partial<Preferences>) {
  const merged = { ...state, ...next }

  if (next.theme) {
    merged.resolvedTheme = resolveTheme(next.theme)
    applyTheme(merged.resolvedTheme)
    writeStorage(THEME_STORAGE_KEY, next.theme)
  }

  if (next.autoRotate !== undefined) {
    writeStorage(AUTO_ROTATE_STORAGE_KEY, String(next.autoRotate))
  }

  if (next.scenesEnabled !== undefined) {
    writeStorage(SCENES_ENABLED_STORAGE_KEY, String(next.scenesEnabled))
  }

  if (next.sceneIndex !== undefined) {
    merged.sceneIndex =
      ((next.sceneIndex % SCENES.length) + SCENES.length) % SCENES.length
  }

  state = merged
  emit()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function usePreferences() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => SERVER_STATE,
  )
}
