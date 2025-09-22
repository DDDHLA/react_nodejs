import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { register, type RegisterParams } from "@/api/user.ts";
const Register = () => {
  const navigate = useNavigate();

  const onFinish = async (values: RegisterParams & { confirmPassword?: string }): Promise<void> => {
    console.log("Received values of form: ", values);
    delete values.confirmPassword;
    try {
      const res = await register(values);
      if (res.status === 0) {
        message.success(res.message);
        navigate("/login");
        return;
      }
      message.error(res.message);
    } catch (error) {
      console.log("register error", error);
    }
  };

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "0 auto",
        padding: "50px 0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f2f5",
      }}
    >
      <div
        style={{
          width: "100%",
          backgroundColor: "#ffffff",
          padding: "40px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "24px" }}>注册</h2>
        <Form
          name="register"
          onFinish={onFinish}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: "请输入用户名!" }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: "请输入密码!" }]}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item
            label="确认密码"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "请确认密码!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("两次输入的密码不一致!"));
                },
              }),
            ]}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item label="昵称" name="nickname">
            <Input size="large" />
          </Form.Item>

          <Form.Item label="邮箱" name="email">
            <Input size="large" />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
            <div style={{ textAlign: "right", marginBottom: "10px" }}>
              <span style={{ fontSize: "14px" }}>
                已有账号？
                <a onClick={() => navigate("/login")}>返回登录</a>
              </span>
            </div>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "100%" }}
              size="large"
            >
              注册
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Register;
