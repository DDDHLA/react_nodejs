import { Navigate } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  PlayCircleOutlined,
  NotificationOutlined,
  CrownOutlined,
  NodeIndexOutlined,
  LaptopOutlined,
  BulbOutlined,
  MessageOutlined,
  EditOutlined,
  ScanOutlined,
  AudioOutlined,
  PictureOutlined,
  FunctionOutlined,
  // 新增的图标
  DatabaseOutlined,
  FileTextOutlined,
  SendOutlined,
  GlobalOutlined,
  RadarChartOutlined,
  ShareAltOutlined,
  InfoCircleOutlined,
  EnvironmentOutlined,
  CompassOutlined,
  BarChartOutlined,
  DashboardOutlined,
  MonitorOutlined,
  ThunderboltOutlined,
  DragOutlined,
  ExperimentOutlined,
  CameraOutlined,
  AppstoreOutlined,
  CalculatorOutlined,
  TrophyOutlined,
  BorderOutlined,
  BoxPlotOutlined,
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
const GovernmentDataScreen = lazy(() =>
  import("../pages/GovernmentDataScreen")
);
const FlowCanvasPage = lazy(() => import("../FlowCanvas"));
const Animation = lazy(() => import("../pages/Animation"));
const GomokuGame = lazy(() => import("../pages/Game/Gomoku/GamePage"));
const ChessGame = lazy(() => import("../pages/Game/Chess/GamePage"));
const DragDemo = lazy(() => import("../pages/DragDemo"));
const SeasonalDemo = lazy(() => import("../pages/SeasonalDemo"));
const QuantumEntanglement = lazy(() => import("../pages/QuantumEntanglement"));
const LiquidGlass = lazy(() => import("../pages/LiquidGlass"));
const LightGlass = lazy(() => import("../pages/LightGlass"));
const ChatBox = lazy(() => import("../pages/ChatBox"));
const TypingTest = lazy(() => import("../pages/TypingTest"));
const TextRecognition = lazy(() => import("../pages/TextRecognition"));
const AudioVisualizer = lazy(() => import("../pages/AudioVisualizer"));
const PixelArtEditor = lazy(() => import("../pages/PixelArtEditor"));
const MathPlotter = lazy(() => import("../pages/MathPlotter"));
const ThreeDDemo = lazy(() => import("../pages/ThreeDDemo"));
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
        icon: <DatabaseOutlined />, // 流式数据图标
        label: "流式数据", // 添加标签
      },
      {
        path: "/article",
        element: lazyLoad(Article),
        icon: <FileTextOutlined />, // 文章管理图标
        label: "文章管理", // 添加标签
      },
      {
        path: "/publish",
        element: lazyLoad(Publish),
        icon: <SendOutlined />, // WebSocket通信图标
        label: "websocket", // 添加标签
      },
      {
        path: "/mapbox",
        element: lazyLoad(Mapbox),
        icon: <GlobalOutlined />, // 地图服务图标
        label: "mapbox", // 添加标签
      },
      {
        path: "/rodar",
        element: lazyLoad(Rodar),
        icon: <RadarChartOutlined />, // 雷达图标
        label: "雷达", // 添加标签
      },
      {
        path: "/relation",
        element: lazyLoad(Relation),
        icon: <ShareAltOutlined />, // 关系图标
        label: "关系", // 添加标签
      },
      {
        path: "/info",
        element: lazyLoad(Info),
        icon: <InfoCircleOutlined />, // 信息测试图标
        label: "信息发送测试", // 添加标签
      },
      {
        path: "/openlayers",
        label: "openlayers",
        icon: <EnvironmentOutlined />,
        children: [
          {
            path: "first", // 这里必须是相对路径
            label: "first",
            icon: <FileOutlined />,
            element: lazyLoad(MyOpenLayersFirst),
          },
          {
            path: "second",
            label: "second",
            icon: <CompassOutlined />,
            element: lazyLoad(MyOpenLayersSecond),
          },
          {
            path: "third",
            label: "third",
            icon: <EnvironmentOutlined />,
            element: lazyLoad(MyOpenLayersThird),
          },
          {
            path: "ways",
            label: "ways",
            icon: <NodeIndexOutlined />,
            element: lazyLoad(Ways),
          },
        ],
      },
      {
        path: "/canva",
        label: "canva",
        icon: <PictureOutlined />,
        element: lazyLoad(Canva),
      },
      {
        path: "/video",
        label: "video",
        icon: <VideoCameraOutlined />,
        element: lazyLoad(Video),
      },
      {
        path: "/echarts",
        label: "echarts",
        icon: <BarChartOutlined />,
        element: lazyLoad(Echarts),
      },
      {
        path: "/datascreen",
        label: "datascreen",
        icon: <DashboardOutlined />,
        element: lazyLoad(DataScreen),
      },
      {
        path: "/government-data-screen",
        label: "government-data-screen",
        icon: <MonitorOutlined />,
        element: lazyLoad(GovernmentDataScreen),
      },
      {
        path: "/flow-canvas",
        label: "流程图画布",
        icon: <NodeIndexOutlined />,
        element: lazyLoad(FlowCanvasPage),
      },
      {
        path: "/animation",
        label: "动画",
        icon: <ThunderboltOutlined />,
        element: lazyLoad(Animation),
      },
      {
        path: "/drag-demo",
        label: "拖拽组件演示",
        icon: <DragOutlined />,
        element: lazyLoad(DragDemo),
      },
      {
        path: "/seasonal-demo",
        label: "季节主题演示",
        icon: <CrownOutlined />,
        element: lazyLoad(SeasonalDemo),
      },
      {
        path: "/quantum-entanglement",
        label: "量子纠缠实验室",
        icon: <ExperimentOutlined />,
        element: lazyLoad(QuantumEntanglement),
      },
      {
        path: "/liquid-glass",
        label: "液态玻璃实验室",
        icon: <DesktopOutlined />,
        element: lazyLoad(LiquidGlass),
      },
      {
        path: "/light-glass",
        label: "光影玻璃实验室",
        icon: <BulbOutlined />,
        element: lazyLoad(LightGlass),
      },
      {
        path: "/chatbox",
        label: "对话框",
        icon: <MessageOutlined />,
        element: lazyLoad(ChatBox),
      },
      {
        path: "/typing-test",
        label: "打字速度测试",
        icon: <EditOutlined />,
        element: lazyLoad(TypingTest),
      },
      {
        path: "/text-recognition",
        label: "文字识别",
        icon: <CameraOutlined />,
        element: lazyLoad(TextRecognition),
      },
      {
        path: "/audio-visualizer",
        label: "音频可视化器",
        icon: <AudioOutlined />,
        element: lazyLoad(AudioVisualizer),
      },
      {
        path: "/pixel-art-editor",
        label: "像素画编辑器",
        icon: <AppstoreOutlined />,
        element: lazyLoad(PixelArtEditor),
      },
      {
        path: "/math-plotter",
        label: "数学函数绘图器",
        icon: <CalculatorOutlined />,
        element: lazyLoad(MathPlotter),
      },
      {
        path: "/3d-demo",
        label: "3D效果演示",
        icon: <BoxPlotOutlined />,
        element: lazyLoad(ThreeDDemo),
      },
      {
        path: "/game",
        label: "游戏中心",
        icon: <PlayCircleOutlined />,
        children: [
          {
            path: "gomoku",
            label: "五子棋",
            icon: <BorderOutlined />,
            element: lazyLoad(GomokuGame),
          },
          {
            path: "chinese-chess",
            label: "中国象棋",
            icon: <TrophyOutlined />,
            element: lazyLoad(ChessGame),
          },
          {
            path: "",
            element: <Navigate to="/game/gomoku" replace />,
          },
        ],
      },
    ],
  },
];

export default routes;
