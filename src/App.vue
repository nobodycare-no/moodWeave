<script setup lang="ts">
</script>

<template>
  <div class="app-root">
    <header class="app-header">
      <div class="logo">
        <span class="logo-icon">✦</span>
        <span class="logo-text">MoodWeave</span>
      </div>
      <span class="app-status">Ready to create ✨</span>
    </header>
    <main class="app-main">
      <div class="placeholder">
        <div class="placeholder-icon">🎨</div>
        <h2>Welcome to MoodWeave</h2>
        <p>Your visual inspiration board is loading...</p>
      </div>
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
  padding: 0 20px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-secondary);
  flex-shrink: 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-icon {
  font-size: 20px;
  color: var(--accent-primary);
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-purple));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.app-status {
  font-size: 13px;
  color: var(--text-muted);
}

.app-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder {
  text-align: center;
  color: var(--text-secondary);
}

.placeholder-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.placeholder h2 {
  font-size: 24px;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.placeholder p {
  font-size: 14px;
  color: var(--text-muted);
}
</style>
