const sharp = require('sharp');
const fs = require('fs');

async function processCube(inputPath, outputPath) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;
  const pixels = new Uint8ClampedArray(data);

  // Flood fill background detection
  const visited = new Uint8Array(w * h);
  const queue = [];

  // Add all boundary pixels to queue
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

  const isBgColor = (r, g, b) => {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const saturation = max - min;
    const brightness = (r + g + b) / 3;

    // Match bright neutral backgrounds (checkerboards/gradients)
    return saturation < 30 && brightness > 120;
  };

  let head = 0;
  while (head < queue.length) {
    const [cx, cy] = queue[head++];
    const idx = (cy * w + cx) * 4;
    const r = pixels[idx];
    const g = pixels[idx + 1];
    const b = pixels[idx + 2];

    if (isBgColor(r, g, b)) {
      pixels[idx + 3] = 0; // Set alpha to 0

      const neighbors = [
        [cx + 1, cy],
        [cx - 1, cy],
        [cx, cy + 1],
        [cx, cy - 1]
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

processCube('C:/Users/ASUS/.gemini/antigravity/brain/8887cfd5-3894-43da-b461-b253161c54b8/media__1783265664969.jpg', 'public/assets/floating_crystal.png').catch(console.error);
