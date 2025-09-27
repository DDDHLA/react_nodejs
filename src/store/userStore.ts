import { create } from "zustand";
import { persist } from "zustand/middleware";

// 用户信息接口
export interface UserInfo {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  nickname?: string;
  role: 'admin' | 'user' | 'guest';
  preferences: {
    language: 'zh' | 'en';
    notifications: boolean;
    autoSave: boolean;
  };
  createdAt: string;
  lastLoginAt: string;
}

// 用户状态接口
interface UserStore {
  // 状态
  isAuthenticated: boolean;
  userInfo: UserInfo | null;
  token: string | null;
  loginLoading: boolean;
  
  // 操作方法
  login: (userInfo: UserInfo, token: string) => void;
  logout: () => void;
  updateUserInfo: (updates: Partial<UserInfo>) => void;
  updatePreferences: (preferences: Partial<UserInfo['preferences']>) => void;
  setLoginLoading: (loading: boolean) => void;
  
  // 权限检查
  hasPermission: (permission: string) => boolean;
  isAdmin: () => boolean;
}

// 默认用户偏好设置
const DEFAULT_PREFERENCES: UserInfo['preferences'] = {
  language: 'zh',
  notifications: true,
  autoSave: true,
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      isAuthenticated: false,
      userInfo: null,
      token: null,
      loginLoading: false,

      // 登录
      login: (userInfo: UserInfo, token: string) => {
        set({
          isAuthenticated: true,
          userInfo: {
            ...userInfo,
            preferences: { ...DEFAULT_PREFERENCES, ...userInfo.preferences }
          },
          token,
          loginLoading: false,
        });
      },

      // 登出
      logout: () => {
        set({
          isAuthenticated: false,
          userInfo: null,
          token: null,
          loginLoading: false,
        });
      },

      // 更新用户信息
      updateUserInfo: (updates: Partial<UserInfo>) => {
        const { userInfo } = get();
        if (userInfo) {
          set({
            userInfo: { ...userInfo, ...updates }
          });
        }
      },

      // 更新用户偏好设置
      updatePreferences: (preferences: Partial<UserInfo['preferences']>) => {
        const { userInfo } = get();
        if (userInfo) {
          set({
            userInfo: {
              ...userInfo,
              preferences: { ...userInfo.preferences, ...preferences }
            }
          });
        }
      },

      // 设置登录加载状态
      setLoginLoading: (loading: boolean) => {
        set({ loginLoading: loading });
      },

      // 权限检查
      hasPermission: (permission: string) => {
        const { userInfo } = get();
        if (!userInfo) return false;
        
        // 管理员拥有所有权限
        if (userInfo.role === 'admin') return true;
        
        // 这里可以根据具体需求实现权限逻辑
        const permissions = {
          'user': ['read', 'write'],
          'guest': ['read']
        };
        
        return permissions[userInfo.role]?.includes(permission) || false;
      },

      // 检查是否为管理员
      isAdmin: () => {
        const { userInfo } = get();
        return userInfo?.role === 'admin' || false;
      },
    }),
    {
      name: "user-storage",
      version: 1,
      // 只持久化必要的字段
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        userInfo: state.userInfo,
        token: state.token,
      }),
    }
  )
);
