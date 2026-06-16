// Generates src/img/og-default.jpg — a branded 1200x630 (1.91:1) social share
// card used by og:image / twitter:image on every page.  npm run og
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const W = 1200;
const H = 630;

const svg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0d2440" stop-opacity="0.30"/>
      <stop offset="50%" stop-color="#0d2440" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#0d2440" stop-opacity="0.92"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <g font-family="Helvetica, Arial, sans-serif">
    <text x="80" y="430" font-size="110" font-weight="bold" fill="#ffffff" letter-spacing="3">BELI DRIM</text>
    <text x="84" y="500" font-size="42" font-weight="bold" fill="#f4a51c">Transport robe · Kraljevo, Srbija</text>
    <text x="84" y="552" font-size="30" fill="#e6edf6">belidrim.rs</text>
  </g>
</svg>`;

const base = await sharp(join(root, 'src/img/truck2.jpg'))
  .resize(W, H, { fit: 'cover', position: 'centre' })
  .toBuffer();

await sharp(base)
  .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(join(root, 'src/img/og-default.jpg'));

console.log('Wrote src/img/og-default.jpg (1200x630)');
