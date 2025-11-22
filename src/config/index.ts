// Environment configuration for Mentor de Redação Zen

interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
  };
  app: {
    name: string;
    version: string;
    description: string;
  };
  development: {
    devMode: boolean;
    enableMockData: boolean;
    showDebugInfo: boolean;
  };
  googleAI: {
    apiKey?: string;
    projectId?: string;
  };
  analytics: {
    googleAnalyticsId?: string;
    hotjarId?: string;
  };
  features: {
    enableRealTimeValidation: boolean;
    enableWordCount: boolean;
    enableAutoSave: boolean;
    enableOfflineMode: boolean;
  };
  theme: {
    defaultTheme: string;
    brandColor: string;
  };
  validation: {
    maxEssayLength: number;
    minEssayLength: number;
    autoSaveInterval: number;
  };
}

const config: AppConfig = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  },
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Mentor de Redação Zen',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    description: import.meta.env.VITE_APP_DESCRIPTION || 'Escrita Consciente com IA',
  },
  development: {
    devMode: import.meta.env.VITE_DEV_MODE === 'true',
    enableMockData: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
    showDebugInfo: import.meta.env.VITE_SHOW_DEBUG_INFO === 'true',
  },
  googleAI: {
    apiKey: import.meta.env.VITE_GOOGLE_AI_API_KEY,
    projectId: import.meta.env.VITE_GOOGLE_AI_PROJECT_ID,
  },
  analytics: {
    googleAnalyticsId: import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
    hotjarId: import.meta.env.VITE_HOTJAR_ID,
  },
  features: {
    enableRealTimeValidation: import.meta.env.VITE_ENABLE_REAL_TIME_VALIDATION !== 'false',
    enableWordCount: import.meta.env.VITE_ENABLE_WORD_COUNT !== 'false',
    enableAutoSave: import.meta.env.VITE_ENABLE_AUTO_SAVE !== 'false',
    enableOfflineMode: import.meta.env.VITE_ENABLE_OFFLINE_MODE === 'true',
  },
  theme: {
    defaultTheme: import.meta.env.VITE_DEFAULT_THEME || 'light',
    brandColor: import.meta.env.VITE_BRAND_COLOR || '#f97316',
  },
  validation: {
    maxEssayLength: parseInt(import.meta.env.VITE_MAX_ESSAY_LENGTH || '5000'),
    minEssayLength: parseInt(import.meta.env.VITE_MIN_ESSAY_LENGTH || '150'),
    autoSaveInterval: parseInt(import.meta.env.VITE_AUTO_SAVE_INTERVAL || '30000'),
  },
};

// Development helpers
export const isDevelopment = config.development.devMode;
export const isProduction = !isDevelopment;

// Logging helper
export const logger = {
  debug: (...args: any[]) => {
    if (config.development.showDebugInfo) {
      console.log('[DEBUG]', ...args);
    }
  },
  info: (...args: any[]) => {
    console.info('[INFO]', ...args);
  },
  warn: (...args: any[]) => {
    console.warn('[WARN]', ...args);
  },
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args);
  },
};

export default config;
