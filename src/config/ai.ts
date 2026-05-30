const DEFAULT_PACKYCODE_BASE_URL = 'https://www.packyapi.com/v1'
const DEFAULT_IMAGE_MODEL = 'gpt-image-2'
const DEFAULT_IMAGE_SIZE = '1024x1024'

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '')
}

export interface ImageGenerationConfig {
  apiKey: string
  baseUrl: string
  model: string
  size: string
}

export function getImageGenerationConfig(): ImageGenerationConfig {
  const baseUrl = import.meta.env.VITE_PACKYCODE_BASE_URL || DEFAULT_PACKYCODE_BASE_URL

  return {
    apiKey: import.meta.env.VITE_PACKYCODE_API_KEY || '',
    baseUrl: trimTrailingSlash(baseUrl),
    model: import.meta.env.VITE_IMAGE_MODEL || DEFAULT_IMAGE_MODEL,
    size: import.meta.env.VITE_IMAGE_SIZE || DEFAULT_IMAGE_SIZE,
  }
}

export function getImageGenerationEndpoint(config: ImageGenerationConfig): string {
  return `${config.baseUrl}/images/generations`
}
