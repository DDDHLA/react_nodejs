import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Input, Button, Avatar, Typography, Tooltip } from 'antd';
import { SendOutlined, SmileOutlined, PlusOutlined, ClearOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { 
  saveMessages,
  getMessages,
  clearMessages,
  generateAIReply,
  getAIReplyDelay,
  formatTime,
  shouldShowTimeDivider,
  formatTimeDivider,
  createMessage,
  getLastMessage,
  getLastMessageTime,
  formatContactTime,
  defaultContacts,
  type Message,
  type Contact 
} from '@/api/chat';
import './index.less';

const { TextArea } = Input;
const { Text } = Typography;

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  // 消息列表
  const [inputValue, setInputValue] = useState('');
  // 当前选中的联系人
  const [activeContact, setActiveContact] = useState<Contact>(defaultContacts[0]);
  // 是否正在输入
  const [isTyping, setIsTyping] = useState(false);
  // 联系人面板是否折叠
  const [isContactsCollapsed, setIsContactsCollapsed] = useState(false);
  // 折叠动画进行中
  const [isCollapsing, setIsCollapsing] = useState(false);
  // 联系人最后消息状态
  const [contactLastMessages, setContactLastMessages] = useState<Record<string, string>>({});
  // 联系人最后消息时间状态
  const [contactLastMessageTimes, setContactLastMessageTimes] = useState<Record<string, number | null>>({});
  // 联系人列表
  const contacts = defaultContacts;
  // 消息列表的ref
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // 输入框的ref
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // 滚动到底部
    scrollToBottom();
  }, [messages]);

  // 更新所有联系人的最后消息
  const updateContactLastMessages = useCallback(() => {
    const lastMessages: Record<string, string> = {};
    const lastMessageTimes: Record<string, number | null> = {};
    
    contacts.forEach(contact => {
      lastMessages[contact.id] = getLastMessage(contact.id);
      lastMessageTimes[contact.id] = getLastMessageTime(contact.id);
    });
    
    setContactLastMessages(lastMessages);
    setContactLastMessageTimes(lastMessageTimes);
  }, [contacts]);

  // 组件挂载时更新联系人最后消息
  useEffect(() => {
    updateContactLastMessages();
  }, [updateContactLastMessages]);

  // 加载历史消息 - 从chatData文件读取（会自动从localStorage同步）
  useEffect(() => {
    console.log(`🔄 切换到联系人: ${activeContact.name} (ID: ${activeContact.id})`);
    
    // 从chatData文件读取消息（getChatData会自动从localStorage同步最新数据）
    const savedMessages = getMessages(activeContact.id);
    
    if (savedMessages.length > 0) {
      console.log(`💬 从chatData加载消息: ${savedMessages.length} 条`);
      setMessages(savedMessages);
    } else {
      console.log(`🎆 初始化联系人 ${activeContact.name} 的默认消息`);
      
      // 初始化默认消息（仅在chatData中没有数据时）
      const now = Date.now();
      const initialMessages: Message[] = [];
      
      if (activeContact.id === '1') {
        // 为AI助手创建一些示例对话，展示时间分隔线功能
        initialMessages.push(
          // 10分钟前的消息
          {
            ...createMessage('你好！我是AI助手，很高兴为你服务！', 'bot'),
            timestamp: now - 10 * 60 * 1000
          },
          // 9分钟前的消息
          {
            ...createMessage('你好！', 'user'),
            timestamp: now - 9 * 60 * 1000
          },
          // 3分钟前的消息（会显示时间分隔线）
          {
            ...createMessage('有什么可以帮助你的吗？', 'bot'),
            timestamp: now - 3 * 60 * 1000
          }
        );
      } else {
        // 其他联系人只显示欢迎消息
        initialMessages.push(
          createMessage(activeContact.lastMessage, 'bot')
        );
      }
      
      // 设置消息并保存到localStorage（会自动同步到chatData）
      setMessages(initialMessages);
      saveMessages(activeContact.id, initialMessages);
      console.log(`💾 初始消息已保存并同步到chatData`);
    }
    
    // 切换联系人时更新最后消息
    updateContactLastMessages();
  }, [activeContact, updateContactLastMessages]);

  // 发送消息 - 保存到localStorage，自动同步到chatData，然后从chatData读取显示
  const sendMessage = () => {
    // 如果输入为空，不发送
    if (!inputValue.trim()) return;

    console.log(`📤 发送消息: ${inputValue}`);

    // 创建用户消息
    const userMessage = createMessage(inputValue, 'user');
    
    // 从chatData读取当前消息（会自动从localStorage同步）
    const currentMessages = getMessages(activeContact.id);
    const newMessages = [...currentMessages, userMessage];
    
    // 保存到localStorage（会自动触发同步到chatData）
    saveMessages(activeContact.id, newMessages);
    
    // 从chatData读取最新数据来更新页面
    const latestMessages = getMessages(activeContact.id);
    setMessages(latestMessages);
    
    // 清空输入框
    setInputValue('');

    // 更新联系人最后消息
    updateContactLastMessages();

    // 模拟AI回复
    if (activeContact.id === '1') {
      setIsTyping(true);
      const delay = getAIReplyDelay(inputValue.length);
      const userInput = inputValue; // 保存用户输入，因为 inputValue 已经被清空
      
      setTimeout(() => {
        const botReply = createMessage(
          generateAIReply(userInput),
          'bot'
        );
        
        // 从chatData读取当前消息
        const currentMessagesForBot = getMessages(activeContact.id);
        const updatedMessages = [...currentMessagesForBot, botReply];
        
        // 保存到localStorage（会自动触发同步到chatData）
        saveMessages(activeContact.id, updatedMessages);
        
        // 从chatData读取最新数据来更新页面
        const finalMessages = getMessages(activeContact.id);
        setMessages(finalMessages);
        
        setIsTyping(false);
        
        // 再次更新联系人最后消息
        updateContactLastMessages();
        
        console.log(`🤖 AI回复已添加，当前消息数: ${finalMessages.length}`);
      }, delay);
    }
  };

  // 清除聊天记录 - 从 localStorage 清除并更新页面
  const handleClearMessages = () => {
    console.log(`🗑️ 清除联系人 ${activeContact.name} 的所有消息`);
    
    // 从 localStorage 清除数据
    clearMessages(activeContact.id);
    
    // 更新页面显示
    setMessages([]);
    
    // 更新联系人最后消息
    updateContactLastMessages();
  };


  // 切换联系人面板折叠状态
  const toggleContactsPanel = () => {
    setIsCollapsing(true);
    setIsContactsCollapsed(!isContactsCollapsed);
    
    // 动画完成后重置折叠状态
    setTimeout(() => {
      setIsCollapsing(false);
    }, 300); // 与CSS transition时间一致
  };


  // 处理键盘事件
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      {/* 左侧联系人列表 */}
      <div className={`contacts-panel ${isContactsCollapsed ? 'collapsed' : ''} ${isCollapsing ? 'collapsing' : ''}`}>
        <div className="contacts-header">
          {!isContactsCollapsed && <h3>消息</h3>}
          <Tooltip title={isContactsCollapsed ? '展开联系人列表' : '折叠联系人列表'}>
            <Button 
              type="text" 
              icon={isContactsCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={toggleContactsPanel}
              size="small"
              className="collapse-btn"
            />
          </Tooltip>
        </div>
        {!isContactsCollapsed && (
          <div className="contacts-list">
            {contacts.map(contact => (
              <div 
                key={contact.id}
                className={`contact-item ${activeContact.id === contact.id ? 'active' : ''}`}
                onClick={() => setActiveContact(contact)}
              >
                <div className="contact-status">
                  <Avatar size={40} style={{ backgroundColor: '#87d068' }}>
                    {contact.avatar}
                  </Avatar>
                  <span className={`status-dot ${contact.status}`}></span>
                </div>
                <div className="contact-info">
                  <div className="contact-name-row">
                    <div className="contact-name">{contact.name}</div>
                    <div className="contact-time">
                      {contactLastMessageTimes[contact.id] ? 
                        formatContactTime(contactLastMessageTimes[contact.id]!) : 
                        ''
                      }
                    </div>
                  </div>
                  <div className="contact-message">
                    {contactLastMessages[contact.id] || contact.lastMessage}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {isContactsCollapsed && (
          <div className="collapsed-contacts">
            {contacts.map(contact => (
              <Tooltip key={contact.id} title={contact.name} placement="right">
                <div 
                  className={`collapsed-contact-item ${activeContact.id === contact.id ? 'active' : ''}`}
                  onClick={() => setActiveContact(contact)}
                >
                  <Avatar size={32} style={{ backgroundColor: '#87d068' }}>
                    {contact.avatar}
                  </Avatar>
                  <div className={`status-indicator ${contact.status}`}></div>
                </div>
              </Tooltip>
            ))}
          </div>
        )}
      </div>

      {/* 右侧对话区域 */}
      <div className="chat-panel">
        {/* 对话头部 */}
        <div className="chat-header">
          <div className="chat-user-info">
            <Avatar size={40} style={{ backgroundColor: '#87d068' }}>
              {activeContact.avatar}
            </Avatar>
            <div className="chat-user-details">
              <div className="chat-user-name">{activeContact.name}</div>
              <div className="chat-user-status">
                <span className={`status-indicator ${activeContact.status}`}></span>
                {activeContact.status === 'online' ? '在线' : '离线'}
              </div>
            </div>
          </div>
          <div className="chat-actions">
            <Tooltip title="清空聊天记录">
              <Button 
                type="text" 
                icon={<ClearOutlined />} 
                onClick={handleClearMessages}
                size="small"
              />
            </Tooltip>
          </div>
        </div>

        {/* 消息列表 */}
        <div className="messages-container">
          {messages.map((msg, index) => {
            // 检查是否需要显示时间分隔线
            const previousMessage = index > 0 ? messages[index - 1] : undefined;
            const showTimeDivider = shouldShowTimeDivider(msg, previousMessage);
            
            return (
              <React.Fragment key={msg.id}>
                {/* 时间分隔线 */}
                {showTimeDivider && (
                  <div className="time-divider">
                    <span className="time-text">
                      {formatTimeDivider(msg.timestamp)}
                    </span>
                  </div>
                )}
                
                {/* 消息内容 */}
                <div className={`message-wrapper ${msg.sender}`}>
                  {msg.sender === 'bot' && (
                    <Avatar size={36} style={{ backgroundColor: '#87d068', flexShrink: 0 }}>
                      {activeContact.avatar}
                    </Avatar>
                  )}
                  <div className="message-bubble">
                    <div className="message-content">{msg.content}</div>
                    <div className="message-time">{formatTime(msg.timestamp)}</div>
                  </div>
                  {msg.sender === 'user' && (
                    <Avatar size={36} style={{ backgroundColor: '#1890ff', flexShrink: 0 }}>
                      👤
                    </Avatar>
                  )}
                </div>
              </React.Fragment>
            );
          })}
          
          {/* 正在输入指示器 */}
          {isTyping && (
            <div className="message-wrapper bot">
              <Avatar size={36} style={{ backgroundColor: '#87d068', flexShrink: 0 }}>
                {activeContact.avatar}
              </Avatar>
              <div className="typing-indicator">
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>
                  {activeContact.name} 正在输入...
                </Text>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* 输入区域 */}
        <div className="input-panel">
          <div className="input-toolbar">
            <Button type="text" icon={<SmileOutlined />} />
            <Button type="text" icon={<PlusOutlined />} />
          </div>
          <div className="input-area">
            <TextArea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入消息..."
              autoSize={{ minRows: 1, maxRows: 4 }}
              bordered={false}
            />
            <Button 
              type="primary" 
              icon={<SendOutlined />}
              onClick={sendMessage}
              disabled={!inputValue.trim()}
              className="send-button"
            >
              发送
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
