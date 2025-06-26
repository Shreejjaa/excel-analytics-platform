import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const AXIS_LABELS = [
  { text: "X", color: 0xff0000, pos: [55, 0, 0] },
  { text: "Y", color: 0x00ff00, pos: [0, 55, 0] },
  { text: "Z", color: 0x0000ff, pos: [0, 0, 55] },
];

function createTextSprite(text, color = "#333", fontSize = 48) {
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
  sprite.scale.set(canvas.width / 10, canvas.height / 10, 1);
  return sprite;
}

const ThreeDScatterChart = ({ data, width = 600, height = 400 }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Detect dark mode
    const isDark =
      (typeof window !== "undefined" &&
        (localStorage.getItem("theme") === "dark" ||
          document.documentElement.classList.contains("dark")));

    // Colors for modes
    const backgroundColor = isDark ? 0x18181b : 0xf0f4f8;
    const gridColor = isDark ? 0x333347 : 0xcccccc;
    const gridColor2 = isDark ? 0x22222a : 0xeeeeee;
    const axisLabelColor = isDark ? "#fff" : "#333";
    const axesColors = isDark
      ? [0xff5555, 0x55ff55, 0x5555ff]
      : [0xff0000, 0x00ff00, 0x0000ff];

    const mountNode = mountRef.current;
    // Clean up previous scene
    while (mountNode && mountNode.firstChild) {
      mountNode.removeChild(mountNode.firstChild);
    }

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(backgroundColor);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(60, 60, 100);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setClearColor(backgroundColor, 1);
    mountNode.appendChild(renderer.domElement);

    // OrbitControls for user interaction
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.minDistance = 30;
    controls.maxDistance = 300;
    controls.target.set(0, 0, 0);
    controls.update();

    // Grid helper
    const gridHelper = new THREE.GridHelper(100, 10, gridColor, gridColor2);
    scene.add(gridHelper);

    // Axes (thicker and colored)
    const axesLength = 50;
    [
      { start: [0, 0, 0], end: [axesLength, 0, 0], color: axesColors[0] },
      { start: [0, 0, 0], end: [0, axesLength, 0], color: axesColors[1] },
      { start: [0, 0, 0], end: [0, 0, axesLength], color: axesColors[2] },
    ].forEach(({ start, end, color }) => {
      const material = new THREE.LineBasicMaterial({ color, linewidth: 6 });
      const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, material);
      scene.add(line);
    });

    // Axis labels
    AXIS_LABELS.forEach(({ text, color, pos }, i) => {
      const label = createTextSprite(
        text,
        isDark
          ? ["#ff5555", "#55ff55", "#5555ff"][i]
          : `#${color.toString(16).padStart(6, "0")}`
      );
      label.position.set(...pos);
      scene.add(label);
    });

    // Add points (bigger, brighter, with subtle outline)
    data.forEach(point => {
      const geometry = new THREE.SphereGeometry(2.8, 24, 24);
      const material = new THREE.MeshPhongMaterial({ color: 0x4f8a8b, shininess: 120 });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(point.x, point.y, point.z || 0);
      scene.add(sphere);
      // Optional: add a white outline for better visibility
      const outlineGeo = new THREE.SphereGeometry(3.1, 24, 24);
      const outlineMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, opacity: 0.5, transparent: true });
      const outline = new THREE.Mesh(outlineGeo, outlineMat);
      outline.position.copy(sphere.position);
      scene.add(outline);
    });

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 1.1 : 0.9);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, isDark ? 1 : 0.7);
    directionalLight.position.set(50, 80, 120);
    scene.add(directionalLight);

    // Animation loop
    const animate = function () {
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // Cleanup
    return () => {
      renderer.dispose();
      controls.dispose();
      while (mountNode && mountNode.firstChild) {
        mountNode.removeChild(mountNode.firstChild);
      }
    };
  }, [data, width, height]);

  // Set background for container as well
  const isDark =
    (typeof window !== "undefined" &&
      (localStorage.getItem("theme") === "dark" ||
        document.documentElement.classList.contains("dark")));

  return (
    <div
      ref={mountRef}
      style={{
        borderRadius: "1rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        background: isDark ? "#18181b" : "#f0f4f8",
        margin: "0 auto"
      }}
      aria-label="3D Scatter Chart"
      role="img"
    />
  );
};

export default ThreeDScatterChart;