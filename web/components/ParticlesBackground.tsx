"use client"
import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  opacity: number
  size: number
  char: string
  color: string
}

const PARTICLE_COUNT = 70
const REPULSE_RADIUS = 120
const SPEED = 0.4
const COLORS_DARK  = ["#00d4ff", "#33ebff", "#0891b2"]
const COLORS_LIGHT = ["#16a34a", "#15803d", "#22c55e"]

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a)
}

export default function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number
    let particles: Particle[] = []

    function resize() {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    function init() {
      if (!canvas) return
      const palette = resolvedTheme === "light" ? COLORS_LIGHT : COLORS_DARK
      particles = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: randomBetween(-SPEED, SPEED),
        vy: randomBetween(-SPEED, SPEED),
        opacity: resolvedTheme === "light" ? randomBetween(0.25, 0.65) : randomBetween(0.08, 0.45),
        size: randomBetween(9, 16),
        char: Math.random() < 0.5 ? "0" : "1",
        color: palette[Math.floor(Math.random() * palette.length)],
      }))
    }

    function draw() {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      for (const p of particles) {
        // repulse from mouse
        const dx = p.x - mx
        const dy = p.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < REPULSE_RADIUS && dist > 0) {
          const force = (REPULSE_RADIUS - dist) / REPULSE_RADIUS
          p.x += (dx / dist) * force * 2
          p.y += (dy / dist) * force * 2
        }

        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        // draw binary char
        ctx.font = `${p.size}px monospace`
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.opacity
        ctx.fillText(p.char, p.x, p.y)
        ctx.globalAlpha = 1
      }

      animId = requestAnimationFrame(draw)
    }

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 }
    }

    const resizeObserver = new ResizeObserver(() => {
      resize()
      init()
    })

    resize()
    init()
    draw()
    canvas.addEventListener("mousemove", onMouseMove)
    canvas.addEventListener("mouseleave", onMouseLeave)
    resizeObserver.observe(canvas)

    return () => {
      cancelAnimationFrame(animId)
      canvas.removeEventListener("mousemove", onMouseMove)
      canvas.removeEventListener("mouseleave", onMouseLeave)
      resizeObserver.disconnect()
    }
  }, [resolvedTheme])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  )
}
