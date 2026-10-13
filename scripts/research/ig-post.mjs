// Captura um post público de Instagram via página embed (sem login): legenda + todas as imagens do carrossel.
// Uso: node scripts/research/ig-post.mjs <shortcode> <pasta-saida>
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
const [code, out] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const b = await chromium.launch({ args: ["--disable-blink-features=AutomationControlled"] });
const ctx = await b.newContext({ viewport: { width: 700, height: 1300 }, deviceScaleFactor: 2, userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36" });
const p = await ctx.newPage();
await p.goto(`https://www.instagram.com/p/${code}/embed/captioned/`, { waitUntil: "networkidle", timeout: 60000 });
await p.waitForTimeout(3000);
const cap = await p.evaluate(() => document.querySelector(".Caption")?.innerText || document.body.innerText);
writeFileSync(`${out}/legenda.txt`, cap);
const seen = new Set();
for (let i = 0; i < 25; i++) {
  const srcs = await p.$$eval("img", (is) => is.filter((x) => x.naturalWidth > 300).map((x) => x.currentSrc || x.src));
  for (const s of srcs) if (!seen.has(s)) {
    seen.add(s);
    const b64 = await p.evaluate(async (u) => { const r = await fetch(u); const a = new Uint8Array(await r.arrayBuffer()); let s = ""; for (const c of a) s += String.fromCharCode(c); return btoa(s); }, s);
    writeFileSync(`${out}/s${String(seen.size).padStart(2, "0")}.jpg`, Buffer.from(b64, "base64"));
  }
  const next = p.locator('button[aria-label="Next"], .coreSpriteRightChevron, [aria-label="Next"]');
  if (!(await next.count())) break;
  await next.first().click().catch(() => {}); await p.waitForTimeout(1200);
}
await p.screenshot({ path: `${out}/_embed.png`, fullPage: true });
console.log("imagens:", seen.size); console.log(cap.slice(0, 3000));
await b.close();
