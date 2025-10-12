import React, { useState } from 'react';
import { Card, Tabs, Row, Col, Space, Typography, Button, Slider, Switch, Select } from 'antd';
import { 
  ExperimentOutlined, 
  PlayCircleOutlined,
  PauseOutlined,
  ReloadOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useSeasonalTheme } from '@/components/SeasonalTheme';
import QuantumEntanglementViz from './components/QuantumEntanglementViz';
import WaveFunctionCollapse from './components/WaveFunctionCollapse';
import QuantumTunneling from './components/QuantumTunneling';
import QuantumSuperposition from './components/QuantumSuperposition';
import './index.less';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const QuantumEntanglement: React.FC = () => {
  const { currentSeason } = useSeasonalTheme();
  const [activeTab, setActiveTab] = useState('entanglement');
  const [isPlaying, setIsPlaying] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [particleCount, setParticleCount] = useState(50);
  const [entanglementStrength, setEntanglementStrength] = useState(0.8);
  const [quantumField, setQuantumField] = useState(true);
  const [visualMode, setVisualMode] = useState('particles');

  // 量子效果配置
  const quantumEffects = {
    entanglement: {
      title: '量子纠缠',
      icon: '🔗',
      description: '两个或多个粒子之间的神秘关联，无论距离多远都能瞬间影响彼此',
      physics: '当测量一个纠缠粒子的状态时，另一个粒子会瞬间确定相反的状态',
      features: ['瞬时关联', '非局域性', '量子相关性', '贝尔不等式']
    },
    wavefunction: {
      title: '波函数坍缩',
      icon: '🌊',
      description: '量子系统从叠加态到确定态的瞬间转变过程',
      physics: '测量行为导致量子系统从概率分布坍缩为确定值',
      features: ['概率分布', '测量效应', '状态坍缩', '不确定性原理']
    },
    tunneling: {
      title: '量子隧道',
      icon: '🚇',
      description: '粒子穿越经典物理学认为不可能穿越的能量势垒',
      physics: '量子力学允许粒子有一定概率穿越高于其能量的势垒',
      features: ['势垒穿越', '隧道概率', '波动性质', '量子效应']
    },
    superposition: {
      title: '量子叠加',
      icon: '⚛️',
      description: '量子系统同时处于多个状态的神奇现象',
      physics: '粒子可以同时处于多个可能状态，直到被观测',
      features: ['多态并存', '薛定谔猫', '相干性', '量子比特']
    }
  };

  const currentEffect = quantumEffects[activeTab as keyof typeof quantumEffects];

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const toggleAnimation = () => {
    setIsPlaying(!isPlaying);
  };

  const resetQuantumSystem = () => {
    setAnimationSpeed(1);
    setParticleCount(50);
    setEntanglementStrength(0.8);
    setQuantumField(true);
  };

  return (
    <div className="quantum-entanglement">
      {/* 页面标题 */}
      <div className="quantum-header">
        <Space align="center" size="large">
          <span style={{ fontSize: '48px' }}>⚛️</span>
          <div>
            <Title level={1} style={{ margin: 0, color: 'var(--seasonal-text-primary)' }}>
              量子纠缠实验室
            </Title>
            <Paragraph style={{ margin: '8px 0 0 0', fontSize: '16px' }}>
              探索量子世界的神秘现象，体验超越经典物理的奇妙效果
            </Paragraph>
          </div>
        </Space>
      </div>

      {/* 主要内容区域 */}
      <Row gutter={[24, 24]}>
        {/* 左侧控制面板 */}
        <Col xs={24} lg={6}>
          <Card title="量子控制台" className="quantum-control-panel">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {/* 当前效果信息 */}
              <div className="current-quantum-effect">
                <div className="effect-icon">
                  <span style={{ fontSize: '32px' }}>{currentEffect.icon}</span>
                </div>
                <Title level={4} style={{ margin: '8px 0', textAlign: 'center' }}>
                  {currentEffect.title}
                </Title>
                <Text type="secondary" style={{ textAlign: 'center', display: 'block' }}>
                  {currentEffect.description}
                </Text>
              </div>

              {/* 量子参数控制 */}
              <div className="quantum-controls">
                <Title level={5}>量子参数</Title>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div className="control-item">
                    <Space>
                      <Button 
                        type={isPlaying ? 'primary' : 'default'}
                        icon={isPlaying ? <PauseOutlined /> : <PlayCircleOutlined />}
                        onClick={toggleAnimation}
                      >
                        {isPlaying ? '暂停' : '启动'}
                      </Button>
                      <Button icon={<ReloadOutlined />} onClick={resetQuantumSystem}>
                        重置
                      </Button>
                    </Space>
                  </div>
                  
                  <div className="control-item">
                    <Text>时间流速</Text>
                    <Slider
                      min={0.1}
                      max={3}
                      step={0.1}
                      value={animationSpeed}
                      onChange={setAnimationSpeed}
                      marks={{ 0.5: '慢', 1: '正常', 2: '快' }}
                    />
                  </div>

                  <div className="control-item">
                    <Text>粒子数量</Text>
                    <Slider
                      min={10}
                      max={100}
                      step={10}
                      value={particleCount}
                      onChange={setParticleCount}
                      marks={{ 20: '少', 50: '中', 80: '多' }}
                    />
                  </div>

                  {activeTab === 'entanglement' && (
                    <div className="control-item">
                      <Text>纠缠强度</Text>
                      <Slider
                        min={0.1}
                        max={1}
                        step={0.1}
                        value={entanglementStrength}
                        onChange={setEntanglementStrength}
                        marks={{ 0.3: '弱', 0.6: '中', 0.9: '强' }}
                      />
                    </div>
                  )}

                  <div className="control-item">
                    <Space>
                      <Text>量子场</Text>
                      <Switch 
                        checked={quantumField} 
                        onChange={setQuantumField}
                        checkedChildren="开"
                        unCheckedChildren="关"
                      />
                    </Space>
                  </div>

                  <div className="control-item">
                    <Text>视觉模式</Text>
                    <Select 
                      value={visualMode} 
                      onChange={setVisualMode}
                      style={{ width: '100%' }}
                    >
                      <Option value="particles">粒子模式</Option>
                      <Option value="waves">波动模式</Option>
                      <Option value="field">场模式</Option>
                      <Option value="hybrid">混合模式</Option>
                    </Select>
                  </div>
                </Space>
              </div>

              {/* 物理原理 */}
              <div className="physics-principle">
                <Title level={5}>物理原理</Title>
                <Text style={{ fontSize: '12px', lineHeight: '1.6' }}>
                  {currentEffect.physics}
                </Text>
              </div>

              {/* 关键特性 */}
              <div className="quantum-features">
                <Title level={5}>关键特性</Title>
                <ul style={{ margin: 0, paddingLeft: '16px' }}>
                  {currentEffect.features.map((feature, index) => (
                    <li key={index} style={{ marginBottom: '4px' }}>
                      <Text style={{ fontSize: '12px' }}>{feature}</Text>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 量子状态指示器 */}
              <div className="quantum-status">
                <Title level={5}>系统状态</Title>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div className="status-item">
                    <Text>相干性: </Text>
                    <span className="status-indicator coherent">●</span>
                    <Text> 保持</Text>
                  </div>
                  <div className="status-item">
                    <Text>纠缠度: </Text>
                    <span className="status-indicator entangled">●</span>
                    <Text> {Math.round(entanglementStrength * 100)}%</Text>
                  </div>
                  <div className="status-item">
                    <Text>量子场: </Text>
                    <span className={`status-indicator ${quantumField ? 'active' : 'inactive'}`}>●</span>
                    <Text> {quantumField ? '激活' : '关闭'}</Text>
                  </div>
                </Space>
              </div>
            </Space>
          </Card>
        </Col>

        {/* 右侧量子效果展示区域 */}
        <Col xs={24} lg={18}>
          <Card className="quantum-display-area">
            <Tabs 
              activeKey={activeTab} 
              onChange={handleTabChange}
              size="large"
              tabBarExtraContent={
                <Space>
                  <Button icon={<SettingOutlined />} type="text">高级设置</Button>
                  <Button icon={<ExperimentOutlined />} type="text">实验模式</Button>
                </Space>
              }
            >
              <TabPane tab={
                <Space>
                  <span>🔗</span>
                  <span>量子纠缠</span>
                </Space>
              } key="entanglement">
                <QuantumEntanglementViz 
                  isPlaying={isPlaying}
                  animationSpeed={animationSpeed}
                  particleCount={particleCount}
                  entanglementStrength={entanglementStrength}
                  quantumField={quantumField}
                  visualMode={visualMode}
                  season={currentSeason}
                />
              </TabPane>

              <TabPane tab={
                <Space>
                  <span>🌊</span>
                  <span>波函数坍缩</span>
                </Space>
              } key="wavefunction">
                <WaveFunctionCollapse 
                  isPlaying={isPlaying}
                  animationSpeed={animationSpeed}
                  quantumField={quantumField}
                  visualMode={visualMode}
                  season={currentSeason}
                />
              </TabPane>

              <TabPane tab={
                <Space>
                  <span>🚇</span>
                  <span>量子隧道</span>
                </Space>
              } key="tunneling">
                <QuantumTunneling 
                  isPlaying={isPlaying}
                  animationSpeed={animationSpeed}
                  particleCount={particleCount}
                  quantumField={quantumField}
                  visualMode={visualMode}
                  season={currentSeason}
                />
              </TabPane>

              <TabPane tab={
                <Space>
                  <span>⚛️</span>
                  <span>量子叠加</span>
                </Space>
              } key="superposition">
                <QuantumSuperposition 
                  isPlaying={isPlaying}
                  animationSpeed={animationSpeed}
                  particleCount={particleCount}
                  quantumField={quantumField}
                  visualMode={visualMode}
                  season={currentSeason}
                />
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>

      {/* 量子知识卡片 */}
      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24} md={8}>
          <Card title="🎓 量子力学基础" size="small">
            <Text style={{ fontSize: '12px', lineHeight: '1.6' }}>
              量子力学是描述微观世界的物理理论，揭示了粒子的波粒二象性、不确定性原理等奇妙现象。
              在量子世界中，观测行为会影响系统状态，粒子可以同时处于多个状态。
            </Text>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="🔬 实验应用" size="small">
            <Text style={{ fontSize: '12px', lineHeight: '1.6' }}>
              量子纠缠被应用于量子计算、量子通信和量子密码学等前沿技术。
              量子计算机利用量子叠加和纠缠实现超越经典计算机的计算能力。
            </Text>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="🌟 未来展望" size="small">
            <Text style={{ fontSize: '12px', lineHeight: '1.6' }}>
              量子技术将革命性地改变信息处理、通信安全和科学计算等领域。
              量子互联网、量子雷达等技术正在从理论走向实用。
            </Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default QuantumEntanglement;
