<script setup lang="ts">
import { computed } from 'vue'
import { useCanvas } from '../composables/useCanvas'

const { removeSelectedCard, selectedCard } = useCanvas()

const label = computed(() => {
  if (!selectedCard.value) {
    return 'Delete'
  }

  return selectedCard.value.type === 'image' ? 'Delete image' : 'Delete text'
})
</script>

<template>
  <button
    class="delete-button"
    type="button"
    :disabled="!selectedCard"
    :aria-label="label"
    :title="label"
    @click="removeSelectedCard"
  >
    Delete
  </button>
</template>

<style scoped>
.delete-button {
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

.delete-button:hover:not(:disabled) {
  background: rgba(233, 69, 96, 0.22);
}

.delete-button:disabled {
  border-color: var(--border-color);
  background: rgba(255, 255, 255, 0.03);
  color: var(--text-muted);
  cursor: not-allowed;
}
</style>
