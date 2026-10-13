#!/usr/bin/env node
/**
 * Renderiza objetos 3D realistas da marca para PNG transparente (three.js + texturas NASA).
 *
 *   node scripts/render-3d.mjs globe assets/3d/globo-europa.png
 *   node scripts/render-3d.mjs plane assets/3d/aviao-selfmade.png --yaw 10 --size 1800
 *   node scripts/render-3d.mjs x assets/3d/x-vermelho.png              (✕ vermelho brilhante — "mito")
 *   node scripts/render-3d.mjs check assets/3d/check.png
 *   node scripts/render-3d.mjs text assets/3d/18.png --text 18 --material red|chrome|white
 *
 * Opções: --size N (px, quadrado), --yaw/--pitch/--roll (graus), --lon/--lat (centro do globo),
 *         --zoom N, --rim "#ff2a2e" (cor do contraluz)
 *         --spin N --spinDeg D  → sequência de N frames (globo a rodar D graus) em <saida>/frame-000.png…
 * O PNG sai recortado ao objeto (sem margens transparentes desnecessárias).
 */
import { chromium } from "playwright";
import { readFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const [object, outArg, ...rest] = process.argv.slice(2);
if (!object || !outArg) { console.error("Uso: node scripts/render-3d.mjs <globe|x|check|text|plane> <saida.png> [opções]"); process.exit(1); }
const opt = { object };
for (let i = 0; i < rest.length; i += 2) {
  const k = rest[i].replace(/^--/, ""), v = rest[i + 1];
  opt[k] = isNaN(Number(v)) ? v : Number(v);
}
const size = opt.size || 1600;
const out = resolve(outArg);
mkdirSync(dirname(out), { recursive: true });

const MIME = { ".html": "text/html", ".js": "text/javascript", ".png": "image/png", ".jpg": "image/jpeg", ".json": "application/json" };
const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const page = await browser.newPage({ viewport: { width: size, height: size } });
page.on("console", (m) => m.type() === "error" && console.error("[page]", m.text()));
page.on("pageerror", (e) => console.error("[page]", e.message));
// servidor virtual: http://selfmade.local/<caminho no repositório>
await page.route("http://selfmade.local/**", (route) => {
  const p = join(ROOT, decodeURIComponent(new URL(route.request().url()).pathname));
  if (!existsSync(p)) return route.fulfill({ status: 404, body: "not found" });
  route.fulfill({ status: 200, body: readFileSync(p), contentType: MIME[extname(p)] || "application/octet-stream" });
});
// o TTFLoader do three importa o opentype.js de um CDN → servir a cópia local (npm)
await page.route("https://cdn.jsdelivr.net/npm/opentype.js@1.3.4/+esm", (route) =>
  route.fulfill({ status: 200, contentType: "text/javascript", body: readFileSync(join(ROOT, "node_modules/opentype.js/dist/opentype.module.js")) }));
await page.addInitScript((s) => { window.__SCENE__ = s; }, { ...opt, size });
await page.goto("http://selfmade.local/templates/3d/scene.html");
await page.waitForFunction(() => window.__DONE__ === true, null, { timeout: 120000 });
// recorta ao conteúdo visível (alpha > 0)
const box = await page.evaluate(() => {
  const c = document.querySelector("canvas");
  const tmp = document.createElement("canvas"); tmp.width = c.width; tmp.height = c.height;
  const ctx = tmp.getContext("2d"); ctx.drawImage(c, 0, 0);
  const d = ctx.getImageData(0, 0, c.width, c.height).data;
  let x0 = c.width, y0 = c.height, x1 = 0, y1 = 0;
  for (let y = 0; y < c.height; y += 2) for (let x = 0; x < c.width; x += 2) {
    if (d[(y * c.width + x) * 4 + 3] > 8) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  }
  const pad = 12;
  return { x: Math.max(0, x0 - pad), y: Math.max(0, y0 - pad), width: Math.min(c.width, x1 + pad) - Math.max(0, x0 - pad), height: Math.min(c.height, y1 + pad) - Math.max(0, y0 - pad) };
});
if (opt.spin) {
  mkdirSync(out, { recursive: true });
  const n = opt.spin, span = opt.spinDeg || 30, lon0 = (opt.lon ?? -8) - span / 2;
  for (let i = 0; i < n; i++) {
    await page.evaluate((lon) => window.__renderAt(lon), lon0 + (span * i) / (n - 1));
    await page.screenshot({ path: join(out, `frame-${String(i).padStart(3, "0")}.png`), omitBackground: true, clip: box });
  }
  console.log("✓", out.replace(ROOT + "/", ""), `${n} frames ${box.width}×${box.height}`);
  await browser.close(); process.exit(0);
}
await page.screenshot({ path: out, omitBackground: true, clip: box });
await browser.close();
console.log("✓", out.replace(ROOT + "/", ""), `${box.width}×${box.height}`);
