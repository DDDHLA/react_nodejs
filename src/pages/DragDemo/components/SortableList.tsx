import { useState, useRef, useCallback } from 'react';
import { Card, Button, Space, Typography, Avatar, Tag, message } from 'antd';
import { 
  HolderOutlined, 
  UserOutlined, 
  ReloadOutlined,
  TrophyOutlined,
  StarOutlined 
} from '@ant-design/icons';
import './SortableList.less';

const { Text } = Typography;

interface ListItem {
  id: string;
  name: string;
  role: string;
  score: number;
  avatar?: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

const SortableList = () => {
  const [items, setItems] = useState<ListItem[]>([
    { id: '1', name: '张三', role: '前端工程师', score: 95, level: 'expert' },
    { id: '2', name: '李四', role: '后端工程师', score: 88, level: 'advanced' },
    { id: '3', name: '王五', role: 'UI设计师', score: 92, level: 'expert' },
    { id: '4', name: '赵六', role: '产品经理', score: 85, level: 'advanced' },
    { id: '5', name: '钱七', role: '测试工程师', score: 78, level: 'intermediate' },
    { id: '6', name: '孙八', role: 'DevOps工程师', score: 90, level: 'advanced' },
    { id: '7', name: '周九', role: '数据分析师', score: 82, level: 'intermediate' },
    { id: '8', name: '吴十', role: '移动端工程师', score: 87, level: 'advanced' },
  ]);

  const [draggedItem, setDraggedItem] = useState<ListItem | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const draggedIndexRef = useRef<number | null>(null);

  // 获取等级颜色和图标
  const getLevelConfig = (level: string) => {
    const configs = {
      beginner: { color: 'default', icon: null },
      intermediate: { color: 'blue', icon: <StarOutlined /> },
      advanced: { color: 'orange', icon: <TrophyOutlined /> },
      expert: { color: 'red', icon: <TrophyOutlined /> }
    };
    return configs[level as keyof typeof configs] || configs.beginner;
  };

  // 开始拖拽
  const handleDragStart = useCallback((e: React.DragEvent, item: ListItem, index: number) => {
    setDraggedItem(item);
    draggedIndexRef.current = index;
    
    // 设置拖拽效果
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', '');
    
    // 添加拖拽样式
    const target = e.target as HTMLElement;
    target.style.opacity = '0.5';
  }, []);

  // 拖拽结束
  const handleDragEnd = useCallback((e: React.DragEvent) => {
    const target = e.target as HTMLElement;
    target.style.opacity = '1';
    
    setDraggedItem(null);
    setDragOverIndex(null);
    draggedIndexRef.current = null;
  }, []);

  // 拖拽经过
  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedIndexRef.current !== null && draggedIndexRef.current !== index) {
      setDragOverIndex(index);
    }
  }, []);

  // 拖拽离开
  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null);
  }, []);

  // 放置
  const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    const dragIndex = draggedIndexRef.current;
    if (dragIndex === null || dragIndex === dropIndex) {
      return;
    }

    const newItems = [...items];
    const draggedItem = newItems[dragIndex];
    
    // 移除拖拽的项
    newItems.splice(dragIndex, 1);
    
    // 插入到新位置
    newItems.splice(dropIndex, 0, draggedItem);
    
    setItems(newItems);
    setDragOverIndex(null);
    
    message.success(`已将 ${draggedItem.name} 移动到第 ${dropIndex + 1} 位`);
  }, [items]);

  // 重置列表
  const resetList = () => {
    const originalItems = [
      { id: '1', name: '张三', role: '前端工程师', score: 95, level: 'expert' as const },
      { id: '2', name: '李四', role: '后端工程师', score: 88, level: 'advanced' as const },
      { id: '3', name: '王五', role: 'UI设计师', score: 92, level: 'expert' as const },
      { id: '4', name: '赵六', role: '产品经理', score: 85, level: 'advanced' as const },
      { id: '5', name: '钱七', role: '测试工程师', score: 78, level: 'intermediate' as const },
      { id: '6', name: '孙八', role: 'DevOps工程师', score: 90, level: 'advanced' as const },
      { id: '7', name: '周九', role: '数据分析师', score: 82, level: 'intermediate' as const },
      { id: '8', name: '吴十', role: '移动端工程师', score: 87, level: 'advanced' as const },
    ];
    setItems(originalItems);
    message.info('列表已重置');
  };

  // 按分数排序
  const sortByScore = () => {
    const sortedItems = [...items].sort((a, b) => b.score - a.score);
    setItems(sortedItems);
    message.success('已按分数降序排列');
  };

  return (
    <div className="sortable-list">
      {/* 操作按钮 */}
      <div className="list-actions">
        <Space>
          <Button onClick={sortByScore} type="primary">
            按分数排序
          </Button>
          <Button onClick={resetList} icon={<ReloadOutlined />}>
            重置列表
          </Button>
        </Space>
      </div>

      {/* 拖拽提示 */}
      <Card size="small" className="drag-hint">
        <Text type="secondary">
          💡 拖拽提示：点住左侧的拖拽图标，将项目拖拽到目标位置进行排序
        </Text>
      </Card>

      {/* 可排序列表 */}
      <div className="sortable-container">
        {items.map((item, index) => {
          const levelConfig = getLevelConfig(item.level);
          const isDraggedOver = dragOverIndex === index;
          const isDragging = draggedItem?.id === item.id;
          
          return (
            <div key={item.id} className="list-item-wrapper">
              {/* 拖拽插入指示器 */}
              {isDraggedOver && (
                <div className="drop-indicator">
                  <div className="drop-line" />
                  <Text className="drop-text">在此处放置</Text>
                </div>
              )}
              
              <Card
                className={`sortable-item ${isDragging ? 'dragging' : ''}`}
                size="small"
                draggable
                onDragStart={(e) => handleDragStart(e, item, index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
              >
                <div className="item-content">
                  {/* 拖拽手柄 */}
                  <div className="drag-handle">
                    <HolderOutlined />
                  </div>
                  
                  {/* 排名 */}
                  <div className="rank-number">
                    {index + 1}
                  </div>
                  
                  {/* 用户信息 */}
                  <div className="user-info">
                    <Avatar 
                      src={item.avatar} 
                      icon={<UserOutlined />} 
                      size="large"
                    />
                    <div className="user-details">
                      <div className="user-name">
                        <Text strong>{item.name}</Text>
                        {levelConfig.icon && (
                          <span className="level-icon" style={{ color: levelConfig.color === 'red' ? '#f5222d' : '#fa8c16' }}>
                            {levelConfig.icon}
                          </span>
                        )}
                      </div>
                      <Text type="secondary" className="user-role">
                        {item.role}
                      </Text>
                    </div>
                  </div>
                  
                  {/* 等级和分数 */}
                  <div className="item-stats">
                    <Tag color={levelConfig.color} className="level-tag">
                      {item.level.toUpperCase()}
                    </Tag>
                    <div className="score">
                      <Text strong style={{ fontSize: '18px', color: '#1890ff' }}>
                        {item.score}
                      </Text>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        分
                      </Text>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SortableList;
