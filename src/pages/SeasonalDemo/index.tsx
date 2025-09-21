import React from 'react';
import { Card, Row, Col, Button, Space, Typography, Divider, Tag, Avatar } from 'antd';
import { 
  HeartOutlined, 
  StarOutlined, 
  LikeOutlined, 
  MessageOutlined,
  ShareAltOutlined,
  UserOutlined,
  CalendarOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import { useSeasonalTheme } from '@/components/SeasonalTheme';
import './index.less';

const { Title, Paragraph, Text } = Typography;

const SeasonalDemo: React.FC = () => {
  const { currentSeason, themeConfig } = useSeasonalTheme();

  const demoCards = [
    {
      title: '季节主题展示',
      description: '体验不同季节带来的视觉感受，每个主题都有独特的颜色搭配和动画效果。',
      icon: '🎨',
      actions: ['设置', '分享', '收藏']
    },
    {
      title: '动态装饰效果',
      description: '按钮和卡片会根据当前季节显示相应的装饰元素，如雪花、枫叶、樱花等。',
      icon: '✨',
      actions: ['查看', '体验', '了解']
    },
    {
      title: '粒子动画系统',
      description: '背景中的粒子效果会随季节变化，营造沉浸式的主题氛围。',
      icon: '🌟',
      actions: ['启用', '自定义', '设置']
    }
  ];

  const seasonInfo = {
    spring: {
      mood: '生机勃勃',
      colors: ['嫩绿', '粉红', '淡黄'],
      elements: ['樱花', '新叶', '蝴蝶']
    },
    summer: {
      mood: '活力四射',
      colors: ['天蓝', '金黄', '清绿'],
      elements: ['阳光', '海浪', '星光']
    },
    autumn: {
      mood: '温暖怀旧',
      colors: ['橙红', '金黄', '棕褐'],
      elements: ['枫叶', '果实', '微风']
    },
    winter: {
      mood: '宁静纯洁',
      colors: ['冰蓝', '雪白', '紫罗兰'],
      elements: ['雪花', '冰晶', '星空']
    }
  };

  const currentSeasonInfo = seasonInfo[currentSeason];

  return (
    <div className="seasonal-demo">
      {/* 页面标题 */}
      <div className="demo-header">
        <Space align="center" size="large">
          <span style={{ fontSize: '48px' }}>{themeConfig.icon}</span>
          <div>
            <Title level={1} style={{ margin: 0, color: 'var(--seasonal-text-primary)' }}>
              季节主题展示
            </Title>
            <Paragraph style={{ margin: '8px 0 0 0', fontSize: '16px' }}>
              当前主题：{themeConfig.name} - {currentSeasonInfo.mood}
            </Paragraph>
          </div>
        </Space>
      </div>

      <Divider />

      {/* 主题信息卡片 */}
      <Card 
        title={
          <Space>
            <span>{themeConfig.icon}</span>
            <Text strong>主题详情</Text>
          </Space>
        }
        className="theme-info-card"
        style={{ marginBottom: '24px' }}
      >
        <Row gutter={[24, 16]}>
          <Col xs={24} md={8}>
            <div className="info-item">
              <Text type="secondary">主题氛围</Text>
              <Title level={4} style={{ margin: '4px 0', color: 'var(--seasonal-primary)' }}>
                {currentSeasonInfo.mood}
              </Title>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="info-item">
              <Text type="secondary">主要色彩</Text>
              <div style={{ marginTop: '8px' }}>
                <Space wrap>
                  {currentSeasonInfo.colors.map((color, index) => (
                    <Tag key={index} color={themeConfig.colors.primary}>
                      {color}
                    </Tag>
                  ))}
                </Space>
              </div>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="info-item">
              <Text type="secondary">装饰元素</Text>
              <div style={{ marginTop: '8px' }}>
                <Space wrap>
                  {currentSeasonInfo.elements.map((element, index) => (
                    <Tag key={index} color="default">
                      {element}
                    </Tag>
                  ))}
                </Space>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 功能演示卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {demoCards.map((card, index) => (
          <Col xs={24} md={8} key={index}>
            <Card
              className="demo-card"
              actions={card.actions.map(action => (
                <Button key={action} type="text" size="small">
                  {action}
                </Button>
              ))}
            >
              <div className="card-content">
                <div className="card-icon">
                  <span style={{ fontSize: '32px' }}>{card.icon}</span>
                </div>
                <Title level={4} style={{ margin: '16px 0 8px 0' }}>
                  {card.title}
                </Title>
                <Paragraph type="secondary" style={{ margin: 0 }}>
                  {card.description}
                </Paragraph>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 交互按钮展示 */}
      <Card title="按钮装饰效果展示" style={{ marginBottom: '24px' }}>
        <Space wrap size="large">
          <Button type="primary" size="large" icon={<HeartOutlined />}>
            主要按钮
          </Button>
          <Button type="default" size="large" icon={<StarOutlined />}>
            默认按钮
          </Button>
          <Button type="dashed" size="large" icon={<LikeOutlined />}>
            虚线按钮
          </Button>
          <Button type="text" size="large" icon={<MessageOutlined />}>
            文本按钮
          </Button>
          <Button type="link" size="large" icon={<ShareAltOutlined />}>
            链接按钮
          </Button>
        </Space>
        <Divider />
        <Text type="secondary">
          💡 将鼠标悬停在按钮上，观察季节装饰效果的变化
        </Text>
      </Card>

      {/* 用户卡片展示 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="用户信息" className="user-card">
            <div className="user-profile">
              <Avatar size={64} icon={<UserOutlined />} />
              <div className="user-info">
                <Title level={4} style={{ margin: '8px 0 4px 0' }}>
                  季节主题用户
                </Title>
                <Text type="secondary">主题设计师</Text>
              </div>
            </div>
            <Divider />
            <Space direction="vertical" style={{ width: '100%' }}>
              <div className="user-stat">
                <CalendarOutlined style={{ marginRight: '8px' }} />
                <Text>加入时间：2024年{currentSeason === 'spring' ? '春' : currentSeason === 'summer' ? '夏' : currentSeason === 'autumn' ? '秋' : '冬'}季</Text>
              </div>
              <div className="user-stat">
                <EnvironmentOutlined style={{ marginRight: '8px' }} />
                <Text>当前主题：{themeConfig.name}</Text>
              </div>
            </Space>
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card title="主题统计" className="stats-card">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div className="stat-item">
                  <Title level={2} style={{ margin: 0, color: 'var(--seasonal-primary)' }}>
                    4
                  </Title>
                  <Text type="secondary">可用主题</Text>
                </div>
              </Col>
              <Col span={12}>
                <div className="stat-item">
                  <Title level={2} style={{ margin: 0, color: 'var(--seasonal-primary)' }}>
                    {themeConfig.particles.count}
                  </Title>
                  <Text type="secondary">粒子数量</Text>
                </div>
              </Col>
              <Col span={12}>
                <div className="stat-item">
                  <Title level={2} style={{ margin: 0, color: 'var(--seasonal-primary)' }}>
                    ∞
                  </Title>
                  <Text type="secondary">装饰效果</Text>
                </div>
              </Col>
              <Col span={12}>
                <div className="stat-item">
                  <Title level={2} style={{ margin: 0, color: 'var(--seasonal-primary)' }}>
                    100%
                  </Title>
                  <Text type="secondary">沉浸体验</Text>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* 使用说明 */}
      <Card title="使用说明" style={{ marginTop: '24px' }}>
        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <Title level={4}>🎨 如何切换主题</Title>
            <Paragraph>
              点击右上角的季节图标按钮，选择你喜欢的季节主题。主题会自动保存，下次访问时仍然生效。
            </Paragraph>
          </Col>
          <Col xs={24} md={12}>
            <Title level={4}>✨ 装饰效果说明</Title>
            <Paragraph>
              每个季节都有独特的装饰效果：冬天有雪花，秋天有枫叶，春天有樱花，夏天有阳光粒子。
            </Paragraph>
          </Col>
          <Col xs={24} md={12}>
            <Title level={4}>🌟 粒子动画</Title>
            <Paragraph>
              背景中的粒子会根据季节变化，营造相应的氛围。在移动设备上会自动优化以提升性能。
            </Paragraph>
          </Col>
          <Col xs={24} md={12}>
            <Title level={4}>📱 响应式设计</Title>
            <Paragraph>
              主题系统完全支持响应式设计，在不同设备上都能获得最佳的视觉体验。
            </Paragraph>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default SeasonalDemo;
