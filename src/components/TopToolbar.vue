<script setup lang="ts">
import AddImageBtn from './AddImageBtn.vue'
import AddTextBtn from './AddTextBtn.vue'
import ConnectBtn from './ConnectBtn.vue'
import DeleteBtn from './DeleteBtn.vue'
import ExportBtn from './ExportBtn.vue'
import GenerateImageBtn from './GenerateImageBtn.vue'
</script>

<template>
  <div class="top-toolbar" role="toolbar" aria-label="Canvas actions">
    <AddImageBtn />
    <GenerateImageBtn />
    <AddTextBtn />
    <span class="divider" aria-hidden="true"></span>
    <ConnectBtn />
    <DeleteBtn />
    <span class="divider" aria-hidden="true"></span>
    <ExportBtn />
  </div>
</template>

<style scoped>
.top-toolbar {
  position: absolute;
  top: 14px;
  left: 50%;
  z-index: 70;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: max-content;
  max-width: calc(100% - 24px);
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: rgba(22, 33, 62, 0.9);
  box-shadow: var(--shadow-lg);
  backdrop-filter: blur(var(--glass-blur));
  transform: translateX(-50%);
}

.divider {
  width: 1px;
  height: 24px;
  background: var(--border-color);
  flex: 0 0 auto;
}

@media (max-width: 760px) {
  .top-toolbar {
    top: 10px;
    gap: 6px;
    padding: 6px;
  }

  .divider {
    display: none;
  }
}
</style>
