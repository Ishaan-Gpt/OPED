"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { DESIGN_SYSTEM } from "@/config/design_system";
import { X, Maximize2, RotateCcw, Info } from "lucide-react";

export default function Canvas3DViewer({ modelData, onClose }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0C1712"); // Dark blackboard aesthetic

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00A896, 2.0); // Teal Green Light
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xA71D2A, 1.5); // Royal Red Light
    dirLight2.position.set(-5, -5, -5);
    scene.add(dirLight2);

    // 3. Create 3D Object Based on Model Type
    const group = new THREE.Group();
    const type = modelData?.type || "vector_cube";

    if (type === "vector_cube") {
      // Force & Vector Cube
      const geometry = new THREE.BoxGeometry(3, 3, 3);
      const material = new THREE.MeshPhongMaterial({
        color: 0x0D7A70,
        wireframe: true,
        emissive: 0x005F56
      });
      const cube = new THREE.Mesh(geometry, material);
      group.add(cube);

      // Inner Core
      const coreGeo = new THREE.SphereGeometry(1, 16, 16);
      const coreMat = new THREE.MeshBasicMaterial({ color: 0x8B0000 });
      const core = new THREE.Mesh(coreGeo, coreMat);
      group.add(core);

    } else if (type === "molecular_grid") {
      // Glucose/Nutrient Molecular Grid
      for (let i = 0; i < 7; i++) {
        const sphereGeo = new THREE.SphereGeometry(0.6, 16, 16);
        const mat = new THREE.MeshPhongMaterial({
          color: i % 2 === 0 ? 0x00A896 : 0xA71D2A
        });
        const sphere = new THREE.Mesh(sphereGeo, mat);
        sphere.position.set(
          Math.sin(i * 1.0) * 3,
          Math.cos(i * 1.0) * 2,
          (i - 3) * 0.8
        );
        group.add(sphere);
      }
    } else {
      // General 3D Physics Mesh (Torus Knot)
      const knotGeo = new THREE.TorusKnotGeometry(1.8, 0.5, 100, 16);
      const knotMat = new THREE.MeshStandardMaterial({
        color: 0x0D7A70,
        roughness: 0.3,
        metalness: 0.8
      });
      const knot = new THREE.Mesh(knotGeo, knotMat);
      group.add(knot);
    }

    scene.add(group);

    // 4. Mouse Interactive Rotation
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      group.rotation.y += deltaX * 0.01;
      group.rotation.x += deltaY * 0.01;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // 5. Render Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isDragging) {
        group.rotation.y += 0.005;
        group.rotation.x += 0.003;
      }
      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      dom.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [modelData]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between p-4 md:p-6 bg-slate-900/80 border-b border-slate-800 text-white z-20">
        <div className="flex items-center gap-3">
          <div 
            className="p-2 rounded-lg font-bold text-xs uppercase tracking-wider"
            style={{ backgroundColor: DESIGN_SYSTEM.colors.tealGreen.primary }}
          >
            Interactive 3D Canvas
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">{modelData?.title || "3D NCERT Visualizer"}</h3>
            <p className="text-xs text-slate-400">{modelData?.description || "Drag mouse to rotate, inspect from 360°"}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800 transition-all active:scale-95 shadow-lg"
        >
          <X className="w-5 h-5" />
          <span>Exit 3D View</span>
        </button>
      </div>

      {/* WebGL Mount Container */}
      <div ref={mountRef} className="flex-1 w-full h-full cursor-grab active:cursor-grabbing relative">
        <div className="absolute bottom-6 left-6 z-10 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 text-slate-300 text-xs border border-slate-800 backdrop-blur-md">
          <RotateCcw className="w-4 h-4 text-teal-400" />
          <span>Drag mouse to rotate • 360° Fullscreen Orbit</span>
        </div>
      </div>
    </div>
  );
}
