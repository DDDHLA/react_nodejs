import React from 'react';
import { Card, Button, Space, Typography, Divider, Tag, Progress, Switch, Slider } from 'antd';
import {
  useAuth,
  useLayout,
  useTabs,
  useNotifications,
  useCurrentGame,
  useGameSettings,
  useApiState,
  useCache,
  useTheme,
  useNetworkStatus
} from '../store/hooks';
import type { GameType } from '../store';

const { Title, Text, Paragraph } = Typography;

const StoreDemo: React.FC = () => {
  // 使用各种hooks
  const { isAuthenticated, userInfo } = useAuth();
  const { sidebarCollapsed, toggleSidebar } = useLayout();
  const { tabs, addTab, removeTab } = useTabs();
  const { notifications, addNotification, unreadCount } = useNotifications();
  const { currentGame, startGame, endGame } = useCurrentGame();
  const { gameSettings, updateGameSettings } = useGameSettings();
  const apiState = useApiState('demo');
  const cache = useCache<string>('demo-cache');
  const { themeConfig, setThemeMode, setPrimaryColor } = useTheme();
  const { isOnline } = useNetworkStatus();

  // 演示函数
  const handleLogin = () => {
    // 模拟登录
    console.log('模拟登录功能');
  };

  const handleAddTab = () => {
    const newTab = {
      key: `/demo-${Date.now()}`,
      title: `演示页面 ${tabs.length + 1}`,
      path: `/demo-${Date.now()}`,
      icon: 'experiment',
      closable: true,
    };
    addTab(newTab);
  };

  const handleAddNotification = () => {
    addNotification({
      type: 'info',
      title: '演示通知',
      message: `这是第 ${notifications.length + 1} 条通知消息`,
    });
  };

  const handleStartGame = () => {
    startGame('gobang' as GameType, 'medium');
  };

  const handleEndGame = () => {
    endGame('win');
  };

  const handleApiTest = () => {
    apiState.setLoading(true);
    setTimeout(() => {
      apiState.setSuccess();
    }, 2000);
  };

  const handleCacheTest = () => {
    cache.setData(`缓存数据 - ${new Date().toLocaleTimeString()}`, 30000); // 30秒过期
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2}>🎯 Zustand 状态管理演示</Title>
      <Paragraph>
        这个页面演示了项目中各种 Zustand 状态管理的使用方法。
      </Paragraph>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 用户状态 */}
        <Card title="👤 用户状态管理" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text strong>登录状态: </Text>
              <Tag color={isAuthenticated ? 'green' : 'red'}>
                {isAuthenticated ? '已登录' : '未登录'}
              </Tag>
            </div>
            {userInfo && (
              <div>
                <Text strong>用户信息: </Text>
                <Text>{userInfo.username} ({userInfo.role})</Text>
              </div>
            )}
            <Button type="primary" onClick={handleLogin}>
              {isAuthenticated ? '切换用户' : '模拟登录'}
            </Button>
          </Space>
        </Card>

        {/* 布局状态 */}
        <Card title="🎨 布局状态管理" size="small">
          <Space>
            <Text strong>侧边栏状态: </Text>
            <Tag color={sidebarCollapsed ? 'orange' : 'blue'}>
              {sidebarCollapsed ? '已收起' : '已展开'}
            </Tag>
            <Button onClick={toggleSidebar}>
              {sidebarCollapsed ? '展开侧边栏' : '收起侧边栏'}
            </Button>
          </Space>
        </Card>

        {/* 标签页状态 */}
        <Card title="📑 标签页状态管理" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text strong>当前标签页数量: </Text>
              <Tag color="blue">{tabs.length}</Tag>
              <Button type="dashed" onClick={handleAddTab} style={{ marginLeft: 8 }}>
                添加标签页
              </Button>
            </div>
            <div>
              <Text strong>标签页列表: </Text>
              <Space wrap>
                {tabs.map(tab => (
                  <Tag
                    key={tab.key}
                    closable={tab.closable}
                    onClose={() => removeTab(tab.key)}
                  >
                    {tab.title}
                  </Tag>
                ))}
              </Space>
            </div>
          </Space>
        </Card>

        {/* 通知状态 */}
        <Card title="🔔 通知状态管理" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text strong>未读通知: </Text>
              <Tag color="red">{unreadCount}</Tag>
              <Text strong style={{ marginLeft: 16 }}>总通知: </Text>
              <Tag color="blue">{notifications.length}</Tag>
              <Button type="dashed" onClick={handleAddNotification} style={{ marginLeft: 8 }}>
                添加通知
              </Button>
            </div>
          </Space>
        </Card>

        {/* 游戏状态 */}
        <Card title="🎮 游戏状态管理" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text strong>游戏状态: </Text>
              <Tag color={currentGame.isPlaying ? 'green' : 'default'}>
                {currentGame.isPlaying ? '游戏中' : '未开始'}
              </Tag>
              {currentGame.isPlaying && (
                <>
                  <Text strong style={{ marginLeft: 16 }}>分数: </Text>
                  <Tag color="blue">{currentGame.score}</Tag>
                  <Text strong style={{ marginLeft: 16 }}>等级: </Text>
                  <Tag color="purple">{currentGame.level}</Tag>
                </>
              )}
            </div>
            <Space>
              <Button 
                type="primary" 
                onClick={handleStartGame}
                disabled={currentGame.isPlaying}
              >
                开始游戏
              </Button>
              <Button 
                onClick={handleEndGame}
                disabled={!currentGame.isPlaying}
              >
                结束游戏
              </Button>
            </Space>
            <div>
              <Text strong>游戏设置: </Text>
              <Space>
                <Text>音效:</Text>
                <Switch
                  checked={gameSettings.soundEnabled}
                  onChange={(checked) => updateGameSettings({ soundEnabled: checked })}
                  size="small"
                />
                <Text>音乐:</Text>
                <Switch
                  checked={gameSettings.musicEnabled}
                  onChange={(checked) => updateGameSettings({ musicEnabled: checked })}
                  size="small"
                />
              </Space>
            </div>
          </Space>
        </Card>

        {/* API状态 */}
        <Card title="🌐 API状态管理" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text strong>API状态: </Text>
              <Tag color={apiState.loading ? 'orange' : apiState.error ? 'red' : 'green'}>
                {apiState.loading ? '加载中' : apiState.error ? '错误' : '正常'}
              </Tag>
              {apiState.loading && <Progress percent={50} size="small" style={{ width: 200, marginLeft: 8 }} />}
            </div>
            <Button type="primary" onClick={handleApiTest} loading={apiState.loading}>
              测试API请求
            </Button>
            {apiState.error && (
              <Text type="danger">错误: {apiState.error}</Text>
            )}
          </Space>
        </Card>

        {/* 缓存状态 */}
        <Card title="💾 缓存状态管理" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text strong>缓存状态: </Text>
              <Tag color={cache.isValid ? 'green' : 'default'}>
                {cache.isValid ? '有效' : '无缓存'}
              </Tag>
              {cache.data && (
                <>
                  <Text strong style={{ marginLeft: 16 }}>缓存数据: </Text>
                  <Text code>{cache.data}</Text>
                </>
              )}
            </div>
            <Button type="primary" onClick={handleCacheTest}>
              设置缓存数据
            </Button>
            <Button onClick={cache.clear}>
              清除缓存
            </Button>
          </Space>
        </Card>

        {/* 主题状态 */}
        <Card title="🎨 主题状态管理" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text strong>当前主题: </Text>
              <Tag color="blue">{themeConfig.mode}</Tag>
              <Text strong style={{ marginLeft: 16 }}>主色调: </Text>
              <div 
                style={{ 
                  display: 'inline-block',
                  width: 20, 
                  height: 20, 
                  backgroundColor: themeConfig.primaryColor,
                  border: '1px solid #d9d9d9',
                  borderRadius: 4,
                  marginLeft: 8
                }} 
              />
            </div>
            <Space>
              <Button onClick={() => setThemeMode('light')}>浅色主题</Button>
              <Button onClick={() => setThemeMode('dark')}>深色主题</Button>
              <Button onClick={() => setPrimaryColor('#ff4d4f')}>红色主题</Button>
              <Button onClick={() => setPrimaryColor('#52c41a')}>绿色主题</Button>
            </Space>
          </Space>
        </Card>

        {/* 网络状态 */}
        <Card title="📡 网络状态管理" size="small">
          <div>
            <Text strong>网络状态: </Text>
            <Tag color={isOnline ? 'green' : 'red'}>
              {isOnline ? '在线' : '离线'}
            </Tag>
          </div>
        </Card>
      </Space>
    </div>
  );
};

export default StoreDemo;
