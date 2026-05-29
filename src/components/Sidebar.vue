<script setup lang="ts">
import { ref } from 'vue'
import AssetLibrary from './AssetLibrary.vue'
import BoardManager from './BoardManager.vue'

const navItems = [
  { id: 'boards', label: 'Boards' },
  { id: 'assets', label: 'Assets' },
] as const

type SidebarPanel = (typeof navItems)[number]['id']

const activePanel = ref<SidebarPanel>('boards')
</script>

<template>
  <nav class="sidebar" aria-label="Workspace tools">
    <div class="sidebar-header">
      <div class="brand-mark" aria-label="MoodWeave">MW</div>
      <div class="panel-switcher" role="tablist" aria-label="Sidebar panels">
        <button
          v-for="item in navItems"
          :key="item.id"
          class="panel-tab"
          :class="{ active: item.id === activePanel }"
          type="button"
          role="tab"
          :aria-selected="item.id === activePanel"
          :aria-label="item.label"
          :title="item.label"
          @click="activePanel = item.id"
        >
          {{ item.label }}
        </button>
      </div>
    </div>

    <BoardManager v-if="activePanel === 'boards'" class="sidebar-panel" />
    <AssetLibrary v-else class="sidebar-panel" />
  </nav>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
  height: 100%;
  padding: 14px 10px;
}

.sidebar-header {
  display: grid;
  gap: 12px;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border: 1px solid rgba(233, 69, 96, 0.35);
  border-radius: 8px;
  background: rgba(233, 69, 96, 0.12);
  box-shadow: 0 0 18px rgba(233, 69, 96, 0.16);
  color: var(--text-primary);
  font-size: 11px;
  font-weight: 700;
}

.panel-switcher {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.panel-tab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 34px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  color: var(--text-secondary);
  font: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition:
    color var(--transition-fast),
    background var(--transition-fast),
    border-color var(--transition-fast),
    transform var(--transition-fast);
}

.panel-tab:hover {
  border-color: var(--border-hover);
  background: var(--bg-card-hover);
  color: var(--text-primary);
}

.panel-tab.active {
  border-color: rgba(233, 69, 96, 0.48);
  background: rgba(233, 69, 96, 0.14);
  color: var(--text-primary);
  box-shadow: 0 0 0 1px rgba(233, 69, 96, 0.08) inset;
}

.panel-tab:active {
  transform: translateY(1px);
}

.sidebar-panel {
  flex: 1;
  min-height: 0;
}
</style>
