import React, { useState } from 'react';
import { Card, Space, Button, Typography, Row, Col, Switch, Slider } from 'antd';
import { 
  FullscreenOutlined,
  ReloadOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface PanoramaViewerProps {
  season: string;
  isPlaying: boolean;
}

const PanoramaViewer: React.FC<PanoramaViewerProps> = ({ 
  season, 
  isPlaying 
}) => {
  const [viewAngle, setViewAngle] = useState(0);
  const [verticalAngle, setVerticalAngle] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [fov, setFov] = useState(60);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 季节主题场景
  const seasonScenes = {
    spring: {
      skyColor: '#87CEEB',
      groundColor: '#90EE90',
      objects: [
        { type: 'tree', color: '#228B22', x: -100, size: 80 },
        { type: 'flower', color: '#FF69B4', x: 50, size: 20 },
        { type: 'cloud', color: '#FFFFFF', x: 0, y: -80, size: 60 }
      ]
    },
    summer: {
      skyColor: '#FFD700',
      groundColor: '#32CD32',
      objects: [
        { type: 'sun', color: '#FFA500', x: 120, y: -100, size: 40 },
        { type: 'tree', color: '#006400', x: -80, size: 90 },
        { type: 'grass', color: '#7CFC00', x: 30, size: 15 }
      ]
    },
    autumn: {
      skyColor: '#CD853F',
      groundColor: '#D2691E',
      objects: [
        { type: 'tree', color: '#FF8C00', x: -60, size: 85 },
        { type: 'leaf', color: '#FF4500', x: 80, size: 10 },
        { type: 'mountain', color: '#A0522D', x: 150, size: 120 }
      ]
    },
    winter: {
      skyColor: '#B0E0E6',
      groundColor: '#FFFFFF',
      objects: [
        { type: 'snowman', color: '#FFFFFF', x: -40, size: 60 },
        { type: 'tree', color: '#2F4F4F', x: 100, size: 70 },
        { type: 'snowflake', color: '#E0F6FF', x: 0, y: -60, size: 8 }
      ]
    }
  };

  const currentScene = seasonScenes[season as keyof typeof seasonScenes] || seasonScenes.spring;

  // 绘制全景场景
  const drawPanorama = (ctx: CanvasRenderingContext2D, time: number) => {
    const canvas = ctx.canvas;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 计算视角
    const currentViewAngle = viewAngle + (autoRotate && isPlaying ? time * 0.0005 : 0);
    
    // 绘制天空渐变
    const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    skyGradient.addColorStop(0, currentScene.skyColor);
    skyGradient.addColorStop(1, currentScene.groundColor);
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制地平线
    const horizonY = centerY + verticalAngle;
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, horizonY);
    ctx.lineTo(canvas.width, horizonY);
    ctx.stroke();

    // 绘制场景对象
    currentScene.objects.forEach((obj, index) => {
      const objAngle = (obj.x / 100) * Math.PI; // 对象在全景中的角度
      const relativeAngle = objAngle - currentViewAngle;
      
      // 只绘制在视野范围内的对象
      const fovRad = (fov * Math.PI) / 180;
      if (Math.abs(relativeAngle) < fovRad) {
        const screenX = centerX + Math.sin(relativeAngle) * 200;
        const screenY = horizonY + (obj.y || 0) - obj.size / 2;
        
        // 根据距离调整大小
        const distance = Math.abs(relativeAngle) / fovRad;
        const adjustedSize = obj.size * (1 - distance * 0.5);

        ctx.save();
        ctx.translate(screenX, screenY);

        // 绘制不同类型的对象
        switch (obj.type) {
          case 'tree':
            // 树干
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(-adjustedSize * 0.1, 0, adjustedSize * 0.2, adjustedSize * 0.6);
            // 树冠
            ctx.fillStyle = obj.color;
            ctx.beginPath();
            ctx.arc(0, -adjustedSize * 0.2, adjustedSize * 0.4, 0, Math.PI * 2);
            ctx.fill();
            break;

          case 'sun':
            ctx.fillStyle = obj.color;
            ctx.beginPath();
            ctx.arc(0, 0, adjustedSize, 0, Math.PI * 2);
            ctx.fill();
            // 太阳光芒
            ctx.strokeStyle = obj.color;
            ctx.lineWidth = 3;
            for (let i = 0; i < 8; i++) {
              const angle = (i * Math.PI) / 4;
              ctx.beginPath();
              ctx.moveTo(Math.cos(angle) * adjustedSize * 1.2, Math.sin(angle) * adjustedSize * 1.2);
              ctx.lineTo(Math.cos(angle) * adjustedSize * 1.5, Math.sin(angle) * adjustedSize * 1.5);
              ctx.stroke();
            }
            break;

          case 'cloud':
            ctx.fillStyle = obj.color;
            for (let i = 0; i < 3; i++) {
              ctx.beginPath();
              ctx.arc(i * adjustedSize * 0.3 - adjustedSize * 0.3, 0, adjustedSize * 0.3, 0, Math.PI * 2);
              ctx.fill();
            }
            break;

          case 'mountain':
            ctx.fillStyle = obj.color;
            ctx.beginPath();
            ctx.moveTo(-adjustedSize * 0.5, adjustedSize * 0.3);
            ctx.lineTo(0, -adjustedSize * 0.5);
            ctx.lineTo(adjustedSize * 0.5, adjustedSize * 0.3);
            ctx.closePath();
            ctx.fill();
            break;

          case 'snowman':
            // 雪人身体
            ctx.fillStyle = obj.color;
            ctx.beginPath();
            ctx.arc(0, adjustedSize * 0.2, adjustedSize * 0.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(0, -adjustedSize * 0.1, adjustedSize * 0.2, 0, Math.PI * 2);
            ctx.fill();
            // 帽子
            ctx.fillStyle = '#000';
            ctx.fillRect(-adjustedSize * 0.15, -adjustedSize * 0.4, adjustedSize * 0.3, adjustedSize * 0.2);
            break;

          default:
            // 默认圆形对象
            ctx.fillStyle = obj.color;
            ctx.beginPath();
            ctx.arc(0, 0, adjustedSize, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
      }
    });

    // 绘制视野指示器
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    const fovWidth = (fov / 180) * canvas.width;
    ctx.strokeRect(centerX - fovWidth / 2, 10, fovWidth, 20);
    ctx.setLineDash([]);

    // 绘制角度信息
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, 150, 60);
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.fillText(`视角: ${((currentViewAngle * 180) / Math.PI).toFixed(1)}°`, 20, 30);
    ctx.fillText(`垂直: ${verticalAngle.toFixed(1)}px`, 20, 50);
  };

  // 动画循环
  const animate = (time: number) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        drawPanorama(ctx, time);
      }
    }
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 600;
      canvas.height = 400;
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, viewAngle, verticalAngle, autoRotate, fov, season]);

  const handleReset = () => {
    setViewAngle(0);
    setVerticalAngle(0);
    setFov(60);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Card 
            title="全景浏览器" 
            style={{ height: '500px' }}
            extra={
              <Button
                icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? '退出全屏' : '全屏'}
              </Button>
            }
          >
            <div style={{ textAlign: 'center' }}>
              <canvas
                ref={canvasRef}
                style={{
                  border: '2px solid #d9d9d9',
                  borderRadius: '8px',
                  background: '#f0f2f5',
                  cursor: 'grab'
                }}
                onMouseDown={(e) => {
                  const startX = e.clientX;
                  const startAngle = viewAngle;
                  
                  const handleMouseMove = (moveEvent: MouseEvent) => {
                    const deltaX = moveEvent.clientX - startX;
                    setViewAngle(startAngle + (deltaX * 0.01));
                  };
                  
                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                  };
                  
                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                }}
              />
            </div>
          </Card>
        </Col>
        
        <Col span={8}>
          <Card title="控制面板" style={{ height: '500px' }}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <Title level={5}>视角控制</Title>
                <Text>水平角度</Text>
                <Slider
                  min={-Math.PI}
                  max={Math.PI}
                  step={0.1}
                  value={viewAngle}
                  onChange={setViewAngle}
                />
                
                <Text>垂直偏移</Text>
                <Slider
                  min={-100}
                  max={100}
                  step={5}
                  value={verticalAngle}
                  onChange={setVerticalAngle}
                />
              </div>

              <div>
                <Title level={5}>视野设置</Title>
                <Text>视野角度: {fov}°</Text>
                <Slider
                  min={30}
                  max={120}
                  step={5}
                  value={fov}
                  onChange={setFov}
                />
              </div>

              <div>
                <Title level={5}>自动旋转</Title>
                <Switch
                  checked={autoRotate}
                  onChange={setAutoRotate}
                  checkedChildren="开启"
                  unCheckedChildren="关闭"
                />
              </div>

              <div>
                <Button 
                  icon={<ReloadOutlined />}
                  onClick={handleReset}
                  type="primary"
                  block
                >
                  重置视角
                </Button>
              </div>

              <div>
                <Text type="secondary">
                  当前场景: <strong>{season}</strong><br />
                  拖拽画布可旋转视角
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PanoramaViewer;
