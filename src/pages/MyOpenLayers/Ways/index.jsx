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
import { Select } from "antd";
import debounce from "lodash/debounce";

function Ways() {
  const mapRef = useRef(null); // 地图容器ref
  const mapInstanceRef = useRef(null); // 存储地图实例的引用
  const [originOptions, setOriginOptions] = useState([]); // 起点选项
  const [destinationOptions, setDestinationOptions] = useState([]); // 终点选项
  const [originCoords, setOriginCoords] = useState(null); // 起点坐标
  const [destinationCoords, setDestinationCoords] = useState(null); // 终点坐标
  const [travelMode, setTravelMode] = useState("driving"); // 出行方式
  const [originOpen, setOriginOpen] = useState(false);
  const [destinationOpen, setDestinationOpen] = useState(false);
  const originSelectRef = useRef(null);
  const destinationSelectRef = useRef(null);

  useEffect(() => {
    if (originOptions.length > 0) {
      setOriginOpen(true);
    }
  }, [originOptions]);

  useEffect(() => {
    if (destinationOptions.length > 0) {
      setDestinationOpen(true);
    }
  }, [destinationOptions]);

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
  const geocodeAddress = async (address, setOptions, selectRef) => {
    const res = await fetch(
      `https://restapi.amap.com/v3/geocode/geo?address=${encodeURIComponent(
        address
      )}&output=JSON&key=5dfc17cea3f1452c2855603acf3cded2`
    );
    const data = await res.json();
    if (data.geocodes && data.geocodes.length > 0) {
      const options = data.geocodes.map((geocode) => ({
        label: geocode.formatted_address,
        value: geocode.location,
      }));
      console.log(options, 99);
      setOptions(options);
      if (selectRef.current) {
        console.log(888888);
        // 失焦后重新聚焦
        selectRef.current.blur(); // 让 input 失焦
        selectRef.current.focus(); // 重新让 input 聚焦
      }
    } else {
      // alert(`未找到地址: ${address}`);
    }
  };

  const handleOriginChange = debounce((value) => {
    console.log(value, 7777);
    if (value) {
      geocodeAddress(value, setOriginOptions, originSelectRef);
    }
  }, 500); // 设置防抖时间为1秒

  const handleDestinationChange = debounce((value) => {
    if (value) {
      geocodeAddress(value, setDestinationOptions, destinationSelectRef);
    }
  }, 500); // 设置防抖时间为1秒

  const handleRoutePlanning = async () => {
    if (!originCoords || !destinationCoords) return;

    const res = await fetch(
      `https://restapi.amap.com/v3/direction/${travelMode}?origin=${originCoords}&destination=${destinationCoords}&key=5dfc17cea3f1452c2855603acf3cded2`
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
        map.getView().animate({
          center: originCoords.split(",").map(Number),
          duration: 500,
        });
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
        <Select
          showSearch
          ref={originSelectRef}
          placeholder="请输入出发地地址"
          onSearch={handleOriginChange}
          onSelect={(value) => {
            setOriginCoords(value);
            setOriginOpen(false); // 选中后关闭下拉
          }}
          open={originOpen}
          onFocus={() => setOriginOpen(true)}
          onBlur={() => setOriginOpen(false)}
          options={originOptions}
          style={{ width: 180, marginRight: 8 }}
        />
        <Select
          showSearch
          ref={destinationSelectRef}
          placeholder="请输入目的地地址"
          onSearch={handleDestinationChange}
          onSelect={(value) => {
            setDestinationCoords(value);
            setDestinationOpen(false);
          }}
          open={destinationOpen}
          onFocus={() => setDestinationOpen(true)}
          onBlur={() => setDestinationOpen(false)}
          options={destinationOptions}
          style={{ width: 180, marginRight: 8 }}
        />
        <select
          value={travelMode}
          onChange={(e) => setTravelMode(e.target.value)}
          style={{ marginRight: 8 }}
        >
          <option value="driving">驾车</option>
          <option value="walking">步行</option>
          <option value="bicycling">骑行</option>
        </select>
        <button onClick={handleRoutePlanning}>确认</button>
      </div>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}

export default Ways;
