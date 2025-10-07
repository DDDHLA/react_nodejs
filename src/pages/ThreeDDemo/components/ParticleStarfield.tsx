import React, { useEffect, useRef, useState } from 'react';
import { Button, Space, Typography, Slider } from 'antd';
import { PlayCircleOutlined, PauseOutlined, ReloadOutlined } from '@ant-design/icons';
import { SeasonType } from '@/components/SeasonalTheme';
import './ParticleStarfield.less';

const { Text } = Typography;

interface ParticleStarfieldProps {
  season: SeasonType;
  isPlaying: boolean;
  animationSpeed: number;
  particleCount: number;
}

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  color: string;
  opacity: number;
  life: number;
  maxLife: number;
}

const ParticleStarfield: React.FC<ParticleStarfieldProps> = ({ 
  season, 
  isPlaying, 
  animationSpeed, 
  particleCount 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // 季节颜色配置
  const getSeasonalColors = (season: SeasonType) => {
    const colorSets = {
      spring: ['#52c41a', '#73d13d', '#95de64', '#b7eb8f', '#ff85c0', '#ffc0cb'],
      summer: ['#1890ff', '#40a9ff', '#69c0ff', '#91d5ff', '#fadb14', '#ffd666'],
      autumn: ['#fa8c16', '#ffa940', '#ffbb96', '#ffd591', '#d4380d', '#f5222d'],
      winter: ['#722ed1', '#9254de', '#b37feb', '#d3adf7', '#13c2c2', '#36cfc9']
    };
    return colorSets[season] || colorSets.spring;
  };

  const colors = getSeasonalColors(season);

  // 初始化粒子
  const initParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(canvas.width, canvas.height));
    }
    particlesRef.current = particles;
  };

  // 创建单个粒子
  const createParticle = (width: number, height: number): Particle => {
    const maxLife = 200 + Math.random() * 300;
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 1000,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      vz: Math.random() * 5 + 1,
      size: Math.random() * 3 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.8 + 0.2,
      life: maxLife,
      maxLife
    };
  };

  // 更新粒子
  const updateParticles = (canvas: HTMLCanvasElement) => {
    const particles = particlesRef.current;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    particles.forEach((particle, index) => {
      // 基础运动
      particle.x += particle.vx * animationSpeed;
      particle.y += particle.vy * animationSpeed;
      particle.z -= particle.vz * animationSpeed;

      // 鼠标交互效果
      const dx = mousePos.x - particle.x;
      const dy = mousePos.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        const force = (100 - distance) / 100;
        particle.vx += (dx / distance) * force * 0.1;
        particle.vy += (dy / distance) * force * 0.1;
      }

      // 季节特定运动模式
      switch (season) {
        case 'spring':
          // 春天：花瓣飘舞效果
          particle.x += Math.sin(particle.life * 0.02) * 0.5;
          particle.y += Math.cos(particle.life * 0.015) * 0.3;
          break;
        case 'summer':
          // 夏天：闪烁星光效果
          particle.opacity = 0.3 + Math.sin(particle.life * 0.05) * 0.5;
          particle.size = particle.size + Math.sin(particle.life * 0.1) * 0.5;
          break;
        case 'autumn':
          // 秋天：叶子飘落效果
          particle.x += Math.sin(particle.y * 0.01) * 0.8;
          particle.vy += 0.02;
          break;
        case 'winter':
          // 冬天：雪花飘摇效果
          particle.x += Math.sin(particle.y * 0.008) * 0.4;
          particle.vx *= 0.99;
          particle.vy *= 0.99;
          break;
      }

      // 生命周期
      particle.life--;
      if (particle.life <= 0 || particle.z <= 0) {
        particles[index] = createParticle(canvas.width, canvas.height);
      }

      // 边界检查
      if (particle.x < 0 || particle.x > canvas.width) {
        particle.vx *= -0.8;
      }
      if (particle.y < 0 || particle.y > canvas.height) {
        particle.vy *= -0.8;
      }
    });
  };

  // 渲染粒子
  const renderParticles = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制背景渐变
    const gradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
    );
    
    switch (season) {
      case 'spring':
        gradient.addColorStop(0, 'rgba(232, 245, 232, 0.1)');
        gradient.addColorStop(1, 'rgba(240, 255, 240, 0.05)');
        break;
      case 'summer':
        gradient.addColorStop(0, 'rgba(135, 206, 235, 0.1)');
        gradient.addColorStop(1, 'rgba(176, 224, 230, 0.05)');
        break;
      case 'autumn':
        gradient.addColorStop(0, 'rgba(255, 213, 154, 0.1)');
        gradient.addColorStop(1, 'rgba(255, 231, 186, 0.05)');
        break;
      case 'winter':
        gradient.addColorStop(0, 'rgba(230, 247, 255, 0.1)');
        gradient.addColorStop(1, 'rgba(240, 245, 255, 0.05)');
        break;
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制粒子
    particlesRef.current.forEach(particle => {
      const scale = 1000 / (1000 - particle.z);
      const x = particle.x;
      const y = particle.y;
      const size = particle.size * scale;
      const opacity = particle.opacity * (particle.life / particle.maxLife);

      ctx.save();
      ctx.globalAlpha = opacity;
      
      // 绘制粒子光晕
      const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
      glowGradient.addColorStop(0, particle.color);
      glowGradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(x, y, size * 3, 0, Math.PI * 2);
      ctx.fill();
      
      // 绘制粒子核心
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      
      // 绘制粒子闪烁效果
      if (season === 'summer' || season === 'winter') {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - size * 2, y);
        ctx.lineTo(x + size * 2, y);
        ctx.moveTo(x, y - size * 2);
        ctx.lineTo(x, y + size * 2);
        ctx.stroke();
      }
      
      ctx.restore();
    });

    // 绘制连接线
    if (season === 'winter') {
      drawConnections(ctx);
    }
  };

  // 绘制粒子连接线（冬天特效）
  const drawConnections = (ctx: CanvasRenderingContext2D) => {
    const particles = particlesRef.current;
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 80) {
          const opacity = (80 - distance) / 80 * 0.3;
          ctx.strokeStyle = `rgba(114, 46, 209, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  };

  // 动画循环
  const animate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (!canvas || !ctx) return;

    updateParticles(canvas);
    renderParticles(ctx, canvas);

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  // 处理鼠标移动
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    setMousePos({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });
  };

  // 重置粒子系统
  const resetParticles = () => {
    initParticles();
  };

  // 调整画布大小
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      initParticles();
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

  // 粒子数量变化时重新初始化
  useEffect(() => {
    initParticles();
  }, [particleCount, season]);

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
  }, [isPlaying, animationSpeed, season]);

  return (
    <div className={`particle-starfield season-${season}`}>
      {/* 控制面板 */}
      <div className="starfield-controls">
        <Space>
          <Button 
            type="primary" 
            icon={<ReloadOutlined />}
            onClick={resetParticles}
          >
            重置
          </Button>
          <Text>鼠标移动可与粒子交互</Text>
        </Space>
      </div>

      {/* 3D粒子画布 */}
      <div className="starfield-container">
        <canvas
          ref={canvasRef}
          className="starfield-canvas"
          onMouseMove={handleMouseMove}
        />
        
        {/* 季节信息覆盖层 */}
        <div className="season-overlay">
          <div className="season-info">
            <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              {season === 'spring' && '🌸 朝霓：花瓣飘舞的粒子效果'}
              {season === 'summer' && '⭐ 烈阳：闪烁星光的粒子效果'}
              {season === 'autumn' && '🍂 落霓：叶子飘落的粒子效果'}
              {season === 'winter' && '❄️ 星辰：雪花连线的粒子效果'}
            </Text>
          </div>
        </div>
      </div>

      {/* 提示信息 */}
      <div className="starfield-hint">
        <Text type="secondary">
          💡 移动鼠标与粒子互动，粒子会根据季节主题展现不同的运动模式和视觉效果
        </Text>
      </div>
    </div>
  );
};

export default ParticleStarfield;
