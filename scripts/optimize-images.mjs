// One-off / repeatable image optimisation for the Beli Drim site.
// Run from the project root with:  node scripts/optimize-images.mjs
// Requires sharp + png-to-ico (install with: npm install --no-save sharp png-to-ico)
//
// What it does:
//  1. Resizes + recompresses the visible photos and emits .jpg (mozjpeg) +
//     .webp + .avif at sensible widths so they can be served via <picture>.
//  2. Re-encodes highway.jpg as a lean OG/social image (JPEG only — crawlers
//     don't reliably read webp/avif for og:image).
//  3. Builds a full favicon / PWA-icon set from the brand wordmark, recoloured
//     white on a navy tile to match the navbar treatment.
// Prints the final pixel dimensions of every photo so the HTML can carry exact
// width/height attributes (prevents layout shift).

import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const IMG = 'src/img';
const NAVY = '#0d2440';

// width = max target width; portrait/landscape ratios are preserved.
// withoutEnlargement keeps images that are already smaller untouched.
const PHOTOS = [
  ['truck1.jpg', 1200], // about-preview (~half width) + gallery slide 1
  ['truck2.jpg', 1600], // home hero background (full-bleed)
  ['bd1.jpg', 1000],
  ['bd2.jpg', 1000],
  ['bd3.jpg', 1000],
  ['bd4.jpg', 1000],
  ['bd5.jpg', 1000],
  ['bd6.jpg', 1000],
  ['bd7.jpg', 1000],
  ['bd8.jpg', 1000],
  ['bd9.jpg', 1000],
  ['bd10.jpg', 1000],
];

const dims = {};

async function processPhotos() {
  for (const [file, width] of PHOTOS) {
    const input = join(IMG, file);
    const stem = file.replace(/\.jpg$/, '');
    // Decode the original into memory first so we can safely overwrite the .jpg.
    const buf = readFileSync(input);
    const pipeline = () =>
      sharp(buf).rotate().resize({ width, withoutEnlargement: true });

    await pipeline().jpeg({ quality: 80, mozjpeg: true }).toFile(input + '.tmp');
    writeFileSync(input, readFileSync(input + '.tmp'));
    const { unlinkSync } = await import('node:fs');
    unlinkSync(input + '.tmp');

    await pipeline().webp({ quality: 78 }).toFile(join(IMG, stem + '.webp'));
    await pipeline().avif({ quality: 50, effort: 3 }).toFile(join(IMG, stem + '.avif'));

    const meta = await sharp(readFileSync(input)).metadata();
    dims[file] = { w: meta.width, h: meta.height };
  }
}

async function processOg() {
  // OG image: JPEG only, capped at 1200px wide.
  const input = join(IMG, 'highway.jpg');
  const buf = readFileSync(input);
  await sharp(buf)
    .rotate()
    .resize({ width: 1200, withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(input + '.tmp');
  writeFileSync(input, readFileSync(input + '.tmp'));
  const { unlinkSync } = await import('node:fs');
  unlinkSync(input + '.tmp');
  const meta = await sharp(readFileSync(input)).metadata();
  dims['highway.jpg'] = { w: meta.width, h: meta.height };
}

async function buildIcons() {
  // Recolour the (blue) wordmark to white so it reads on the navy tile,
  // matching the navbar's brightness(0) invert(1) treatment.
  const svg = readFileSync(join(IMG, 'logoBD.svg'), 'utf8');
  const whiteSvg = Buffer.from(svg.replace(/fill="#[0-9a-fA-F]{3,6}"/g, 'fill="#ffffff"'));

  async function tile(size) {
    const pad = Math.round(size * 0.14);
    const logo = await sharp(whiteSvg)
      .resize({ width: size - pad * 2, fit: 'inside' })
      .png()
      .toBuffer();
    return sharp({
      create: { width: size, height: size, channels: 4, background: NAVY },
    })
      .composite([{ input: logo, gravity: 'center' }])
      .png()
      .toBuffer();
  }

  const targets = [
    ['favicon-16.png', 16],
    ['favicon-32.png', 32],
    ['favicon-48.png', 48],
    ['apple-touch-icon.png', 180],
    ['icon-192.png', 192],
    ['icon-512.png', 512],
  ];
  for (const [name, size] of targets) {
    writeFileSync(join(IMG, name), await tile(size));
  }
  // Multi-resolution .ico for legacy/desktop.
  const ico = await pngToIco([
    join(IMG, 'favicon-16.png'),
    join(IMG, 'favicon-32.png'),
    join(IMG, 'favicon-48.png'),
  ]);
  writeFileSync(join(IMG, 'favicon.ico'), ico);
}

await processPhotos();
await processOg();
await buildIcons();

console.log('PHOTO DIMENSIONS (for width/height attrs):');
for (const [file, d] of Object.entries(dims)) {
  console.log(`  ${file.padEnd(14)} ${d.w}x${d.h}`);
}
console.log('Done.');
