import { create } from "zustand";
import { persist } from "zustand/middleware";

// API请求状态
export interface ApiState {
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

// 缓存项接口
 
export interface CacheItem<T = any> {
  data: T;
  timestamp: number;
  expiry: number; // 过期时间（毫秒）
}

// 数据状态接口
interface DataStore {
  // API状态管理
  apiStates: Record<string, ApiState>;
  
  // 数据缓存
  cache: Record<string, CacheItem>;
  
  // 离线数据
   
  offlineData: Record<string, any>;
  
  // 网络状态
  isOnline: boolean;
  
  // 操作方法 - API状态
  setApiLoading: (key: string, loading: boolean) => void;
  setApiError: (key: string, error: string | null) => void;
  setApiSuccess: (key: string) => void;
  getApiState: (key: string) => ApiState;
  clearApiState: (key: string) => void;
  
  // 操作方法 - 缓存
  setCache: <T>(key: string, data: T, expiry?: number) => void;
  getCache: <T>(key: string) => T | null;
  clearCache: (key?: string) => void;
  isCacheValid: (key: string) => boolean;
  getCacheInfo: (key: string) => { exists: boolean; expired: boolean; age: number } | null;
  
  // 操作方法 - 离线数据
   
  setOfflineData: (key: string, data: any) => void;
   
  getOfflineData: (key: string) => any;
  clearOfflineData: (key?: string) => void;
  
  // 操作方法 - 网络状态
  setOnlineStatus: (online: boolean) => void;
  
  // 工具方法
  clearExpiredCache: () => void;
  getCacheSize: () => number;
  getApiStatesCount: () => number;
}

// 默认API状态
const createDefaultApiState = (): ApiState => ({
  loading: false,
  error: null,
  lastUpdated: null,
});

// 默认缓存过期时间（5分钟）
const DEFAULT_CACHE_EXPIRY = 5 * 60 * 1000;

export const useDataStore = create<DataStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      apiStates: {},
      cache: {},
      offlineData: {},
      isOnline: navigator.onLine,

      // API状态管理
      setApiLoading: (key: string, loading: boolean) => {
        set((state) => ({
          apiStates: {
            ...state.apiStates,
            [key]: {
              ...state.apiStates[key],
              loading,
              error: loading ? null : state.apiStates[key]?.error || null,
            },
          },
        }));
      },

      setApiError: (key: string, error: string | null) => {
        set((state) => ({
          apiStates: {
            ...state.apiStates,
            [key]: {
              ...state.apiStates[key],
              loading: false,
              error,
              lastUpdated: error ? null : state.apiStates[key]?.lastUpdated || null,
            },
          },
        }));
      },

      setApiSuccess: (key: string) => {
        set((state) => ({
          apiStates: {
            ...state.apiStates,
            [key]: {
              loading: false,
              error: null,
              lastUpdated: Date.now(),
            },
          },
        }));
      },

      getApiState: (key: string) => {
        const { apiStates } = get();
        return apiStates[key] || createDefaultApiState();
      },

      clearApiState: (key: string) => {
        set((state) => {
          const newApiStates = { ...state.apiStates };
          delete newApiStates[key];
          return { apiStates: newApiStates };
        });
      },

      // 缓存管理
      setCache: <T>(key: string, data: T, expiry = DEFAULT_CACHE_EXPIRY) => {
        const cacheItem: CacheItem<T> = {
          data,
          timestamp: Date.now(),
          expiry: Date.now() + expiry,
        };
        
        set((state) => ({
          cache: {
            ...state.cache,
            [key]: cacheItem,
          },
        }));
      },

      getCache: <T>(key: string): T | null => {
        const { cache } = get();
        const item = cache[key];
        
        if (!item) return null;
        
        // 检查是否过期
        if (Date.now() > item.expiry) {
          // 删除过期缓存
          get().clearCache(key);
          return null;
        }
        
        return item.data as T;
      },

      clearCache: (key?: string) => {
        if (key) {
          set((state) => {
            const newCache = { ...state.cache };
            delete newCache[key];
            return { cache: newCache };
          });
        } else {
          set({ cache: {} });
        }
      },

      isCacheValid: (key: string) => {
        const { cache } = get();
        const item = cache[key];
        return item ? Date.now() <= item.expiry : false;
      },

      getCacheInfo: (key: string) => {
        const { cache } = get();
        const item = cache[key];
        
        if (!item) return null;
        
        const now = Date.now();
        return {
          exists: true,
          expired: now > item.expiry,
          age: now - item.timestamp,
        };
      },

      // 离线数据管理
       
      setOfflineData: (key: string, data: any) => {
        set((state) => ({
          offlineData: {
            ...state.offlineData,
            [key]: data,
          },
        }));
      },

      getOfflineData: (key: string) => {
        const { offlineData } = get();
        return offlineData[key] || null;
      },

      clearOfflineData: (key?: string) => {
        if (key) {
          set((state) => {
            const newOfflineData = { ...state.offlineData };
            delete newOfflineData[key];
            return { offlineData: newOfflineData };
          });
        } else {
          set({ offlineData: {} });
        }
      },

      // 网络状态
      setOnlineStatus: (online: boolean) => {
        set({ isOnline: online });
      },

      // 工具方法
      clearExpiredCache: () => {
        const { cache } = get();
        const now = Date.now();
        const validCache: Record<string, CacheItem> = {};
        
        Object.entries(cache).forEach(([key, item]) => {
          if (now <= item.expiry) {
            validCache[key] = item;
          }
        });
        
        set({ cache: validCache });
      },

      getCacheSize: () => {
        const { cache } = get();
        return Object.keys(cache).length;
      },

      getApiStatesCount: () => {
        const { apiStates } = get();
        return Object.keys(apiStates).length;
      },
    }),
    {
      name: "data-storage",
      version: 1,
      // 只持久化缓存和离线数据，不持久化API状态
      partialize: (state) => ({
        cache: state.cache,
        offlineData: state.offlineData,
      }),
    }
  )
);

// 监听网络状态变化
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    useDataStore.getState().setOnlineStatus(true);
  });
  
  window.addEventListener('offline', () => {
    useDataStore.getState().setOnlineStatus(false);
  });
  
  // 定期清理过期缓存（每10分钟）
  setInterval(() => {
    useDataStore.getState().clearExpiredCache();
  }, 10 * 60 * 1000);
}
