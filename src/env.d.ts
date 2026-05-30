/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PACKYCODE_API_KEY?: string
  readonly VITE_PACKYCODE_BASE_URL?: string
  readonly VITE_IMAGE_MODEL?: string
  readonly VITE_IMAGE_SIZE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
