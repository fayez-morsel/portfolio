"use client";

import React from "react";

export default function UserAvatar({ isMobile = false }: { isMobile?: boolean }) {
  return (
    <div className="w-full h-full flex items-center justify-center relative select-none">
      <div className="w-full h-full animate-float-1">
        <img
          src="/assets/user_avatar_processed.png?v=1"
          alt="User Avatar"
          className="w-full h-full object-contain max-w-[440px] md:max-w-[550px]"
        />
      </div>
    </div>
  );
}
