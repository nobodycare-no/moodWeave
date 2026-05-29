<script setup lang="ts">
import { computed } from 'vue'
import { useResolvedImageSource } from '../composables/useImageStore'

const props = defineProps<{
  alt: string
  source: string
}>()

const sourceRef = computed(() => props.source)
const { loadError, resolvedSource } = useResolvedImageSource(sourceRef)
</script>

<template>
  <img
    v-if="resolvedSource && !loadError"
    class="image-preview"
    :src="resolvedSource"
    :alt="alt"
  />
  <div v-else class="asset-fallback">
    <span>IMG</span>
  </div>
</template>

<style scoped>
.image-preview {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.asset-fallback {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  background:
    linear-gradient(135deg, rgba(233, 69, 96, 0.14), rgba(83, 52, 131, 0.16)),
    rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.72);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
}
</style>
