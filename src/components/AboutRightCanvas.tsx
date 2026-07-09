"use client";

import React from "react";

export default function AboutRightCanvas() {
  return (
    <div className="w-full h-full relative">
      {/* Crystal / Cubes (top-right) */}
      <div className="absolute top-[15%] right-[15%] w-[130px] h-[130px] animate-float-2">
        <img
          src="/assets/floating_crystal.png?v=4"
          alt="Floating Crystal"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Flower (bottom-right) */}
      <div className="absolute bottom-[15%] left-[15%] w-[130px] h-[130px] animate-float-4">
        <img
          src="/assets/floating_flower.png"
          alt="Floating Flower"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
}
