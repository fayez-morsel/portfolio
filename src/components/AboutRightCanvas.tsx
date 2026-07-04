"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function RightShapes() {
  const gemRef = useRef<THREE.Mesh>(null);
  const flowerRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const scrollY = typeof window !== "undefined" ? window.scrollY : 0;

    // Purple gemstone (Top right element)
    if (gemRef.current) {
      gemRef.current.position.y = 1.1 + Math.sin(time * 1.5) * 0.15 - scrollY * 0.0014;
      gemRef.current.rotation.y = time * -0.5;
      gemRef.current.rotation.x = time * 0.4;
    }

    // Lavender flower (Bottom right element)
    if (flowerRef.current) {
      flowerRef.current.position.y = -1.0 + Math.sin(time * 1.2) * 0.18 - scrollY * 0.0022;
      flowerRef.current.rotation.z = time * 0.35;
      flowerRef.current.rotation.x = Math.sin(time * 0.4) * 0.15;
    }
  });

  return (
    <>
      {/* 3D Gemstone: Translucent Purple */}
      <mesh ref={gemRef} position={[0.4, 1.1, 0]}>
        <icosahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial
          color="#a78bfa"
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={0.8}
          flatShading
        />
      </mesh>

      {/* 3D Flower: Lavender */}
      <group ref={flowerRef} position={[-0.4, -1, 0]}>
        {/* Flower Center */}
        <mesh>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color="#fcd34d" roughness={0.4} />
        </mesh>
        {/* 5 Petals */}
        {[0, 1, 2, 3, 4].map((i) => {
          const angle = (i * Math.PI * 2) / 5;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 0.32, Math.sin(angle) * 0.32, 0]}
              rotation={[0, 0, angle]}
              scale={[1.8, 0.9, 0.4]}
            >
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial color="#c084fc" roughness={0.3} />
            </mesh>
          );
        })}
      </group>
    </>
  );
}

export default function AboutRightCanvas() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 4.5], fov: 40 }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[-2, 3, 4]} intensity={1.8} />
        <pointLight position={[2, -3, 2]} intensity={1.2} color="#a78bfa" />
        <RightShapes />
      </Canvas>
    </div>
  );
}
