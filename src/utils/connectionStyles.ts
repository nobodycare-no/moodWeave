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
  labelX: number
  labelY: number
  path: string
}

const CONNECTION_THEMES: Record<ConnectionDirection, Omit<ConnectionTheme, 'direction'>> = {
  'image->image': {
    arrowFill: 'rgba(233, 69, 96, 0.96)',
    labelBorder: 'rgba(233, 69, 96, 0.42)',
    labelText: 'rgba(255, 255, 255, 0.96)',
    lineEnd: 'rgba(233, 69, 96, 0.9)',
    lineStart: 'rgba(255, 207, 112, 0.95)',
    shadow: 'rgba(233, 69, 96, 0.3)',
    startFill: 'rgba(255, 207, 112, 0.95)',
  },
  'image->text': {
    arrowFill: 'rgba(233, 69, 96, 0.96)',
    labelBorder: 'rgba(255, 207, 112, 0.48)',
    labelText: 'rgba(255, 255, 255, 0.96)',
    lineEnd: 'rgba(233, 69, 96, 0.94)',
    lineStart: 'rgba(255, 207, 112, 0.96)',
    shadow: 'rgba(255, 207, 112, 0.28)',
    startFill: 'rgba(255, 207, 112, 0.96)',
  },
  'text->image': {
    arrowFill: 'rgba(118, 139, 255, 0.96)',
    labelBorder: 'rgba(118, 139, 255, 0.5)',
    labelText: 'rgba(255, 255, 255, 0.96)',
    lineEnd: 'rgba(118, 139, 255, 0.94)',
    lineStart: 'rgba(87, 214, 255, 0.96)',
    shadow: 'rgba(87, 214, 255, 0.26)',
    startFill: 'rgba(87, 214, 255, 0.96)',
  },
  'text->text': {
    arrowFill: 'rgba(118, 139, 255, 0.96)',
    labelBorder: 'rgba(118, 139, 255, 0.42)',
    labelText: 'rgba(255, 255, 255, 0.96)',
    lineEnd: 'rgba(118, 139, 255, 0.9)',
    lineStart: 'rgba(87, 214, 255, 0.95)',
    shadow: 'rgba(118, 139, 255, 0.28)',
    startFill: 'rgba(87, 214, 255, 0.95)',
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

export function buildConnectionGeometry(from: ConnectionPoint, to: ConnectionPoint): ConnectionGeometry {
  const deltaX = to.x - from.x
  const deltaY = to.y - from.y
  const controlDirection = deltaX >= 0 ? 1 : -1
  const controlOffset = Math.max(100, Math.abs(deltaX) * 0.44)
  const controlBend = clamp(deltaY * 0.18, -72, 72)
  const path = `M ${from.x} ${from.y} C ${from.x + controlDirection * controlOffset} ${from.y + controlBend}, ${to.x - controlDirection * controlOffset} ${to.y - controlBend}, ${to.x} ${to.y}`

  return {
    controlBend,
    controlDirection,
    controlOffset,
    labelX: (from.x + to.x) / 2,
    labelY: (from.y + to.y) / 2,
    path,
  }
}
