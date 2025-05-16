import { useState, useEffect } from "react";
import { Form, Input, Button, Table, Space, message, Modal } from "antd";
import {
  getArticlesType,
  deleteArticlesType,
  addArticlesType,
  download,
} from "@/api/articles";
import AddItem from "./components/addItem"; // 添加导入语句
import styles from "./index.module.less";
import { saveAs } from "file-saver";
const Article: React.FC = () => {
  const [total, setTotal] = useState(0);
  const [querySearch, setQuerySearch] = useState({
    pageNo: 1,
    pageSize: 5,
    articleType: "",
    alias: "",
  });
  const getArticlesList = async () => {
    const res = await getArticlesType(querySearch);
    console.log(res);
    setDataSource(res.data);
    setTotal(res.total);
  };
  useEffect(() => {
    getArticlesList();
  }, [querySearch]);
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  interface Values {
    articleType: string;
    alias: string;
  }
  const onFinsh = (values: Values): void => {
    setQuerySearch({ ...querySearch, ...values });
  };
  const handleDelete = async (id: string): Promise<void> => {
    Modal.confirm({
      title: "确认删除",
      content: "您确定要删除这篇文章吗？",
      onOk: async () => {
        try {
          const res = await deleteArticlesType(id);
          if (res.status === 0) {
            message.success(res.message);
            getArticlesList();
            return;
          }
          message.error(res.message);
        } catch (error) {
          console.log("delete error", error);
        }
      },
    });
  };

  // 重置
  const handleReset = (): void => {
    form.resetFields();
    setQuerySearch({
      pageNo: 1,
      pageSize: 5,
      articleType: "",
      alias: "",
    });
  };

  const handleDownload = async (id: string): Promise<void> => {
    try {
      const res = await download(id);
      const fileType = res.type.split("/")[1]; // 从MIME类型获取文件后缀
      saveAs(res, `file.${fileType}`); // 动态拼接文件后缀
    } catch (error) {
      message.error("下载失败");
      console.error("下载错误:", error);
    }
  };
  const columns = [
    {
      title: "序号",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "别名",
      dataIndex: "alias",
      key: "alias",
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleDownload(record.id)}>
            下载
          </Button>
          <Button type="link" onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const addItem = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };
  const [selectList, setSelectList] = useState([]);
  const handleRowSelectionChange = (selectedRowKeys, selectedRows) => {
    console.log(selectedRowKeys, selectedRows);
    setSelectList(selectedRowKeys);
  };

  const handleModalSubmit = async (values) => {
    console.log(values);
    try {
      const formData = new FormData();
      formData.append("alias", values.alias);
      formData.append("name", values.name);
      formData.append("file", values.file.file);
      const res = await addArticlesType(formData);
      console.log(res);
      if (res.status === 0) {
        message.success(res.message);
        getArticlesList();
        setIsModalVisible(false);
        return;
      }
      message.error(res.message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.container}>
      <div>
        <Button type="primary" onClick={addItem}>
          新增
        </Button>
      </div>
      <Form
        form={form}
        layout="inline"
        style={{ marginBottom: 16 }}
        onFinish={onFinsh}
      >
        <Form.Item label="文章分类" name="articleType">
          <Input placeholder="请输入文章分类" allowClear />
        </Form.Item>
        <Form.Item label="文章别名" name="alias">
          <Input placeholder="请输入文章别名" allowClear />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              筛选
            </Button>
            <Button type="primary" onClick={handleReset}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <Table
        rowKey="id"
        rowSelection={{
          type: "checkbox",
          onChange: handleRowSelectionChange,
          selectedRowKeys: selectList,
          preserveSelectedRowKeys: true,
        }}
        dataSource={dataSource}
        columns={columns}
        pagination={{
          total: total,
          current: querySearch.pageNo,
          pageSize: querySearch.pageSize,
          showTotal: (total) => `共 ${total} 条`,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ["5", "10", "20"],
          onChange: (page, pageSize) => {
            setQuerySearch({ ...querySearch, pageNo: page, pageSize });
          },
        }}
      />
      {isModalVisible && (
        <AddItem
          visible={isModalVisible}
          onCancel={handleModalCancel}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
};

export default Article;
