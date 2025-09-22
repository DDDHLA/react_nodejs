import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ThemeConfig, ThemeMode, DEFAULT_THEME } from "@/config/theme";

interface ThemeStore {
  // 状态
  themeConfig: ThemeConfig;

  // 操作方法
  setThemeMode: (mode: ThemeMode) => void;
  // 设置主色调
  setPrimaryColor: (color: string) => void;
  // 设置圆角大小
  setBorderRadius: (radius: number) => void;
  // 设置紧凑模式
  setCompactSize: (compact: boolean) => void;
  // 重置主题
  resetTheme: () => void;
  // 批量更新主题配置
  updateThemeConfig: (config: Partial<ThemeConfig>) => void;
}
export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      // 初始状态
      themeConfig: DEFAULT_THEME,

      // 设置主题模式
      setThemeMode: (mode: ThemeMode) => {
        set((state) => ({
          themeConfig: {
            ...state.themeConfig,
            mode,
          },
        }));
      },

      // 设置主色调
      setPrimaryColor: (color: string) => {
        set((state) => ({
          themeConfig: {
            ...state.themeConfig,
            primaryColor: color,
            mode: ThemeMode.CUSTOM, // 自定义颜色时切换为自定义模式
          },
        }));
      },

      // 设置圆角大小
      setBorderRadius: (radius: number) => {
        set((state) => ({
          themeConfig: {
            ...state.themeConfig,
            borderRadius: radius,
          },
        }));
      },

      // 设置紧凑模式
      setCompactSize: (compact: boolean) => {
        set((state) => ({
          themeConfig: {
            ...state.themeConfig,
            compactSize: compact,
          },
        }));
      },

      // 重置主题
      resetTheme: () => {
        set({ themeConfig: DEFAULT_THEME });
      },

      // 批量更新主题配置
      updateThemeConfig: (config: Partial<ThemeConfig>) => {
        set((state) => ({
          themeConfig: {
            ...state.themeConfig,
            ...config,
          },
        }));
      },
    }),
    {
      name: "theme-storage", // localStorage key
      version: 1,
    }
  )
);
