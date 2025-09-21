import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Space, Typography } from 'antd';
import { RotateLeftOutlined, RotateRightOutlined, ReloadOutlined } from '@ant-design/icons';
import { SeasonType } from '@/components/SeasonalTheme';
import './FlipCard3D.less';

const { Title, Text } = Typography;

interface FlipCard3DProps {
  season: SeasonType;
  isPlaying: boolean;
  animationSpeed: number;
}

interface CardData {
  id: number;
  front: {
    title: string;
    content: string;
    icon: string;
    color: string;
  };
  back: {
    title: string;
    content: string;
    details: string[];
    color: string;
  };
}

const FlipCard3D: React.FC<FlipCard3DProps> = ({ season, isPlaying, animationSpeed }) => {
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [autoFlipIndex, setAutoFlipIndex] = useState(0);

  // 季节主题卡片数据
  const getSeasonalCards = (season: SeasonType): CardData[] => {
    const cardSets = {
      spring: [
        {
          id: 1,
          front: { title: '春暖花开', content: '万物复苏的季节', icon: '🌸', color: '#52c41a' },
          back: { 
            title: '春天特色', 
            content: '生机勃勃的美好时光',
            details: ['樱花盛开', '绿意盎然', '温暖和煦', '新生希望'],
            color: '#73d13d'
          }
        },
        {
          id: 2,
          front: { title: '春雨绵绵', content: '滋润大地的甘露', icon: '🌧️', color: '#1890ff' },
          back: { 
            title: '春雨之美', 
            content: '细雨如丝，润物无声',
            details: ['细雨如丝', '空气清新', '万物生长', '诗意盎然'],
            color: '#40a9ff'
          }
        },
        {
          id: 3,
          front: { title: '春风拂面', content: '温柔的春日微风', icon: '🍃', color: '#faad14' },
          back: { 
            title: '春风特质', 
            content: '轻柔温暖，带来希望',
            details: ['温柔轻抚', '花香阵阵', '心情愉悦', '充满活力'],
            color: '#ffc53d'
          }
        }
      ],
      summer: [
        {
          id: 1,
          front: { title: '夏日骄阳', content: '热情似火的季节', icon: '☀️', color: '#fadb14' },
          back: { 
            title: '夏日活力', 
            content: '充满激情与活力',
            details: ['阳光灿烂', '热情奔放', '活力四射', '青春洋溢'],
            color: '#ffd666'
          }
        },
        {
          id: 2,
          front: { title: '碧海蓝天', content: '清爽的海洋气息', icon: '🌊', color: '#1890ff' },
          back: { 
            title: '海洋魅力', 
            content: '广阔无垠的蓝色世界',
            details: ['海天一色', '波光粼粼', '清爽怡人', '无限宽广'],
            color: '#40a9ff'
          }
        },
        {
          id: 3,
          front: { title: '夏夜星空', content: '璀璨的星河银汉', icon: '⭐', color: '#722ed1' },
          back: { 
            title: '星空之美', 
            content: '浩瀚宇宙的神秘魅力',
            details: ['繁星点点', '银河璀璨', '神秘浪漫', '无限遐想'],
            color: '#9254de'
          }
        }
      ],
      autumn: [
        {
          id: 1,
          front: { title: '秋叶满山', content: '层林尽染的美景', icon: '🍂', color: '#fa8c16' },
          back: { 
            title: '秋色斑斓', 
            content: '大自然的调色盘',
            details: ['层林尽染', '色彩斑斓', '诗意浓郁', '收获满满'],
            color: '#ffa940'
          }
        },
        {
          id: 2,
          front: { title: '金桂飘香', content: '醉人的秋日芬芳', icon: '🌰', color: '#faad14' },
          back: { 
            title: '秋香阵阵', 
            content: '沁人心脾的自然香气',
            details: ['桂花飘香', '果实累累', '丰收喜悦', '温馨怀旧'],
            color: '#ffc53d'
          }
        },
        {
          id: 3,
          front: { title: '秋风萧瑟', content: '诗意的秋日情怀', icon: '🍁', color: '#d4380d' },
          back: { 
            title: '秋意浓浓', 
            content: '深沉而富有韵味',
            details: ['秋风习习', '落叶纷飞', '思绪万千', '诗意人生'],
            color: '#f5222d'
          }
        }
      ],
      winter: [
        {
          id: 1,
          front: { title: '雪花纷飞', content: '纯洁的冬日精灵', icon: '❄️', color: '#13c2c2' },
          back: { 
            title: '雪之纯净', 
            content: '洁白无瑕的美好',
            details: ['雪花飞舞', '银装素裹', '纯洁无暇', '宁静致远'],
            color: '#36cfc9'
          }
        },
        {
          id: 2,
          front: { title: '冰晶世界', content: '晶莹剔透的仙境', icon: '💎', color: '#722ed1' },
          back: { 
            title: '冰雪奇缘', 
            content: '梦幻般的冰雪世界',
            details: ['冰晶闪烁', '梦幻仙境', '纯净美好', '静谧安详'],
            color: '#9254de'
          }
        },
        {
          id: 3,
          front: { title: '冬日暖阳', content: '温暖人心的阳光', icon: '🌞', color: '#faad14' },
          back: { 
            title: '暖阳如春', 
            content: '冬日里的温暖希望',
            details: ['阳光温暖', '驱散严寒', '希望之光', '温馨如家'],
            color: '#ffc53d'
          }
        }
      ]
    };
    
    return cardSets[season] || cardSets.spring;
  };

  const cards = getSeasonalCards(season);

  // 自动翻转效果
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setAutoFlipIndex((prev) => (prev + 1) % cards.length);
      
      // 自动翻转当前卡片
      setFlippedCards(prev => {
        const newSet = new Set(prev);
        const currentCard = autoFlipIndex;
        if (newSet.has(currentCard)) {
          newSet.delete(currentCard);
        } else {
          newSet.add(currentCard);
        }
        return newSet;
      });
    }, 3000 / animationSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, animationSpeed, autoFlipIndex, cards.length]);

  const handleCardClick = (cardId: number) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  const flipAllCards = () => {
    if (flippedCards.size === cards.length) {
      setFlippedCards(new Set());
    } else {
      setFlippedCards(new Set(cards.map(card => card.id)));
    }
  };

  const resetCards = () => {
    setFlippedCards(new Set());
  };

  return (
    <div className={`flip-card-3d season-${season}`}>
      {/* 控制按钮 */}
      <div className="card-controls">
        <Space>
          <Button 
            type="primary" 
            icon={<RotateLeftOutlined />}
            onClick={flipAllCards}
          >
            {flippedCards.size === cards.length ? '全部翻回' : '全部翻转'}
          </Button>
          <Button 
            icon={<ReloadOutlined />}
            onClick={resetCards}
          >
            重置
          </Button>
        </Space>
      </div>

      {/* 3D卡片网格 */}
      <div className="cards-container">
        <Row gutter={[24, 24]} justify="center">
          {cards.map((card) => (
            <Col xs={24} sm={12} md={8} key={card.id}>
              <div 
                className={`card-wrapper ${flippedCards.has(card.id) ? 'flipped' : ''}`}
                onClick={() => handleCardClick(card.id)}
                style={{
                  animationDelay: `${card.id * 0.2}s`,
                  animationDuration: `${2 / animationSpeed}s`
                }}
              >
                <div className="card-inner">
                  {/* 卡片正面 */}
                  <div 
                    className="card-front"
                    style={{ 
                      background: `linear-gradient(135deg, ${card.front.color} 0%, ${card.front.color}aa 100%)`,
                      borderColor: card.front.color
                    }}
                  >
                    <div className="card-content">
                      <div className="card-icon">
                        <span style={{ fontSize: '48px' }}>{card.front.icon}</span>
                      </div>
                      <Title level={3} style={{ color: 'white', margin: '16px 0 8px 0' }}>
                        {card.front.title}
                      </Title>
                      <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '16px' }}>
                        {card.front.content}
                      </Text>
                    </div>
                  </div>

                  {/* 卡片背面 */}
                  <div 
                    className="card-back"
                    style={{ 
                      background: `linear-gradient(135deg, ${card.back.color} 0%, ${card.back.color}aa 100%)`,
                      borderColor: card.back.color
                    }}
                  >
                    <div className="card-content">
                      <Title level={4} style={{ color: 'white', margin: '0 0 12px 0' }}>
                        {card.back.title}
                      </Title>
                      <Text style={{ color: 'rgba(255, 255, 255, 0.9)', display: 'block', marginBottom: '16px' }}>
                        {card.back.content}
                      </Text>
                      <div className="details-list">
                        {card.back.details.map((detail, index) => (
                          <div key={index} className="detail-item">
                            <span className="detail-dot">•</span>
                            <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{detail}</Text>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* 提示信息 */}
      <div className="flip-hint">
        <Text type="secondary">
          💡 点击卡片进行翻转，体验3D效果。卡片内容会根据当前季节主题变化。
        </Text>
      </div>
    </div>
  );
};

export default FlipCard3D;
