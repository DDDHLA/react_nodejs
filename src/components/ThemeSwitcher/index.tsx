import { useState } from 'react';
import {
  Button,
  Drawer,
  Space,
  Switch,
  Slider,
  ColorPicker,
  Divider,
  Typography,
  Row,
  Col,
  Card,
  Tooltip,
} from 'antd';
import {
  BgColorsOutlined,
  SunOutlined,
  MoonOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useThemeStore } from '@/store/themeStore';
import { ThemeMode, PRESET_COLORS } from '@/config/theme';
import './index.less';

const { Title, Text } = Typography;

const ThemeSwitcher: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  
  const {
    themeConfig,
    setThemeMode,
    setPrimaryColor,
    setBorderRadius,
    setCompactSize,
    resetTheme,
  } = useThemeStore();

  // 快速切换深色/浅色模式
  const toggleDarkMode = () => {
    const newMode = themeConfig.mode === ThemeMode.DARK ? ThemeMode.LIGHT : ThemeMode.DARK;
    setThemeMode(newMode);
  };

  // 选择预设颜色
  const handlePresetColorClick = (color: string) => {
    setPrimaryColor(color);
  };

  return (
    <>
      {/* 主题切换按钮组 */}
      <Space>
        {/* 深色/浅色模式快速切换 */}
        <Tooltip title={themeConfig.mode === ThemeMode.DARK ? '切换到浅色模式' : '切换到深色模式'}>
          <Button
            type="text"
            icon={themeConfig.mode === ThemeMode.DARK ? <SunOutlined /> : <MoonOutlined />}
            onClick={toggleDarkMode}
            style={{ 
              color: themeConfig.mode === ThemeMode.DARK ? '#ffd700' : '#1890ff' 
            }}
          />
        </Tooltip>

        {/* 主题设置按钮 */}
        <Tooltip title="主题设置">
          <Button
            type="text"
            icon={<SettingOutlined />}
            onClick={() => setDrawerVisible(true)}
          />
        </Tooltip>
      </Space>

      {/* 主题设置抽屉 */}
      <Drawer
        title={
          <Space>
            <BgColorsOutlined />
            主题设置
          </Space>
        }
        placement="right"
        width={320}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        extra={
          <Button size="small" onClick={resetTheme}>
            重置
          </Button>
        }
      >
        <div className="theme-settings">
          {/* 主题模式选择 */}
          <div className="setting-section">
            <Title level={5}>主题模式</Title>
            <Row gutter={8}>
              <Col span={8}>
                <Card
                  size="small"
                  className={`theme-mode-card ${themeConfig.mode === ThemeMode.LIGHT ? 'active' : ''}`}
                  onClick={() => setThemeMode(ThemeMode.LIGHT)}
                  hoverable
                >
                  <div className="theme-preview light-preview">
                    <SunOutlined />
                  </div>
                  <Text>浅色</Text>
                </Card>
              </Col>
              <Col span={8}>
                <Card
                  size="small"
                  className={`theme-mode-card ${themeConfig.mode === ThemeMode.DARK ? 'active' : ''}`}
                  onClick={() => setThemeMode(ThemeMode.DARK)}
                  hoverable
                >
                  <div className="theme-preview dark-preview">
                    <MoonOutlined />
                  </div>
                  <Text>深色</Text>
                </Card>
              </Col>
              <Col span={8}>
                <Card
                  size="small"
                  className={`theme-mode-card ${themeConfig.mode === ThemeMode.CUSTOM ? 'active' : ''}`}
                  onClick={() => setThemeMode(ThemeMode.CUSTOM)}
                  hoverable
                >
                  <div className="theme-preview custom-preview">
                    <BgColorsOutlined />
                  </div>
                  <Text>自定义</Text>
                </Card>
              </Col>
            </Row>
          </div>

          <Divider />

          {/* 主色调选择 */}
          <div className="setting-section">
            <Title level={5}>主色调</Title>
            <Space direction="vertical" style={{ width: '100%' }}>
              {/* 预设颜色 */}
              <div>
                <Text type="secondary">预设颜色</Text>
                <div className="preset-colors">
                  {PRESET_COLORS.map((color) => (
                    <Tooltip key={color.value} title={color.name}>
                      <div
                        className={`color-item ${themeConfig.primaryColor === color.value ? 'active' : ''}`}
                        style={{ backgroundColor: color.value }}
                        onClick={() => handlePresetColorClick(color.value)}
                      />
                    </Tooltip>
                  ))}
                </div>
              </div>

              {/* 自定义颜色选择器 */}
              <div>
                <Text type="secondary">自定义颜色</Text>
                <div style={{ marginTop: 8 }}>
                  <ColorPicker
                    value={themeConfig.primaryColor}
                    onChange={(color) => setPrimaryColor(color.toHexString())}
                    showText
                    size="large"
                  />
                </div>
              </div>
            </Space>
          </div>

          <Divider />

          {/* 圆角设置 */}
          <div className="setting-section">
            <Title level={5}>圆角大小</Title>
            <Slider
              min={0}
              max={16}
              value={themeConfig.borderRadius}
              onChange={setBorderRadius}
              marks={{
                0: '直角',
                6: '默认',
                16: '圆润',
              }}
            />
          </div>

          <Divider />

          {/* 紧凑模式 */}
          <div className="setting-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Title level={5} style={{ margin: 0 }}>紧凑模式</Title>
                <Text type="secondary">减小组件间距</Text>
              </div>
              <Switch
                checked={themeConfig.compactSize}
                onChange={setCompactSize}
              />
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default ThemeSwitcher;
