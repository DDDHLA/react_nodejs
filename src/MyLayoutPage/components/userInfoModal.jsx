import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Upload, Button, Image } from "antd";
import {
  UploadOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const UserInfoModal = ({ visible, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (initialValues.user_pic) {
      const fileObj = {
        uid: "-1", // 固定的 uid，避免重复
        name: "avatar.png", // 随便起个名字
        status: "done",
        url: initialValues.user_pic, // ✅ 用于展示头像
      };
      setFileList([fileObj]);
      setImageUrl(initialValues.user_pic);
      setPreviewImage(initialValues.user_pic);
    }
  }, [initialValues]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      // 去除昵称和邮箱的首尾空格
      const trimmedValues = {
        ...values,
        nickname: values.nickname.trim(),
        email: values.email.trim(),
        user_pic: imageUrl, // 使用 Base64 格式的图片
      };
      onSubmit(trimmedValues);
    });
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("只能上传 JPG/PNG 格式的图片！");
      return false;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("图片必须小于 2MB！");
      return false;
    }

    // 校验通过，但不自动上传
    return false;
  };
  const handleChange = ({ fileList: newFileList }) => {
    const file = newFileList[0];
    if (file && file.originFileObj) {
      const reader = new FileReader();
      reader.readAsDataURL(file.originFileObj);

      reader.onload = () => {
        setImageUrl(reader.result); // 将 Base64 数据存储在 imageUrl 中
        setFileList([file]); // 更新 fileList
        setPreviewImage(reader.result); // 设置预览图片
      };
    } else {
      setFileList([]);
      setImageUrl("");
      setPreviewImage("");
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <Modal
      open={visible}
      title="修改个人信息"
      onCancel={onCancel}
      onOk={handleOk}
      width={600}
      maskClosable={false}
    >
      <Form
        form={form}
        initialValues={initialValues}
        wrapperCol={{ span: 21 }}
        labelCol={{ span: 3 }}
      >
        {/* <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: "请输入用户名!" }]}
        >
          <Input />
        </Form.Item> */}
        <Form.Item label="昵称" name="nickname">
          <Input />
        </Form.Item>
        <Form.Item label="邮箱" name="email">
          <Input />
        </Form.Item>
        <Form.Item label="头像" name="user_pic">
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
            // beforeUpload={() => false} // 阻止自动上传
            beforeUpload={beforeUpload}
            onChange={handleChange}
            fileList={fileList}
            onPreview={() => setPreviewOpen(true)}
            onRemove={() => {
              setImageUrl(""); // 删除功能
              setFileList([]);
            }}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
          {previewImage && (
            <Image
              wrapperStyle={{ display: "none" }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage}
            />
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserInfoModal;
