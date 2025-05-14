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
const MyOpenLayersFirst = lazy(() => import("../pages/MyOpenLayers/First"));
const MyOpenLayersSecond = lazy(() => import("../pages/MyOpenLayers/Second"));
const MyOpenLayersThird = lazy(() => import("../pages/MyOpenLayers/Third"));
const Ways = lazy(() => import("../pages/MyOpenLayers/Ways"));
const Canva = lazy(() => import("../pages/Canva"));
const Video = lazy(() => import("../pages/Video"));
const Echarts = lazy(() => import("../pages/Echarts"));
const DataScreen = lazy(() => import("../pages/DataScreen"));
const GovernmentDataScreen = lazy(() => import("../pages/GovernmentDataScreen"));
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
      {
        path: "/openlayers",
        label: "openlayers",
        icon: <NotificationOutlined />,
        children: [
          {
            path: "first", // 这里必须是相对路径
            label: "first",
            icon: <NotificationOutlined />,
            element: lazyLoad(MyOpenLayersFirst),
          },
          {
            path: "second",
            label: "second",
            icon: <NotificationOutlined />,
            element: lazyLoad(MyOpenLayersSecond),
          },
          {
            path: "third",
            label: "third",
            icon: <NotificationOutlined />,
            element: lazyLoad(MyOpenLayersThird),
          },
          {
            path: "ways",
            label: "ways",
            icon: <NotificationOutlined />,
            element: lazyLoad(Ways),
          },
        ],
      },
      {
        path: "/canva",
        label: "canva",
        icon: <NotificationOutlined />,
        element: lazyLoad(Canva),
      },
      {
        path: "/video",
        label: "video",
        icon: <NotificationOutlined />,
        element: lazyLoad(Video),
      },
      {
        path: "/echarts",
        label: "echarts",
        icon: <NotificationOutlined />,
        element: lazyLoad(Echarts),
      },
      {
        path: "/datascreen",
        label: "datascreen",
        icon: <NotificationOutlined />,
        element: lazyLoad(DataScreen),
      },
      {
        path: "/government-data-screen",
        label: "government-data-screen",
        icon: <NotificationOutlined />,
        element: lazyLoad(GovernmentDataScreen),
      },

    ],
  },
];

export default routes;
