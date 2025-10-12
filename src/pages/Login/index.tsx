import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { login } from "@/api/user";
const Login: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = async (values: {
    username: string;
    password: string;
  }): Promise<void> => {
    try {
      const res = await login(values);
      console.log("登录响应:", res);
      
      // 判断登录是否成功
      if (res.status === 0) {
        // 获取 token（兼容两种数据结构）
        const token = (res as any).data?.token || (res as any).token;
        
        if (token) {
          // 先保存 token
          localStorage.setItem("token", JSON.stringify(token));
          // 显示成功消息
          message.success(res.message || "登录成功");
          // 延迟跳转，确保消息显示
          setTimeout(() => {
            navigate("/home");
          }, 500);
          return;
        } else {
          console.error("登录响应中没有 token:", res);
          message.error("登录失败：未获取到 token");
          return;
        }
      }
      
      // 登录失败
      message.error(res.message || "登录失败");
    } catch (error) {
      console.error("登录错误:", error);
      message.error("登录失败，请稍后重试");
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
