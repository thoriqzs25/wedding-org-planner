const COLORS = ["#EB7B26", "#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"]

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  rotation: number
  rotationSpeed: number
  opacity: number
}

export function fireConfetti(originX = 0.5, originY = 0.5) {
  const canvas = document.createElement("canvas")
  canvas.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999"
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  document.body.appendChild(canvas)

  const ctx = canvas.getContext("2d")!
  const particles: Particle[] = []
  const particleCount = 120

  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2
    const velocity = 4 + Math.random() * 8
    particles.push({
      x: originX * canvas.width,
      y: originY * canvas.height,
      vx: Math.cos(angle) * velocity * (0.5 + Math.random() * 0.5),
      vy: Math.sin(angle) * velocity * (0.5 + Math.random() * 0.5) - 6,
      size: 6 + Math.random() * 8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      opacity: 1,
    })
  }

  let frame = 0
  const maxFrames = 180

  function animate() {
    frame++
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (const p of particles) {
      p.x += p.vx
      p.y += p.vy
      p.vy += 0.15
      p.rotation += p.rotationSpeed
      p.opacity = Math.max(0, 1 - frame / maxFrames)

      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate((p.rotation * Math.PI) / 180)
      ctx.globalAlpha = p.opacity
      ctx.fillStyle = p.color
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
      ctx.restore()
    }

    if (frame < maxFrames) {
      requestAnimationFrame(animate)
    } else {
      canvas.remove()
    }
  }

  animate()
}
