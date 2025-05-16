import { useEffect, useState } from "react";
import { Row, Col } from "antd";
import { FullscreenOutlined, FullscreenExitOutlined } from "@ant-design/icons";
import {
  BorderBox1,
  BorderBox2,
  BorderBox3,
  BorderBox4,
  BorderBox8,
  BorderBox9,
  BorderBox10,
} from "@jiaminghi/data-view-react";
import styles from "./index.module.less";

// 导入各个子组件
import HeaderTitle from "./components/HeaderTitle";
import NumberStatistic from "./components/NumberStatistic";
import CircleChart from "./components/CircleChart";
import PieChart from "./components/PieChart";
import RadarChart from "./components/RadarChart";
import BarChart from "./components/BarChart";
import DataTable from "./components/DataTable";

const GovernmentDataScreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // 监听全屏变化事件
    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement
      );
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
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

  // 切换全屏状态
  const toggleFullscreen = () => {
    const element = document.getElementById("governmentScreenContainer");

    if (!isFullscreen) {
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
      id="governmentScreenContainer"
      className={
        isFullscreen ? styles.fullscreenContainer : styles.screenContainer
      }
    >
      <div className={styles.fullscreenButton} onClick={toggleFullscreen}>
        {isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
      </div>

      {/* 头部标题 */}
      <div className={styles.header}>
        <div className={styles.leftNav}>
          <BorderBox3 className={styles.navItem}>
            <span>WEB网站</span>
          </BorderBox3>
        </div>
        <HeaderTitle title="政务服务大数据可视化监管平台" />
        <div className={styles.rightNav}>
          <BorderBox3 className={styles.navItem}>
            <span>管理系统</span>
          </BorderBox3>
        </div>
      </div>

      {/* 内容区域 */}
      <div className={styles.contentWrapper}>
        {/* 顶部数据概览 */}
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <BorderBox1 className={styles.dataOverviewLeft}>
              <div className={styles.overviewTitle}>公开数据概览</div>
              <div className={styles.cardGroup}>
                <div className={styles.dataCard}>
                  <div className={styles.value}>134</div>
                  <div className={styles.label}>事务公开</div>
                </div>
                <div className={styles.dataCard}>
                  <div className={styles.value}>268</div>
                  <div className={styles.label}>政务公开</div>
                </div>
                <div className={styles.dataCard}>
                  <div className={styles.value}>234</div>
                  <div className={styles.label}>财政公开</div>
                </div>
                <div className={styles.dataCard}>
                  <div className={styles.value}>243</div>
                  <div className={styles.label}>财政公开</div>
                </div>
                <div className={styles.dataCard}>
                  <div className={styles.value}>123</div>
                  <div className={styles.label}>规划公开</div>
                </div>
                <div className={styles.dataCard}>
                  <div className={styles.value}>0</div>
                  <div className={styles.label}>总公开</div>
                </div>
                <div className={styles.dataCard}>
                  <div className={styles.value}>0</div>
                  <div className={styles.label}>文档公开</div>
                </div>
              </div>
            </BorderBox1>
          </Col>

          <Col span={12}>
            <div className={styles.centerContent}>
              <BorderBox8 className={styles.totalNumbers}>
                <div className={styles.numberTitle}>案件公开数量</div>
                <div className={styles.numberRow}>
                  <NumberStatistic value="6" />
                  <NumberStatistic value="6" />
                  <NumberStatistic value="6" />
                  <NumberStatistic value="6" />
                  <NumberStatistic value="6" />
                </div>
              </BorderBox8>

              <Row gutter={[16, 16]} className={styles.chartsRow}>
                <Col span={12}>
                  <BorderBox4 className={styles.chartBox}>
                    <div className={styles.chartTitle}>XX公开数量占比</div>
                    <CircleChart
                      data={[
                        { name: "类目1", value: 25 },
                        { name: "类目2", value: 20 },
                        { name: "类目3", value: 18 },
                        { name: "类目4", value: 15 },
                        { name: "类目5", value: 22 },
                      ]}
                    />
                  </BorderBox4>
                </Col>
                <Col span={12}>
                  <BorderBox4 className={styles.chartBox}>
                    <div className={styles.chartTitle}>XX公开数量占比</div>
                    <CircleChart
                      data={[
                        { name: "类目1", value: 30 },
                        { name: "类目2", value: 25 },
                        { name: "类目3", value: 15 },
                        { name: "类目4", value: 10 },
                        { name: "类目5", value: 20 },
                      ]}
                      type="circle"
                    />
                  </BorderBox4>
                </Col>
              </Row>
            </div>
          </Col>

          <Col span={6}>
            <BorderBox2 className={styles.dataOverviewRight}>
              <div className={styles.overviewTitle}>XX数据概览</div>
              <div className={styles.cardGroup}>
                <div className={styles.dataCard}>
                  <div className={styles.value}>203</div>
                  <div className={styles.label}>类目公开</div>
                </div>
                <div className={styles.dataCard}>
                  <div className={styles.value}>1367</div>
                  <div className={styles.label}>类别公开</div>
                </div>
                <div className={styles.dataCard}>
                  <div className={styles.value}>608</div>
                  <div className={styles.label}>分类公开</div>
                </div>
                <div className={styles.dataCard}>
                  <div className={styles.value}>655</div>
                  <div className={styles.label}>功能调用</div>
                </div>
                <div className={styles.dataCard}>
                  <div className={styles.value}>134</div>
                  <div className={styles.label}>标准制定</div>
                </div>
              </div>
            </BorderBox2>
          </Col>
        </Row>

        {/* 中部图表区域 */}
        <Row gutter={[16, 16]} className={styles.middleRow}>
          <Col span={6}>
            <BorderBox2 className={styles.leftChart}>
              <div className={styles.chartTitle}>XX信息项流程数据概览</div>
              <BarChart
                horizontal={true}
                data={[
                  { name: "类目1", value: 200 },
                  { name: "类目2", value: 300 },
                  { name: "类目3", value: 400 },
                  { name: "类目4", value: 250 },
                  { name: "类目5", value: 320 },
                ]}
              />
            </BorderBox2>
          </Col>

          <Col span={6}>
            <BorderBox3 className={styles.pieChart}>
              <div className={styles.chartTitle}>XXXX数据占比</div>
              <PieChart
                data={[
                  { name: "类目1", value: 28 },
                  { name: "类目2", value: 22 },
                  { name: "类目3", value: 18 },
                  { name: "类目4", value: 15 },
                  { name: "类目5", value: 17 },
                ]}
              />
            </BorderBox3>
          </Col>

          <Col span={6}>
            <BorderBox3 className={styles.pieChart}>
              <div className={styles.chartTitle}>XXXX按来源占比</div>
              <PieChart
                data={[
                  { name: "类目1", value: 25 },
                  { name: "类目2", value: 20 },
                  { name: "类目3", value: 15 },
                  { name: "类目4", value: 25 },
                  { name: "类目5", value: 15 },
                ]}
              />
            </BorderBox3>
          </Col>

          <Col span={6}>
            <BorderBox2 className={styles.leftChart}>
              <div className={styles.chartTitle}>XX信息项流程数据概览</div>
              <RadarChart />
            </BorderBox2>
          </Col>
        </Row>

        {/* 数字统计区域 */}
        <Row gutter={[16, 16]} className={styles.numberStatsRow}>
          <Col span={4}>
            <BorderBox9 className={styles.numberStatBox}>
              <div className={styles.statTitle}>测试11</div>
              <div className={styles.bigNumber}>201</div>
            </BorderBox9>
          </Col>
          <Col span={5}>
            <BorderBox9 className={styles.numberStatBox}>
              <div className={styles.statTitle}>测试22</div>
              <div className={styles.bigNumber}>334</div>
            </BorderBox9>
          </Col>
          <Col span={5}>
            <BorderBox9 className={styles.numberStatBox}>
              <div className={styles.statTitle}>测试33</div>
              <div className={styles.bigNumber}>268</div>
            </BorderBox9>
          </Col>
          <Col span={5}>
            <BorderBox9 className={styles.numberStatBox}>
              <div className={styles.statTitle}>测试44</div>
              <div className={styles.bigNumber}>234</div>
            </BorderBox9>
          </Col>
          <Col span={5}>
            <BorderBox9 className={styles.numberStatBox}>
              <div className={styles.statTitle}>测试55</div>
              <div className={styles.bigNumber}>243</div>
            </BorderBox9>
          </Col>
        </Row>

        {/* 底部图表和数据列表区域 */}
        <Row gutter={[16, 16]} className={styles.bottomRow}>
          <Col span={8}>
            <Row gutter={[0, 16]} className={styles.bottomLeftCol}>
              <Col span={24}>
                <BorderBox10 className={styles.infoList}>
                  <div className={styles.infoTitle}>XX指南</div>
                  <DataTable
                    data={[
                      {
                        title: '更多免费插画素材尽在公众号 "DreamCoders"',
                        date: "2023/05/20",
                      },
                      {
                        title: '更多免费插画素材尽在公众号 "DreamCoders"',
                        date: "2023/05/20",
                      },
                      {
                        title: '更多免费插画素材尽在公众号 "DreamCoders"',
                        date: "2023/05/20",
                      },
                      {
                        title: '更多免费插画素材尽在公众号 "DreamCoders"',
                        date: "2023/05/20",
                      },
                    ]}
                  />
                </BorderBox10>
              </Col>
              <Col span={24}>
                <BorderBox1 className={styles.bottomLeftChart}>
                  <div className={styles.chartTitle}>
                    更多免费插画模板关注公众号
                  </div>
                  <RadarChart />
                </BorderBox1>
              </Col>
            </Row>
          </Col>

          <Col span={8}>
            <BorderBox8 className={styles.centerBottomChart}>
              <div className={styles.chartTitle}>关于XXXX占比</div>
              <BarChart
                data={[
                  { name: "1月", value: 75 },
                  { name: "2月", value: 45 },
                  { name: "3月", value: 60 },
                  { name: "4月", value: 85 },
                  { name: "5月", value: 55 },
                  { name: "6月", value: 40 },
                  { name: "7月", value: 65 },
                  { name: "8月", value: 90 },
                  { name: "9月", value: 50 },
                  { name: "10月", value: 80 },
                  { name: "11月", value: 45 },
                  { name: "12月", value: 70 },
                ]}
                multiColor={true}
              />
            </BorderBox8>
          </Col>

          <Col span={8}>
            <Row gutter={[0, 16]} className={styles.bottomRightCol}>
              <Col span={24}>
                <BorderBox10 className={styles.infoList}>
                  <div className={styles.infoTitle}>政策XX</div>
                  <DataTable
                    data={[
                      {
                        title: '更多免费插画素材尽在公众号 "DreamCoders"',
                        date: "2023/05/20",
                      },
                      {
                        title: '更多免费插画素材尽在公众号 "DreamCoders"',
                        date: "2023/05/20",
                      },
                      {
                        title: '更多免费插画素材尽在公众号 "DreamCoders"',
                        date: "2023/05/20",
                      },
                      {
                        title: '更多免费插画素材尽在公众号 "DreamCoders"',
                        date: "2023/05/20",
                      },
                      {
                        title: '更多免费插画素材尽在公众号 "DreamCoders"',
                        date: "2023/05/20",
                      },
                    ]}
                  />
                </BorderBox10>
              </Col>
              <Col span={24}>
                <BorderBox2 className={styles.bottomRightChart}>
                  <div className={styles.chartTitle}>XXXX公开数量</div>
                  <BarChart
                    horizontal={true}
                    data={[
                      { name: "类目1", value: 850 },
                      { name: "类目2", value: 750 },
                      { name: "类目3", value: 650 },
                      { name: "类目4", value: 900 },
                      { name: "类目5", value: 700 },
                    ]}
                    color="#36b5fd"
                  />
                </BorderBox2>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default GovernmentDataScreen;
