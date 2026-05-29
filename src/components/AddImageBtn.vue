<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref } from 'vue'
import { useCanvas } from '../composables/useCanvas'

const { addCard } = useCanvas()
const buttonRef = ref<HTMLButtonElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const imageUrl = ref('')
const isPanelOpen = ref(false)
const errorMessage = ref('')
const panelPosition = ref({ left: 0, top: 0, width: 300 })

const panelStyle = computed(() => ({
  left: `${panelPosition.value.left}px`,
  top: `${panelPosition.value.top}px`,
  width: `${panelPosition.value.width}px`,
}))

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function updatePanelPosition() {
  if (!buttonRef.value || typeof window === 'undefined') {
    return
  }

  const viewportPadding = 16
  const buttonRect = buttonRef.value.getBoundingClientRect()
  const width = Math.max(180, Math.min(300, window.innerWidth - viewportPadding * 2))
  const left = clamp(buttonRect.left, viewportPadding, window.innerWidth - width - viewportPadding)

  panelPosition.value = {
    left,
    top: buttonRect.bottom + 10,
    width,
  }
}

async function togglePanel() {
  isPanelOpen.value = !isPanelOpen.value

  if (isPanelOpen.value) {
    await nextTick()
    updatePanelPosition()
  }
}

function closePanel() {
  isPanelOpen.value = false
}

function openFilePicker() {
  fileInput.value?.click()
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
        return
      }

      reject(new Error('Unsupported file result'))
    })
    reader.addEventListener('error', () => reject(reader.error ?? new Error('Unable to read file')))
    reader.readAsDataURL(file)
  })
}

async function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) {
    return
  }

  errorMessage.value = ''

  try {
    const dataUrl = await readFileAsDataUrl(file)
    addCard('image', dataUrl)
    closePanel()
  } catch {
    errorMessage.value = 'Image could not be loaded.'
  } finally {
    target.value = ''
  }
}

function addFromUrl() {
  const trimmed = imageUrl.value.trim()
  if (!trimmed) {
    errorMessage.value = 'Paste an image URL first.'
    return
  }

  addCard('image', trimmed)
  imageUrl.value = ''
  errorMessage.value = ''
  closePanel()
}

if (typeof window !== 'undefined') {
  window.addEventListener('resize', updatePanelPosition)
  window.addEventListener('scroll', updatePanelPosition, true)
}

onBeforeUnmount(() => {
  if (typeof window === 'undefined') {
    return
  }

  window.removeEventListener('resize', updatePanelPosition)
  window.removeEventListener('scroll', updatePanelPosition, true)
})
</script>

<template>
  <div class="add-image">
    <button
      ref="buttonRef"
      class="add-image-button"
      type="button"
      :aria-expanded="isPanelOpen"
      aria-haspopup="dialog"
      @click="togglePanel"
    >
      Add image
    </button>

    <Teleport to="body">
      <div v-if="isPanelOpen" class="add-panel" :style="panelStyle" @keydown.esc="closePanel">
        <button class="upload-button" type="button" @click="openFilePicker">Upload image</button>
        <input
          ref="fileInput"
          class="file-input"
          type="file"
          accept="image/*"
          aria-label="Upload image"
          @change="handleFileChange"
        />

        <form class="url-form" @submit.prevent="addFromUrl">
          <input
            v-model="imageUrl"
            class="url-input"
            type="url"
            placeholder="https://..."
            aria-label="Image URL"
          />
          <button class="url-submit" type="submit">Use URL</button>
        </form>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.add-image {
  position: relative;
}

.add-image-button,
.upload-button,
.url-submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 34px;
  border: 1px solid rgba(233, 69, 96, 0.28);
  border-radius: 8px;
  background: rgba(233, 69, 96, 0.14);
  color: var(--text-primary);
  font: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.add-image-button {
  padding: 0 12px;
}

.add-image-button:hover,
.upload-button:hover,
.url-submit:hover {
  background: rgba(233, 69, 96, 0.22);
}

.add-panel {
  position: fixed;
  z-index: 1000;
  display: grid;
  gap: 10px;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: rgba(22, 33, 62, 0.96);
  box-shadow: var(--shadow-lg);
  backdrop-filter: blur(var(--glass-blur));
}

.upload-button {
  width: 100%;
}

.file-input {
  display: none;
}

.url-form {
  display: flex;
  gap: 8px;
}

.url-input {
  flex: 1;
  min-width: 0;
  height: 34px;
  padding: 0 10px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-primary);
  font: inherit;
  font-size: 12px;
  outline: none;
}

.url-input:focus {
  border-color: rgba(233, 69, 96, 0.4);
  box-shadow: 0 0 0 3px rgba(233, 69, 96, 0.12);
}

.url-submit {
  min-width: 72px;
  padding: 0 10px;
}

.error-message {
  color: #ff9ca9;
  font-size: 12px;
  line-height: 1.4;
}
</style>
