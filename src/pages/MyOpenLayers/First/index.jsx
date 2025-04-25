import React, { useEffect, useRef, useState } from "react";
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
  const mapInstanceRef = useRef(null); // 新增：用于存储地图实例
  const mousePositionRef = useRef(null); // 鼠标经纬度显示ref
  const [search, setSearch] = useState(""); // 输入框内容
  const markerRef = useRef(null); // 新增：用于标记搜索地点

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

    // 确保 vectorLayer 的 source 已经初始化
    const vectorSource = new VectorSource({
      features: [centerFeature, lineFeature], // 包含中心点和连线
    });
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    // 创建标记点Feature并加入矢量图层
    const markerFeature = new Feature();
    markerRef.current = markerFeature;
    markerFeature.setStyle(
      new Style({
        image: new CircleStyle({
          radius: 10,
          fill: new Fill({ color: "#1890ff" }),
          stroke: new Stroke({ color: "#fff", width: 3 }),
        }),
      })
    );
    vectorSource.addFeature(markerFeature);

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
        new TileLayer({
          source: new OSM({
            url: "http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=8&x={x}&y={y}&z={z}",
          }),
        }),
        vectorLayer,
      ],
      view: view,
      controls: defaultControls().extend([
        new ScaleLine(),
        new FullScreen(),
        new ZoomSlider(),
        new MousePosition({
          coordinateFormat: createStringXY(4),
          projection: "EPSG:4326",
          className: "custom-mouse-position",
          target: mousePositionRef.current,
        }),
      ]),
    });

    // 将地图实例存储在 mapInstanceRef.current 中
    mapInstanceRef.current = map;

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

  const handleSearch = async () => {
    if (!search) return;
    const res = await fetch(
      `https://restapi.amap.com/v3/geocode/geo?address=${encodeURIComponent(
        search
      )}&output=JSON&key=5dfc17cea3f1452c2855603acf3cded2`
    );
    const data = await res.json();
    if (data.geocodes && data.geocodes.length > 0) {
      const location = data.geocodes[0].location.split(",");
      const lng = parseFloat(location[0]);
      const lat = parseFloat(location[1]);
      const map = mapInstanceRef.current;
      if (map) {
        map.getView().animate({ center: [lng, lat], duration: 500, zoom: 15 });
      }
      // 设置标记点样式，使其更加显眼，并向上移动
      if (markerRef.current) {
        console.log(1111);
        markerRef.current.setGeometry(new Point([lng, lat + 0.001])); // 向上移动标记点
        markerRef.current.setStyle(
          new Style({
            image: new CircleStyle({
              radius: 15, // 增大半径
              fill: new Fill({ color: "#ff0000" }), // 使用醒目的红色
              stroke: new Stroke({ color: "#ffffff", width: 5 }), // 白色描边
            }),
          })
        );
      }
    } else {
      alert("未找到该地点");
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "600px" }}>
      {/* 输入框和按钮 */}
      <div
        style={{
          position: "absolute",
          zIndex: 200,
          top: 10,
          left: 10,
          background: "#fff",
          padding: 8,
          borderRadius: 4,
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="请输入地点，如武汉大学"
          style={{ width: 180, marginRight: 8 }}
        />
        <button onClick={handleSearch}>确认</button>
      </div>
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
