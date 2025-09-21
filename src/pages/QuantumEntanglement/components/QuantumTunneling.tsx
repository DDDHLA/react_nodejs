import React from 'react';
import { Typography } from 'antd';
import { SeasonType } from '@/components/SeasonalTheme';

const { Title, Text } = Typography;

interface QuantumTunnelingProps {
  isPlaying: boolean;
  animationSpeed: number;
  particleCount: number;
  quantumField: boolean;
  visualMode: string;
  season: SeasonType;
}

const QuantumTunneling: React.FC<QuantumTunnelingProps> = ({
  isPlaying,
  animationSpeed,
  particleCount,
  quantumField,
  visualMode,
  season
}) => {
  return (
    <div className="quantum-tunneling" style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: 'linear-gradient(135deg, rgba(250, 140, 22, 0.1) 0%, rgba(212, 56, 13, 0.05) 100%)'
    }}>
      <Title level={2} style={{ color: '#fa8c16', marginBottom: '24px' }}>
        🚇 量子隧道效应
      </Title>
      <Text style={{ fontSize: '16px', textAlign: 'center', maxWidth: '600px', lineHeight: '1.8' }}>
        量子隧道是量子力学中的一个奇妙现象，粒子可以"穿越"经典物理学认为不可能穿越的能量势垒。
        这个效应在现代电子学中有重要应用，如隧道二极管和扫描隧道显微镜。
      </Text>
      <div style={{ marginTop: '32px', padding: '20px', background: 'rgba(255, 255, 255, 0.8)', borderRadius: '12px' }}>
        <Text type="secondary">
          🔧 此组件正在开发中，将展示粒子穿越势垒的动画效果...
        </Text>
      </div>
    </div>
  );
};

export default QuantumTunneling;
