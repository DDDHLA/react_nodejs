import React, { useEffect, useRef, useState } from 'react';
import { Typography, Space, Button } from 'antd';
import { ThunderboltOutlined, ReloadOutlined } from '@ant-design/icons';
import { SeasonType } from '@/components/SeasonalTheme';
import './QuantumEntanglementViz.less';

const { Text } = Typography;

interface QuantumEntanglementVizProps {
  isPlaying: boolean;
  animationSpeed: number;
  particleCount: number;
  entanglementStrength: number;
  quantumField: boolean;
  visualMode: string;
  season: SeasonType;
}

interface QuantumParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  spin: number;
  entangledWith: number | null;
  phase: number;
  amplitude: number;
  color: string;
  size: number;
  energy: number;
  waveFunction: number[];
}

const QuantumEntanglementViz: React.FC<QuantumEntanglementVizProps> = ({
  isPlaying,
  animationSpeed,
  particleCount,
  entanglementStrength,
  quantumField,
  visualMode,
  season
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<QuantumParticle[]>([]);
  const [entangledPairs, setEntangledPairs] = useState(0);
  const [quantumCoherence, setQuantumCoherence] = useState(1.0);

  // 季节量子颜色配置
  const getQuantumColors = (season: SeasonType) => {
    const colorSets = {
      spring: {
        primary: '#52c41a',
        secondary: '#73d13d',
        entangled: '#ff85c0',
        field: 'rgba(82, 196, 26, 0.1)'
      },
      summer: {
        primary: '#1890ff',
        secondary: '#40a9ff',
        entangled: '#fadb14',
        field: 'rgba(24, 144, 255, 0.1)'
      },
      autumn: {
        primary: '#fa8c16',
        secondary: '#ffa940',
        entangled: '#d4380d',
        field: 'rgba(250, 140, 22, 0.1)'
      },
      winter: {
        primary: '#722ed1',
        secondary: '#9254de',
        entangled: '#13c2c2',
        field: 'rgba(114, 46, 209, 0.1)'
      }
    };
    return colorSets[season] || colorSets.winter;
  };

  const colors = getQuantumColors(season);

  // 初始化量子粒子
  const initQuantumParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const particles: QuantumParticle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(createQuantumParticle(i, canvas.width, canvas.height));
    }

    // 创建纠缠对
    createEntanglementPairs(particles);
    particlesRef.current = particles;
  };

  // 创建量子粒子
  const createQuantumParticle = (id: number, width: number, height: number): QuantumParticle => {
    return {
      id,
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      spin: Math.random() * Math.PI * 2,
      entangledWith: null,
      phase: Math.random() * Math.PI * 2,
      amplitude: Math.random() * 0.5 + 0.5,
      color: Math.random() > 0.5 ? colors.primary : colors.secondary,
      size: Math.random() * 4 + 2,
      energy: Math.random() * 100 + 50,
      waveFunction: Array(8).fill(0).map(() => Math.random() * 2 - 1)
    };
  };

  // 创建纠缠对
  const createEntanglementPairs = (particles: QuantumParticle[]) => {
    const availableParticles = [...particles];
    let pairCount = 0;

    while (availableParticles.length >= 2 && pairCount < particleCount * entanglementStrength / 2) {
      const particle1Index = Math.floor(Math.random() * availableParticles.length);
      const particle1 = availableParticles.splice(particle1Index, 1)[0];
      
      const particle2Index = Math.floor(Math.random() * availableParticles.length);
      const particle2 = availableParticles.splice(particle2Index, 1)[0];

      // 建立纠缠关系
      particle1.entangledWith = particle2.id;
      particle2.entangledWith = particle1.id;
      particle1.color = colors.entangled;
      particle2.color = colors.entangled;

      pairCount++;
    }

    setEntangledPairs(pairCount);
  };

  // 更新量子粒子
  const updateQuantumParticles = (canvas: HTMLCanvasElement) => {
    const particles = particlesRef.current;
    let coherenceSum = 0;

    particles.forEach((particle, index) => {
      // 基础量子运动
      particle.x += particle.vx * animationSpeed;
      particle.y += particle.vy * animationSpeed;
      particle.phase += 0.05 * animationSpeed;
      particle.spin += 0.02 * animationSpeed;

      // 量子波动效果
      const waveX = Math.sin(particle.phase) * particle.amplitude * 10;
      const waveY = Math.cos(particle.phase * 1.3) * particle.amplitude * 8;
      particle.x += waveX * 0.1;
      particle.y += waveY * 0.1;

      // 纠缠效应
      if (particle.entangledWith !== null) {
        const entangledParticle = particles.find(p => p.id === particle.entangledWith);
        if (entangledParticle) {
          // 纠缠粒子的量子关联
          const distance = Math.sqrt(
            Math.pow(particle.x - entangledParticle.x, 2) + 
            Math.pow(particle.y - entangledParticle.y, 2)
          );

          // 瞬时关联效应
          if (Math.random() < 0.1) {
            particle.spin = -entangledParticle.spin; // 自旋反关联
            particle.phase = Math.PI - entangledParticle.phase; // 相位反关联
          }

          // 纠缠力
          const entanglementForce = entanglementStrength * 0.001;
          const dx = entangledParticle.x - particle.x;
          const dy = entangledParticle.y - particle.y;
          particle.vx += dx * entanglementForce;
          particle.vy += dy * entanglementForce;

          coherenceSum += Math.cos(particle.phase - entangledParticle.phase);
        }
      }

      // 量子场相互作用
      if (quantumField) {
        particles.forEach((otherParticle, otherIndex) => {
          if (index !== otherIndex) {
            const dx = otherParticle.x - particle.x;
            const dy = otherParticle.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100 && distance > 0) {
              const fieldStrength = 1 / (distance * distance) * 1000;
              particle.vx += (dx / distance) * fieldStrength * 0.001;
              particle.vy += (dy / distance) * fieldStrength * 0.001;
            }
          }
        });
      }

      // 边界处理（量子隧道效应）
      if (particle.x < 0) {
        if (Math.random() < 0.1) {
          particle.x = canvas.width; // 量子隧道穿越
        } else {
          particle.vx *= -0.8;
        }
      }
      if (particle.x > canvas.width) {
        if (Math.random() < 0.1) {
          particle.x = 0;
        } else {
          particle.vx *= -0.8;
        }
      }
      if (particle.y < 0) {
        if (Math.random() < 0.1) {
          particle.y = canvas.height;
        } else {
          particle.vy *= -0.8;
        }
      }
      if (particle.y > canvas.height) {
        if (Math.random() < 0.1) {
          particle.y = 0;
        } else {
          particle.vy *= -0.8;
        }
      }

      // 更新波函数
      particle.waveFunction = particle.waveFunction.map((val, i) => 
        Math.sin(particle.phase + i * Math.PI / 4) * particle.amplitude
      );
    });

    // 更新量子相干性
    const avgCoherence = entangledPairs > 0 ? coherenceSum / (entangledPairs * 2) : 1;
    setQuantumCoherence(Math.abs(avgCoherence));
  };

  // 渲染量子效果
  const renderQuantumEffect = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制量子场背景
    if (quantumField) {
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
      );
      gradient.addColorStop(0, colors.field);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const particles = particlesRef.current;

    // 绘制纠缠连接线
    particles.forEach(particle => {
      if (particle.entangledWith !== null) {
        const entangledParticle = particles.find(p => p.id === particle.entangledWith);
        if (entangledParticle && particle.id < entangledParticle.id) { // 避免重复绘制
          drawEntanglementConnection(ctx, particle, entangledParticle);
        }
      }
    });

    // 绘制量子粒子
    particles.forEach(particle => {
      drawQuantumParticle(ctx, particle);
    });

    // 绘制量子信息
    drawQuantumInfo(ctx, canvas);
  };

  // 绘制纠缠连接
  const drawEntanglementConnection = (
    ctx: CanvasRenderingContext2D, 
    particle1: QuantumParticle, 
    particle2: QuantumParticle
  ) => {
    const distance = Math.sqrt(
      Math.pow(particle1.x - particle2.x, 2) + 
      Math.pow(particle1.y - particle2.y, 2)
    );

    // 纠缠强度随距离变化
    const connectionStrength = Math.max(0, 1 - distance / 300) * entanglementStrength;
    
    if (connectionStrength > 0) {
      ctx.save();
      ctx.strokeStyle = colors.entangled;
      ctx.lineWidth = connectionStrength * 3;
      ctx.globalAlpha = connectionStrength * 0.8;

      // 绘制波动连接线
      ctx.beginPath();
      ctx.moveTo(particle1.x, particle1.y);
      
      const midX = (particle1.x + particle2.x) / 2;
      const midY = (particle1.y + particle2.y) / 2;
      const waveOffset = Math.sin(particle1.phase) * 20 * connectionStrength;
      
      ctx.quadraticCurveTo(midX, midY + waveOffset, particle2.x, particle2.y);
      ctx.stroke();

      // 绘制量子信息传输效果
      const progress = (Math.sin(particle1.phase * 2) + 1) / 2;
      const infoX = particle1.x + (particle2.x - particle1.x) * progress;
      const infoY = particle1.y + (particle2.y - particle1.y) * progress + waveOffset * progress;
      
      ctx.fillStyle = colors.entangled;
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(infoX, infoY, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  };

  // 绘制量子粒子
  const drawQuantumParticle = (ctx: CanvasRenderingContext2D, particle: QuantumParticle) => {
    ctx.save();

    // 根据视觉模式选择渲染方式
    switch (visualMode) {
      case 'waves':
        drawWaveParticle(ctx, particle);
        break;
      case 'field':
        drawFieldParticle(ctx, particle);
        break;
      case 'hybrid':
        drawWaveParticle(ctx, particle);
        drawFieldParticle(ctx, particle);
        break;
      default:
        drawClassicParticle(ctx, particle);
    }

    ctx.restore();
  };

  // 绘制经典粒子模式
  const drawClassicParticle = (ctx: CanvasRenderingContext2D, particle: QuantumParticle) => {
    // 粒子光晕
    const glowGradient = ctx.createRadialGradient(
      particle.x, particle.y, 0,
      particle.x, particle.y, particle.size * 4
    );
    glowGradient.addColorStop(0, particle.color);
    glowGradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = glowGradient;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size * 4, 0, Math.PI * 2);
    ctx.fill();

    // 粒子核心
    ctx.fillStyle = particle.color;
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();

    // 自旋指示器
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size + 2, particle.spin, particle.spin + Math.PI);
    ctx.stroke();
  };

  // 绘制波动粒子模式
  const drawWaveParticle = (ctx: CanvasRenderingContext2D, particle: QuantumParticle) => {
    ctx.strokeStyle = particle.color;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.7;

    // 绘制波函数
    for (let i = 0; i < particle.waveFunction.length; i++) {
      const angle = (i / particle.waveFunction.length) * Math.PI * 2;
      const radius = particle.size + Math.abs(particle.waveFunction[i]) * 10;
      const x = particle.x + Math.cos(angle + particle.phase) * radius;
      const y = particle.y + Math.sin(angle + particle.phase) * radius;

      if (i === 0) {
        ctx.beginPath();
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.stroke();
  };

  // 绘制场粒子模式
  const drawFieldParticle = (ctx: CanvasRenderingContext2D, particle: QuantumParticle) => {
    const fieldGradient = ctx.createRadialGradient(
      particle.x, particle.y, 0,
      particle.x, particle.y, particle.size * 6
    );
    fieldGradient.addColorStop(0, particle.color + '80');
    fieldGradient.addColorStop(0.5, particle.color + '40');
    fieldGradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = fieldGradient;
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size * 6, 0, Math.PI * 2);
    ctx.fill();
  };

  // 绘制量子信息
  const drawQuantumInfo = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.fillStyle = colors.primary;
    ctx.font = '14px monospace';
    ctx.fillText(`纠缠对: ${entangledPairs}`, 20, 30);
    ctx.fillText(`相干性: ${quantumCoherence.toFixed(3)}`, 20, 50);
    ctx.fillText(`粒子数: ${particleCount}`, 20, 70);
  };

  // 测量粒子（波函数坍缩）
  const measureParticle = () => {
    const particles = particlesRef.current;
    const randomParticle = particles[Math.floor(Math.random() * particles.length)];
    
    // 模拟测量导致的波函数坍缩
    randomParticle.waveFunction = randomParticle.waveFunction.map(() => 
      Math.random() > 0.5 ? 1 : -1
    );
    randomParticle.phase = Math.random() * Math.PI * 2;
    
    // 如果有纠缠粒子，瞬时影响其状态
    if (randomParticle.entangledWith !== null) {
      const entangledParticle = particles.find(p => p.id === randomParticle.entangledWith);
      if (entangledParticle) {
        entangledParticle.waveFunction = randomParticle.waveFunction.map(val => -val);
        entangledParticle.phase = Math.PI - randomParticle.phase;
      }
    }
  };

  // 动画循环
  const animate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (!canvas || !ctx) return;

    updateQuantumParticles(canvas);
    renderQuantumEffect(ctx, canvas);

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  // 调整画布大小
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      initQuantumParticles();
    }
  };

  // 初始化和清理
  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // 参数变化时重新初始化
  useEffect(() => {
    initQuantumParticles();
  }, [particleCount, entanglementStrength, season]);

  // 播放状态变化时控制动画
  useEffect(() => {
    if (isPlaying) {
      animate();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, animationSpeed, visualMode, quantumField]);

  return (
    <div className={`quantum-entanglement-viz season-${season}`}>
      {/* 量子控制 */}
      <div className="quantum-viz-controls">
        <Space>
          <Button 
            type="primary" 
            icon={<ThunderboltOutlined />}
            onClick={measureParticle}
          >
            量子测量
          </Button>
          <Button 
            icon={<ReloadOutlined />}
            onClick={initQuantumParticles}
          >
            重新纠缠
          </Button>
          <Text>点击"量子测量"观察波函数坍缩效应</Text>
        </Space>
      </div>

      {/* 量子效果画布 */}
      <div className="quantum-canvas-container">
        <canvas
          ref={canvasRef}
          className="quantum-canvas"
        />
        
        {/* 量子状态覆盖层 */}
        <div className="quantum-overlay">
          <div className="quantum-stats">
            <Text style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              🔗 纠缠对: {entangledPairs} | 
              📊 相干性: {(quantumCoherence * 100).toFixed(1)}% | 
              ⚛️ 模式: {visualMode}
            </Text>
          </div>
        </div>
      </div>

      {/* 量子现象说明 */}
      <div className="quantum-explanation">
        <Text type="secondary">
          💡 量子纠缠：观察粒子间的神秘关联，纠缠粒子会瞬时影响彼此的状态，无论距离多远。
          点击"量子测量"可以观察到测量对量子系统的影响。
        </Text>
      </div>
    </div>
  );
};

export default QuantumEntanglementViz;
