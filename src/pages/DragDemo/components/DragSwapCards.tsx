import { useState, useCallback } from 'react';
import { Card, Button, Space, Typography, Avatar, Tag, Row, Col, message } from 'antd';
import { 
  SwapOutlined, 
  UserOutlined, 
  ReloadOutlined,
  StarOutlined,
  TrophyOutlined,
  CrownOutlined 
} from '@ant-design/icons';
import './DragSwapCards.less';

const { Text, Title } = Typography;

interface Player {
  id: string;
  name: string;
  position: string;
  level: number;
  score: number;
  avatar?: string;
  skills: string[];
  rank: 'bronze' | 'silver' | 'gold' | 'diamond';
}

const DragSwapCards = () => {
  const [players, setPlayers] = useState<Player[]>([
    {
      id: '1',
      name: '张三',
      position: '前锋',
      level: 85,
      score: 2340,
      skills: ['速度', '射门', '盘带'],
      rank: 'gold'
    },
    {
      id: '2',
      name: '李四',
      position: '中场',
      level: 78,
      score: 1890,
      skills: ['传球', '视野', '控球'],
      rank: 'silver'
    },
    {
      id: '3',
      name: '王五',
      position: '后卫',
      level: 82,
      score: 2100,
      skills: ['防守', '拦截', '头球'],
      rank: 'gold'
    },
    {
      id: '4',
      name: '赵六',
      position: '门将',
      level: 90,
      score: 2680,
      skills: ['扑救', '反应', '指挥'],
      rank: 'diamond'
    },
    {
      id: '5',
      name: '钱七',
      position: '边锋',
      level: 75,
      score: 1650,
      skills: ['突破', '传中', '速度'],
      rank: 'silver'
    },
    {
      id: '6',
      name: '孙八',
      position: '中锋',
      level: 88,
      score: 2450,
      skills: ['射门', '力量', '头球'],
      rank: 'diamond'
    }
  ]);

  const [, setDraggedPlayer] = useState<Player | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // 获取等级配置
  const getRankConfig = (rank: string) => {
    const configs = {
      bronze: { color: '#cd7f32', icon: <StarOutlined />, text: '青铜' },
      silver: { color: '#c0c0c0', icon: <TrophyOutlined />, text: '白银' },
      gold: { color: '#ffd700', icon: <TrophyOutlined />, text: '黄金' },
      diamond: { color: '#b9f2ff', icon: <CrownOutlined />, text: '钻石' }
    };
    return configs[rank as keyof typeof configs] || configs.bronze;
  };

  // 开始拖拽
  const handleDragStart = useCallback((e: React.DragEvent, player: Player, index: number) => {
    setDraggedPlayer(player);
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    
    // 设置拖拽数据
    e.dataTransfer.setData('text/plain', player.id);
    
    const target = e.target as HTMLElement;
    const cardElement = target.closest('.player-card') as HTMLElement;
    if (cardElement) {
      // 立即强制原始元素保持无变换状态
      cardElement.style.cssText += `
        transform: none !important;
        rotate: none !important;
        scale: none !important;
        translate: none !important;
        animation: none !important;
      `;
      
      // 创建一个完全无变换的自定义拖拽图像
      const dragImage = cardElement.cloneNode(true) as HTMLElement;
      dragImage.style.cssText = `
        transform: none !important;
        opacity: 1 !important;
        position: absolute !important;
        top: -1000px !important;
        left: -1000px !important;
        z-index: 9999 !important;
        animation: none !important;
        transition: none !important;
        rotate: none !important;
        scale: none !important;
        translate: none !important;
      `;
      document.body.appendChild(dragImage);
      
      // 设置自定义拖拽图像
      e.dataTransfer.setDragImage(dragImage, cardElement.offsetWidth / 2, cardElement.offsetHeight / 2);
      
      // 立即清理克隆的元素
      setTimeout(() => {
        if (document.body.contains(dragImage)) {
          document.body.removeChild(dragImage);
        }
      }, 0);
    }
  }, []);

  // 拖拽结束
  const handleDragEnd = useCallback((e: React.DragEvent) => {
    // 强制重置拖拽元素的所有样式
    const target = e.target as HTMLElement;
    const cardElement = target.closest('.player-card') as HTMLElement;
    if (cardElement) {
      // 移除拖拽类名
      cardElement.classList.remove('dragging');
      // 强制重置所有可能的变换样式
      cardElement.style.cssText += `
        transform: none !important;
        opacity: 1 !important;
        z-index: auto !important;
        animation: none !important;
        transition: all 0.3s ease !important;
        rotate: none !important;
        scale: none !important;
        translate: none !important;
      `;
      
      // 强制重新计算样式
      void cardElement.offsetHeight;
      
      // 清除内联样式，让CSS接管
      setTimeout(() => {
        cardElement.style.transform = '';
        cardElement.style.opacity = '';
        cardElement.style.zIndex = '';
        cardElement.style.animation = '';
        cardElement.style.rotate = '';
        cardElement.style.scale = '';
        cardElement.style.translate = '';
      }, 100);
    }
    
    setDraggedPlayer(null);
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, []);

  // 拖拽经过
  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  }, [draggedIndex]);

  // 拖拽离开
  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null);
  }, []);

  // 放置交换
  const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      return;
    }

    setPlayers(prevPlayers => {
      const newPlayers = [...prevPlayers];
      
      // 交换两个位置的球员
      const temp = newPlayers[draggedIndex];
      newPlayers[draggedIndex] = newPlayers[dropIndex];
      newPlayers[dropIndex] = temp;
      
      return newPlayers;
    });

    const draggedPlayerName = players[draggedIndex].name;
    const targetPlayerName = players[dropIndex].name;
    
    message.success(`${draggedPlayerName} 与 ${targetPlayerName} 已交换位置`);
    setDragOverIndex(null);
  }, [draggedIndex, players]);

  // 重置阵容
  const resetFormation = () => {
    const initialPlayers: Player[] = [
      {
        id: '1',
        name: '张三',
        position: '前锋',
        level: 85,
        score: 2340,
        skills: ['速度', '射门', '盘带'],
        rank: 'gold'
      },
      {
        id: '2',
        name: '李四',
        position: '中场',
        level: 78,
        score: 1890,
        skills: ['传球', '视野', '控球'],
        rank: 'silver'
      },
      {
        id: '3',
        name: '王五',
        position: '后卫',
        level: 82,
        score: 2100,
        skills: ['防守', '拦截', '头球'],
        rank: 'gold'
      },
      {
        id: '4',
        name: '赵六',
        position: '门将',
        level: 90,
        score: 2680,
        skills: ['扑救', '反应', '指挥'],
        rank: 'diamond'
      },
      {
        id: '5',
        name: '钱七',
        position: '边锋',
        level: 75,
        score: 1650,
        skills: ['突破', '传中', '速度'],
        rank: 'silver'
      },
      {
        id: '6',
        name: '孙八',
        position: '中锋',
        level: 88,
        score: 2450,
        skills: ['射门', '力量', '头球'],
        rank: 'diamond'
      }
    ];
    setPlayers(initialPlayers);
    message.info('阵容已重置');
  };

  // 随机排列
  const shuffleFormation = () => {
    setPlayers(prevPlayers => {
      const shuffled = [...prevPlayers];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });
    message.success('阵容已随机排列');
  };

  return (
    <div className="drag-swap-cards">
      {/* 操作按钮 */}
      <div className="swap-actions">
        <Space>
          <Button onClick={shuffleFormation} type="primary" icon={<SwapOutlined />}>
            随机排列
          </Button>
          <Button onClick={resetFormation} icon={<ReloadOutlined />}>
            重置阵容
          </Button>
        </Space>
      </div>

      {/* 拖拽提示 */}
      <Card size="small" className="drag-hint">
        <Text type="secondary">
          💡 拖拽提示：拖拽球员卡片到另一个球员位置进行交换，支持任意两个位置的交换
        </Text>
      </Card>

      {/* 球员阵容标题 */}
      <div className="formation-title">
        <Title level={4}>
          <Space>
            <TrophyOutlined style={{ color: '#faad14' }} />
            球员阵容管理
          </Space>
        </Title>
      </div>

      {/* 球员卡片网格 */}
      <Row gutter={[16, 16]} className="players-grid">
        {players.map((player, index) => {
          const rankConfig = getRankConfig(player.rank);
          const isDragging = draggedIndex === index;
          const isDragOver = dragOverIndex === index;
          
          return (
            <Col xs={24} sm={12} md={8} lg={6} key={player.id}>
              <Card
                className={`player-card ${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, player, index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                hoverable
              >
                {/* 卡片头部 */}
                <div className="card-header">
                  <div className="player-rank" style={{ color: rankConfig.color }}>
                    {rankConfig.icon}
                    <Text style={{ color: rankConfig.color, fontSize: '12px', marginLeft: '4px' }}>
                      {rankConfig.text}
                    </Text>
                  </div>
                  <div className="player-level">
                    <Text strong style={{ color: '#1890ff' }}>
                      Lv.{player.level}
                    </Text>
                  </div>
                </div>

                {/* 球员头像和基本信息 */}
                <div className="player-info">
                  <Avatar 
                    size={64} 
                    src={player.avatar} 
                    icon={<UserOutlined />}
                    className="player-avatar"
                  />
                  <div className="player-details">
                    <Title level={5} className="player-name">
                      {player.name}
                    </Title>
                    <Text type="secondary" className="player-position">
                      {player.position}
                    </Text>
                  </div>
                </div>

                {/* 球员分数 */}
                <div className="player-score">
                  <Text strong style={{ fontSize: '20px', color: '#52c41a' }}>
                    {player.score.toLocaleString()}
                  </Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    积分
                  </Text>
                </div>

                {/* 技能标签 */}
                <div className="player-skills">
                  {player.skills.map(skill => (
                    <Tag key={skill} color="blue">
                      {skill}
                    </Tag>
                  ))}
                </div>

                {/* 拖拽指示器 */}
                <div className="drag-indicator">
                  <SwapOutlined />
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* 统计信息 */}
      <Card title="阵容统计" className="formation-stats">
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={6}>
            <div className="stat-item">
              <Text type="secondary">总球员</Text>
              <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
                {players.length}
              </Title>
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div className="stat-item">
              <Text type="secondary">平均等级</Text>
              <Title level={3} style={{ margin: 0, color: '#52c41a' }}>
                {Math.round(players.reduce((sum, p) => sum + p.level, 0) / players.length)}
              </Title>
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div className="stat-item">
              <Text type="secondary">总积分</Text>
              <Title level={3} style={{ margin: 0, color: '#faad14' }}>
                {players.reduce((sum, p) => sum + p.score, 0).toLocaleString()}
              </Title>
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div className="stat-item">
              <Text type="secondary">钻石球员</Text>
              <Title level={3} style={{ margin: 0, color: '#722ed1' }}>
                {players.filter(p => p.rank === 'diamond').length}
              </Title>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default DragSwapCards;
