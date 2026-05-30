<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import type { Card, Connection } from '../types'
import { useCanvas } from '../composables/useCanvas'
import {
  buildConnectionGeometry,
  getConnectionAnchors,
  getConnectionTheme,
} from '../utils/connectionStyles'

const props = defineProps<{
  cards: Card[]
  connections: Connection[]
}>()

const { updateConnectionLabel } = useCanvas()
const editingConnectionId = ref<string | null>(null)
const labelDraft = ref('')
const activeInput = ref<HTMLInputElement | null>(null)

function buildArrowPoints(to: { x: number; y: number }, angle: number): string {
  const arrowLength = 13
  const arrowWidth = 6.5
  const left = {
    x: to.x - arrowLength * Math.cos(angle) + arrowWidth * Math.sin(angle),
    y: to.y - arrowLength * Math.sin(angle) - arrowWidth * Math.cos(angle),
  }
  const right = {
    x: to.x - arrowLength * Math.cos(angle) - arrowWidth * Math.sin(angle),
    y: to.y - arrowLength * Math.sin(angle) + arrowWidth * Math.cos(angle),
  }

  return `${to.x},${to.y} ${left.x},${left.y} ${right.x},${right.y}`
}

const connectionLines = computed(() => {
  const cardMap = new Map(props.cards.map((card) => [card.id, card]))

  return props.connections
    .map((connection) => {
      const fromCard = cardMap.get(connection.fromCardId)
      const toCard = cardMap.get(connection.toCardId)
      if (!fromCard || !toCard) {
        return null
      }

      const { from, to } = getConnectionAnchors(fromCard, toCard)
      const geometry = buildConnectionGeometry(from, to)
      const theme = getConnectionTheme(fromCard.type, toCard.type)

      return {
        from,
        id: connection.id,
        arrowFill: theme.arrowFill,
        arrowPoints: buildArrowPoints(to, geometry.endAngle),
        direction: theme.direction,
        label: connection.label,
        labelBorder: theme.labelBorder,
        labelText: theme.labelText,
        labelX: geometry.labelX,
        labelY: geometry.labelY,
        lineEnd: theme.lineEnd,
        lineStart: theme.lineStart,
        path: geometry.path,
        shadow: theme.shadow,
        startFill: theme.startFill,
        to,
      }
    })
    .filter(
        (
        line,
      ): line is {
        from: { x: number; y: number }
        arrowFill: string
        arrowPoints: string
        direction: string
        id: string
        label: string
        labelBorder: string
        labelText: string
        labelX: number
        labelY: number
        lineEnd: string
        lineStart: string
        path: string
        shadow: string
        startFill: string
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
        <linearGradient
          v-for="line in connectionLines"
          :id="`connection-gradient-${line.id}`"
          :key="`${line.id}-gradient`"
          gradientUnits="userSpaceOnUse"
          :x1="line.from.x"
          :y1="line.from.y"
          :x2="line.to.x"
          :y2="line.to.y"
        >
          <stop offset="0%" :stop-color="line.lineStart" />
          <stop offset="100%" :stop-color="line.lineEnd" />
        </linearGradient>
      </defs>

      <path
        v-for="line in connectionLines"
        :key="`${line.id}-shadow`"
        class="connection-line-shadow"
        :d="line.path"
        :stroke="line.shadow"
      />

      <path
        v-for="line in connectionLines"
        :key="line.id"
        class="connection-line"
        :d="line.path"
        :stroke="`url(#connection-gradient-${line.id})`"
      />

      <circle
        v-for="line in connectionLines"
        :key="`${line.id}-start`"
        class="connection-start-dot"
        :cx="line.from.x"
        :cy="line.from.y"
        r="3.5"
        :stroke="line.startFill"
      />

      <polygon
        v-for="line in connectionLines"
        :key="`${line.id}-arrow`"
        class="connection-arrow"
        :points="line.arrowPoints"
        :fill="line.arrowFill"
      />
    </svg>

    <div class="connection-labels">
      <form
        v-for="line in connectionLines"
        :key="`${line.id}-label`"
        class="connection-label"
        :class="{ empty: !line.label }"
        :style="{
          borderColor: line.labelBorder,
          color: line.labelText,
          transform: `translate(${line.labelX}px, ${line.labelY}px) translate(-50%, -50%)`,
        }"
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
          :style="{ color: line.labelText }"
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

.connection-line,
.connection-line-shadow {
  fill: none;
  stroke-linecap: round;
}

.connection-line-shadow {
  opacity: 0.62;
  stroke-width: 4.75;
}

.connection-line {
  stroke-width: 2.25;
}

.connection-start-dot {
  fill: rgba(255, 255, 255, 0.94);
  stroke-width: 1.6;
}

.connection-arrow {
  stroke: rgba(255, 255, 255, 0.24);
  stroke-linejoin: round;
  stroke-width: 0.8;
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
