<script setup lang="ts">
import CanvasArea from './components/CanvasArea.vue'
import MainLayout from './components/MainLayout.vue'
import Sidebar from './components/Sidebar.vue'
import { useBoard } from './composables/useBoard'

const { currentBoard } = useBoard()
</script>

<template>
  <div class="app-root">
    <header class="app-header">
      <div class="logo">
        <span class="logo-mark">MW</span>
        <div class="logo-copy">
          <span class="logo-text">MoodWeave</span>
          <span class="logo-subtitle">Mood board workspace</span>
        </div>
      </div>

      <div class="header-status">
        <span class="status-dot" aria-hidden="true"></span>
        <span>{{ currentBoard?.name ?? 'Mood Board' }}</span>
        <span class="status-separator">/</span>
        <span>Step 5 image cards</span>
      </div>
    </header>

    <main class="app-main">
      <MainLayout>
        <template #sidebar>
          <Sidebar />
        </template>

        <template #canvas>
          <CanvasArea />
        </template>
      </MainLayout>
    </main>
  </div>
</template>

<style scoped>
.app-root {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg-primary);
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--toolbar-height);
  padding: 0 18px 0 16px;
  border-bottom: 1px solid var(--border-color);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01)),
    var(--bg-secondary);
  flex-shrink: 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.logo-mark {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border: 1px solid rgba(233, 69, 96, 0.3);
  border-radius: 7px;
  background: rgba(233, 69, 96, 0.1);
  color: var(--text-primary);
  font-size: 10px;
  font-weight: 700;
}

.logo-copy {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.logo-text {
  color: var(--text-primary);
  font-size: 15px;
  font-weight: 700;
  line-height: 1.1;
}

.logo-subtitle {
  color: var(--text-muted);
  font-size: 11px;
  line-height: 1.1;
}

.header-status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 12px;
  white-space: nowrap;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-primary);
  box-shadow: var(--shadow-glow);
}

.status-separator {
  color: var(--text-muted);
}

.app-main {
  flex: 1;
  min-height: 0;
}

</style>
