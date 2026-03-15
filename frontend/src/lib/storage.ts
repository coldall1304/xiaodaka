// 存储工具函数

const STORAGE_PREFIX = 'xiaodaka_'

/**
 * 本地存储封装
 */
export const storage = {
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key)
      return item ? JSON.parse(item) : defaultValue ?? null
    } catch {
      return defaultValue ?? null
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value))
    } catch (e) {
      console.error('Storage set error:', e)
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key)
    } catch (e) {
      console.error('Storage remove error:', e)
    }
  },

  clear(): void {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(key)
        }
      })
    } catch (e) {
      console.error('Storage clear error:', e)
    }
  },
}

/**
 * Session 存储封装
 */
export const sessionStorage_ = {
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = sessionStorage.getItem(STORAGE_PREFIX + key)
      return item ? JSON.parse(item) : defaultValue ?? null
    } catch {
      return defaultValue ?? null
    }
  },

  set<T>(key: string, value: T): void {
    try {
      sessionStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value))
    } catch (e) {
      console.error('Session storage set error:', e)
    }
  },

  remove(key: string): void {
    try {
      sessionStorage.removeItem(STORAGE_PREFIX + key)
    } catch (e) {
      console.error('Session storage remove error:', e)
    }
  },
}

// 缓存键
export const CACHE_KEYS = {
  USER: 'user',
  PLANS: 'plans',
  STATS: 'stats',
  SETTINGS: 'settings',
  LAST_SYNC: 'last_sync',
} as const