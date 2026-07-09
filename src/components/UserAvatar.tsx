"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import avatarImg from "../../public/assets/user_avatar_processed.png";

export default function UserAvatar({ isMobile = false }: { isMobile?: boolean }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="w-full h-full flex items-center justify-center relative select-none">
      {/* 1. Pulser Glow Background Placeholder */}
      <AnimatePresence>
        {!loaded && (
          <motion.div
            initial={{ opacity: 0.6 }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            exit={{ opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            {/* Soft pink/purple glow */}
            <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full bg-gradient-to-tr from-accent-pink/20 to-accent-violet/30 blur-[60px]" />
            {/* Shimmer overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Floating wrapper for image */}
      <div className="w-full h-full animate-float-1">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          animate={loaded ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full flex items-center justify-center"
        >
          <Image
            src={avatarImg}
            alt="User Avatar"
            priority
            quality={90}
            placeholder="blur"
            onLoad={() => setLoaded(true)}
            className="w-full h-full object-contain max-w-[440px] md:max-w-[550px]"
            sizes="(max-width: 768px) 100vw, 550px"
          />
        </motion.div>
      </div>
    </div>
  );
}
