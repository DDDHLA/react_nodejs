import { useState, useCallback } from 'react';
import { 
  Card, 
  Tag, 
  Avatar, 
  Typography, 
  Space, 
  Button, 
  message, 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Row, 
  Col 
} from 'antd';
import { 
  PlusOutlined, 
  UserOutlined, 
  ClockCircleOutlined,
  FlagOutlined,
  ReloadOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';
import './KanbanBoard.less';

const { Text } = Typography;

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  dueDate: string;
}

interface Column {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
}

const KanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>([
    {
      id: 'todo',
      title: '待办',
      color: '#1890ff',
      tasks: [
        {
          id: 'task-1',
          title: '设计用户界面',
          description: '完成登录页面的UI设计',
          assignee: '张三',
          priority: 'high',
          tags: ['UI', '设计'],
          dueDate: '2024-01-15'
        },
        {
          id: 'task-2',
          title: '数据库设计',
          description: '设计用户管理相关的数据表',
          assignee: '李四',
          priority: 'medium',
          tags: ['后端', '数据库'],
          dueDate: '2024-01-18'
        }
      ]
    },
    {
      id: 'inprogress',
      title: '进行中',
      color: '#faad14',
      tasks: [
        {
          id: 'task-3',
          title: '实现用户认证',
          description: '开发JWT认证功能',
          assignee: '王五',
          priority: 'high',
          tags: ['后端', '安全'],
          dueDate: '2024-01-20'
        }
      ]
    },
    {
      id: 'review',
      title: '待审核',
      color: '#722ed1',
      tasks: [
        {
          id: 'task-4',
          title: '代码审查',
          description: '审查登录模块的代码',
          assignee: '赵六',
          priority: 'medium',
          tags: ['审查', '质量'],
          dueDate: '2024-01-16'
        }
      ]
    },
    {
      id: 'done',
      title: '已完成',
      color: '#52c41a',
      tasks: [
        {
          id: 'task-5',
          title: '项目初始化',
          description: '搭建项目基础架构',
          assignee: '钱七',
          priority: 'low',
          tags: ['架构', '初始化'],
          dueDate: '2024-01-10'
        }
      ]
    }
  ]);

  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [draggedFromColumn, setDraggedFromColumn] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState(false);
  const [addTaskForm] = Form.useForm();

  // 预定义的标签选项
  const tagOptions = [
    '前端', '后端', 'UI', '设计', '测试', '运维', '产品', 
    '架构', '数据库', '安全', '性能', '文档', '审查', '质量'
  ];

  // 预定义的负责人选项
  const assigneeOptions = [
    '张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十'
  ];

  // 获取优先级配置
  const getPriorityConfig = (priority: string) => {
    const configs = {
      low: { color: 'default', text: '低' },
      medium: { color: 'orange', text: '中' },
      high: { color: 'red', text: '高' }
    };
    return configs[priority as keyof typeof configs] || configs.low;
  };

  // 开始拖拽任务
  const handleTaskDragStart = useCallback((e: React.DragEvent, task: Task, columnId: string) => {
    setDraggedTask(task);
    setDraggedFromColumn(columnId);
    e.dataTransfer.effectAllowed = 'move';
    
    // 立即强制原始元素保持无变换状态
    const target = e.target as HTMLElement;
    const taskElement = target.closest('.task-card') as HTMLElement;
    if (taskElement) {
      taskElement.style.cssText += `
        transform: none !important;
        rotate: none !important;
        scale: none !important;
        translate: none !important;
        animation: none !important;
      `;
      
      // 创建无变换的自定义拖拽图像
      const dragImage = taskElement.cloneNode(true) as HTMLElement;
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
      e.dataTransfer.setDragImage(dragImage, taskElement.offsetWidth / 2, taskElement.offsetHeight / 2);
      
      // 清理克隆的元素
      setTimeout(() => {
        if (document.body.contains(dragImage)) {
          document.body.removeChild(dragImage);
        }
      }, 0);
    }
  }, []);

  // 拖拽结束
  const handleTaskDragEnd = useCallback((e: React.DragEvent) => {
    // 强制重置拖拽元素的所有样式
    const target = e.target as HTMLElement;
    const taskElement = target.closest('.task-card') as HTMLElement;
    if (taskElement) {
      // 移除拖拽类名
      taskElement.classList.remove('dragging');
      // 强制重置所有可能的变换样式
      taskElement.style.cssText += `
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
      void taskElement.offsetHeight;
      
      // 清除内联样式，让CSS接管
      setTimeout(() => {
        taskElement.style.transform = '';
        taskElement.style.opacity = '';
        taskElement.style.zIndex = '';
        taskElement.style.animation = '';
        taskElement.style.rotate = '';
        taskElement.style.scale = '';
        taskElement.style.translate = '';
      }, 100);
    }
    
    setDraggedTask(null);
    setDraggedFromColumn(null);
    setDragOverColumn(null);
  }, []);

  // 列拖拽经过
  const handleColumnDragOver = useCallback((e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(columnId);
  }, []);

  // 列拖拽离开
  const handleColumnDragLeave = useCallback(() => {
    setDragOverColumn(null);
  }, []);

  // 在列中放置任务
  const handleColumnDrop = useCallback((e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    
    if (!draggedTask || !draggedFromColumn || draggedFromColumn === targetColumnId) {
      return;
    }

    setColumns(prevColumns => {
      const newColumns = prevColumns.map(column => {
        if (column.id === draggedFromColumn) {
          // 从源列中移除任务
          return {
            ...column,
            tasks: column.tasks.filter(task => task.id !== draggedTask.id)
          };
        } else if (column.id === targetColumnId) {
          // 添加到目标列
          return {
            ...column,
            tasks: [...column.tasks, draggedTask]
          };
        }
        return column;
      });
      return newColumns;
    });

    const targetColumn = columns.find(col => col.id === targetColumnId);
    message.success(`任务"${draggedTask.title}"已移动到"${targetColumn?.title}"`);
    
    setDragOverColumn(null);
  }, [draggedTask, draggedFromColumn, columns]);

  // 生成新的任务ID
  const generateTaskId = () => {
    const allTasks = columns.flatMap(col => col.tasks);
    const maxId = allTasks.reduce((max, task) => {
      const taskNum = parseInt(task.id.replace('task-', ''));
      return taskNum > max ? taskNum : max;
    }, 0);
    return `task-${maxId + 1}`;
  };

  // 显示添加任务弹窗
  const showAddTaskModal = () => {
    setIsAddTaskModalVisible(true);
    // 重置表单
    addTaskForm.resetFields();
    // 设置默认值
    addTaskForm.setFieldsValue({
      columnId: 'todo',
      priority: 'medium',
      dueDate: dayjs().add(7, 'day')
    });
  };

  // 隐藏添加任务弹窗
  const hideAddTaskModal = () => {
    setIsAddTaskModalVisible(false);
    addTaskForm.resetFields();
  };

  // 提交添加任务表单
  const handleAddTask = async () => {
    try {
      const values = await addTaskForm.validateFields();
      
      const newTask: Task = {
        id: generateTaskId(),
        title: values.title,
        description: values.description || '',
        assignee: values.assignee,
        priority: values.priority,
        tags: values.tags || [],
        dueDate: values.dueDate.format('YYYY-MM-DD')
      };

      // 添加任务到指定列
      setColumns(prevColumns => 
        prevColumns.map(column => 
          column.id === values.columnId
            ? { ...column, tasks: [...column.tasks, newTask] }
            : column
        )
      );

      const targetColumn = columns.find(col => col.id === values.columnId);
      message.success(`任务"${newTask.title}"已添加到"${targetColumn?.title}"`);
      hideAddTaskModal();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 重置看板
  const resetBoard = () => {
    const initialColumns: Column[] = [
      {
        id: 'todo',
        title: '待办',
        color: '#1890ff',
        tasks: [
          {
            id: 'task-1',
            title: '设计用户界面',
            description: '完成登录页面的UI设计',
            assignee: '张三',
            priority: 'high',
            tags: ['UI', '设计'],
            dueDate: '2024-01-15'
          },
          {
            id: 'task-2',
            title: '数据库设计',
            description: '设计用户管理相关的数据表',
            assignee: '李四',
            priority: 'medium',
            tags: ['后端', '数据库'],
            dueDate: '2024-01-18'
          }
        ]
      },
      {
        id: 'inprogress',
        title: '进行中',
        color: '#faad14',
        tasks: [
          {
            id: 'task-3',
            title: '实现用户认证',
            description: '开发JWT认证功能',
            assignee: '王五',
            priority: 'high',
            tags: ['后端', '安全'],
            dueDate: '2024-01-20'
          }
        ]
      },
      {
        id: 'review',
        title: '待审核',
        color: '#722ed1',
        tasks: [
          {
            id: 'task-4',
            title: '代码审查',
            description: '审查登录模块的代码',
            assignee: '赵六',
            priority: 'medium',
            tags: ['审查', '质量'],
            dueDate: '2024-01-16'
          }
        ]
      },
      {
        id: 'done',
        title: '已完成',
        color: '#52c41a',
        tasks: [
          {
            id: 'task-5',
            title: '项目初始化',
            description: '搭建项目基础架构',
            assignee: '钱七',
            priority: 'low',
            tags: ['架构', '初始化'],
            dueDate: '2024-01-10'
          }
        ]
      }
    ];
    setColumns(initialColumns);
    message.info('看板已重置');
  };

  return (
    <div className="kanban-board">
      {/* 操作按钮 */}
      <div className="board-actions">
        <Space>
          <Button icon={<ReloadOutlined />} onClick={resetBoard}>
            重置看板
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={showAddTaskModal}>
            添加任务
          </Button>
        </Space>
      </div>

      {/* 拖拽提示 */}
      <Card size="small" className="drag-hint">
        <Text type="secondary">
          💡 拖拽提示：点击任务卡片并拖拽到不同的列中来改变任务状态
        </Text>
      </Card>

      {/* 看板列 */}
      <div className="kanban-columns">
        {columns.map(column => (
          <div
            key={column.id}
            className={`kanban-column ${dragOverColumn === column.id ? 'drag-over' : ''}`}
            onDragOver={(e) => handleColumnDragOver(e, column.id)}
            onDragLeave={handleColumnDragLeave}
            onDrop={(e) => handleColumnDrop(e, column.id)}
          >
            {/* 列标题 */}
            <div className="column-header" style={{ borderTopColor: column.color }}>
              <Space>
                <div 
                  className="column-indicator" 
                  style={{ backgroundColor: column.color }}
                />
                <Text strong>{column.title}</Text>
                <Tag color={column.color}>{column.tasks.length}</Tag>
              </Space>
            </div>

            {/* 任务列表 */}
            <div className="column-content">
              {column.tasks.map(task => {
                const priorityConfig = getPriorityConfig(task.priority);
                const isDragging = draggedTask?.id === task.id;
                
                return (
                  <Card
                    key={task.id}
                    className={`task-card ${isDragging ? 'dragging' : ''}`}
                    size="small"
                    draggable
                    onDragStart={(e) => handleTaskDragStart(e, task, column.id)}
                    onDragEnd={handleTaskDragEnd}
                  >
                    {/* 任务标题 */}
                    <div className="task-header">
                      <Text strong className="task-title">
                        {task.title}
                      </Text>
                      <Tag 
                        color={priorityConfig.color} 
                        icon={<FlagOutlined />}
                      >
                        {priorityConfig.text}
                      </Tag>
                    </div>

                    {/* 任务描述 */}
                    <Text type="secondary" className="task-description">
                      {task.description}
                    </Text>

                    {/* 任务标签 */}
                    <div className="task-tags">
                      {task.tags.map(tag => (
                        <Tag key={tag}>
                          {tag}
                        </Tag>
                      ))}
                    </div>

                    {/* 任务底部信息 */}
                    <div className="task-footer">
                      <Space size="small">
                        <Avatar size="small" icon={<UserOutlined />} />
                        <Text className="assignee-name">{task.assignee}</Text>
                      </Space>
                      
                      <Space size="small" className="task-meta">
                        <ClockCircleOutlined style={{ color: '#999' }} />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {task.dueDate}
                        </Text>
                      </Space>
                    </div>
                  </Card>
                );
              })}

              {/* 空状态 */}
              {column.tasks.length === 0 && (
                <div className="empty-column">
                  <Text type="secondary">暂无任务</Text>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 添加任务弹窗 */}
      <Modal
        title="添加新任务"
        open={isAddTaskModalVisible}
        onOk={handleAddTask}
        onCancel={hideAddTaskModal}
        width={600}
        okText="添加任务"
        cancelText="取消"
      >
        <Form
          form={addTaskForm}
          layout="vertical"
          initialValues={{
            columnId: 'todo',
            priority: 'medium',
            dueDate: dayjs().add(7, 'day')
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="任务标题"
                name="title"
                rules={[
                  { required: true, message: '请输入任务标题' },
                  { max: 50, message: '标题不能超过50个字符' }
                ]}
              >
                <Input placeholder="请输入任务标题" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="所属列"
                name="columnId"
                rules={[{ required: true, message: '请选择任务所属列' }]}
              >
                <Select placeholder="请选择任务所属列">
                  {columns.map(column => (
                    <Select.Option key={column.id} value={column.id}>
                      {column.title}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="任务描述"
            name="description"
          >
            <Input.TextArea 
              rows={3} 
              placeholder="请输入任务描述（可选）"
              maxLength={200}
              showCount
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="负责人"
                name="assignee"
                rules={[{ required: true, message: '请选择负责人' }]}
              >
                <Select placeholder="请选择负责人">
                  {assigneeOptions.map(assignee => (
                    <Select.Option key={assignee} value={assignee}>
                      {assignee}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="优先级"
                name="priority"
                rules={[{ required: true, message: '请选择优先级' }]}
              >
                <Select placeholder="请选择优先级">
                  <Select.Option value="low">
                    <Tag color="default">低优先级</Tag>
                  </Select.Option>
                  <Select.Option value="medium">
                    <Tag color="orange">中优先级</Tag>
                  </Select.Option>
                  <Select.Option value="high">
                    <Tag color="red">高优先级</Tag>
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="截止日期"
                name="dueDate"
                rules={[{ required: true, message: '请选择截止日期' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }}
                  placeholder="选择截止日期"
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="任务标签"
            name="tags"
          >
            <Select
              mode="multiple"
              placeholder="请选择任务标签（可选）"
              maxTagCount={3}
              maxTagTextLength={10}
            >
              {tagOptions.map(tag => (
                <Select.Option key={tag} value={tag}>
                  {tag}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default KanbanBoard;
