#!/usr/bin/env node
/**
 * Junta os PNG de export/ numa folha de contacto (revisão rápida + teste em tons de cinzento).
 *   node scripts/contact-sheet.mjs posts/<pasta> [--gray]
 * Escreve export/_contact-sheet.png (ou _contact-sheet-gray.png)
 */
import { chromium } from "playwright";
import { readdirSync, writeFileSync, unlinkSync } from "node:fs";
import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";

const args = process.argv.slice(2);
const dir = resolve(args.find((a) => !a.startsWith("--")));
const gray = args.includes("--gray");
const exp = join(dir, "export");
const files = readdirSync(exp).filter((f) => /^slide-\d+\.png$/.test(f)).sort();
const cols = Math.min(4, files.length);
const tw = 360;
const html = `<body style="margin:0;background:#1b1f22;padding:24px;display:grid;grid-template-columns:repeat(${cols},${tw}px);gap:16px;width:max-content">
${files.map((f) => `<img src="${f}" style="width:${tw}px;border-radius:8px;${gray ? "filter:grayscale(1)" : ""}">`).join("")}</body>`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: cols * (tw + 16) + 48, height: 600 } });
const tmpHtml = join(exp, "_sheet.html");
writeFileSync(tmpHtml, html);
await page.goto(pathToFileURL(tmpHtml).href);
await page.waitForLoadState("networkidle");
const out = join(exp, gray ? "_contact-sheet-gray.png" : "_contact-sheet.png");
await page.screenshot({ path: out, fullPage: true });
await browser.close();
unlinkSync(tmpHtml);
console.log("✓", out);
