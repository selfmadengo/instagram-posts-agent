#!/usr/bin/env node
/**
 * Verifica o contraste WCAG 2.2 dos pares de cor usados nos templates.
 *   node scripts/contrast.mjs            → tabela dos pares da marca
 *   node scripts/contrast.mjs #fff #9d0b0e   → um par à escolha
 */
const lum = (hex) => {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

const args = process.argv.slice(2);
const pairs = args.length === 2 ? [[args[0], args[1], "par pedido", 4.5]] : [
  ["#ffffff", "#030e14", "Texto branco / fundo", 4.5],
  ["#a3b1ba", "#030e14", "Texto secundário / fundo", 4.5],
  ["#f0444a", "#030e14", "Vermelho-Self Luz (texto) / fundo", 4.5],
  ["#e2333a", "#030e14", "Fim do gradiente do destaque / fundo (texto grande)", 3],
  ["#ffffff", "#9d0b0e", "Texto branco / Vermelho-Self (CTA, painéis)", 4.5],
  ["#ffffff", "#870709", "Texto branco / base do gradiente do CTA", 4.5],
  ["#030e14", "#f4f2ef", "Texto tinta / papel (slides claros)", 4.5],
  ["#9d0b0e", "#f4f2ef", "Vermelho-Self / papel", 4.5],
  ["#24323a", "#f4f2ef", "Corpo em slide claro / papel", 4.5],
  ["#9d0b0e", "#030e14", "⚠ Vermelho-Self / fundo — NÃO usar para texto", 3],
];
let fail = 0;
for (const [fg, bg, label, min] of pairs) {
  const r = ratio(fg, bg);
  const ok = r >= min;
  if (!ok && !label.startsWith("⚠")) fail++;
  console.log(`${ok ? "✓" : "✗"} ${r.toFixed(2).padStart(5)}:1  (mín ${min})  ${fg} sobre ${bg}  — ${label}`);
}
process.exit(fail ? 1 : 0);
