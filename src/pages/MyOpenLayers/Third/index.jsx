import React, { useEffect, useRef } from "react";
import "ol/ol.css"; // 引入OpenLayers样式
import Map from "ol/Map"; // 地图核心类
import View from "ol/View"; // 地图视图
import TileLayer from "ol/layer/Tile"; // 瓦片图层
import OSM from "ol/source/OSM"; // OSM地图数据源
import "./index.less";
import {
  defaults as defaultControls,
  ScaleLine,
  FullScreen,
  ZoomSlider,
  MousePosition,
  Control,
} from "ol/control"; // 常用控件
import { createStringXY } from "ol/coordinate"; // 坐标格式化
import VectorLayer from "ol/layer/Vector"; // 矢量图层
import VectorSource from "ol/source/Vector"; // 矢量数据源
import Feature from "ol/Feature"; // 地图要素
import Point from "ol/geom/Point"; // 点几何
import LineString from "ol/geom/LineString"; // 线几何
import Style from "ol/style/Style"; // 样式
import CircleStyle from "ol/style/Circle"; // 圆形样式
import Fill from "ol/style/Fill"; // 填充样式
import Stroke from "ol/style/Stroke"; // 描边样式

function First() {
  const mapRef = useRef(null); // 地图容器ref
  const mousePositionRef = useRef(null); // 鼠标经纬度显示ref

  // 武汉经纬度
  const center = [114.305393, 30.593099];

  useEffect(() => {
    // 创建中心点Feature
    const centerFeature = new Feature({
      geometry: new Point(center), // 设置点的经纬度
    });
    centerFeature.setStyle(
      new Style({
        image: new CircleStyle({
          radius: 8, // 圆点半径
          fill: new Fill({ color: "red" }), // 填充红色
          stroke: new Stroke({ color: "white", width: 2 }), // 白色描边
        }),
      })
    );

    // 仙桃、潜江、天门三点经纬度
    const xiantao = [113.453974, 30.36251];
    const qianjiang = [112.899297, 30.421215];
    const tianmen = [113.166078, 30.663336];

    // 创建连接三地的虚线Feature
    const lineFeature = new Feature({
      geometry: new LineString([xiantao, qianjiang, tianmen, xiantao]), // 闭合三角形
    });
    lineFeature.setStyle(
      new Style({
        stroke: new Stroke({
          color: "red", // 红色
          width: 3,
          lineDash: [10, 10], // 虚线样式
        }),
      })
    );

    // 创建矢量图层，专门用于显示中心点和线
    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: [centerFeature, lineFeature], // 包含中心点和连线
      }),
    });

    // 创建地图视图，设置中心点和缩放级别
    const view = new View({
      center: center,
      zoom: 12,
      projection: "EPSG:4326", // 使用经纬度坐标系
    });

    // 创建地图实例
    const map = new Map({
      target: mapRef.current, // 地图渲染目标
      layers: [
        // 瓦片底图（高德地图风格）
        new TileLayer({
          // 除了这个，还有很多地图风格
          // source: new OSM({
          //   // 默认使用OSM地图数据源
          //   source: new OSM(),
          // }),
          source: new OSM({
            url: "http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=8&x={x}&y={y}&z={z}",
          }),
        }),
        vectorLayer, // 添加中心点图层
      ],
      view: view, // 地图视图
      // 常用控件
      controls: defaultControls().extend([
        new ScaleLine(), // 比例尺控件
        new FullScreen(), // 全屏控件
        new ZoomSlider(), // 缩放滑块控件
        new MousePosition({
          coordinateFormat: createStringXY(4), // 坐标格式化为小数点后4位
          projection: "EPSG:4326", // 显示经纬度
          className: "custom-mouse-position", // 自定义样式类
          target: mousePositionRef.current, // 渲染到自定义div
        }),
      ]),
    });

    // 自定义控件：回到中心点
    class CenterControl extends Control {
      constructor(opt_options) {
        const button = document.createElement("button");
        button.innerHTML = "+"; // 你可以替换为svg或icon
        button.style.padding = "0 8px";
        button.style.height = "26px";
        button.style.fontSize = "12px";
        button.style.background = "#fff";
        button.style.border = "1px solid #ccc";
        button.style.borderRadius = "4px";
        button.style.cursor = "pointer";
        // 点击按钮后，地图视图回到中心点
        button.onclick = function () {
          view.animate({ center: center, duration: 500 });
        };

        const element = document.createElement("div");
        element.className = "ol-unselectable ol-control";
        element.style.top = "70px";
        element.style.left = "0.5em";
        element.style.position = "absolute";
        element.appendChild(button);

        super({ element: element, target: undefined });
      }
    }
    map.addControl(new CenterControl()); // 添加自定义控件

    // 组件卸载时清理地图
    return () => {
      map.setTarget(null);
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "600px" }}>
      {/* 地图容器 */}
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
      {/* 鼠标经纬度显示 */}
      <div
        ref={mousePositionRef}
        className="custom-mouse-position"
        style={{
          position: "absolute",
          left: 10,
          bottom: 10,
          background: "rgba(255,255,255,0.8)",
          padding: "2px 8px",
          borderRadius: "4px",
          fontSize: "12px",
          zIndex: 100,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

export default First;
