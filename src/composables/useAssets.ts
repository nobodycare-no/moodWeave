import { computed, ref, watch } from 'vue'
import type { Asset, Card } from '../types'

const STORAGE_KEY = 'moodweave.assets.v1'

const assets = ref<Asset[]>([])
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

function createAsset(raw: unknown, index: number): Asset | null {
  if (!isRecord(raw)) {
    return null
  }

  const type = raw.type
  if (type !== 'image' && type !== 'text') {
    return null
  }

  const content = toStringValue(raw.content)
  if (!content) {
    return null
  }

  return {
    id: toStringValue(raw.id, createId('asset')),
    type,
    name: toStringValue(raw.name, type === 'image' ? `Image ${index + 1}` : `Text ${index + 1}`),
    content,
    createdAt: toStringValue(raw.createdAt, new Date().toISOString()),
  }
}

function loadStorage(): Asset[] {
  if (typeof window === 'undefined') {
    return []
  }

  const rawValue = window.localStorage.getItem(STORAGE_KEY)
  if (!rawValue) {
    return []
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.map(createAsset).filter((asset): asset is Asset => asset !== null)
  } catch {
    return []
  }
}

function persistStorage() {
  if (!hydrated || typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(assets.value))
}

function ensureInitialized() {
  if (initialized) {
    return
  }

  initialized = true
  assets.value = loadStorage()
  hydrated = true
  persistStorage()
  watch(assets, persistStorage, { deep: true })
}

function createName(type: Card['type'], content: string): string {
  if (type === 'image') {
    return `Image asset ${assets.value.filter((asset) => asset.type === 'image').length + 1}`
  }

  const firstLine = content.trim().split('\n')[0] ?? ''
  return firstLine.slice(0, 36) || `Text asset ${assets.value.filter((asset) => asset.type === 'text').length + 1}`
}

function addAssetFromCard(card: Card): Asset {
  ensureInitialized()

  const now = new Date().toISOString()
  const asset: Asset = {
    id: createId('asset'),
    type: card.type,
    name: createName(card.type, card.content),
    content: card.content,
    createdAt: now,
  }

  assets.value.unshift(asset)
  return asset
}

function removeAsset(id: string): boolean {
  ensureInitialized()

  const index = assets.value.findIndex((asset) => asset.id === id)
  if (index === -1) {
    return false
  }

  assets.value.splice(index, 1)
  return true
}

export function useAssets() {
  ensureInitialized()

  const imageAssets = computed(() => assets.value.filter((asset) => asset.type === 'image'))
  const textAssets = computed(() => assets.value.filter((asset) => asset.type === 'text'))

  return {
    assets,
    imageAssets,
    textAssets,
    addAssetFromCard,
    removeAsset,
  }
}
