// 路由项的接口定义
export interface RouteItem {
  path: string;
  label?: string;
  icon?: React.ReactNode;
  element?: React.ReactNode;
  children?: RouteItem[];
   
  [key: string]: any;
}

// 标签项的接口定义
export interface TabItem {
  key: string;
  label: string;
  path: string;
  closable?: boolean;
  cached?: boolean;
  loading?: boolean;
}

// 缓存组件的接口定义
export interface CachedComponent {
  component: React.ReactNode;
  timestamp: number;
}

// 组件Props的接口定义
export interface TabsNavProps {
  routes: RouteItem[];
}
