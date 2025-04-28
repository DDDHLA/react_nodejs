import React, { useState, useEffect, useRef } from "react";

function Canva() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // 设置画布大小
    canvas.width = 600;
    canvas.height = 600;
    canvas.style.backgroundColor = "#f0f0f0";
    canvas.style.border = "1px solid #ccc";

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制粉色小盒子
    ctx.fillStyle = "#FFC0CB"; // 粉色
    ctx.fillRect(100, 100, 100, 100); // x, y, width, height

    // 添加边框
    ctx.strokeStyle = "#FF69B4"; // 深粉色边框
    ctx.lineWidth = 2;
    ctx.strokeRect(100, 100, 100, 100); // x, y, width, height

    // 绘制一条线
    ctx.moveTo(10, 10);
    ctx.lineTo(100, 100);
    ctx.strokeStyle = "pink";
    ctx.lineWidth = 2;
    ctx.stroke(); // 这行是必须的，用于实际绘制路径

    // 绘制一个圆
    ctx.beginPath(); // 开始新的路径
    ctx.arc(300, 300, 50, 0, 2 * Math.PI); // x, y, radius, startAngle, endAngle
    ctx.closePath(); // 关闭路径
    ctx.fillStyle = "lightblue"; // 填充颜色
    ctx.fill(); // 这行是必须的，用于实际填充路径
    ctx.strokeStyle = "blue"; // 边框颜色
    ctx.lineWidth = 2; // 边框宽度
    ctx.stroke(); // 这行是必须的，用于实际绘制路径
  }, []);

  return (
    <div className="Canva">
      <h3>Canvas 粉色小盒子</h3>
      <canvas ref={canvasRef} style={{ border: "1px solid #ccc" }} />
    </div>
  );
}

export default Canva;
