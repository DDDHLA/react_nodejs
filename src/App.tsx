import { useState, useMemo } from "react";
import "./App.css";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import enUS from "antd/locale/en_US";
import { useRoutes } from "react-router-dom"; // 确保使用 useRoutes
import routes from "./router/index.jsx"; // 引入路由配置
import SSEHandler from "./SSEHandler";
import { useThemeStore } from "./store/themeStore";
import { generateAntdTheme } from "./config/theme";

function App() {
  // 新的主题系统
  const { themeConfig } = useThemeStore();
  const antdTheme = useMemo(() => generateAntdTheme(themeConfig), [themeConfig]);

  // language
  const language = import.meta.env.VITE_LANGUAGE;
  const [currentLanguage] = useState(language);
  function getLanguage(lang: string) {
    if (lang === "CN") {
      return zhCN;
    }
    if (lang === "US") {
      return enUS;
    }
    return zhCN;
  }

  const element = useRoutes(routes); // 使用 useRoutes 渲染路由

  return (
    <ConfigProvider locale={getLanguage(currentLanguage)} theme={antdTheme}>
      <SSEHandler />
      {element}
    </ConfigProvider>
  );
}

export default App;
