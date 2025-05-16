import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { login } from "@/api/user";
const Login: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = async (values: {
    username: string;
    password: string;
  }): Promise<void> => {
    // navigate("/home");
    try {
      const res = await login(values);
      if (res.status === 0) {
        message.success(res.message);
        localStorage.setItem("token", JSON.stringify(res.token));
        navigate("/home");
        return;
      }
      message.error(res.message);
    } catch (error) {
      console.log("login error", error);
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
        <h2 style={{ textAlign: "center", marginBottom: "24px" }}>登录</h2>
        <Form
          name="login"
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

          {/* <Form.Item label="昵称" name="nickname">
            <Input size="large" />
          </Form.Item>

          <Form.Item label="邮箱" name="email">
            <Input size="large" />
          </Form.Item> */}

          <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
            <div style={{ textAlign: "right", marginBottom: "10px" }}>
              <span style={{ fontSize: "14px" }}>
                如果还没有账号，
                <a onClick={() => navigate("/register")}>前往注册页面</a>
              </span>
            </div>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "100%" }}
              size="large"
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
