import React, { useEffect, useState } from 'react';
import { useSeasonalTheme } from './index';
import './ParticleEffect.less';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

const ParticleEffect: React.FC = () => {
  const { currentSeason, themeConfig } = useSeasonalTheme();
  const [particles, setParticles] = useState<Particle[]>([]);

  // 获取季节对应的粒子字符
  const getParticleChar = (season: string) => {
    switch (season) {
      case 'winter': return ['❄️', '❅', '❆'];
      case 'autumn': return ['🍂', '🍁', '🍃'];
      case 'spring': return ['🌸', '🌺', '🌼'];
      case 'summer': return ['✨', '💫', '⭐'];
      default: return ['✨'];
    }
  };

  // 初始化粒子
  useEffect(() => {
    const particleCount = themeConfig.particles.count;
    const newParticles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight - window.innerHeight,
        size: Math.random() * 0.8 + 0.5,
        speed: Math.random() * 2 + 1,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 4,
        opacity: Math.random() * 0.6 + 0.4
      });
    }

    setParticles(newParticles);
  }, [currentSeason, themeConfig.particles.count]);

  // 动画循环
  useEffect(() => {
    let animationId: number;

    const animate = () => {
      setParticles(prevParticles => 
        prevParticles.map(particle => {
          let newY = particle.y + particle.speed;
          let newX = particle.x;
          const newRotation = particle.rotation + particle.rotationSpeed;

          // 添加季节特定的运动模式
          if (currentSeason === 'autumn' || currentSeason === 'spring') {
            // 叶子和花瓣的摆动效果
            newX += Math.sin(newY * 0.01) * 0.5;
          } else if (currentSeason === 'winter') {
            // 雪花的飘摇效果
            newX += Math.sin(newY * 0.008) * 0.3;
          } else if (currentSeason === 'summer') {
            // 光粒子的闪烁效果
            newX += Math.sin(newY * 0.005) * 0.2;
          }

          // 重置位置当粒子落到底部
          if (newY > window.innerHeight + 50) {
            newY = -50;
            newX = Math.random() * window.innerWidth;
          }

          // 边界检查
          if (newX < -50) newX = window.innerWidth + 50;
          if (newX > window.innerWidth + 50) newX = -50;

          return {
            ...particle,
            x: newX,
            y: newY,
            rotation: newRotation
          };
        })
      );

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [currentSeason]);

  const particleChars = getParticleChar(currentSeason);

  return (
    <div className={`particle-effect season-${currentSeason}`}>
      {particles.map(particle => (
        <div
          key={particle.id}
          className={`particle particle-${currentSeason}`}
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            transform: `scale(${particle.size}) rotate(${particle.rotation}deg)`,
            opacity: particle.opacity,
            color: themeConfig.particles.color
          }}
        >
          {particleChars[particle.id % particleChars.length]}
        </div>
      ))}
    </div>
  );
};

export default ParticleEffect;
