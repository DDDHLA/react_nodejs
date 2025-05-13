import React, { useEffect, useState } from "react";
import * as echarts from "echarts";
import { Row, Col } from "antd";
import { FullscreenOutlined, FullscreenExitOutlined } from "@ant-design/icons";
import styles from "./index.module.less";
import HeaderPanel from "./components/HeaderPanel";
import StatisticCard from "./components/StatisticCard";
import LineChartPanel from "./components/LineChartPanel";
import PieChartPanel from "./components/PieChartPanel";
import MapChartPanel from "./components/MapChartPanel";
import BarChartPanel from "./components/BarChartPanel";
import RadarChart from "./components/RadarChart";
import HeatmapChart from "./components/HeatmapChart";
import SankeyChart from "./components/SankeyChart";
import GaugeChart from "./components/GaugeChart";

const DataScreen = () => {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    // 监听全屏变化事件
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
    };
  }, []);

  // 处理全屏状态变化
  const handleFullscreenChange = () => {
    setIsFullscreen(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
  };

  // 切换全屏状态
  const toggleFullscreen = () => {
    // 获取要全屏显示的元素（这里使用整个组件的容器元素）
    const element = document.getElementById("dataScreenContainer");

    if (!isFullscreen) {
      // 进入全屏模式
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
    } else {
      // 退出全屏模式
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  return (
    <div
      id="dataScreenContainer"
      className={
        isFullscreen ? styles.fullscreenContainer : styles.screenContainer
      }
    >
      <div className={styles.fullscreenButton} onClick={toggleFullscreen}>
        {isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
      </div>
      <HeaderPanel title="企业运营数据大屏" />
      <div className={styles.contentWrapper}>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <StatisticCard
              title="今日销售额"
              value="¥126,560"
              prefix="￥"
              increase={15}
              color="#1890ff"
            />
          </Col>
          <Col span={6}>
            <StatisticCard
              title="今日订单量"
              value="1,234"
              increase={8}
              color="#52c41a"
            />
          </Col>
          <Col span={6}>
            <StatisticCard
              title="本月销售额"
              value="¥3,256,840"
              prefix="￥"
              increase={12}
              color="#faad14"
            />
          </Col>
          <Col span={6}>
            <StatisticCard
              title="活跃用户数"
              value="8,846"
              increase={-3}
              color="#ff4d4f"
            />
          </Col>
        </Row>

        <Row gutter={[16, 16]} className={styles.chartsRow}>
          <Col span={12}>
            <LineChartPanel />
          </Col>
          <Col span={12}>
            <BarChartPanel />
          </Col>
        </Row>

        <Row gutter={[16, 16]} className={styles.chartsRow}>
          <Col span={12}>
            <PieChartPanel />
          </Col>
          <Col span={12}>
            <MapChartPanel />
          </Col>
        </Row>

        <Row gutter={[16, 16]} className={styles.chartsRow}>
          <Col span={12}>
            <RadarChart />
          </Col>
          <Col span={12}>
            <GaugeChart />
          </Col>
        </Row>

        <Row gutter={[16, 16]} className={styles.chartsRow}>
          <Col span={24}>
            <SankeyChart />
          </Col>
        </Row>

        <Row gutter={[16, 16]} className={styles.chartsRow}>
          <Col span={24}>
            <HeatmapChart />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default DataScreen;
