import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { defaults as defaultControls } from "ol/control";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import LineString from "ol/geom/LineString";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";

function Ways() {
  const mapRef = useRef(null); // 地图容器ref
  const mapInstanceRef = useRef(null); // 存储地图实例的引用
  const [origin, setOrigin] = useState(""); // 起点
  const [destination, setDestination] = useState(""); // 终点

  useEffect(() => {
    if (!mapInstanceRef.current) {
      // 确保只创建一个地图实例
      const vectorSource = new VectorSource(); // 矢量数据源
      const vectorLayer = new VectorLayer({
        source: vectorSource,
      });

      const view = new View({
        center: [114.305393, 30.593099], // 地图中心点
        zoom: 12,
        projection: "EPSG:4326",
      });

      const map = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM({
              url: "http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=8&x={x}&y={y}&z={z}", // 高德地图瓦片服务
            }),
          }),
          vectorLayer,
        ],
        view: view,
        controls: defaultControls(), // 使用默认控件
      });

      mapInstanceRef.current = map; // 存储地图实例
    }
  }, []);

  // 地理编码，获取经纬度
  const geocodeAddress = async (address) => {
    const res = await fetch(
      `https://restapi.amap.com/v3/geocode/geo?address=${encodeURIComponent(
        address
      )}&output=JSON&key=5dfc17cea3f1452c2855603acf3cded2`
    );
    const data = await res.json();
    console.log(data);
    if (data.geocodes && data.geocodes.length > 0) {
      const location = data.geocodes[0].location.split(",");
      return [parseFloat(location[0]), parseFloat(location[1])];
    } else {
      alert(`未找到地址: ${address}`);
      return null;
    }
  };

  const handleRoutePlanning = async () => {
    if (!origin || !destination) return;
    const originCoords = await geocodeAddress(origin);
    const destinationCoords = await geocodeAddress(destination);
    // console.log(originCoords, destinationCoords);
    if (!originCoords || !destinationCoords) return;

    const res = await fetch(
      `https://restapi.amap.com/v3/direction/driving?origin=${originCoords.join(
        ","
      )}&destination=${destinationCoords.join(
        ","
      )}&key=5dfc17cea3f1452c2855603acf3cded2`
    );
    const data = await res.json();
    if (data.route && data.route.paths && data.route.paths.length > 0) {
      const path = data.route.paths[0];
      const points = path.steps.flatMap((step) =>
        step.polyline.split(";").map((point) => point.split(",").map(Number))
      );
      const routeFeature = new Feature({
        geometry: new LineString(points), // 将路径点转换为LineString
      });
      routeFeature.setStyle(
        new Style({
          stroke: new Stroke({
            color: "blue",
            width: 3,
          }),
        })
      );
      const map = mapInstanceRef.current;
      if (map) {
        map.getLayers().item(1).getSource().clear();
        map.getLayers().item(1).getSource().addFeature(routeFeature);
        // 将视图中心移动到出发点
        map.getView().animate({ center: originCoords, duration: 500 });
      }
    } else {
      alert("未找到路线");
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "600px" }}>
      <div
        style={{
          position: "absolute",
          zIndex: 200,
          top: 10,
          left: 50,
          background: "#fff",
          padding: 8,
          borderRadius: 4,
        }}
      >
        <input
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          placeholder="请输入出发地地址"
          style={{ width: 180, marginRight: 8 }}
        />
        <input
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="请输入目的地地址"
          style={{ width: 180, marginRight: 8 }}
        />
        <button onClick={handleRoutePlanning}>确认</button>
      </div>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}

export default Ways;
