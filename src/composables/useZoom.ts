import { computed, ref } from 'vue'

const MIN_SCALE = 0.25
const MAX_SCALE = 2.5
const SCALE_STEP = 0.12
const PAN_SENSITIVITY = 1

const scale = ref(1)
const offsetX = ref(0)
const offsetY = ref(0)

let isPanning = false
let startClientX = 0
let startClientY = 0
let startOffsetX = 0
let startOffsetY = 0

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function getBoardPoint(clientX: number, clientY: number, bounds?: DOMRect) {
  if (!bounds) {
    return { x: clientX, y: clientY }
  }

  return {
    x: (clientX - bounds.left - offsetX.value) / scale.value,
    y: (clientY - bounds.top - offsetY.value) / scale.value,
  }
}

function zoomBy(delta: number, pivot?: { x: number; y: number }) {
  const nextScale = clamp(scale.value + delta, MIN_SCALE, MAX_SCALE)
  if (nextScale === scale.value) {
    return
  }

  if (pivot) {
    const ratio = nextScale / scale.value
    offsetX.value = pivot.x - (pivot.x - offsetX.value) * ratio
    offsetY.value = pivot.y - (pivot.y - offsetY.value) * ratio
  }

  scale.value = nextScale
}

function zoomIn(pivot?: { x: number; y: number }) {
  zoomBy(SCALE_STEP, pivot)
}

function zoomOut(pivot?: { x: number; y: number }) {
  zoomBy(-SCALE_STEP, pivot)
}

function resetZoom() {
  scale.value = 1
  offsetX.value = 0
  offsetY.value = 0
}

function handleWheel(event: WheelEvent) {
  event.preventDefault()

  const direction = Math.sign(event.deltaY)
  const delta = direction > 0 ? -SCALE_STEP : SCALE_STEP
  zoomBy(delta, { x: event.clientX, y: event.clientY })
}

function handlePanStart(event: PointerEvent) {
  isPanning = true
  startClientX = event.clientX
  startClientY = event.clientY
  startOffsetX = offsetX.value
  startOffsetY = offsetY.value
}

function handlePanMove(event: PointerEvent) {
  if (!isPanning) {
    return
  }

  offsetX.value = startOffsetX + (event.clientX - startClientX) * PAN_SENSITIVITY
  offsetY.value = startOffsetY + (event.clientY - startClientY) * PAN_SENSITIVITY
}

function handlePanEnd() {
  isPanning = false
}

const transformStyle = computed(() => ({
  transform: `translate(${offsetX.value}px, ${offsetY.value}px) scale(${scale.value})`,
  transformOrigin: '0 0',
}))

export function useZoom() {
  return {
    scale,
    offsetX,
    offsetY,
    transformStyle,
    getBoardPoint,
    zoomIn,
    zoomOut,
    resetZoom,
    handleWheel,
    handlePanStart,
    handlePanMove,
    handlePanEnd,
  }
}
