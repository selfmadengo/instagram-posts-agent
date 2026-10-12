#!/usr/bin/env node
/**
 * Renderiza um post (carrossel ou story estático) para PNG.
 *
 *   node scripts/render.mjs posts/2026-10-12-exemplo            # todos os slides
 *   node scripts/render.mjs posts/2026-10-12-exemplo --slide 1  # só o slide 1 (1-based)
 *
 * Lê <pasta>/post.json e escreve <pasta>/export/slide-01.png, ...
 */
import { chromium } from "playwright";
import { readFileSync, mkdirSync } from "node:fs";
import { resolve, join, dirname } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const dir = args.find((a) => !a.startsWith("--"));
if (!dir) { console.error("Uso: node scripts/render.mjs <pasta-do-post> [--slide N]"); process.exit(1); }
const only = args.includes("--slide") ? Number(args[args.indexOf("--slide") + 1]) : null;

const postDir = resolve(dir);
const post = JSON.parse(readFileSync(join(postDir, "post.json"), "utf8"));
const vertical = ["story", "reel"].includes(post.meta?.format);
const W = 1080, H = vertical ? 1920 : 1440;
const out = join(postDir, "export");
mkdirSync(out, { recursive: true });

const browser = await chromium.launch(); // usa o Chromium pré-instalado (PLAYWRIGHT_BROWSERS_PATH)
const tpl = pathToFileURL(join(ROOT, "templates/carousel/carousel.html")).href;

const indices = only ? [only - 1] : post.slides.map((_, i) => i);
for (const i of indices) {
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  await page.addInitScript(({ post, i, root }) => {
    window.__POST__ = post; window.__SLIDE__ = i; window.__ROOT__ = root; window.__ANIM__ = false;
  }, { post, i, root: pathToFileURL(ROOT + "/").href });
  await page.goto(tpl);
  await page.waitForFunction(() => document.body.dataset.ready === "1");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState("networkidle");
  const file = join(out, `slide-${String(i + 1).padStart(2, "0")}.png`);
  await page.locator(".slide").screenshot({ path: file });
  await page.close();
  console.log("✓", file.replace(ROOT + "/", ""));
}
await browser.close();
