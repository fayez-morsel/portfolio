"use client";

import React from "react";

export default function AboutLeftCanvas() {
  return (
    <div className="w-full h-full relative">
      {/* Star (top-left) */}
      <div className="absolute top-[15%] left-[15%] w-[130px] h-[130px] animate-float-1">
        <img
          src="/assets/floating_star.png"
          alt="Floating Star"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Heart (bottom-left) */}
      <div className="absolute bottom-[15%] right-[15%] w-[130px] h-[130px] animate-float-2">
        <img
          src="/assets/floating_heart.png"
          alt="Floating Heart"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
}
