import React, { useState, useEffect, useRef } from "react";
import { Form, Upload, Button, Input, message, Card, Row, Col } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import * as echarts from 'echarts';

const VideoUploadForm = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const chartRef = useRef(null);
  const barChartRef = useRef(null);
  const chartInstance = useRef(null);
  const barChartInstance = useRef(null);

  // 初始化和销毁图表
  useEffect(() => {
    // 初始化图表
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);
      renderChart();
    }

    if (barChartRef.current) {
      barChartInstance.current = echarts.init(barChartRef.current);
      renderBarChart();
    }

    // 组件卸载时销毁图表
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
      if (barChartInstance.current) {
        barChartInstance.current.dispose();
      }
    };
  }, []);

  // 窗口大小调整时重新调整图表大小
  useEffect(() => {
    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.resize();
      }
      if (barChartInstance.current) {
        barChartInstance.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 渲染平行坐标图
  const renderChart = () => {
    const option = {
      parallelAxis: [
        { dim: 0, name: 'Price', min: 0, max: 20, nameLocation: 'start' },
        { dim: 1, name: 'Net Weight', min: 0, max: 120, nameLocation: 'start' },
        { dim: 2, name: 'Amount', min: 0, max: 100, nameLocation: 'start' },
        {
          dim: 3,
          name: 'Score',
          nameLocation: 'start',
          type: 'category',
          data: ['Excellent', 'Good', 'OK', 'Bad']
        }
      ],
      parallel: {
        left: '5%',
        right: '5%',
        bottom: '10%',
        top: '20%'
      },
      series: [
        {
          type: 'parallel',
          lineStyle: {
            width: 2,
            opacity: 0.5,
            color: '#91b6fd'
          },
          data: [
            [12, 120, 80, 'Bad'],  // 对应第一条线
            [15, 100, 80, 'OK'],   // 对应第二条线
            [10, 60, 60, 'Good'],  // 对应第三条线
            [13, 80, 40, 'Excellent']  // 对应第四条线
          ]
        }
      ]
    };

    chartInstance.current.setOption(option);
  };

  // 渲染横向柱状图
  const renderBarChart = () => {
    const data = [
      { name: 'Matcha Latte', value: 60000, category: 'high' },
      { name: 'Milk Tea', value: 75000, category: 'medium' },
      { name: 'Cheese Cocoa', value: 40000, category: 'medium' },
      { name: 'Cheese Brownie', value: 12000, category: 'low' },
      { name: 'Matcha Cocoa', value: 20000, category: 'high' },
      { name: 'Tea', value: 70000, category: 'medium' },
      { name: 'Orange Juice', value: 85000, category: 'low' },
      { name: 'Lemon Juice', value: 95000, category: 'low' },
      { name: 'Walnut Brownie', value: 18000, category: 'low' }
    ];

    const option = {
      title: {
        text: '产品销售量分析',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: 'amount',
        axisLabel: {
          formatter: '{value}'
        }
      },
      yAxis: {
        type: 'category',
        data: data.map(item => item.name)
      },
      visualMap: {
        orient: 'horizontal',
        left: 'center',
        bottom: '0',
        min: 0,
        max: 100000,
        text: ['High Score', 'Low Score'],
        dimension: 0,
        inRange: {
          color: ['#91cc75', '#fac858', '#ee6666']
        }
      },
      series: [
        {
          name: '销售量',
          type: 'bar',
          data: data.map(item => item.value),
          emphasis: {
            focus: 'series'
          }
        }
      ]
    };

    barChartInstance.current.setOption(option);
  };

  // 上传前校验文件大小
  const beforeUpload = (file) => {
    const isLt20M = file.size / 1024 / 1024 < 20;
    if (!isLt20M) {
      message.error("视频文件大小不能超过20MB!");
      // 阻止上传，
      return Upload.LIST_IGNORE; // 阻止加入到上传列表
    }
    return false; // 阻止自动上传，但允许加入fileList
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    // 同步更新到表单字段
    form.setFieldsValue({
      video: newFileList.length > 0 ? { fileList: newFileList } : null,
    });
    form.validateFields(["video"]);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      console.log("表单验证通过，提交数据:", values);
      console.log("准备上传的文件:", fileList);
    });
  };

  return (
    <div style={{
      padding: "20px",
      height: "100%",
      overflow: "auto",
      position: "relative",
      boxSizing: "border-box"
    }}>
      <Card title="视频上传" style={{ marginBottom: "20px", flex: "0 0 auto" }}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="video"
            label="上传视频"
            rules={[{ required: true, message: "请上传视频文件!" }]}
          >
            <Upload
              name="video"
              accept="video/*"
              beforeUpload={beforeUpload}
              onChange={handleUploadChange}
              fileList={fileList}
              listType="text"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>点击上传视频</Button>
            </Upload>
          </Form.Item>

          <Form.Item name="title" label="视频标题">
            <Input placeholder="请输入视频标题" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <div style={{ marginBottom: "20px" }}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card title="平行坐标分析" style={{ marginBottom: "20px" }}>
              <div
                ref={chartRef}
                style={{ width: '100%', height: '400px' }}
              />
            </Card>
          </Col>
          <Col span={24}>
            <Card title="销售量横向柱状图" style={{ marginBottom: "20px" }}>
              <div
                ref={barChartRef}
                style={{ width: '100%', height: '550px' }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default VideoUploadForm;
