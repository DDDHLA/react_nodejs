import { Navigate, useLocation } from "react-router-dom";
const AuthRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  // 如果是登录页面且有token，重定向到首页
  if (location.pathname === "/login" && token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AuthRoute;
