<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import type { Card, Connection } from '../types'
import { useCanvas } from '../composables/useCanvas'

const props = defineProps<{
  cards: Card[]
  connections: Connection[]
}>()

const { updateConnectionLabel } = useCanvas()
const editingConnectionId = ref<string | null>(null)
const labelDraft = ref('')
const activeInput = ref<HTMLInputElement | null>(null)

const connectionLines = computed(() => {
  const cardMap = new Map(props.cards.map((card) => [card.id, card]))

  return props.connections
    .map((connection) => {
      const fromCard = cardMap.get(connection.fromCardId)
      const toCard = cardMap.get(connection.toCardId)
      if (!fromCard || !toCard) {
        return null
      }

      const from = {
        x: fromCard.x + fromCard.width / 2,
        y: fromCard.y + fromCard.height / 2,
      }
      const to = {
        x: toCard.x + toCard.width / 2,
        y: toCard.y + toCard.height / 2,
      }
      const distance = Math.max(80, Math.abs(to.x - from.x) * 0.38)
      const path = `M ${from.x} ${from.y} C ${from.x + distance} ${from.y}, ${to.x - distance} ${to.y}, ${to.x} ${to.y}`

      return {
        id: connection.id,
        label: connection.label,
        labelX: (from.x + to.x) / 2,
        labelY: (from.y + to.y) / 2,
        path,
        to,
      }
    })
    .filter(
      (
        line,
      ): line is {
        id: string
        label: string
        labelX: number
        labelY: number
        path: string
        to: { x: number; y: number }
      } => line !== null,
    )
})

async function beginLabelEdit(connectionId: string, label: string) {
  editingConnectionId.value = connectionId
  labelDraft.value = label
  await nextTick()
  activeInput.value?.focus()
  activeInput.value?.select()
}

function setActiveInput(element: Element | null) {
  activeInput.value = element instanceof HTMLInputElement ? element : null
}

function saveLabelEdit() {
  if (!editingConnectionId.value) {
    return
  }

  updateConnectionLabel(editingConnectionId.value, labelDraft.value)
  editingConnectionId.value = null
  labelDraft.value = ''
}

function cancelLabelEdit() {
  editingConnectionId.value = null
  labelDraft.value = ''
}
</script>

<template>
  <div class="connection-layer">
    <svg class="connection-svg" aria-hidden="true">
      <defs>
        <marker
          id="connection-arrow"
          markerHeight="8"
          markerWidth="8"
          orient="auto"
          refX="7"
          refY="4"
          viewBox="0 0 8 8"
        >
          <path class="connection-arrow" d="M 0 0 L 8 4 L 0 8 z" />
        </marker>
      </defs>

      <path
        v-for="line in connectionLines"
        :key="line.id"
        class="connection-line"
        :d="line.path"
        marker-end="url(#connection-arrow)"
      />
    </svg>

    <div class="connection-labels">
      <form
        v-for="line in connectionLines"
        :key="`${line.id}-label`"
        class="connection-label"
        :class="{ empty: !line.label }"
        :style="{ transform: `translate(${line.labelX}px, ${line.labelY}px) translate(-50%, -50%)` }"
        @submit.prevent="saveLabelEdit"
        @pointerdown.stop
        @click.stop
      >
        <input
          v-if="editingConnectionId === line.id"
          :ref="setActiveInput"
          v-model="labelDraft"
          class="connection-label-input"
          type="text"
          name="connectionLabel"
          maxlength="64"
          aria-label="Connection label"
          @blur="saveLabelEdit"
          @keydown.esc.prevent="cancelLabelEdit"
        />
        <button
          v-else
          class="connection-label-button"
          type="button"
          title="Edit connection label"
          @click="beginLabelEdit(line.id, line.label)"
        >
          {{ line.label || 'Label' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.connection-layer {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
}

.connection-svg,
.connection-labels {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.connection-svg {
  z-index: 0;
}

.connection-line {
  fill: none;
  stroke: rgba(233, 69, 96, 0.72);
  stroke-linecap: round;
  stroke-width: 2.5;
  filter: drop-shadow(0 0 8px rgba(233, 69, 96, 0.26));
}

.connection-arrow {
  fill: rgba(233, 69, 96, 0.82);
}

.connection-labels {
  z-index: 1;
}

.connection-label {
  position: absolute;
  top: 0;
  left: 0;
  width: max-content;
  max-width: 180px;
  pointer-events: auto;
}

.connection-label-button,
.connection-label-input {
  display: inline-flex;
  align-items: center;
  min-width: 42px;
  max-width: 180px;
  min-height: 26px;
  padding: 4px 10px;
  border: 1px solid rgba(255, 207, 112, 0.34);
  border-radius: 8px;
  background: rgba(22, 33, 62, 0.94);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.36);
  color: var(--text-primary);
  font: inherit;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.25;
}

.connection-label-button {
  justify-content: center;
  overflow-wrap: anywhere;
  text-align: center;
  cursor: text;
}

.connection-label.empty .connection-label-button {
  border-style: dashed;
  color: rgba(255, 255, 255, 0.64);
}

.connection-label-button:hover,
.connection-label-input:focus {
  border-color: rgba(255, 207, 112, 0.7);
  background: rgba(28, 40, 70, 0.98);
  outline: none;
}

.connection-label-input {
  width: 180px;
}
</style>
