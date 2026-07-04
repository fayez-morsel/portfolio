"use client";

import React, { useEffect, useRef, useState } from "react";

export default function UserAvatar({ isMobile = false }: { isMobile?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Floating loop: circular translation (top -> right -> bottom -> left)
  useEffect(() => {
    let frameId: number;
    const startTime = Date.now();
    
    const loop = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      // x = sin, y = cos sweeps a smooth continuous circle
      const x = Math.sin(elapsed * 1.4) * 20;
      const y = Math.cos(elapsed * 1.4) * 20;
      setOffset({ x, y });
      frameId = requestAnimationFrame(loop);
    };
    
    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Image load & background removal canvas processor
  useEffect(() => {
    const img = new Image();
    img.src = "/assets/user_avatar.png";
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const w = img.width;
      const h = img.height;
      canvas.width = w;
      canvas.height = h;

      // Draw original image
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;

      // Sample top-left corner color and alpha
      const bgR = data[0];
      const bgG = data[1];
      const bgB = data[2];
      const bgA = data[3];

      // If the top-left pixel is not already transparent, clear the checkerboard/solid background
      if (bgA > 10) {
        // Visited flags for flood fill
        const visited = new Uint8Array(w * h);
        const queue: [number, number][] = [];

        // Add all boundary pixels to the queue
        for (let x = 0; x < w; x++) {
          queue.push([x, 0]);
          queue.push([x, h - 1]);
          visited[0 * w + x] = 1;
          visited[(h - 1) * w + x] = 1;
        }
        for (let y = 0; y < h; y++) {
          queue.push([0, y]);
          queue.push([w - 1, y]);
          visited[y * w + 0] = 1;
          visited[y * w + w - 1] = 1;
        }

        // Detect background color dynamically based on corner sample and checkerboard patterns
        const isBgColor = (r: number, g: number, b: number) => {
          // 1. Checkerboard White (RGB > 205)
          if (r > 205 && g > 205 && b > 205) return true;
          // 2. Checkerboard Gray (neutral gray between 150 and 205)
          if (r > 150 && r < 206 && g > 150 && g < 206 && b > 150 && b < 206) {
            if (Math.abs(r - g) < 15 && Math.abs(g - b) < 15 && Math.abs(r - b) < 15) {
              return true;
            }
          }
          // 3. Fallback: Solid background color dynamic sample
          const diffR = Math.abs(r - bgR);
          const diffG = Math.abs(g - bgG);
          const diffB = Math.abs(b - bgB);
          return diffR < 15 && diffG < 15 && diffB < 15;
        };

        // Flood fill traversal
        let head = 0;
        while (head < queue.length) {
          const [cx, cy] = queue[head++];
          const idx = (cy * w + cx) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];

          // Clear background gray OR the bottom-right sparkle icon region
          const isSparkleRegion = cx > w * 0.80 && cy > h * 0.80;

          if (isBgColor(r, g, b) || isSparkleRegion) {
            data[idx + 3] = 0; // Set alpha transparency to 0

            // Check 4-connected neighbors
            const neighbors = [
              [cx + 1, cy],
              [cx - 1, cy],
              [cx, cy + 1],
              [cx, cy - 1],
            ];

            for (const [nx, ny] of neighbors) {
              if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                const nidx = ny * w + nx;
                if (visited[nidx] === 0) {
                  visited[nidx] = 1;
                  queue.push([nx, ny]);
                }
              }
            }
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      setImageLoaded(true);
    };
  }, []);

  return (
    <div 
      className="w-full h-full flex items-center justify-center relative select-none"
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
      }}
    >
      <canvas
        ref={canvasRef}
        className={`w-full h-full object-contain max-w-[440px] md:max-w-[550px] transition-opacity duration-700 ${
          imageLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
