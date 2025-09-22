// 聊天相关的API和工具函数
import { useState, useCallback } from "react";

export interface Message {
  id: string;
  content: string;
  timestamp: number;
  sender: "user" | "bot";
  avatar?: string;
  type: "text" | "image" | "file";
}

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline";
  lastMessage: string;
}

// 前端数据存储管理 - 主要使用localStorage，同步到代码文件
import { updateChatData, getChatData, clearChatData } from '@/data/chatData';

// 保存聊天记录 - 保存到localStorage和内存
export const saveMessages = (contactId: string, messages: Message[]): void => {
  try {
    // 保存到localStorage
    localStorage.setItem(`chat_${contactId}`, JSON.stringify(messages));
    console.log(`💾 消息已保存 - 联系人: ${contactId}, 消息数量: ${messages.length}`);
    
    // 更新内存数据
    updateChatData(contactId, messages);
  } catch (error) {
    console.error("保存聊天记录失败:", error);
  }
};

// 获取聊天记录 - 优先从localStorage读取，备用从内存读取
export const getMessages = (contactId: string): Message[] => {
  try {
    // 先从localStorage读取
    const localData = localStorage.getItem(`chat_${contactId}`);
    if (localData) {
      const messages = JSON.parse(localData);
      console.log(`📖 从localStorage读取消息 - 联系人: ${contactId}, 消息数量: ${messages.length}`);
      // 同步更新内存数据
      updateChatData(contactId, messages);
      return messages;
    }
    
    // 如果localStorage没有，从内存读取
    const messages = getChatData(contactId);
    console.log(`📖 从内存读取消息 - 联系人: ${contactId}, 消息数量: ${messages.length}`);
    return messages;
  } catch (error) {
    console.error("获取聊天记录失败:", error);
    return [];
  }
};

// 清除聊天记录
export const clearMessages = (contactId: string): void => {
  try {
    // 清除localStorage
    localStorage.removeItem(`chat_${contactId}`);
    console.log(`🗑️ 已清除localStorage中联系人 ${contactId} 的消息`);
    
    // 清除内存数据
    clearChatData(contactId);
  } catch (error) {
    console.error("清除聊天记录失败:", error);
  }
};

// 获取所有聊天记录
export const getAllChats = (): Record<string, Message[]> => {
  try {
    const allChats: Record<string, Message[]> = {};
    
    // 获取所有联系人的消息
    defaultContacts.forEach(contact => {
      allChats[contact.id] = getMessages(contact.id);
    });
    
    console.log('📚 已读取所有聊天记录');
    return allChats;
  } catch (error) {
    console.error("获取所有聊天记录失败:", error);
    return {};
  }
};

// 获取联系人的最后一条消息
export const getLastMessage = (contactId: string): string => {
  try {
    const messages = getMessages(contactId);
    if (messages.length === 0) {
      // 如果没有消息，返回默认欢迎消息
      const contact = defaultContacts.find((c) => c.id === contactId);
      return contact?.lastMessage || "暂无消息";
    }

    // 返回最后一条消息的内容
    const lastMessage = messages[messages.length - 1];
    return lastMessage.content;
  } catch (error) {
    console.error("获取最后一条消息失败:", error);
    return "暂无消息";
  }
};

// 获取联系人的最后消息时间
export const getLastMessageTime = (contactId: string): number | null => {
  try {
    const messages = getMessages(contactId);
    if (messages.length === 0) {
      return null; // 没有消息时返回null
    }

    // 返回最后一条消息的时间戳
    const lastMessage = messages[messages.length - 1];
    return lastMessage.timestamp;
  } catch (error) {
    console.error("获取最后消息时间失败:", error);
    return null;
  }
};

// AI回复生成器 - 使用现代函数式写法
const aiReplies = [
  "你好！我是AI助手，很高兴为你服务！",
  "这是一个很有趣的问题，让我想想...",
  "我理解你的意思，这确实需要仔细考虑。",
  "根据我的分析，我建议你可以尝试这样做...",
  "还有其他问题需要帮助吗？",
  "感谢你的提问！希望我的回答对你有帮助。",
  "这个功能确实很实用，你的想法很棒！",
  "让我为你查找相关信息...",
  "我明白了，这个问题确实比较复杂。",
  "从技术角度来看，这是可行的。",
  "你提到的这个方案很有创意！",
  "让我们一步步来解决这个问题。",
] as const;

const contextReplies: Record<string, readonly string[]> = {
  你好: [
    "你好！很高兴见到你！",
    "嗨！今天过得怎么样？",
    "你好呀！有什么可以帮助你的吗？",
  ],
  谢谢: ["不客气！", "很高兴能帮到你！", "随时为你服务！"],
  再见: ["再见！祝你有美好的一天！", "拜拜！期待下次聊天！", "再见！保重！"],
  帮助: [
    "当然可以帮助你！请告诉我具体需要什么帮助。",
    "我很乐意帮助你，请详细描述你的问题。",
  ],
} as const;

// 生成智能回复
export const generateAIReply = (userMessage: string): string => {
  const message = userMessage.toLowerCase();

  // 检查上下文关键词
  for (const [keyword, replies] of Object.entries(contextReplies)) {
    if (message.includes(keyword.toLowerCase())) {
      return replies[Math.floor(Math.random() * replies.length)];
    }
  }

  // 基于消息长度和内容生成回复
  if (message.length > 50) {
    return "你说得很详细，让我仔细分析一下...这确实是个值得深入思考的问题。";
  }

  if (message.includes("?") || message.includes("？")) {
    return (
      "这是个好问题！" + aiReplies[Math.floor(Math.random() * aiReplies.length)]
    );
  }

  // 默认随机回复
  return aiReplies[Math.floor(Math.random() * aiReplies.length)];
};

// 生成延迟时间（模拟真实对话）
export const getAIReplyDelay = (messageLength: number): number => {
  const baseDelay = 1000; // 基础延迟1秒
  const lengthDelay = Math.min(messageLength * 50, 3000); // 根据消息长度增加延迟，最多3秒
  const randomDelay = Math.random() * 1000; // 随机延迟0-1秒
  return baseDelay + lengthDelay + randomDelay;
};

// 消息工具函数 - 使用现代函数式写法

// 格式化时间显示
export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (diff < 60000) return "刚刚";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
  if (diff < 86400000)
    return date.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  if (diff < 604800000)
    return date.toLocaleDateString("zh-CN", {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  return date.toLocaleDateString("zh-CN");
};

// 格式化联系人列表的时间显示（更简洁）
export const formatContactTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  // 1分钟内
  if (diff < 60000) return "刚刚";

  // 1小时内
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;

  // 今天内
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const messageDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  if (messageDate.getTime() === today.getTime()) {
    return date.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // 昨天
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  if (messageDate.getTime() === yesterday.getTime()) {
    return "昨天";
  }

  // 本周内
  if (diff < 604800000) {
    return date.toLocaleDateString("zh-CN", { weekday: "short" });
  }

  // 更早的时间
  return date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
};

// 判断是否需要显示时间分隔线（超过5分钟）
export const shouldShowTimeDivider = (
  currentMessage: Message,
  previousMessage?: Message
): boolean => {
  if (!previousMessage) return true; // 第一条消息总是显示时间

  const timeDiff = currentMessage.timestamp - previousMessage.timestamp;
  return timeDiff > 5 * 60 * 1000; // 5分钟 = 5 * 60 * 1000 毫秒
};

// 格式化时间分隔线显示
export const formatTimeDivider = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const messageDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  // 判断是否是今天
  if (messageDate.getTime() === today.getTime()) {
    return date.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // 判断是否是昨天
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  if (messageDate.getTime() === yesterday.getTime()) {
    return `昨天 ${date.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  // 其他日期
  return date.toLocaleString("zh-CN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// 生成消息ID
export const generateMessageId = (): string => {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
};

// 创建消息对象
export const createMessage = (
  content: string,
  sender: "user" | "bot",
  type: "text" | "image" | "file" = "text"
): Message => {
  return {
    id: generateMessageId(),
    content,
    timestamp: Date.now(),
    sender,
    type,
  };
};

// 自定义Hook：聊天管理
export const useChatManager = (contactId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // 加载消息
  const loadMessages = useCallback(() => {
    const savedMessages = getMessages(contactId);
    setMessages(savedMessages);
  }, [contactId]);

  // 发送消息
  const sendMessage = useCallback(
    (content: string) => {
      const message = createMessage(content, "user");
      const newMessages = [...messages, message];
      setMessages(newMessages);
      saveMessages(contactId, newMessages);
      return message;
    },
    [contactId, messages]
  );

  // 接收消息
  const receiveMessage = useCallback(
    (content: string) => {
      const message = createMessage(content, "bot");
      setMessages((prev) => {
        const newMessages = [...prev, message];
        saveMessages(contactId, newMessages);
        return newMessages;
      });
      return message;
    },
    [contactId]
  );

  // 清空消息
  const clearAllMessages = useCallback(() => {
    setMessages([]);
    clearMessages(contactId);
  }, [contactId]);

  return {
    messages,
    isTyping,
    setIsTyping,
    loadMessages,
    sendMessage,
    receiveMessage,
    clearAllMessages,
  };
};

// 导出默认联系人数据
export const defaultContacts: Contact[] = [
  {
    id: "1",
    name: "AI助手",
    avatar: "🤖",
    status: "online",
    lastMessage: "你好！有什么可以帮助你的吗？",
  },
  {
    id: "2",
    name: "小明",
    avatar: "👨‍💻",
    status: "online",
    lastMessage: "今天天气不错呢",
  },
  {
    id: "3",
    name: "小红",
    avatar: "👩‍🎨",
    status: "offline",
    lastMessage: "明天见！",
  },
  {
    id: "4",
    name: "技术群",
    avatar: "👥",
    status: "online",
    lastMessage: "大家讨论一下新项目",
  },
  {
    id: "5",
    name: "产品经理",
    avatar: "👔",
    status: "online",
    lastMessage: "需求文档已更新",
  },
];
