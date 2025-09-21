import { theme } from 'antd';

// 主题模式枚举
export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  CUSTOM = 'custom'
}

// 预设主题色
export const PRESET_COLORS = [
  { name: '拂晓蓝', value: '#1890ff' },
  { name: '薄暮红', value: '#f5222d' },
  { name: '火山橘', value: '#fa541c' },
  { name: '日暮黄', value: '#faad14' },
  { name: '极光绿', value: '#52c41a' },
  { name: '明青', value: '#13c2c2' },
  { name: '极客蓝', value: '#2f54eb' },
  { name: '酱紫', value: '#722ed1' },
  { name: '法式洋红', value: '#eb2f96' },
  { name: '中性灰', value: '#666666' },
];

// 主题配置接口
export interface ThemeConfig {
  mode: ThemeMode;
  primaryColor: string;
  borderRadius: number;
  compactSize: boolean;
}

// 默认主题配置
export const DEFAULT_THEME: ThemeConfig = {
  mode: ThemeMode.LIGHT,
  primaryColor: '#1890ff',
  borderRadius: 6,
  compactSize: false,
};

// 生成Antd主题配置
export const generateAntdTheme = (config: ThemeConfig) => {
  const { mode, primaryColor, borderRadius, compactSize } = config;
  
  return {
    algorithm: mode === ThemeMode.DARK 
      ? [theme.darkAlgorithm, compactSize ? theme.compactAlgorithm : undefined].filter(Boolean)
      : [compactSize ? theme.compactAlgorithm : undefined].filter(Boolean),
    token: {
      colorPrimary: primaryColor,
      borderRadius: borderRadius,
      // 自定义其他token
      colorBgContainer: mode === ThemeMode.DARK ? '#141414' : '#ffffff',
      colorBgElevated: mode === ThemeMode.DARK ? '#1f1f1f' : '#ffffff',
      colorBgLayout: mode === ThemeMode.DARK ? '#000000' : '#f5f5f5',
    },
    components: {
      Layout: {
        headerBg: mode === ThemeMode.DARK ? '#001529' : '#ffffff',
        siderBg: mode === ThemeMode.DARK ? '#001529' : '#ffffff',
      },
      Menu: {
        darkItemBg: mode === ThemeMode.DARK ? '#001529' : undefined,
      },
    },
  };
};
