import { useState } from 'react';
import { Card, Row, Col, Typography, Divider, Space, Tag } from 'antd';
import { 
  DragOutlined, 
  CloudUploadOutlined, 
  OrderedListOutlined, 
  AppstoreOutlined,
  SwapOutlined 
} from '@ant-design/icons';
import FileDragUpload from './components/FileDragUpload.tsx';
import SortableList from './components/SortableList.tsx';
import KanbanBoard from './components/KanbanBoard.tsx';
import DragSwapCards from './components/DragSwapCards.tsx';
import './index.less';

const { Title, Paragraph, Text } = Typography;

const DragDemo = () => {
  const [activeDemo, setActiveDemo] = useState<string>('file-upload');

  const demoSections = [
    {
      key: 'file-upload',
      title: '文件拖拽上传',
      icon: <CloudUploadOutlined />,
      description: '支持多文件拖拽上传，文件类型验证，进度显示',
      component: <FileDragUpload />
    },
    {
      key: 'sortable-list',
      title: '列表拖拽排序',
      icon: <OrderedListOutlined />,
      description: '可拖拽排序的列表，支持动画效果和位置指示',
      component: <SortableList />
    },
    {
      key: 'kanban-board',
      title: '看板拖拽',
      icon: <AppstoreOutlined />,
      description: '仿Trello看板，支持卡片在不同列之间拖拽',
      component: <KanbanBoard />
    },
    {
      key: 'drag-swap',
      title: '卡片拖拽交换',
      icon: <SwapOutlined />,
      description: '两个卡片之间的拖拽交换位置功能',
      component: <DragSwapCards />
    }
  ];

  return (
    <div className="drag-demo-container">
      {/* 页面标题 */}
      <div className="demo-header">
        <Space align="center" size="large">
          <DragOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
          <div>
            <Title level={2} style={{ margin: 0 }}>
              拖拽组件演示
            </Title>
            <Paragraph style={{ margin: '8px 0 0 0', color: '#666' }}>
              展示各种拖拽交互功能的实现，包括文件上传、列表排序、看板拖拽等
            </Paragraph>
          </div>
        </Space>
      </div>

      <Divider />

      {/* 功能导航 */}
      <div className="demo-navigation">
        <Row gutter={[16, 16]}>
          {demoSections.map((section) => (
            <Col xs={24} sm={12} md={6} key={section.key}>
              <Card
                hoverable
                className={`nav-card ${activeDemo === section.key ? 'active' : ''}`}
                onClick={() => setActiveDemo(section.key)}
                bodyStyle={{ padding: '16px' }}
              >
                <Space direction="vertical" align="center" style={{ width: '100%' }}>
                  <div className="nav-icon">
                    {section.icon}
                  </div>
                  <Text strong>{section.title}</Text>
                  <Text type="secondary" style={{ fontSize: '12px', textAlign: 'center' }}>
                    {section.description}
                  </Text>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <Divider />

      {/* 当前演示区域 */}
      <div className="demo-content">
        <Card 
          title={
            <Space>
              {demoSections.find(s => s.key === activeDemo)?.icon}
              {demoSections.find(s => s.key === activeDemo)?.title}
              <Tag color="blue">演示</Tag>
            </Space>
          }
          className="demo-card"
        >
          {demoSections.find(s => s.key === activeDemo)?.component}
        </Card>
      </div>

      {/* 技术说明 */}
      <Card title="技术实现说明" className="tech-info">
        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <Title level={4}>核心技术</Title>
            <ul>
              <li><Text code>HTML5 Drag & Drop API</Text> - 原生拖拽API</li>
              <li><Text code>React Hooks</Text> - 状态管理和副作用处理</li>
              <li><Text code>CSS Transform</Text> - 动画和位置变换</li>
              <li><Text code>File API</Text> - 文件处理和预览</li>
            </ul>
          </Col>
          <Col xs={24} md={12}>
            <Title level={4}>功能特性</Title>
            <ul>
              <li>🎯 精确的拖拽检测和位置计算</li>
              <li>✨ 流畅的动画过渡效果</li>
              <li>📱 响应式设计，支持移动端</li>
              <li>🔧 可扩展的组件架构</li>
            </ul>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default DragDemo;
