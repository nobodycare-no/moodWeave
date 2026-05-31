import { ref } from 'vue'
import type { BackupPackage } from '../types'

const STORAGE_KEY = 'moodweave.boards.v1'
const ASSETS_KEY = 'moodweave.assets.v1'

const isImporting = ref(false)
const importError = ref('')
const importSuccess = ref('')

async function readAllIndexedDbImages(): Promise<Array<{ id: string; dataUrl: string; mimeType: string; createdAt: string }>> {
  if (typeof indexedDB === 'undefined') {
    return []
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open('moodweave.images', 1)

    request.addEventListener('error', () => {
      reject(request.error ?? new Error('Could not open image store'))
    })

    request.addEventListener('success', () => {
      const db = request.result
      const transaction = db.transaction('images', 'readonly')
      const store = transaction.objectStore('images')
      const getAll = store.getAll()

      getAll.addEventListener('success', async () => {
        const storedImages = getAll.result as Array<{ id: string; blob: Blob; mimeType: string; createdAt: string }> | undefined
        if (!storedImages || storedImages.length === 0) {
          resolve([])
          return
        }

        const images = await Promise.all(
          storedImages.map(async (image) => {
            const dataUrl = await new Promise<string>((resolveUrl) => {
              const reader = new FileReader()
              reader.addEventListener('loadend', () => resolveUrl(reader.result as string))
              reader.readAsDataURL(image.blob)
            })

            return {
              id: image.id,
              dataUrl,
              mimeType: image.mimeType,
              createdAt: image.createdAt,
            }
          }),
        )

        resolve(images)
      })

      getAll.addEventListener('error', () => {
        reject(getAll.error ?? new Error('Could not read images'))
      })
    })
  })
}

async function writeImagesToIndexedDb(
  images: Array<{ id: string; dataUrl: string; mimeType: string; createdAt: string }>,
): Promise<number> {
  if (typeof indexedDB === 'undefined') {
    return 0
  }

  let written = 0

  for (const image of images) {
    try {
      const response = await fetch(image.dataUrl)
      const blob = await response.blob()

      await new Promise<void>((resolve, reject) => {
        const request = indexedDB.open('moodweave.images', 1)

        request.addEventListener('error', () => {
          reject(request.error ?? new Error('Could not open image store'))
        })

        request.addEventListener('success', () => {
          const db = request.result
          const transaction = db.transaction('images', 'readwrite')
          const store = transaction.objectStore('images')
          const put = store.put({
            id: image.id,
            blob,
            mimeType: image.mimeType,
            createdAt: image.createdAt,
          })

          put.addEventListener('success', () => resolve())
          put.addEventListener('error', () => reject(put.error ?? new Error('Could not write image')))
        })
      })

      written++
    } catch {
      console.warn(`Backup import: image ${image.id} could not be restored.`)
    }
  }

  return written
}

export function useBackup() {
  const isExporting = ref(false)
  const exportError = ref('')
  const exportSummary = ref('')

  async function exportBackup(): Promise<void> {
    if (isExporting.value) {
      return
    }

    isExporting.value = true
    exportError.value = ''
    exportSummary.value = ''

    try {
      const rawBoards = window.localStorage.getItem(STORAGE_KEY)
      const rawAssets = window.localStorage.getItem(ASSETS_KEY)
      const boards = rawBoards ? JSON.parse(rawBoards) : { boards: [], activeBoardId: null }
      const assets = rawAssets ? JSON.parse(rawAssets) : []

      const images = await readAllIndexedDbImages()

      const backup: BackupPackage = {
        appName: 'moodweave',
        exportedAt: new Date().toISOString(),
        schemaVersion: 1,
        data: {
          boards: boards.boards ?? [],
          assets,
          images,
        },
      }

      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url

      const date = new Date().toISOString().slice(0, 10)
      link.download = `moodweave-backup-${date}.json`
      link.click()
      URL.revokeObjectURL(url)

      exportSummary.value = `Exported ${backup.data.boards.length} board(s), ${backup.data.assets.length} asset(s), ${backup.data.images.length} image(s).`
    } catch (error) {
      exportError.value = 'Backup export failed. Check the console for details.'
      console.warn('Backup export error:', error)
    } finally {
      isExporting.value = false
    }
  }

  async function importBackup(file: File): Promise<void> {
    if (isImporting.value) {
      return
    }

    if (!file.name.endsWith('.json')) {
      importError.value = 'Please select a .json backup file.'
      return
    }

    isImporting.value = true
    importError.value = ''
    importSuccess.value = ''

    try {
      const text = await file.text()
      const backup = JSON.parse(text) as BackupPackage

      // Validate
      if (backup.appName !== 'moodweave') {
        importError.value = 'This file is not a valid MoodWeave backup.'
        return
      }

      if (!backup.data || !Array.isArray(backup.data.boards)) {
        importError.value = 'Backup file is missing board data.'
        return
      }

      // Write localStorage data
      const boardsPayload = {
        schemaVersion: backup.schemaVersion,
        boards: backup.data.boards,
        activeBoardId: backup.data.boards[0]?.id ?? null,
      }
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(boardsPayload))
      window.localStorage.setItem(ASSETS_KEY, JSON.stringify(backup.data.assets ?? []))

      // Write IndexedDB images
      let imageCount = 0

      if (Array.isArray(backup.data.images) && backup.data.images.length > 0) {
        imageCount = await writeImagesToIndexedDb(backup.data.images)
      }

      importSuccess.value = `Imported ${backup.data.boards.length} board(s), ${backup.data.assets.length} asset(s), ${imageCount} image(s). Reload the page to see the changes.`
    } catch (error) {
      importError.value = 'Backup import failed. The file may be corrupted.'
      console.warn('Backup import error:', error)
    } finally {
      isImporting.value = false
    }
  }

  function dismissImportFeedback() {
    importError.value = ''
    importSuccess.value = ''
  }

  return {
    isExporting,
    exportError,
    exportSummary,
    exportBackup,
    isImporting,
    importError,
    importSuccess,
    importBackup,
    dismissImportFeedback,
  }
}
