import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, Button, Select, Progress, Statistic, Row, Col, Typography, Space, Tag, Modal, Table } from 'antd';
import { PlayCircleOutlined, PauseOutlined, ReloadOutlined, TrophyOutlined, HistoryOutlined } from '@ant-design/icons';
import './index.less';

const { Title, Text } = Typography;
const { Option } = Select;

// 测试文本数据
const testTexts = {
  english: {
    easy: [
      "The quick brown fox jumps over the lazy dog. This is a simple sentence for typing practice.",
      "Hello world! This is an easy typing test. You can do it with confidence and accuracy.",
      "Practice makes perfect. Keep typing and improve your speed every day with dedication."
    ],
    medium: [
      "Technology has revolutionized the way we communicate, work, and live our daily lives in modern society.",
      "The development of artificial intelligence and machine learning algorithms continues to transform various industries.",
      "Climate change represents one of the most significant challenges facing humanity in the twenty-first century."
    ],
    hard: [
      "Quantum mechanics, with its counterintuitive principles and mathematical complexities, fundamentally challenges our classical understanding of reality.",
      "The implementation of blockchain technology across decentralized networks requires sophisticated cryptographic protocols and consensus mechanisms.",
      "Neuroplasticity demonstrates the brain's remarkable ability to reorganize synaptic connections throughout an individual's lifetime."
    ]
  },
  chinese: {
    easy: [
      "今天天气很好，阳光明媚，适合出门散步。我们可以去公园里走走，呼吸新鲜空气。",
      "学习是一个持续的过程，需要我们保持耐心和恒心。每天进步一点点，就能取得很大的成就。",
      "友谊是人生中最珍贵的财富之一。真正的朋友会在你需要的时候给予支持和帮助。"
    ],
    medium: [
      "科技的发展改变了我们的生活方式，从智能手机到人工智能，每一项创新都在推动社会进步。",
      "中华文化源远流长，博大精深。从古代的诗词歌赋到现代的文学作品，都体现了深厚的文化底蕴。",
      "环境保护是全人类共同面临的挑战。我们需要采取积极行动，保护地球家园，为后代留下美好环境。"
    ],
    hard: [
      "量子力学作为现代物理学的重要分支，其波粒二象性和不确定性原理彻底颠覆了经典物理学的世界观。",
      "区块链技术通过去中心化的分布式账本系统，实现了数据的不可篡改性和透明性，为数字经济奠定了基础。",
      "神经可塑性研究表明，大脑具有重组神经连接的能力，这为治疗神经系统疾病提供了新的理论依据。"
    ]
  }
};

// 测试结果接口
interface TestResult {
  id: string;
  language: 'english' | 'chinese';
  difficulty: 'easy' | 'medium' | 'hard';
  wpm: number;
  accuracy: number;
  duration: number;
  date: string;
}

// 打字统计接口
interface TypingStats {
  wpm: number;
  accuracy: number;
  correctChars: number;
  totalChars: number;
  errors: number;
}

const TypingTest: React.FC = () => {
  // 基础状态
  const [language, setLanguage] = useState<'english' | 'chinese'>('english');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [currentText, setCurrentText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // 统计状态
  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    accuracy: 100,
    correctChars: 0,
    totalChars: 0,
    errors: 0
  });

  // 历史记录
  const [history, setHistory] = useState<TestResult[]>([]);

  // Refs
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 初始化文本
  const initializeText = useCallback(() => {
    const texts = testTexts[language][difficulty];
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    setCurrentText(randomText);
    setUserInput('');
    setTimeElapsed(0);
    setIsActive(false);
    setIsPaused(false);
    setShowResults(false);
    setStats({
      wpm: 0,
      accuracy: 100,
      correctChars: 0,
      totalChars: 0,
      errors: 0
    });
  }, [language, difficulty]);

  // 计算统计数据
  const calculateStats = useCallback((input: string, text: string, elapsed: number) => {
    const totalChars = input.length;
    let correctChars = 0;
    let errors = 0;

    for (let i = 0; i < totalChars; i++) {
      if (i < text.length && input[i] === text[i]) {
        correctChars++;
      } else {
        errors++;
      }
    }

    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
    const minutes = elapsed / 60;
    const wpm = minutes > 0 ? Math.round((correctChars / 5) / minutes) : 0; // 标准WPM计算

    return {
      wpm,
      accuracy,
      correctChars,
      totalChars,
      errors
    };
  }, []);

  // 开始测试
  const startTest = () => {
    setIsActive(true);
    setIsPaused(false);
    inputRef.current?.focus();
    
    intervalRef.current = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
  };

  // 暂停测试
  const pauseTest = () => {
    setIsPaused(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // 继续测试
  const resumeTest = () => {
    setIsPaused(false);
    intervalRef.current = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
  };

  // 重置测试
  const resetTest = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    initializeText();
  };

  // 完成测试
  const finishTest = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsActive(false);
    setShowResults(true);

    // 保存结果到历史记录
    const result: TestResult = {
      id: Date.now().toString(),
      language,
      difficulty,
      wpm: stats.wpm,
      accuracy: stats.accuracy,
      duration: timeElapsed,
      date: new Date().toLocaleString('zh-CN')
    };

    const newHistory = [result, ...history].slice(0, 10); // 保留最近10条记录
    setHistory(newHistory);
    localStorage.setItem('typingTestHistory', JSON.stringify(newHistory));
  }, [language, difficulty, stats, timeElapsed, history]);

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setUserInput(value);

    // 如果还没开始，自动开始测试
    if (!isActive && !isPaused && value.length > 0) {
      startTest();
    }

    // 计算实时统计
    const newStats = calculateStats(value, currentText, timeElapsed);
    setStats(newStats);

    // 检查是否完成
    if (value.length >= currentText.length) {
      finishTest();
    }
  };

  // 渲染文本（带高亮）
  const renderText = () => {
    return currentText.split('').map((char, index) => {
      let className = 'char';
      
      if (index < userInput.length) {
        className += userInput[index] === char ? ' correct' : ' incorrect';
      } else if (index === userInput.length) {
        className += ' current';
      }

      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  // 历史记录表格列
  const historyColumns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 150,
    },
    {
      title: '语言',
      dataIndex: 'language',
      key: 'language',
      width: 80,
      render: (lang: string) => (
        <Tag color={lang === 'english' ? 'blue' : 'green'}>
          {lang === 'english' ? '英文' : '中文'}
        </Tag>
      ),
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: 80,
      render: (diff: string) => {
        const colors = { easy: 'green', medium: 'orange', hard: 'red' };
        const labels = { easy: '简单', medium: '中等', hard: '困难' };
        return <Tag color={colors[diff as keyof typeof colors]}>{labels[diff as keyof typeof labels]}</Tag>;
      },
    },
    {
      title: 'WPM',
      dataIndex: 'wpm',
      key: 'wpm',
      width: 80,
      sorter: (a: TestResult, b: TestResult) => a.wpm - b.wpm,
    },
    {
      title: '准确率',
      dataIndex: 'accuracy',
      key: 'accuracy',
      width: 100,
      render: (accuracy: number) => `${accuracy}%`,
      sorter: (a: TestResult, b: TestResult) => a.accuracy - b.accuracy,
    },
    {
      title: '用时',
      dataIndex: 'duration',
      key: 'duration',
      width: 80,
      render: (duration: number) => `${duration}s`,
    },
  ];

  // 初始化
  useEffect(() => {
    initializeText();
    
    // 加载历史记录
    const savedHistory = localStorage.getItem('typingTestHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [initializeText]);

  // 语言或难度改变时重新初始化
  useEffect(() => {
    initializeText();
  }, [language, difficulty, initializeText]);

  return (
    <div className="typing-test">
      <Card>
        <div className="typing-test-header">
          <Title level={2}>⌨️ 打字速度测试</Title>
          
          <Space size="large">
            <div>
              <Text strong>语言模式：</Text>
              <Select
                value={language}
                onChange={setLanguage}
                style={{ width: 120, marginLeft: 8 }}
                disabled={isActive && !isPaused}
              >
                <Option value="english">🇺🇸 英文</Option>
                <Option value="chinese">🇨🇳 中文</Option>
              </Select>
            </div>
            
            <div>
              <Text strong>难度等级：</Text>
              <Select
                value={difficulty}
                onChange={setDifficulty}
                style={{ width: 120, marginLeft: 8 }}
                disabled={isActive && !isPaused}
              >
                <Option value="easy">🟢 简单</Option>
                <Option value="medium">🟡 中等</Option>
                <Option value="hard">🔴 困难</Option>
              </Select>
            </div>
          </Space>
        </div>

        {/* 统计面板 */}
        <Row gutter={16} className="stats-panel">
          <Col span={6}>
            <Statistic
              title="WPM (每分钟字数)"
              value={stats.wpm}
              suffix="字/分"
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="准确率"
              value={stats.accuracy}
              suffix="%"
              valueStyle={{ color: stats.accuracy >= 95 ? '#52c41a' : stats.accuracy >= 85 ? '#faad14' : '#f5222d' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="用时"
              value={timeElapsed}
              suffix="秒"
              valueStyle={{ color: '#722ed1' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="错误数"
              value={stats.errors}
              valueStyle={{ color: '#f5222d' }}
            />
          </Col>
        </Row>

        {/* 进度条 */}
        <div className="progress-section">
          <Progress
            percent={Math.round((userInput.length / currentText.length) * 100)}
            status={stats.accuracy >= 95 ? 'success' : stats.accuracy >= 85 ? 'normal' : 'exception'}
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
          />
        </div>

        {/* 测试文本显示区域 */}
        <Card className="text-display" bodyStyle={{ padding: '24px' }}>
          <div className="test-text">
            {renderText()}
          </div>
        </Card>

        {/* 输入区域 */}
        <div className="input-section">
          <textarea
            ref={inputRef}
            value={userInput}
            onChange={handleInputChange}
            placeholder={isActive ? "开始输入上面的文本..." : "点击开始按钮开始测试"}
            disabled={!isActive && !isPaused}
            className="typing-input"
            rows={4}
          />
        </div>

        {/* 控制按钮 */}
        <div className="control-buttons">
          <Space size="middle">
            {!isActive && !isPaused && (
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                onClick={startTest}
                size="large"
              >
                开始测试
              </Button>
            )}
            
            {isActive && !isPaused && (
              <Button
                icon={<PauseOutlined />}
                onClick={pauseTest}
                size="large"
              >
                暂停
              </Button>
            )}
            
            {isPaused && (
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                onClick={resumeTest}
                size="large"
              >
                继续
              </Button>
            )}
            
            <Button
              icon={<ReloadOutlined />}
              onClick={resetTest}
              size="large"
            >
              重新开始
            </Button>
            
            <Button
              icon={<HistoryOutlined />}
              onClick={() => setShowHistory(true)}
              size="large"
            >
              历史记录
            </Button>
          </Space>
        </div>
      </Card>

      {/* 结果弹窗 */}
      <Modal
        title={<><TrophyOutlined style={{ color: '#faad14' }} /> 测试完成！</>}
        open={showResults}
        onCancel={() => setShowResults(false)}
        footer={[
          <Button key="again" type="primary" onClick={() => { setShowResults(false); resetTest(); }}>
            再次测试
          </Button>,
          <Button key="close" onClick={() => setShowResults(false)}>
            关闭
          </Button>
        ]}
      >
        <div className="result-content">
          <Row gutter={16}>
            <Col span={12}>
              <Statistic
                title="最终速度"
                value={stats.wpm}
                suffix="WPM"
                valueStyle={{ color: '#1890ff', fontSize: '24px' }}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="准确率"
                value={stats.accuracy}
                suffix="%"
                valueStyle={{ 
                  color: stats.accuracy >= 95 ? '#52c41a' : stats.accuracy >= 85 ? '#faad14' : '#f5222d',
                  fontSize: '24px'
                }}
              />
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={12}>
              <Statistic
                title="总用时"
                value={timeElapsed}
                suffix="秒"
                valueStyle={{ fontSize: '18px' }}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="错误数"
                value={stats.errors}
                valueStyle={{ fontSize: '18px' }}
              />
            </Col>
          </Row>
          
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <Text type="secondary">
              {stats.accuracy >= 95 ? '🎉 优秀！准确率很高！' : 
               stats.accuracy >= 85 ? '👍 不错！继续加油！' : 
               '💪 多练习可以提高准确率！'}
            </Text>
          </div>
        </div>
      </Modal>

      {/* 历史记录弹窗 */}
      <Modal
        title="📊 历史记录"
        open={showHistory}
        onCancel={() => setShowHistory(false)}
        footer={null}
        width={800}
      >
        <Table
          columns={historyColumns}
          dataSource={history}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          size="small"
        />
      </Modal>
    </div>
  );
};

export default TypingTest;
