<script setup lang="ts">
import { useCanvas } from '../composables/useCanvas'

const { addCard } = useCanvas()

function addTextCard() {
  addCard('text', 'Double-click to edit text')
}
</script>

<template>
  <button class="add-text-button" type="button" @click="addTextCard">Add text</button>
</template>

<style scoped>
.add-text-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 34px;
  padding: 0 12px;
  border: 1px solid rgba(233, 69, 96, 0.28);
  border-radius: 8px;
  background: rgba(233, 69, 96, 0.14);
  color: var(--text-primary);
  font: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.add-text-button:hover {
  background: rgba(233, 69, 96, 0.22);
}
</style>
