import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Tabs, Spin } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { ReloadOutlined } from '@ant-design/icons';
import './index.less';

interface SimpleTabItem {
  key: string;
  label: string;
  path: string;
  closable: boolean;
  cached: boolean;
  loading: boolean;
}

interface SimpleTabsNavProps {
  routes: Array<{
    path: string;
    label?: string;
    children?: Array<{
      path: string;
      label?: string;
    }>;
  }>;
}

const SimpleTabsNav: React.FC<SimpleTabsNavProps> = ({ routes }) => {
  const [tabs, setTabs] = useState<SimpleTabItem[]>([]);
  const [activeKey, setActiveKey] = useState<string>('');
  const [cachedPaths, setCachedPaths] = useState<Set<string>>(new Set());
  const processedPaths = useRef<Set<string>>(new Set());
  const navigate = useNavigate();
  const location = useLocation();

  // 从路由配置中获取页面标签信息
  const getRouteLabel = useCallback((path: string): string => {
    // 直接查找路由
    for (const route of routes) {
      if (route.path === path && route.label) {
        return route.label;
      }
      // 查找子路由
      if (route.children) {
        for (const child of route.children) {
          const childPath = child.path.startsWith('/') ? child.path : `${route.path}/${child.path}`;
          if (childPath === path && child.label) {
            return child.label;
          }
        }
      }
    }
    return path.replace('/', '') || '首页';
  }, [routes]);

  // 模拟数据加载
  const simulateDataLoad = (path: string): Promise<void> => {
    return new Promise((resolve) => {
      const loadTime = Math.random() * 800 + 400; // 400-1200ms
      setTimeout(() => {
        setCachedPaths(prev => {
          const newSet = new Set(prev);
          newSet.add(path);
          return newSet;
        });
        resolve();
      }, loadTime);
    });
  };

  // 监听路由变化
  useEffect(() => {
    const currentPath = location.pathname;
    
    // 跳过特殊路径
    if (currentPath === '/' || currentPath === '/login' || currentPath === '/register') {
      return;
    }

    // 设置当前活跃标签
    setActiveKey(currentPath);

    // 检查是否已经处理过这个路径（避免重复添加）
    if (processedPaths.current.has(currentPath)) {
      return;
    }

    // 标记为已处理
    processedPaths.current.add(currentPath);

    // 创建新标签
    const label = getRouteLabel(currentPath);
    const isCached = cachedPaths.has(currentPath);
    
    const newTab: SimpleTabItem = {
      key: currentPath,
      label,
      path: currentPath,
      closable: true,
      cached: isCached,
      loading: !isCached
    };
    
    setTabs(prevTabs => [...prevTabs, newTab]);
    
    // 如果没有缓存，开始加载
    if (!isCached) {
      simulateDataLoad(currentPath).then(() => {
        setTabs(prevTabs => 
          prevTabs.map(tab => 
            tab.path === currentPath 
              ? { ...tab, loading: false, cached: true }
              : tab
          )
        );
      });
    }
  }, [location.pathname, getRouteLabel, cachedPaths]);

  // 切换标签
  const handleTabChange = (key: string) => {
    navigate(key);
  };

  // 删除标签
  const handleTabEdit = (targetKey: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => {
    if (action === 'remove' && typeof targetKey === 'string') {
      removeTab(targetKey);
    }
  };

  // 删除标签的具体逻辑
  const removeTab = (targetKey: string) => {
    // 防止删除当前活跃的标签
    if (targetKey === activeKey) {
      return;
    }

    const newTabs = tabs.filter(tab => tab.key !== targetKey);
    
    // 清除缓存
    setCachedPaths(prev => {
      const newSet = new Set(prev);
      newSet.delete(targetKey);
      return newSet;
    });
    
    // 清除已处理标记，允许重新访问时重新添加
    processedPaths.current.delete(targetKey);
    
    setTabs(newTabs);
  };

  // 刷新标签
  const refreshTab = (path: string) => {
    // 清除缓存
    setCachedPaths(prev => {
      const newSet = new Set(prev);
      newSet.delete(path);
      return newSet;
    });
    
    // 更新标签状态
    setTabs(prevTabs => 
      prevTabs.map(tab => 
        tab.path === path 
          ? { ...tab, cached: false, loading: true }
          : tab
      )
    );
    
    // 重新加载
    simulateDataLoad(path).then(() => {
      setTabs(prevTabs => 
        prevTabs.map(tab => 
          tab.path === path 
            ? { ...tab, loading: false, cached: true }
            : tab
        )
      );
    });
  };

  if (tabs.length === 0) {
    return null;
  }

  return (
    <div className="tabs-nav-container">
      <Tabs
        type="editable-card"
        activeKey={activeKey}
        onChange={handleTabChange}
        onEdit={handleTabEdit}
        hideAdd
        size="small"
        className="custom-tabs"
        items={tabs.map(tab => ({
          key: tab.key,
          label: (
            <span className="tab-label-wrapper">
              <span className="tab-label">
                {tab.loading && <Spin size="small" style={{ marginRight: 4 }} />}
                {tab.label}
                {tab.cached && !tab.loading && (
                  <span className="cache-indicator" title="已缓存">●</span>
                )}
              </span>
              {tab.cached && (
                <ReloadOutlined 
                  className="refresh-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    refreshTab(tab.path);
                  }}
                  title="刷新页面（清除缓存）"
                />
              )}
            </span>
          ),
          closable: tab.key !== activeKey // 当前活跃的标签不可关闭
        }))}
      />
    </div>
  );
};

export default SimpleTabsNav;
