<script setup lang="ts">
import MainLayout from './components/MainLayout.vue'
import Sidebar from './components/Sidebar.vue'
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
        <span>Step 2 layout scaffold</span>
      </div>
    </header>

    <main class="app-main">
      <MainLayout>
        <template #sidebar>
          <Sidebar />
        </template>

        <template #canvas>
          <section class="canvas-placeholder" aria-label="Canvas preview">
            <div class="canvas-frame">
              <div class="canvas-grid"></div>
              <div class="canvas-copy">
                <p class="eyebrow">Workspace</p>
                <h1>Canvas area placeholder</h1>
                <p class="description">
                  The right side is reserved for the board surface, pan and zoom interactions, and
                  future card rendering.
                </p>
              </div>
            </div>
          </section>
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

.app-main {
  flex: 1;
  min-height: 0;
}

.canvas-placeholder {
  width: 100%;
  height: 100%;
  padding: 16px;
}

.canvas-frame {
  position: relative;
  width: 100%;
  height: 100%;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  background:
    radial-gradient(circle at top left, rgba(233, 69, 96, 0.08), transparent 22%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.01)),
    var(--bg-primary);
  box-shadow: var(--shadow-lg);
}

.canvas-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 48px 48px;
  opacity: 0.35;
  pointer-events: none;
}

.canvas-copy {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 10px;
  max-width: 360px;
  padding: 28px;
}

.eyebrow {
  color: var(--accent-primary);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

.canvas-copy h1 {
  color: var(--text-primary);
  font-size: 28px;
  line-height: 1.1;
}

.description {
  color: var(--text-muted);
  font-size: 14px;
  line-height: 1.6;
}
</style>
