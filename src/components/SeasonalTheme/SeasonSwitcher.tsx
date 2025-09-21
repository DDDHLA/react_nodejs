import React, { useState } from 'react';
import { Button, Dropdown, Space, Typography, Card, Row, Col, Tooltip } from 'antd';
import { BgColorsOutlined, CheckOutlined } from '@ant-design/icons';
import { useSeasonalTheme, seasonalThemes, SeasonType } from './index';
import './SeasonSwitcher.less';

const { Text } = Typography;

const SeasonSwitcher: React.FC = () => {
  const { currentSeason, setSeason, themeConfig } = useSeasonalTheme();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleSeasonChange = (season: SeasonType) => {
    setSeason(season);
    setDropdownVisible(false);
  };

  const seasonOptions = (
    <Card className="season-selector-card" bodyStyle={{ padding: '16px' }}>
      <div className="season-selector-title">
        <Space>
          <BgColorsOutlined />
          <Text strong>选择季节主题</Text>
        </Space>
      </div>
      
      <Row gutter={[8, 8]} className="season-options">
        {Object.entries(seasonalThemes).map(([key, theme]) => {
          const seasonKey = key as SeasonType;
          const isActive = currentSeason === seasonKey;
          
          return (
            <Col span={12} key={seasonKey}>
              <div
                className={`season-option ${isActive ? 'active' : ''}`}
                onClick={() => handleSeasonChange(seasonKey)}
                style={{
                  background: theme.colors.background,
                  borderColor: theme.colors.primary
                }}
              >
                <div className="season-preview">
                  <div 
                    className="season-color-bar"
                    style={{ background: theme.colors.primary }}
                  />
                  <div className="season-info">
                    <Space>
                      <span className="season-icon">{theme.icon}</span>
                      <Text strong style={{ color: theme.colors.textPrimary }}>
                        {theme.name}
                      </Text>
                    </Space>
                    {isActive && (
                      <CheckOutlined 
                        style={{ 
                          color: theme.colors.primary,
                          fontSize: '14px'
                        }} 
                      />
                    )}
                  </div>
                </div>
                
                {/* 季节装饰效果预览 */}
                <div className={`season-decoration season-${seasonKey}`}>
                  {seasonKey === 'winter' && (
                    <>
                      <span className="decoration-item snow-1">❄️</span>
                      <span className="decoration-item snow-2">❄️</span>
                    </>
                  )}
                  {seasonKey === 'autumn' && (
                    <>
                      <span className="decoration-item leaf-1">🍂</span>
                      <span className="decoration-item leaf-2">🍁</span>
                    </>
                  )}
                  {seasonKey === 'spring' && (
                    <>
                      <span className="decoration-item petal-1">🌸</span>
                      <span className="decoration-item petal-2">🌺</span>
                    </>
                  )}
                  {seasonKey === 'summer' && (
                    <>
                      <span className="decoration-item sun-1">☀️</span>
                      <span className="decoration-item sun-2">🌞</span>
                    </>
                  )}
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
      
      <div className="season-tip">
        <Text type="secondary" style={{ fontSize: '12px' }}>
          💡 主题会自动保存，刷新页面后仍然生效
        </Text>
      </div>
    </Card>
  );

  return (
    <Dropdown
      overlay={seasonOptions}
      trigger={['click']}
      placement="bottomRight"
      open={dropdownVisible}
      onOpenChange={setDropdownVisible}
      overlayClassName="season-switcher-dropdown"
    >
      <Tooltip title={`当前主题：${themeConfig.name}`} placement="bottom">
        <Button 
          type="text" 
          className="season-switcher-btn"
          style={{ 
            color: themeConfig.colors.primary,
            borderColor: themeConfig.colors.primary 
          }}
        >
          <Space>
            <span className="current-season-icon">{themeConfig.icon}</span>
            <BgColorsOutlined />
          </Space>
        </Button>
      </Tooltip>
    </Dropdown>
  );
};

export default SeasonSwitcher;
