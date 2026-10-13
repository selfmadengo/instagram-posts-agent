import { chromium } from "playwright";
const [url, out] = process.argv.slice(2);
const b = await chromium.launch({ args: ["--disable-blink-features=AutomationControlled"] });
const ctx = await b.newContext({ viewport: { width: 1400, height: 1000 }, userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36", locale: "pt-PT" });
const p = await ctx.newPage();
const r = await p.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
console.log("status", r?.status());
await p.waitForTimeout(6000);
for (let i = 0; i < 12; i++) { await p.mouse.wheel(0, 1500); await p.waitForTimeout(800); }
await p.screenshot({ path: out, fullPage: true });
console.log("title", await p.title());
const links = await p.$$eval("a", (as) => as.map((a) => a.href).filter((h) => /collections|design|templates/.test(h)));
console.log([...new Set(links)].slice(0, 80).join("\n"));
await b.close();
