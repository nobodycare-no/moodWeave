import { computed, ref } from 'vue'
import { useBoard } from './useBoard'
import type { Card } from '../types'

const selectedCardId = ref<string | null>(null)

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
    const card: Card = {
      id: createId('card'),
      type,
      x: 220 + currentBoard.value.cards.length * 24,
      y: 140 + currentBoard.value.cards.length * 20,
      width: baseSize.width,
      height: baseSize.height,
      content,
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
    touchBoard()

    return true
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

  return {
    cards,
    selectedCardId,
    addCard,
    removeCard,
    updateCardPosition,
    updateCardContent,
    selectCard,
    deselectAll,
  }
}
