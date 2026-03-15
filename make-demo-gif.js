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
    width = png.width;
    height = png.height;
    // gif-encoder expects an Array of RGBA (r, g, b, a, r, g, b, a, ...)
    frames.push(Array.from(png.data));
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
