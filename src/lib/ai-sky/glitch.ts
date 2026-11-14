export type GlitchKind = "bands" | "blocks" | "ghost" | "slice"

export type GlitchState = {
  bands: number
  blocks: number
  // shader seed while a sky glitch is on
  seed: number
  // seeds for the DOM-side glitches; 0 means off
  ghost: number
  slice: number
}

const DURATION: Record<GlitchKind, number> = {
  bands: 0.22,
  blocks: 0.14,
  ghost: 0.26,
  slice: 0.12,
}
// lingering glitches flicker like a failing neon sign, in slots this long
const FLICKER_SLOT = 0.055
const LINGER_CHANCE = 0.35
const FOLLOW_UP_CHANCE = 0.3
const QUICK_REFIRE_CHANCE = 0.18

function hash(a: number) {
  const v = Math.sin(a * 127.1) * 43758.5453
  return v - Math.floor(v)
}

// One glitch at a time, sometimes followed by a second kind; gaps vary from
// quick re-fires to a few seconds of calm.
export function createGlitchClock(
  kinds: GlitchKind[],
  random: () => number = Math.random,
) {
  const start: Partial<Record<GlitchKind, number>> = {}
  const end: Partial<Record<GlitchKind, number>> = {}
  const linger: Partial<Record<GlitchKind, number>> = {}
  let next = 1.6

  function pick() {
    return kinds[Math.floor(random() * kinds.length)]
  }

  function schedule(clock: number) {
    const first = pick()
    const lingers = random() < LINGER_CHANCE

    start[first] = clock
    linger[first] = lingers ? 1 + Math.floor(random() * 997) : 0
    end[first] = lingers
      ? clock + 0.7 + random() * 1.3
      : clock + DURATION[first] * (0.7 + random() * 0.6)

    if (kinds.length > 1 && random() < FOLLOW_UP_CHANCE) {
      const second = pick()
      if (second !== first) {
        linger[second] = 0
        start[second] = clock + 0.15 + random() * 0.3
        end[second] = start[second] + DURATION[second]
      }
    }

    const gap = random()
    next = lingers
      ? end[first] + 0.4 + random() * 1.6
      : gap < QUICK_REFIRE_CHANCE
        ? clock + 0.25 + random() * 0.3
        : clock + 0.9 + random() * 2.6
  }

  function on(kind: GlitchKind, clock: number) {
    if (!(clock >= (start[kind] ?? 0) && clock < (end[kind] ?? 0))) {
      return false
    }
    if (!linger[kind]) return true

    const slot = Math.floor((clock - start[kind]) / FLICKER_SLOT)
    return hash(slot + linger[kind] * 17.3) > 0.32
  }

  function seedFor(kind: GlitchKind, clock: number) {
    return linger[kind] || Math.floor(clock * 12) + 1
  }

  function step(clock: number): GlitchState {
    if (clock > next) schedule(clock)

    const bands = on("bands", clock)
    const blocks = on("blocks", clock)

    return {
      bands: bands ? 1 : 0,
      blocks: blocks ? 1 : 0,
      seed: bands
        ? seedFor("bands", clock)
        : blocks
          ? seedFor("blocks", clock)
          : Math.floor(clock * 12) + 1,
      ghost: on("ghost", clock) ? seedFor("ghost", clock) : 0,
      slice: on("slice", clock) ? seedFor("slice", clock) + 7 : 0,
    }
  }

  return { step }
}

// a frozen glitch, for the still frame
export const STILL_GLITCH: GlitchState = {
  bands: 1,
  blocks: 1,
  seed: 5,
  ghost: 5,
  slice: 5,
}

export const NO_GLITCH: GlitchState = {
  bands: 0,
  blocks: 0,
  seed: 5,
  ghost: 0,
  slice: 0,
}
