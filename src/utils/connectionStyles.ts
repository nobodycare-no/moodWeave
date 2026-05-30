import type { Card } from '../types'

export type ConnectionDirection = `${Card['type']}->${Card['type']}`

export interface ConnectionPoint {
  x: number
  y: number
}

export interface ConnectionTheme {
  direction: ConnectionDirection
  arrowFill: string
  labelBorder: string
  labelText: string
  lineEnd: string
  lineStart: string
  shadow: string
  startFill: string
}

export interface ConnectionGeometry {
  controlBend: number
  controlDirection: number
  controlOffset: number
  endAngle: number
  labelX: number
  labelY: number
  path: string
}

export interface ConnectionAnchors {
  from: ConnectionPoint
  to: ConnectionPoint
}

const CONNECTION_THEMES: Record<ConnectionDirection, Omit<ConnectionTheme, 'direction'>> = {
  'image->image': {
    arrowFill: 'rgba(233, 69, 96, 0.88)',
    labelBorder: 'rgba(233, 69, 96, 0.34)',
    labelText: 'rgba(255, 255, 255, 0.96)',
    lineEnd: 'rgba(233, 69, 96, 0.82)',
    lineStart: 'rgba(255, 207, 112, 0.82)',
    shadow: 'rgba(10, 14, 28, 0.34)',
    startFill: 'rgba(255, 207, 112, 0.88)',
  },
  'image->text': {
    arrowFill: 'rgba(233, 69, 96, 0.9)',
    labelBorder: 'rgba(255, 207, 112, 0.36)',
    labelText: 'rgba(255, 255, 255, 0.96)',
    lineEnd: 'rgba(233, 69, 96, 0.86)',
    lineStart: 'rgba(255, 207, 112, 0.84)',
    shadow: 'rgba(10, 14, 28, 0.34)',
    startFill: 'rgba(255, 207, 112, 0.9)',
  },
  'text->image': {
    arrowFill: 'rgba(118, 139, 255, 0.9)',
    labelBorder: 'rgba(118, 139, 255, 0.38)',
    labelText: 'rgba(255, 255, 255, 0.96)',
    lineEnd: 'rgba(118, 139, 255, 0.86)',
    lineStart: 'rgba(87, 214, 255, 0.84)',
    shadow: 'rgba(10, 14, 28, 0.34)',
    startFill: 'rgba(87, 214, 255, 0.9)',
  },
  'text->text': {
    arrowFill: 'rgba(118, 139, 255, 0.88)',
    labelBorder: 'rgba(118, 139, 255, 0.34)',
    labelText: 'rgba(255, 255, 255, 0.96)',
    lineEnd: 'rgba(118, 139, 255, 0.82)',
    lineStart: 'rgba(87, 214, 255, 0.82)',
    shadow: 'rgba(10, 14, 28, 0.34)',
    startFill: 'rgba(87, 214, 255, 0.88)',
  },
}

export function getConnectionDirection(
  fromType: Card['type'],
  toType: Card['type'],
): ConnectionDirection {
  return `${fromType}->${toType}` as ConnectionDirection
}

export function getConnectionTheme(fromType: Card['type'], toType: Card['type']): ConnectionTheme {
  const direction = getConnectionDirection(fromType, toType)

  return {
    direction,
    ...CONNECTION_THEMES[direction],
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function getCardCenter(card: Card): ConnectionPoint {
  return {
    x: card.x + card.width / 2,
    y: card.y + card.height / 2,
  }
}

function getEdgePoint(card: Card, vector: ConnectionPoint): ConnectionPoint {
  const center = getCardCenter(card)
  const halfWidth = card.width / 2
  const halfHeight = card.height / 2
  const scaleX = vector.x === 0 ? Number.POSITIVE_INFINITY : halfWidth / Math.abs(vector.x)
  const scaleY = vector.y === 0 ? Number.POSITIVE_INFINITY : halfHeight / Math.abs(vector.y)
  const scale = Math.min(scaleX, scaleY)

  return {
    x: center.x + vector.x * scale,
    y: center.y + vector.y * scale,
  }
}

export function getConnectionAnchors(fromCard: Card, toCard: Card, gap = 10): ConnectionAnchors {
  const fromCenter = getCardCenter(fromCard)
  const toCenter = getCardCenter(toCard)
  const deltaX = toCenter.x - fromCenter.x
  const deltaY = toCenter.y - fromCenter.y
  const distance = Math.hypot(deltaX, deltaY) || 1
  const unit = {
    x: deltaX / distance,
    y: deltaY / distance,
  }
  const fromEdge = getEdgePoint(fromCard, { x: deltaX, y: deltaY })
  const toEdge = getEdgePoint(toCard, { x: -deltaX, y: -deltaY })

  return {
    from: {
      x: fromEdge.x + unit.x * gap,
      y: fromEdge.y + unit.y * gap,
    },
    to: {
      x: toEdge.x - unit.x * gap,
      y: toEdge.y - unit.y * gap,
    },
  }
}

export function buildConnectionGeometry(from: ConnectionPoint, to: ConnectionPoint): ConnectionGeometry {
  const deltaX = to.x - from.x
  const deltaY = to.y - from.y
  const controlDirection = deltaX >= 0 ? 1 : -1
  const controlOffset = clamp(Math.abs(deltaX) * 0.34, 56, 160)
  const controlBend = clamp(deltaY * 0.12, -48, 48)
  const path = `M ${from.x} ${from.y} C ${from.x + controlDirection * controlOffset} ${from.y + controlBend}, ${to.x - controlDirection * controlOffset} ${to.y - controlBend}, ${to.x} ${to.y}`

  return {
    controlBend,
    controlDirection,
    controlOffset,
    endAngle: Math.atan2(controlBend, controlDirection * controlOffset),
    labelX: (from.x + to.x) / 2,
    labelY: (from.y + to.y) / 2,
    path,
  }
}
