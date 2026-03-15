/**
 * Creates images/demo.gif from the hangman stage images.
 * Run: npm install && npm run make-demo-gif
 *
 * Uses gif-encoder (no native dependencies). PNGs are read with pngjs.
 */

const fs = require('fs');
const path = require('path');
const GifEncoder = require('gif-encoder');
const { PNG } = require('pngjs');

const IMGDIR = path.join(__dirname, 'images');
const OUT_PATH = path.join(IMGDIR, 'demo.gif');

// Smaller size = smaller file. 320 is a good balance for README demos.
const MAX_SIZE = 320;

const frameFiles = [
  'hangman-0.png',
  'hangman-1.png',
  'hangman-2.png',
  'hangman-3.png',
  'hangman-4.png',
  'hangman-5.png',
  'hangman-6.png',
  'Hangman-win.png'
];

function readPng(filePath) {
  return new Promise((resolve, reject) => {
    const data = fs.readFileSync(filePath);
    new PNG().parse(data, (err, parsed) => {
      if (err) reject(err);
      else resolve(parsed);
    });
  });
}

/** Downscale RGBA buffer to fit within MAX_SIZE, keep aspect ratio. */
function downscale(png) {
  const w = png.width;
  const h = png.height;
  if (w <= MAX_SIZE && h <= MAX_SIZE) {
    return { width: w, height: h, data: Array.from(png.data) };
  }
  const scale = Math.min(MAX_SIZE / w, MAX_SIZE / h);
  const nw = Math.round(w * scale);
  const nh = Math.round(h * scale);
  const out = new Array(nw * nh * 4);
  for (let y = 0; y < nh; y++) {
    for (let x = 0; x < nw; x++) {
      const srcX = Math.floor((x / nw) * w);
      const srcY = Math.floor((y / nh) * h);
      const srcI = (srcY * w + srcX) * 4;
      const dstI = (y * nw + x) * 4;
      out[dstI] = png.data[srcI];
      out[dstI + 1] = png.data[srcI + 1];
      out[dstI + 2] = png.data[srcI + 2];
      out[dstI + 3] = png.data[srcI + 3];
    }
  }
  return { width: nw, height: nh, data: out };
}

async function main() {
  let width = 0;
  let height = 0;
  const frames = [];

  for (const name of frameFiles) {
    const filePath = path.join(IMGDIR, name);
    if (!fs.existsSync(filePath)) {
      console.error('Missing:', filePath);
      process.exit(1);
    }
    const png = await readPng(filePath);
    const scaled = downscale(png);
    width = scaled.width;
    height = scaled.height;
    frames.push(scaled.data);
  }

  const gif = new GifEncoder(width, height, { highWaterMark: 10 * 1024 * 1024 });
  gif.setDelay(1000);
  gif.setRepeat(0);
  gif.setQuality(20);

  const out = fs.createWriteStream(OUT_PATH);
  gif.pipe(out);

  gif.writeHeader();
  for (const pixels of frames) {
    gif.addFrame(pixels);
  }
  gif.finish();

  await new Promise((resolve, reject) => {
    out.on('finish', resolve);
    out.on('error', reject);
  });
  console.log('Created:', OUT_PATH);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
