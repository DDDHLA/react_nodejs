import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Card, Button, Input, Space, Typography, Row, Col, Select, Slider, Switch, message, Tabs } from 'antd';
import { 
  PlayCircleOutlined, 
  ClearOutlined, 
  DownloadOutlined, 
  PlusOutlined,
  DeleteOutlined,
  SettingOutlined,
  FunctionOutlined
} from '@ant-design/icons';
import './index.css';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface MathPlotterProps {}

interface FunctionData {
  id: string;
  expression: string;
  color: string;
  visible: boolean;
  lineWidth: number;
}

interface PlotSettings {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  gridSpacing: number;
  showGrid: boolean;
  showAxes: boolean;
  showLabels: boolean;
}

const MathPlotter: React.FC<MathPlotterProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [functions, setFunctions] = useState<FunctionData[]>([
    {
      id: '1',
      expression: 'x^2',
      color: '#1890ff',
      visible: true,
      lineWidth: 2
    }
  ]);
  const [currentExpression, setCurrentExpression] = useState('');
  const [settings, setSettings] = useState<PlotSettings>({
    xMin: -10,
    xMax: 10,
    yMin: -10,
    yMax: 10,
    gridSpacing: 1,
    showGrid: true,
    showAxes: true,
    showLabels: true
  });
  const [resolution, setResolution] = useState(1000);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationTime, setAnimationTime] = useState(0);

  // 预定义的函数示例
  const functionExamples = [
    { name: '二次函数', expression: 'x^2' },
    { name: '三次函数', expression: 'x^3' },
    { name: '正弦函数', expression: 'sin(x)' },
    { name: '余弦函数', expression: 'cos(x)' },
    { name: '正切函数', expression: 'tan(x)' },
    { name: '指数函数', expression: 'exp(x)' },
    { name: '对数函数', expression: 'log(x)' },
    { name: '绝对值', expression: 'abs(x)' },
    { name: '平方根', expression: 'sqrt(x)' },
    { name: '圆形', expression: 'sqrt(25 - x^2)' },
    { name: '动态正弦', expression: 'sin(x + t)' },
    { name: '阻尼振荡', expression: 'exp(-x/5) * cos(x)' }
  ];

  const colors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2', '#eb2f96', '#fa8c16'];

  // 数学表达式解析器
  const evaluateExpression = useCallback((expression: string, x: number, t: number = 0): number => {
    try {
      // 替换数学函数和常量
      let expr = expression
        .replace(/\^/g, '**')
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/exp/g, 'Math.exp')
        .replace(/log/g, 'Math.log')
        .replace(/abs/g, 'Math.abs')
        .replace(/sqrt/g, 'Math.sqrt')
        .replace(/pi/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/\bt\b/g, t.toString())
        .replace(/\bx\b/g, x.toString());

      // 使用Function构造器安全地评估表达式
      const func = new Function('return ' + expr);
      const result = func();
      
      return isFinite(result) ? result : NaN;
    } catch (error) {
      return NaN;
    }
  }, []);

  // 坐标转换
  const toCanvasCoords = useCallback((x: number, y: number, canvas: HTMLCanvasElement) => {
    const { width, height } = canvas;
    const { xMin, xMax, yMin, yMax } = settings;
    
    const canvasX = ((x - xMin) / (xMax - xMin)) * width;
    const canvasY = height - ((y - yMin) / (yMax - yMin)) * height;
    
    return { x: canvasX, y: canvasY };
  }, [settings]);

  // 绘制网格
  const drawGrid = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    if (!settings.showGrid) return;

    const { width, height } = canvas;
    const { xMin, xMax, yMin, yMax, gridSpacing } = settings;

    ctx.strokeStyle = 'rgba(200, 200, 200, 0.5)';
    ctx.lineWidth = 1;

    // 垂直网格线
    for (let x = Math.ceil(xMin / gridSpacing) * gridSpacing; x <= xMax; x += gridSpacing) {
      const canvasCoords = toCanvasCoords(x, 0, canvas);
      ctx.beginPath();
      ctx.moveTo(canvasCoords.x, 0);
      ctx.lineTo(canvasCoords.x, height);
      ctx.stroke();
    }

    // 水平网格线
    for (let y = Math.ceil(yMin / gridSpacing) * gridSpacing; y <= yMax; y += gridSpacing) {
      const canvasCoords = toCanvasCoords(0, y, canvas);
      ctx.beginPath();
      ctx.moveTo(0, canvasCoords.y);
      ctx.lineTo(width, canvasCoords.y);
      ctx.stroke();
    }
  }, [settings, toCanvasCoords]);

  // 绘制坐标轴
  const drawAxes = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    if (!settings.showAxes) return;

    const { width, height } = canvas;
    const { xMin, xMax, yMin, yMax } = settings;

    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;

    // X轴
    if (yMin <= 0 && yMax >= 0) {
      const yAxisCoords = toCanvasCoords(0, 0, canvas);
      ctx.beginPath();
      ctx.moveTo(0, yAxisCoords.y);
      ctx.lineTo(width, yAxisCoords.y);
      ctx.stroke();

      // X轴箭头
      ctx.beginPath();
      ctx.moveTo(width - 10, yAxisCoords.y - 5);
      ctx.lineTo(width, yAxisCoords.y);
      ctx.lineTo(width - 10, yAxisCoords.y + 5);
      ctx.stroke();
    }

    // Y轴
    if (xMin <= 0 && xMax >= 0) {
      const xAxisCoords = toCanvasCoords(0, 0, canvas);
      ctx.beginPath();
      ctx.moveTo(xAxisCoords.x, 0);
      ctx.lineTo(xAxisCoords.x, height);
      ctx.stroke();

      // Y轴箭头
      ctx.beginPath();
      ctx.moveTo(xAxisCoords.x - 5, 10);
      ctx.lineTo(xAxisCoords.x, 0);
      ctx.lineTo(xAxisCoords.x + 5, 10);
      ctx.stroke();
    }
  }, [settings, toCanvasCoords]);

  // 绘制标签
  const drawLabels = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    if (!settings.showLabels) return;

    const { xMin, xMax, yMin, yMax, gridSpacing } = settings;

    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';

    // X轴标签
    if (yMin <= 0 && yMax >= 0) {
      const yAxisCoords = toCanvasCoords(0, 0, canvas);
      for (let x = Math.ceil(xMin / gridSpacing) * gridSpacing; x <= xMax; x += gridSpacing) {
        if (Math.abs(x) < 0.001) continue; // 跳过原点
        const canvasCoords = toCanvasCoords(x, 0, canvas);
        ctx.fillText(x.toFixed(1), canvasCoords.x, yAxisCoords.y + 20);
      }
    }

    // Y轴标签
    if (xMin <= 0 && xMax >= 0) {
      const xAxisCoords = toCanvasCoords(0, 0, canvas);
      ctx.textAlign = 'right';
      for (let y = Math.ceil(yMin / gridSpacing) * gridSpacing; y <= yMax; y += gridSpacing) {
        if (Math.abs(y) < 0.001) continue; // 跳过原点
        const canvasCoords = toCanvasCoords(0, y, canvas);
        ctx.fillText(y.toFixed(1), xAxisCoords.x - 10, canvasCoords.y + 5);
      }
    }
  }, [settings, toCanvasCoords]);

  // 绘制函数
  const drawFunction = useCallback((
    ctx: CanvasRenderingContext2D, 
    canvas: HTMLCanvasElement, 
    func: FunctionData, 
    t: number = 0
  ) => {
    if (!func.visible) return;

    const { xMin, xMax } = settings;
    const step = (xMax - xMin) / resolution;

    ctx.strokeStyle = func.color;
    ctx.lineWidth = func.lineWidth;
    ctx.beginPath();

    let firstPoint = true;

    for (let x = xMin; x <= xMax; x += step) {
      const y = evaluateExpression(func.expression, x, t);
      
      if (!isNaN(y) && isFinite(y)) {
        const canvasCoords = toCanvasCoords(x, y, canvas);
        
        if (canvasCoords.y >= 0 && canvasCoords.y <= canvas.height) {
          if (firstPoint) {
            ctx.moveTo(canvasCoords.x, canvasCoords.y);
            firstPoint = false;
          } else {
            ctx.lineTo(canvasCoords.x, canvasCoords.y);
          }
        } else {
          firstPoint = true;
        }
      } else {
        firstPoint = true;
      }
    }

    ctx.stroke();
  }, [settings, resolution, evaluateExpression, toCanvasCoords]);

  // 绘制整个图形
  const draw = useCallback((t: number = 0) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 设置画布背景
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制网格
    drawGrid(ctx, canvas);

    // 绘制坐标轴
    drawAxes(ctx, canvas);

    // 绘制所有函数
    functions.forEach(func => {
      drawFunction(ctx, canvas, func, t);
    });

    // 绘制标签
    drawLabels(ctx, canvas);
  }, [functions, drawGrid, drawAxes, drawFunction, drawLabels]);

  // 动画循环
  useEffect(() => {
    let animationId: number;
    
    if (isAnimating) {
      const animate = () => {
        setAnimationTime(prev => prev + animationSpeed * 0.1);
        animationId = requestAnimationFrame(animate);
      };
      animationId = requestAnimationFrame(animate);
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isAnimating, animationSpeed]);

  // 重绘
  useEffect(() => {
    draw(animationTime);
  }, [draw, animationTime, functions, settings]);

  // 添加函数
  const addFunction = () => {
    if (!currentExpression.trim()) {
      message.warning('请输入函数表达式');
      return;
    }

    const newFunction: FunctionData = {
      id: Date.now().toString(),
      expression: currentExpression,
      color: colors[functions.length % colors.length],
      visible: true,
      lineWidth: 2
    };

    setFunctions([...functions, newFunction]);
    setCurrentExpression('');
    message.success('函数添加成功');
  };

  // 删除函数
  const removeFunction = (id: string) => {
    setFunctions(functions.filter(f => f.id !== id));
  };

  // 更新函数
  const updateFunction = (id: string, updates: Partial<FunctionData>) => {
    setFunctions(functions.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  // 导出图片
  const exportImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'math-plot.png';
    link.href = canvas.toDataURL();
    link.click();
    
    message.success('图片导出成功！');
  };

  // 清空所有函数
  const clearAll = () => {
    setFunctions([]);
  };

  return (
    <div className="math-plotter-container">
      <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
        📊 数学函数绘图器
      </Title>
      
      <Row gutter={[24, 24]}>
        <Col span={16}>
          <Card className="canvas-card">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              className="plot-canvas"
            />
          </Card>
        </Col>
        
        <Col span={8}>
          <Tabs
            defaultActiveKey="functions"
            items={[
              {
                key: 'functions',
                label: '函数',
                children: (
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    {/* 添加函数 */}
                    <Card title="添加函数" size="small" className="function-card">
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <TextArea
                          value={currentExpression}
                          onChange={(e) => setCurrentExpression(e.target.value)}
                          placeholder="输入函数表达式，如: x^2, sin(x), exp(-x)*cos(x)"
                          rows={2}
                        />
                        
                        <Button
                          icon={<PlusOutlined />}
                          onClick={addFunction}
                          type="primary"
                          style={{ width: '100%' }}
                        >
                          添加函数
                        </Button>
                        
                        <Select
                          placeholder="选择示例函数"
                          style={{ width: '100%' }}
                          onChange={(value) => setCurrentExpression(value)}
                          allowClear
                        >
                          {functionExamples.map((example, index) => (
                            <Option key={index} value={example.expression}>
                              {example.name}: {example.expression}
                            </Option>
                          ))}
                        </Select>
                      </Space>
                    </Card>
                    
                    {/* 函数列表 */}
                    <Card title="函数列表" size="small" className="function-list-card">
                      <Space direction="vertical" style={{ width: '100%' }}>
                        {functions.map((func, index) => (
                          <Card key={func.id} size="small" className="function-item">
                            <Space direction="vertical" style={{ width: '100%' }}>
                              <Row align="middle" justify="space-between">
                                <Col>
                                  <Text code style={{ color: func.color }}>
                                    f{index + 1}(x) = {func.expression}
                                  </Text>
                                </Col>
                                <Col>
                                  <Button
                                    icon={<DeleteOutlined />}
                                    size="small"
                                    danger
                                    onClick={() => removeFunction(func.id)}
                                  />
                                </Col>
                              </Row>
                              
                              <Row gutter={8} align="middle">
                                <Col span={8}>
                                  <Switch
                                    checked={func.visible}
                                    onChange={(visible) => updateFunction(func.id, { visible })}
                                    size="small"
                                  />
                                  <Text style={{ marginLeft: 8, fontSize: 12 }}>显示</Text>
                                </Col>
                                
                                <Col span={8}>
                                  <input
                                    type="color"
                                    value={func.color}
                                    onChange={(e) => updateFunction(func.id, { color: e.target.value })}
                                    style={{ width: 30, height: 20, border: 'none', borderRadius: 4 }}
                                  />
                                </Col>
                                
                                <Col span={8}>
                                  <Slider
                                    min={1}
                                    max={5}
                                    value={func.lineWidth}
                                    onChange={(lineWidth) => updateFunction(func.id, { lineWidth })}
                                    style={{ margin: 0 }}
                                  />
                                </Col>
                              </Row>
                            </Space>
                          </Card>
                        ))}
                        
                        {functions.length === 0 && (
                          <Text type="secondary" style={{ textAlign: 'center', display: 'block' }}>
                            暂无函数，请添加函数
                          </Text>
                        )}
                      </Space>
                    </Card>
                  </Space>
                )
              },
              {
                key: 'settings',
                label: '设置',
                children: (
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    {/* 坐标范围 */}
                    <Card title="坐标范围" size="small" className="settings-card">
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Row gutter={8}>
                          <Col span={12}>
                            <Text>X最小值:</Text>
                            <Input
                              type="number"
                              value={settings.xMin}
                              onChange={(e) => setSettings({...settings, xMin: Number(e.target.value)})}
                              style={{ marginTop: 4 }}
                            />
                          </Col>
                          <Col span={12}>
                            <Text>X最大值:</Text>
                            <Input
                              type="number"
                              value={settings.xMax}
                              onChange={(e) => setSettings({...settings, xMax: Number(e.target.value)})}
                              style={{ marginTop: 4 }}
                            />
                          </Col>
                        </Row>
                        
                        <Row gutter={8}>
                          <Col span={12}>
                            <Text>Y最小值:</Text>
                            <Input
                              type="number"
                              value={settings.yMin}
                              onChange={(e) => setSettings({...settings, yMin: Number(e.target.value)})}
                              style={{ marginTop: 4 }}
                            />
                          </Col>
                          <Col span={12}>
                            <Text>Y最大值:</Text>
                            <Input
                              type="number"
                              value={settings.yMax}
                              onChange={(e) => setSettings({...settings, yMax: Number(e.target.value)})}
                              style={{ marginTop: 4 }}
                            />
                          </Col>
                        </Row>
                      </Space>
                    </Card>
                    
                    {/* 显示选项 */}
                    <Card title="显示选项" size="small" className="display-card">
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Row justify="space-between" align="middle">
                          <Text>显示网格</Text>
                          <Switch
                            checked={settings.showGrid}
                            onChange={(showGrid) => setSettings({...settings, showGrid})}
                          />
                        </Row>
                        
                        <Row justify="space-between" align="middle">
                          <Text>显示坐标轴</Text>
                          <Switch
                            checked={settings.showAxes}
                            onChange={(showAxes) => setSettings({...settings, showAxes})}
                          />
                        </Row>
                        
                        <Row justify="space-between" align="middle">
                          <Text>显示标签</Text>
                          <Switch
                            checked={settings.showLabels}
                            onChange={(showLabels) => setSettings({...settings, showLabels})}
                          />
                        </Row>
                        
                        <div>
                          <Text>网格间距: {settings.gridSpacing}</Text>
                          <Slider
                            min={0.5}
                            max={5}
                            step={0.5}
                            value={settings.gridSpacing}
                            onChange={(gridSpacing) => setSettings({...settings, gridSpacing})}
                            style={{ marginTop: 8 }}
                          />
                        </div>
                        
                        <div>
                          <Text>分辨率: {resolution}</Text>
                          <Slider
                            min={100}
                            max={2000}
                            step={100}
                            value={resolution}
                            onChange={setResolution}
                            style={{ marginTop: 8 }}
                          />
                        </div>
                      </Space>
                    </Card>
                    
                    {/* 动画控制 */}
                    <Card title="动画控制" size="small" className="animation-card">
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Row justify="space-between" align="middle">
                          <Text>启用动画</Text>
                          <Switch
                            checked={isAnimating}
                            onChange={setIsAnimating}
                          />
                        </Row>
                        
                        <div>
                          <Text>动画速度: {animationSpeed}</Text>
                          <Slider
                            min={0.1}
                            max={5}
                            step={0.1}
                            value={animationSpeed}
                            onChange={setAnimationSpeed}
                            style={{ marginTop: 8 }}
                          />
                        </div>
                        
                        <Button
                          onClick={() => setAnimationTime(0)}
                          style={{ width: '100%' }}
                        >
                          重置动画
                        </Button>
                      </Space>
                    </Card>
                  </Space>
                )
              }
            ]}
          />
          
          {/* 操作按钮 */}
          <Card title="操作" size="small" className="actions-card" style={{ marginTop: 16 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button
                icon={<DownloadOutlined />}
                onClick={exportImage}
                type="primary"
                style={{ width: '100%' }}
              >
                导出图片
              </Button>
              
              <Button
                icon={<ClearOutlined />}
                onClick={clearAll}
                danger
                style={{ width: '100%' }}
              >
                清空所有函数
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MathPlotter;
