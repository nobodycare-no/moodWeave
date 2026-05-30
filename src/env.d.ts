/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PACKYCODE_API_KEY?: string
  readonly VITE_PACKYCODE_BASE_URL?: string
  readonly VITE_IMAGE_MODEL?: string
  readonly VITE_IMAGE_SIZE?: string
  readonly VITE_IMAGE_QUALITY?: string
  readonly VITE_IMAGE_RESPONSE_FORMAT?: string
  readonly VITE_IMAGE_OUTPUT_FORMAT?: string
  readonly VITE_IMAGE_BACKGROUND?: string
  readonly VITE_IMAGE_MODERATION?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
