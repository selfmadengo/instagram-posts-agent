#!/usr/bin/env node
/**
 * Exporta um post para PDF híbrido (1 página por slide) para importar no Canva como design editável:
 *   - camada de fundo = imagem (objeto 3D, gradientes, cartões, sombras, logos, ícones) → fidelidade total
 *   - camada de texto = vetorial e editável no Canva
 * --flat : PDF 100 % vetorial (sem camada de imagem; o Canva perde alguns efeitos CSS)
 *   node scripts/export-pdf.mjs posts/<pasta>   → export/<pasta>.pdf
 */
import { chromium } from "playwright";
import { PDFDocument } from "pdf-lib";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, join, dirname, basename } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dir = process.argv[2];
if (!dir) { console.error("Uso: node scripts/export-pdf.mjs <pasta-do-post>"); process.exit(1); }
const postDir = resolve(dir);
const post = JSON.parse(readFileSync(join(postDir, "post.json"), "utf8"));
const vertical = ["story", "reel"].includes(post.meta?.format);
const W = 1080, H = vertical ? 1920 : 1440;
const out = join(postDir, "export");
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const tpl = pathToFileURL(join(ROOT, "templates/carousel/carousel.html")).href;
const flat = process.argv.includes("--flat");
// passo A: tudo menos o texto (o texto fica transparente mas mantém o lugar)
const HIDE_TEXT = `*{-webkit-text-fill-color:transparent!important;text-shadow:none!important}
  .hl{background:none!important;filter:none!important}`;
// passo B: só o texto, por cima da imagem do passo A
const TEXT_ONLY = (bg) => `*{background:transparent!important;box-shadow:none!important;text-shadow:none!important;border-color:transparent!important;filter:none!important}
  img,svg,.brand-orb,.motif-orbit,.hero-visual,.hero-fade,.progress{visibility:hidden!important}
  *::before,*::after{display:none!important}
  .slide{background:url(${bg}) center/cover no-repeat!important}
  .theme-dark .hl,.theme-surface .hl{-webkit-text-fill-color:#f0444a!important;color:#f0444a!important}
  .theme-light .hl{-webkit-text-fill-color:#9d0b0e!important;color:#9d0b0e!important}`;
const merged = await PDFDocument.create();
for (let i = 0; i < post.slides.length; i++) {
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.addInitScript(({ post, i, root }) => {
    window.__POST__ = post; window.__SLIDE__ = i; window.__ROOT__ = root; window.__ANIM__ = false;
  }, { post, i, root: pathToFileURL(ROOT + "/").href });
  await page.goto(tpl);
  await page.waitForFunction(() => document.body.dataset.ready === "1");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState("networkidle");
  if (!flat) {
    const tag = await page.addStyleTag({ content: HIDE_TEXT });
    const bg = await page.locator(".slide").screenshot({ type: "jpeg", quality: 92 });
    await tag.evaluate((n) => n.remove());
    await page.addStyleTag({ content: TEXT_ONLY("data:image/jpeg;base64," + bg.toString("base64")) });
  }
  await page.addStyleTag({ content: `@page{size:${W}px ${H}px;margin:0} html,body{margin:0;background:none}` });
  const buf = await page.pdf({ width: `${W}px`, height: `${H}px`, printBackground: true, pageRanges: "1" });
  const doc = await PDFDocument.load(buf);
  const [p] = await merged.copyPages(doc, [0]);
  merged.addPage(p);
  await page.close();
}
await browser.close();
const file = join(out, `${basename(postDir)}.pdf`);
writeFileSync(file, await merged.save());
console.log("✓", file.replace(ROOT + "/", ""), `(${post.slides.length} páginas)`);
