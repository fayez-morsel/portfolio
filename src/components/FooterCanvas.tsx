"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function PrimitiveCollage() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.15;
      // Individual floating animations (avoiding infinite accumulative drift)
      groupRef.current.children.forEach((child, i) => {
        // Safe, non-accumulating float animation
        const initialY = i * 0.2 - 0.4; // rough original coordinate reference
        child.position.y = initialY + Math.sin(time * 1.5 + i) * 0.05;
        child.rotation.x = time * 0.5 + i;
        child.rotation.y = time * 0.3 + i;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {/* Torus Ring (Cyan) */}
      <mesh position={[-1.2, 0.4, 0]}>
        <torusGeometry args={[0.3, 0.08, 16, 100]} />
        <meshStandardMaterial color="#22d3ee" roughness={0.1} metalness={0.8} />
      </mesh>

      {/* Sphere (Pink) */}
      <mesh position={[1.2, -0.4, 0]}>
        <sphereGeometry args={[0.26, 32, 32]} />
        <meshStandardMaterial color="#f43f5e" roughness={0.1} />
      </mesh>

      {/* Cylinder Capsule (Purple) */}
      <mesh position={[0.4, 0.8, -0.5]} rotation={[0.5, 0.5, 0]}>
        <capsuleGeometry args={[0.15, 0.5, 8, 16]} />
        <meshStandardMaterial color="#c084fc" roughness={0.2} metalness={0.7} />
      </mesh>

      {/* Octahedron Gem (Yellow) */}
      <mesh position={[-0.4, -0.8, 0.5]} rotation={[0.2, 0.8, 0.5]}>
        <octahedronGeometry args={[0.32, 0]} />
        <meshStandardMaterial color="#fcd34d" roughness={0.1} metalness={0.9} flatShading />
      </mesh>

      {/* Small Ring (Lavender) */}
      <mesh position={[0, 0, -1]}>
        <torusGeometry args={[0.2, 0.06, 16, 64]} />
        <meshStandardMaterial color="#d8b4fe" roughness={0.2} />
      </mesh>
    </group>
  );
}

export default function FooterCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.01 }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full">
      {isVisible && (
        <Canvas camera={{ position: [0, 0, 3], fov: 40 }}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[1, 3, 2]} intensity={1.5} />
          <pointLight position={[-1, -2, 1]} intensity={1.0} color="#f43f5e" />
          <pointLight position={[1, -2, 1]} intensity={1.0} color="#22d3ee" />
          <PrimitiveCollage />
        </Canvas>
      )}
    </div>
  );
}
