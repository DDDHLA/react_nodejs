import React, { useEffect, useRef } from 'react';
import './GlassGrid.less';

interface GlassGridProps {
  mousePosition: { x: number; y: number };
  lightIntensity: number;
  lightRadius: number;
  glassCount: number;
  glassSize: number;
  lightColor: string;
  animationEnabled: boolean;
  glassPattern: string;
  seasonalColors: {
    primary: string;
    secondary: string;
    ambient: string;
  };
}

interface GlassBlock {
  x: number;
  y: number;
  size: number;
  opacity: number;
  brightness: number;
  rotation: number;
  originalX: number;
  originalY: number;
}

const GlassGrid: React.FC<GlassGridProps> = ({
  mousePosition,
  lightIntensity,
  lightRadius,
  glassCount,
  glassSize,
  lightColor,
  animationEnabled,
  glassPattern,
  seasonalColors: _seasonalColors
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const glassBlocksRef = useRef<GlassBlock[]>([]);
  const timeRef = useRef(0);

  // 初始化玻璃块
  const initGlassBlocks = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const blocks: GlassBlock[] = [];
    
    for (let i = 0; i < glassCount; i++) {
      const block = createGlassBlock(canvas.width, canvas.height, i);
      blocks.push(block);
    }

    glassBlocksRef.current = blocks;
  };

  // 创建单个玻璃块
  const createGlassBlock = (width: number, height: number, index: number): GlassBlock => {
    let x, y;

    switch (glassPattern) {
      case 'grid': {
        // 网格排列
        const cols = Math.ceil(Math.sqrt(glassCount));
        const rows = Math.ceil(glassCount / cols);
        const col = index % cols;
        const row = Math.floor(index / cols);
        x = (col + 0.5) * (width / cols);
        y = (row + 0.5) * (height / rows);
        break;
      }
      case 'circle': {
        // 圆形排列
        const radius = Math.min(width, height) * 0.3;
        const angle = (index / glassCount) * Math.PI * 2;
        x = width / 2 + Math.cos(angle) * radius;
        y = height / 2 + Math.sin(angle) * radius;
        break;
      }
      case 'spiral': {
        // 螺旋排列
        const spiralRadius = (index / glassCount) * Math.min(width, height) * 0.4;
        const spiralAngle = index * 0.5;
        x = width / 2 + Math.cos(spiralAngle) * spiralRadius;
        y = height / 2 + Math.sin(spiralAngle) * spiralRadius;
        break;
      }

      case 'random':
      default:
        // 随机分布
        x = Math.random() * width;
        y = Math.random() * height;
        break;
    }

    return {
      x,
      y,
      size: glassSize + Math.random() * 20 - 10,
      opacity: 0.1 + Math.random() * 0.2,
      brightness: 0,
      rotation: Math.random() * Math.PI * 2,
      originalX: x,
      originalY: y
    };
  };

  // 计算光照强度
  const calculateLighting = (glassBlock: GlassBlock, lightX: number, lightY: number): number => {
    const dx = lightX - glassBlock.x;
    const dy = lightY - glassBlock.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // 光强度随距离平方反比衰减
    const maxDistance = lightRadius;
    if (distance > maxDistance) return 0;
    
    const normalizedDistance = distance / maxDistance;
    const intensity = (1 - normalizedDistance * normalizedDistance) * lightIntensity;
    
    return Math.max(0, Math.min(1, intensity));
  };

  // 更新玻璃块
  const updateGlassBlocks = () => {
    const blocks = glassBlocksRef.current;
    timeRef.current += 0.02;

    blocks.forEach((block, index) => {
      // 计算光照
      block.brightness = calculateLighting(block, mousePosition.x, mousePosition.y);
      
      // 动画效果
      if (animationEnabled) {
        // 轻微的浮动动画
        const floatX = Math.sin(timeRef.current + index * 0.1) * 2;
        const floatY = Math.cos(timeRef.current * 0.8 + index * 0.15) * 1.5;
        block.x = block.originalX + floatX;
        block.y = block.originalY + floatY;
        
        // 旋转动画
        block.rotation += 0.005;
        
        // 光照影响下的尺寸变化
        const sizeMultiplier = 1 + block.brightness * 0.2;
        block.size = (glassSize + Math.sin(timeRef.current + index) * 5) * sizeMultiplier;
      }
    });
  };

  // 渲染玻璃块
  const renderGlassBlocks = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const blocks = glassBlocksRef.current;
    
    blocks.forEach((block, _index) => {
      ctx.save();
      
      // 移动到玻璃块中心
      ctx.translate(block.x, block.y);
      ctx.rotate(block.rotation);
      
      // 计算玻璃块颜色和透明度
      const baseBrightness = block.brightness;
      const glowIntensity = baseBrightness * 0.8;
      
      // 绘制玻璃块光晕
      if (baseBrightness > 0.1) {
        const glowSize = block.size * (1 + baseBrightness * 2);
        const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, glowSize);
        
        const lightColorRgb = hexToRgb(lightColor);
        glowGradient.addColorStop(0, `rgba(${lightColorRgb.r}, ${lightColorRgb.g}, ${lightColorRgb.b}, ${glowIntensity * 0.6})`);
        glowGradient.addColorStop(0.5, `rgba(${lightColorRgb.r}, ${lightColorRgb.g}, ${lightColorRgb.b}, ${glowIntensity * 0.3})`);
        glowGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = glowGradient;
        ctx.fillRect(-glowSize, -glowSize, glowSize * 2, glowSize * 2);
      }
      
      // 绘制玻璃块主体
      const halfSize = block.size / 2;
      
      // 玻璃块渐变
      const glassGradient = ctx.createLinearGradient(-halfSize, -halfSize, halfSize, halfSize);
      const baseOpacity = block.opacity + baseBrightness * 0.4;
      
      if (baseBrightness > 0.05) {
        const lightColorRgb = hexToRgb(lightColor);
        glassGradient.addColorStop(0, `rgba(255, 255, 255, ${baseOpacity * 0.8})`);
        glassGradient.addColorStop(0.3, `rgba(${lightColorRgb.r}, ${lightColorRgb.g}, ${lightColorRgb.b}, ${baseOpacity * 0.6})`);
        glassGradient.addColorStop(0.7, `rgba(${lightColorRgb.r}, ${lightColorRgb.g}, ${lightColorRgb.b}, ${baseOpacity * 0.4})`);
        glassGradient.addColorStop(1, `rgba(255, 255, 255, ${baseOpacity * 0.2})`);
      } else {
        glassGradient.addColorStop(0, `rgba(255, 255, 255, ${baseOpacity * 0.3})`);
        glassGradient.addColorStop(0.5, `rgba(200, 200, 255, ${baseOpacity * 0.2})`);
        glassGradient.addColorStop(1, `rgba(255, 255, 255, ${baseOpacity * 0.1})`);
      }
      
      // 绘制玻璃块形状（圆角矩形）
      ctx.fillStyle = glassGradient;
      ctx.beginPath();
      ctx.roundRect(-halfSize, -halfSize, block.size, block.size, block.size * 0.2);
      ctx.fill();
      
      // 绘制玻璃块边框
      ctx.strokeStyle = `rgba(255, 255, 255, ${(baseOpacity + 0.2) * 0.5})`;
      ctx.lineWidth = 1 + baseBrightness * 2;
      ctx.stroke();
      
      // 绘制高光效果
      if (baseBrightness > 0.2) {
        const highlightSize = block.size * 0.3;
        const highlightGradient = ctx.createRadialGradient(
          -halfSize * 0.3, -halfSize * 0.3, 0,
          -halfSize * 0.3, -halfSize * 0.3, highlightSize
        );
        
        highlightGradient.addColorStop(0, `rgba(255, 255, 255, ${baseBrightness * 0.8})`);
        highlightGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = highlightGradient;
        ctx.beginPath();
        ctx.arc(-halfSize * 0.3, -halfSize * 0.3, highlightSize, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // 绘制反射效果
      if (baseBrightness > 0.1) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${baseBrightness * 0.6})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(-halfSize * 0.7, -halfSize * 0.7);
        ctx.lineTo(halfSize * 0.7, halfSize * 0.7);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      
      ctx.restore();
    });

    // 绘制光线效果
    if (mousePosition.x > 0 && mousePosition.y > 0) {
      drawLightRays(ctx, mousePosition.x, mousePosition.y);
    }
  };

  // 绘制光线
  const drawLightRays = (ctx: CanvasRenderingContext2D, lightX: number, lightY: number) => {
    const rayCount = 12;
    const lightColorRgb = hexToRgb(lightColor);
    
    for (let i = 0; i < rayCount; i++) {
      const angle = (i / rayCount) * Math.PI * 2;
      const rayLength = lightRadius * (0.8 + Math.sin(timeRef.current * 2 + i) * 0.2);
      
      const endX = lightX + Math.cos(angle) * rayLength;
      const endY = lightY + Math.sin(angle) * rayLength;
      
      const rayGradient = ctx.createLinearGradient(lightX, lightY, endX, endY);
      rayGradient.addColorStop(0, `rgba(${lightColorRgb.r}, ${lightColorRgb.g}, ${lightColorRgb.b}, ${lightIntensity * 0.3})`);
      rayGradient.addColorStop(0.7, `rgba(${lightColorRgb.r}, ${lightColorRgb.g}, ${lightColorRgb.b}, ${lightIntensity * 0.1})`);
      rayGradient.addColorStop(1, 'transparent');
      
      ctx.strokeStyle = rayGradient;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(lightX, lightY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
  };

  // 颜色转换辅助函数
  const hexToRgb = (hex: string) => {
    // 处理特殊颜色名称
    const colorMap: { [key: string]: string } = {
      'white': '#ffffff',
      'red': '#ff0000',
      'green': '#00ff00',
      'blue': '#0000ff',
      'yellow': '#ffff00',
      'cyan': '#00ffff',
      'magenta': '#ff00ff'
    };
    
    const color = colorMap[hex.toLowerCase()] || hex;
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 };
  };

  // 动画循环
  const animate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (!canvas || !ctx) return;

    updateGlassBlocks();
    renderGlassBlocks(ctx, canvas);

    animationRef.current = requestAnimationFrame(animate);
  };

  // 调整画布大小
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      initGlassBlocks();
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
    initGlassBlocks();
  }, [glassCount, glassSize, glassPattern]);

  // 启动动画
  useEffect(() => {
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePosition, lightIntensity, lightRadius, lightColor, animationEnabled]);

  return (
    <canvas
      ref={canvasRef}
      className="glass-grid-canvas"
    />
  );
};

export default GlassGrid;
