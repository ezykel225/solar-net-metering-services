/**
 * Generates the illustrated placeholder images used across the site.
 *
 * Run with: npm run images:placeholders
 *
 * These are stand-ins until real project photography is available. To use
 * real photos, simply replace the files in /public/images (keep the same
 * file names, or update the paths in src/data/*.ts). The site never
 * depends on this script at build time.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public", "images");

/* ---------- shared building blocks ---------- */

const PANEL_DEFS = `
  <linearGradient id="panel" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#2b4f86"/>
    <stop offset="0.55" stop-color="#16315c"/>
    <stop offset="1" stop-color="#0d2142"/>
  </linearGradient>
  <linearGradient id="panelShine" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#ffffff" stop-opacity="0.35"/>
    <stop offset="0.4" stop-color="#ffffff" stop-opacity="0"/>
  </linearGradient>
  <radialGradient id="sunGlow">
    <stop offset="0" stop-color="#fff6d5" stop-opacity="1"/>
    <stop offset="0.25" stop-color="#ffd27a" stop-opacity="0.9"/>
    <stop offset="1" stop-color="#ffb347" stop-opacity="0"/>
  </radialGradient>
`;

function sky(w, h, top, bottom) {
  return `
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${top}"/>
      <stop offset="1" stop-color="${bottom}"/>
    </linearGradient>
  `;
}

function sun(cx, cy, r) {
  return `
    <circle cx="${cx}" cy="${cy}" r="${r * 4}" fill="url(#sunGlow)"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff3c4"/>
  `;
}

function cloud(x, y, s, opacity = 0.9) {
  return `<g fill="#ffffff" opacity="${opacity}" transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="0" cy="0" rx="70" ry="26"/>
    <ellipse cx="40" cy="-18" rx="46" ry="32"/>
    <ellipse cx="-34" cy="-10" rx="38" ry="24"/>
    <ellipse cx="86" cy="2" rx="42" ry="20"/>
  </g>`;
}

function tree(x, y, s, dark = "#2f6b3a", light = "#4c8f4f") {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <rect x="-7" y="-10" width="14" height="70" fill="#6b4a2f"/>
    <circle cx="0" cy="-60" r="52" fill="${dark}"/>
    <circle cx="-30" cy="-30" r="38" fill="${dark}"/>
    <circle cx="32" cy="-28" r="40" fill="${dark}"/>
    <circle cx="-10" cy="-78" r="30" fill="${light}" opacity="0.7"/>
    <circle cx="22" cy="-50" r="24" fill="${light}" opacity="0.5"/>
  </g>`;
}

function bush(x, y, s, color = "#3e7d45") {
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="${color}">
    <ellipse cx="0" cy="0" rx="40" ry="24"/>
    <ellipse cx="34" cy="4" rx="30" ry="20"/>
    <ellipse cx="-30" cy="6" rx="28" ry="18"/>
  </g>`;
}

/**
 * Draws a grid of solar panels in a local coordinate space (width x height)
 * that is mapped onto any parallelogram via an SVG affine matrix.
 */
function panelArray({ cols, rows, width, height, gap = 6, cellsX = 6, cellsY = 10, matrix }) {
  const pw = (width - gap * (cols - 1)) / cols;
  const ph = (height - gap * (rows - 1)) / rows;
  let out = `<g transform="matrix(${matrix.join(" ")})">`;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * (pw + gap);
      const y = r * (ph + gap);
      out += `<rect x="${x}" y="${y}" width="${pw}" height="${ph}" fill="url(#panel)" stroke="#c9d3e3" stroke-width="2"/>`;
      let lines = "";
      for (let i = 1; i < cellsX; i++) {
        const lx = x + (pw * i) / cellsX;
        lines += `M${lx} ${y}V${y + ph}`;
      }
      for (let j = 1; j < cellsY; j++) {
        const ly = y + (ph * j) / cellsY;
        lines += `M${x} ${ly}H${x + pw}`;
      }
      out += `<path d="${lines}" stroke="#5f7fb0" stroke-opacity="0.55" stroke-width="1"/>`;
      out += `<rect x="${x}" y="${y}" width="${pw}" height="${ph}" fill="url(#panelShine)"/>`;
    }
  }
  return out + "</g>";
}

/* ---------- scenes ---------- */

function residentialScene({ w = 1600, h = 1000, wall = "#f4efe6", roof = "#5b4a43", trim = "#ffffff", skyTop = "#7fb7e8", skyBottom = "#e7f2fb", sunX = 1380, sunY = 160, mirror = false, cols = 6, rows = 2 } = {}) {
  const ground = 790;
  const house = `
    <!-- gable wall -->
    <polygon points="300,${ground} 300,560 450,395 600,560 600,${ground}" fill="${wall}"/>
    <polygon points="300,${ground} 300,560 450,395 600,560 600,${ground}" fill="#000" opacity="0.08"/>
    <!-- front wall -->
    <rect x="600" y="560" width="800" height="${ground - 560}" fill="${wall}"/>
    <!-- roof plane -->
    <polygon points="440,385 1270,385 1430,568 600,568" fill="${roof}"/>
    <polygon points="440,385 290,568 312,568 450,410" fill="${trim}"/>
    <rect x="596" y="566" width="836" height="10" fill="${trim}"/>
    ${panelArray({ cols, rows, width: 700, height: 160, matrix: [1, 0, 0.744, 0.85, 518, 401] })}
    <!-- windows -->
    ${[680, 900, 1220]
      .map((x) => `<g><rect x="${x}" y="620" width="110" height="90" fill="#a9cbe6" stroke="${trim}" stroke-width="8"/><path d="M${x + 55} 620V710M${x} 665H${x + 110}" stroke="${trim}" stroke-width="5"/></g>`)
      .join("")}
    <rect x="1060" y="630" width="90" height="${ground - 630}" fill="#7a5236" stroke="${trim}" stroke-width="6"/>
    <circle cx="1135" cy="${ground - 75}" r="5" fill="#f5c26b"/>
    <rect x="370" y="610" width="90" height="80" fill="#a9cbe6" stroke="${trim}" stroke-width="8" opacity="0.9"/>
    <rect x="300" y="${ground - 8}" width="1100" height="8" fill="#000" opacity="0.08"/>
  `;
  const scene = `
    <rect width="${w}" height="${h}" fill="url(#sky)"/>
    ${sun(sunX, sunY, 46)}
    ${cloud(260, 170, 1.1)}${cloud(860, 120, 0.8, 0.8)}
    <path d="M0 ${ground - 70} Q 300 ${ground - 150} 650 ${ground - 80} T 1600 ${ground - 110} V ${h} H 0 Z" fill="#9cc79a" opacity="0.6"/>
    <rect y="${ground}" width="${w}" height="${h - ground}" fill="#6fae63"/>
    <rect y="${ground}" width="${w}" height="16" fill="#5b9a52"/>
    <path d="M1080 ${ground} L 1010 ${h} H 1210 L 1150 ${ground} Z" fill="#d9d2c3"/>
    ${tree(150, ground - 40, 1.6)}
    ${house}
    ${bush(380, ground + 10, 1.1)}${bush(760, ground + 12, 1.2)}${bush(1300, ground + 12, 1.1)}
    ${tree(1520, ground - 20, 1.3, "#2b6334", "#5a9a55")}
  `;
  const body = mirror ? `<g transform="translate(${w} 0) scale(-1 1)">${scene}</g>` : scene;
  return svg(w, h, sky(w, h, skyTop, skyBottom), body);
}

function commercialScene({ w = 1600, h = 1000, wall = "#dfe5ec", accent = "#0f2a4a", skyTop = "#6fa9df", skyBottom = "#e6f1fa" } = {}) {
  const ground = 800;
  // Flat roof seen slightly from above: front edge y=520, back edge offset (140,-150).
  const rowsMarkup = Array.from({ length: 5 })
    .map((_, i) => {
      const t = i / 5;
      const x = 180 + 140 * t + 40;
      const y = 520 - 150 * t - 28;
      const wRow = 1150;
      return panelArray({ cols: 14, rows: 1, width: wRow, height: 34, gap: 4, cellsX: 4, cellsY: 3, matrix: [1, 0, 0.35, 0.7, x, y - 6] });
    })
    .reverse()
    .join("");
  const body = `
    <rect width="${w}" height="${h}" fill="url(#sky)"/>
    ${sun(240, 150, 44)}
    ${cloud(700, 140, 1)}${cloud(1250, 210, 0.7, 0.8)}
    <rect y="${ground}" width="${w}" height="${h - ground}" fill="#b9bfc6"/>
    <rect y="${ground}" width="${w}" height="10" fill="#9aa1a9"/>
    <!-- side wall -->
    <polygon points="1400,520 1540,370 1540,${ground - 120} 1400,${ground}" fill="${wall}"/>
    <polygon points="1400,520 1540,370 1540,${ground - 120} 1400,${ground}" fill="#000" opacity="0.12"/>
    <!-- roof -->
    <polygon points="180,520 1400,520 1540,370 320,370" fill="#c7ced6"/>
    <polygon points="180,520 1400,520 1400,532 180,532" fill="#9aa4ae"/>
    ${rowsMarkup}
    <!-- front facade -->
    <rect x="180" y="530" width="1220" height="${ground - 530}" fill="${wall}"/>
    <rect x="180" y="530" width="1220" height="24" fill="${accent}"/>
    ${Array.from({ length: 9 })
      .map((_, i) => `<rect x="${220 + i * 130}" y="590" width="100" height="80" fill="#8fb7d9" stroke="#ffffff" stroke-width="5"/>`)
      .join("")}
    <rect x="700" y="690" width="200" height="${ground - 690}" fill="#6f95b8" stroke="#ffffff" stroke-width="6"/>
    <path d="M800 690V${ground}" stroke="#ffffff" stroke-width="5"/>
    <rect x="640" y="560" width="320" height="0" fill="none"/>
    ${tree(100, ground - 20, 1.3)}${bush(420, ground + 6, 1)}${bush(1100, ground + 6, 1)}
  `;
  return svg(w, h, sky(w, h, skyTop, skyBottom), body);
}

function groundMountScene({ w = 1600, h = 1000, skyTop = "#88bde9", skyBottom = "#fdeccc" } = {}) {
  const horizon = 520;
  let rows = "";
  for (let i = 0; i < 6; i++) {
    const t = i / 5; // 0 far, 1 near
    const y = horizon + 30 + Math.pow(t, 1.6) * 330;
    const scale = 0.35 + t * 0.85;
    const width = 1500 * scale + 300;
    const x = (w - width) / 2;
    const height = 70 * scale;
    rows += panelArray({ cols: Math.round(10 + t * 6), rows: 2, width, height, gap: 3 * scale + 1, cellsX: 4, cellsY: 3, matrix: [1, 0, 0.12, 0.85, x, y - height] });
    rows += `<rect x="${x + 20}" y="${y - 6}" width="${width - 40}" height="${4 + scale * 4}" fill="#2a2f36" opacity="0.35"/>`;
  }
  const body = `
    <rect width="${w}" height="${h}" fill="url(#sky)"/>
    ${sun(1250, 230, 56)}
    ${cloud(300, 160, 1)}${cloud(900, 110, 0.7, 0.75)}
    <path d="M0 ${horizon} Q 400 ${horizon - 90} 800 ${horizon - 30} T 1600 ${horizon - 60} V ${horizon + 40} H 0 Z" fill="#8bb27f"/>
    <rect y="${horizon}" width="${w}" height="${h - horizon}" fill="#7fb06a"/>
    ${tree(120, horizon + 10, 0.8)}${tree(1480, horizon + 6, 0.9)}${tree(1380, horizon + 12, 0.6)}
    ${rows}
  `;
  return svg(w, h, sky(w, h, skyTop, skyBottom), body);
}

function closeUpScene({ w = 1600, h = 1200 } = {}) {
  const body = `
    <rect width="${w}" height="${h}" fill="url(#sky)"/>
    ${sun(1320, 200, 60)}
    ${cloud(300, 180, 1.2)}
    <g transform="matrix(1 -0.18 0.55 0.6 -120 680)">
      <rect x="-80" y="-60" width="1700" height="1400" fill="#6a5a52"/>
      <path d="${Array.from({ length: 28 }, (_, i) => `M-80 ${-60 + i * 50}H1620`).join("")}" stroke="#56483f" stroke-width="6"/>
    </g>
    ${panelArray({ cols: 4, rows: 3, width: 1500, height: 900, gap: 14, cellsX: 6, cellsY: 10, matrix: [1, -0.18, 0.55, 0.6, -120, 680] })}
  `;
  return svg(w, h, sky(w, h, "#5ea3e0", "#d9ecfb"), body);
}

function ogScene() {
  const w = 1200;
  const h = 630;
  const inner = residentialScene({ w: 1600, h: 1000 })
    .replace(/^<svg[^>]*>/, "")
    .replace(/<\/svg>$/, "");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <svg x="420" y="0" width="780" height="630" viewBox="300 30 1200 970" preserveAspectRatio="xMidYMid slice">${inner}</svg>
    <rect width="560" height="${h}" fill="#0b1f3a"/>
    <polygon points="560,0 640,0 560,${h}" fill="#0b1f3a"/>
    <rect x="70" y="120" width="70" height="8" fill="#f5891f"/>
    <text x="70" y="210" font-family="Arial, Helvetica, sans-serif" font-size="56" font-weight="700" fill="#ffffff">Solar Net</text>
    <text x="70" y="275" font-family="Arial, Helvetica, sans-serif" font-size="56" font-weight="700" fill="#ffffff">Metering</text>
    <text x="70" y="340" font-family="Arial, Helvetica, sans-serif" font-size="56" font-weight="700" fill="#f5891f">Services</text>
    <text x="70" y="420" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="#c9d6e8">Solar installation &amp; net metering</text>
    <text x="70" y="456" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="#c9d6e8">for homes and businesses</text>
  </svg>`;
}

function svg(w, h, defs, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs>${PANEL_DEFS}${defs}</defs>${body}</svg>`;
}

/* ---------- output ---------- */

const images = [
  ["hero.jpg", residentialScene({ cols: 7 })],
  ["about.jpg", closeUpScene()],
  ["og-image.jpg", ogScene()],
  ["projects/residential-rooftop.jpg", residentialScene({ wall: "#f6f1e7", roof: "#4b3f3a", cols: 6 })],
  ["projects/commercial-warehouse.jpg", commercialScene()],
  ["projects/family-home.jpg", residentialScene({ wall: "#e9eef3", roof: "#3d4b5c", skyTop: "#f2a65a", skyBottom: "#fde8c8", sunX: 220, sunY: 260, mirror: true, cols: 5 })],
  ["projects/ground-mount.jpg", groundMountScene()],
  ["projects/retail-building.jpg", commercialScene({ wall: "#f1e9dd", accent: "#d9690b", skyTop: "#7cb4e6", skyBottom: "#f3f8fc" })],
  ["projects/modern-residence.jpg", residentialScene({ wall: "#ffffff", roof: "#2f3640", cols: 7, rows: 2, skyTop: "#5e9ed8", skyBottom: "#d8ebfa" })],
];

await mkdir(path.join(outDir, "projects"), { recursive: true });
for (const [file, markup] of images) {
  const target = path.join(outDir, file);
  await sharp(Buffer.from(markup)).jpeg({ quality: 82, mozjpeg: true }).toFile(target);
  console.log("wrote", path.relative(root, target));
}
