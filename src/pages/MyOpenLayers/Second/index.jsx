import React, { useEffect, useRef } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import CircleStyle from "ol/style/Circle";
import Fill from "ol/style/Fill";

function Second() {
  const mapRef = useRef(null);

  useEffect(() => {
    // 创建底图图层
    const tileLayer = new TileLayer({
      source: new OSM(),
    });

    // 创建矢量图层，加载本地GeoJSON
    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        url: "/map.geojson", // public目录下的map.geojson
        format: new GeoJSON(),
      }),
      style: function (feature) {
        // 针对不同类型要素设置样式
        const geometryType = feature.getGeometry().getType();
        if (geometryType === "Point") {
          // 判断是否为武汉点
          if (feature.get("name") === "武汉") {
            return new Style({
              image: new CircleStyle({
                radius: 10,
                fill: new Fill({ color: "red" }),
                stroke: new Stroke({ color: "white", width: 3 }),
              }),
            });
          }
          // 其他点样式
          return new Style({
            image: new CircleStyle({
              radius: 8,
              fill: new Fill({ color: "#1890ff" }),
              stroke: new Stroke({ color: "white", width: 2 }),
            }),
          });
        }
        if (geometryType === "LineString") {
          return new Style({
            stroke: new Stroke({
              color: "red",
              width: 3,
              lineDash: [10, 10], // 虚线
            }),
          });
        }
        // 其他类型可自定义
        return null;
      },
    });

    // 创建地图视图
    const view = new View({
      center: [114.305393, 30.593099], // 武汉经纬度
      zoom: 10,
      projection: "EPSG:4326",
    });

    // 创建地图
    const map = new Map({
      target: mapRef.current,
      layers: [tileLayer, vectorLayer],
      view: view,
    });

    return () => {
      map.setTarget(null);
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "600px" }}>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}

export default Second;
