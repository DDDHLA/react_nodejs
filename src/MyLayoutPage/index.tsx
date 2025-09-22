import { useEffect, useState, useRef } from "react";
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
// @ts-expect-error - 路由文件类型问题
import routes from "../router";
import CustomIcon from "../assets/react.svg";
import { getUserInfo, updateUserInfo, updatePassword, type UpdatePasswordParams } from "@/api/user";
// @ts-expect-error - JSX 组件类型声明
import UserInfoModal from "./components/userInfoModal";
// @ts-expect-error - JSX 组件类型声明
import ChangePasswordModal from "./components/ChangePasswordModal";
import SimpleTabsNav from "@/components/TabsNav/SimpleTabsNav";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { SeasonalThemeProvider } from "@/components/SeasonalTheme";
import SeasonSwitcher from "@/components/SeasonalTheme/SeasonSwitcher";
import ParticleEffect from "@/components/SeasonalTheme/ParticleEffect";

// 从Layout组件中解构出需要的子组件
const { Header, Content, Sider } = Layout;

// 定义用户信息接口
interface UserInfo {
  username?: string; // 用户名
  user_pic?: string; // 用户头像
  email?: string;    // 用户邮箱
  [key: string]: unknown; // 允许其他属性
}

// 定义路由项的接口
interface RouteItem {
  path: string;
  label?: string;
  icon?: React.ReactNode;
  element?: React.ReactNode;
  children?: RouteItem[];
  [key: string]: unknown;
}


// 递归函数：将路由配置转换为 Menu items
const mapRoutesToMenuItems = (
  routeList: RouteItem[],
  parentPath = ""
): MenuProps["items"] => {
  return routeList
    ?.filter((route: RouteItem) => route.label) // 只处理有label的路由（可在菜单中显示的路由）
    .map((route: RouteItem) => {
      // 构建完整路径
      const fullPath = route.path.startsWith("/")
        ? route.path  // 如果是以/开头，则为绝对路径
        : parentPath
        ? `${parentPath}/${route.path}` // 如果有父路径，则拼接
        : route.path; // 否则使用自身路径

      // 使用类型断言创建菜单项
      const menuItem = {
        key: fullPath,
        label: route.label,
        icon: route.icon,
        children: undefined as MenuProps["items"]
      };

      // 递归处理子路由
      if (route.children && route.children.length > 0) {
        menuItem.children = mapRoutesToMenuItems(route.children, fullPath);
      }
      return menuItem;
    });
};

const MyLayoutPage = () => {
  // 存储用户信息的状态
  const [info, setInfo] = useState<UserInfo>({});
  // 使用ref避免重复获取用户信息
  const hasFetched = useRef(false);

  // 控制用户信息和密码修改模态框的显示状态
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const navigate = useNavigate();

  // 获取用户信息的函数
  const getInfo = async () => {
    try {
      const res = await getUserInfo();
      if (res.status !== 0) return message.error(res.message);
      setInfo((res.data as unknown as UserInfo) || {});
    } catch (error) {
      console.log(error);
    }
  };

  // 组件挂载时获取用户信息（仅执行一次）
  useEffect(() => {
    if (!hasFetched.current) {
      getInfo();
      hasFetched.current = true;
    }
  }, []);

  // 处理用户信息更新提交
  const handleModalSubmit = async (values: UserInfo) => {
    setIsModalVisible(false);
    try {
      // 这里注释掉的代码是使用FormData的替代方案
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

  // 处理密码更新提交
  const handlePasswordSubmit = async (values: {oldPwd: string, newPwd: string, rePwd: string}) => {
    try {
      // 转换为 API 期望的格式
      const passwordData: UpdatePasswordParams = {
        oldPassword: values.oldPwd,
        newPassword: values.newPwd
      };
      const res = await updatePassword(passwordData);
      if (res.status !== 0) return message.error(res.message);
      setIsPasswordModalVisible(false);
      message.success(res.message);
    } catch (error) {
      console.log(error);
    }
  };

  // 用户头像下拉菜单配置
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <span>修改个人信息</span>,
      onClick: () => {
        // getInfo();
        setIsModalVisible(true); // 打开修改个人信息Modal
      },
    },
    {
      key: "2",
      label: <span>退出登录</span>,
      onClick: () => {
        // 清除登录token
        localStorage.removeItem("token");
        // 跳转到登录页
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

  // 使用主题相关的token
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const location = useLocation();

  // 动态生成面包屑
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
          title: snippet,
          path: url,
        };
      }),
  ].map((item) => ({
    title: item.title,
  }));

  // 动态生成侧边栏菜单项 - 使用递归函数
  const siderMenuItems: MenuProps["items"] = mapRoutesToMenuItems(
    (routes.find((route: RouteItem) => route.path === "/")?.children as RouteItem[]) || []
  );

  return (
    <SeasonalThemeProvider>
      <ParticleEffect />
      <Layout style={{ height: "100vh" }}>
      {/* 顶部导航栏 */}
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#fff",
          justifyContent: "space-between",
        }}
      >
        {/* 左侧Logo */}
        <img src={CustomIcon} alt="Custom Icon" style={{ height: 40 }} />
        
        {/* 右侧用户信息 */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* 季节主题切换器 */}
          <SeasonSwitcher />
          {/* 主题切换器 */}
          <ThemeSwitcher />
          
          {/* 用户头像 - 如果有图片则显示图片，否则显示用户名首字母 */}
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
          {/* 用户名下拉菜单 */}
          <Dropdown menu={{ items }} placement="bottom">
            <Button>{info.username}</Button>
          </Dropdown>
        </div>
      </Header>
      
      <Layout>
        {/* 左侧菜单栏 */}
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
              // 以下注释代码是检查菜单项是否有子菜单的逻辑，目前未使用
              // const hasChildren = siderMenuItems.some(
              //   (item) =>
              //     item.key === key && item.children && item.children.length > 0
              // );

              // // 只有当点击的不是有子菜单的项时才导航
              // if (!hasChildren) {
              //   navigate(key);
              // }
            }}
          />
        </Sider>
        
        {/* 右侧内容区 */}
        <Layout style={{ padding: "0 16px 16px" }}> {/* 减少左右和底部padding */}
          {/* 面包屑和标签页导航行 */}
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "12px", // 减少间距
            margin: "12px 0 6px 0", // 减少上下边距
            minHeight: "28px" // 减少最小高度
          }}>
            {/* 面包屑导航 - 固定 */}
            <Breadcrumb items={breadcrumbItems} style={{ flexShrink: 0 }} />
            
            {/* 标签页导航 - 可滚动 */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <SimpleTabsNav routes={routes[0]?.children || []} />
            </div>
          </div>
          
          {/* 主内容区 */}
          <Content
            style={{
              padding: 16, // 减少内边距从24px到16px
              margin: 0,
              minHeight: "auto",
              height: "calc(100vh - 140px)", // 增加高度，减少顶部预留空间
              overflowY: "auto", // 允许垂直滚动
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
      
      {/* 修改个人信息的模态框 */}
      {isModalVisible && (
        <UserInfoModal
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onSubmit={handleModalSubmit}
          initialValues={info}
        />
      )}
      
      {/* 修改密码的模态框 */}
      {isPasswordModalVisible && (
        <ChangePasswordModal
          visible={isPasswordModalVisible}
          onCancel={() => setIsPasswordModalVisible(false)}
          onSubmit={handlePasswordSubmit}
        />
      )}
    </Layout>
    </SeasonalThemeProvider>
  );
};

export default MyLayoutPage;
