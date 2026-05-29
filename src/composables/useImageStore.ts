import { onBeforeUnmount, ref, watch, type Ref } from 'vue'

const DB_NAME = 'moodweave.images'
const DB_VERSION = 1
const STORE_NAME = 'images'
const IMAGE_REF_PREFIX = 'mw-image://'

interface StoredImage {
  id: string
  blob: Blob
  createdAt: string
  mimeType: string
}

const objectUrlCache = new Map<string, string>()
let dbPromise: Promise<IDBDatabase> | null = null

function createId(prefix: string): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}_${crypto.randomUUID()}`
  }

  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

function openDatabase(): Promise<IDBDatabase> {
  if (dbPromise) {
    return dbPromise
  }

  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not available'))
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.addEventListener('upgradeneeded', () => {
      const database = request.result
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    })

    request.addEventListener('success', () => resolve(request.result))
    request.addEventListener('error', () => {
      reject(request.error ?? new Error('Unable to open image store'))
    })
  })

  return dbPromise
}

function imageRefFromId(id: string): string {
  return `${IMAGE_REF_PREFIX}${id}`
}

function imageIdFromRef(source: string): string {
  return source.slice(IMAGE_REF_PREFIX.length)
}

export function isStoredImageRef(source: string): boolean {
  return source.startsWith(IMAGE_REF_PREFIX)
}

export function isInlineImageSource(source: string): boolean {
  return source.startsWith('data:image/')
}

async function blobFromDataUrl(source: string): Promise<Blob> {
  const response = await fetch(source)
  return response.blob()
}

export async function saveImageBlob(blob: Blob): Promise<string> {
  const database = await openDatabase()
  const id = createId('image')
  const image: StoredImage = {
    id,
    blob,
    createdAt: new Date().toISOString(),
    mimeType: blob.type || 'application/octet-stream',
  }

  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.put(image)

    request.addEventListener('success', () => resolve())
    request.addEventListener('error', () => {
      reject(request.error ?? new Error('Unable to save image'))
    })
  })

  return imageRefFromId(id)
}

export async function storeInlineImageSource(source: string): Promise<string> {
  if (!isInlineImageSource(source)) {
    return source
  }

  return saveImageBlob(await blobFromDataUrl(source))
}

export async function getImageBlob(source: string): Promise<Blob> {
  const database = await openDatabase()
  const id = isStoredImageRef(source) ? imageIdFromRef(source) : source

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.get(id)

    request.addEventListener('success', () => {
      const image = request.result as StoredImage | undefined
      if (!image) {
        reject(new Error('Image was not found'))
        return
      }

      resolve(image.blob)
    })
    request.addEventListener('error', () => {
      reject(request.error ?? new Error('Unable to read image'))
    })
  })
}

export async function resolveImageSource(source: string): Promise<string> {
  if (!isStoredImageRef(source)) {
    return source
  }

  const cached = objectUrlCache.get(source)
  if (cached) {
    return cached
  }

  const blob = await getImageBlob(source)
  const objectUrl = URL.createObjectURL(blob)
  objectUrlCache.set(source, objectUrl)
  return objectUrl
}

export function useResolvedImageSource(source: Ref<string>) {
  const resolvedSource = ref('')
  const loadError = ref('')

  watch(
    source,
    async (nextSource) => {
      loadError.value = ''

      try {
        resolvedSource.value = await resolveImageSource(nextSource)
      } catch {
        resolvedSource.value = ''
        loadError.value = 'Image could not be loaded.'
      }
    },
    { immediate: true },
  )

  onBeforeUnmount(() => {
    resolvedSource.value = ''
  })

  return {
    loadError,
    resolvedSource,
  }
}
