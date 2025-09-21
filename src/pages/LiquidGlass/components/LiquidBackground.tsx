import React, { useEffect, useRef } from 'react';
import './LiquidBackground.less';

interface LiquidBackgroundProps {
  isPlaying: boolean;
  animationSpeed: number;
  fluidIntensity: number;
  colors: {
    primary: string[];
    secondary: string[];
    gradient: string;
  };
  mousePosition: { x: number; y: number };
  liquidStyle: string;
}

interface FluidParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  opacity: number;
  life: number;
  maxLife: number;
}

const LiquidBackground: React.FC<LiquidBackgroundProps> = ({
  isPlaying,
  animationSpeed,
  fluidIntensity,
  colors,
  mousePosition,
  liquidStyle
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<FluidParticle[]>([]);
  const timeRef = useRef(0);

  // 初始化流体粒子
  const initFluidParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const particleCount = Math.floor(50 * fluidIntensity);
    const particles: FluidParticle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push(createFluidParticle(canvas.width, canvas.height));
    }

    particlesRef.current = particles;
  };

  // 创建流体粒子
  const createFluidParticle = (width: number, height: number): FluidParticle => {
    const colorArray = [...colors.primary, ...colors.secondary];
    const maxLife = 300 + Math.random() * 200;
    
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      radius: Math.random() * 60 + 20,
      color: colorArray[Math.floor(Math.random() * colorArray.length)],
      opacity: Math.random() * 0.3 + 0.1,
      life: maxLife,
      maxLife
    };
  };

  // 更新流体粒子
  const updateFluidParticles = (canvas: HTMLCanvasElement) => {
    const particles = particlesRef.current;
    timeRef.current += animationSpeed;

    particles.forEach((particle, index) => {
      // 基础运动
      particle.x += particle.vx * animationSpeed;
      particle.y += particle.vy * animationSpeed;

      // 液态样式特定运动
      switch (liquidStyle) {
        case 'fluid':
          // 流体运动：波动和涡流
          const waveX = Math.sin(timeRef.current * 0.01 + particle.x * 0.01) * fluidIntensity;
          const waveY = Math.cos(timeRef.current * 0.008 + particle.y * 0.01) * fluidIntensity;
          particle.x += waveX * 0.5;
          particle.y += waveY * 0.3;
          break;

        case 'glass':
          // 玻璃效果：缓慢飘动
          particle.vx += (Math.random() - 0.5) * 0.1 * fluidIntensity;
          particle.vy += (Math.random() - 0.5) * 0.1 * fluidIntensity;
          particle.vx *= 0.98;
          particle.vy *= 0.98;
          break;

        case 'morphism':
          // 拟态效果：有机形变
          const morphX = Math.sin(timeRef.current * 0.005 + index) * fluidIntensity * 2;
          const morphY = Math.cos(timeRef.current * 0.007 + index) * fluidIntensity * 2;
          particle.x += morphX * 0.3;
          particle.y += morphY * 0.3;
          break;

        case 'liquid':
          // 液态金属：快速流动
          particle.vx += Math.sin(timeRef.current * 0.02 + particle.y * 0.01) * fluidIntensity * 0.5;
          particle.vy += Math.cos(timeRef.current * 0.015 + particle.x * 0.01) * fluidIntensity * 0.5;
          break;
      }

      // 鼠标交互
      const mouseInfluence = 100 * fluidIntensity;
      const mouseX = mousePosition.x * canvas.width;
      const mouseY = mousePosition.y * canvas.height;
      const dx = mouseX - particle.x;
      const dy = mouseY - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouseInfluence) {
        const force = (mouseInfluence - distance) / mouseInfluence;
        const angle = Math.atan2(dy, dx);
        particle.vx += Math.cos(angle) * force * 0.5;
        particle.vy += Math.sin(angle) * force * 0.5;
      }

      // 边界处理
      if (particle.x < -particle.radius) {
        particle.x = canvas.width + particle.radius;
      } else if (particle.x > canvas.width + particle.radius) {
        particle.x = -particle.radius;
      }

      if (particle.y < -particle.radius) {
        particle.y = canvas.height + particle.radius;
      } else if (particle.y > canvas.height + particle.radius) {
        particle.y = -particle.radius;
      }

      // 生命周期
      particle.life--;
      if (particle.life <= 0) {
        particles[index] = createFluidParticle(canvas.width, canvas.height);
      }

      // 动态透明度
      const lifeFactor = particle.life / particle.maxLife;
      particle.opacity = (0.1 + Math.sin(timeRef.current * 0.01 + index) * 0.1) * lifeFactor;
    });
  };

  // 渲染液态背景
  const renderLiquidBackground = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制基础渐变背景
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    const baseColors = colors.primary;
    
    gradient.addColorStop(0, baseColors[0] + '20');
    gradient.addColorStop(0.5, baseColors[1] + '15');
    gradient.addColorStop(1, baseColors[2] + '10');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制流体粒子
    const particles = particlesRef.current;
    
    particles.forEach((particle, index) => {
      ctx.save();
      
      // 根据液态样式选择渲染方式
      switch (liquidStyle) {
        case 'fluid':
          renderFluidParticle(ctx, particle, index);
          break;
        case 'glass':
          renderGlassParticle(ctx, particle, index);
          break;
        case 'morphism':
          renderMorphismParticle(ctx, particle, index);
          break;
        case 'liquid':
          renderLiquidMetalParticle(ctx, particle, index);
          break;
      }
      
      ctx.restore();
    });

    // 绘制连接效果
    if (liquidStyle === 'morphism' || liquidStyle === 'liquid') {
      renderConnections(ctx, particles);
    }
  };

  // 渲染流体粒子
  const renderFluidParticle = (ctx: CanvasRenderingContext2D, particle: FluidParticle, index: number) => {
    const gradient = ctx.createRadialGradient(
      particle.x, particle.y, 0,
      particle.x, particle.y, particle.radius
    );
    
    gradient.addColorStop(0, particle.color + Math.floor(particle.opacity * 255).toString(16).padStart(2, '0'));
    gradient.addColorStop(0.7, particle.color + Math.floor(particle.opacity * 128).toString(16).padStart(2, '0'));
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fill();
  };

  // 渲染玻璃粒子
  const renderGlassParticle = (ctx: CanvasRenderingContext2D, particle: FluidParticle, index: number) => {
    ctx.globalAlpha = particle.opacity * 0.5;
    
    const gradient = ctx.createRadialGradient(
      particle.x, particle.y, 0,
      particle.x, particle.y, particle.radius
    );
    
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(0.5, particle.color + '40');
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // 高光效果
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.arc(particle.x - particle.radius * 0.3, particle.y - particle.radius * 0.3, particle.radius * 0.3, 0, Math.PI * 2);
    ctx.fill();
  };

  // 渲染拟态粒子
  const renderMorphismParticle = (ctx: CanvasRenderingContext2D, particle: FluidParticle, index: number) => {
    ctx.globalAlpha = particle.opacity;
    
    // 有机形状
    const points = 8;
    const angleStep = (Math.PI * 2) / points;
    
    ctx.beginPath();
    for (let i = 0; i <= points; i++) {
      const angle = i * angleStep + timeRef.current * 0.01;
      const radiusVariation = Math.sin(angle * 3 + timeRef.current * 0.02) * particle.radius * 0.3;
      const radius = particle.radius + radiusVariation;
      const x = particle.x + Math.cos(angle) * radius;
      const y = particle.y + Math.sin(angle) * radius;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    
    const gradient = ctx.createRadialGradient(
      particle.x, particle.y, 0,
      particle.x, particle.y, particle.radius
    );
    
    gradient.addColorStop(0, particle.color + '60');
    gradient.addColorStop(1, particle.color + '10');
    
    ctx.fillStyle = gradient;
    ctx.fill();
  };

  // 渲染液态金属粒子
  const renderLiquidMetalParticle = (ctx: CanvasRenderingContext2D, particle: FluidParticle, index: number) => {
    ctx.globalAlpha = particle.opacity;
    
    // 金属光泽效果
    const gradient = ctx.createLinearGradient(
      particle.x - particle.radius, particle.y - particle.radius,
      particle.x + particle.radius, particle.y + particle.radius
    );
    
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.3, particle.color + 'CC');
    gradient.addColorStop(0.7, particle.color + '80');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // 反射高光
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.ellipse(
      particle.x - particle.radius * 0.2, 
      particle.y - particle.radius * 0.3, 
      particle.radius * 0.4, 
      particle.radius * 0.2, 
      -Math.PI / 6, 
      0, 
      Math.PI * 2
    );
    ctx.fill();
  };

  // 渲染连接效果
  const renderConnections = (ctx: CanvasRenderingContext2D, particles: FluidParticle[]) => {
    ctx.globalAlpha = 0.3;
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 120) {
          const opacity = (120 - distance) / 120 * 0.5;
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
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

    updateFluidParticles(canvas);
    renderLiquidBackground(ctx, canvas);

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
      initFluidParticles();
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
    initFluidParticles();
  }, [fluidIntensity, colors, liquidStyle]);

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
  }, [isPlaying, animationSpeed, liquidStyle]);

  return (
    <canvas
      ref={canvasRef}
      className="liquid-background-canvas"
    />
  );
};

export default LiquidBackground;
