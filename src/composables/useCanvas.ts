import { computed, ref } from 'vue'
import { useBoard } from './useBoard'
import type { Card } from '../types'

const selectedCardId = ref<string | null>(null)
const editingCardId = ref<string | null>(null)
const editDraft = ref('')

const DEFAULT_TEXT_CONTENT = 'Double-click to edit text'

function createId(prefix: string): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}_${crypto.randomUUID()}`
  }

  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

function getNextZIndex(cards: Card[]): number {
  return cards.reduce((max, card) => Math.max(max, card.zIndex), 0) + 1
}

export function useCanvas() {
  const { currentBoard } = useBoard()

  const cards = computed(() => currentBoard.value?.cards ?? [])
  const selectedCard = computed(
    () => cards.value.find((card) => card.id === selectedCardId.value) ?? null,
  )
  const editingCard = computed(
    () => cards.value.find((card) => card.id === editingCardId.value) ?? null,
  )

  function touchBoard() {
    if (currentBoard.value) {
      currentBoard.value.updatedAt = new Date().toISOString()
    }
  }

  function addCard(type: Card['type'], content: string): Card | null {
    if (!currentBoard.value) {
      return null
    }

    const baseSize = type === 'image' ? { width: 320, height: 220 } : { width: 260, height: 160 }
    const nextContent =
      type === 'text' ? content.trim() || DEFAULT_TEXT_CONTENT : content
    const card: Card = {
      id: createId('card'),
      type,
      x: 220 + currentBoard.value.cards.length * 24,
      y: 140 + currentBoard.value.cards.length * 20,
      width: baseSize.width,
      height: baseSize.height,
      content: nextContent,
      zIndex: getNextZIndex(currentBoard.value.cards),
    }

    currentBoard.value.cards.push(card)
    selectedCardId.value = card.id
    touchBoard()

    return card
  }

  function removeCard(id: string): boolean {
    if (!currentBoard.value) {
      return false
    }

    const index = currentBoard.value.cards.findIndex((card) => card.id === id)
    if (index === -1) {
      return false
    }

    currentBoard.value.cards.splice(index, 1)
    if (selectedCardId.value === id) {
      selectedCardId.value = null
    }
    if (editingCardId.value === id) {
      editingCardId.value = null
      editDraft.value = ''
    }
    touchBoard()

    return true
  }

  function removeSelectedCard(): boolean {
    if (!selectedCardId.value) {
      return false
    }

    return removeCard(selectedCardId.value)
  }

  function updateCardPosition(id: string, x: number, y: number): boolean {
    const card = cards.value.find((entry) => entry.id === id)
    if (!card) {
      return false
    }

    card.x = Math.round(x)
    card.y = Math.round(y)
    touchBoard()

    return true
  }

  function updateCardContent(id: string, content: string): boolean {
    const card = cards.value.find((entry) => entry.id === id)
    if (!card) {
      return false
    }

    card.content = content
    touchBoard()

    return true
  }

  function selectCard(id: string) {
    const card = cards.value.find((entry) => entry.id === id)
    if (!card) {
      return
    }

    selectedCardId.value = id
    card.zIndex = getNextZIndex(cards.value)
    touchBoard()
  }

  function deselectAll() {
    selectedCardId.value = null
  }

  function beginTextEdit(id: string): boolean {
    const card = cards.value.find((entry) => entry.id === id)
    if (!card || card.type !== 'text') {
      return false
    }

    selectedCardId.value = id
    editingCardId.value = id
    editDraft.value = card.content
    return true
  }

  function updateEditDraft(value: string) {
    editDraft.value = value
  }

  function saveTextEdit(): boolean {
    if (!editingCard.value) {
      return false
    }

    const nextContent = editDraft.value.trim()
    if (!nextContent) {
      return false
    }

    editingCard.value.content = nextContent
    touchBoard()
    editingCardId.value = null
    editDraft.value = ''
    return true
  }

  function cancelTextEdit() {
    editingCardId.value = null
    editDraft.value = ''
  }

  return {
    cards,
    editingCard,
    editDraft,
    editingCardId,
    selectedCard,
    selectedCardId,
    addCard,
    removeCard,
    removeSelectedCard,
    beginTextEdit,
    updateEditDraft,
    saveTextEdit,
    cancelTextEdit,
    updateCardPosition,
    updateCardContent,
    selectCard,
    deselectAll,
  }
}
