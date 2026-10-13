// Captura as coleções públicas de um criador do Canva (análise interna de referências).
import { chromium } from "playwright";
const [out, ...urls] = process.argv.slice(2);
const b = await chromium.launch({ args: ["--disable-blink-features=AutomationControlled"] });
const ctx = await b.newContext({ viewport: { width: 1400, height: 1000 }, deviceScaleFactor: 1.5, userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36", locale: "pt-PT" });
for (const [i, url] of urls.entries()) {
  const p = await ctx.newPage();
  try {
    await p.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    for (let w = 0; w < 30 && /momento|moment/i.test(await p.title()); w++) await p.waitForTimeout(1000); // desafio anti-bot
    await p.waitForTimeout(4000);
    for (let k = 0; k < 6; k++) { await p.mouse.wheel(0, 1200); await p.waitForTimeout(700); }
    const title = await p.title();
    await p.screenshot({ path: `${out}/col-${String(i + 1).padStart(2, "0")}.png`, fullPage: true });
    console.log(i + 1, title);
  } catch (e) { console.log(i + 1, "ERRO", e.message); }
  await p.close();
  await new Promise((r) => setTimeout(r, 8000));
}
await b.close();
