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

// Output size: larger = sharper GIF, bigger file. 640 keeps the drawing clear.
const MAX_SIZE = 640;

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

/** Sample RGBA at (fx, fy) with bilinear interpolation. */
function sample(png, fx, fy) {
  const w = png.width;
  const h = png.height;
  const x0 = Math.min(Math.floor(fx), w - 1);
  const y0 = Math.min(Math.floor(fy), h - 1);
  const x1 = Math.min(x0 + 1, w - 1);
  const y1 = Math.min(y0 + 1, h - 1);
  const tx = fx - x0;
  const ty = fy - y0;
  const i = (i, j) => ((j * w + i) * 4);
  const r = (1 - tx) * (1 - ty) * png.data[i(x0, y0)] + tx * (1 - ty) * png.data[i(x1, y0)] +
    (1 - tx) * ty * png.data[i(x0, y1)] + tx * ty * png.data[i(x1, y1)];
  const g = (1 - tx) * (1 - ty) * png.data[i(x0, y0) + 1] + tx * (1 - ty) * png.data[i(x1, y0) + 1] +
    (1 - tx) * ty * png.data[i(x0, y1) + 1] + tx * ty * png.data[i(x1, y1) + 1];
  const b = (1 - tx) * (1 - ty) * png.data[i(x0, y0) + 2] + tx * (1 - ty) * png.data[i(x1, y0) + 2] +
    (1 - tx) * ty * png.data[i(x0, y1) + 2] + tx * ty * png.data[i(x1, y1) + 2];
  const a = (1 - tx) * (1 - ty) * png.data[i(x0, y0) + 3] + tx * (1 - ty) * png.data[i(x1, y0) + 3] +
    (1 - tx) * ty * png.data[i(x0, y1) + 3] + tx * ty * png.data[i(x1, y1) + 3];
  return [Math.round(r), Math.round(g), Math.round(b), Math.round(a)];
}

/** Downscale RGBA buffer to fit within MAX_SIZE, keep aspect ratio. Uses bilinear for smoother lines. */
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
      const srcX = (x + 0.5) / nw * w - 0.5;
      const srcY = (y + 0.5) / nh * h - 0.5;
      const [r, g, b, a] = sample(png, srcX, srcY);
      const dstI = (y * nw + x) * 4;
      out[dstI] = r;
      out[dstI + 1] = g;
      out[dstI + 2] = b;
      out[dstI + 3] = a;
    }
  }
  return { width: nw, height: nh, data: out };
}

/** Replace black/dark background pixels with white (GIF background). */
function blackToWhite(data) {
  const out = data.slice();
  for (let i = 0; i < out.length; i += 4) {
    const r = out[i];
    const g = out[i + 1];
    const b = out[i + 2];
    if (r < 30 && g < 30 && b < 30) {
      out[i] = 255;
      out[i + 1] = 255;
      out[i + 2] = 255;
    }
  }
  return out;
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
    frames.push(blackToWhite(scaled.data));
  }

  const gif = new GifEncoder(width, height, { highWaterMark: 10 * 1024 * 1024 });
  gif.setDelay(1000);
  gif.setRepeat(0);
  gif.setQuality(10);

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
