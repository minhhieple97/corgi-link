export const ROLE_TYPE = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

export type UserRole = (typeof ROLE_TYPE)[keyof typeof ROLE_TYPE];

export const URL_SAFETY = {
  CATEGORIES: {
    MALICIOUS: 'malicious',
    SUSPICIOUS: 'suspicious',
    SAFE: 'safe',
    INAPPROPRIATE: 'inappropriate',
    UNKNOWN: 'unknown',
  },
  CONFIDENCE_THRESHOLD: 0.7,
  SHORT_CODE_LENGTH: 6,
} as const;

export const URL_PROTOCOLS = {
  HTTP: 'http://',
  HTTPS: 'https://',
} as const;

export const UI_CONSTANTS = {
  TOAST_MESSAGES: {
    URL_ERROR_PREFIX: 'URL Error: ',
    CUSTOM_CODE_ERROR_PREFIX: 'Custom Code Error: ',
    VALIDATION_FALLBACK: 'Please check your input and try again',
    SHORT_URL_SUCCESS_PREFIX: 'Short URL created: ',
    COPY_SUCCESS: 'Copied to clipboard!',
    URL_UPDATED_SUCCESS: 'URL updated successfully',
    URL_UPDATED_DESCRIPTION: 'The short code has been updated',
    COPY_DESCRIPTION: 'The short URL has been copied to your clipboard',
    COPY_ERROR: 'Failed to copy to clipboard',
    COPY_ERROR_DESCRIPTION: 'Please try again or copy manually',
  },
  FORM_PLACEHOLDERS: {
    URL_INPUT: 'Paste your long URL here',
    CUSTOM_CODE: 'Custom code (optional)',
  },
  BUTTON_LABELS: {
    SHORTENING: 'Shortening...',
    SHORTEN: 'Shorten',
    COPY: 'Copy',
    CREATE_ANOTHER: 'Create another',
  },
  URL_PREFIX_SEPARATOR: '/r/',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MIN_PAGE: 1,
} as const;

export const URL_DISPLAY = {
  ORIGINAL_URL_MAX_LENGTH: 50,
  SHORT_URL_MAX_LENGTH: 35,
} as const;

export const OPENAI_CONFIG = {
  MODEL: 'gpt-4o-mini',
  TEMPERATURE: 0.1,
  RESPONSE_FORMAT: { type: 'json_object' as const },
  BASE_URL: 'https://multiappai-api.itmovnteam.com/v1',
} as const;

export const ADMIN_TABLE = {
  PAGINATION: {
    DEFAULT_LIMIT: 10,
  },
  ACTIONS: {
    PROMOTE: 'Promote',
    DEMOTE: 'Demote',
  },
  MESSAGES: {
    SUCCESS: 'User role updated successfully',
    ERROR: 'Failed to update user role',
    DEFAULT_ERROR: 'An error occurred',
    NO_USERS_SEARCH: 'No users found with the given search criteria',
    NO_USERS: 'No users found',
  },
  ID_DISPLAY_LENGTH: 8,
} as const;

export const CACHE_TTL = {
  URL_MAPPING: 60 * 60 * 24,
  SHORT_CODE_EXISTENCE: 60 * 60,
  RATE_LIMIT: 60 * 15,
  URL_REDIS_EXPIRY: 60 * 60 * 24 * 30, // 30 days
} as const;

export const SHORT_CODE = {
  ALPHABET: '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz',
  LENGTH: 7,
  MAX_RETRIES: 5,
  REDIS_SET_KEY: 'used_short_codes',
} as const;

export const RATE_LIMIT = {
  DEFAULT_MAX_REQUESTS: 100,
  DEFAULT_WINDOW_MS: 60 * 1000, // 1 minute
} as const;

export const QSTASH_QUEUE = {
  NAME: 'corgi-link-queue',
  ENDPOINTS: {
    CLICK_INCREMENT: '/api/queue/click',
  },
  ACTIONS: {
    INCREMENT_CLICK: 'increment_click',
  },
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY_MS: 1000,
  },
} as const;

export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
  UNAUTHORIZED: 401,
} as const;

export const RESPONSE_MESSAGES = {
  QUEUE: {
    INVALID_ACTION: 'Invalid action',
    MISSING_SHORT_CODE: 'Missing shortCode',
    CLICK_UPDATE_SUCCESS: 'Click count updated for',
    PROCESSING_ERROR: 'Failed to process queue item',
    URL_NOT_FOUND: 'URL not found for shortCode:',
  },
  ERRORS: {
    QUEUE_FAILED: 'Failed to queue click increment:',
    DIRECT_UPDATE_FAILED: 'Failed to increment clicks directly:',
  },
} as const;

export const CONTENT_TYPES = {
  JSON: 'application/json',
} as const;

export const ALIAS_GENERATION = {
  DEFAULT_COUNT: 5,
  MAX_COUNT: 10,
  MAX_LENGTH: 12,
  MIN_LENGTH: 3,
  ALLOWED_CHARS_REGEX: /^[a-z0-9-]+$/,
  CRAWLER_TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  CACHE_TTL: 3600, // 1 hour
} as const;