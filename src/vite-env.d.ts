/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_MODE: 'offline' | 'online'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
