<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Card } from '../types'
import { useCanvas } from '../composables/useCanvas'
import { useZoom } from '../composables/useZoom'

const props = defineProps<{
  card: Card
  selected: boolean
}>()

const { selectCard, updateCardPosition } = useCanvas()
const { scale } = useZoom()
const isDragging = ref(false)
const dragStart = ref({ clientX: 0, clientY: 0, x: 0, y: 0 })

const cardStyle = computed(() => ({
  width: `${props.card.width}px`,
  height: `${props.card.height}px`,
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
</script>

<template>
  <article
    class="image-card"
    :class="{ selected, dragging: isDragging }"
    :style="cardStyle"
    @pointerdown="startDrag"
    @pointermove="moveDrag"
    @pointerup="endDrag"
    @pointercancel="endDrag"
    @click.stop
  >
    <img class="image-preview" :src="card.content" alt="" draggable="false" />
    <div class="image-overlay">
      <span>Image</span>
    </div>
  </article>
</template>

<style scoped>
.image-card {
  position: absolute;
  top: 0;
  left: 0;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  cursor: grab;
  user-select: none;
  touch-action: none;
}

.image-card.selected {
  border-color: rgba(233, 69, 96, 0.76);
  box-shadow: 0 0 0 3px rgba(233, 69, 96, 0.18), var(--shadow-lg);
}

.image-card.dragging {
  cursor: grabbing;
}

.image-preview {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

.image-overlay {
  position: absolute;
  right: 8px;
  bottom: 8px;
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 8px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.42);
  color: rgba(255, 255, 255, 0.82);
  font-size: 11px;
  font-weight: 700;
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.image-card:hover .image-overlay,
.image-card.selected .image-overlay {
  opacity: 1;
}
</style>
