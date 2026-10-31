'use client'

import { useEffect, useRef } from 'react'

// WebGL particle field — replaces VideoScrub from reference
// Renders ~300 depth-sorted particles + orange accent nebula
export default function ParticleBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    if (!gl) return

    let rafId
    let mouse = { x: 0.5, y: 0.5 }
    let time = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX / window.innerWidth
      mouse.y = 1 - e.clientY / window.innerHeight
    })

    const vert = `
      attribute vec2 a_pos;
      attribute float a_size;
      attribute float a_alpha;
      uniform mat4 u_proj;
      uniform float u_time;
      varying float v_alpha;
      void main() {
        vec2 p = a_pos + vec2(sin(u_time * 0.3 + a_pos.x * 5.0) * 0.008, cos(u_time * 0.2 + a_pos.y * 5.0) * 0.006);
        gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
        gl_PointSize = a_size;
        v_alpha = a_alpha;
      }
    `
    const frag = `
      precision mediump float;
      varying float v_alpha;
      uniform vec3 u_color;
      void main() {
        float d = length(gl_PointCoord - vec2(0.5));
        float a = smoothstep(0.5, 0.1, d) * v_alpha;
        gl_FragColor = vec4(u_color, a);
      }
    `

    function compile(type, src) {
      const s = gl.createShader(type)
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }

    const program = gl.createProgram()
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vert))
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, frag))
    gl.linkProgram(program)
    gl.useProgram(program)

    const N = 320
    const positions = new Float32Array(N * 2)
    const sizes = new Float32Array(N)
    const alphas = new Float32Array(N)

    for (let i = 0; i < N; i++) {
      positions[i * 2]     = Math.random()
      positions[i * 2 + 1] = Math.random()
      sizes[i]  = Math.random() * 2.5 + 0.5
      alphas[i] = Math.random() * 0.5 + 0.05
    }

    const posBuf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf)
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)
    const posLoc = gl.getAttribLocation(program, 'a_pos')
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

    const sizeBuf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuf)
    gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW)
    const sizeLoc = gl.getAttribLocation(program, 'a_size')
    gl.enableVertexAttribArray(sizeLoc)
    gl.vertexAttribPointer(sizeLoc, 1, gl.FLOAT, false, 0, 0)

    const alphaBuf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, alphaBuf)
    gl.bufferData(gl.ARRAY_BUFFER, alphas, gl.STATIC_DRAW)
    const alphaLoc = gl.getAttribLocation(program, 'a_alpha')
    gl.enableVertexAttribArray(alphaLoc)
    gl.vertexAttribPointer(alphaLoc, 1, gl.FLOAT, false, 0, 0)

    const timeLoc  = gl.getUniformLocation(program, 'u_time')
    const colorLoc = gl.getUniformLocation(program, 'u_color')

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE)

    function draw() {
      time += 0.008
      gl.clearColor(0.031, 0.031, 0.031, 1)
      gl.clear(gl.COLOR_BUFFER_BIT)

      gl.useProgram(program)
      gl.uniform1f(timeLoc, time + mouse.x * 2)

      // white dim stars
      gl.uniform3f(colorLoc, 0.9, 0.88, 0.85)
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf)
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)
      gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuf)
      gl.vertexAttribPointer(sizeLoc, 1, gl.FLOAT, false, 0, 0)
      gl.bindBuffer(gl.ARRAY_BUFFER, alphaBuf)
      gl.vertexAttribPointer(alphaLoc, 1, gl.FLOAT, false, 0, 0)
      gl.drawArrays(gl.POINTS, 0, N - 40)

      // orange accent particles
      gl.uniform3f(colorLoc, 1.0, 0.42, 0.1)
      gl.drawArrays(gl.POINTS, N - 40, 40)

      rafId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
