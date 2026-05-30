<script setup lang="ts">
import { computed } from 'vue'
import { useCanvas } from '../composables/useCanvas'

const { cancelConnection, connectionSource, isConnecting, selectedCard, startConnection } = useCanvas()

const label = computed(() => {
  if (isConnecting.value) {
    return 'Pick target'
  }

  return 'Connect'
})

const title = computed(() => {
  if (isConnecting.value && connectionSource.value) {
    return `Click a ${connectionSource.value.type === 'image' ? 'text' : 'image'} card to connect`
  }

  return selectedCard.value ? 'Connect selected card to another card' : 'Select a card first'
})

function toggleConnection() {
  if (isConnecting.value) {
    cancelConnection()
    return
  }

  startConnection()
}
</script>

<template>
  <button
    class="connect-button"
    type="button"
    :class="{ active: isConnecting }"
    :disabled="!selectedCard && !isConnecting"
    :title="title"
    @click="toggleConnection"
  >
    {{ label }}
  </button>
</template>

<style scoped>
.connect-button {
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
  white-space: nowrap;
}

.connect-button:hover:not(:disabled),
.connect-button.active {
  background: rgba(255, 207, 112, 0.18);
  border-color: rgba(255, 207, 112, 0.42);
}

.connect-button:disabled {
  border-color: var(--border-color);
  background: rgba(255, 255, 255, 0.03);
  color: var(--text-muted);
  cursor: not-allowed;
}
</style>
