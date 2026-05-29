<script setup lang="ts">
import BoardManager from './BoardManager.vue'

const navItems = [
  { label: 'Boards', icon: 'B', active: true },
  { label: 'Assets', icon: 'A', active: false },
  { label: 'Export', icon: 'E', active: false },
]
</script>

<template>
  <nav class="sidebar" aria-label="Workspace tools">
    <div class="brand-mark" aria-label="MoodWeave">MW</div>

    <BoardManager class="board-panel" />

    <div class="nav-group">
      <button
        v-for="item in navItems"
        :key="item.label"
        class="nav-button"
        :class="{ active: item.active }"
        type="button"
        :aria-label="item.label"
        :title="item.label"
      >
        <span>{{ item.icon }}</span>
      </button>
    </div>

    <button class="profile-button" type="button" aria-label="Workspace settings" title="Settings">
      <span>...</span>
    </button>
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

.nav-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
  margin-top: auto;
}

.nav-button,
.profile-button {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: var(--text-muted);
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

.nav-button:hover,
.profile-button:hover {
  border-color: var(--border-hover);
  background: var(--bg-card-hover);
  color: var(--text-primary);
}

.nav-button.active {
  border-color: rgba(233, 69, 96, 0.48);
  background: rgba(233, 69, 96, 0.14);
  color: var(--text-primary);
}

.nav-button:active,
.profile-button:active {
  transform: translateY(1px);
}

.profile-button {
  margin-top: auto;
  color: var(--text-secondary);
}

.board-panel {
  flex: 1;
  min-height: 0;
}
</style>
