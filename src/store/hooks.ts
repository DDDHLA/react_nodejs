import { useEffect } from 'react';
import { useUserStore, useAppStore, useGameStore, useDataStore, useThemeStore } from './index';

// 用户相关hooks
export const useAuth = () => {
  const { isAuthenticated, userInfo, login, logout } = useUserStore();
  return { isAuthenticated, userInfo, login, logout };
};

export const useUserPermissions = () => {
  const { hasPermission, isAdmin } = useUserStore();
  return { hasPermission, isAdmin };
};

// 应用状态相关hooks
export const useLayout = () => {
  const {
    sidebarCollapsed,
    sidebarWidth,
    headerVisible,
    footerVisible,
    toggleSidebar,
    setSidebarCollapsed,
    setSidebarWidth,
    setHeaderVisible,
    setFooterVisible,
  } = useAppStore();

  return {
    sidebarCollapsed,
    sidebarWidth,
    headerVisible,
    footerVisible,
    toggleSidebar,
    setSidebarCollapsed,
    setSidebarWidth,
    setHeaderVisible,
    setFooterVisible,
  };
};

export const useTabs = () => {
  const {
    tabs,
    activeTabKey,
    addTab,
    removeTab,
    setActiveTab,
    clearTabs,
    refreshTab,
  } = useAppStore();

  return {
    tabs,
    activeTabKey,
    addTab,
    removeTab,
    setActiveTab,
    clearTabs,
    refreshTab,
  };
};

export const useNotifications = () => {
  const {
    notifications,
    unreadCount,
    addNotification,
    removeNotification,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
  } = useAppStore();

  return {
    notifications,
    unreadCount,
    addNotification,
    removeNotification,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
  };
};

export const useGlobalLoading = () => {
  const { globalLoading, loadingText, setGlobalLoading } = useAppStore();
  return { globalLoading, loadingText, setGlobalLoading };
};

// 游戏相关hooks
export const useCurrentGame = () => {
  const {
    currentGame,
    startGame,
    pauseGame,
    resumeGame,
    endGame,
    resetGame,
    updateScore,
    updateLevel,
    updateMoves,
    incrementMoves,
  } = useGameStore();

  return {
    currentGame,
    startGame,
    pauseGame,
    resumeGame,
    endGame,
    resetGame,
    updateScore,
    updateLevel,
    updateMoves,
    incrementMoves,
  };
};

export const useGameRecords = () => {
  const {
    gameRecords,
    addGameRecord,
    clearGameRecords,
    getGameRecords,
  } = useGameStore();

  return {
    gameRecords,
    addGameRecord,
    clearGameRecords,
    getGameRecords,
  };
};

export const useGameStats = () => {
  const {
    gameStats,
    updateGameStats,
    getGameStats,
  } = useGameStore();

  return {
    gameStats,
    updateGameStats,
    getGameStats,
  };
};

export const useGameSettings = () => {
  const {
    gameSettings,
    updateGameSettings,
  } = useGameStore();

  return {
    gameSettings,
    updateGameSettings,
  };
};

// 数据管理相关hooks
export const useApiState = (key: string) => {
  const {
    setApiLoading,
    setApiError,
    setApiSuccess,
    getApiState,
    clearApiState,
  } = useDataStore();

  const apiState = getApiState(key);

  return {
    ...apiState,
    setLoading: (loading: boolean) => setApiLoading(key, loading),
    setError: (error: string | null) => setApiError(key, error),
    setSuccess: () => setApiSuccess(key),
    clear: () => clearApiState(key),
  };
};

export const useCache = <T = unknown>(key: string) => {
  const {
    setCache,
    getCache,
    clearCache,
    isCacheValid,
    getCacheInfo,
  } = useDataStore();

  return {
    data: getCache<T>(key),
    setData: (data: T, expiry?: number) => setCache(key, data, expiry),
    clear: () => clearCache(key),
    isValid: isCacheValid(key),
    info: getCacheInfo(key),
  };
};

export const useOfflineData = (key: string) => {
  const {
    setOfflineData,
    getOfflineData,
    clearOfflineData,
  } = useDataStore();

  return {
    data: getOfflineData(key),
    setData: (data: unknown) => setOfflineData(key, data),
    clear: () => clearOfflineData(key),
  };
};

export const useNetworkStatus = () => {
  const { isOnline, setOnlineStatus } = useDataStore();
  
  useEffect(() => {
    const handleOnline = () => setOnlineStatus(true);
    const handleOffline = () => setOnlineStatus(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnlineStatus]);

  return { isOnline };
};

// 主题相关hooks
export const useTheme = () => {
  const {
    themeConfig,
    setThemeMode,
    setPrimaryColor,
    setBorderRadius,
    setCompactSize,
    resetTheme,
    updateThemeConfig,
  } = useThemeStore();

  return {
    themeConfig,
    setThemeMode,
    setPrimaryColor,
    setBorderRadius,
    setCompactSize,
    resetTheme,
    updateThemeConfig,
  };
};

// 组合hooks
export const useAppState = () => {
  const auth = useAuth();
  const layout = useLayout();
  const tabs = useTabs();
  const notifications = useNotifications();
  const loading = useGlobalLoading();
  const theme = useTheme();
  const networkStatus = useNetworkStatus();

  return {
    auth,
    layout,
    tabs,
    notifications,
    loading,
    theme,
    networkStatus,
  };
};
