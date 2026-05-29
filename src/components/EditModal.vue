<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { useCanvas } from '../composables/useCanvas'

const { cancelTextEdit, editDraft, editingCard, saveTextEdit, updateEditDraft } = useCanvas()
const textareaRef = ref<HTMLTextAreaElement | null>(null)

watch(
  () => editingCard.value?.id,
  async (id) => {
    if (!id) {
      return
    }

    await nextTick()
    textareaRef.value?.focus()
    textareaRef.value?.select()
  },
)

function handleInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  updateEditDraft(target.value)
}

function submit() {
  saveTextEdit()
}
</script>

<template>
  <div v-if="editingCard" class="modal-backdrop" @pointerdown.self="cancelTextEdit">
    <form class="edit-modal" @submit.prevent="submit">
      <header class="modal-header">
        <h2>Edit text</h2>
        <button class="close-button" type="button" aria-label="Close editor" @click="cancelTextEdit">
          x
        </button>
      </header>

      <textarea
        ref="textareaRef"
        class="text-editor"
        :value="editDraft"
        rows="7"
        aria-label="Text content"
        @input="handleInput"
        @keydown.esc.prevent="cancelTextEdit"
      ></textarea>

      <footer class="modal-actions">
        <button class="secondary-action" type="button" @click="cancelTextEdit">Cancel</button>
        <button class="primary-action" type="submit">Save</button>
      </footer>
    </form>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: absolute;
  inset: 0;
  z-index: 80;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.34);
  backdrop-filter: blur(6px);
}

.edit-modal {
  display: grid;
  gap: 14px;
  width: min(480px, 100%);
  padding: 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: rgba(22, 33, 62, 0.97);
  box-shadow: var(--shadow-lg);
}

.modal-header,
.modal-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.modal-header h2 {
  color: var(--text-primary);
  font-size: 16px;
  line-height: 1.2;
}

.close-button,
.secondary-action,
.primary-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 34px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-secondary);
  font: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.close-button {
  width: 34px;
}

.text-editor {
  width: 100%;
  min-height: 160px;
  resize: vertical;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-primary);
  font: inherit;
  font-size: 14px;
  line-height: 1.5;
  outline: none;
}

.text-editor:focus {
  border-color: rgba(233, 69, 96, 0.44);
  box-shadow: 0 0 0 3px rgba(233, 69, 96, 0.14);
}

.modal-actions {
  justify-content: flex-end;
}

.secondary-action,
.primary-action {
  min-width: 74px;
  padding: 0 12px;
}

.primary-action {
  border-color: rgba(233, 69, 96, 0.35);
  background: rgba(233, 69, 96, 0.16);
  color: var(--text-primary);
}

.secondary-action:hover,
.close-button:hover,
.primary-action:hover {
  background: rgba(233, 69, 96, 0.2);
  color: var(--text-primary);
}
</style>
