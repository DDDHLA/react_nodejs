import React from 'react';
import { Typography } from 'antd';
import { SeasonType } from '@/components/SeasonalTheme';

const { Title, Text } = Typography;

interface QuantumSuperpositionProps {
  isPlaying: boolean;
  animationSpeed: number;
  particleCount: number;
  quantumField: boolean;
  visualMode: string;
  season: SeasonType;
}

const QuantumSuperposition: React.FC<QuantumSuperpositionProps> = ({
  isPlaying,
  animationSpeed,
  particleCount,
  quantumField,
  visualMode,
  season
}) => {
  return (
    <div className="quantum-superposition" style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: 'linear-gradient(135deg, rgba(82, 196, 26, 0.1) 0%, rgba(255, 133, 192, 0.05) 100%)'
    }}>
      <Title level={2} style={{ color: '#52c41a', marginBottom: '24px' }}>
        ⚛️ 量子叠加态
      </Title>
      <Text style={{ fontSize: '16px', textAlign: 'center', maxWidth: '600px', lineHeight: '1.8' }}>
        量子叠加是量子力学的核心概念，描述了量子系统可以同时处于多个可能状态的现象。
        著名的"薛定谔的猫"思想实验就是用来说明量子叠加态的奇异性质。
      </Text>
      <div style={{ marginTop: '32px', padding: '20px', background: 'rgba(255, 255, 255, 0.8)', borderRadius: '12px' }}>
        <Text type="secondary">
          🔧 此组件正在开发中，将展示量子态叠加和相干性的可视化效果...
        </Text>
      </div>
    </div>
  );
};

export default QuantumSuperposition;
