export interface Card {
  id: string
  type: 'image' | 'text'
  x: number
  y: number
  width: number
  height: number
  content: string
  zIndex: number
}

export interface Board {
  id: string
  name: string
  cards: Card[]
  createdAt: string
  updatedAt: string
}

export interface StorageData {
  boards: Board[]
  activeBoardId: string | null
}
