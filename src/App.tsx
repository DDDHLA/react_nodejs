import { useState } from "react";
import "./App.css";
import { ConfigProvider } from "antd";
import { themes } from "./config/themeConfig.js";
import zhCN from "antd/locale/zh_CN";
import enUS from "antd/locale/en_US";
import { useRoutes } from "react-router-dom"; // 确保使用 useRoutes
import routes from "./router/index.jsx"; // 引入路由配置

function App() {
  // theme
  function getDefaultTheme() {
    const theme = import.meta.env.VITE_THEME;
    if (theme === "red") return themes.redTheme;
    if (theme === "green") return themes.greenTheme;
    return themes.greenTheme;
  }
  const defaultTheme = getDefaultTheme();
  const [currentTheme, setCurrentTheme] = useState(defaultTheme);

  // language
  const language = import.meta.env.VITE_LANGUAGE;
  const [currentLanguage, setCurrentLanguage] = useState(language);
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
    <ConfigProvider
      locale={getLanguage(currentLanguage)}
      theme={currentTheme}
    >
      {element}
    </ConfigProvider>
  );
}

export default App;
