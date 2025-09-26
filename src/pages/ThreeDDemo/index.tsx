import React, { useState } from 'react';
import { Card, Tabs, Row, Col, Space, Typography, Button, Slider } from 'antd';
import { 
  RotateLeftOutlined, 
  PlayCircleOutlined,
  PauseOutlined,
  SettingOutlined,
  FullscreenOutlined
} from '@ant-design/icons';
import { useSeasonalTheme } from '@/components/SeasonalTheme';
import FlipCard3D from './components/FlipCard3D';
import ParticleStarfield from './components/ParticleStarfield';
import ModelViewer from './components/ModelViewer';
import './index.less';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

const ThreeDDemo: React.FC = () => {
  const { currentSeason, themeConfig } = useSeasonalTheme();
  const [activeTab, setActiveTab] = useState('flipcard');
  const [isPlaying, setIsPlaying] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [particleCount, setParticleCount] = useState(200);

  // 3D效果配置
  const effectConfigs = {
    flipcard: {
      title: '3D卡片翻转',
      icon: '🎴',
      description: '立体卡片展示效果，支持多种翻转动画和季节主题',
      features: ['多种翻转方向', '季节主题卡片', '平滑动画过渡', '鼠标交互']
    },
    starfield: {
      title: '粒子星空',
      icon: '⭐',
      description: '3D粒子系统创造的星空效果，粒子会根据季节变化',
      features: ['动态粒子系统', '季节色彩变化', '鼠标跟随效果', '可调节密度']
    },
    model: {
      title: '3D模型查看器',
      icon: '🎯',
      description: '展示和操控3D模型，支持旋转、缩放和材质切换',
      features: ['模型加载', '自由旋转', '材质切换', '光照调节']
    },
    panorama: {
      title: '全景图片浏览',
      icon: '🌐',
      description: '360度全景图片浏览体验，支持鼠标和触摸操控',
      features: ['360度浏览', '平滑导航', '热点标记', '全屏模式']
    }
  };

  const currentConfig = effectConfigs[activeTab as keyof typeof effectConfigs];

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const toggleAnimation = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="threed-demo">
      {/* 页面标题 */}
      <div className="demo-header">
        <Space align="center" size="large">
          <span style={{ fontSize: '48px' }}>🌐</span>
          <div>
            <Title level={1} style={{ margin: 0, color: 'var(--seasonal-text-primary)' }}>
              3D效果展示
            </Title>
            <Paragraph style={{ margin: '8px 0 0 0', fontSize: '16px' }}>
              沉浸式3D体验，结合{themeConfig.name}主题的视觉盛宴
            </Paragraph>
          </div>
        </Space>
      </div>

      {/* 主要内容区域 */}
      <Row gutter={[24, 24]}>
        {/* 左侧控制面板 */}
        <Col xs={24} lg={6}>
          <Card title="控制面板" className="control-panel">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {/* 当前效果信息 */}
              <div className="current-effect">
                <div className="effect-icon">
                  <span style={{ fontSize: '32px' }}>{currentConfig.icon}</span>
                </div>
                <Title level={4} style={{ margin: '8px 0', textAlign: 'center' }}>
                  {currentConfig.title}
                </Title>
                <Text type="secondary" style={{ textAlign: 'center', display: 'block' }}>
                  {currentConfig.description}
                </Text>
              </div>

              {/* 动画控制 */}
              <div className="animation-controls">
                <Title level={5}>动画控制</Title>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div className="control-item">
                    <Space>
                      <Button 
                        type={isPlaying ? 'primary' : 'default'}
                        icon={isPlaying ? <PauseOutlined /> : <PlayCircleOutlined />}
                        onClick={toggleAnimation}
                      >
                        {isPlaying ? '暂停' : '播放'}
                      </Button>
                      <Button icon={<RotateLeftOutlined />}>重置</Button>
                    </Space>
                  </div>
                  
                  <div className="control-item">
                    <Text>动画速度</Text>
                    <Slider
                      min={0.1}
                      max={3}
                      step={0.1}
                      value={animationSpeed}
                      onChange={setAnimationSpeed}
                      marks={{ 0.5: '慢', 1: '正常', 2: '快' }}
                    />
                  </div>

                  {activeTab === 'starfield' && (
                    <div className="control-item">
                      <Text>粒子数量</Text>
                      <Slider
                        min={50}
                        max={500}
                        step={50}
                        value={particleCount}
                        onChange={setParticleCount}
                        marks={{ 100: '少', 200: '中', 400: '多' }}
                      />
                    </div>
                  )}
                </Space>
              </div>

              {/* 功能特性 */}
              <div className="features-list">
                <Title level={5}>功能特性</Title>
                <ul>
                  {currentConfig.features.map((feature, index) => (
                    <li key={index}>
                      <Text>{feature}</Text>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 季节主题信息 */}
              <div className="theme-info">
                <Title level={5}>当前主题</Title>
                <Space>
                  <span style={{ fontSize: '20px' }}>{themeConfig.icon}</span>
                  <Text strong>{themeConfig.name}</Text>
                </Space>
                <Text type="secondary" style={{ display: 'block', marginTop: '4px' }}>
                  3D效果会根据季节主题调整颜色和样式
                </Text>
              </div>
            </Space>
          </Card>
        </Col>

        {/* 右侧展示区域 */}
        <Col xs={24} lg={18}>
          <Card className="display-area">
            <Tabs 
              activeKey={activeTab} 
              onChange={handleTabChange}
              size="large"
              tabBarExtraContent={
                <Space>
                  <Button icon={<SettingOutlined />} type="text">设置</Button>
                  <Button icon={<FullscreenOutlined />} type="text">全屏</Button>
                </Space>
              }
            >
              <TabPane tab={
                <Space>
                  <span>🎴</span>
                  <span>3D卡片翻转</span>
                </Space>
              } key="flipcard">
                <FlipCard3D 
                  season={currentSeason}
                  isPlaying={isPlaying}
                  animationSpeed={animationSpeed}
                />
              </TabPane>

              <TabPane tab={
                <Space>
                  <span>⭐</span>
                  <span>粒子星空</span>
                </Space>
              } key="starfield">
                <ParticleStarfield 
                  season={currentSeason}
                  isPlaying={isPlaying}
                  animationSpeed={animationSpeed}
                  particleCount={particleCount}
                />
              </TabPane>

              <TabPane tab={
                <Space>
                  <span>🎯</span>
                  <span>模型查看器</span>
                </Space>
              } key="model">
                <ModelViewer 
                  season={currentSeason}
                  isPlaying={isPlaying}
                  animationSpeed={animationSpeed}
                />
              </TabPane>

            </Tabs>
          </Card>
        </Col>
      </Row>

      {/* 底部说明 */}
      <Card title="使用说明" style={{ marginTop: '24px' }}>
        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <Title level={4}>🎮 交互操作</Title>
            <ul>
              <li>鼠标拖拽：旋转视角</li>
              <li>滚轮：缩放视图</li>
              <li>双击：重置视角</li>
              <li>右键：显示菜单</li>
            </ul>
          </Col>
          <Col xs={24} md={12}>
            <Title level={4}>⚙️ 性能优化</Title>
            <ul>
              <li>自动降级：低性能设备自动优化</li>
              <li>帧率控制：保持流畅体验</li>
              <li>内存管理：自动清理资源</li>
              <li>响应式：适配不同屏幕</li>
            </ul>
          </Col>
          <Col xs={24} md={12}>
            <Title level={4}>🎨 季节主题</Title>
            <ul>
              <li>春天：清新绿色，樱花粉点缀</li>
              <li>夏天：海洋蓝色，阳光金黄</li>
              <li>秋天：枫叶橙红，温暖色调</li>
              <li>冬天：冰雪蓝白，纯净色彩</li>
            </ul>
          </Col>
          <Col xs={24} md={12}>
            <Title level={4}>🚀 技术特性</Title>
            <ul>
              <li>WebGL渲染：硬件加速</li>
              <li>CSS 3D：原生支持</li>
              <li>动画引擎：流畅过渡</li>
              <li>事件系统：丰富交互</li>
            </ul>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ThreeDDemo;
