import React, { useState } from "react";
import { Form, Upload, Button, Input, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const VideoUploadForm = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  // 上传前校验文件大小
  const beforeUpload = (file) => {
    const isLt20M = file.size / 1024 / 1024 < 20;
    if (!isLt20M) {
      message.error("视频文件大小不能超过20MB!");
      // 阻止上传，
      return Upload.LIST_IGNORE; // 阻止加入到上传列表
    }
    return false; // 阻止自动上传，但允许加入fileList
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    // 同步更新到表单字段
    form.setFieldsValue({
      video: newFileList.length > 0 ? { fileList: newFileList } : null,
    });
    form.validateFields(["video"]);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      console.log("表单验证通过，提交数据:", values);
      console.log("准备上传的文件:", fileList);
    });
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item
        name="video"
        label="上传视频"
        rules={[{ required: true, message: "请上传视频文件!" }]}
      >
        <Upload
          name="video"
          accept="video/*"
          beforeUpload={beforeUpload}
          onChange={handleUploadChange}
          fileList={fileList}
          listType="text"
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>点击上传视频</Button>
        </Upload>
      </Form.Item>

      <Form.Item name="title" label="视频标题">
        <Input placeholder="请输入视频标题" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
  );
};

export default VideoUploadForm;
