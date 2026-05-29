<template>
  <section class="main-layout">
    <aside class="sidebar-shell" aria-label="MoodWeave sidebar">
      <slot name="sidebar" />
    </aside>

    <div class="canvas-shell">
      <slot name="canvas" />
    </div>
  </section>
</template>

<style scoped>
.main-layout {
  display: grid;
  grid-template-columns: var(--sidebar-width) minmax(0, 1fr);
  min-height: 0;
  width: 100%;
  height: 100%;
}

.sidebar-shell {
  min-width: 0;
  min-height: 0;
  border-right: 1px solid var(--border-color);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01)),
    var(--bg-secondary);
  overflow: hidden;
}

.canvas-shell {
  min-width: 0;
  min-height: 0;
  background:
    radial-gradient(circle at top right, rgba(83, 52, 131, 0.18), transparent 38%),
    linear-gradient(180deg, rgba(15, 52, 96, 0.14), transparent 26%),
    var(--bg-primary);
  overflow: hidden;
}
</style>
