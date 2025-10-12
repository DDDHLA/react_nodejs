import React, { useState } from 'react';
import { Card, Row, Col, Space, Typography, Button, Slider, Switch, Select } from 'antd';
import { 
  ReloadOutlined,
  BgColorsOutlined
} from '@ant-design/icons';
import { useSeasonalTheme } from '@/components/SeasonalTheme';
import GlassGrid from './components/GlassGrid';
import LightSource from './components/LightSource';
import './index.less';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const LightGlass: React.FC = () => {
  const { currentSeason, themeConfig } = useSeasonalTheme();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [lightIntensity, setLightIntensity] = useState(1);
  const [lightRadius, setLightRadius] = useState(200);
  const [glassCount, setGlassCount] = useState(100);
  const [glassSize, setGlassSize] = useState(60);
  const [lightColor, setLightColor] = useState('white');
  const [showLightSource, setShowLightSource] = useState(true);
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [glassPattern, setGlassPattern] = useState('grid');

  // 季节光源颜色配置
  const getSeasonalLightColors = () => {
    const colorSets = {
      spring: {
        primary: '#52c41a',
        secondary: '#ff85c0',
        ambient: 'rgba(82, 196, 26, 0.1)'
      },
      summer: {
        primary: '#1890ff',
        secondary: '#fadb14',
        ambient: 'rgba(24, 144, 255, 0.1)'
      },
      autumn: {
        primary: '#fa8c16',
        secondary: '#d4380d',
        ambient: 'rgba(250, 140, 22, 0.1)'
      },
      winter: {
        primary: '#722ed1',
        secondary: '#13c2c2',
        ambient: 'rgba(114, 46, 209, 0.1)'
      }
    };
    return colorSets[currentSeason] || colorSets.winter;
  };

  const seasonalColors = getSeasonalLightColors();

  // 处理鼠标移动
  const handleMouseMove = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });
  };

  // 重置设置
  const resetSettings = () => {
    setLightIntensity(1);
    setLightRadius(200);
    setGlassCount(100);
    setGlassSize(60);
    setLightColor('white');
    setShowLightSource(true);
    setAnimationEnabled(true);
    setGlassPattern('grid');
  };

  // 切换光源颜色为季节主题
  const useSeasonalLight = () => {
    setLightColor(seasonalColors.primary);
  };

  return (
    <div 
      className={`light-glass-page season-${currentSeason}`}
      onMouseMove={handleMouseMove}
    >
      {/* 页面内容 */}
      <div className="light-glass-content">
        {/* 页面标题 */}
        <div className="light-glass-header">
          <Card className="header-card">
            <Space align="center" size="large">
              <span style={{ fontSize: '48px' }}>💎</span>
              <div>
                <Title level={1} style={{ margin: 0, color: 'var(--seasonal-text-primary)' }}>
                  光影玻璃实验室
                </Title>
                <Paragraph style={{ margin: '8px 0 0 0', fontSize: '16px' }}>
                  移动鼠标作为光源，照亮透明玻璃块，体验光与影的奇妙交互
                </Paragraph>
              </div>
            </Space>
          </Card>
        </div>

        {/* 主要内容区域 */}
        <Row gutter={[24, 24]} style={{ marginTop: '32px' }}>
          {/* 左侧控制面板 */}
          <Col xs={24} lg={6}>
            <Card title="光源控制台" className="light-control-panel">
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                {/* 当前光源信息 */}
                <div className="current-light-info">
                  <div className="light-icon">
                    <span style={{ fontSize: '32px' }}>💡</span>
                  </div>
                  <Title level={4} style={{ margin: '8px 0', textAlign: 'center' }}>
                    鼠标光源
                  </Title>
                  <Text type="secondary" style={{ textAlign: 'center', display: 'block' }}>
                    移动鼠标控制光源位置，照亮透明玻璃块
                  </Text>
                </div>

                {/* 光源参数控制 */}
                <div className="light-controls">
                  <Title level={5}>光源参数</Title>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div className="control-item">
                      <Text>光源强度</Text>
                      <Slider
                        min={0.1}
                        max={3}
                        step={0.1}
                        value={lightIntensity}
                        onChange={setLightIntensity}
                        marks={{ 0.5: '弱', 1: '中', 2: '强' }}
                      />
                    </div>

                    <div className="control-item">
                      <Text>光照范围</Text>
                      <Slider
                        min={50}
                        max={400}
                        step={10}
                        value={lightRadius}
                        onChange={setLightRadius}
                        marks={{ 100: '小', 200: '中', 300: '大' }}
                      />
                    </div>

                    <div className="control-item">
                      <Text>玻璃数量</Text>
                      <Slider
                        min={20}
                        max={200}
                        step={10}
                        value={glassCount}
                        onChange={setGlassCount}
                        marks={{ 50: '少', 100: '中', 150: '多' }}
                      />
                    </div>

                    <div className="control-item">
                      <Text>玻璃大小</Text>
                      <Slider
                        min={30}
                        max={100}
                        step={5}
                        value={glassSize}
                        onChange={setGlassSize}
                        marks={{ 40: '小', 60: '中', 80: '大' }}
                      />
                    </div>

                    <div className="control-item">
                      <Text>光源颜色</Text>
                      <Select 
                        value={lightColor} 
                        onChange={setLightColor}
                        style={{ width: '100%' }}
                      >
                        <Option value="white">⚪ 白光</Option>
                        <Option value="#ff6b6b">🔴 红光</Option>
                        <Option value="#4ecdc4">🔵 青光</Option>
                        <Option value="#45b7d1">💙 蓝光</Option>
                        <Option value="#f9ca24">💛 黄光</Option>
                        <Option value="#6c5ce7">💜 紫光</Option>
                        <Option value={seasonalColors.primary}>🌈 季节色</Option>
                      </Select>
                    </div>

                    <div className="control-item">
                      <Text>玻璃排列</Text>
                      <Select 
                        value={glassPattern} 
                        onChange={setGlassPattern}
                        style={{ width: '100%' }}
                      >
                        <Option value="grid">📐 网格排列</Option>
                        <Option value="random">🎲 随机分布</Option>
                        <Option value="circle">⭕ 圆形排列</Option>
                        <Option value="spiral">🌀 螺旋排列</Option>
                      </Select>
                    </div>

                    <div className="control-item">
                      <Space>
                        <Text>显示光源</Text>
                        <Switch 
                          checked={showLightSource} 
                          onChange={setShowLightSource}
                          checkedChildren="开"
                          unCheckedChildren="关"
                        />
                      </Space>
                    </div>

                    <div className="control-item">
                      <Space>
                        <Text>动画效果</Text>
                        <Switch 
                          checked={animationEnabled} 
                          onChange={setAnimationEnabled}
                          checkedChildren="开"
                          unCheckedChildren="关"
                        />
                      </Space>
                    </div>
                  </Space>
                </div>

                {/* 快捷操作 */}
                <div className="quick-actions">
                  <Title level={5}>快捷操作</Title>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Button 
                      type="primary" 
                      icon={<BgColorsOutlined />}
                      onClick={useSeasonalLight}
                      block
                    >
                      使用季节光源
                    </Button>
                    <Button 
                      icon={<ReloadOutlined />}
                      onClick={resetSettings}
                      block
                    >
                      重置设置
                    </Button>
                  </Space>
                </div>

                {/* 季节信息 */}
                <div className="season-info">
                  <Title level={5}>当前季节</Title>
                  <Space>
                    <span style={{ fontSize: '20px' }}>{themeConfig.icon}</span>
                    <Text strong>{themeConfig.name}</Text>
                  </Space>
                  <Text type="secondary" style={{ display: 'block', marginTop: '4px', fontSize: '12px' }}>
                    光源会根据季节调整颜色和氛围
                  </Text>
                </div>
              </Space>
            </Card>
          </Col>

          {/* 右侧玻璃展示区域 */}
          <Col xs={24} lg={18}>
            <Card className="glass-display-area">
              <div className="glass-container">
                {/* 玻璃网格 */}
                <GlassGrid 
                  mousePosition={mousePosition}
                  lightIntensity={lightIntensity}
                  lightRadius={lightRadius}
                  glassCount={glassCount}
                  glassSize={glassSize}
                  lightColor={lightColor}
                  animationEnabled={animationEnabled}
                  glassPattern={glassPattern}
                  seasonalColors={seasonalColors}
                />

                {/* 光源指示器 */}
                {showLightSource && (
                  <LightSource 
                    position={mousePosition}
                    intensity={lightIntensity}
                    radius={lightRadius}
                    color={lightColor}
                    animated={animationEnabled}
                  />
                )}

                {/* 使用提示 */}
                <div className="usage-hint">
                  <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    💡 移动鼠标控制光源位置，观察玻璃块的光影变化
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* 底部效果说明 */}
        <Card title="光影原理" style={{ marginTop: '24px' }}>
          <Row gutter={[24, 16]}>
            <Col xs={24} md={6}>
              <Title level={4}>💡 光源模拟</Title>
              <Text>
                基于物理光学原理，模拟点光源的辐射扩散，
                光强度随距离平方反比衰减。
              </Text>
            </Col>
            <Col xs={24} md={6}>
              <Title level={4}>🔍 透明材质</Title>
              <Text>
                玻璃块采用透明材质渲染，支持光线穿透、
                反射和折射效果的真实模拟。
              </Text>
            </Col>
            <Col xs={24} md={6}>
              <Title level={4}>🌈 色彩混合</Title>
              <Text>
                支持多种光源颜色，实现RGB色彩空间的
                光线混合和颜色叠加效果。
              </Text>
            </Col>
            <Col xs={24} md={6}>
              <Title level={4}>⚡ 实时渲染</Title>
              <Text>
                采用高性能Canvas渲染，实时计算光照，
                提供流畅的60FPS交互体验。
              </Text>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default LightGlass;
