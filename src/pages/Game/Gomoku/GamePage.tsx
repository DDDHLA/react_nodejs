import { Card, Row, Col, Typography, Space, Button } from 'antd';
import { PlayCircleOutlined, ReloadOutlined, PauseCircleOutlined, UndoOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import GomokuGame from './index';
import './GamePage.less';

const { Title, Text } = Typography;

const GomokuGamePage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="game-page">
      <div className="game-header">
        <Card className="header-card" bordered={false}>
          <Row align="middle" gutter={[24, 16]}>
            <Col flex="auto">
              <Space align="center" size="large">
                <PlayCircleOutlined className="game-icon" />
                <div>
                  <Title level={2} className="game-title">五子棋</Title>
                  <Text type="secondary" className="game-description">
                    挑战AI，体验经典五子棋对战
                  </Text>
                </div>
              </Space>
            </Col>
            <Col>
              <Space>
                <Button 
                  type="primary" 
                  icon={<ReloadOutlined />}
                  onClick={() => window.location.reload()}
                >
                  新游戏
                </Button>
                <Button 
                  onClick={() => navigate('/game/chinese-chess')}
                >
                  切换到中国象棋
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>
      </div>
      
      <div className="game-content">
        <GomokuGame />
      </div>
      
      <div className="game-footer">
        <Card className="footer-card" bordered={false}>
          <Row justify="space-between" align="middle">
            <Col>
              <Space size="large">
                <div className="game-stat">
                  <Text type="secondary">玩家</Text>
                  <Text strong>黑子</Text>
                </div>
                <div className="game-stat">
                  <Text type="secondary">AI</Text>
                  <Text strong>白子</Text>
                </div>
              </Space>
            </Col>
            <Col>
              <Space>
                <Button icon={<UndoOutlined />} disabled>悔棋</Button>
                <Button icon={<PauseCircleOutlined />}>暂停</Button>
              </Space>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default GomokuGamePage;
