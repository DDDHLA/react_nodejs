import React, { createContext, useContext, useState, useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';
import './index.less';

// 季节主题类型
export type SeasonType = 'spring' | 'summer' | 'autumn' | 'winter';

// 季节主题配置
export const seasonalThemes = {
  spring: {
    name: '朝霓',
    icon: '🌸',
    colors: {
      primary: '#52c41a',
      secondary: '#f6ffed',
      accent: '#ff85c0',
      background: 'linear-gradient(135deg, #e8f5e8 0%, #f0fff0 50%, #fff0f5 100%)',
      cardBg: 'rgba(255, 255, 255, 0.9)',
      textPrimary: '#135200',
      textSecondary: '#52c41a'
    },
    particles: {
      type: 'sakura',
      color: '#ff85c0',
      count: 15
    }
  },
  summer: {
    name: '烈阳',
    icon: '☀️',
    colors: {
      primary: '#1890ff',
      secondary: '#e6f7ff',
      accent: '#fadb14',
      background: 'linear-gradient(135deg, #87ceeb 0%, #87cefa 50%, #b0e0e6 100%)',
      cardBg: 'rgba(255, 255, 255, 0.85)',
      textPrimary: '#003a8c',
      textSecondary: '#1890ff'
    },
    particles: {
      type: 'sunshine',
      color: '#fadb14',
      count: 20
    }
  },
  autumn: {
    name: '落霓',
    icon: '🍂',
    colors: {
      primary: '#fa8c16',
      secondary: '#fff7e6',
      accent: '#d4380d',
      background: 'linear-gradient(135deg, #ffd59a 0%, #ffe7ba 50%, #fff2e8 100%)',
      cardBg: 'rgba(255, 255, 255, 0.9)',
      textPrimary: '#ad4e00',
      textSecondary: '#fa8c16'
    },
    particles: {
      type: 'leaves',
      color: '#fa8c16',
      count: 12
    }
  },
  winter: {
    name: '星辰',
    icon: '❄️',
    colors: {
      primary: '#722ed1',
      secondary: '#f9f0ff',
      accent: '#13c2c2',
      background: 'linear-gradient(135deg, #e6f7ff 0%, #f0f5ff 50%, #f9f0ff 100%)',
      cardBg: 'rgba(255, 255, 255, 0.95)',
      textPrimary: '#391085',
      textSecondary: '#722ed1'
    },
    particles: {
      type: 'snow',
      color: '#ffffff',
      count: 25
    }
  }
};

// 季节主题上下文
interface SeasonalThemeContextType {
  currentSeason: SeasonType;
  setSeason: (season: SeasonType) => void;
  themeConfig: typeof seasonalThemes[SeasonType];
}

const SeasonalThemeContext = createContext<SeasonalThemeContextType | undefined>(undefined);

// 季节主题提供者
export const SeasonalThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSeason, setCurrentSeason] = useState<SeasonType>(() => {
    // 从localStorage获取保存的主题，或根据当前月份自动选择
    const saved = localStorage.getItem('seasonal-theme') as SeasonType;
    if (saved && seasonalThemes[saved]) {
      return saved;
    }
    
    // 根据当前月份自动选择季节
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'autumn';
    return 'winter';
  });

  const setSeason = (season: SeasonType) => {
    setCurrentSeason(season);
    localStorage.setItem('seasonal-theme', season);
  };

  const themeConfig = seasonalThemes[currentSeason];

  // 应用CSS变量
  useEffect(() => {
    const root = document.documentElement;
    const colors = themeConfig.colors;
    
    root.style.setProperty('--seasonal-primary', colors.primary);
    root.style.setProperty('--seasonal-secondary', colors.secondary);
    root.style.setProperty('--seasonal-accent', colors.accent);
    root.style.setProperty('--seasonal-background', colors.background);
    root.style.setProperty('--seasonal-card-bg', colors.cardBg);
    root.style.setProperty('--seasonal-text-primary', colors.textPrimary);
    root.style.setProperty('--seasonal-text-secondary', colors.textSecondary);
    
    // 添加季节类名到body
    document.body.className = document.body.className.replace(/season-\w+/g, '');
    document.body.classList.add(`season-${currentSeason}`);
  }, [currentSeason, themeConfig]);

  // Ant Design主题配置
  const antdTheme = {
    token: {
      colorPrimary: themeConfig.colors.primary,
      colorSuccess: themeConfig.colors.primary,
      colorInfo: themeConfig.colors.primary,
      borderRadius: 8,
    },
    algorithm: theme.defaultAlgorithm,
  };

  return (
    <SeasonalThemeContext.Provider value={{ currentSeason, setSeason, themeConfig }}>
      <ConfigProvider theme={antdTheme}>
        <div className={`seasonal-theme season-${currentSeason}`}>
          {children}
        </div>
      </ConfigProvider>
    </SeasonalThemeContext.Provider>
  );
};

// 使用季节主题的Hook
export const useSeasonalTheme = () => {
  const context = useContext(SeasonalThemeContext);
  if (!context) {
    throw new Error('useSeasonalTheme must be used within SeasonalThemeProvider');
  }
  return context;
};
