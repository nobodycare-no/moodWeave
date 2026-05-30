import { computed, ref } from 'vue'
import { getImageGenerationConfig, getImageGenerationEndpoint } from '../config/ai'
import { saveImageBlob } from './useImageStore'

interface ImageGenerationResponseItem {
  b64_json?: string
  url?: string
}

interface ImageGenerationResponse {
  data?: ImageGenerationResponseItem[]
  error?: {
    message?: string
  }
}

const isGenerating = ref(false)
const generationError = ref('')

function base64ToBlob(base64: string, mimeType = 'image/png'): Blob {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return new Blob([bytes], { type: mimeType })
}

async function tryStoreRemoteImage(url: string): Promise<string> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      return url
    }

    return saveImageBlob(await response.blob())
  } catch {
    return url
  }
}

export function useImageGeneration() {
  const config = computed(() => getImageGenerationConfig())
  const isConfigured = computed(() => Boolean(config.value.apiKey.trim()))

  async function generateImage(prompt: string): Promise<string> {
    const trimmedPrompt = prompt.trim()
    generationError.value = ''

    if (!trimmedPrompt) {
      generationError.value = 'Enter an image prompt first.'
      throw new Error(generationError.value)
    }

    if (!isConfigured.value) {
      generationError.value = 'PackyCode API key is missing. Add it to your .env file.'
      throw new Error(generationError.value)
    }

    if (isGenerating.value) {
      generationError.value = 'Image generation is already running.'
      throw new Error(generationError.value)
    }

    isGenerating.value = true

    try {
      const response = await fetch(getImageGenerationEndpoint(config.value), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.value.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: config.value.model,
          prompt: trimmedPrompt,
          response_format: 'b64_json',
          size: config.value.size,
        }),
      })
      const payload = (await response.json().catch(() => ({}))) as ImageGenerationResponse

      if (!response.ok) {
        throw new Error(payload.error?.message || 'Image generation request failed.')
      }

      const image = payload.data?.[0]
      if (image?.b64_json) {
        return saveImageBlob(base64ToBlob(image.b64_json))
      }

      if (image?.url) {
        return tryStoreRemoteImage(image.url)
      }

      throw new Error('Image generation response did not include an image.')
    } catch (error) {
      generationError.value =
        error instanceof Error ? error.message : 'Image generation failed.'
      throw error
    } finally {
      isGenerating.value = false
    }
  }

  return {
    generateImage,
    generationError,
    isConfigured,
    isGenerating,
  }
}
