<script setup lang="ts">
import { ref } from 'vue'
import { useBackup } from '../composables/useBackup'

const { isExporting, exportError, exportSummary, exportBackup, importBackup, importError, importSuccess, dismissImportFeedback } = useBackup()

const showMenu = ref(false)
const fileInput = ref<HTMLInputElement>()

function toggleMenu() {
  showMenu.value = !showMenu.value
  if (!showMenu.value) {
    dismissImportFeedback()
  }
}

function handleExport() {
  exportBackup()
  showMenu.value = false
}

function handleFileSelected(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  importBackup(file)
  showMenu.value = false
  input.value = ''
}

function handleImportClick() {
  fileInput.value?.click()
}
</script>

<template>
  <div class="backup-btn-wrapper">
    <button
      class="toolbar-btn"
      :class="{ active: showMenu }"
      :aria-expanded="showMenu"
      :aria-haspopup="true"
      :disabled="isExporting"
      @click="toggleMenu"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 1L8 10M8 10L5 7M8 10L11 7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M1 11L1 13C1 14.1046 1.89543 15 3 15L13 15C14.1046 15 15 14.1046 15 13L15 11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      </svg>
      <span>Backup</span>
    </button>

    <input
      ref="fileInput"
      type="file"
      accept=".json"
      class="file-input"
      @change="handleFileSelected"
    />

    <Teleport to="body">
      <div
        v-if="showMenu"
        class="backup-menu-overlay"
        @click.self="showMenu = false"
      >
        <div class="backup-menu">
          <button
            class="backup-menu-item"
            :disabled="isExporting"
            @click="handleExport"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L8 10M8 10L5 7M8 10L11 7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M1 11L1 13C1 14.1046 1.89543 15 3 15L13 15C14.1046 15 15 14.1046 15 13L15 11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
            </svg>
            <div class="backup-menu-text">
              <strong>Export Backup</strong>
              <span>Download all boards, assets &amp; images</span>
            </div>
          </button>

          <button
            class="backup-menu-item"
            @click="handleImportClick"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 15L8 6M8 6L5 9M8 6L11 9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M1 11L1 13C1 14.1046 1.89543 15 3 15L13 15C14.1046 15 15 14.1046 15 13L15 11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
            </svg>
            <div class="backup-menu-text">
              <strong>Import Backup</strong>
              <span>Restore boards, assets &amp; images from a file</span>
            </div>
          </button>

          <div v-if="exportSummary" class="backup-menu-feedback success">
            {{ exportSummary }}
          </div>
          <div v-if="exportError" class="backup-menu-feedback error">
            {{ exportError }}
          </div>
          <div v-if="importSuccess" class="backup-menu-feedback success">
            {{ importSuccess }}
          </div>
          <div v-if="importError" class="backup-menu-feedback error">
            {{ importError }}
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.toolbar-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background: transparent;
  color: var(--text-secondary);
  font-size: 13px;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.toolbar-btn:hover,
.toolbar-btn.active {
  background: var(--bg-card-hover);
  color: var(--text-primary);
  border-color: var(--border-hover);
}

.toolbar-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.file-input {
  display: none;
}

.backup-menu-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
}

.backup-menu {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 320px;
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  background: var(--bg-secondary);
  box-shadow: var(--shadow-lg);
}

.backup-menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: none;
  border-radius: var(--border-radius);
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
  text-align: left;
  transition: background var(--transition-fast);
}

.backup-menu-item:hover {
  background: var(--bg-card-hover);
}

.backup-menu-item:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.backup-menu-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.backup-menu-text strong {
  font-size: 14px;
  font-weight: 600;
}

.backup-menu-text span {
  font-size: 12px;
  color: var(--text-muted);
}

.backup-menu-feedback {
  padding: 8px 12px;
  border-radius: var(--border-radius-sm);
  font-size: 12px;
  line-height: 1.5;
}

.backup-menu-feedback.success {
  background: rgba(87, 214, 255, 0.1);
  color: #57d6ff;
}

.backup-menu-feedback.error {
  background: rgba(233, 69, 96, 0.1);
  color: var(--accent-primary);
}
</style>
