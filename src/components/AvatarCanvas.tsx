"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function StylizedHead() {
  const headGroupRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Autonomous floating animation — no mouse tracking on any device
    const autoX = Math.sin(time * 0.8) * 0.3;
    const autoY = Math.cos(time * 0.6) * 0.12;

    if (headGroupRef.current) {
      headGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        headGroupRef.current.rotation.y,
        autoX,
        0.05
      );
      headGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        headGroupRef.current.rotation.x,
        autoY,
        0.05
      );
      headGroupRef.current.position.y = Math.sin(time * 1.5) * 0.05;
    }

    if (leftEyeRef.current && rightEyeRef.current) {
      leftEyeRef.current.rotation.y = autoX * 1.1;
      leftEyeRef.current.rotation.x = autoY * 1.1;
      rightEyeRef.current.rotation.y = autoX * 1.1;
      rightEyeRef.current.rotation.x = autoY * 1.1;
    }
  });

  return (
    <group ref={headGroupRef}>
      {/* Floating head only, no body/neck */}

      {/* Head Base */}
      <mesh position={[0, 0, 0]} scale={[1, 1.22, 0.95]}>
        <sphereGeometry args={[0.95, 32, 32]} />
        <meshStandardMaterial color="#f0be9d" roughness={0.5} />
      </mesh>

      {/* Large Ears */}
      {/* Left Ear */}
      <mesh position={[-0.96, 0.1, -0.05]} scale={[0.15, 0.28, 0.22]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#f0be9d" roughness={0.55} />
      </mesh>
      {/* Right Ear */}
      <mesh position={[0.96, 0.1, -0.05]} scale={[0.15, 0.28, 0.22]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#f0be9d" roughness={0.55} />
      </mesh>

      {/* Silver Hoop Earrings */}
      {/* Left Earring */}
      <mesh position={[-0.98, -0.15, 0.0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.18, 0.024, 8, 24]} />
        <meshStandardMaterial color="#d1d5db" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Right Earring */}
      <mesh position={[0.98, -0.15, 0.0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.18, 0.024, 8, 24]} />
        <meshStandardMaterial color="#d1d5db" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Voluminous Messy Hair with Blonde/Gray Highlights */}
      <group>
        {/* Base back hair */}
        <mesh position={[0, 0.1, -0.32]} scale={[1.0, 1.05, 0.72]}>
          <sphereGeometry args={[0.9, 16, 16]} />
          <meshStandardMaterial color="#22140f" roughness={0.9} />
        </mesh>
        {/* Top hair volume */}
        <mesh position={[0, 0.65, 0.05]} scale={[0.92, 0.52, 0.85]}>
          <sphereGeometry args={[0.9, 16, 16]} />
          <meshStandardMaterial color="#22140f" roughness={0.9} />
        </mesh>
        
        {/* Messy locks - Dark Brown & Blonde highlights */}
        <mesh position={[-0.35, 0.82, 0.3]} rotation={[0.2, -0.2, 0.4]} scale={[0.3, 0.22, 0.4]}>
          <sphereGeometry args={[0.9, 8, 8]} />
          <meshStandardMaterial color="#d4b279" roughness={0.9} />
        </mesh>
        <mesh position={[0.32, 0.85, 0.25]} rotation={[0.2, 0.2, -0.3]} scale={[0.35, 0.24, 0.45]}>
          <sphereGeometry args={[0.9, 8, 8]} />
          <meshStandardMaterial color="#22140f" roughness={0.9} />
        </mesh>
        <mesh position={[-0.22, 0.62, 0.68]} rotation={[-0.3, -0.1, 0.2]} scale={[0.24, 0.16, 0.35]}>
          <sphereGeometry args={[0.9, 8, 8]} />
          <meshStandardMaterial color="#d4b279" roughness={0.9} />
        </mesh>
        <mesh position={[0.22, 0.64, 0.66]} rotation={[-0.3, 0.1, -0.2]} scale={[0.25, 0.18, 0.38]}>
          <sphereGeometry args={[0.9, 8, 8]} />
          <meshStandardMaterial color="#22140f" roughness={0.9} />
        </mesh>
        <mesh position={[0.0, 0.86, -0.15]} scale={[0.42, 0.22, 0.5]}>
          <sphereGeometry args={[0.9, 8, 8]} />
          <meshStandardMaterial color="#d4b279" roughness={0.9} />
        </mesh>
        <mesh position={[-0.82, 0.36, 0.15]} scale={[0.22, 0.36, 0.28]}>
          <sphereGeometry args={[0.9, 8, 8]} />
          <meshStandardMaterial color="#22140f" roughness={0.9} />
        </mesh>
        <mesh position={[0.82, 0.36, 0.15]} scale={[0.2, 0.32, 0.28]}>
          <sphereGeometry args={[0.9, 8, 8]} />
          <meshStandardMaterial color="#d4b279" roughness={0.9} />
        </mesh>
      </group>

      {/* Left Eye */}
      <group position={[-0.32, 0.15, 0.8]}>
        {/* Eyeball */}
        <mesh ref={leftEyeRef}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.1} />
          {/* Pupil */}
          <mesh position={[0, 0, 0.13]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#0e0e14" roughness={0.1} />
          </mesh>
        </mesh>
      </group>

      {/* Right Eye */}
      <group position={[0.32, 0.15, 0.8]}>
        {/* Eyeball */}
        <mesh ref={rightEyeRef}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.1} />
          {/* Pupil */}
          <mesh position={[0, 0, 0.13]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#0e0e14" roughness={0.1} />
          </mesh>
        </mesh>
      </group>

      {/* Thick Dark Eyebrows */}
      {/* Left Eyebrow */}
      <mesh position={[-0.32, 0.38, 0.82]} rotation={[0, 0, 0.06]} scale={[0.22, 0.06, 0.06]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#1a110e" roughness={0.9} />
      </mesh>
      {/* Right Eyebrow */}
      <mesh position={[0.32, 0.38, 0.82]} rotation={[0, 0, -0.06]} scale={[0.22, 0.06, 0.06]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#1a110e" roughness={0.9} />
      </mesh>

      {/* Nose */}
      <mesh position={[0, -0.05, 0.95]} scale={[0.12, 0.25, 0.16]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#e5b291" roughness={0.5} />
      </mesh>

      {/* Bored/Sad Mouth (Straight thin box) */}
      <mesh position={[0, -0.38, 0.82]} rotation={[-0.05, 0, 0]} scale={[0.26, 0.03, 0.06]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#8c4e4e" roughness={0.6} />
      </mesh>
    </group>
  );
}

export default function AvatarCanvas() {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        style={{ pointerEvents: "auto" }}
      >
        {/* Key Light: Top-Left soft shadows */}
        <directionalLight 
          position={[-5, 5, 5]} 
          intensity={1.5} 
          castShadow 
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        {/* Fill Light: Soft right shadow soften */}
        <directionalLight 
          position={[5, 2, 2]} 
          intensity={0.4} 
        />
        {/* Rim Light: High intensity back rim glow */}
        <directionalLight 
          position={[0, 4, -5]} 
          intensity={2.5} 
          color="#d8b4fe" 
        />
        <ambientLight intensity={0.2} />
        
        <StylizedHead />
      </Canvas>
    </div>
  );
}
