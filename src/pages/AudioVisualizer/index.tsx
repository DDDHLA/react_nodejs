import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Card, Button, Slider, Select, Space, Typography, Row, Col, message } from 'antd';
import { PlayCircleOutlined, PauseOutlined, UploadOutlined, SettingOutlined } from '@ant-design/icons';
import './index.css';

const { Title, Text } = Typography;
const { Option } = Select;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AudioVisualizerProps {
  // 暂无props，预留接口
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const isInitializedRef = useRef<boolean>(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [visualizerType, setVisualizerType] = useState<'bars' | 'wave' | 'circle' | 'particles'>('bars');
  const [sensitivity, setSensitivity] = useState(1);
  const [smoothing, setSmoothing] = useState(0.8);
  const [showSettings, setShowSettings] = useState(false);
  const [colorMode, setColorMode] = useState<'rainbow' | 'blue' | 'green' | 'red' | 'purple'>('rainbow');
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 400 });

  // 初始化音频上下文和分析器
  const initAudioContext = useCallback(async () => {
    try {
      console.log('开始初始化音频上下文...');
      
      // 创建AudioContext（如果还没有）
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        console.log('AudioContext已创建');
      }

      // 恢复AudioContext（如果被暂停）
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
        console.log('AudioContext已恢复');
      }

      // 只在第一次或文件更换时初始化分析器和音频源
      if (!isInitializedRef.current || !analyserRef.current) {
        console.log('初始化分析器和音频源...');
        
        const analyser = audioContextRef.current.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = smoothing;
        
        analyserRef.current = analyser;
        dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

        if (audioRef.current) {
          // 如果已有音频源，先断开连接
          if (sourceRef.current) {
            sourceRef.current.disconnect();
          }
          
          // 创建新的音频源
          sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
          sourceRef.current.connect(analyser);
          analyser.connect(audioContextRef.current.destination);
          
          console.log('音频源已连接');
        }
        
        isInitializedRef.current = true;
      } else {
        // 如果已经初始化，只需要更新平滑度
        if (analyserRef.current) {
          analyserRef.current.smoothingTimeConstant = smoothing;
        }
        console.log('音频上下文已存在，跳过重复初始化');
      }
      
    } catch (error) {
      console.error('初始化音频上下文失败:', error);
      message.error(`音频初始化失败: ${error instanceof Error ? error.message : '未知错误'}`);
      
      // 重置初始化状态，允许重试
      isInitializedRef.current = false;
    }
  }, [smoothing]);

  // 获取颜色
  const getColor = useCallback((index: number, total: number, value: number) => {
    const intensity = value / 255;
    
    switch (colorMode) {
      case 'rainbow': {
        const hue = (index / total) * 360;
        return `hsla(${hue}, 100%, ${50 + intensity * 30}%, ${0.8 + intensity * 0.2})`;
      }
      case 'blue':
        return `rgba(${30 + intensity * 100}, ${100 + intensity * 155}, 255, ${0.7 + intensity * 0.3})`;
      case 'green':
        return `rgba(${30 + intensity * 100}, 255, ${100 + intensity * 155}, ${0.7 + intensity * 0.3})`;
      case 'red':
        return `rgba(255, ${30 + intensity * 100}, ${100 + intensity * 155}, ${0.7 + intensity * 0.3})`;
      case 'purple':
        return `rgba(${150 + intensity * 105}, ${30 + intensity * 100}, 255, ${0.7 + intensity * 0.3})`;
      default:
        return `rgba(${intensity * 255}, ${intensity * 255}, ${intensity * 255}, 0.8)`;
    }
  }, [colorMode]);

  // 绘制条形图可视化
  const drawBars = useCallback((canvas: HTMLCanvasElement, dataArray: Uint8Array) => {
    const ctx = canvas.getContext('2d')!;
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    const barWidth = width / dataArray.length;
    
    for (let i = 0; i < dataArray.length; i++) {
      const barHeight = (dataArray[i] / 255) * height * sensitivity;
      const x = i * barWidth;
      const y = height - barHeight;
      
      const gradient = ctx.createLinearGradient(0, height, 0, 0);
      gradient.addColorStop(0, getColor(i, dataArray.length, dataArray[i]));
      gradient.addColorStop(1, getColor(i, dataArray.length, Math.min(255, dataArray[i] * 1.5)));
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth - 1, barHeight);
    }
  }, [sensitivity, colorMode, getColor]);

  // 绘制波形可视化
  const drawWave = useCallback((canvas: HTMLCanvasElement, dataArray: Uint8Array) => {
    const ctx = canvas.getContext('2d')!;
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 3;
    ctx.strokeStyle = getColor(0, 1, 200);
    ctx.beginPath();
    
    const sliceWidth = width / dataArray.length;
    let x = 0;
    
    for (let i = 0; i < dataArray.length; i++) {
      const v = (dataArray[i] / 255) * sensitivity;
      const y = (v * height) / 2;
      
      if (i === 0) {
        ctx.moveTo(x, height / 2 + y);
      } else {
        ctx.lineTo(x, height / 2 + y);
      }
      
      x += sliceWidth;
    }
    
    ctx.stroke();
    
    // 绘制镜像波形
    ctx.beginPath();
    x = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const v = (dataArray[i] / 255) * sensitivity;
      const y = (v * height) / 2;
      
      if (i === 0) {
        ctx.moveTo(x, height / 2 - y);
      } else {
        ctx.lineTo(x, height / 2 - y);
      }
      
      x += sliceWidth;
    }
    ctx.stroke();
  }, [sensitivity, colorMode, getColor]);

  // 绘制圆形可视化
  const drawCircle = useCallback((canvas: HTMLCanvasElement, dataArray: Uint8Array) => {
    const ctx = canvas.getContext('2d')!;
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 4;
    
    ctx.clearRect(0, 0, width, height);
    
    const angleStep = (Math.PI * 2) / dataArray.length;
    
    for (let i = 0; i < dataArray.length; i++) {
      const angle = i * angleStep;
      const barHeight = (dataArray[i] / 255) * radius * sensitivity;
      
      const x1 = centerX + Math.cos(angle) * radius;
      const y1 = centerY + Math.sin(angle) * radius;
      const x2 = centerX + Math.cos(angle) * (radius + barHeight);
      const y2 = centerY + Math.sin(angle) * (radius + barHeight);
      
      ctx.strokeStyle = getColor(i, dataArray.length, dataArray[i]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }, [sensitivity, colorMode, getColor]);

  // 绘制粒子可视化
  const drawParticles = useCallback((canvas: HTMLCanvasElement, dataArray: Uint8Array) => {
    const ctx = canvas.getContext('2d')!;
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    for (let i = 0; i < dataArray.length; i++) {
      const intensity = dataArray[i] / 255;
      const particleCount = Math.floor(intensity * 10 * sensitivity);
      
      for (let j = 0; j < particleCount; j++) {
        const x = (i / dataArray.length) * width + (Math.random() - 0.5) * 50;
        const y = height - (intensity * height) + (Math.random() - 0.5) * 100;
        const size = Math.random() * 5 + 1;
        
        ctx.fillStyle = getColor(i, dataArray.length, dataArray[i]);
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [sensitivity, colorMode, getColor]);

  // 动画循环
  const animate = useCallback(() => {
    if (!analyserRef.current || !dataArrayRef.current || !canvasRef.current) return;
    
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    
    switch (visualizerType) {
      case 'bars':
        drawBars(canvasRef.current, dataArrayRef.current);
        break;
      case 'wave':
        drawWave(canvasRef.current, dataArrayRef.current);
        break;
      case 'circle':
        drawCircle(canvasRef.current, dataArrayRef.current);
        break;
      case 'particles':
        drawParticles(canvasRef.current, dataArrayRef.current);
        break;
    }
    
    animationRef.current = requestAnimationFrame(animate);
  }, [visualizerType, sensitivity, colorMode, drawBars, drawWave, drawCircle, drawParticles]);

  // 播放/暂停音频
  const togglePlayback = async () => {
    if (!audioRef.current || !audioFile) {
      console.log('音频元素或文件不存在');
      return;
    }
    
    try {
      if (isPlaying) {
        console.log('暂停播放');
        audioRef.current.pause();
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        setIsPlaying(false);
      } else {
        console.log('开始播放');
        
        // 初始化音频上下文
        await initAudioContext();
        
        // 播放音频
        try {
          await audioRef.current.play();
          console.log('音频播放成功');
          
          // 开始动画
          animate();
          setIsPlaying(true);
          
        } catch (playError) {
          console.error('音频播放失败:', playError);
          message.error('音频播放失败，请检查文件格式或浏览器权限');
          setIsPlaying(false);
        }
      }
    } catch (error) {
      console.error('播放控制错误:', error);
      message.error('播放控制失败，请重试');
      setIsPlaying(false);
    }
  };

  // 处理文件上传
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('文件选择事件触发', event);
    const file = event.target.files?.[0];
    
    if (!file) {
      console.log('没有选择文件');
      return;
    }
    
    console.log('选择的文件:', file.name, file.type, file.size);
    
    // 检查文件类型
    if (!file.type.startsWith('audio/')) {
      message.error('请选择音频文件！');
      return;
    }
    
    if (!audioRef.current) {
      console.error('音频元素未找到');
      message.error('音频组件初始化失败');
      return;
    }
    
    try {
      setAudioFile(file);
      const url = URL.createObjectURL(file);
      console.log('创建的URL:', url);
      
      // 重置音频初始化状态，因为更换了文件
      isInitializedRef.current = false;
      
      // 断开之前的音频源连接
      if (sourceRef.current) {
        sourceRef.current.disconnect();
        sourceRef.current = null;
      }
      
      audioRef.current.src = url;
      setIsPlaying(false);
      
      // 清理之前的动画
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      message.success(`文件 "${file.name}" 加载成功！`);
      
      // 清空input值，允许重复选择同一文件
      event.target.value = '';
      
    } catch (error) {
      console.error('文件处理错误:', error);
      message.error('文件加载失败，请重试');
    }
  };

  // 更新平滑度
  useEffect(() => {
    if (analyserRef.current) {
      analyserRef.current.smoothingTimeConstant = smoothing;
    }
  }, [smoothing]);

  // 动态调整Canvas大小
  const updateCanvasSize = useCallback(() => {
    if (canvasRef.current) {
      const container = canvasRef.current.parentElement;
      if (container) {
        const containerWidth = container.clientWidth - 40; // 减去padding
        const width = Math.min(containerWidth, 800);
        const height = Math.max(width * 0.5, 300); // 保持合适的宽高比
        
        setCanvasSize({ width, height });
        
        // 更新canvas实际大小
        canvasRef.current.width = width;
        canvasRef.current.height = height;
      }
    }
  }, []);

  // 监听窗口大小变化
  useEffect(() => {
    updateCanvasSize();
    
    const handleResize = () => {
      setTimeout(updateCanvasSize, 100); // 防抖
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateCanvasSize]);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      console.log('组件卸载，清理资源...');
      
      // 清理动画
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      // 断开音频源连接
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
      
      // 关闭音频上下文
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      
      // 重置状态
      isInitializedRef.current = false;
    };
  }, []);

  return (
    <div className="audio-visualizer-container">
      <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
        🎵 音频可视化器
      </Title>
      
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card className="visualizer-card">
            <canvas
              ref={canvasRef}
              width={canvasSize.width}
              height={canvasSize.height}
              className="visualizer-canvas"
              style={{
                width: `${canvasSize.width}px`,
                height: `${canvasSize.height}px`,
                maxWidth: '100%'
              }}
            />
            
            <audio
              ref={audioRef}
              onEnded={() => setIsPlaying(false)}
              style={{ display: 'none' }}
            />
          </Card>
        </Col>
        
        <Col span={24}>
          <Card title="控制面板" className="control-panel">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Row gutter={16} align="middle">
                <Col>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                  <Button 
                    icon={<UploadOutlined />} 
                    type="primary"
                    onClick={() => {
                      console.log('按钮被点击');
                      if (fileInputRef.current) {
                        console.log('触发文件选择');
                        fileInputRef.current.click();
                      } else {
                        console.error('找不到文件输入元素');
                      }
                    }}
                  >
                    选择音频文件
                  </Button>
                </Col>
                
                <Col>
                  <Button
                    icon={isPlaying ? <PauseOutlined /> : <PlayCircleOutlined />}
                    onClick={togglePlayback}
                    disabled={!audioFile}
                    type={isPlaying ? "default" : "primary"}
                  >
                    {isPlaying ? '暂停' : '播放'}
                  </Button>
                </Col>
                
                <Col>
                  <Button
                    icon={<SettingOutlined />}
                    onClick={() => setShowSettings(!showSettings)}
                  >
                    设置
                  </Button>
                </Col>
                
                {audioFile && (
                  <Col>
                    <Text type="secondary">
                      当前文件: {audioFile.name}
                    </Text>
                  </Col>
                )}
              </Row>
              
              {showSettings && (
                <Card size="small" title="可视化设置">
                  <Row gutter={[16, 16]}>
                    <Col span={6}>
                      <Text>可视化类型:</Text>
                      <Select
                        value={visualizerType}
                        onChange={setVisualizerType}
                        style={{ width: '100%', marginTop: 8 }}
                      >
                        <Option value="bars">频谱条</Option>
                        <Option value="wave">波形</Option>
                        <Option value="circle">圆形</Option>
                        <Option value="particles">粒子</Option>
                      </Select>
                    </Col>
                    
                    <Col span={6}>
                      <Text>颜色模式:</Text>
                      <Select
                        value={colorMode}
                        onChange={setColorMode}
                        style={{ width: '100%', marginTop: 8 }}
                      >
                        <Option value="rainbow">彩虹</Option>
                        <Option value="blue">蓝色</Option>
                        <Option value="green">绿色</Option>
                        <Option value="red">红色</Option>
                        <Option value="purple">紫色</Option>
                      </Select>
                    </Col>
                    
                    <Col span={6}>
                      <Text>敏感度: {sensitivity}</Text>
                      <Slider
                        min={0.1}
                        max={3}
                        step={0.1}
                        value={sensitivity}
                        onChange={setSensitivity}
                        style={{ marginTop: 8 }}
                      />
                    </Col>
                    
                    <Col span={6}>
                      <Text>平滑度: {smoothing}</Text>
                      <Slider
                        min={0}
                        max={1}
                        step={0.1}
                        value={smoothing}
                        onChange={setSmoothing}
                        style={{ marginTop: 8 }}
                      />
                    </Col>
                  </Row>
                </Card>
              )}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AudioVisualizer;
