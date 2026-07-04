"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function TorusKnot() {
  const torusRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (torusRef.current) {
      torusRef.current.rotation.x = time * 0.45;
      torusRef.current.rotation.y = time * 0.6;
      torusRef.current.position.y = Math.sin(time * 1.8) * 0.15;
    }
  });

  return (
    <mesh ref={torusRef}>
      <torusKnotGeometry args={[0.55, 0.2, 120, 16]} />
      <meshStandardMaterial color="#c084fc" roughness={0.12} metalness={0.85} />
    </mesh>
  );
}

export default function TorusCanvas() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[2, 3, 2]} intensity={1.8} />
        <pointLight position={[-2, -3, 2]} intensity={1.2} color="#a78bfa" />
        <TorusKnot />
      </Canvas>
    </div>
  );
}
