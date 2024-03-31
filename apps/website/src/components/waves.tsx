import debounce from 'lodash.debounce'
import { useTheme } from 'next-themes'
import { type ElementRef, useEffect, useRef } from 'react'

class Dot {
  x: number
  y: number
  initialY: number
  size: number
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  theme: string

  constructor({
    x,
    y,
    size,
    canvas,
    theme,
  }: { x: number; y: number; size: number; canvas: HTMLCanvasElement; theme: string }) {
    this.x = x
    this.y = y
    this.initialY = y
    this.size = size
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')!
    this.theme = theme
  }

  draw() {
    const fillStyle = this.theme === 'dark' ? 'rgba(255, 255, 255, .3)' : 'rgba(0, 0, 0, .2)'

    this.ctx.fillStyle = fillStyle
    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    this.ctx.fill()
  }

  update() {
    this.draw()
  }
}

class WavesClass {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  dots: Dot[] = []
  gap: number
  theme: string

  constructor({ canvas, theme }: { canvas: HTMLCanvasElement; theme: string }) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')!
    this.gap = 15
    this.theme = theme
    this.setDims()
    this.createDots()
    this.bindEvents()
  }

  createDots() {
    const numberOfDotsX = Math.ceil(this.canvas.width / this.gap)
    const numberOfDotsY = Math.ceil(this.canvas.height / this.gap)

    const minSize = 1
    const maxSize = 3

    for (let y = 0; y < numberOfDotsY; y++) {
      for (let x = 0; x < numberOfDotsX; x++) {
        const relativeY = y / (numberOfDotsY - 1)
        const dotSize = minSize + (maxSize - minSize) * relativeY

        this.dots.push(
          new Dot({
            x: x * this.gap,
            y: y * this.gap + dotSize,
            size: dotSize,
            canvas: this.canvas,
            theme: this.theme,
          }),
        )
      }
    }
  }

  bindEvents() {
    const setDimsDebounced = debounce(this.setDims.bind(this), 100)
    const createDotsDebounced = debounce(() => {
      this.dots = []
      this.createDots()
    }, 100)

    const onRezie = () => {
      setDimsDebounced()
      createDotsDebounced()
    }

    window.addEventListener('resize', onRezie)
  }

  setDims() {
    const bounds = this.canvas.getBoundingClientRect()
    this.canvas.width = bounds.width
    this.canvas.height = bounds.height
  }

  draw() {
    const speed = 0.0005
    const amplitude = 25

    this.dots.forEach((dot) => {
      dot.update()
      const angle = dot.x * 0.01 + dot.initialY * 0.01 + Date.now() * speed
      dot.y = dot.initialY + Math.sin(angle) * amplitude
    })
  }

  init() {
    this.animate()
  }

  animate() {
    this.ctx.clearRect(0, 0, screen.width, screen.height)

    this.draw()
    requestAnimationFrame(() => this.animate())
  }
}

export const Waves = () => {
  const ref = useRef<ElementRef<'canvas'>>(null)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    if (ref.current) {
      const waves = new WavesClass({ canvas: ref.current, theme: resolvedTheme ?? 'light' })
      waves.init()
    }
  }, [resolvedTheme])

  return (
    <div className="w-full h-full relative">
      <div className="z-10 absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      <canvas ref={ref} className="w-full h-full absolute inset-0" />
    </div>
  )
}
