export const VERTEX = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0., 1.); }
`

// perspective fbm clouds; uBands/uBlocks are the two shader-side glitches
export const FRAGMENT = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 uRes;
uniform float uTime;
uniform float uBands;
uniform float uBlocks;
uniform float uSeed;
uniform float uLite;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3. - 2. * f);
  return mix(
    mix(hash(i), hash(i + vec2(1., 0.)), f.x),
    mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float a = .5;
  float s = 0.;
  for (int i = 0; i < 5; i++) {
    if (uLite > .5 && i > 2) break;
    s += a * noise(p);
    p = p * 2.03 + vec2(17.1, 9.2);
    a *= .5;
  }
  return s;
}

vec3 sky(vec2 uv) {
  float asp = uRes.x / uRes.y;
  float y = uv.y * .85 + .16;
  vec2 q = vec2((uv.x - .5) * asp * 1.4, 1.) / y * .9 + vec2(uTime * .035, uTime * .012);
  q += .55 * vec2(noise(q * .7 + 3.1), noise(q * .7 + 11.7));
  float d = fbm(q);
  float cov = smoothstep(.35, .62, d);
  float d2 = fbm(q + vec2(.35, .25));
  float lit = clamp(.5 + (d - d2) * 2.6, 0., 1.);
  vec3 base = mix(vec3(.16, .42, .86), vec3(.6, .79, .96), pow(1. - uv.y, 1.6));
  vec3 cl = mix(vec3(.5, .58, .72), vec3(1., .985, .96), lit);
  cl = mix(cl, vec3(1.), smoothstep(.35, .43, d) * (1. - smoothstep(.43, .55, d)) * .35);
  return mix(base, cl, cov * mix(.55, 1., smoothstep(0., .35, uv.y)));
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec3 c;
  if (uBands > .001) {
    float band = floor(uv.y * 18. + uSeed * 3.);
    float r = hash(vec2(band, uSeed));
    float off = step(.8, r) * (hash(vec2(band, uSeed + 3.)) - .5) * .16 * uBands;
    float sp = .004 * uBands + abs(off) * .08;
    vec2 u = vec2(uv.x + off, uv.y);
    c = vec3(sky(u + vec2(sp, 0.)).r, sky(u).g, sky(u - vec2(sp, 0.)).b);
  } else {
    c = sky(uv);
  }
  if (uBlocks > .001) {
    vec2 blk = floor(uv * vec2(10., 6.));
    if (hash(blk + uSeed * 1.7) > .94) c = floor(c * 3.) / 3.;
    if (hash(blk.yx + uSeed * 2.3) > .97) c = c.bgr;
  }
  c += (hash(uv * uRes + uTime) - .5) * .035;
  gl_FragColor = vec4(c, 1.);
}
`
