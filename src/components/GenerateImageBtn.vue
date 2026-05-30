<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useCanvas } from '../composables/useCanvas'
import { useImageGeneration } from '../composables/useImageGeneration'

const { addCard, selectedCard } = useCanvas()
const { generateImage, generationError, isConfigured, isGenerating } = useImageGeneration()

const buttonRef = ref<HTMLButtonElement | null>(null)
const isPanelOpen = ref(false)
const promptDraft = ref('')
const panelPosition = ref({ left: 0, top: 0, width: 340, maxHeight: 420 })

const selectedTextPrompt = computed(() => {
  return selectedCard.value?.type === 'text' ? selectedCard.value.content : ''
})

const panelStyle = computed(() => ({
  left: `${panelPosition.value.left}px`,
  maxHeight: `${panelPosition.value.maxHeight}px`,
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
  const toolbarRect = buttonRef.value.closest('.top-toolbar')?.getBoundingClientRect()
  const width = Math.max(240, Math.min(340, window.innerWidth - viewportPadding * 2))
  const left = clamp(buttonRect.left, viewportPadding, window.innerWidth - width - viewportPadding)
  const top = Math.max(buttonRect.bottom, toolbarRect?.bottom ?? 0) + 10

  panelPosition.value = {
    left,
    maxHeight: Math.max(180, window.innerHeight - top - viewportPadding),
    top,
    width,
  }
}

function seedPromptFromSelection() {
  if (selectedTextPrompt.value) {
    promptDraft.value = selectedTextPrompt.value
  }
}

async function togglePanel() {
  isPanelOpen.value = !isPanelOpen.value

  if (isPanelOpen.value) {
    seedPromptFromSelection()
    await nextTick()
    updatePanelPosition()
  }
}

function closePanel() {
  isPanelOpen.value = false
}

async function submitPrompt() {
  try {
    const imageRef = await generateImage(promptDraft.value)
    addCard('image', imageRef)
    closePanel()
  } catch {
    return
  }
}

watch(selectedTextPrompt, (nextPrompt) => {
  if (isPanelOpen.value && nextPrompt && !promptDraft.value.trim()) {
    promptDraft.value = nextPrompt
  }
})

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
  <div class="generate-image">
    <button
      ref="buttonRef"
      class="generate-image-button"
      type="button"
      :aria-expanded="isPanelOpen"
      aria-haspopup="dialog"
      title="Generate image"
      @click="togglePanel"
    >
      AI image
    </button>

    <Teleport to="body">
      <form
        v-if="isPanelOpen"
        class="generate-panel"
        :style="panelStyle"
        @submit.prevent="submitPrompt"
        @keydown.esc="closePanel"
      >
        <textarea
          v-model="promptDraft"
          class="prompt-input"
          name="imagePrompt"
          rows="5"
          placeholder="Describe the image..."
          aria-label="Image prompt"
        ></textarea>

        <div class="panel-actions">
          <button
            class="ghost-button"
            type="button"
            :disabled="!selectedTextPrompt"
            @click="seedPromptFromSelection"
          >
            Text prompt
          </button>
          <button class="submit-button" type="submit" :disabled="isGenerating">
            {{ isGenerating ? 'Generating' : 'Generate' }}
          </button>
        </div>

        <p v-if="generationError || !isConfigured" class="generation-message" role="status">
          {{ generationError || 'Add PackyCode API key in .env before generating.' }}
        </p>
      </form>
    </Teleport>
  </div>
</template>

<style scoped>
.generate-image {
  position: relative;
}

.generate-image-button,
.ghost-button,
.submit-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 34px;
  border: 1px solid rgba(255, 207, 112, 0.34);
  border-radius: 8px;
  background: rgba(255, 207, 112, 0.12);
  color: var(--text-primary);
  font: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}

.generate-image-button {
  padding: 0 12px;
}

.generate-image-button:hover,
.ghost-button:hover:not(:disabled),
.submit-button:hover:not(:disabled) {
  background: rgba(255, 207, 112, 0.2);
}

.generate-panel {
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
  overflow: auto;
}

.prompt-input {
  width: 100%;
  min-height: 118px;
  resize: vertical;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-primary);
  font: inherit;
  font-size: 12px;
  line-height: 1.45;
  outline: none;
}

.prompt-input:focus {
  border-color: rgba(255, 207, 112, 0.5);
  box-shadow: 0 0 0 3px rgba(255, 207, 112, 0.12);
}

.panel-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.ghost-button,
.submit-button {
  padding: 0 12px;
}

.ghost-button:disabled,
.submit-button:disabled {
  border-color: var(--border-color);
  background: rgba(255, 255, 255, 0.03);
  color: var(--text-muted);
  cursor: not-allowed;
}

.generation-message {
  color: #ffcf70;
  font-size: 12px;
  line-height: 1.4;
}
</style>
