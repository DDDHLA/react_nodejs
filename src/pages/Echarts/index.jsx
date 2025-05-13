import React from 'react';
import { Tabs } from 'antd';
import BarChart from './components/BarChart';
import LineChart from './components/LineChart';
import PieChart from './components/PieChart';
import MapChart from './components/MapChart';
import styles from './index.module.css';

const { TabPane } = Tabs;

const EchartsDemo = () => {
  return (
    <div className={styles.container}>
      <Tabs defaultActiveKey="1">
        <TabPane tab="柱状图" key="1">
          <BarChart />
        </TabPane>
        <TabPane tab="折线图" key="2">
          <LineChart />
        </TabPane>
        <TabPane tab="饼图" key="3">
          <PieChart />
        </TabPane>
        <TabPane tab="地图" key="4">
          <MapChart />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default EchartsDemo;