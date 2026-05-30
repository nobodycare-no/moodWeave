const DEFAULT_PACKYCODE_BASE_URL = 'https://www.packyapi.com/v1'
const DEFAULT_IMAGE_MODEL = 'gpt-image-2'
const DEFAULT_IMAGE_SIZE = '1024x1024'
const DEFAULT_IMAGE_QUALITY = 'auto'
const DEFAULT_IMAGE_RESPONSE_FORMAT = 'b64_json'
const DEFAULT_IMAGE_OUTPUT_FORMAT = 'png'
const DEFAULT_IMAGE_BACKGROUND = 'opaque'
const DEFAULT_IMAGE_MODERATION = 'auto'

type ImageQuality = 'low' | 'medium' | 'high' | 'auto'
type ImageResponseFormat = 'url' | 'b64_json'
type ImageOutputFormat = 'png' | 'jpeg'
type ImageBackground = 'opaque'
type ImageModeration = 'auto' | 'low'

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '')
}

function pickAllowed<T extends string>(value: string | undefined, allowed: readonly T[], fallback: T): T {
  return allowed.includes(value as T) ? (value as T) : fallback
}

export interface ImageGenerationConfig {
  apiKey: string
  background: ImageBackground
  baseUrl: string
  model: string
  moderation: ImageModeration
  outputFormat: ImageOutputFormat
  quality: ImageQuality
  responseFormat: ImageResponseFormat
  size: string
}

export function getImageGenerationConfig(): ImageGenerationConfig {
  const baseUrl = import.meta.env.VITE_PACKYCODE_BASE_URL || DEFAULT_PACKYCODE_BASE_URL

  return {
    apiKey: import.meta.env.VITE_PACKYCODE_API_KEY || '',
    background: pickAllowed(
      import.meta.env.VITE_IMAGE_BACKGROUND,
      ['opaque'] as const,
      DEFAULT_IMAGE_BACKGROUND,
    ),
    baseUrl: trimTrailingSlash(baseUrl),
    model: import.meta.env.VITE_IMAGE_MODEL || DEFAULT_IMAGE_MODEL,
    moderation: pickAllowed(
      import.meta.env.VITE_IMAGE_MODERATION,
      ['auto', 'low'] as const,
      DEFAULT_IMAGE_MODERATION,
    ),
    outputFormat: pickAllowed(
      import.meta.env.VITE_IMAGE_OUTPUT_FORMAT,
      ['png', 'jpeg'] as const,
      DEFAULT_IMAGE_OUTPUT_FORMAT,
    ),
    quality: pickAllowed(
      import.meta.env.VITE_IMAGE_QUALITY,
      ['low', 'medium', 'high', 'auto'] as const,
      DEFAULT_IMAGE_QUALITY,
    ),
    responseFormat: pickAllowed(
      import.meta.env.VITE_IMAGE_RESPONSE_FORMAT,
      ['url', 'b64_json'] as const,
      DEFAULT_IMAGE_RESPONSE_FORMAT,
    ),
    size: import.meta.env.VITE_IMAGE_SIZE || DEFAULT_IMAGE_SIZE,
  }
}

export function getImageGenerationEndpoint(config: ImageGenerationConfig): string {
  return `${config.baseUrl}/images/generations`
}
