import { computed, ref, watch } from 'vue'
import type { Board, Card, StorageData } from '../types'

const STORAGE_KEY = 'moodweave.boards.v1'

const boards = ref<Board[]>([])
const activeBoardId = ref<string | null>(null)

let initialized = false
let hydrated = false

function createId(prefix: string): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}_${crypto.randomUUID()}`
  }

  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function toStringValue(value: unknown, fallback = ''): string {
  return typeof value === 'string' && value.trim().length > 0 ? value : fallback
}

function toNumberValue(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function createCard(raw: unknown): Card | null {
  if (!isRecord(raw)) {
    return null
  }

  const type = raw.type
  if (type !== 'image' && type !== 'text') {
    return null
  }

  return {
    id: toStringValue(raw.id, createId('card')),
    type,
    x: toNumberValue(raw.x, 0),
    y: toNumberValue(raw.y, 0),
    width: Math.max(1, toNumberValue(raw.width, 280)),
    height: Math.max(1, toNumberValue(raw.height, 180)),
    content: toStringValue(raw.content, ''),
    zIndex: toNumberValue(raw.zIndex, 1),
  }
}

function createBoardRecord(name: string, cards: Card[] = []): Board {
  const now = new Date().toISOString()

  return {
    id: createId('board'),
    name,
    cards,
    createdAt: now,
    updatedAt: now,
  }
}

function normalizeBoard(raw: unknown, index: number): Board | null {
  if (!isRecord(raw)) {
    return null
  }

  const cards = Array.isArray(raw.cards)
    ? raw.cards.map(createCard).filter((card): card is Card => card !== null)
    : []

  return {
    id: toStringValue(raw.id, createId('board')),
    name: toStringValue(raw.name, `Board ${index + 1}`),
    cards,
    createdAt: toStringValue(raw.createdAt, new Date().toISOString()),
    updatedAt: toStringValue(raw.updatedAt, new Date().toISOString()),
  }
}

function loadStorage(): StorageData | null {
  if (typeof window === 'undefined') {
    return null
  }

  const rawValue = window.localStorage.getItem(STORAGE_KEY)
  if (!rawValue) {
    return null
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown
    if (!isRecord(parsed)) {
      return null
    }

    const loadedBoards = Array.isArray(parsed.boards)
      ? parsed.boards.map(normalizeBoard).filter((board): board is Board => board !== null)
      : []

    return {
      boards: loadedBoards,
      activeBoardId: toStringValue(parsed.activeBoardId, ''),
    }
  } catch {
    return null
  }
}

function persistStorage() {
  if (!hydrated || typeof window === 'undefined') {
    return
  }

  const payload: StorageData = {
    boards: boards.value,
    activeBoardId: activeBoardId.value,
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

function ensureDefaultBoard() {
  if (boards.value.length > 0) {
    return
  }

  const starter = createBoardRecord('Mood Board')
  boards.value = [starter]
  activeBoardId.value = starter.id
}

function hydrateBoards() {
  const stored = loadStorage()

  if (!stored || stored.boards.length === 0) {
    ensureDefaultBoard()
    hydrated = true
    persistStorage()
    return
  }

  boards.value = stored.boards
  activeBoardId.value =
    stored.activeBoardId && stored.boards.some((board) => board.id === stored.activeBoardId)
      ? stored.activeBoardId
      : stored.boards[0]?.id ?? null

  hydrated = true
  persistStorage()
}

function ensureInitialized() {
  if (initialized) {
    return
  }

  initialized = true
  hydrateBoards()
  watch([boards, activeBoardId], persistStorage, { deep: true })
}

function createBoard(name?: string): Board {
  ensureInitialized()

  const fallbackName = `Board ${boards.value.length + 1}`
  const board = createBoardRecord((name ?? fallbackName).trim() || fallbackName)

  boards.value.unshift(board)
  activeBoardId.value = board.id

  return board
}

function deleteBoard(id: string): boolean {
  ensureInitialized()

  const index = boards.value.findIndex((board) => board.id === id)
  if (index === -1) {
    return false
  }

  boards.value.splice(index, 1)

  if (boards.value.length === 0) {
    const fallback = createBoardRecord('Mood Board')
    boards.value = [fallback]
    activeBoardId.value = fallback.id
    return true
  }

  if (activeBoardId.value === id) {
    const nextIndex = Math.min(index, boards.value.length - 1)
    activeBoardId.value = boards.value[nextIndex]?.id ?? null
  }

  return true
}

function renameBoard(id: string, name: string): boolean {
  ensureInitialized()

  const board = boards.value.find((entry) => entry.id === id)
  if (!board) {
    return false
  }

  const trimmed = name.trim()
  if (!trimmed || trimmed === board.name) {
    return false
  }

  board.name = trimmed
  board.updatedAt = new Date().toISOString()

  return true
}

function switchBoard(id: string): boolean {
  ensureInitialized()

  const board = boards.value.find((entry) => entry.id === id)
  if (!board) {
    return false
  }

  activeBoardId.value = board.id
  return true
}

export function useBoard() {
  ensureInitialized()

  const currentBoard = computed(() => {
    return boards.value.find((board) => board.id === activeBoardId.value) ?? boards.value[0] ?? null
  })

  const boardCount = computed(() => boards.value.length)

  return {
    boards,
    activeBoardId,
    currentBoard,
    boardCount,
    createBoard,
    deleteBoard,
    renameBoard,
    switchBoard,
  }
}
