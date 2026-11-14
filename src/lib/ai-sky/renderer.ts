import { FRAGMENT, VERTEX } from "./shader"

export type SkyUniforms = {
  time: number
  bands: number
  blocks: number
  seed: number
  lite: boolean
}

export type SkyRenderer = ReturnType<typeof createSkyRenderer>

// a single full-screen triangle; returns null when WebGL is unavailable
export function createSkyRenderer(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl", {
    antialias: false,
    alpha: false,
    depth: false,
    powerPreference: "low-power",
  })
  if (!gl) return null

  function compile(type: number, source: string) {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    return shader
  }

  const program = gl.createProgram()
  const vs = compile(gl.VERTEX_SHADER, VERTEX)
  const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT)
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null

  gl.useProgram(program)
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW,
  )
  const position = gl.getAttribLocation(program, "p")
  gl.enableVertexAttribArray(position)
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

  const loc = {
    res: gl.getUniformLocation(program, "uRes"),
    time: gl.getUniformLocation(program, "uTime"),
    bands: gl.getUniformLocation(program, "uBands"),
    blocks: gl.getUniformLocation(program, "uBlocks"),
    seed: gl.getUniformLocation(program, "uSeed"),
    lite: gl.getUniformLocation(program, "uLite"),
  }

  function draw(u: SkyUniforms) {
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.uniform2f(loc.res, canvas.width, canvas.height)
    gl.uniform1f(loc.time, u.time)
    gl.uniform1f(loc.bands, u.bands)
    gl.uniform1f(loc.blocks, u.blocks)
    gl.uniform1f(loc.seed, u.seed)
    gl.uniform1f(loc.lite, u.lite ? 1 : 0)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  function dispose() {
    gl.deleteBuffer(buffer)
    gl.deleteProgram(program)
    gl.deleteShader(vs)
    gl.deleteShader(fs)
    gl.getExtension("WEBGL_lose_context")?.loseContext()
  }

  return { draw, dispose }
}
