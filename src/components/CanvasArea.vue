<script setup lang="ts">
import { computed } from 'vue'
import AddImageBtn from './AddImageBtn.vue'
import CanvasBoard from './CanvasBoard.vue'
import { useBoard } from '../composables/useBoard'
import { useCanvas } from '../composables/useCanvas'
import { useZoom } from '../composables/useZoom'

const { currentBoard } = useBoard()
const { cards } = useCanvas()
const { resetZoom, scale, zoomIn, zoomOut } = useZoom()

const zoomPercent = computed(() => `${Math.round(scale.value * 100)}%`)
</script>

<template>
  <section class="canvas-area" aria-label="Mood board canvas">
    <header class="canvas-topbar">
      <div class="board-summary">
        <span class="board-dot" aria-hidden="true"></span>
        <div>
          <p class="board-label">Active board</p>
          <h1>{{ currentBoard?.name ?? 'Mood Board' }}</h1>
          <span class="card-count">{{ cards.length }} cards</span>
        </div>
      </div>

      <div class="topbar-actions">
        <AddImageBtn />

        <div class="zoom-controls" aria-label="Canvas zoom controls">
          <button class="zoom-button" type="button" aria-label="Zoom out" title="Zoom out" @click="zoomOut()">
            -
          </button>
          <button class="zoom-readout" type="button" title="Reset zoom" @click="resetZoom">
            {{ zoomPercent }}
          </button>
          <button class="zoom-button" type="button" aria-label="Zoom in" title="Zoom in" @click="zoomIn()">
            +
          </button>
        </div>
      </div>
    </header>

    <div class="board-shell">
      <CanvasBoard />
    </div>
  </section>
</template>

<style scoped>
.canvas-area {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 0;
}

.canvas-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 56px;
  padding: 10px 16px;
  border-bottom: 1px solid var(--border-color);
  background: rgba(15, 52, 96, 0.18);
  backdrop-filter: blur(var(--glass-blur));
}

.board-summary {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.board-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--accent-primary);
  box-shadow: var(--shadow-glow);
}

.board-label {
  color: var(--text-muted);
  font-size: 10px;
  font-weight: 700;
  line-height: 1.1;
  text-transform: uppercase;
}

.board-summary h1 {
  margin-top: 3px;
  color: var(--text-primary);
  font-size: 15px;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-count {
  display: block;
  margin-top: 2px;
  color: var(--text-muted);
  font-size: 11px;
  line-height: 1.1;
}

.topbar-actions {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.zoom-controls {
  display: inline-flex;
  align-items: center;
  height: 34px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  overflow: hidden;
}

.zoom-button,
.zoom-readout {
  display: inline-grid;
  place-items: center;
  height: 100%;
  border: 0;
  background: transparent;
  color: var(--text-secondary);
  font: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.zoom-button {
  width: 34px;
}

.zoom-readout {
  width: 58px;
  border-right: 1px solid var(--border-color);
  border-left: 1px solid var(--border-color);
  color: var(--text-primary);
}

.zoom-button:hover,
.zoom-readout:hover {
  background: rgba(233, 69, 96, 0.12);
  color: var(--text-primary);
}

.board-shell {
  flex: 1;
  min-height: 0;
}
</style>
