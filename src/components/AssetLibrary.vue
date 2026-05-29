<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAssets } from '../composables/useAssets'
import { useCanvas } from '../composables/useCanvas'
import type { Asset } from '../types'

const { addAssetFromCard, assets, removeAsset } = useAssets()
const { addCard, selectedCard } = useCanvas()
const statusMessage = ref('')

const selectedLabel = computed(() => {
  if (!selectedCard.value) {
    return 'Select a card'
  }

  return selectedCard.value.type === 'image' ? 'Save image' : 'Save text'
})

function saveSelectedAsset() {
  if (!selectedCard.value) {
    statusMessage.value = 'Select a card on the canvas first.'
    return
  }

  const asset = addAssetFromCard(selectedCard.value)
  statusMessage.value = `${asset.name} saved.`
}

function insertAsset(asset: Asset) {
  addCard(asset.type, asset.content)
  statusMessage.value = `${asset.name} added to board.`
}

function deleteAsset(asset: Asset) {
  removeAsset(asset.id)
  statusMessage.value = `${asset.name} removed.`
}
</script>

<template>
  <section class="asset-library">
    <header class="section-header">
      <div>
        <p class="eyebrow">Reusable</p>
        <h2>Assets</h2>
      </div>
      <span class="count">{{ assets.length }}</span>
    </header>

    <button
      class="save-button"
      type="button"
      :disabled="!selectedCard"
      @click="saveSelectedAsset"
    >
      {{ selectedLabel }}
    </button>

    <p v-if="statusMessage" class="status-message" role="status">{{ statusMessage }}</p>

    <div v-if="assets.length" class="asset-list" role="list" aria-label="Saved assets">
      <article v-for="asset in assets" :key="asset.id" class="asset-item" role="listitem">
        <button class="asset-preview" type="button" @click="insertAsset(asset)">
          <img
            v-if="asset.type === 'image'"
            class="image-preview"
            :src="asset.content"
            :alt="asset.name"
          />
          <span v-else class="text-preview">{{ asset.content }}</span>
        </button>

        <div class="asset-meta">
          <div class="asset-copy">
            <span class="asset-name">{{ asset.name }}</span>
            <span class="asset-type">{{ asset.type }}</span>
          </div>
          <div class="asset-actions">
            <button class="asset-action" type="button" @click="insertAsset(asset)">Add</button>
            <button class="asset-action danger" type="button" @click="deleteAsset(asset)">
              Delete
            </button>
          </div>
        </div>
      </article>
    </div>

    <div v-else class="empty-state">
      <p>No assets saved yet.</p>
    </div>
  </section>
</template>

<style scoped>
.asset-library {
  display: flex;
  flex-direction: column;
  gap: 14px;
  height: 100%;
  padding: 14px 12px 12px;
  color: var(--text-primary);
}

.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}

.eyebrow {
  color: var(--text-muted);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

.section-header h2 {
  margin-top: 4px;
  font-size: 16px;
  line-height: 1.2;
}

.count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 22px;
  padding: 0 8px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 600;
}

.save-button,
.asset-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: 8px;
  background: rgba(233, 69, 96, 0.14);
  color: var(--text-primary);
  font: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition:
    background var(--transition-fast),
    border-color var(--transition-fast),
    color var(--transition-fast);
}

.save-button {
  height: 34px;
  width: 100%;
}

.save-button:hover:not(:disabled),
.asset-action:hover {
  border-color: rgba(233, 69, 96, 0.35);
  background: rgba(233, 69, 96, 0.2);
}

.save-button:disabled {
  border-color: var(--border-color);
  background: rgba(255, 255, 255, 0.03);
  color: var(--text-muted);
  cursor: not-allowed;
}

.status-message {
  min-height: 17px;
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.4;
}

.asset-list {
  display: grid;
  gap: 10px;
  min-height: 0;
  overflow: auto;
  padding-right: 2px;
}

.asset-item {
  display: grid;
  gap: 8px;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
}

.asset-preview {
  display: block;
  width: 100%;
  height: 86px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  color: inherit;
  overflow: hidden;
  cursor: pointer;
}

.asset-preview:hover {
  border-color: rgba(233, 69, 96, 0.35);
}

.image-preview {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.text-preview {
  display: -webkit-box;
  padding: 10px;
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.35;
  overflow: hidden;
  overflow-wrap: anywhere;
  text-align: left;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}

.asset-meta {
  display: grid;
  gap: 8px;
}

.asset-copy {
  display: grid;
  gap: 2px;
  min-width: 0;
}

.asset-name {
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 700;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.asset-type {
  color: var(--text-muted);
  font-size: 11px;
  text-transform: capitalize;
}

.asset-actions {
  display: flex;
  gap: 6px;
}

.asset-action {
  min-width: 54px;
  height: 32px;
  padding: 0 10px;
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-secondary);
}

.asset-action.danger {
  color: #ff9ca9;
}

.asset-action.danger:hover {
  border-color: rgba(233, 69, 96, 0.35);
  background: rgba(233, 69, 96, 0.18);
  color: var(--text-primary);
}

.empty-state {
  display: grid;
  place-items: center;
  min-height: 120px;
  border: 1px dashed var(--border-color);
  border-radius: 8px;
  color: var(--text-muted);
  font-size: 12px;
  text-align: center;
}
</style>
