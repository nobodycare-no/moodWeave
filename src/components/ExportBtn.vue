<script setup lang="ts">
import { useExport } from '../composables/useExport'

const { canExport, exportError, exportPng, isExporting } = useExport()
</script>

<template>
  <div class="export-control">
    <button
      class="export-button"
      type="button"
      :disabled="!canExport || isExporting"
      :aria-busy="isExporting"
      title="Export board as PNG"
      @click="exportPng"
    >
      {{ isExporting ? 'Exporting' : 'Export PNG' }}
    </button>

    <p v-if="exportError" class="export-error" role="status">{{ exportError }}</p>
  </div>
</template>

<style scoped>
.export-control {
  position: relative;
}

.export-button {
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

.export-button:hover:not(:disabled) {
  background: rgba(233, 69, 96, 0.22);
}

.export-button:disabled {
  border-color: var(--border-color);
  background: rgba(255, 255, 255, 0.03);
  color: var(--text-muted);
  cursor: not-allowed;
}

.export-error {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 60;
  width: 240px;
  padding: 10px 12px;
  border: 1px solid rgba(255, 156, 169, 0.28);
  border-radius: 8px;
  background: rgba(22, 33, 62, 0.96);
  box-shadow: var(--shadow-lg);
  color: #ff9ca9;
  font-size: 12px;
  line-height: 1.4;
}
</style>
