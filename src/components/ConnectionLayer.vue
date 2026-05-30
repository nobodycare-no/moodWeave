<script setup lang="ts">
import { computed } from 'vue'
import type { Card, Connection } from '../types'

const props = defineProps<{
  cards: Card[]
  connections: Connection[]
}>()

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
        path,
        to,
      }
    })
    .filter((line): line is { id: string; path: string; to: { x: number; y: number } } => line !== null)
})
</script>

<template>
  <svg class="connection-layer" aria-hidden="true">
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
</style>
