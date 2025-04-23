import { Navigate } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from "@ant-design/icons"; // 引入图标
import AuthRoute from "@/components/AuthRoute";
const Login = lazy(() => import("@/pages/Login"));
const MyLayoutPage = lazy(() => import("../MyLayoutPage"));
const Home = lazy(() => import("@/pages/Home"));
const Article = lazy(() => import("../pages/Article"));
const Publish = lazy(() => import("../pages/Publish"));
const Register = lazy(() => import("../pages/Register"));
const Mapbox = lazy(() => import("../pages/Mapbox"));
const Rodar = lazy(() => import("../pages/Rodar"));
const Relation = lazy(() => import("../pages/Relation"));
const Info = lazy(() => import("../pages/Info"));

const lazyLoad = (Component) => (
  <Suspense fallback={<div>页面加载中...</div>}>
    <Component />
  </Suspense>
);

const routes = [
  {
    path: "/login",
    element: <AuthRoute>{lazyLoad(Login)}</AuthRoute>,
  },
  {
    path: "/register",
    element: lazyLoad(Register),
  },
  {
    path: "/",
    element: lazyLoad(MyLayoutPage),
    children: [
      {
        path: "",
        element: <Navigate to="/home" />,
      },
      {
        path: "/home",
        element: lazyLoad(Home),
        icon: <UserOutlined />, // 添加图标
        label: "流式数据", // 添加标签
      },
      {
        path: "/article",
        element: lazyLoad(Article),
        icon: <LaptopOutlined />, // 添加图标
        label: "文章管理", // 添加标签
      },
      {
        path: "/publish",
        element: lazyLoad(Publish),
        icon: <NotificationOutlined />, // 添加图标
        label: "websocket", // 添加标签
      },
      {
        path: "/mapbox",
        element: lazyLoad(Mapbox),
        icon: <NotificationOutlined />, // 添加图标
        label: "mapbox", // 添加标签
      },
      {
        path: "/rodar",
        element: lazyLoad(Rodar),
        icon: <NotificationOutlined />, // 添加图标
        label: "雷达", // 添加标签
      },
      {
        path: "/relation",
        element: lazyLoad(Relation),
        icon: <NotificationOutlined />, // 添加图标
        label: "关系", // 添加标签
      },
      {
        path: "/info",
        element: lazyLoad(Info),
        icon: <NotificationOutlined />, // 添加图标
        label: "信息发送测试", // 添加标签
      },
    ],
  },
];

export default routes;
