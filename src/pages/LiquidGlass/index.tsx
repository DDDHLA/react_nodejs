import React, { useState } from 'react';
import { Row, Col, Space, Typography, Button, Slider, Select } from 'antd';
import { 
  PlayCircleOutlined, 
  PauseOutlined, 
  ReloadOutlined
} from '@ant-design/icons';
import { useSeasonalTheme } from '@/components/SeasonalTheme';
import LiquidBackground from './components/LiquidBackground';
import GlassMorphismCard from './components/GlassMorphismCard';
import FluidAnimation from './components/FluidAnimation';
import './index.less';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const LiquidGlass: React.FC = () => {
  const { currentSeason, themeConfig } = useSeasonalTheme();
  const [isPlaying, setIsPlaying] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [fluidIntensity, setFluidIntensity] = useState(0.8);
  const [blurStrength, setBlurStrength] = useState(20);
  const [glassOpacity, setGlassOpacity] = useState(0.15);
  const [liquidStyle, setLiquidStyle] = useState('fluid');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // 液态玻璃效果配置
  const liquidEffects = {
    fluid: {
      title: '流体液态',
      description: '模拟真实液体的流动效果，具有粘性和表面张力',
      icon: '🌊'
    },
    glass: {
      title: '毛玻璃',
      description: 'iOS风格的毛玻璃效果，带有动态模糊和透明度',
      icon: '🔍'
    },
    morphism: {
      title: '玻璃拟态',
      description: '现代玻璃拟态设计，结合阴影和高光效果',
      icon: '💎'
    },
    liquid: {
      title: '液态金属',
      description: '类似水银的液态金属效果，具有高反射性',
      icon: '🪞'
    }
  };

  // 季节液态颜色配置
  const getSeasonalLiquidColors = () => {
    const colorSets = {
      spring: {
        primary: ['#52c41a', '#73d13d', '#95de64'],
        secondary: ['#ff85c0', '#ffc0cb', '#ffb3d9'],
        gradient: 'linear-gradient(135deg, #e8f5e8 0%, #f0fff0 30%, #fff0f5 70%, #f6ffed 100%)'
      },
      summer: {
        primary: ['#1890ff', '#40a9ff', '#69c0ff'],
        secondary: ['#fadb14', '#ffd666', '#ffe58f'],
        gradient: 'linear-gradient(135deg, #87ceeb 0%, #87cefa 30%, #b0e0e6 70%, #e6f7ff 100%)'
      },
      autumn: {
        primary: ['#fa8c16', '#ffa940', '#ffbb96'],
        secondary: ['#d4380d', '#f5222d', '#ff7875'],
        gradient: 'linear-gradient(135deg, #ffd59a 0%, #ffe7ba 30%, #fff2e8 70%, #fff7e6 100%)'
      },
      winter: {
        primary: ['#722ed1', '#9254de', '#b37feb'],
        secondary: ['#13c2c2', '#36cfc9', '#5cdbd3'],
        gradient: 'linear-gradient(135deg, #e6f7ff 0%, #f0f5ff 30%, #f9f0ff 70%, #f6ffed 100%)'
      }
    };
    return colorSets[currentSeason] || colorSets.winter;
  };

  const seasonalColors = getSeasonalLiquidColors();

  // 处理鼠标移动
  const handleMouseMove = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height
    });
  };

  const toggleAnimation = () => {
    setIsPlaying(!isPlaying);
  };

  const resetSettings = () => {
    setAnimationSpeed(1);
    setFluidIntensity(0.8);
    setBlurStrength(20);
    setGlassOpacity(0.15);
    setLiquidStyle('fluid');
  };

  return (
    <div 
      className={`liquid-glass-page season-${currentSeason}`}
      onMouseMove={handleMouseMove}
    >
      {/* 动态液态背景 */}
      <LiquidBackground 
        isPlaying={isPlaying}
        animationSpeed={animationSpeed}
        fluidIntensity={fluidIntensity}
        colors={seasonalColors}
        mousePosition={mousePosition}
        liquidStyle={liquidStyle}
      />

      {/* 页面内容 */}
      <div className="liquid-content">
        {/* 页面标题 */}
        <div className="liquid-header">
          <GlassMorphismCard 
            blur={blurStrength}
            opacity={glassOpacity}
            className="header-card"
          >
            <Space align="center" size="large">
              <span style={{ fontSize: '48px' }}>🌊</span>
              <div>
                <Title level={1} style={{ margin: 0, color: 'rgba(255, 255, 255, 0.9)' }}>
                  液态玻璃实验室
                </Title>
                <Paragraph style={{ margin: '8px 0 0 0', fontSize: '16px', color: 'rgba(255, 255, 255, 0.7)' }}>
                  体验iOS 16风格的液态玻璃效果，感受流动的视觉魅力
                </Paragraph>
              </div>
            </Space>
          </GlassMorphismCard>
        </div>

        {/* 主要内容区域 */}
        <Row gutter={[24, 24]} style={{ marginTop: '32px' }}>
          {/* 左侧控制面板 */}
          <Col xs={24} lg={8}>
            <GlassMorphismCard 
              blur={blurStrength}
              opacity={glassOpacity}
              className="control-panel"
            >
              <Title level={4} style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '24px' }}>
                🎛️ 液态控制台
              </Title>

              <Space direction="vertical" style={{ width: '100%' }} size="large">
                {/* 当前效果信息 */}
                <div className="current-effect-info">
                  <div className="effect-icon">
                    <span>{liquidEffects[liquidStyle as keyof typeof liquidEffects].icon}</span>
                  </div>
                  <Title level={5} style={{ color: 'rgba(255, 255, 255, 0.9)', margin: '8px 0' }}>
                    {liquidEffects[liquidStyle as keyof typeof liquidEffects].title}
                  </Title>
                  <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                    {liquidEffects[liquidStyle as keyof typeof liquidEffects].description}
                  </Text>
                </div>

                {/* 动画控制 */}
                <div className="animation-controls">
                  <Space>
                    <Button 
                      type={isPlaying ? 'primary' : 'default'}
                      icon={isPlaying ? <PauseOutlined /> : <PlayCircleOutlined />}
                      onClick={toggleAnimation}
                      className="glass-button"
                    >
                      {isPlaying ? '暂停' : '播放'}
                    </Button>
                    <Button 
                      icon={<ReloadOutlined />}
                      onClick={resetSettings}
                      className="glass-button"
                    >
                      重置
                    </Button>
                  </Space>
                </div>

                {/* 参数调节 */}
                <div className="parameter-controls">
                  <div className="control-item">
                    <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>动画速度</Text>
                    <Slider
                      min={0.1}
                      max={3}
                      step={0.1}
                      value={animationSpeed}
                      onChange={setAnimationSpeed}
                      className="glass-slider"
                    />
                  </div>

                  <div className="control-item">
                    <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>流体强度</Text>
                    <Slider
                      min={0.1}
                      max={2}
                      step={0.1}
                      value={fluidIntensity}
                      onChange={setFluidIntensity}
                      className="glass-slider"
                    />
                  </div>

                  <div className="control-item">
                    <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>模糊强度</Text>
                    <Slider
                      min={5}
                      max={50}
                      step={5}
                      value={blurStrength}
                      onChange={setBlurStrength}
                      className="glass-slider"
                    />
                  </div>

                  <div className="control-item">
                    <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>玻璃透明度</Text>
                    <Slider
                      min={0.05}
                      max={0.5}
                      step={0.05}
                      value={glassOpacity}
                      onChange={setGlassOpacity}
                      className="glass-slider"
                    />
                  </div>

                  <div className="control-item">
                    <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>液态样式</Text>
                    <Select 
                      value={liquidStyle} 
                      onChange={setLiquidStyle}
                      className="glass-select"
                      style={{ width: '100%' }}
                    >
                      {Object.entries(liquidEffects).map(([key, effect]) => (
                        <Option key={key} value={key}>
                          {effect.icon} {effect.title}
                        </Option>
                      ))}
                    </Select>
                  </div>
                </div>

                {/* 季节信息 */}
                <div className="season-info">
                  <Title level={5} style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                    当前季节主题
                  </Title>
                  <Space>
                    <span style={{ fontSize: '20px' }}>{themeConfig.icon}</span>
                    <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{themeConfig.name}</Text>
                  </Space>
                  <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                    液态效果会根据季节调整颜色和流动模式
                  </Text>
                </div>
              </Space>
            </GlassMorphismCard>
          </Col>

          {/* 右侧展示区域 */}
          <Col xs={24} lg={16}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {/* 液态动画展示 */}
              <GlassMorphismCard 
                blur={blurStrength}
                opacity={glassOpacity}
                className="liquid-display"
              >
                <FluidAnimation 
                  isPlaying={isPlaying}
                  animationSpeed={animationSpeed}
                  fluidIntensity={fluidIntensity}
                  colors={seasonalColors}
                  mousePosition={mousePosition}
                  liquidStyle={liquidStyle}
                />
              </GlassMorphismCard>

              {/* 效果展示卡片 */}
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <GlassMorphismCard 
                    blur={blurStrength}
                    opacity={glassOpacity}
                    className="demo-card"
                  >
                    <Title level={4} style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                      💧 流体力学
                    </Title>
                    <Text style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      基于Navier-Stokes方程的流体仿真，
                      模拟真实液体的粘性、表面张力和湍流效果。
                    </Text>
                  </GlassMorphismCard>
                </Col>
                
                <Col xs={24} md={12}>
                  <GlassMorphismCard 
                    blur={blurStrength}
                    opacity={glassOpacity}
                    className="demo-card"
                  >
                    <Title level={4} style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                      🔍 毛玻璃效果
                    </Title>
                    <Text style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      CSS backdrop-filter和动态模糊技术，
                      创造iOS风格的毛玻璃质感和深度层次。
                    </Text>
                  </GlassMorphismCard>
                </Col>
              </Row>
            </Space>
          </Col>
        </Row>

        {/* 底部技术说明 */}
        <div style={{ marginTop: '48px' }}>
          <GlassMorphismCard 
            blur={blurStrength}
            opacity={glassOpacity}
            className="tech-info"
          >
            <Title level={4} style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '16px' }}>
              🛠️ 技术实现
            </Title>
            <Row gutter={[24, 16]}>
              <Col xs={24} md={8}>
                <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                  Canvas流体仿真
                </Text>
                <br />
                <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>
                  使用WebGL着色器实现高性能流体计算，支持实时交互和动态参数调节
                </Text>
              </Col>
              <Col xs={24} md={8}>
                <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                  CSS毛玻璃效果
                </Text>
                <br />
                <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>
                  backdrop-filter、blur()和动态透明度，创造层次丰富的玻璃质感
                </Text>
              </Col>
              <Col xs={24} md={8}>
                <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                  季节主题集成
                </Text>
                <br />
                <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>
                  动态颜色系统与现有季节主题完美融合，提供一致的视觉体验
                </Text>
              </Col>
            </Row>
          </GlassMorphismCard>
        </div>
      </div>
    </div>
  );
};

export default LiquidGlass;
