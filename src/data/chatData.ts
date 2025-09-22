// 聊天数据存储文件 - 消息记录将保存在这里
import type { Message } from '@/api/chat';

// 聊天记录数据存储
export const chatData: Record<string, Message[]> = {
  // AI助手的聊天记录
  "1": [
    {
      id: "msg_1_init_1",
      content: "你好！我是AI助手，很高兴为你服务！",
      timestamp: Date.now() - 10 * 60 * 1000, // 10分钟前
      sender: "bot",
      type: "text"
    },
    {
      id: "msg_1_init_2", 
      content: "你好！",
      timestamp: Date.now() - 9 * 60 * 1000, // 9分钟前
      sender: "user",
      type: "text"
    },
    {
      id: "msg_1_init_3",
      content: "有什么可以帮助你的吗？",
      timestamp: Date.now() - 3 * 60 * 1000, // 3分钟前
      sender: "bot", 
      type: "text"
    },
    {
      id: "msg_1_user_123456",
      content: "123456",
      timestamp: Date.now() - 2 * 60 * 1000, // 2分钟前
      sender: "user",
      type: "text"
    },
    {
      id: "msg_1_bot_reply_123456",
      content: "收到你的消息：123456。这是个好问题！我理解你的意思，这确实需要仔细考虑。",
      timestamp: Date.now() - 1 * 60 * 1000, // 1分钟前
      sender: "bot",
      type: "text"
    }
  ],
  
  // 小明的聊天记录
  "2": [
    {
      id: "msg_2_init_1",
      content: "今天天气不错呢",
      timestamp: Date.now() - 5 * 60 * 1000, // 5分钟前
      sender: "user",
      type: "text"
    }
  ],
  
  // 小红的聊天记录
  "3": [
    {
      id: "msg_3_init_1", 
      content: "明天见！",
      timestamp: Date.now() - 24 * 60 * 60 * 1000, // 1天前
      sender: "user",
      type: "text"
    }
  ],
  
  // 技术群的聊天记录
  "4": [
    {
      id: "msg_4_init_1",
      content: "大家讨论一下新项目",
      timestamp: Date.now() - 30 * 60 * 1000, // 30分钟前
      sender: "user", 
      type: "text"
    }
  ],
  
  // 产品经理的聊天记录
  "5": [
    {
      id: "msg_5_init_1",
      content: "需求文档已更新",
      timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2小时前
      sender: "user",
      type: "text"
    }
  ]
};

// 数据更新函数 - 简单更新内存数据
export const updateChatData = (contactId: string, messages: Message[]) => {
  chatData[contactId] = [...messages];
  console.log(`💾 已更新联系人 ${contactId} 的数据，消息数量: ${messages.length}`);
};

// 获取聊天数据
export const getChatData = (contactId: string): Message[] => {
  return chatData[contactId] || [];
};

// 清除聊天数据
export const clearChatData = (contactId: string) => {
  chatData[contactId] = [];
};



