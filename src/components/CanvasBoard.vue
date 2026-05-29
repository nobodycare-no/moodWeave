<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import ImageCard from './ImageCard.vue'
import { useCanvas } from '../composables/useCanvas'
import { useZoom } from '../composables/useZoom'

const { cards, deselectAll, selectedCardId } = useCanvas()
const { handlePanEnd, handlePanMove, handlePanStart, handleWheel, transformStyle } = useZoom()
const isDragging = ref(false)

function startPan(event: PointerEvent) {
  if (event.button === 0) {
    deselectAll()
  }

  if (event.button !== 1 && event.button !== 2) {
    return
  }

  event.preventDefault()
  isDragging.value = true
  handlePanStart(event)

  if (event.currentTarget instanceof HTMLElement) {
    event.currentTarget.setPointerCapture(event.pointerId)
  }
}

function movePan(event: PointerEvent) {
  if (!isDragging.value) {
    return
  }

  handlePanMove(event)
}

function endPan(event: PointerEvent) {
  if (!isDragging.value) {
    return
  }

  isDragging.value = false
  handlePanEnd()

  if (event.currentTarget instanceof HTMLElement && event.currentTarget.hasPointerCapture(event.pointerId)) {
    event.currentTarget.releasePointerCapture(event.pointerId)
  }
}

function cancelPan(event: PointerEvent) {
  if (event.currentTarget instanceof HTMLElement && event.currentTarget.hasPointerCapture(event.pointerId)) {
    event.currentTarget.releasePointerCapture(event.pointerId)
  }

  isDragging.value = false
  handlePanEnd()
}

onBeforeUnmount(() => {
  handlePanEnd()
})
</script>

<template>
  <div
    class="canvas-board"
    :class="{ dragging: isDragging }"
    tabindex="0"
    @wheel="handleWheel"
    @pointerdown="startPan"
    @pointermove="movePan"
    @pointerup="endPan"
    @pointercancel="cancelPan"
    @contextmenu.prevent
  >
    <div class="canvas-viewport">
      <div class="canvas-stage" :style="transformStyle">
        <div class="stage-grid" aria-hidden="true"></div>
        <div class="stage-hint">
          <p class="stage-label">Canvas</p>
          <h2>Pan and zoom workspace</h2>
          <p class="stage-copy">
            Use the controls or hold the middle / right mouse button to move the board.
            Ctrl or Cmd plus the wheel changes the zoom level.
          </p>
        </div>
        <ImageCard
          v-for="card in cards"
          :key="card.id"
          :card="card"
          :selected="card.id === selectedCardId"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.canvas-board {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  outline: none;
  touch-action: none;
}

.canvas-board.dragging {
  cursor: grabbing;
}

.canvas-viewport {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background:
    radial-gradient(circle at top right, rgba(83, 52, 131, 0.2), transparent 34%),
    radial-gradient(circle at bottom left, rgba(233, 69, 96, 0.08), transparent 26%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.01)),
    var(--bg-primary);
}

.canvas-stage {
  position: absolute;
  inset: 0;
  min-width: 100%;
  min-height: 100%;
}

.stage-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.055) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.055) 1px, transparent 1px);
  background-position: 0 0;
  background-size: 56px 56px;
  opacity: 0.32;
  pointer-events: none;
}

.stage-hint {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 10px;
  max-width: 420px;
  padding: 28px;
}

.stage-label {
  color: var(--accent-primary);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

.stage-hint h2 {
  color: var(--text-primary);
  font-size: 28px;
  line-height: 1.1;
}

.stage-copy {
  color: var(--text-muted);
  font-size: 14px;
  line-height: 1.6;
  max-width: 36ch;
}
</style>
