import { SPONSORS } from '../data/sponsors.js';

// Sponsor decals for the 3D car, painted into the body's texture atlas using the
// visor's fixed UV zones. UTN (white, institutional slot) and JDM (main upper
// stripe) sit on top; the rest fill the remaining zones, different on each side.
const TOP_SPONSOR = 'JDM Inyección';
const INSTITUTION = 'UTN BA';

const loadImage = src => new Promise((resolve, reject) => {
  const image = new Image();
  image.onload = () => resolve(image);
  image.onerror = reject;
  image.src = src;
});

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// White sticker filling the zone, logo centred inside with breathing room.
function drawDecal(ctx, image, [u, v, w, h], size) {
  const x = u * size, y = v * size, width = w * size, height = h * size;
  const inset = Math.min(width, height) * 0.06;
  ctx.fillStyle = '#ffffff';
  roundRect(ctx, x + inset, y + inset, width - inset * 2, height - inset * 2, Math.min(width, height) * 0.18);
  ctx.fill();
  // SVGs without intrinsic size report 0: assume a wide wordmark.
  const aspect = (image.naturalWidth || 300) / (image.naturalHeight || 100);
  const maxW = width * 0.8, maxH = height * 0.66;
  const dw = Math.min(maxW, maxH * aspect), dh = dw / aspect;
  ctx.drawImage(image, x + (width - dw) / 2, y + (height - dh) / 2, dw, dh);
}

export async function applyLivery(renderer) {
  const { zones, reserved } = await import(/* @vite-ignore */ String('/visor/zones.js?v=no-sae-20'));
  const mobile = matchMedia('(pointer: coarse)').matches || innerWidth < 800;
  const size = mobile ? 2048 : 4096;

  const isMain = zone => zone.id.endsWith('-principal');
  const left = zones.filter(z => z.id.startsWith('l-') && !isMain(z));
  const right = zones.filter(z => z.id.startsWith('r-') && !isMain(z));
  const rest = SPONSORS.filter(s => s.name !== TOP_SPONSOR && s.name !== INSTITUTION);
  // shortcut: 7 zones per side fit 14 of the remaining sponsors; the rest stay off the car until more zones exist.
  const placements = [
    ...zones.filter(isMain).map(zone => [zone, SPONSORS.find(s => s.name === TOP_SPONSOR)]),
    ...left.map((zone, i) => [zone, rest[i]]),
    ...right.map((zone, i) => [zone, rest[left.length + i]]),
  ].filter(([, sponsor]) => sponsor);

  const images = new Map(await Promise.all([...new Set(placements.map(([, s]) => s.logo))]
    .map(src => loadImage(src).then(image => [src, image], () => [src, null]))));

  const atlas = document.createElement('canvas');
  atlas.width = atlas.height = size;
  const ctx = atlas.getContext('2d');
  for (const [zone, sponsor] of placements) {
    const image = images.get(sponsor.logo);
    if (image) drawDecal(ctx, image, zone.box, size);
  }
  renderer.setReservations(atlas);

  // Same crop the visor uses for the white UTN wordmark.
  const utn = await loadImage('/visor/assets/utn-ba-white.png');
  const mark = document.createElement('canvas');
  mark.width = 2880; mark.height = 788;
  mark.getContext('2d').drawImage(utn, 95, 51, 2880, 788, 0, 0, 2880, 788);
  renderer.setInstitution(mark, reserved.filter(z => z.kind === 'utn').map(z => z.box));
  atlas.width = atlas.height = 0;
  mark.width = mark.height = 0;
}
