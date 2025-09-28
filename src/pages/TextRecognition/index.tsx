import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Card,
  Button,
  Space,
  Typography,
  Row,
  Col,
  Slider,
  Select,
  Progress,
  message,
  Divider,
  ColorPicker,
  Modal,
  Input,
  Spin,
  Tag,
} from 'antd';
import {
  ScanOutlined,
  UndoOutlined,
  ClearOutlined,
  DownloadOutlined,
  CopyOutlined,
  SettingOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { BaiduOCRService } from '../../utils/ocrService';
import './index.less';

const { Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// OCR识别状态
interface OCRProgress {
  status: string;
  progress: number;
}

// 绘制工具类型
type DrawingTool = 'pen' | 'eraser';

const TextRecognition: React.FC = () => {
  // Canvas相关状态
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<DrawingTool>('pen');
  const [brushSize, setBrushSize] = useState(3);
  const [brushColor, setBrushColor] = useState('#000000');
  const [canvasHistory, setCanvasHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // OCR相关状态
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [ocrProgress, setOcrProgress] = useState<OCRProgress>({ status: '', progress: 0 });
  const [language, setLanguage] = useState('chi_sim+eng');
  const [ocrService, setOcrService] = useState<'baidu' | 'google' | 'tesseract'>('baidu');
  
  // 界面状态
  const [showSettings, setShowSettings] = useState(false);

  // 保存Canvas状态到历史记录
  const saveCanvasState = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // 获取Canvas当前状态， 保存到历史记录， 限制历史记录数量 20 个 (包括当前状态)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    setCanvasHistory(prevHistory => {
      const newHistory = prevHistory.slice(0, historyIndex + 1);
      newHistory.push(imageData);
      
      // 限制历史记录数量
      if (newHistory.length > 20) {
        newHistory.shift();
        return newHistory;
      } else {
        return newHistory;
      }
    });
    
    // 更新历史记录索引
    setHistoryIndex(prev => Math.min(prev + 1, 19));
  }, [historyIndex]);

  // 初始化Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }


    // 设置 willReadFrequently 属性优化性能
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      return;
    }

    // 设置Canvas尺寸
    canvas.width = 800;
    canvas.height = 600;

    // 设置默认样式
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    

    // 初始化历史记录
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setCanvasHistory([imageData]);
    setHistoryIndex(0);
  }, []); // 移除依赖，只在组件挂载时执行一次

  // 撤销操作
  const undoCanvas = () => {
    if (historyIndex <= 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    setHistoryIndex(prev => prev - 1);
    const previousState = canvasHistory[historyIndex - 1];
    ctx.putImageData(previousState, 0, 0);
  };

  // 清空Canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveCanvasState();
  };

  // 测试绘制功能
  const testDraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log('测试: Canvas引用不存在');
      return;
    }

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      console.log('测试: Canvas上下文获取失败');
      return;
    }

    console.log('测试: 开始绘制测试内容');
    
    // 绘制一个红色圆圈
    ctx.beginPath();
    ctx.arc(400, 300, 50, 0, 2 * Math.PI);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // 绘制一些文字
    ctx.font = '20px Arial';
    ctx.fillStyle = 'blue';
    ctx.fillText('测试文字', 350, 350);
    
    console.log('测试: 绘制完成');
  };

  // 开始绘制
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    console.log('开始绘制', { x: e.clientX, y: e.clientY });
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log('Canvas引用不存在');
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    console.log('绘制坐标', { x, y, scaleX, scaleY, canvasWidth: canvas.width, canvasHeight: canvas.height });

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      console.log('Canvas上下文获取失败');
      return;
    }

    // 设置绘制样式
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    if (currentTool === 'pen') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize;
      console.log('画笔设置', { color: brushColor, size: brushSize });
    } else {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = brushSize * 2;
      console.log('橡皮擦设置', { size: brushSize * 2 });
    }

    // 开始新路径
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    // 画一个小点，确保单击也有效果
    ctx.lineTo(x + 0.1, y + 0.1);
    ctx.stroke();
    
    console.log('开始绘制完成');
  };

  // 绘制过程
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // 继续当前路径
    ctx.lineTo(x, y);
    ctx.stroke();
    
    // 开始新的子路径，保持连续绘制
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    console.log('正在绘制', { x, y, isDrawing });
  };

  // 结束绘制
  const stopDrawing = () => {
    if (isDrawing) {
      console.log('结束绘制');
      setIsDrawing(false);
      saveCanvasState();
    }
  };

  // 获取触摸坐标
  const getTouchPos = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const touch = e.touches[0];
    
    return {
      x: (touch.clientX - rect.left) * scaleX,
      y: (touch.clientY - rect.top) * scaleY
    };
  };

  // 触摸开始
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x, y } = getTouchPos(e);
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // 设置绘制样式
    if (currentTool === 'pen') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize;
    } else {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = brushSize * 2;
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  // 触摸移动
  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x, y } = getTouchPos(e);
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  // 触摸结束
  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    stopDrawing();
  };

  // 下载Canvas为图片
  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `drawing_${new Date().getTime()}.png`;
    link.href = canvas.toDataURL();
    link.click();
    message.success('图片下载成功！');
  };

  // 智能OCR识别（多服务切换）
  const recognizeWithSmartOCR = async () => {
    console.log('🎯 开始OCR识别流程...');
    console.log('🔧 当前选择的OCR服务:', ocrService);
    
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log('❌ Canvas引用不存在');
      return;
    }

    setIsRecognizing(true);
    
    try {
      const imageBase64 = canvas.toDataURL('image/png').split(',')[1];
      console.log('📸 图片转换完成，大小:', imageBase64.length, '字符');
      
      if (ocrService === 'baidu') {
        console.log('🚀 选择百度OCR服务');
        await recognizeWithBaiduReal(imageBase64);
      } else if (ocrService === 'google') {
        console.log('🤖 选择Google Vision服务');
        await recognizeWithGoogleDemo(imageBase64);
      } else {
        console.log('💻 选择Tesseract本地服务');
        await recognizeWithTesseract();
      }
    } catch (error) {
      console.error('💥 OCR识别异常:', error);
      message.error('识别失败，请重试');
    } finally {
      console.log('🏁 OCR识别流程结束');
      setIsRecognizing(false);
      setOcrProgress({ status: '', progress: 0 });
    }
  };

  // 真实百度OCR识别
  const recognizeWithBaiduReal = async (imageBase64: string) => {
    try {
      console.log('🔍 开始百度OCR调试...');
      console.log('📍 当前域名:', window.location.hostname);
      console.log('🖼️ 图片数据大小:', imageBase64.length);
      
      setOcrProgress({ status: '正在连接百度OCR...', progress: 20 });
      
      // 调用真实的百度OCR API
      const languageType = language.includes('chi') ? 'CHN_ENG' : 'ENG';
      console.log('🌐 语言类型:', languageType);
      
      setOcrProgress({ status: '正在上传图片...', progress: 40 });
      
      const result = await BaiduOCRService.recognizeText(imageBase64, languageType);
      console.log('📊 百度OCR返回结果:', result);
      
      setOcrProgress({ status: '正在处理结果...', progress: 80 });
      
      if (result.success) {
        const wordCount = result.words_result ? result.words_result.length : 0;
        
        if (wordCount > 0) {
          setRecognizedText(result.text);
          message.success(`百度OCR识别完成！识别到 ${wordCount} 行文字`);
          console.log('✅ 百度OCR识别成功!', result.text);
        } else {
          setRecognizedText('✅ 百度OCR调用成功！\n\n⚠️ 但未识别到文字，可能原因：\n\n1. 📝 图片中没有文字\n2. 🔍 文字太模糊或太小\n3. 🎨 字体太特殊或草书\n4. ⬜ 对比度不够\n\n💡 建议：\n• 写大一些的文字\n• 使用黑色笔在白色背景上写字\n• 尽量写印刷体文字\n• 确保文字清晰可读');
          message.success('百度OCR调用成功！但未识别到文字，请检查图片内容');
          console.log('✅ 百度OCR成功但无结果，原始响应:', result);
        }
      } else {
        console.error('❌ 百度OCR返回失败:', result.error);
        throw new Error(result.error || '识别失败');
      }
    } catch (error) {
      console.error('💥 百度OCR识别异常:', error);
      
      // 显示具体错误信息
      const errorMsg = error instanceof Error ? error.message : '未知错误';
      message.error(`百度OCR失败: ${errorMsg}`);
      
      // 如果百度OCR失败，备用Tesseract.js
      message.info('正在尝试本地OCR备用方案...');
      await recognizeWithTesseract();
    }
  };

  // Google Vision OCR演示
  const recognizeWithGoogleDemo = async (imageBase64: string) => {
    setOcrProgress({ status: '正在连接Google Vision...', progress: 30 });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setOcrProgress({ status: '正在使用AI分析...', progress: 70 });
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const mockResults = [
      'Google Vision OCR Result\nAdvanced AI-powered text recognition\nSupports multiple languages',
      '谷歌AI文字识别\n支持多语言识别\n高精度智能分析',
      'Mixed Content Recognition\n中英文混合: Hello 世界\nNumbers: 2024年',
      'Handwriting Recognition\n手写体识别测试\nGoogle AI 技术'
    ];
    
    const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
    setRecognizedText(randomResult);
    message.success('Google Vision OCR识别完成！（演示版）');
  };

  // Tesseract.js 备用识别
  const recognizeWithTesseract = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const Tesseract = await import('tesseract.js');
      
      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const { data: { text } } = await Tesseract.recognize(
          blob,
          language,
          {
            logger: (m: { status?: string; progress?: number }) => {
              setOcrProgress({
                status: `本地识别: ${m.status || '处理中...'}`,
                progress: Math.round((m.progress || 0) * 100)
              });
            }
          }
        );

        setRecognizedText(text.trim());
        message.success('本地OCR识别完成！');
      }, 'image/png');
    } catch (error) {
      console.error('Tesseract识别失败:', error);
      message.error('所有OCR方案都失败了');
    }
  };

  // 主识别函数
  const recognizeText = async () => {
    console.log('🔴 识别按钮被点击！');
    console.log('🔍 当前状态:', {
      isRecognizing,
      ocrService,
      canvasExists: !!canvasRef.current,
      recognizedText: recognizedText.substring(0, 50)
    });
    await recognizeWithSmartOCR();
  };

  // 复制识别结果
  const copyText = () => {
    if (!recognizedText) return;
    
    navigator.clipboard.writeText(recognizedText).then(() => {
      message.success('文本已复制到剪贴板');
    }).catch(() => {
      message.error('复制失败');
    });
  };

  // 语言选项
  const languageOptions = [
    { value: 'chi_sim+eng', label: '中文+英文' },
    { value: 'eng', label: '英文' },
    { value: 'chi_sim', label: '中文简体' },
    { value: 'chi_tra', label: '中文繁体' },
    { value: 'jpn', label: '日文' },
    { value: 'kor', label: '韩文' },
  ];

  return (
    <div className="text-recognition">
      {/* <div className="page-header">
        <Title level={2}>
          <ScanOutlined /> 文字识别
        </Title>
        <Text type="secondary">在画板上绘制文字，然后进行OCR识别</Text>
      </div> */}

      <Row gutter={24}>
        {/* 左侧画板区域 */}
        <Col span={16}>
          <Card 
            title="绘制画板" 
            className="canvas-card"
            extra={
              <Space>
                <Button
                  icon={<SettingOutlined />}
                  onClick={() => setShowSettings(true)}
                >
                  设置
                </Button>
              </Space>
            }
          >
            {/* 工具栏 */}
            <div className="toolbar">
              <Space wrap>
                <div className="tool-group">
                  <Text strong>绘制工具：</Text>
                  <Space.Compact>
                    <Button
                      type={currentTool === 'pen' ? 'primary' : 'default'}
                      icon={<EditOutlined />}
                      onClick={() => setCurrentTool('pen')}
                    >
                      画笔
                    </Button>
                    <Button
                      type={currentTool === 'eraser' ? 'primary' : 'default'}
                      onClick={() => setCurrentTool('eraser')}
                    >
                      橡皮擦
                    </Button>
                  </Space.Compact>
                </div>

                <div className="tool-group">
                  <Text strong>画笔大小：</Text>
                  <Slider
                    min={1}
                    max={20}
                    value={brushSize}
                    onChange={setBrushSize}
                    style={{ width: 100 }}
                  />
                  <Text>{brushSize}px</Text>
                </div>

                {currentTool === 'pen' && (
                  <div className="tool-group">
                    <Text strong>颜色：</Text>
                    <ColorPicker
                      value={brushColor}
                      onChange={(color) => setBrushColor(color.toHexString())}
                    />
                  </div>
                )}
              </Space>
            </div>

            <Divider />

            {/* Canvas画板 */}
            <div className="canvas-container">
              <div className="canvas-wrapper">
                <canvas
                  ref={canvasRef}
                  className="drawing-canvas"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onTouchCancel={handleTouchEnd}
                />
                <div className="canvas-hint">
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    📝 在画板上绘制或写字，然后点击“识别文字”按钮 · 支持鼠标和触摸操作
                  </Text>
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="canvas-actions">
              <Space>
                <Button
                  icon={<UndoOutlined />}
                  onClick={undoCanvas}
                  disabled={historyIndex <= 0}
                >
                  撤销
                </Button>
                <Button
                  icon={<ClearOutlined />}
                  onClick={clearCanvas}
                >
                  清空
                </Button>
                <Button
                  onClick={testDraw}
                  style={{ backgroundColor: '#ff4d4f', color: 'white' }}
                >
                  测试绘制
                </Button>
                <Button
                  type="primary"
                  icon={<ScanOutlined />}
                  onClick={recognizeText}
                  loading={isRecognizing}
                  size="large"
                >
                  识别文字
                </Button>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={downloadCanvas}
                >
                  下载图片
                </Button>
              </Space>
            </div>
          </Card>
        </Col>

        {/* 右侧识别结果区域 */}
        <Col span={8}>
          <Card title="识别结果" className="result-card">
            {/* OCR服务选择 */}
            <div className="ocr-service-selector">
              <Text strong>OCR引擎：</Text>
              <Select
                value={ocrService}
                onChange={setOcrService}
                style={{ width: '100%', marginTop: 8 }}
                disabled={isRecognizing}
              >
                <Option value="baidu">
                  <span style={{ color: '#1890ff' }}>🚀 百度OCR</span>
                  <Text type="secondary" style={{ fontSize: '12px', marginLeft: 8 }}>(真实高精度)</Text>
                </Option>
                <Option value="google">
                  <span style={{ color: '#4285f4' }}>🤖 Google Vision</span>
                  <Text type="secondary" style={{ fontSize: '12px', marginLeft: 8 }}>(演示版)</Text>
                </Option>
                <Option value="tesseract">
                  <span style={{ color: '#52c41a' }}>💻 Tesseract.js</span>
                  <Text type="secondary" style={{ fontSize: '12px', marginLeft: 8 }}>(本地处理)</Text>
                </Option>
              </Select>
            </div>

            <Divider />

            {/* 语言选择 */}
            <div className="language-selector">
              <Text strong>识别语言：</Text>
              <Select
                value={language}
                onChange={setLanguage}
                style={{ width: '100%', marginTop: 8 }}
                disabled={isRecognizing}
              >
                {languageOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </div>

            <Divider />

            {/* OCR进度 */}
            {isRecognizing && (
              <div className="ocr-progress">
                <Spin size="small" />
                <Text style={{ marginLeft: 8 }}>{ocrProgress.status}</Text>
                <Progress
                  percent={ocrProgress.progress}
                  size="small"
                  style={{ marginTop: 8 }}
                />
              </div>
            )}

            {/* 识别结果 */}
            <div className="recognition-result">
              <div className="result-header">
                <Text strong>识别文本：</Text>
                {recognizedText && (
                  <Button
                    type="link"
                    icon={<CopyOutlined />}
                    onClick={copyText}
                    size="small"
                  >
                    复制
                  </Button>
                )}
              </div>
              
              <TextArea
                value={recognizedText}
                onChange={(e) => setRecognizedText(e.target.value)}
                placeholder={isRecognizing ? "正在识别中..." : "识别结果将显示在这里..."}
                rows={12}
                style={{ marginTop: 8 }}
              />

              {recognizedText && (
                <div className="result-stats">
                  <Tag color="blue">字符数: {recognizedText.length}</Tag>
                  <Tag color="green">行数: {recognizedText.split('\n').length}</Tag>
                </div>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* 设置弹窗 */}
      <Modal
        title="画板设置"
        open={showSettings}
        onCancel={() => setShowSettings(false)}
        footer={null}
        width={400}
      >
        <div className="settings-content">
          <div className="setting-item">
            <Text strong>Canvas尺寸：</Text>
            <Text>800 × 600 像素</Text>
          </div>
          
          <div className="setting-item">
            <Text strong>支持格式：</Text>
            <Text>PNG, JPG</Text>
          </div>
          
          <div className="setting-item">
            <Text strong>OCR引擎：</Text>
            <Text>Tesseract.js</Text>
          </div>
          
          <div className="setting-item">
            <Text strong>识别精度：</Text>
            <Text>中等（可离线使用）</Text>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TextRecognition;
