<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Card } from '../types'
import { useCanvas } from '../composables/useCanvas'
import { useZoom } from '../composables/useZoom'

const props = defineProps<{
  connectionSource: boolean
  card: Card
  selected: boolean
}>()

const { beginTextEdit, selectCard, updateCardPosition } = useCanvas()
const { scale } = useZoom()
const isDragging = ref(false)
const dragStart = ref({ clientX: 0, clientY: 0, x: 0, y: 0 })

const cardStyle = computed(() => ({
  width: `${props.card.width}px`,
  minHeight: `${props.card.height}px`,
  transform: `translate(${props.card.x}px, ${props.card.y}px)`,
  zIndex: props.card.zIndex,
}))

function startDrag(event: PointerEvent) {
  if (event.button !== 0) {
    return
  }

  event.preventDefault()
  event.stopPropagation()
  selectCard(props.card.id)

  isDragging.value = true
  dragStart.value = {
    clientX: event.clientX,
    clientY: event.clientY,
    x: props.card.x,
    y: props.card.y,
  }

  if (event.currentTarget instanceof HTMLElement) {
    event.currentTarget.setPointerCapture(event.pointerId)
  }
}

function moveDrag(event: PointerEvent) {
  if (!isDragging.value) {
    return
  }

  const nextX = dragStart.value.x + (event.clientX - dragStart.value.clientX) / scale.value
  const nextY = dragStart.value.y + (event.clientY - dragStart.value.clientY) / scale.value
  updateCardPosition(props.card.id, nextX, nextY)
}

function endDrag(event: PointerEvent) {
  if (!isDragging.value) {
    return
  }

  isDragging.value = false

  if (event.currentTarget instanceof HTMLElement && event.currentTarget.hasPointerCapture(event.pointerId)) {
    event.currentTarget.releasePointerCapture(event.pointerId)
  }
}

function editCard() {
  beginTextEdit(props.card.id)
}
</script>

<template>
  <article
    class="text-card"
    :class="{ selected, dragging: isDragging, 'connection-source': connectionSource }"
    :style="cardStyle"
    @pointerdown="startDrag"
    @pointermove="moveDrag"
    @pointerup="endDrag"
    @pointercancel="endDrag"
    @dblclick.stop="editCard"
    @click.stop
  >
    <p class="text-content">{{ card.content }}</p>
    <span class="text-label">Text</span>
  </article>
</template>

<style scoped>
.text-card {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04)),
    rgba(22, 33, 62, 0.84);
  box-shadow: var(--shadow-md);
  color: var(--text-primary);
  cursor: grab;
  user-select: none;
  touch-action: none;
}

.text-card.selected {
  border-color: rgba(233, 69, 96, 0.76);
  box-shadow: 0 0 0 3px rgba(233, 69, 96, 0.18), var(--shadow-lg);
}

.text-card.connection-source {
  border-color: rgba(255, 207, 112, 0.9);
  box-shadow: 0 0 0 3px rgba(255, 207, 112, 0.2), var(--shadow-lg);
}

.text-card.dragging {
  cursor: grabbing;
}

.text-content {
  flex: 1;
  color: var(--text-primary);
  font-size: 18px;
  line-height: 1.45;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.text-label {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 8px;
  border-radius: 8px;
  background: rgba(233, 69, 96, 0.14);
  color: rgba(255, 255, 255, 0.82);
  font-size: 11px;
  font-weight: 700;
}
</style>
