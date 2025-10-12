import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Card, Button, ColorPicker, Slider, Space, Typography, Row, Col, Select, message, Modal, Input } from 'antd';
import { 
  ClearOutlined, 
  DownloadOutlined, 
  UploadOutlined, 
  UndoOutlined, 
  RedoOutlined,
  SaveOutlined,
  BorderOutlined
} from '@ant-design/icons';
import type { Color } from 'antd/es/color-picker';
import './index.css';

const { Title, Text } = Typography;
const { Option } = Select;

 
interface PixelArtEditorProps {}

interface HistoryState {
  pixels: string[][];
  timestamp: number;
}

const PixelArtEditor: React.FC<PixelArtEditorProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gridSize, setGridSize] = useState(16);
  const [pixelSize, setPixelSize] = useState(20);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [pixels, setPixels] = useState<string[][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'eraser' | 'fill' | 'eyedropper'>('pen');
  const [showGrid, setShowGrid] = useState(true);
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [fileName, setFileName] = useState('pixel-art');

  // 初始化像素网格
  const initializePixels = useCallback((size: number) => {
    const newPixels = Array(size).fill(null).map(() => 
      Array(size).fill(backgroundColor)
    );
    setPixels(newPixels);
    
    // 添加到历史记录
    const newState: HistoryState = {
      pixels: newPixels.map(row => [...row]),
      timestamp: Date.now()
    };
    setHistory([newState]);
    setHistoryIndex(0);
  }, [backgroundColor]);

  // 初始化
  useEffect(() => {
    initializePixels(gridSize);
  }, [gridSize, initializePixels]);

  // 绘制画布
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const totalSize = gridSize * pixelSize;
    canvas.width = totalSize;
    canvas.height = totalSize;

    // 清空画布
    ctx.clearRect(0, 0, totalSize, totalSize);

    // 绘制像素
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const color = pixels[row]?.[col] || backgroundColor;
        ctx.fillStyle = color;
        ctx.fillRect(
          col * pixelSize,
          row * pixelSize,
          pixelSize,
          pixelSize
        );
      }
    }

    // 绘制网格
    if (showGrid) {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i <= gridSize; i++) {
        // 垂直线
        ctx.beginPath();
        ctx.moveTo(i * pixelSize, 0);
        ctx.lineTo(i * pixelSize, totalSize);
        ctx.stroke();
        
        // 水平线
        ctx.beginPath();
        ctx.moveTo(0, i * pixelSize);
        ctx.lineTo(totalSize, i * pixelSize);
        ctx.stroke();
      }
    }
  }, [pixels, gridSize, pixelSize, backgroundColor, showGrid]);

  // 重绘画布
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // 获取鼠标位置对应的像素坐标
  const getPixelCoords = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const pixelX = Math.floor((x * scaleX) / pixelSize);
    const pixelY = Math.floor((y * scaleY) / pixelSize);
    
    if (pixelX >= 0 && pixelX < gridSize && pixelY >= 0 && pixelY < gridSize) {
      return { x: pixelX, y: pixelY };
    }
    
    return null;
  };

  // 添加到历史记录
  const addToHistory = (newPixels: string[][]) => {
    const newState: HistoryState = {
      pixels: newPixels.map(row => [...row]),
      timestamp: Date.now()
    };
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    
    // 限制历史记录数量
    if (newHistory.length > 50) {
      newHistory.shift();
    } else {
      setHistoryIndex(historyIndex + 1);
    }
    
    setHistory(newHistory);
  };

  // 填充工具（洪水填充算法）
  const floodFill = (startX: number, startY: number, newColor: string, originalColor: string) => {
    if (originalColor === newColor) return pixels;
    
    const newPixels = pixels.map(row => [...row]);
    const stack = [[startX, startY]];
    
    while (stack.length > 0) {
      const [x, y] = stack.pop()!;
      
      if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) continue;
      if (newPixels[y][x] !== originalColor) continue;
      
      newPixels[y][x] = newColor;
      
      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }
    
    return newPixels;
  };

  // 绘制像素
  const drawPixel = (x: number, y: number) => {
    const newPixels = pixels.map(row => [...row]);
    
    switch (tool) {
      case 'pen':
        newPixels[y][x] = currentColor;
        break;
      case 'eraser':
        newPixels[y][x] = backgroundColor;
        break;
      case 'fill': {
        const originalColor = pixels[y][x];
        return floodFill(x, y, currentColor, originalColor);
      }
      case 'eyedropper':
        setCurrentColor(pixels[y][x]);
        return pixels;
    }
    
    return newPixels;
  };

  // 鼠标事件处理
  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getPixelCoords(event);
    if (!coords) return;
    
    setIsDrawing(true);
    const newPixels = drawPixel(coords.x, coords.y);
    setPixels(newPixels);
    
    if (tool === 'fill' || tool === 'eyedropper') {
      addToHistory(newPixels);
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || tool === 'fill' || tool === 'eyedropper') return;
    
    const coords = getPixelCoords(event);
    if (!coords) return;
    
    const newPixels = drawPixel(coords.x, coords.y);
    setPixels(newPixels);
  };

  const handleMouseUp = () => {
    if (isDrawing && tool !== 'fill' && tool !== 'eyedropper') {
      addToHistory(pixels);
    }
    setIsDrawing(false);
  };

  // 撤销/重做
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setPixels(history[historyIndex - 1].pixels.map(row => [...row]));
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setPixels(history[historyIndex + 1].pixels.map(row => [...row]));
    }
  };

  // 清空画布
  const clearCanvas = () => {
    initializePixels(gridSize);
  };

  // 导出为PNG
  const exportToPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 创建一个新的画布用于导出（不包含网格）
    const exportCanvas = document.createElement('canvas');
    const exportCtx = exportCanvas.getContext('2d');
    if (!exportCtx) return;

    exportCanvas.width = gridSize * pixelSize;
    exportCanvas.height = gridSize * pixelSize;

    // 绘制像素（不包含网格）
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const color = pixels[row]?.[col] || backgroundColor;
        exportCtx.fillStyle = color;
        exportCtx.fillRect(
          col * pixelSize,
          row * pixelSize,
          pixelSize,
          pixelSize
        );
      }
    }

    // 下载图片
    const link = document.createElement('a');
    link.download = `${fileName}.png`;
    link.href = exportCanvas.toDataURL();
    link.click();
    
    message.success('图片导出成功！');
  };

  // 保存为JSON
  const saveAsJSON = () => {
    const data = {
      gridSize,
      pixels,
      backgroundColor,
      timestamp: Date.now()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.download = `${fileName}.json`;
    link.href = URL.createObjectURL(blob);
    link.click();
    
    message.success('项目保存成功！');
    setSaveModalVisible(false);
  };

  // 加载JSON文件
  const loadFromJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        setGridSize(data.gridSize);
        setPixels(data.pixels);
        setBackgroundColor(data.backgroundColor);
        addToHistory(data.pixels);
        message.success('项目加载成功！');
      } catch (error) {
        message.error('文件格式错误！');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="pixel-art-editor-container">
      <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
        🎨 像素画编辑器
      </Title>
      
      <Row gutter={[24, 24]}>
        <Col span={18}>
          <Card className="canvas-card">
            <canvas
              ref={canvasRef}
              className="pixel-canvas"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          </Card>
        </Col>
        
        <Col span={6}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {/* 工具选择 */}
            <Card title="工具" size="small" className="tool-card">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Select
                  value={tool}
                  onChange={setTool}
                  style={{ width: '100%' }}
                >
                  <Option value="pen">画笔</Option>
                  <Option value="eraser">橡皮擦</Option>
                  <Option value="fill">填充</Option>
                  <Option value="eyedropper">吸色器</Option>
                </Select>
                
                <div>
                  <Text>当前颜色:</Text>
                  <ColorPicker
                    value={currentColor}
                    onChange={(color: Color) => setCurrentColor(color.toHexString())}
                    style={{ width: '100%', marginTop: 8 }}
                  />
                </div>
                
                <div>
                  <Text>背景颜色:</Text>
                  <ColorPicker
                    value={backgroundColor}
                    onChange={(color: Color) => setBackgroundColor(color.toHexString())}
                    style={{ width: '100%', marginTop: 8 }}
                  />
                </div>
              </Space>
            </Card>
            
            {/* 画布设置 */}
            <Card title="画布设置" size="small" className="settings-card">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text>网格大小: {gridSize}x{gridSize}</Text>
                  <Slider
                    min={8}
                    max={32}
                    value={gridSize}
                    onChange={setGridSize}
                    style={{ marginTop: 8 }}
                  />
                </div>
                
                <div>
                  <Text>像素大小: {pixelSize}px</Text>
                  <Slider
                    min={10}
                    max={40}
                    value={pixelSize}
                    onChange={setPixelSize}
                    style={{ marginTop: 8 }}
                  />
                </div>
                
                <Button
                  icon={<BorderOutlined />}
                  onClick={() => setShowGrid(!showGrid)}
                  type={showGrid ? "primary" : "default"}
                  style={{ width: '100%' }}
                >
                  {showGrid ? '隐藏网格' : '显示网格'}
                </Button>
              </Space>
            </Card>
            
            {/* 操作按钮 */}
            <Card title="操作" size="small" className="actions-card">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Row gutter={8}>
                  <Col span={12}>
                    <Button
                      icon={<UndoOutlined />}
                      onClick={undo}
                      disabled={historyIndex <= 0}
                      style={{ width: '100%' }}
                    >
                      撤销
                    </Button>
                  </Col>
                  <Col span={12}>
                    <Button
                      icon={<RedoOutlined />}
                      onClick={redo}
                      disabled={historyIndex >= history.length - 1}
                      style={{ width: '100%' }}
                    >
                      重做
                    </Button>
                  </Col>
                </Row>
                
                <Button
                  icon={<ClearOutlined />}
                  onClick={clearCanvas}
                  danger
                  style={{ width: '100%' }}
                >
                  清空画布
                </Button>
                
                <Button
                  icon={<DownloadOutlined />}
                  onClick={exportToPNG}
                  type="primary"
                  style={{ width: '100%' }}
                >
                  导出PNG
                </Button>
                
                <Button
                  icon={<SaveOutlined />}
                  onClick={() => setSaveModalVisible(true)}
                  style={{ width: '100%' }}
                >
                  保存项目
                </Button>
                
                <input
                  type="file"
                  accept=".json"
                  onChange={loadFromJSON}
                  style={{ display: 'none' }}
                  id="load-project"
                />
                <label htmlFor="load-project">
                  <Button
                    icon={<UploadOutlined />}
                    style={{ width: '100%' }}
                  >
                    加载项目
                  </Button>
                </label>
              </Space>
            </Card>
          </Space>
        </Col>
      </Row>
      
      {/* 保存对话框 */}
      <Modal
        title="保存项目"
        open={saveModalVisible}
        onOk={saveAsJSON}
        onCancel={() => setSaveModalVisible(false)}
        okText="保存"
        cancelText="取消"
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text>文件名:</Text>
          <Input
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="输入文件名"
          />
        </Space>
      </Modal>
    </div>
  );
};

export default PixelArtEditor;
