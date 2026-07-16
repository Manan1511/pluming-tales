import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * Ink-in-water background for the hero, driven by a small GPU fluid
 * simulation (stable fluids: advection, pressure projection, vorticity
 * confinement). Ink splashes in from the right edge and diffuses leftward;
 * a CSS mask fades it out before it reaches the headline.
 *
 * Falls back to a static ink wash when WebGL2/float textures are missing,
 * or under prefers-reduced-motion. Phones (viewport < 768px) get a much
 * cheaper version of the same sim — smaller grid, fewer pressure-solve
 * iterations, no vorticity pass, and the physics step runs at half the
 * frame rate — since the full solve is genuine, continuous GPU load that
 * shows up as jank/heat on weaker tile renderers. Phones also don't get the
 * touch-drag ink trail: dragging a finger through the hero is how you
 * scroll past it, and firing splats on every scroll touchmove fought the
 * scroll gesture itself. A single tap still drops a splash.
 */

// Ink: near-black (matches the brand's onyx token, never pure #000).
const INK = [0.05, 0.043, 0.028] as const

// Finer sim grid resolves thin trailing filaments instead of a soft blob.
// Phones get a much cheaper grid (see MOBILE_BREAKPOINT below) — the full
// 256/24-iteration solve is real GPU load on weak tile renderers.
const SIM_RES = 256
const DYE_RES = 768
const PRESSURE_ITERATIONS = 24
const SIM_RES_MOBILE = 64
const DYE_RES_MOBILE = 256
const PRESSURE_ITERATIONS_MOBILE = 5
// Runs the physics step on every other rAF tick on mobile — an ink field
// this slow-moving doesn't need 60 solves/sec, and halving them roughly
// halves the sim's GPU cost with no visible loss of smoothness.
const MOBILE_FRAME_SKIP = 2
const MOBILE_BREAKPOINT = 768 // matches the site's md: breakpoint everywhere else
// Vorticity confinement produces the threading/curling tendrils. Too high
// and a single splash floods the whole canvas in a second or two — this
// needs to stay modest.
const CURL_STRENGTH = 30
// Velocity needs to survive a couple of seconds for vortices to actually
// shear the dye into tendrils; too fast a decay and the splash never
// develops motion before it goes still.
const VELOCITY_DISSIPATION = 0.998
const DYE_DISSIPATION = 0.9985

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))

const VERT = `
  precision highp float;
  attribute vec2 aPosition;
  varying vec2 vUv;
  void main () {
    vUv = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`

const SPLAT_FRAG = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTarget;
  uniform vec3 uColor;
  uniform vec2 uPoint;
  uniform float uRadius;
  uniform float uAspect;
  void main () {
    vec2 p = vUv - uPoint;
    p.x *= uAspect;
    vec3 splat = exp(-dot(p, p) / uRadius) * uColor;
    vec3 base = texture2D(uTarget, vUv).xyz;
    gl_FragColor = vec4(base + splat, 1.0);
  }
`

const ADVECTION_FRAG = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform vec2 uTexelSize;
  uniform float uDt;
  uniform float uDissipation;
  void main () {
    vec2 coord = vUv - uDt * texture2D(uVelocity, vUv).xy * uTexelSize;
    gl_FragColor = uDissipation * texture2D(uSource, coord);
    gl_FragColor.a = 1.0;
  }
`

const DIVERGENCE_FRAG = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform vec2 uTexelSize;
  void main () {
    float L = texture2D(uVelocity, vUv - vec2(uTexelSize.x, 0.0)).x;
    float R = texture2D(uVelocity, vUv + vec2(uTexelSize.x, 0.0)).x;
    float B = texture2D(uVelocity, vUv - vec2(0.0, uTexelSize.y)).y;
    float T = texture2D(uVelocity, vUv + vec2(0.0, uTexelSize.y)).y;
    gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
  }
`

const PRESSURE_FRAG = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uPressure;
  uniform sampler2D uDivergence;
  uniform vec2 uTexelSize;
  void main () {
    float L = texture2D(uPressure, vUv - vec2(uTexelSize.x, 0.0)).x;
    float R = texture2D(uPressure, vUv + vec2(uTexelSize.x, 0.0)).x;
    float B = texture2D(uPressure, vUv - vec2(0.0, uTexelSize.y)).x;
    float T = texture2D(uPressure, vUv + vec2(0.0, uTexelSize.y)).x;
    float divergence = texture2D(uDivergence, vUv).x;
    gl_FragColor = vec4((L + R + B + T - divergence) * 0.25, 0.0, 0.0, 1.0);
  }
`

const GRADIENT_SUBTRACT_FRAG = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uPressure;
  uniform sampler2D uVelocity;
  uniform vec2 uTexelSize;
  void main () {
    float L = texture2D(uPressure, vUv - vec2(uTexelSize.x, 0.0)).x;
    float R = texture2D(uPressure, vUv + vec2(uTexelSize.x, 0.0)).x;
    float B = texture2D(uPressure, vUv - vec2(0.0, uTexelSize.y)).x;
    float T = texture2D(uPressure, vUv + vec2(0.0, uTexelSize.y)).x;
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity -= 0.5 * vec2(R - L, T - B);
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`

const CURL_FRAG = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform vec2 uTexelSize;
  void main () {
    float L = texture2D(uVelocity, vUv - vec2(uTexelSize.x, 0.0)).y;
    float R = texture2D(uVelocity, vUv + vec2(uTexelSize.x, 0.0)).y;
    float B = texture2D(uVelocity, vUv - vec2(0.0, uTexelSize.y)).x;
    float T = texture2D(uVelocity, vUv + vec2(0.0, uTexelSize.y)).x;
    gl_FragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
  }
`

const VORTICITY_FRAG = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform sampler2D uCurl;
  uniform vec2 uTexelSize;
  uniform float uCurlStrength;
  uniform float uDt;
  void main () {
    float L = texture2D(uCurl, vUv - vec2(uTexelSize.x, 0.0)).x;
    float R = texture2D(uCurl, vUv + vec2(uTexelSize.x, 0.0)).x;
    float B = texture2D(uCurl, vUv - vec2(0.0, uTexelSize.y)).x;
    float T = texture2D(uCurl, vUv + vec2(0.0, uTexelSize.y)).x;
    float C = texture2D(uCurl, vUv).x;
    vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
    force /= length(force) + 0.0001;
    force *= uCurlStrength * C;
    force.y *= -1.0;
    vec2 velocity = texture2D(uVelocity, vUv).xy + force * uDt;
    gl_FragColor = vec4(clamp(velocity, -1000.0, 1000.0), 0.0, 1.0);
  }
`

const DISPLAY_FRAG = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uDye;
  uniform vec3 uInk;
  void main () {
    float d = texture2D(uDye, vUv).r;
    // Graded, not flat: thin trailing dye reads faint, only the dense core
    // of a fresh splash goes near-black. Keeps text behind the sim legible.
    float alpha = smoothstep(0.03, 0.55, d) * 0.62;
    gl_FragColor = vec4(uInk, alpha);
  }
`

interface FBO {
  fbo: WebGLFramebuffer
  texture: WebGLTexture
  texelSizeX: number
  texelSizeY: number
  attach: (unit: number) => number
}

interface DoubleFBO {
  read: FBO
  write: FBO
  swap: () => void
  texelSizeX: number
  texelSizeY: number
}

function supportsFallbackOnly(reduceMotion: boolean | null) {
  // Touch devices run the sim too (touchmove/tap drive it); only
  // reduced-motion users get the static wash.
  if (reduceMotion) return true
  return typeof window === 'undefined'
}

export default function HeroInkFluid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduceMotion = useReducedMotion()
  const fallback = supportsFallbackOnly(reduceMotion)

  useEffect(() => {
    if (fallback) return
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl2', { alpha: true, depth: false, stencil: false, antialias: false })
    if (!gl) return
    if (!gl.getExtension('EXT_color_buffer_float')) return
    const supportLinear = !!gl.getExtension('OES_texture_float_linear')

    // Evaluated once at mount, same as the canvas resize below — not
    // re-checked on rotation/resize, that's an acceptable edge case here.
    const isMobile = window.innerWidth < MOBILE_BREAKPOINT
    const simRes = isMobile ? SIM_RES_MOBILE : SIM_RES
    const dyeRes = isMobile ? DYE_RES_MOBILE : DYE_RES
    const pressureIterations = isMobile ? PRESSURE_ITERATIONS_MOBILE : PRESSURE_ITERATIONS

    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.5)
    const resize = () => {
      canvas.width = Math.floor(canvas.clientWidth * dpr)
      canvas.height = Math.floor(canvas.clientHeight * dpr)
    }
    resize()

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type)!
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('ink-fluid shader:', gl.getShaderInfoLog(shader))
      }
      return shader
    }
    const vertShader = compileShader(gl.VERTEX_SHADER, VERT)
    const makeProgram = (fragSource: string) => {
      const prog = gl.createProgram()!
      gl.attachShader(prog, vertShader)
      gl.attachShader(prog, compileShader(gl.FRAGMENT_SHADER, fragSource))
      // Every program must agree that the quad lives at attribute 0 —
      // without this the linker is free to assign any location, and programs
      // whose aPosition lands elsewhere silently draw nothing.
      gl.bindAttribLocation(prog, 0, 'aPosition')
      gl.linkProgram(prog)
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.error('ink-fluid link:', gl.getProgramInfoLog(prog))
      }
      const uniforms: Record<string, WebGLUniformLocation> = {}
      const count = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS)
      for (let i = 0; i < count; i++) {
        const name = gl.getActiveUniform(prog, i)!.name
        uniforms[name] = gl.getUniformLocation(prog, name)!
      }
      return { prog, uniforms }
    }

    const splatProgram = makeProgram(SPLAT_FRAG)
    const advectionProgram = makeProgram(ADVECTION_FRAG)
    const divergenceProgram = makeProgram(DIVERGENCE_FRAG)
    const pressureProgram = makeProgram(PRESSURE_FRAG)
    const gradientProgram = makeProgram(GRADIENT_SUBTRACT_FRAG)
    const curlProgram = makeProgram(CURL_FRAG)
    const vorticityProgram = makeProgram(VORTICITY_FRAG)
    const displayProgram = makeProgram(DISPLAY_FRAG)

    const quad = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, quad)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

    const filtering = supportLinear ? gl.LINEAR : gl.NEAREST

    const createFBO = (w: number, h: number): FBO => {
      const texture = gl.createTexture()!
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filtering)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filtering)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null)
      const fbo = gl.createFramebuffer()!
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)
      gl.clearColor(0, 0, 0, 1)
      gl.clear(gl.COLOR_BUFFER_BIT)
      return {
        fbo,
        texture,
        texelSizeX: 1 / w,
        texelSizeY: 1 / h,
        attach(unit: number) {
          gl.activeTexture(gl.TEXTURE0 + unit)
          gl.bindTexture(gl.TEXTURE_2D, texture)
          return unit
        },
      }
    }

    const createDoubleFBO = (w: number, h: number): DoubleFBO => {
      let read = createFBO(w, h)
      let write = createFBO(w, h)
      return {
        get read() {
          return read
        },
        get write() {
          return write
        },
        swap() {
          const tmp = read
          read = write
          write = tmp
        },
        texelSizeX: 1 / w,
        texelSizeY: 1 / h,
      } as DoubleFBO
    }

    const aspect = canvas.width / canvas.height
    const simW = Math.round(simRes * aspect)
    const simH = simRes
    const dyeW = Math.round(dyeRes * aspect)
    const dyeH = dyeRes

    const velocity = createDoubleFBO(simW, simH)
    const dye = createDoubleFBO(dyeW, dyeH)
    const divergence = createFBO(simW, simH)
    const curl = createFBO(simW, simH)
    const pressure = createDoubleFBO(simW, simH)

    const blit = (target: FBO | null) => {
      if (target) {
        gl.viewport(0, 0, Math.round(1 / target.texelSizeX), Math.round(1 / target.texelSizeY))
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo)
      } else {
        gl.viewport(0, 0, canvas.width, canvas.height)
        gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      }
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    const splat = (x: number, y: number, dx: number, dy: number, amount: number, radius: number) => {
      gl.useProgram(splatProgram.prog)
      gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0))
      gl.uniform1f(splatProgram.uniforms.uAspect, aspect)
      gl.uniform2f(splatProgram.uniforms.uPoint, x, y)
      gl.uniform3f(splatProgram.uniforms.uColor, dx, dy, 0)
      gl.uniform1f(splatProgram.uniforms.uRadius, radius)
      blit(velocity.write)
      velocity.swap()

      gl.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0))
      gl.uniform3f(splatProgram.uniforms.uColor, amount, amount, amount)
      blit(dye.write)
      dye.swap()
    }

    // The sim is pointer-driven: moving through the hero drags ink through
    // the water, a click/tap drops a big dark splash that then diffuses.
    // Dye is over-saturated (display alpha caps regardless) so splashes
    // survive numerical diffusion and visibly thin out over time.
    // Velocities are deliberately large (hundreds, not tens): the vortex
    // forces need enough initial momentum to shear the blob into filaments
    // before it settles, or it just sits there as a static soft circle.
    const clickSplash = (x: number, y: number) => {
      splat(x, y, (Math.random() - 0.5) * 260, (Math.random() - 0.5) * 260, 1.0, 0.006)
      splat(x + 0.02, y + 0.03, 190, 140, 0.6, 0.0032)
      splat(x - 0.025, y - 0.02, -190, -120, 0.5, 0.0026)
    }

    // Section owns the events: the canvas itself is pointer-events-none so
    // it never blocks links/CTAs, and content clicks still bubble here.
    const host: HTMLElement = canvas.closest('section') ?? canvas.parentElement!

    const toUv = (clientX: number, clientY: number): [number, number] => {
      const rect = canvas.getBoundingClientRect()
      return [(clientX - rect.left) / rect.width, 1 - (clientY - rect.top) / rect.height]
    }

    let prev: [number, number] | null = null
    const TRAIL_VELOCITY = 900
    // A fast mouse swipe can otherwise produce one huge dx/dy spike that
    // yanks the whole field — clamp so the trail stays a gentle stir.
    const TRAIL_VELOCITY_MAX = 140

    const moveSplat = (clientX: number, clientY: number) => {
      const [x, y] = toUv(clientX, clientY)
      if (prev) {
        const dx = clamp((x - prev[0]) * TRAIL_VELOCITY, -TRAIL_VELOCITY_MAX, TRAIL_VELOCITY_MAX)
        const dy = clamp((y - prev[1]) * TRAIL_VELOCITY, -TRAIL_VELOCITY_MAX, TRAIL_VELOCITY_MAX)
        if (dx !== 0 || dy !== 0) splat(x, y, dx, dy, 0.025, 0.0012)
      }
      prev = [x, y]
    }

    const onMouseMove = (e: MouseEvent) => moveSplat(e.clientX, e.clientY)
    const onMouseLeave = () => {
      prev = null
    }
    const onClick = (e: MouseEvent) => {
      const [x, y] = toUv(e.clientX, e.clientY)
      clickSplash(x, y)
    }
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0]
      if (t) moveSplat(t.clientX, t.clientY)
    }
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0]
      if (!t) return
      const [x, y] = toUv(t.clientX, t.clientY)
      clickSplash(x, y)
      prev = [x, y]
    }
    const onTouchEnd = () => {
      prev = null
    }

    host.addEventListener('mousemove', onMouseMove)
    host.addEventListener('mouseleave', onMouseLeave)
    host.addEventListener('click', onClick)
    // Touch-drag trail is desktop/tablet-with-stylus territory only — on a
    // phone, dragging a finger through the hero is the scroll gesture, not
    // an attempt to paint. A tap still drops a splash everywhere.
    if (!isMobile) {
      host.addEventListener('touchmove', onTouchMove, { passive: true })
    }
    host.addEventListener('touchstart', onTouchStart, { passive: true })
    host.addEventListener('touchend', onTouchEnd)

    let raf = 0
    let running = true
    let lastTime = performance.now()
    let frameCount = 0

    const step = (now: number) => {
      raf = requestAnimationFrame(step)
      if (!running) {
        lastTime = now
        return
      }
      // Mobile runs the actual solve at half rate — an ink field this
      // slow-moving doesn't need 60 solves/sec, and this alone roughly
      // halves the sim's GPU cost. Still scheduling every rAF tick above
      // keeps dt's clock accurate for whichever tick does run.
      if (isMobile) {
        frameCount++
        if (frameCount % MOBILE_FRAME_SKIP !== 0) return
      }
      const dt = Math.min((now - lastTime) / 1000, 1 / 30)
      lastTime = now
      gl.disable(gl.BLEND)

      // Vorticity confinement (curl + its apply pass) is skipped on mobile:
      // it's what produces the fine curling tendrils, a subtlety that isn't
      // worth two extra full-screen passes every tick on weaker GPUs. The
      // dye still moves and diffuses without it, just in softer blobs.
      if (!isMobile) {
        gl.useProgram(curlProgram.prog)
        gl.uniform2f(curlProgram.uniforms.uTexelSize, velocity.texelSizeX, velocity.texelSizeY)
        gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0))
        blit(curl)

        gl.useProgram(vorticityProgram.prog)
        gl.uniform2f(vorticityProgram.uniforms.uTexelSize, velocity.texelSizeX, velocity.texelSizeY)
        gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0))
        gl.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1))
        gl.uniform1f(vorticityProgram.uniforms.uCurlStrength, CURL_STRENGTH)
        gl.uniform1f(vorticityProgram.uniforms.uDt, dt)
        blit(velocity.write)
        velocity.swap()
      }

      gl.useProgram(divergenceProgram.prog)
      gl.uniform2f(divergenceProgram.uniforms.uTexelSize, velocity.texelSizeX, velocity.texelSizeY)
      gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0))
      blit(divergence)

      gl.useProgram(pressureProgram.prog)
      gl.uniform2f(pressureProgram.uniforms.uTexelSize, velocity.texelSizeX, velocity.texelSizeY)
      gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(1))
      for (let i = 0; i < pressureIterations; i++) {
        gl.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(0))
        blit(pressure.write)
        pressure.swap()
      }

      gl.useProgram(gradientProgram.prog)
      gl.uniform2f(gradientProgram.uniforms.uTexelSize, velocity.texelSizeX, velocity.texelSizeY)
      gl.uniform1i(gradientProgram.uniforms.uPressure, pressure.read.attach(0))
      gl.uniform1i(gradientProgram.uniforms.uVelocity, velocity.read.attach(1))
      blit(velocity.write)
      velocity.swap()

      gl.useProgram(advectionProgram.prog)
      gl.uniform2f(advectionProgram.uniforms.uTexelSize, velocity.texelSizeX, velocity.texelSizeY)
      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0))
      gl.uniform1i(advectionProgram.uniforms.uSource, velocity.read.attach(0))
      gl.uniform1f(advectionProgram.uniforms.uDt, dt)
      gl.uniform1f(advectionProgram.uniforms.uDissipation, VELOCITY_DISSIPATION)
      blit(velocity.write)
      velocity.swap()

      // Dye advection: same velocity field, same uTexelSize (deliberately
      // the velocity grid's, not the dye grid's — displacement is computed
      // in UV space and must match how the velocity field itself was
      // sampled, regardless of the dye texture's own resolution).
      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0))
      gl.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1))
      gl.uniform1f(advectionProgram.uniforms.uDt, dt)
      gl.uniform1f(advectionProgram.uniforms.uDissipation, DYE_DISSIPATION)
      blit(dye.write)
      dye.swap()

      gl.enable(gl.BLEND)
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
      gl.clearColor(0, 0, 0, 0)
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.useProgram(displayProgram.prog)
      gl.uniform1i(displayProgram.uniforms.uDye, dye.read.attach(0))
      gl.uniform3f(displayProgram.uniforms.uInk, INK[0], INK[1], INK[2])
      blit(null)
    }

    // A small teaser splash after the entry choreography, so visitors
    // discover the water is live before they ever touch it.
    const t1 = window.setTimeout(() => clickSplash(0.7, 0.8), 900)

    if (import.meta.env.DEV) {
      // Debug handle for driving/inspecting the sim from the console.
      ;(window as unknown as Record<string, unknown>).__ink = {
        splat,
        clickSplash,
        glError: () => gl.getError(),
        dyePeek: () => {
          gl.bindFramebuffer(gl.FRAMEBUFFER, dye.read.fbo)
          const px = new Float32Array(4)
          gl.readPixels(Math.floor(dyeW * 0.9), Math.floor(dyeH * 0.5), 1, 1, gl.RGBA, gl.FLOAT, px)
          return Array.from(px)
        },
        dyeMax: () => {
          gl.bindFramebuffer(gl.FRAMEBUFFER, dye.read.fbo)
          const px = new Float32Array(dyeW * dyeH * 4)
          gl.readPixels(0, 0, dyeW, dyeH, gl.RGBA, gl.FLOAT, px)
          let max = 0
          let maxI = 0
          for (let i = 0; i < px.length; i += 4) {
            if (px[i] > max) {
              max = px[i]
              maxI = i / 4
            }
          }
          return { max, x: (maxI % dyeW) / dyeW, y: Math.floor(maxI / dyeW) / dyeH }
        },
        fboStatus: () => {
          gl.bindFramebuffer(gl.FRAMEBUFFER, dye.read.fbo)
          return gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE
        },
      }
    }

    const observer = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting
    })
    observer.observe(canvas)

    raf = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(t1)
      observer.disconnect()
      host.removeEventListener('mousemove', onMouseMove)
      host.removeEventListener('mouseleave', onMouseLeave)
      host.removeEventListener('click', onClick)
      host.removeEventListener('touchmove', onTouchMove)
      host.removeEventListener('touchstart', onTouchStart)
      host.removeEventListener('touchend', onTouchEnd)
      // No loseContext() here: React StrictMode re-runs this effect, and a
      // canvas whose context was explicitly lost hands the same dead context
      // back on remount. The browser reclaims it when the canvas is GC'd.
    }
  }, [fallback])

  if (fallback) {
    return (
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute right-[-10%] top-[10%] h-[70%] w-[55%] rounded-full"
          style={{
            background: 'radial-gradient(circle at 65% 40%, rgb(59 48 38 / 0.28), rgb(59 48 38 / 0.1) 45%, transparent 70%)',
            filter: 'blur(30px)',
          }}
        />
      </div>
    )
  }

  return (
    // Background layer: sits behind the hero photo, the text, and the fixed
    // navbar (h-16 = 64px), never over any of them. The mask keeps ink from
    // ever reaching the navbar strip regardless of stacking-context edge
    // cases; the photo occludes it by simple paint order wherever it overlaps.
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      style={{
        maskImage: 'linear-gradient(to bottom, transparent 0, transparent 88px, black 152px)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0, transparent 88px, black 152px)',
      }}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  )
}
