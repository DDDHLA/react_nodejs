import React from 'react';
import './LightSource.less';

interface LightSourceProps {
  position: { x: number; y: number };
  intensity: number;
  radius: number;
  color: string;
  animated: boolean;
}

const LightSource: React.FC<LightSourceProps> = ({
  position,
  intensity,
  radius,
  color,
  animated
}) => {
  // 颜色转换辅助函数
  const getColorValue = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'white': '#ffffff',
      'red': '#ff6b6b',
      'green': '#51cf66',
      'blue': '#339af0',
      'yellow': '#ffd43b',
      'cyan': '#22b8cf',
      'magenta': '#f06595'
    };
    
    return colorMap[color.toLowerCase()] || color;
  };

  const lightColor = getColorValue(color);
  const lightSize = Math.max(20, Math.min(60, radius * 0.2 * intensity));
  const glowSize = lightSize * 2;

  const lightStyle: React.CSSProperties = {
    position: 'absolute',
    left: position.x - lightSize / 2,
    top: position.y - lightSize / 2,
    width: lightSize,
    height: lightSize,
    borderRadius: '50%',
    background: `radial-gradient(circle, ${lightColor} 0%, ${lightColor}80 30%, transparent 70%)`,
    boxShadow: `
      0 0 ${lightSize}px ${lightColor}40,
      0 0 ${glowSize}px ${lightColor}20,
      inset 0 0 ${lightSize * 0.3}px ${lightColor}60
    `,
    pointerEvents: 'none',
    zIndex: 1000,
    animation: animated ? 'lightPulse 2s ease-in-out infinite' : 'none',
    transform: `scale(${0.8 + intensity * 0.4})`,
    transition: 'all 0.3s ease'
  };

  const outerGlowStyle: React.CSSProperties = {
    position: 'absolute',
    left: position.x - glowSize / 2,
    top: position.y - glowSize / 2,
    width: glowSize,
    height: glowSize,
    borderRadius: '50%',
    background: `radial-gradient(circle, transparent 0%, ${lightColor}10 50%, transparent 100%)`,
    pointerEvents: 'none',
    zIndex: 999,
    animation: animated ? 'glowPulse 3s ease-in-out infinite' : 'none',
    opacity: intensity * 0.6
  };

  return (
    <>
      {/* 外层光晕 */}
      <div style={outerGlowStyle} />
      
      {/* 主光源 */}
      <div style={lightStyle}>
        {/* 内部高光 */}
        <div 
          className="light-highlight"
          style={{
            position: 'absolute',
            top: '20%',
            left: '30%',
            width: '30%',
            height: '30%',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.8)',
            filter: 'blur(2px)'
          }}
        />
      </div>
    </>
  );
};

export default LightSource;
