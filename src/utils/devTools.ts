// 开发工具 - 用于将运行时数据同步到代码文件
import { getAllChats } from '@/api/chat';

// 生成聊天数据的代码字符串
export const generateChatDataCode = (): string => {
  const allChats = getAllChats();
  
  const codeTemplate = `// 聊天数据存储文件 - 消息记录将保存在这里
import type { Message } from '@/api/chat';

// 聊天记录数据存储
export const chatData: Record<string, Message[]> = ${JSON.stringify(allChats, null, 2)};

// 数据更新函数 - 用于动态更新聊天数据
export const updateChatData = (contactId: string, messages: Message[]) => {
  chatData[contactId] = [...messages];
  
  // 这里可以添加自动保存到文件的逻辑（开发环境下）
  if (process.env.NODE_ENV === 'development') {
    console.log(\`聊天数据已更新 - 联系人: \${contactId}, 消息数量: \${messages.length}\`);
    // 在开发环境下，可以将数据输出到控制台，方便复制保存
    console.log('最新聊天数据:', JSON.stringify(chatData, null, 2));
  }
};

// 获取聊天数据
export const getChatData = (contactId: string): Message[] => {
  return chatData[contactId] || [];
};

// 清除聊天数据
export const clearChatData = (contactId: string) => {
  chatData[contactId] = [];
};

// 导出所有聊天数据（用于备份）
export const exportAllChatData = () => {
  const dataStr = JSON.stringify(chatData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = \`chat_backup_\${new Date().toISOString().split('T')[0]}.json\`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// 导入聊天数据（从备份文件恢复）
export const importChatData = (file: File): Promise<void> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        Object.assign(chatData, importedData);
        resolve();
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsText(file);
  });
};`;

  return codeTemplate;
};

// 在控制台输出最新的聊天数据代码
export const logChatDataCode = () => {
  const code = generateChatDataCode();
  console.log('=== 最新聊天数据代码 ===');
  console.log(code);
  console.log('=== 复制上面的代码到 src/data/chatData.ts 文件中 ===');
};

// 下载聊天数据代码文件
export const downloadChatDataCode = () => {
  const code = generateChatDataCode();
  const blob = new Blob([code], { type: 'text/typescript' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `chatData_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.ts`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  return {
    timestamp: new Date().toLocaleString('zh-CN'),
    filename: `chatData_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.ts`
  };
};

// 开发环境下的快捷键绑定
if (process.env.NODE_ENV === 'development') {
  // 按 Ctrl+Shift+D 输出聊天数据代码
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
      e.preventDefault();
      logChatDataCode();
    }
    
    // 按 Ctrl+Shift+S 下载聊天数据代码文件
    if (e.ctrlKey && e.shiftKey && e.key === 'S') {
      e.preventDefault();
      downloadChatDataCode();
    }
  });
  
  // 在window对象上暴露工具函数，方便在控制台调用
   
  (window as typeof window & { devTools: any }).devTools = {
    logChatDataCode,
    downloadChatDataCode,
    generateChatDataCode
  };
}
