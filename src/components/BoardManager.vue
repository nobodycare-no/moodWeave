<script setup lang="ts">
import { computed, ref } from 'vue'
import { useBoard } from '../composables/useBoard'

const {
  activeBoardId,
  boardCount,
  boards,
  createBoard,
  deleteBoard,
  renameBoard,
  switchBoard,
} = useBoard()

const draftName = ref('')
const renameDraftId = ref<string | null>(null)
const renameDraftValue = ref('')

const orderedBoards = computed(() => boards.value)

function submitCreateBoard() {
  const name = draftName.value.trim() || `Board ${boardCount.value + 1}`
  createBoard(name)
  draftName.value = ''
  renameDraftId.value = null
  renameDraftValue.value = ''
}

function beginRename(id: string, name: string) {
  renameDraftId.value = id
  renameDraftValue.value = name
}

function commitRename(id: string) {
  const name = renameDraftValue.value.trim()
  if (name) {
    renameBoard(id, name)
  }

  renameDraftId.value = null
  renameDraftValue.value = ''
}

function cancelRename() {
  renameDraftId.value = null
  renameDraftValue.value = ''
}

function removeBoard(id: string) {
  deleteBoard(id)
  if (renameDraftId.value === id) {
    cancelRename()
  }
}
</script>

<template>
  <section class="board-manager">
    <header class="section-header">
      <div>
        <p class="eyebrow">Projects</p>
        <h2>Boards</h2>
      </div>
      <span class="count">{{ boardCount }}</span>
    </header>

    <form class="create-board" @submit.prevent="submitCreateBoard">
      <input
        v-model="draftName"
        id="new-board-name"
        name="newBoardName"
        type="text"
        class="board-input"
        placeholder="New board name"
        aria-label="New board name"
      />
      <button class="primary-action" type="submit">New</button>
    </form>

    <div class="board-list" role="list" aria-label="Boards">
      <article
        v-for="board in orderedBoards"
        :key="board.id"
        class="board-item"
        :class="{ active: board.id === activeBoardId }"
        role="listitem"
      >
        <button class="board-body" type="button" @click="switchBoard(board.id)">
          <span class="board-name">
            {{ board.id === renameDraftId ? '' : board.name }}
          </span>
          <span class="board-meta">{{ board.cards.length }} cards</span>
        </button>

        <div v-if="board.id === renameDraftId" class="rename-row">
          <input
            v-model="renameDraftValue"
            :id="`rename-board-${board.id}`"
            name="renameBoard"
            class="rename-input"
            type="text"
            aria-label="Rename board"
            @keydown.enter.prevent="commitRename(board.id)"
            @keydown.esc.prevent="cancelRename"
          />
          <button class="icon-action" type="button" @click="commitRename(board.id)">Save</button>
        </div>

        <div v-else class="board-actions">
          <button class="icon-action" type="button" @click="beginRename(board.id, board.name)">
            Edit
          </button>
          <button class="icon-action danger" type="button" @click="removeBoard(board.id)">
            Delete
          </button>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.board-manager {
  display: flex;
  flex-direction: column;
  gap: 14px;
  height: 100%;
  padding: 14px 12px 12px;
  color: var(--text-primary);
}

.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}

.eyebrow {
  color: var(--text-muted);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

.section-header h2 {
  margin-top: 4px;
  font-size: 16px;
  line-height: 1.2;
}

.count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 22px;
  padding: 0 8px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 600;
}

.create-board {
  display: flex;
  gap: 8px;
}

.board-input,
.rename-input {
  width: 100%;
  min-width: 0;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  color: var(--text-primary);
  font: inherit;
  font-size: 12px;
  outline: none;
}

.board-input {
  height: 34px;
  padding: 0 10px;
}

.board-input:focus,
.rename-input:focus {
  border-color: rgba(233, 69, 96, 0.4);
  box-shadow: 0 0 0 3px rgba(233, 69, 96, 0.12);
}

.primary-action,
.icon-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: 8px;
  background: rgba(233, 69, 96, 0.14);
  color: var(--text-primary);
  font: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition:
    background var(--transition-fast),
    border-color var(--transition-fast),
    color var(--transition-fast);
}

.primary-action {
  min-width: 54px;
  padding: 0 12px;
}

.primary-action:hover,
.icon-action:hover {
  border-color: rgba(233, 69, 96, 0.35);
  background: rgba(233, 69, 96, 0.2);
}

.board-list {
  display: grid;
  gap: 10px;
  min-height: 0;
  overflow: auto;
  padding-right: 2px;
}

.board-item {
  display: grid;
  gap: 8px;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
}

.board-item.active {
  border-color: rgba(233, 69, 96, 0.48);
  background: rgba(233, 69, 96, 0.12);
}

.board-body {
  display: grid;
  gap: 4px;
  width: 100%;
  border: 0;
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;
}

.board-name {
  font-size: 13px;
  font-weight: 700;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.board-meta {
  color: var(--text-muted);
  font-size: 11px;
}

.board-actions,
.rename-row {
  display: flex;
  gap: 6px;
}

.rename-input {
  height: 32px;
  padding: 0 10px;
}

.icon-action {
  min-width: 46px;
  height: 32px;
  padding: 0 10px;
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-secondary);
}

.icon-action.danger {
  color: #ff9ca9;
}

.icon-action.danger:hover {
  border-color: rgba(233, 69, 96, 0.35);
  background: rgba(233, 69, 96, 0.18);
  color: var(--text-primary);
}
</style>
