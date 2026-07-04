"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function LeftShapes() {
  const starRef = useRef<THREE.Mesh>(null);
  const heartRef = useRef<THREE.Mesh>(null);

  // Define 3D Extrusion shapes
  const { starGeometry, heartGeometry } = useMemo(() => {
    // 4-point star shape
    const starShape = new THREE.Shape();
    starShape.moveTo(0, 0.7);
    starShape.lineTo(0.12, 0.12);
    starShape.lineTo(0.7, 0);
    starShape.lineTo(0.12, -0.12);
    starShape.lineTo(0, -0.7);
    starShape.lineTo(-0.12, -0.12);
    starShape.lineTo(-0.7, 0);
    starShape.lineTo(-0.12, 0.12);
    starShape.closePath();

    const starGeo = new THREE.ExtrudeGeometry(starShape, {
      depth: 0.18,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.04,
      bevelSegments: 3,
    });

    // Heart shape
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0.2);
    heartShape.bezierCurveTo(0.2, 0.5, 0.6, 0.5, 0.6, 0.1);
    heartShape.bezierCurveTo(0.6, -0.3, 0.25, -0.5, 0, -0.75);
    heartShape.bezierCurveTo(-0.25, -0.5, -0.6, -0.3, -0.6, 0.1);
    heartShape.bezierCurveTo(-0.6, 0.5, -0.2, 0.5, 0, 0.2);

    const heartGeo = new THREE.ExtrudeGeometry(heartShape, {
      depth: 0.18,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.04,
      bevelSegments: 3,
    });

    return { starGeometry: starGeo, heartGeometry: heartGeo };
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const scrollY = typeof window !== "undefined" ? window.scrollY : 0;

    // Star (Top left element)
    if (starRef.current) {
      starRef.current.position.y = 1.0 + Math.sin(time * 1.4) * 0.15 - scrollY * 0.0012;
      starRef.current.rotation.y = time * 0.6;
      starRef.current.rotation.x = time * 0.3;
    }

    // Heart (Bottom left element)
    if (heartRef.current) {
      heartRef.current.position.y = -1.1 + Math.sin(time * 1.8) * 0.15 - scrollY * 0.002;
      heartRef.current.rotation.y = time * -0.5;
      heartRef.current.rotation.z = Math.sin(time * 0.5) * 0.2;
    }
  });

  return (
    <>
      {/* 3D Star: Silver Metallic */}
      <mesh ref={starRef} geometry={starGeometry} position={[-0.5, 1, 0]}>
        <meshStandardMaterial color="#d1d5db" roughness={0.15} metalness={0.9} />
      </mesh>

      {/* 3D Heart: Red Glossy */}
      <mesh ref={heartRef} geometry={heartGeometry} position={[0.4, -1, 0]}>
        <meshStandardMaterial color="#f43f5e" roughness={0.1} metalness={0.75} />
      </mesh>
    </>
  );
}

export default function AboutLeftCanvas() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 4.5], fov: 40 }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[2, 3, 4]} intensity={1.8} />
        <pointLight position={[-2, -3, 2]} intensity={1.2} color="#ec4899" />
        <LeftShapes />
      </Canvas>
    </div>
  );
}
