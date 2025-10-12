import React, { useState, useEffect, useRef } from 'react';
import { Tabs, message, Spin } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { ReloadOutlined } from '@ant-design/icons';
import './index.less';

interface TabItem {
  key: string;
  label: string;
  path: string;
  closable?: boolean;
  cached?: boolean; // 是否已缓存
  loading?: boolean; // 是否正在加载
}

interface CachedComponent {
  component: React.ReactNode;
  timestamp: number;
}

interface Props {
  routes: RouteConfig[]; // 路由配置
}

interface RouteConfig {
  path: string;
  label?: string;
  children?: RouteConfig[];
}

const TabsNavWithCache: React.FC<Props> = ({ routes }) => {
  const [tabs, setTabs] = useState<TabItem[]>([]);
  const [activeKey, setActiveKey] = useState<string>('');
  const [componentCache, setComponentCache] = useState<Map<string, CachedComponent>>(new Map());
  const navigate = useNavigate();
  const location = useLocation();
  const loadingTimeoutRef = useRef<NodeJS.Timeout>();

  // 从路由配置中获取页面标签信息
  const getRouteLabel = (path: string): string => {
    const findLabel = (routeList: RouteConfig[], targetPath: string): string => {
      for (const route of routeList) {
        if (route.path === targetPath && route.label) {
          return route.label;
        }
        if (route.children) {
          const childLabel = findLabel(route.children, targetPath);
          if (childLabel) return childLabel;
        }
      }
      return path.replace('/', ''); // 如果找不到标签，使用路径作为标签
    };

    return findLabel(routes, path);
  };

  // 模拟数据请求（这里可以替换为实际的API调用）
  const mockDataRequest = (path: string): Promise<{ path: string; data: string; timestamp: number }> => {
    return new Promise((resolve) => {
      // 模拟不同页面的加载时间
      const loadingTime = Math.random() * 1000 + 500; // 500-1500ms
      setTimeout(() => {
        resolve({
          path,
          data: `页面 ${path} 的数据`,
          timestamp: Date.now()
        });
      }, loadingTime);
    });
  };

  // 检查标签是否有缓存
  const isTabCached = (path: string): boolean => {
    return componentCache.has(path);
  };

  // 添加或更新缓存
  const updateCache = (path: string, component: React.ReactNode) => {
    setComponentCache(prev => {
      const newCache = new Map(prev);
      newCache.set(path, {
        component,
        timestamp: Date.now()
      });
      return newCache;
    });
  };

  // 清除指定路径的缓存
  const clearCache = (path: string) => {
    setComponentCache(prev => {
      const newCache = new Map(prev);
      newCache.delete(path);
      return newCache;
    });
  };

  // 监听路由变化，自动添加标签
  useEffect(() => {
    const currentPath = location.pathname;
    
    // 跳过根路径和登录注册页面
    if (currentPath === '/' || currentPath === '/login' || currentPath === '/register') {
      return;
    }

    // 检查当前路径是否已经在标签中
    const existingTabIndex = tabs.findIndex(tab => tab.path === currentPath);
    
    if (existingTabIndex === -1) {
      // 添加新标签
      const label = getRouteLabel(currentPath);
      const isCached = isTabCached(currentPath);
      
      const newTab: TabItem = {
        key: currentPath,
        label,
        path: currentPath,
        closable: true,
        cached: isCached,
        loading: !isCached // 如果没有缓存，显示加载状态
      };
      
      setTabs(prevTabs => [...prevTabs, newTab]);
      
      // 如果没有缓存，模拟数据请求
      if (!isCached) {
        // 清除之前的加载定时器
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
        }
        
        loadingTimeoutRef.current = setTimeout(async () => {
          try {
            await mockDataRequest(currentPath);
            
            // 更新标签状态
            setTabs(prevTabs => 
              prevTabs.map(tab => 
                tab.path === currentPath 
                  ? { ...tab, loading: false, cached: true }
                  : tab
              )
            );
            
            // 模拟将组件添加到缓存
            updateCache(currentPath, <div>缓存的组件内容 - {currentPath}</div>);
            
            message.success(`页面 "${label}" 加载完成`);
          } catch (error) {
            message.error('页面加载失败');
            // 加载失败时移除加载状态
            setTabs(prevTabs => 
              prevTabs.map(tab => 
                tab.path === currentPath 
                  ? { ...tab, loading: false }
                  : tab
              )
            );
          }
        }, 100);
      } else {
        message.info(`页面 "${label}" 从缓存加载`);
      }
    } else {
      // 更新现有标签状态
      const existingTab = tabs[existingTabIndex];
      if (!existingTab.cached && !existingTab.loading) {
        // 如果标签存在但没有缓存且不在加载中，开始加载
        setTabs(prevTabs => 
          prevTabs.map((tab, index) => 
            index === existingTabIndex 
              ? { ...tab, loading: true }
              : tab
          )
        );
        
        setTimeout(async () => {
          try {
            await mockDataRequest(currentPath);
            setTabs(prevTabs => 
              prevTabs.map(tab => 
                tab.path === currentPath 
                  ? { ...tab, loading: false, cached: true }
                  : tab
              )
            );
            updateCache(currentPath, <div>缓存的组件内容 - {currentPath}</div>);
            message.success(`页面重新加载完成`);
          } catch (error) {
            message.error('页面加载失败');
            setTabs(prevTabs => 
              prevTabs.map(tab => 
                tab.path === currentPath 
                  ? { ...tab, loading: false }
                  : tab
              )
            );
          }
        }, 100);
      }
    }
    
    setActiveKey(currentPath);
  }, [location.pathname, routes, tabs, componentCache]);

  // 切换标签
  const handleTabChange = (key: string) => {
    const tab = tabs.find(t => t.key === key);
    if (tab) {
      navigate(tab.path);
    }
  };

  // 删除标签
  const handleTabEdit = (targetKey: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => {
    if (action === 'remove' && typeof targetKey === 'string') {
      removeTab(targetKey);
    }
  };

  // 删除标签的具体逻辑
  const removeTab = (targetKey: string) => {
    const targetIndex = tabs.findIndex(tab => tab.key === targetKey);
    const newTabs = tabs.filter(tab => tab.key !== targetKey);
    
    // 清除对应的缓存
    clearCache(targetKey);
    
    setTabs(newTabs);
    
    // 如果删除的是当前激活的标签，需要跳转到其他标签
    if (targetKey === activeKey) {
      if (newTabs.length > 0) {
        // 优先跳转到右侧标签，如果没有则跳转到左侧标签
        const nextTab = newTabs[targetIndex] || newTabs[targetIndex - 1];
        if (nextTab) {
          navigate(nextTab.path);
        }
      } else {
        // 如果没有标签了，跳转到首页
        navigate('/home');
      }
    }
    
    const tabLabel = getRouteLabel(targetKey);
    message.success(`标签 "${tabLabel}" 已关闭，缓存已清除`);
  };

  // 刷新标签（清除缓存并重新加载）
  const refreshTab = (path: string) => {
    clearCache(path);
    setTabs(prevTabs => 
      prevTabs.map(tab => 
        tab.path === path 
          ? { ...tab, cached: false, loading: true }
          : tab
      )
    );
    
    // 如果是当前活跃标签，触发重新加载
    if (path === activeKey) {
      setTimeout(async () => {
        try {
          await mockDataRequest(path);
          setTabs(prevTabs => 
            prevTabs.map(tab => 
              tab.path === path 
                ? { ...tab, loading: false, cached: true }
                : tab
            )
          );
          updateCache(path, <div>刷新后的组件内容 - {path}</div>);
          message.success('页面刷新完成');
        } catch (error) {
          message.error('页面刷新失败');
          setTabs(prevTabs => 
            prevTabs.map(tab => 
              tab.path === path 
                ? { ...tab, loading: false }
                : tab
            )
          );
        }
      }, 100);
    }
  };

  // 自定义渲染标签
   
  const renderTabBar = (props: any, DefaultTabBar: any) => (
    <DefaultTabBar {...props} className="custom-tab-bar" />
  );

  // 如果没有标签，不显示标签栏
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
        renderTabBar={renderTabBar}
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
          closable: tab.closable
        }))}
      />
    </div>
  );
};

export default TabsNavWithCache;
