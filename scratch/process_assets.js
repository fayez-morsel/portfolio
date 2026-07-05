const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function processImage(inputPath, outputPath) {
  console.log(`Processing ${inputPath} -> ${outputPath}...`);
  
  // 1. Load image and get raw RGBA buffer
  const { data, info } = await sharp(inputPath)
    .ensureAlpha() // Ensure it has an alpha channel
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;
  const pixels = new Uint8ClampedArray(data);

  const isFlowerOrHeart = inputPath.includes('flower') || inputPath.includes('heart');
  const isCrystal = inputPath.includes('crystal');

  if (isFlowerOrHeart) {
    // Pure pixel-based keyer for the flower and heart to completely remove background & shadows
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const saturation = max - min;

      // Keep only high-saturation colors (the flower petals/center and red heart)
      // Key out everything else (gradient background + shadows)
      if (saturation < 45) {
        pixels[i + 3] = 0;
      }
    }
  } else if (isCrystal) {
    // Pure pixel keyer for crystal: remove only dark background/reflections and gray crop overlays
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const saturation = max - min;
      const brightness = (r + g + b) / 3;

      // Key out dark pixels (background, reflection) and crop arrow overlays (neutral, medium brightness)
      const isDarkBg = brightness < 45;
      const isCropOverlay = saturation < 25 && brightness < 150 && brightness > 45;

      if (isDarkBg || isCropOverlay) {
        pixels[i + 3] = 0;
      }
    }
  } else {
    // Flood fill background detection (for star, heart, crystal)
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

      // Match bright neutral backgrounds (checkerboards/gradients) OR solid dark/black backgrounds
      return (saturation < 45 && brightness > 120) || (brightness < 35);
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
  }

  // 3. Edge smoothing (feathering)
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

  // 4. Save processed raw pixels as PNG
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

async function main() {
  const assetsDir = path.join(__dirname, '..', 'public', 'assets');
  const tempDir = path.join(__dirname);
  
  const files = [
    { name: 'floating_star.png', tempName: 'floating_star_temp.jpg' },
    { name: 'floating_heart.png', tempName: 'floating_heart_temp.jpg' },
    { name: 'floating_crystal.png', tempName: 'floating_crystal_temp.jpg' },
    { name: 'floating_flower.png', tempName: 'floating_flower_temp.jpg' }
  ];

  for (const file of files) {
    const originalPath = path.join(assetsDir, file.name);
    const tempPath = path.join(tempDir, file.tempName);
    
    // Copy original JPEG file to temp path
    fs.copyFileSync(originalPath, tempPath);
    
    // Process the JPEG and output a real PNG to the original path!
    await processImage(tempPath, originalPath);
    
    // Clean up temp file
    try {
      fs.unlinkSync(tempPath);
    } catch (e) {}
  }
}

main().catch(console.error);
