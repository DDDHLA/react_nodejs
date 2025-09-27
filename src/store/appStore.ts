import { create } from "zustand";
import { persist } from "zustand/middleware";

// 标签页接口
export interface TabItem {
  key: string;
  title: string;
  path: string;
  icon?: string;
  closable?: boolean;
  cached?: boolean;
}

// 通知接口
export interface NotificationItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// 应用状态接口
interface AppStore {
  // 布局状态
  sidebarCollapsed: boolean;
  sidebarWidth: number;
  headerVisible: boolean;
  footerVisible: boolean;
  
  // 标签页状态
  tabs: TabItem[];
  activeTabKey: string;
  
  // 全局加载状态
  globalLoading: boolean;
  loadingText: string;
  
  // 通知系统
  notifications: NotificationItem[];
  unreadCount: number;
  
  // 全屏状态
  isFullscreen: boolean;
  
  // 搜索状态
  searchVisible: boolean;
  searchHistory: string[];
  
  // 操作方法 - 布局
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSidebarWidth: (width: number) => void;
  setHeaderVisible: (visible: boolean) => void;
  setFooterVisible: (visible: boolean) => void;
  
  // 操作方法 - 标签页
  addTab: (tab: TabItem) => void;
  removeTab: (key: string) => void;
  setActiveTab: (key: string) => void;
  clearTabs: () => void;
  refreshTab: (key: string) => void;
  
  // 操作方法 - 加载状态
  setGlobalLoading: (loading: boolean, text?: string) => void;
  
  // 操作方法 - 通知
  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  removeNotification: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  
  // 操作方法 - 全屏
  toggleFullscreen: () => void;
  setFullscreen: (fullscreen: boolean) => void;
  
  // 操作方法 - 搜索
  toggleSearch: () => void;
  setSearchVisible: (visible: boolean) => void;
  addSearchHistory: (keyword: string) => void;
  clearSearchHistory: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // 初始状态 - 布局
      sidebarCollapsed: false,
      sidebarWidth: 240,
      headerVisible: true,
      footerVisible: true,
      
      // 初始状态 - 标签页
      tabs: [
        {
          key: '/home',
          title: '首页',
          path: '/home',
          icon: 'home',
          closable: false,
          cached: true,
        }
      ],
      activeTabKey: '/home',
      
      // 初始状态 - 加载
      globalLoading: false,
      loadingText: '加载中...',
      
      // 初始状态 - 通知
      notifications: [],
      unreadCount: 0,
      
      // 初始状态 - 全屏
      isFullscreen: false,
      
      // 初始状态 - 搜索
      searchVisible: false,
      searchHistory: [],

      // 布局操作
      toggleSidebar: () => {
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },

      setSidebarCollapsed: (collapsed: boolean) => {
        set({ sidebarCollapsed: collapsed });
      },

      setSidebarWidth: (width: number) => {
        set({ sidebarWidth: Math.max(200, Math.min(400, width)) });
      },

      setHeaderVisible: (visible: boolean) => {
        set({ headerVisible: visible });
      },

      setFooterVisible: (visible: boolean) => {
        set({ footerVisible: visible });
      },

      // 标签页操作
      addTab: (tab: TabItem) => {
        const { tabs } = get();
        const existingTab = tabs.find(t => t.key === tab.key);
        
        if (!existingTab) {
          set((state) => ({
            tabs: [...state.tabs, { ...tab, cached: true }],
            activeTabKey: tab.key,
          }));
        } else {
          set({ activeTabKey: tab.key });
        }
      },

      removeTab: (key: string) => {
        const { tabs, activeTabKey } = get();
        const newTabs = tabs.filter(tab => tab.key !== key);
        
        let newActiveKey = activeTabKey;
        if (activeTabKey === key && newTabs.length > 0) {
          const index = tabs.findIndex(tab => tab.key === key);
          newActiveKey = newTabs[Math.max(0, index - 1)]?.key || newTabs[0].key;
        }
        
        set({
          tabs: newTabs,
          activeTabKey: newActiveKey,
        });
      },

      setActiveTab: (key: string) => {
        set({ activeTabKey: key });
      },

      clearTabs: () => {
        set({
          tabs: [
            {
              key: '/home',
              title: '首页',
              path: '/home',
              icon: 'home',
              closable: false,
              cached: true,
            }
          ],
          activeTabKey: '/home',
        });
      },

      refreshTab: (key: string) => {
        set((state) => ({
          tabs: state.tabs.map(tab => 
            tab.key === key ? { ...tab, cached: false } : tab
          )
        }));
        
        // 重新设置缓存
        setTimeout(() => {
          set((state) => ({
            tabs: state.tabs.map(tab => 
              tab.key === key ? { ...tab, cached: true } : tab
            )
          }));
        }, 100);
      },

      // 加载状态操作
      setGlobalLoading: (loading: boolean, text = '加载中...') => {
        set({ globalLoading: loading, loadingText: text });
      },

      // 通知操作
      addNotification: (notification) => {
        const id = Date.now().toString();
        const newNotification: NotificationItem = {
          ...notification,
          id,
          timestamp: Date.now(),
          read: false,
        };
        
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }));
      },

      removeNotification: (id: string) => {
        set((state) => {
          const notification = state.notifications.find(n => n.id === id);
          return {
            notifications: state.notifications.filter(n => n.id !== id),
            unreadCount: notification && !notification.read 
              ? state.unreadCount - 1 
              : state.unreadCount,
          };
        });
      },

      markNotificationRead: (id: string) => {
        set((state) => {
          const notification = state.notifications.find(n => n.id === id);
          if (notification && !notification.read) {
            return {
              notifications: state.notifications.map(n => 
                n.id === id ? { ...n, read: true } : n
              ),
              unreadCount: state.unreadCount - 1,
            };
          }
          return state;
        });
      },

      markAllNotificationsRead: () => {
        set((state) => ({
          notifications: state.notifications.map(n => ({ ...n, read: true })),
          unreadCount: 0,
        }));
      },

      clearNotifications: () => {
        set({ notifications: [], unreadCount: 0 });
      },

      // 全屏操作
      toggleFullscreen: () => {
        set((state) => ({ isFullscreen: !state.isFullscreen }));
      },

      setFullscreen: (fullscreen: boolean) => {
        set({ isFullscreen: fullscreen });
      },

      // 搜索操作
      toggleSearch: () => {
        set((state) => ({ searchVisible: !state.searchVisible }));
      },

      setSearchVisible: (visible: boolean) => {
        set({ searchVisible: visible });
      },

      addSearchHistory: (keyword: string) => {
        if (!keyword.trim()) return;
        
        set((state) => {
          const newHistory = [keyword, ...state.searchHistory.filter(h => h !== keyword)];
          return {
            searchHistory: newHistory.slice(0, 10), // 最多保存10条
          };
        });
      },

      clearSearchHistory: () => {
        set({ searchHistory: [] });
      },
    }),
    {
      name: "app-storage",
      version: 1,
      // 只持久化必要的字段
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        sidebarWidth: state.sidebarWidth,
        headerVisible: state.headerVisible,
        footerVisible: state.footerVisible,
        tabs: state.tabs,
        activeTabKey: state.activeTabKey,
        searchHistory: state.searchHistory,
      }),
    }
  )
);
