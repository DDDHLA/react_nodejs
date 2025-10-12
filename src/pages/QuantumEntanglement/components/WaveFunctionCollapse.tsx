import React, { useEffect, useRef, useState } from 'react';
import { Typography, Space, Button, Slider } from 'antd';
import { EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import { SeasonType } from '@/components/SeasonalTheme';
import './WaveFunctionCollapse.less';

const { Text } = Typography;

interface WaveFunctionCollapseProps {
  isPlaying: boolean;
  animationSpeed: number;
  quantumField: boolean;
  visualMode: string;
  season: SeasonType;
}

interface WaveFunction {
  x: number;
  y: number;
  amplitude: number[];
  phase: number[];
  probability: number[];
  collapsed: boolean;
  collapseTime: number;
  measurementPoint: { x: number; y: number } | null;
}

const WaveFunctionCollapse: React.FC<WaveFunctionCollapseProps> = ({
  isPlaying,
  animationSpeed,
  quantumField,
  visualMode,
  season
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const waveFunctionRef = useRef<WaveFunction | null>(null);
  const [measurementProbability, setMeasurementProbability] = useState(0.02);
  const [collapseCount, setCollapseCount] = useState(0);
  const [uncertainty, setUncertainty] = useState(1.0);

  // 季节量子颜色配置
  const getQuantumColors = (season: SeasonType) => {
    const colorSets = {
      spring: {
        wave: '#52c41a',
        probability: '#73d13d',
        collapse: '#ff85c0',
        measurement: '#fa541c'
      },
      summer: {
        wave: '#1890ff',
        probability: '#40a9ff',
        collapse: '#fadb14',
        measurement: '#fa8c16'
      },
      autumn: {
        wave: '#fa8c16',
        probability: '#ffa940',
        collapse: '#d4380d',
        measurement: '#722ed1'
      },
      winter: {
        wave: '#722ed1',
        probability: '#9254de',
        collapse: '#13c2c2',
        measurement: '#52c41a'
      }
    };
    return colorSets[season] || colorSets.winter;
  };

  const colors = getQuantumColors(season);

  // 初始化波函数
  const initWaveFunction = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const wavePoints = 100;
    const amplitude: number[] = [];
    const phase: number[] = [];
    const probability: number[] = [];

    // 创建高斯波包
    for (let i = 0; i < wavePoints; i++) {
      const x = (i / wavePoints) * canvas.width;
      const center = canvas.width / 2;
      const sigma = canvas.width / 8;
      
      // 高斯分布
      const gaussianAmplitude = Math.exp(-Math.pow(x - center, 2) / (2 * sigma * sigma));
      amplitude.push(gaussianAmplitude);
      
      // 随机相位
      phase.push(Math.random() * Math.PI * 2);
      
      // 概率密度 |ψ|²
      probability.push(gaussianAmplitude * gaussianAmplitude);
    }

    waveFunctionRef.current = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      amplitude,
      phase,
      probability,
      collapsed: false,
      collapseTime: 0,
      measurementPoint: null
    };

    // 计算不确定性
    calculateUncertainty();
  };

  // 计算海森堡不确定性
  const calculateUncertainty = () => {
    const waveFunction = waveFunctionRef.current;
    if (!waveFunction) return;

    // 计算位置不确定性 Δx
    let meanX = 0;
    let meanX2 = 0;
    let totalProb = 0;

    waveFunction.probability.forEach((prob, i) => {
      const x = i / waveFunction.probability.length;
      meanX += x * prob;
      meanX2 += x * x * prob;
      totalProb += prob;
    });

    if (totalProb > 0) {
      meanX /= totalProb;
      meanX2 /= totalProb;
      const deltaX = Math.sqrt(meanX2 - meanX * meanX);
      setUncertainty(deltaX);
    }
  };

  // 更新波函数
  const updateWaveFunction = () => {
    const waveFunction = waveFunctionRef.current;
    if (!waveFunction) return;

    if (!waveFunction.collapsed) {
      // 波函数演化
      waveFunction.phase = waveFunction.phase.map((phase, i) => {
        const energy = waveFunction.amplitude[i] * 100; // 简化的能量
        return phase + energy * 0.01 * animationSpeed;
      });

      // 更新概率分布
      waveFunction.probability = waveFunction.amplitude.map((amp, i) => {
        const realPart = amp * Math.cos(waveFunction.phase[i]);
        const imagPart = amp * Math.sin(waveFunction.phase[i]);
        return realPart * realPart + imagPart * imagPart;
      });

      // 随机测量事件
      if (Math.random() < measurementProbability * animationSpeed) {
        performMeasurement();
      }
    } else {
      // 坍缩后的演化
      waveFunction.collapseTime += animationSpeed;
      if (waveFunction.collapseTime > 100) {
        // 重新初始化为新的叠加态
        initWaveFunction();
      }
    }

    calculateUncertainty();
  };

  // 执行量子测量
  const performMeasurement = () => {
    const canvas = canvasRef.current;
    const waveFunction = waveFunctionRef.current;
    if (!canvas || !waveFunction) return;

    // 根据概率分布选择测量结果
    const totalProb = waveFunction.probability.reduce((sum, prob) => sum + prob, 0);
    let randomValue = Math.random() * totalProb;
    let measurementIndex = 0;

    for (let i = 0; i < waveFunction.probability.length; i++) {
      randomValue -= waveFunction.probability[i];
      if (randomValue <= 0) {
        measurementIndex = i;
        break;
      }
    }

    // 波函数坍缩
    const measurementX = (measurementIndex / waveFunction.probability.length) * canvas.width;
    waveFunction.measurementPoint = { x: measurementX, y: canvas.height / 2 };
    waveFunction.collapsed = true;
    waveFunction.collapseTime = 0;

    // 坍缩后的状态：在测量点附近的尖峰
    waveFunction.amplitude = waveFunction.amplitude.map((_, i) => {
      const distance = Math.abs(i - measurementIndex);
      return distance < 3 ? 1 : 0; // 尖峰函数
    });

    waveFunction.probability = waveFunction.amplitude.map(amp => amp * amp);

    setCollapseCount(prev => prev + 1);
  };

  // 渲染波函数
  const renderWaveFunction = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const waveFunction = waveFunctionRef.current;
    if (!waveFunction) return;

    // 绘制量子场背景
    if (quantumField) {
      drawQuantumField(ctx, canvas);
    }

    // 根据视觉模式选择渲染方式
    switch (visualMode) {
      case 'waves':
        drawWaveFunction(ctx, canvas, waveFunction);
        break;
      case 'field':
        drawProbabilityField(ctx, canvas, waveFunction);
        break;
      case 'hybrid':
        drawWaveFunction(ctx, canvas, waveFunction);
        drawProbabilityDensity(ctx, canvas, waveFunction);
        break;
      default:
        drawWaveFunction(ctx, canvas, waveFunction);
        drawProbabilityDensity(ctx, canvas, waveFunction);
    }

    // 绘制测量点
    if (waveFunction.measurementPoint) {
      drawMeasurementPoint(ctx, waveFunction.measurementPoint);
    }

    // 绘制信息
    drawWaveInfo(ctx, canvas);
  };

  // 绘制量子场
  const drawQuantumField = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, colors.wave + '10');
    gradient.addColorStop(0.5, colors.probability + '05');
    gradient.addColorStop(1, colors.collapse + '10');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  // 绘制波函数
  const drawWaveFunction = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, waveFunction: WaveFunction) => {
    ctx.strokeStyle = colors.wave;
    ctx.lineWidth = 2;
    ctx.globalAlpha = waveFunction.collapsed ? 0.3 : 0.8;

    // 实部
    ctx.beginPath();
    waveFunction.amplitude.forEach((amp, i) => {
      const x = (i / waveFunction.amplitude.length) * canvas.width;
      const realPart = amp * Math.cos(waveFunction.phase[i]);
      const y = canvas.height / 2 - realPart * 100;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // 虚部
    ctx.strokeStyle = colors.probability;
    ctx.globalAlpha = waveFunction.collapsed ? 0.2 : 0.6;
    ctx.beginPath();
    waveFunction.amplitude.forEach((amp, i) => {
      const x = (i / waveFunction.amplitude.length) * canvas.width;
      const imagPart = amp * Math.sin(waveFunction.phase[i]);
      const y = canvas.height / 2 - imagPart * 100;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
  };

  // 绘制概率密度
  const drawProbabilityDensity = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, waveFunction: WaveFunction) => {
    ctx.fillStyle = waveFunction.collapsed ? colors.collapse : colors.probability;
    ctx.globalAlpha = 0.6;

    waveFunction.probability.forEach((prob, i) => {
      const x = (i / waveFunction.probability.length) * canvas.width;
      const height = prob * 150;
      const y = canvas.height - height;
      
      ctx.fillRect(x - 1, y, 2, height);
    });
  };

  // 绘制概率场
  const drawProbabilityField = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, waveFunction: WaveFunction) => {
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;

    for (let x = 0; x < canvas.width; x++) {
      for (let y = 0; y < canvas.height; y++) {
        const index = (y * canvas.width + x) * 4;
        const probIndex = Math.floor((x / canvas.width) * waveFunction.probability.length);
        const prob = waveFunction.probability[probIndex] || 0;
        
        // 根据概率设置颜色
        const intensity = Math.min(255, prob * 255 * 2);
        const color = waveFunction.collapsed ? 
          hexToRgb(colors.collapse) : 
          hexToRgb(colors.probability);
        
        data[index] = color.r;     // R
        data[index + 1] = color.g; // G
        data[index + 2] = color.b; // B
        data[index + 3] = intensity; // A
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  // 绘制测量点
  const drawMeasurementPoint = (ctx: CanvasRenderingContext2D, point: { x: number; y: number }) => {
    ctx.fillStyle = colors.measurement;
    ctx.globalAlpha = 1;
    
    // 测量光束
    ctx.beginPath();
    ctx.moveTo(point.x, 0);
    ctx.lineTo(point.x, ctx.canvas.height);
    ctx.strokeStyle = colors.measurement;
    ctx.lineWidth = 3;
    ctx.stroke();

    // 测量点
    ctx.beginPath();
    ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
    ctx.fill();

    // 测量效果
    const pulseRadius = 20 + Math.sin(Date.now() * 0.01) * 10;
    ctx.strokeStyle = colors.measurement;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(point.x, point.y, pulseRadius, 0, Math.PI * 2);
    ctx.stroke();
  };

  // 绘制波函数信息
  const drawWaveInfo = (ctx: CanvasRenderingContext2D, _canvas: HTMLCanvasElement) => {
    ctx.fillStyle = colors.wave;
    ctx.font = '14px monospace';
    ctx.globalAlpha = 1;
    
    const waveFunction = waveFunctionRef.current;
    if (waveFunction) {
      ctx.fillText(`坍缩次数: ${collapseCount}`, 20, 30);
      ctx.fillText(`不确定性: ${uncertainty.toFixed(4)}`, 20, 50);
      ctx.fillText(`状态: ${waveFunction.collapsed ? '已坍缩' : '叠加态'}`, 20, 70);
      ctx.fillText(`测量概率: ${(measurementProbability * 100).toFixed(1)}%`, 20, 90);
    }
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

  // 强制测量
  const forceMeasurement = () => {
    performMeasurement();
  };

  // 重置波函数
  const resetWaveFunction = () => {
    setCollapseCount(0);
    initWaveFunction();
  };

  // 动画循环
  const animate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (!canvas || !ctx) return;

    updateWaveFunction();
    renderWaveFunction(ctx, canvas);

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
      initWaveFunction();
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
    initWaveFunction();
  }, [season]);

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
  }, [isPlaying, animationSpeed, visualMode, quantumField, measurementProbability]);

  return (
    <div className={`wave-function-collapse season-${season}`}>
      {/* 波函数控制 */}
      <div className="wave-controls">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space>
            <Button 
              type="primary" 
              icon={<EyeOutlined />}
              onClick={forceMeasurement}
            >
              强制测量
            </Button>
            <Button 
              icon={<ReloadOutlined />}
              onClick={resetWaveFunction}
            >
              重置波函数
            </Button>
          </Space>
          
          <div style={{ width: '200px' }}>
            <Text>测量概率: {(measurementProbability * 100).toFixed(1)}%</Text>
            <Slider
              min={0.001}
              max={0.1}
              step={0.001}
              value={measurementProbability}
              onChange={setMeasurementProbability}
            />
          </div>
        </Space>
      </div>

      {/* 波函数画布 */}
      <div className="wave-canvas-container">
        <canvas
          ref={canvasRef}
          className="wave-canvas"
        />
        
        {/* 波函数状态覆盖层 */}
        <div className="wave-overlay">
          <div className="wave-stats">
            <Text style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              🌊 不确定性: Δx = {uncertainty.toFixed(4)} | 
              📊 坍缩: {collapseCount}次 | 
              ⚛️ 模式: {visualMode}
            </Text>
          </div>
        </div>
      </div>

      {/* 波函数说明 */}
      <div className="wave-explanation">
        <Text type="secondary">
          💡 波函数坍缩：观察量子系统如何从概率叠加态瞬间转变为确定状态。
          蓝线是波函数实部，绿线是虚部，底部柱状图是概率密度 |ψ|²。
        </Text>
      </div>
    </div>
  );
};

export default WaveFunctionCollapse;
