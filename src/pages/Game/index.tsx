// 使用新的JSX转换，不需要导入React
import { Card, Row, Col, Typography, Space, Tabs } from 'antd';
import { PlayCircleOutlined, TrophyOutlined, ClockCircleOutlined, CrownOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import GomokuGame from './Gomoku/index';
import ChessGame from './Chess/index';
import './index.less';

const { Title, Paragraph } = Typography;

const GamePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const gameType = searchParams.get('type') || 'gomoku';
  
  const handleTabChange = (key: string) => {
    setSearchParams({ type: key });
  };

  const tabItems = [
    {
      key: 'gomoku',
      label: (
        <span>
          <PlayCircleOutlined />
          五子棋
        </span>
      ),
      children: <GomokuGame />
    },
    {
      key: 'chess',
      label: (
        <span>
          <CrownOutlined />
          中国象棋
        </span>
      ),
      children: <ChessGame />
    }
  ];

  return (
    <div className="game-page">
      <div className="game-header">
        <Card className="header-card">
          <Row align="middle" gutter={[24, 16]}>
            <Col flex="auto">
              <Space align="center" size="large">
                <PlayCircleOutlined className="game-icon" />
                <div>
                  <Title level={2} className="game-title">游戏中心</Title>
                  <Paragraph className="game-description">
                    挑战AI，体验经典棋类对战
                  </Paragraph>
                </div>
              </Space>
            </Col>
            <Col>
              <Space size="large">
                <div className="feature-item">
                  <TrophyOutlined className="feature-icon" />
                  <span>智能AI</span>
                </div>
                <div className="feature-item">
                  <ClockCircleOutlined className="feature-icon" />
                  <span>时间限制</span>
                </div>
                <div className="feature-item">
                  <CrownOutlined className="feature-icon" />
                  <span>多种游戏</span>
                </div>
              </Space>
            </Col>
          </Row>
        </Card>
      </div>
      
      <div className="game-content">
        <Tabs
          activeKey={gameType}
          onChange={handleTabChange}
          items={tabItems}
          size="large"
          className="game-tabs"
        />
      </div>
    </div>
  );
};

export default GamePage;
