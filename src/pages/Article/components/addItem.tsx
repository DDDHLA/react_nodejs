import { Modal, Form, Input, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

interface AddItemProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
}

const AddItem = ({ visible, onCancel, onSubmit }: AddItemProps) => {
  const [form] = Form.useForm();

  const handleOk = async (): Promise<void> => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (error) {
      console.log("表单验证失败:", error);
    }
  };

  return (
    <Modal
      open={visible}
      title="新增文章分类"
      onCancel={onCancel}
      onOk={handleOk}
      destroyOnClose
    >
      {/* preserve={false} : 关闭表单重置 */}
      <Form
        form={form}
        layout="horizontal"
        preserve={false}
        labelCol={{ span: 4 }}
      >
        <Form.Item
          label="文章类型"
          name="name"
          rules={[{ required: true, message: "请输入文章类型!" }]}
        >
          <Input placeholder="请输入文章类型" />
        </Form.Item>
        <Form.Item
          label="文章别名"
          name="alias"
          rules={[{ required: true, message: "请输入文章别名!" }]}
        >
          <Input placeholder="请输入文章别名" />
        </Form.Item>

        <Form.Item
          label="文件"
          name="file"
          rules={[{ required: true, message: "请上传文件!" }]}
        >
          <Upload
            maxCount={1}
            beforeUpload={() => false} // 阻止自动上传
          >
            <Button icon={<UploadOutlined />}>选择文件</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddItem;
