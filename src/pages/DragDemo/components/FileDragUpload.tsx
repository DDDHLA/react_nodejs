import { useState, useRef, useCallback } from 'react';
import { 
  Card, 
  Progress, 
  Button, 
  Space, 
  Typography, 
  List, 
  Tag, 
  message,
  Popconfirm 
} from 'antd';
import { 
  CloudUploadOutlined, 
  DeleteOutlined, 
  FileOutlined,
  CheckCircleOutlined,
  LoadingOutlined 
} from '@ant-design/icons';
import './FileDragUpload.less';

const { Text } = Typography;

interface FileItem {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  preview?: string;
}

const FileDragUpload = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 支持的文件类型
  const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  // 验证文件
  const validateFile = (file: File): boolean => {
    if (!acceptedTypes.includes(file.type)) {
      message.error(`不支持的文件类型: ${file.type}`);
      return false;
    }
    if (file.size > maxFileSize) {
      message.error(`文件大小不能超过 ${maxFileSize / 1024 / 1024}MB`);
      return false;
    }
    return true;
  };

  // 生成文件预览
  const generatePreview = (file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        resolve(undefined);
      }
    });
  };

  // 模拟文件上传
  const simulateUpload = (fileItem: FileItem) => {
    const interval = setInterval(() => {
      setFiles(prev => prev.map(item => {
        if (item.id === fileItem.id) {
          const newProgress = Math.min(item.progress + Math.random() * 20, 100);
          const newStatus = newProgress === 100 ? 'success' : 'uploading';
          
          if (newProgress === 100) {
            clearInterval(interval);
            message.success(`${item.file.name} 上传成功！`);
          }
          
          return { ...item, progress: newProgress, status: newStatus };
        }
        return item;
      }));
    }, 200);
  };

  // 处理文件添加
  const handleFiles = useCallback(async (fileList: FileList) => {
    const validFiles = Array.from(fileList).filter(validateFile);
    
    for (const file of validFiles) {
      const id = `${Date.now()}-${Math.random()}`;
      const preview = await generatePreview(file);
      
      const fileItem: FileItem = {
        id,
        file,
        progress: 0,
        status: 'uploading',
        preview
      };
      
      setFiles(prev => [...prev, fileItem]);
      simulateUpload(fileItem);
    }
  }, []);

  // 拖拽事件处理
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFiles(droppedFiles);
    }
  }, [handleFiles]);

  // 点击上传
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      handleFiles(selectedFiles);
    }
    // 清空input值，允许重复选择同一文件
    e.target.value = '';
  };

  // 删除文件
  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(item => item.id !== id));
  };

  // 清空所有文件
  const clearAll = () => {
    setFiles([]);
  };

  // 获取文件图标
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <FileOutlined style={{ color: '#52c41a' }} />;
    } else if (file.type === 'application/pdf') {
      return <FileOutlined style={{ color: '#f5222d' }} />;
    } else {
      return <FileOutlined style={{ color: '#1890ff' }} />;
    }
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="file-drag-upload">
      {/* 拖拽上传区域 */}
      <div
        className={`upload-area ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="upload-content">
          <CloudUploadOutlined className="upload-icon" />
          <div className="upload-text">
            <Text strong>点击或拖拽文件到此区域上传</Text>
            <br />
            <Text type="secondary">
              支持 JPG、PNG、GIF、PDF、TXT 格式，单个文件不超过 10MB
            </Text>
          </div>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />
      </div>

      {/* 文件列表 */}
      {files.length > 0 && (
        <Card 
          title={
            <Space>
              <Text>上传文件列表</Text>
              <Tag color="blue">{files.length} 个文件</Tag>
            </Space>
          }
          extra={
            <Popconfirm
              title="确定要清空所有文件吗？"
              onConfirm={clearAll}
              okText="确定"
              cancelText="取消"
            >
              <Button size="small" danger>
                清空所有
              </Button>
            </Popconfirm>
          }
          className="file-list-card"
        >
          <List
            dataSource={files}
            renderItem={(item) => (
              <List.Item
                key={item.id}
                className="file-item"
                actions={[
                  <Button
                    key="delete"
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => removeFile(item.id)}
                  />
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <div className="file-avatar">
                      {item.preview ? (
                        <img src={item.preview} alt={item.file.name} />
                      ) : (
                        getFileIcon(item.file)
                      )}
                    </div>
                  }
                  title={
                    <Space>
                      <Text ellipsis style={{ maxWidth: 200 }}>
                        {item.file.name}
                      </Text>
                      {item.status === 'success' && (
                        <CheckCircleOutlined style={{ color: '#52c41a' }} />
                      )}
                      {item.status === 'uploading' && (
                        <LoadingOutlined style={{ color: '#1890ff' }} />
                      )}
                    </Space>
                  }
                  description={
                    <Space direction="vertical" size="small">
                      <Text type="secondary">
                        {formatFileSize(item.file.size)}
                      </Text>
                      <Progress
                        percent={Math.round(item.progress)}
                        size="small"
                        status={item.status === 'error' ? 'exception' : 'normal'}
                        showInfo={false}
                      />
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      )}
    </div>
  );
};

export default FileDragUpload;
