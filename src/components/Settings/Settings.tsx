/* ---------------------------------
Settings
--------------------------------- */

import { Monitor, Moon, Settings as SettingsIcon, Sun } from "lucide-react"
import { useEffect, useRef } from "react"
import {
  setPreferences,
  usePreferences,
  type ThemePreference,
} from "../../lib/preferences"
import { SCENES } from "../../lib/scenes/catalog"
import "./Settings.scss"

const PANEL_ID = "settings-panel"
const PANEL_OFFSET = 8

const THEMES = [
  { value: "system", label: "System", Icon: Monitor },
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
] satisfies { value: ThemePreference; label: string; Icon: typeof Sun }[]

export default function Settings() {
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const { theme, sceneIndex, autoRotate, scenesEnabled, scenesAvailable } =
    usePreferences()

  // anchor the popover (rendered in the top layer) under its button
  useEffect(() => {
    const panel = panelRef.current
    const toggle = toggleRef.current
    if (!panel || !toggle) return

    function place(event: Event) {
      if ((event as ToggleEvent).newState !== "open") return
      const rect = toggle.getBoundingClientRect()
      panel.style.top = `${rect.bottom + window.scrollY + PANEL_OFFSET}px`
      panel.style.right = `${document.documentElement.clientWidth - rect.right}px`
    }

    panel.addEventListener("beforetoggle", place)
    return () => panel.removeEventListener("beforetoggle", place)
  }, [])

  return (
    <div className="Settings">
      <button
        ref={toggleRef}
        type="button"
        className="Settings-toggle"
        popoverTarget={PANEL_ID}
        aria-label="Settings"
        title="Settings"
      >
        <SettingsIcon size={20} strokeWidth={1.75} aria-hidden="true" />
      </button>

      <div
        ref={panelRef}
        id={PANEL_ID}
        className="Settings-panel"
        popover="auto"
        role="dialog"
        aria-label="Settings"
      >
        <fieldset className="Settings-group">
          <legend className="Settings-heading">Theme</legend>
          <div className="Settings-segmented">
            {THEMES.map(({ value, label, Icon }) => (
              <label key={value} className="Settings-segment">
                <input
                  type="radio"
                  name="theme"
                  value={value}
                  checked={theme === value}
                  onChange={() => setPreferences({ theme: value })}
                />
                <Icon size={14} strokeWidth={2} aria-hidden="true" />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        {scenesAvailable && (
          <div className="Settings-group">
            <label className="Settings-row">
              <span className="Settings-heading">Animated scenes</span>
              <input
                type="checkbox"
                role="switch"
                className="Settings-switch"
                checked={scenesEnabled}
                onChange={event =>
                  setPreferences({ scenesEnabled: event.target.checked })
                }
              />
            </label>

            {scenesEnabled && (
              <>
                <select
                  className="Settings-select"
                  aria-label="Scene"
                  value={sceneIndex}
                  onChange={event =>
                    setPreferences({ sceneIndex: Number(event.target.value) })
                  }
                >
                  {SCENES.map((scene, i) => (
                    <option key={scene.id} value={i}>
                      {scene.label}
                    </option>
                  ))}
                </select>

                <label className="Settings-check">
                  <input
                    type="checkbox"
                    checked={autoRotate}
                    onChange={event =>
                      setPreferences({ autoRotate: event.target.checked })
                    }
                  />
                  Rotate automatically
                </label>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
