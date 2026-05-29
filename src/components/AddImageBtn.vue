<script setup lang="ts">
import { ref } from 'vue'
import { useCanvas } from '../composables/useCanvas'

const { addCard } = useCanvas()
const fileInput = ref<HTMLInputElement | null>(null)
const imageUrl = ref('')
const isPanelOpen = ref(false)
const errorMessage = ref('')

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
    isPanelOpen.value = false
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
  isPanelOpen.value = false
}
</script>

<template>
  <div class="add-image">
    <button class="add-image-button" type="button" @click="isPanelOpen = !isPanelOpen">
      Add image
    </button>

    <div v-if="isPanelOpen" class="add-panel">
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
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 60;
  display: grid;
  gap: 10px;
  width: 280px;
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
