import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

function createTextSprite(text, color = "#333", fontSize = 32) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = `bold ${fontSize}px Arial`;
  const textWidth = context.measureText(text).width;
  canvas.width = textWidth;
  canvas.height = fontSize * 1.4;
  context.font = `bold ${fontSize}px Arial`;
  context.fillStyle = color;
  context.fillText(text, 0, fontSize);
  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(canvas.width / 20, canvas.height / 20, 1);
  return sprite;
}

const ThreeDBarChart = ({ data, xAxis, yAxis }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Clean up previous scene
    while (mountRef.current && mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }

    // Scene setup
    const width = 500;
    const height = 350;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f4f8); // Light background
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 18, 32);
    camera.lookAt(0, 7, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0xf0f4f8, 1); // Light background
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // OrbitControls for zoom/pan/rotate
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.minDistance = 10;
    controls.maxDistance = 100;
    controls.target.set(0, 7, 0);
    controls.update();

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    // Grid helper for orientation
    const gridHelper = new THREE.GridHelper(30, 30, 0xcccccc, 0xeeeeee);
    scene.add(gridHelper);

    // Axes
    const axesHelper = new THREE.AxesHelper(20);
    scene.add(axesHelper);

    // Bars
    const barWidth = 1;
    const barDepth = 1;
    const gap = 1.5;
    const barColors = [0x4f8a8b, 0x82ca9d, 0xffc658, 0xff8042, 0x8dd1e1, 0xa4de6c];
    data.forEach((item, i) => {
      const barHeight = item.value;
      const geometry = new THREE.BoxGeometry(barWidth, barHeight, barDepth);
      const material = new THREE.MeshPhongMaterial({ color: barColors[i % barColors.length] });
      const bar = new THREE.Mesh(geometry, material);
      bar.position.x = i * gap - ((data.length * gap) / 2);
      bar.position.y = barHeight / 2;
      scene.add(bar);
    });

    // X axis label
    const xLabel = createTextSprite(xAxis || "X", "#4f8a8b", 48);
    xLabel.position.set((data.length * 1.5) / 2 + 1, 0, 0);
    scene.add(xLabel);

    // Y axis label
    const yLabel = createTextSprite(yAxis || "Y", "#4f8a8b", 48);
    yLabel.position.set(0, Math.max(...data.map(d => d.value)) + 2, 0);
    scene.add(yLabel);

    // Animation loop
    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // Cleanup
    return () => {
      renderer.dispose();
      controls.dispose();
    };
  }, [data, xAxis, yAxis]);

  return (
    <div
      ref={mountRef}
      style={{
        width: "100%",
        maxWidth: "500px",
        height: "350px",
        margin: "0 auto",
        background: "#f0f4f8",
        borderRadius: "1rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
      aria-label="3D Bar Chart"
      role="img"
    />
  );
};

ThreeDBarChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.number,
    })
  ).isRequired,
  xAxis: PropTypes.string,
  yAxis: PropTypes.string,
};

export default ThreeDBarChart;