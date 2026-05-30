<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import ConnectionLayer from './ConnectionLayer.vue'
import ImageCard from './ImageCard.vue'
import EditModal from './EditModal.vue'
import TextCard from './TextCard.vue'
import { useCanvas } from '../composables/useCanvas'
import { useZoom } from '../composables/useZoom'

const { cards, connections, connectionSourceId, deselectAll, selectedCardId } = useCanvas()
const { handlePanEnd, handlePanMove, handlePanStart, handleWheel, transformStyle } = useZoom()
const isDragging = ref(false)
const imageCards = computed(() => cards.value.filter((card) => card.type === 'image'))
const textCards = computed(() => cards.value.filter((card) => card.type === 'text'))

function startPan(event: PointerEvent) {
  if (event.button !== 0 && event.button !== 1 && event.button !== 2) {
    return
  }

  event.preventDefault()

  if (event.button === 0) {
    deselectAll()
  }

  isDragging.value = true
  handlePanStart(event)

  if (event.currentTarget instanceof HTMLElement) {
    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {
      return
    }
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

  if (event.currentTarget instanceof HTMLElement) {
    try {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
    } catch {
      return
    }
  }
}

function cancelPan(event: PointerEvent) {
  if (event.currentTarget instanceof HTMLElement) {
    try {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
    } catch {
      return
    }
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
        <div v-if="cards.length === 0" class="stage-hint">
          <p class="stage-label">Canvas</p>
          <h2>Mood board canvas</h2>
        </div>
        <ConnectionLayer :cards="cards" :connections="connections" />
        <ImageCard
          v-for="card in imageCards"
          :key="card.id"
          :card="card"
          :connection-source="card.id === connectionSourceId"
          :selected="card.id === selectedCardId"
        />
        <TextCard
          v-for="card in textCards"
          :key="card.id"
          :card="card"
          :connection-source="card.id === connectionSourceId"
          :selected="card.id === selectedCardId"
        />
      </div>
      <EditModal />
    </div>
  </div>
</template>

<style scoped>
.canvas-board {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  cursor: grab;
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

</style>
