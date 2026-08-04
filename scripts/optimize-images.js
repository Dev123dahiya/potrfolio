const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const originalsDir = path.join(root, 'public', 'originals');
const outDir = path.join(root, 'public');

const images = [
  { name: 'ethara' },
  { name: 'maq' },
];

async function processImage(name) {
  const input = path.join(originalsDir, `${name}.jpg`);
  if (!fs.existsSync(input)) {
    console.warn(`Skipping ${name}: ${input} not found`);
    return;
  }
  const outWebp = path.join(outDir, `${name}.webp`);
  const outJpg = path.join(outDir, `${name}.jpg`);

  try {
    await sharp(input)
      .resize({ width: 1600 })
      .webp({ quality: 80 })
      .toFile(outWebp);
    await sharp(input)
      .resize({ width: 1600 })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(outJpg);
    console.log(`Optimized ${name}: wrote ${path.relative(root, outWebp)} and ${path.relative(root, outJpg)}`);
  } catch (err) {
    console.error(`Error processing ${name}:`, err);
  }
}

async function run() {
  if (!fs.existsSync(originalsDir)) fs.mkdirSync(originalsDir, { recursive: true });
  for (const img of images) {
    // process sequentially
    // eslint-disable-next-line no-await-in-loop
    await processImage(img.name);
  }
}

run().catch((e) => { console.error(e); process.exit(1); });
