import React, { useRef, useEffect, useState } from 'react';
import { Card, Space, Button, Slider, Typography, Row, Col } from 'antd';
import { 
  RotateLeftOutlined, 
  RotateRightOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  ReloadOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface ModelViewerProps {
  season: string;
  isPlaying: boolean;
  animationSpeed: number;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ 
  season, 
  isPlaying, 
  animationSpeed 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [zoom, setZoom] = useState(1);

  // 季节主题颜色
  const seasonColors = {
    spring: ['#90EE90', '#98FB98', '#00FF7F', '#32CD32'],
    summer: ['#FFD700', '#FFA500', '#FF6347', '#FF4500'],
    autumn: ['#FF8C00', '#CD853F', '#D2691E', '#A0522D'],
    winter: ['#87CEEB', '#B0E0E6', '#ADD8E6', '#E0F6FF']
  };

  const currentColors = seasonColors[season as keyof typeof seasonColors] || seasonColors.spring;

  // 绘制3D立方体
  const drawCube = (ctx: CanvasRenderingContext2D, time: number) => {
    const canvas = ctx.canvas;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const size = 80 * zoom;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 设置3D变换
    const rotX = rotation.x + (isPlaying ? time * 0.001 * animationSpeed : 0);
    const rotY = rotation.y + (isPlaying ? time * 0.002 * animationSpeed : 0);
    const rotZ = rotation.z + (isPlaying ? time * 0.0015 * animationSpeed : 0);

    // 立方体的8个顶点
    const vertices = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
    ];

    // 应用旋转变换
    const rotatedVertices = vertices.map(([x, y, z]) => {
      // 绕X轴旋转
      let newY = y * Math.cos(rotX) - z * Math.sin(rotX);
      let newZ = y * Math.sin(rotX) + z * Math.cos(rotX);
      y = newY;
      z = newZ;

      // 绕Y轴旋转
      let newX = x * Math.cos(rotY) + z * Math.sin(rotY);
      newZ = -x * Math.sin(rotY) + z * Math.cos(rotY);
      x = newX;
      z = newZ;

      // 绕Z轴旋转
      newX = x * Math.cos(rotZ) - y * Math.sin(rotZ);
      newY = x * Math.sin(rotZ) + y * Math.cos(rotZ);

      return [newX, newY, newZ];
    });

    // 投影到2D并绘制
    const projectedVertices = rotatedVertices.map(([x, y, z]) => [
      centerX + (x * size) / (1 + z * 0.001),
      centerY + (y * size) / (1 + z * 0.001)
    ]);

    // 定义立方体的面
    const faces = [
      [0, 1, 2, 3], // 前面
      [4, 7, 6, 5], // 后面
      [0, 4, 5, 1], // 底面
      [2, 6, 7, 3], // 顶面
      [0, 3, 7, 4], // 左面
      [1, 5, 6, 2]  // 右面
    ];

    // 绘制面
    faces.forEach((face, index) => {
      ctx.beginPath();
      ctx.moveTo(projectedVertices[face[0]][0], projectedVertices[face[0]][1]);
      face.forEach(vertexIndex => {
        ctx.lineTo(projectedVertices[vertexIndex][0], projectedVertices[vertexIndex][1]);
      });
      ctx.closePath();

      // 使用季节颜色填充
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, currentColors[index % currentColors.length]);
      gradient.addColorStop(1, currentColors[(index + 1) % currentColors.length]);
      
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  };

  // 动画循环
  const animate = (time: number) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        drawCube(ctx, time);
      }
    }
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 400;
      canvas.height = 300;
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, animationSpeed, rotation, zoom, season]);

  const handleRotate = (axis: 'x' | 'y' | 'z', direction: number) => {
    setRotation(prev => ({
      ...prev,
      [axis]: prev[axis] + direction * 0.2
    }));
  };

  const handleReset = () => {
    setRotation({ x: 0, y: 0, z: 0 });
    setZoom(1);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Card title="3D 模型查看器" style={{ height: '400px' }}>
            <div style={{ textAlign: 'center' }}>
              <canvas
                ref={canvasRef}
                style={{
                  border: '2px solid #d9d9d9',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
                }}
              />
            </div>
          </Card>
        </Col>
        
        <Col span={8}>
          <Card title="控制面板" style={{ height: '400px' }}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <Title level={5}>旋转控制</Title>
                <Space wrap>
                  <Button 
                    icon={<RotateLeftOutlined />}
                    onClick={() => handleRotate('y', -1)}
                  >
                    左转
                  </Button>
                  <Button 
                    icon={<RotateRightOutlined />}
                    onClick={() => handleRotate('y', 1)}
                  >
                    右转
                  </Button>
                </Space>
                <br /><br />
                <Space wrap>
                  <Button 
                    onClick={() => handleRotate('x', -1)}
                  >
                    上翻
                  </Button>
                  <Button 
                    onClick={() => handleRotate('x', 1)}
                  >
                    下翻
                  </Button>
                </Space>
              </div>

              <div>
                <Title level={5}>缩放控制</Title>
                <Space>
                  <Button 
                    icon={<ZoomOutOutlined />}
                    onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
                  >
                    缩小
                  </Button>
                  <Text>{(zoom * 100).toFixed(0)}%</Text>
                  <Button 
                    icon={<ZoomInOutlined />}
                    onClick={() => setZoom(prev => Math.min(2, prev + 0.1))}
                  >
                    放大
                  </Button>
                </Space>
                <br /><br />
                <Slider
                  min={0.5}
                  max={2}
                  step={0.1}
                  value={zoom}
                  onChange={setZoom}
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
                  当前季节主题: <strong>{season}</strong>
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ModelViewer;
