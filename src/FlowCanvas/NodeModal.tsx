import * as React from "react";
import { Modal, Form, Input, Button } from "antd";

interface NodeModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (question: string, answer: string) => void;
}

const NodeModal: React.FC<NodeModalProps> = ({
  visible,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit(values.question, values.answer);
      form.resetFields();
    });
  };

  return (
    <Modal
      title="添加节点"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          确定
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="question"
          label="问题"
          rules={[{ required: true, message: "请输入问题" }]}
        >
          <Input placeholder="请输入问题" />
        </Form.Item>
        <Form.Item
          name="answer"
          label="结果"
          rules={[{ required: true, message: "请输入结果" }]}
        >
          <Input.TextArea rows={4} placeholder="请输入结果" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NodeModal;
