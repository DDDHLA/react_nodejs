import React, { useEffect, useRef } from 'react';
import './FluidAnimation.less';

interface FluidAnimationProps {
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

interface MetaBall {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  targetRadius: number;
  color: string;
  phase: number;
}

const FluidAnimation: React.FC<FluidAnimationProps> = ({
  isPlaying,
  animationSpeed,
  fluidIntensity,
  colors,
  mousePosition,
  liquidStyle
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const metaBallsRef = useRef<MetaBall[]>([]);
  const timeRef = useRef(0);

  // 初始化元球
  const initMetaBalls = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ballCount = Math.floor(8 * fluidIntensity);
    const balls: MetaBall[] = [];

    for (let i = 0; i < ballCount; i++) {
      balls.push(createMetaBall(canvas.width, canvas.height, i));
    }

    metaBallsRef.current = balls;
  };

  // 创建元球
  const createMetaBall = (width: number, height: number, index: number): MetaBall => {
    const colorArray = [...colors.primary, ...colors.secondary];
    
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      radius: 30 + Math.random() * 40,
      targetRadius: 30 + Math.random() * 40,
      color: colorArray[index % colorArray.length],
      phase: Math.random() * Math.PI * 2
    };
  };

  // 更新元球
  const updateMetaBalls = (canvas: HTMLCanvasElement) => {
    const balls = metaBallsRef.current;
    timeRef.current += 0.02 * animationSpeed;

    balls.forEach((ball, index) => {
      // 基础运动
      ball.x += ball.vx * animationSpeed;
      ball.y += ball.vy * animationSpeed;
      ball.phase += 0.05 * animationSpeed;

      // 液态样式特定行为
      switch (liquidStyle) {
        case 'fluid':
          // 流体运动：有机波动
          const fluidForceX = Math.sin(timeRef.current + ball.phase) * fluidIntensity * 0.5;
          const fluidForceY = Math.cos(timeRef.current * 1.3 + ball.phase) * fluidIntensity * 0.3;
          ball.vx += fluidForceX * 0.1;
          ball.vy += fluidForceY * 0.1;
          
          // 半径变化
          ball.targetRadius = 30 + Math.sin(timeRef.current + index) * 20 * fluidIntensity;
          break;

        case 'glass':
          // 玻璃效果：缓慢漂移
          ball.vx += (Math.random() - 0.5) * 0.05 * fluidIntensity;
          ball.vy += (Math.random() - 0.5) * 0.05 * fluidIntensity;
          ball.vx *= 0.99;
          ball.vy *= 0.99;
          
          ball.targetRadius = 40 + Math.sin(timeRef.current * 0.5 + index) * 10;
          break;

        case 'morphism':
          // 拟态效果：呼吸式变化
          const breathe = Math.sin(timeRef.current * 0.8 + index * 0.5) * fluidIntensity;
          ball.targetRadius = 35 + breathe * 25;
          
          // 轨道运动
          const orbitRadius = 50 * fluidIntensity;
          const orbitSpeed = timeRef.current * 0.3 + index;
          ball.vx += Math.cos(orbitSpeed) * 0.02;
          ball.vy += Math.sin(orbitSpeed) * 0.02;
          break;

        case 'liquid':
          // 液态金属：快速变形
          ball.targetRadius = 25 + Math.sin(timeRef.current * 2 + index) * 30 * fluidIntensity;
          
          // 磁性吸引效果
          balls.forEach((otherBall, otherIndex) => {
            if (index !== otherIndex) {
              const dx = otherBall.x - ball.x;
              const dy = otherBall.y - ball.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance < 100) {
                const force = (100 - distance) / 100 * 0.01 * fluidIntensity;
                ball.vx += (dx / distance) * force;
                ball.vy += (dy / distance) * force;
              }
            }
          });
          break;
      }

      // 平滑半径变化
      ball.radius += (ball.targetRadius - ball.radius) * 0.1;

      // 鼠标交互
      const mouseInfluence = 80;
      const mouseX = mousePosition.x * canvas.width;
      const mouseY = mousePosition.y * canvas.height;
      const dx = mouseX - ball.x;
      const dy = mouseY - ball.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouseInfluence) {
        const force = (mouseInfluence - distance) / mouseInfluence * 0.3;
        ball.vx += (dx / distance) * force;
        ball.vy += (dy / distance) * force;
        ball.targetRadius += force * 20;
      }

      // 边界反弹
      if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        ball.vx *= -0.8;
        ball.x = Math.max(ball.radius, Math.min(canvas.width - ball.radius, ball.x));
      }
      
      if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.vy *= -0.8;
        ball.y = Math.max(ball.radius, Math.min(canvas.height - ball.radius, ball.y));
      }

      // 速度限制
      const maxSpeed = 3 * fluidIntensity;
      const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
      if (speed > maxSpeed) {
        ball.vx = (ball.vx / speed) * maxSpeed;
        ball.vy = (ball.vy / speed) * maxSpeed;
      }
    });
  };

  // 渲染流体动画
  const renderFluidAnimation = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const balls = metaBallsRef.current;

    // 根据液态样式选择渲染方法
    switch (liquidStyle) {
      case 'fluid':
        renderMetaBallFluid(ctx, canvas, balls);
        break;
      case 'glass':
        renderGlassEffect(ctx, canvas, balls);
        break;
      case 'morphism':
        renderMorphismEffect(ctx, canvas, balls);
        break;
      case 'liquid':
        renderLiquidMetal(ctx, canvas, balls);
        break;
    }
  };

  // 渲染元球流体效果
  const renderMetaBallFluid = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, balls: MetaBall[]) => {
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;

    // 元球算法
    for (let x = 0; x < canvas.width; x += 2) {
      for (let y = 0; y < canvas.height; y += 2) {
        let sum = 0;
        let colorR = 0, colorG = 0, colorB = 0;

        balls.forEach(ball => {
          const dx = x - ball.x;
          const dy = y - ball.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 0) {
            const influence = (ball.radius * ball.radius) / (distance * distance);
            sum += influence;

            // 颜色混合
            const color = hexToRgb(ball.color);
            const weight = influence / sum;
            colorR += color.r * weight;
            colorG += color.g * weight;
            colorB += color.b * weight;
          }
        });

        if (sum > 1) {
          const index = (y * canvas.width + x) * 4;
          const alpha = Math.min(255, sum * 100);
          
          data[index] = colorR;     // R
          data[index + 1] = colorG; // G
          data[index + 2] = colorB; // B
          data[index + 3] = alpha;  // A
          
          // 填充相邻像素
          if (x + 1 < canvas.width) {
            const nextIndex = (y * canvas.width + x + 1) * 4;
            data[nextIndex] = colorR;
            data[nextIndex + 1] = colorG;
            data[nextIndex + 2] = colorB;
            data[nextIndex + 3] = alpha;
          }
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  // 渲染玻璃效果
  const renderGlassEffect = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, balls: MetaBall[]) => {
    balls.forEach(ball => {
      ctx.save();
      
      // 玻璃球效果
      const gradient = ctx.createRadialGradient(
        ball.x - ball.radius * 0.3, ball.y - ball.radius * 0.3, 0,
        ball.x, ball.y, ball.radius
      );
      
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(0.3, ball.color + '60');
      gradient.addColorStop(0.7, ball.color + '30');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();
      
      // 高光
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.beginPath();
      ctx.arc(ball.x - ball.radius * 0.3, ball.y - ball.radius * 0.3, ball.radius * 0.2, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    });
  };

  // 渲染拟态效果
  const renderMorphismEffect = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, balls: MetaBall[]) => {
    balls.forEach(ball => {
      ctx.save();
      ctx.globalAlpha = 0.8;
      
      // 有机形状
      const points = 12;
      const angleStep = (Math.PI * 2) / points;
      
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const angle = i * angleStep + ball.phase;
        const radiusVariation = Math.sin(angle * 2 + timeRef.current) * ball.radius * 0.2;
        const radius = ball.radius + radiusVariation;
        const x = ball.x + Math.cos(angle) * radius;
        const y = ball.y + Math.sin(angle) * radius;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      
      const gradient = ctx.createRadialGradient(
        ball.x, ball.y, 0,
        ball.x, ball.y, ball.radius
      );
      
      gradient.addColorStop(0, ball.color + 'AA');
      gradient.addColorStop(0.7, ball.color + '60');
      gradient.addColorStop(1, ball.color + '20');
      
      ctx.fillStyle = gradient;
      ctx.fill();
      
      ctx.restore();
    });
  };

  // 渲染液态金属效果
  const renderLiquidMetal = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, balls: MetaBall[]) => {
    balls.forEach(ball => {
      ctx.save();
      
      // 金属质感
      const gradient = ctx.createLinearGradient(
        ball.x - ball.radius, ball.y - ball.radius,
        ball.x + ball.radius, ball.y + ball.radius
      );
      
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      gradient.addColorStop(0.2, ball.color + 'DD');
      gradient.addColorStop(0.5, ball.color + 'BB');
      gradient.addColorStop(0.8, ball.color + '88');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();
      
      // 液态变形效果
      const waveCount = 6;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 2;
      
      for (let i = 0; i < waveCount; i++) {
        const waveRadius = ball.radius * (0.3 + i * 0.15);
        const wavePhase = timeRef.current * 2 + i * Math.PI / 3;
        
        ctx.beginPath();
        for (let angle = 0; angle <= Math.PI * 2; angle += 0.1) {
          const wave = Math.sin(angle * 4 + wavePhase) * 3;
          const x = ball.x + Math.cos(angle) * (waveRadius + wave);
          const y = ball.y + Math.sin(angle) * (waveRadius + wave);
          
          if (angle === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.stroke();
      }
      
      ctx.restore();
    });
  };

  // 颜色转换辅助函数
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  // 动画循环
  const animate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (!canvas || !ctx) return;

    updateMetaBalls(canvas);
    renderFluidAnimation(ctx, canvas);

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
      initMetaBalls();
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
    initMetaBalls();
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
      className="fluid-animation-canvas"
    />
  );
};

export default FluidAnimation;
