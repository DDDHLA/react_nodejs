import React, { useState } from 'react';
import { Card } from 'antd';
import './index.less';

const Animation = () => {
  const [animatingText, setAnimatingText] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [targetTexts, setTargetTexts] = useState([]);

  // 示例文本数据
  const sourceTexts = [
    '这是一个短句子',
    '这是一个比较长的句子，用来测试省略号的功能',
    '点击我移动到右侧',
    '这是一个非常非常非常长的句子，用来测试当文本过长时是否会自动显示省略号的功能用来测试当文本过长时是否会自动显示省略号的功能用来测试当文本过长时是否会自动显示省略号的功能',
    '简单文本',
    '中等长度的文本内容示例'
  ];

  const handleTextClick = (text) => {
    if (isAnimating) return; // 防止动画进行中时重复点击
    
    setAnimatingText(text);
    setIsAnimating(true);
    
    // 动画完成后将文本添加到目标区域
    setTimeout(() => {
      setTargetTexts(prev => [...prev, text]);
      setAnimatingText('');
      setIsAnimating(false);
    }, 1000); // 动画持续时间1秒
  };

  const clearTargetTexts = () => {
    setTargetTexts([]);
  };

  return (
    <div className="animation-container">
      <h1 className="page-title">动画演示页面</h1>
      
      {/* 布局1 - 顶部区域 */}
      <div className="layout-1">
        <Card title="布局区域 1" className="layout-card">
          <p>这是顶部的布局区域，用于展示页面标题和说明</p>
          <p>点击下方布局2中的文字，观察动画效果</p>
        </Card>
      </div>

      {/* 布局2 - 左侧源区域 */}
      <div className="layout-2">
        <Card title="布局区域 2 - 点击文字" className="layout-card">
          <div className="text-list">
            {sourceTexts.map((text, index) => (
              <div
                key={index}
                className={`text-item ${isAnimating ? 'disabled' : ''}`}
                onClick={() => handleTextClick(text)}
              >
                <span className="text-content">{text}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 布局3 - 右侧目标区域 */}
      <div className="layout-3">
        <Card 
          title="布局区域 3 - 目标区域" 
          className="layout-card"
          extra={
            <button 
              className="clear-btn" 
              onClick={clearTargetTexts}
              disabled={targetTexts.length === 0}
            >
              清空
            </button>
          }
        >
          <div className="target-area">
            {targetTexts.length === 0 ? (
              <p className="empty-hint">点击左侧文字，它们会移动到这里</p>
            ) : (
              targetTexts.map((text, index) => (
                <div key={index} className="target-text">
                  <span className="text-content">{text}</span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* 动画中的文字 */}
      {animatingText && (
        <div className="animating-text">
          {animatingText}
        </div>
      )}
    </div>
  );
};

export default Animation;
