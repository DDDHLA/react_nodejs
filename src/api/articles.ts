import request from "../utils/request";

// 定义通用响应接口
interface ApiResponse<T = unknown> {
  status: number;
  message: string;
  data?: T;
  total?: number;
}

// 定义文章类型数据接口
export interface ArticleItem {
  id: string | number;
  name: string;
  alias: string;
}

// 获取文章分类列表
export const getArticlesType = (data: {
  pageNo: number;
  pageSize: number;
  articleType: string;
  alias: string;
}): Promise<ApiResponse<ArticleItem[]>> => {
  return request<ApiResponse<ArticleItem[]>>({
    url: "/my/articles/cates",
    method: "POST",
    data,
  });
};

// 删除文章分类
export const deleteArticlesType = (id: string | number): Promise<ApiResponse> => {
  return request<ApiResponse>({
    url: `/my/articles/delcate`,
    method: "POST",
    data: {
      id,
    },
  });
};

// 新增文章分类
export const addArticlesType = (data: FormData | { articleType: string; alias: string }): Promise<ApiResponse> => {
  console.log(data);
  return request<ApiResponse>({
    url: `/my/articles/addcate`,
    method: "POST",
    // headers: {
    //   "Content-Type": "multipart/form-data", // This is important when using FormData
    // },
    data,
  });
};


// 下载
export const download = (id: string | number): Promise<Blob> => {
  return request({
    url: `/my/articles/download`,
    method: "POST",
    data: {
      id,
    },
    responseType: "blob",
  });
};
