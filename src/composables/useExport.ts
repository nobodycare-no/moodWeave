import { computed, ref } from 'vue'
import { useBoard } from './useBoard'
import { resolveImageSource } from './useImageStore'
import {
  buildConnectionGeometry,
  getConnectionAnchors,
  getConnectionTheme,
  type ConnectionTheme,
} from '../utils/connectionStyles'

const EXPORT_PADDING = 80
const EMPTY_WIDTH = 1200
const EMPTY_HEIGHT = 800
const GRID_SIZE = 56

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const nextRadius = Math.min(radius, width / 2, height / 2)
  context.beginPath()
  context.moveTo(x + nextRadius, y)
  context.lineTo(x + width - nextRadius, y)
  context.quadraticCurveTo(x + width, y, x + width, y + nextRadius)
  context.lineTo(x + width, y + height - nextRadius)
  context.quadraticCurveTo(x + width, y + height, x + width - nextRadius, y + height)
  context.lineTo(x + nextRadius, y + height)
  context.quadraticCurveTo(x, y + height, x, y + height - nextRadius)
  context.lineTo(x, y + nextRadius)
  context.quadraticCurveTo(x, y, x + nextRadius, y)
  context.closePath()
}

function drawGrid(context: CanvasRenderingContext2D, width: number, height: number) {
  context.save()
  context.strokeStyle = 'rgba(255, 255, 255, 0.055)'
  context.lineWidth = 1

  for (let x = 0; x <= width; x += GRID_SIZE) {
    context.beginPath()
    context.moveTo(x, 0)
    context.lineTo(x, height)
    context.stroke()
  }

  for (let y = 0; y <= height; y += GRID_SIZE) {
    context.beginPath()
    context.moveTo(0, y)
    context.lineTo(width, y)
    context.stroke()
  }

  context.restore()
}

function drawConnection(
  context: CanvasRenderingContext2D,
  from: { x: number; y: number },
  to: { x: number; y: number },
  theme: ConnectionTheme,
) {
  const geometry = buildConnectionGeometry(from, to)
  const gradient = context.createLinearGradient(from.x, from.y, to.x, to.y)
  gradient.addColorStop(0, theme.lineStart)
  gradient.addColorStop(1, theme.lineEnd)

  context.save()
  context.lineCap = 'round'

  context.beginPath()
  context.moveTo(from.x, from.y)
  context.bezierCurveTo(
    from.x + geometry.controlDirection * geometry.controlOffset,
    from.y + geometry.controlBend,
    to.x - geometry.controlDirection * geometry.controlOffset,
    to.y - geometry.controlBend,
    to.x,
    to.y,
  )
  context.strokeStyle = theme.shadow
  context.lineWidth = 4.75
  context.stroke()

  context.beginPath()
  context.moveTo(from.x, from.y)
  context.bezierCurveTo(
    from.x + geometry.controlDirection * geometry.controlOffset,
    from.y + geometry.controlBend,
    to.x - geometry.controlDirection * geometry.controlOffset,
    to.y - geometry.controlBend,
    to.x,
    to.y,
  )
  context.strokeStyle = gradient
  context.lineWidth = 2.25
  context.stroke()

  context.beginPath()
  context.arc(from.x, from.y, 3.5, 0, Math.PI * 2)
  context.fillStyle = '#ffffff'
  context.fill()
  context.strokeStyle = theme.startFill
  context.lineWidth = 1.6
  context.stroke()

  const angle = geometry.endAngle
  const arrowLength = 13
  const arrowWidth = 6.5
  context.beginPath()
  context.moveTo(to.x, to.y)
  context.lineTo(
    to.x - arrowLength * Math.cos(angle) + arrowWidth * Math.sin(angle),
    to.y - arrowLength * Math.sin(angle) - arrowWidth * Math.cos(angle),
  )
  context.lineTo(
    to.x - arrowLength * Math.cos(angle) - arrowWidth * Math.sin(angle),
    to.y - arrowLength * Math.sin(angle) + arrowWidth * Math.cos(angle),
  )
  context.closePath()
  context.fillStyle = theme.arrowFill
  context.fill()
  context.strokeStyle = 'rgba(255, 255, 255, 0.24)'
  context.lineWidth = 0.8
  context.stroke()
  context.restore()
}

function drawConnectionLabel(
  context: CanvasRenderingContext2D,
  label: string,
  x: number,
  y: number,
  theme: ConnectionTheme,
) {
  const trimmed = label.trim()
  if (!trimmed) {
    return
  }

  context.save()
  context.font = '700 13px Inter, Arial, sans-serif'
  context.textBaseline = 'top'

  const maxWidth = 180
  const lines = wrapText(context, trimmed, maxWidth - 20).slice(0, 3)
  const measuredWidth = Math.min(
    maxWidth,
    Math.max(...lines.map((line) => context.measureText(line).width), 42) + 20,
  )
  const labelHeight = lines.length * 18 + 10
  const labelX = x - measuredWidth / 2
  const labelY = y - labelHeight / 2

  roundedRect(context, labelX, labelY, measuredWidth, labelHeight, 8)
  context.fillStyle = 'rgba(22, 33, 62, 0.94)'
  context.fill()
  context.strokeStyle = theme.labelBorder
  context.lineWidth = 1
  context.stroke()
  context.fillStyle = theme.labelText
  lines.forEach((line, index) => {
    context.fillText(line, labelX + 10, labelY + 5 + index * 18)
  })
  context.restore()
}

function wrapText(context: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const paragraphs = text.split('\n')
  const lines: string[] = []

  function splitLongToken(token: string): string {
    let segment = ''

    for (const char of Array.from(token)) {
      const nextSegment = `${segment}${char}`
      if (segment && context.measureText(nextSegment).width > maxWidth) {
        lines.push(segment)
        segment = char
        continue
      }

      segment = nextSegment
    }

    return segment
  }

  for (const paragraph of paragraphs) {
    const words = paragraph.match(/\S+/g) ?? []

    if (words.length === 0) {
      lines.push('')
      continue
    }

    let currentLine = ''

    for (const word of words) {
      if (!currentLine) {
        currentLine =
          context.measureText(word).width <= maxWidth ? word : splitLongToken(word)
        continue
      }

      const testLine = currentLine ? `${currentLine} ${word}` : word
      if (context.measureText(testLine).width <= maxWidth) {
        currentLine = testLine
        continue
      }

      lines.push(currentLine)

      currentLine =
        context.measureText(word).width <= maxWidth ? word : splitLongToken(word)
    }

    if (currentLine) {
      lines.push(currentLine)
    }
  }

  return lines
}

function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()

    if (!source.startsWith('data:')) {
      image.crossOrigin = 'anonymous'
    }

    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', () => reject(new Error('Image failed to load')))
    image.src = source
  })
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas export failed'))
          return
        }

        resolve(blob)
      }, 'image/png')
    } catch (error) {
      reject(error instanceof Error ? error : new Error('Canvas export failed'))
    }
  })
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function slugify(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  return slug || 'moodweave-board'
}

export function useExport() {
  const { currentBoard } = useBoard()
  const isExporting = ref(false)
  const exportError = ref('')

  const canExport = computed(() => Boolean(currentBoard.value))

  async function exportPng() {
    if (!currentBoard.value || isExporting.value) {
      return
    }

    isExporting.value = true
    exportError.value = ''

    try {
      const cards = currentBoard.value.cards
      const bounds = cards.length
        ? cards.reduce(
            (acc, card) => ({
              minX: Math.min(acc.minX, card.x),
              minY: Math.min(acc.minY, card.y),
              maxX: Math.max(acc.maxX, card.x + card.width),
              maxY: Math.max(acc.maxY, card.y + card.height),
            }),
            {
              minX: cards[0]?.x ?? 0,
              minY: cards[0]?.y ?? 0,
              maxX: (cards[0]?.x ?? 0) + (cards[0]?.width ?? EMPTY_WIDTH),
              maxY: (cards[0]?.y ?? 0) + (cards[0]?.height ?? EMPTY_HEIGHT),
            },
          )
        : { minX: 0, minY: 0, maxX: EMPTY_WIDTH, maxY: EMPTY_HEIGHT }

      const width = Math.ceil(Math.max(EMPTY_WIDTH, bounds.maxX - bounds.minX + EXPORT_PADDING * 2))
      const height = Math.ceil(Math.max(EMPTY_HEIGHT, bounds.maxY - bounds.minY + EXPORT_PADDING * 2))
      const originX = bounds.minX - EXPORT_PADDING
      const originY = bounds.minY - EXPORT_PADDING
      const canvas = document.createElement('canvas')
      const ratio = window.devicePixelRatio || 1
      canvas.width = width * ratio
      canvas.height = height * ratio
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      const context = canvas.getContext('2d')
      if (!context) {
        throw new Error('Canvas is not available')
      }

      context.scale(ratio, ratio)
      context.fillStyle = '#1a1a2e'
      context.fillRect(0, 0, width, height)
      drawGrid(context, width, height)

      const cardMap = new Map(cards.map((card) => [card.id, card]))
      for (const connection of currentBoard.value.connections) {
        const fromCard = cardMap.get(connection.fromCardId)
        const toCard = cardMap.get(connection.toCardId)
        if (!fromCard || !toCard) {
          continue
        }

        const exportFromCard = { ...fromCard, x: fromCard.x - originX, y: fromCard.y - originY }
        const exportToCard = { ...toCard, x: toCard.x - originX, y: toCard.y - originY }
        const { from, to } = getConnectionAnchors(exportFromCard, exportToCard)

        const theme = getConnectionTheme(fromCard.type, toCard.type)
        drawConnection(context, from, to, theme)
        drawConnectionLabel(
          context,
          connection.label,
          (from.x + to.x) / 2,
          (from.y + to.y) / 2,
          theme,
        )
      }

      for (const card of [...cards].sort((a, b) => a.zIndex - b.zIndex)) {
        const x = card.x - originX
        const y = card.y - originY

        if (card.type === 'image') {
          roundedRect(context, x, y, card.width, card.height, 8)
          context.save()
          context.clip()
          context.fillStyle = 'rgba(255, 255, 255, 0.06)'
          context.fillRect(x, y, card.width, card.height)

          try {
            const imageSource = await resolveImageSource(card.content)
            const image = await loadImage(imageSource)
            const scale = Math.max(card.width / image.width, card.height / image.height)
            const drawWidth = image.width * scale
            const drawHeight = image.height * scale
            context.drawImage(
              image,
              x + (card.width - drawWidth) / 2,
              y + (card.height - drawHeight) / 2,
              drawWidth,
              drawHeight,
            )
          } catch {
            context.fillStyle = 'rgba(255, 255, 255, 0.14)'
            context.fillRect(x, y, card.width, card.height)
            context.fillStyle = 'rgba(255, 255, 255, 0.72)'
            context.font = '700 14px Inter, Arial, sans-serif'
            context.fillText('Image unavailable', x + 18, y + 32)
          }

          context.restore()
          context.strokeStyle = 'rgba(255, 255, 255, 0.18)'
          context.lineWidth = 1
          roundedRect(context, x, y, card.width, card.height, 8)
          context.stroke()
          continue
        }

        roundedRect(context, x, y, card.width, card.height, 8)
        context.fillStyle = 'rgba(22, 33, 62, 0.92)'
        context.fill()
        context.strokeStyle = 'rgba(255, 255, 255, 0.18)'
        context.stroke()

        context.fillStyle = '#ffffff'
        context.font = '18px Inter, Arial, sans-serif'
        context.textBaseline = 'top'
        const lines = wrapText(context, card.content, card.width - 32)
        lines.slice(0, 8).forEach((line, index) => {
          context.fillText(line, x + 16, y + 16 + index * 26)
        })
      }

      const blob = await canvasToBlob(canvas)
      downloadBlob(blob, `${slugify(currentBoard.value.name)}.png`)
    } catch {
      exportError.value = 'Export failed. Remote images may block PNG export.'
    } finally {
      isExporting.value = false
    }
  }

  return {
    canExport,
    exportError,
    exportPng,
    isExporting,
  }
}
