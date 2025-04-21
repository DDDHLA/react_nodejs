import React, { useEffect, useState, useRef } from "react";
import type { MenuProps } from "antd";
import {
  Breadcrumb,
  Layout,
  Menu,
  theme,
  Dropdown,
  Button,
  message,
} from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import routes from "../router"; // 引入路由配置
import CustomIcon from "../assets/react.svg";
import { getUserInfo, updateUserInfo, updatePassword } from "@/api/user";
import UserInfoModal from "./components/userInfoModal"; // 引入UserInfoModal组件
import ChangePasswordModal from "./components/ChangePasswordModal"; // 引入ChangePasswordModal组件

const { Header, Content, Sider } = Layout;

const breadcrumbNameMap: Record<string, string> = {
  "/home": "首页",
  "/article": "文章管理",
  "/publish": "发布文章",
};

const MyLayoutPage = () => {
  const [info, setInfo] = useState({});
  const hasFetched = useRef(false); // 添加标志位

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const navigate = useNavigate();

  const getInfo = async () => {
    try {
      const res = await getUserInfo();
      if (res.status !== 0) return message.error(res.message);
      setInfo(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      getInfo();
      hasFetched.current = true;
    }
  }, []);

  const handleModalSubmit = async (values) => {
    setIsModalVisible(false);
    console.log(values);
    try {
      // const formData = new FormData();
      // formData.append("username", values.username);
      // formData.append("user_pic", values.user_pic);
      // formData.append("email", values.email);
      const res = await updateUserInfo(values);
      if (res.status !== 0) return message.error(res.message);
      setInfo({ ...info, ...values });
      message.success(res.message);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePasswordSubmit = async (values) => {
    try {
      const res = await updatePassword(values);
      if (res.status !== 0) return message.error(res.message);
      setIsPasswordModalVisible(false);
      message.success(res.message);
    } catch (error) {
      console.log(error);
    }
    // 在这里处理密码更新逻辑
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <span>修改个人信息</span>,
      onClick: () => {
        // getInfo();
        setIsModalVisible(true); // 打开Modal
      },
    },
    {
      key: "2",
      label: <span>退出登录</span>,
      onClick: () => {
        localStorage.removeItem("token");
        navigate("/login");
      },
    },
    {
      key: "3",
      label: <span>修改密码</span>,
      onClick: () => {
        setIsPasswordModalVisible(true); // 打开修改密码Modal
      },
    },
  ];
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const location = useLocation();

  // 动态面包屑
  const pathSnippets = location.pathname.split("/").filter((i) => i);
  const breadcrumbItems = [
    {
      title: "首页",
      path: "/home",
    },
    ...pathSnippets
      .filter((snippet) => snippet !== "home")
      .map((snippet, idx) => {
        const url = `/${pathSnippets.slice(0, idx + 1).join("/")}`;
        return {
          title: breadcrumbNameMap[url] || snippet,
          path: url,
        };
      }),
  ].map((item) => ({
    title: item.title,
  }));

  // 动态生成侧边栏菜单项
  const siderMenuItems: MenuProps["items"] =
    routes
      .find((route) => route.path === "/")
      ?.children?.filter((child) => child.icon && child.label) // 过滤掉没有图标和标签的项
      .map((child) => ({
        key: child.path,
        icon: child.icon, // 从路由中获取图标
        label: child.label, // 从路由中获取标签
      })) || [];

  return (
    <Layout style={{ height: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#fff",
          justifyContent: "space-between",
        }}
      >
        <img src={CustomIcon} alt="Custom Icon" style={{ height: 40 }} />
        <div style={{ display: "flex", alignItems: "center" }}>
          {info.user_pic ? (
            <img
              src={info.user_pic}
              alt="User Avatar"
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                marginRight: 8,
              }}
            />
          ) : (
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: "#ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 8,
                color: "#fff",
                fontSize: 20,
              }}
            >
              {info.username ? info.username.charAt(0).toUpperCase() : ""}
            </div>
          )}
          <Dropdown menu={{ items }} placement="bottom">
            <Button>{info.username}</Button>
          </Dropdown>
        </div>
      </Header>
      <Layout>
        <Sider
          width={200}
          style={{ background: colorBgContainer, overflow: "auto" }}
        >
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            style={{ height: "100%", borderRight: 0 }}
            items={siderMenuItems}
            onClick={({ key }) => {
              navigate(key);
            }}
          />
        </Sider>
        <Layout style={{ padding: "0 24px 24px" }}>
          <Breadcrumb items={breadcrumbItems} style={{ margin: "16px 0" }} />
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
      {isModalVisible && (
        <UserInfoModal
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onSubmit={handleModalSubmit}
          initialValues={info}
        />
      )}
      {isPasswordModalVisible && (
        <ChangePasswordModal
          visible={isPasswordModalVisible}
          onCancel={() => setIsPasswordModalVisible(false)}
          onSubmit={handlePasswordSubmit}
        />
      )}
    </Layout>
  );
};

export default MyLayoutPage;
