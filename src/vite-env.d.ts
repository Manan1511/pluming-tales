/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STATIC_FORMS_KEY?: string
  readonly VITE_STATIC_FORMS_ACCESS_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
