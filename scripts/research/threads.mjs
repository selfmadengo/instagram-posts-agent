// Recolhe as imagens (slides de carrossel) e textos dos posts públicos de um perfil Threads.
import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "node:fs";
const [url, out, scrolls = "25"] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const b = await chromium.launch({ args: ["--disable-blink-features=AutomationControlled"] });
const ctx = await b.newContext({ viewport: { width: 1280, height: 1400 }, userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36", locale: "en-US" });
const p = await ctx.newPage();
await p.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(5000);
const kill = () => p.evaluate(() => { document.querySelectorAll('[role="dialog"]').forEach((e) => e.closest('div[style]')?.remove() ?? e.remove()); document.body.style.overflow = "auto"; });
const seen = new Map(); const texts = new Set();
for (let i = 0; i < Number(scrolls); i++) {
  await kill().catch(() => {});
  const imgs = await p.$$eval("img", (is) => is.filter((i) => i.naturalWidth >= 400).map((i) => i.currentSrc || i.src));
  imgs.forEach((s) => seen.set(s.split("?")[0], s));
  const t = await p.$$eval('div[data-pressable-container="true"]', (ds) => ds.map((d) => d.innerText.slice(0, 600)));
  t.forEach((x) => texts.add(x));
  await p.mouse.wheel(0, 1300); await p.waitForTimeout(1500);
}
let n = 0;
for (const src of seen.values()) {
  try { const r = await p.request.get(src); if (r.ok()) { writeFileSync(`${out}/img-${String(++n).padStart(3, "0")}.jpg`, await r.body()); } } catch {}
}
writeFileSync(`${out}/posts.txt`, [...texts].join("\n\n----\n\n"));
console.log("imagens", n, "posts", texts.size);
await b.close();
