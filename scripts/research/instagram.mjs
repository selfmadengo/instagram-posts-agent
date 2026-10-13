// Captura o perfil público de Instagram (análise interna de referências). Tenta fechar o pop-up de login.
import { chromium } from "playwright";
const [url, out] = process.argv.slice(2);
const b = await chromium.launch({ args: ["--disable-blink-features=AutomationControlled"] });
const ctx = await b.newContext({ viewport: { width: 1280, height: 1100 }, deviceScaleFactor: 1.5, userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36", locale: "en-US" });
const p = await ctx.newPage();
const r = await p.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
console.log("status", r?.status(), p.url());
await p.waitForTimeout(6000);
for (const t of ["Allow all cookies", "Decline optional cookies", "Not now", "Close"]) {
  const btn = p.getByRole("button", { name: t }); if (await btn.count()) { await btn.first().click().catch(() => {}); await p.waitForTimeout(800); }
}
for (let i = 0; i < 6; i++) { await p.mouse.wheel(0, 1400); await p.waitForTimeout(1200);
  const c = p.locator('svg[aria-label="Close"]'); if (await c.count()) await c.first().click().catch(() => {}); }
await p.screenshot({ path: out, fullPage: true });
const imgs = await p.$$eval("img", (is) => is.map((i) => ({ src: i.src, alt: i.alt })).filter((x) => x.alt && x.alt.length > 20));
console.log("posts:", imgs.length); for (const x of imgs.slice(0, 40)) console.log("-", x.alt.slice(0, 220).replace(/\n/g, " "));
const links = await p.$$eval("a", (as) => [...new Set(as.map((a) => a.href).filter((h) => /\/p\/|\/reel\//.test(h)))]);
console.log(links.join("\n"));
await b.close();
