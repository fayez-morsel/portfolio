const sharp = require('sharp');
const fs = require('fs');

async function fixCrystal() {
  const filePath = 'public/assets/floating_crystal.png';
  console.log('Reading:', filePath);
  const { data, info } = await sharp(filePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;
  const pixels = new Uint8ClampedArray(data);

  for (let i = 0; i < pixels.length; i += 4) {
    const pixelIndex = i / 4;
    const y = Math.floor(pixelIndex / w);

    if (y > h * 0.65) {
      pixels[i + 3] = 0; // erase reflection
    }
  }

  await sharp(Buffer.from(pixels), {
    raw: {
      width: w,
      height: h,
      channels: 4
    }
  })
    .png()
    .toFile('public/assets/floating_crystal.png');

  console.log('Fixed crystal reflection!');
}

fixCrystal().catch(console.error);
