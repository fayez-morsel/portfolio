const sharp = require('sharp');
const fs = require('fs');

async function processAvatar(inputPath, outputPath) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;
  const pixels = new Uint8ClampedArray(data);

  // Sample top-left corner color and alpha
  const bgR = pixels[0];
  const bgG = pixels[1];
  const bgB = pixels[2];

  // Visited flags for flood fill
  const visited = new Uint8Array(w * h);
  const queue = [];

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
  const isBgColor = (r, g, b) => {
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
    const r = pixels[idx];
    const g = pixels[idx + 1];
    const b = pixels[idx + 2];

    // Clear background gray OR the bottom-right sparkle icon region
    const isSparkleRegion = cx > w * 0.80 && cy > h * 0.80;

    if (isBgColor(r, g, b) || isSparkleRegion) {
      pixels[idx + 3] = 0; // Set alpha transparency to 0

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

  // Edge smoothing (feathering)
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = (y * w + x) * 4;
      if (pixels[idx + 3] > 0) {
        const t1 = pixels[((y - 1) * w + x) * 4 + 3] === 0;
        const t2 = pixels[((y + 1) * w + x) * 4 + 3] === 0;
        const t3 = pixels[(y * w + x - 1) * 4 + 3] === 0;
        const t4 = pixels[(y * w + x + 1) * 4 + 3] === 0;

        if (t1 || t2 || t3 || t4) {
          const r = pixels[idx];
          const g = pixels[idx + 1];
          const b = pixels[idx + 2];
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const saturation = max - min;

          if (saturation < 35) {
            const factor = Math.max(0, saturation / 35);
            pixels[idx + 3] = Math.round(pixels[idx + 3] * factor);
          }
        }
      }
    }
  }

  // Save processed raw pixels as PNG
  await sharp(Buffer.from(pixels), {
    raw: {
      width: w,
      height: h,
      channels: 4
    }
  })
    .png()
    .toFile(outputPath);

  console.log(`Successfully saved transparent PNG: ${outputPath}`);
}

processAvatar('public/assets/user_avatar.png', 'public/assets/user_avatar_processed.png').catch(console.error);
