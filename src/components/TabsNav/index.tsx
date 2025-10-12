import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import './index.less';
import { TabItem, TabsNavProps, RouteItem } from './types';

const TabsNav: React.FC<TabsNavProps> = ({ routes }) => {
  const [tabs, setTabs] = useState<TabItem[]>([]);
  const [activeKey, setActiveKey] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();

  // 从路由配置中获取页面标签信息
  const getRouteLabel = useCallback((path: string): string => {
    const findLabel = (routeList: RouteItem[], targetPath: string): string => {
      for (const route of routeList) {
        if (route.path === targetPath && route.label) {
          return route.label;
        }
        if (route.children) {
          const childLabel = findLabel(route.children, targetPath);
          if (childLabel) return childLabel;
        }
      }
      return path; // 如果找不到标签，使用路径作为标签
    };

    return findLabel(routes, path);
  }, [routes]);

  // 监听路由变化，自动添加标签
  useEffect(() => {
    const currentPath = location.pathname;
    
    // 跳过根路径和登录注册页面
    if (currentPath === '/' || currentPath === '/login' || currentPath === '/register') {
      return;
    }

    // 检查当前路径是否已经在标签中
    const existingTab = tabs.find(tab => tab.path === currentPath);
    
    if (!existingTab) {
      // 添加新标签
      const label = getRouteLabel(currentPath);
      const newTab: TabItem = {
        key: currentPath,
        label,
        path: currentPath,
        closable: true
      };
      
      setTabs(prevTabs => [...prevTabs, newTab]);
    }
    
    setActiveKey(currentPath);
  }, [location.pathname, routes, getRouteLabel, tabs]);

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
    
    message.success('标签已关闭');
  };

  // 自定义渲染标签
   
  const renderTabBar = (props: Record<string, unknown>, DefaultTabBar: React.ComponentType<any>) => (
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
            <span className="tab-label">
              {tab.label}
            </span>
          ),
          closable: tab.closable
        }))}
      />
    </div>
  );
};

export default TabsNav;
