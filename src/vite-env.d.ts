/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_DESCRIPTION: string;
  readonly VITE_DEV_MODE: string;
  readonly VITE_SHOW_DEBUG_INFO: string;
  readonly VITE_GOOGLE_AI_API_KEY: string;
  readonly VITE_GOOGLE_AI_PROJECT_ID: string;
  readonly VITE_GOOGLE_ANALYTICS_ID: string;
  readonly VITE_HOTJAR_ID: string;
  readonly VITE_ENABLE_REAL_TIME_VALIDATION: string;
  readonly VITE_ENABLE_WORD_COUNT: string;
  readonly VITE_ENABLE_AUTO_SAVE: string;
  readonly VITE_ENABLE_OFFLINE_MODE: string;
  readonly VITE_DEFAULT_THEME: string;
  readonly VITE_BRAND_COLOR: string;
  readonly VITE_MAX_ESSAY_LENGTH: string;
  readonly VITE_MIN_ESSAY_LENGTH: string;
  readonly VITE_AUTO_SAVE_INTERVAL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

