// Abre cada post de um perfil Threads, guarda o texto completo e as imagens (slides).
import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "node:fs";
const [profile, out, max = "12"] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const b = await chromium.launch({ args: ["--disable-blink-features=AutomationControlled"] });
const ctx = await b.newContext({ viewport: { width: 1280, height: 1600 }, userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36", locale: "en-US" });
const p = await ctx.newPage();
await p.goto(profile, { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(5000);
const links = new Set();
for (let i = 0; i < 15; i++) {
  (await p.$$eval('a[href*="/post/"]', (as) => as.map((a) => a.href.split("?")[0]))).forEach((h) => links.add(h.replace(/\/media.*$/, "")));
  await p.mouse.wheel(0, 1500); await p.waitForTimeout(1200);
}
console.log("links", links.size);
let k = 0; const report = [];
for (const url of [...links].slice(0, Number(max))) {
  k++;
  const q = await ctx.newPage();
  try {
    await q.goto(url, { waitUntil: "networkidle", timeout: 60000 }).catch(() => {}); await q.waitForTimeout(2500);
    await q.evaluate(() => document.querySelectorAll('[role="dialog"]').forEach((e) => e.remove()));
    const text = await q.evaluate(() => document.body.innerText.split("Related threads")[0].slice(0, 2500));
    // carrega o carrossel: clicar "next" várias vezes não é preciso — as imagens estão todas no DOM
    for (let s = 0; s < 4; s++) { await q.mouse.wheel(0, 900); await q.waitForTimeout(700); }
    // imagens do post do autor = as que aparecem antes da primeira foto de perfil de outra pessoa
    const imgs = await q.$$eval("img", (is) => {
      const out = [];
      for (const i of is) {
        if (/profile picture/.test(i.alt) && !/marketingharry/.test(i.alt)) break;
        if (/-15\//.test(i.src)) {
          const set = (i.srcset || "").split(",").map((x) => x.trim().split(" ")).filter((x) => x[0]);
          set.sort((a, b) => parseInt(b[1] || 0) - parseInt(a[1] || 0));
          out.push(set[0]?.[0] || i.currentSrc || i.src);
        }
      }
      return [...new Set(out)];
    });
    let n = 0;
    if (!imgs.length) console.log("  sem imgs");
    for (const src of imgs.slice(0, 20)) {
      // descarregar dentro do browser (usa o proxy do browser)
      const b64 = await q.evaluate(async (u) => {
        const r = await fetch(u); if (!r.ok) return null;
        const blob = await r.blob();
        return await new Promise((res) => { const fr = new FileReader(); fr.onload = () => res(fr.result.split(",")[1]); fr.readAsDataURL(blob); });
      }, src).catch(() => null);
      if (b64) writeFileSync(`${out}/p${String(k).padStart(2, "0")}-${String(++n).padStart(2, "0")}.jpg`, Buffer.from(b64, "base64"));
    }
    report.push(`# ${url}\n(${n} imagens)\n${text}`);
    console.log(k, n, url);
  } catch (e) { console.log(k, "ERRO", e.message); }
  await q.close();
}
writeFileSync(`${out}/posts-detalhe.txt`, report.join("\n\n==========\n\n"));
await b.close();
