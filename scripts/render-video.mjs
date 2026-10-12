#!/usr/bin/env node
/**
 * Renderiza um Reel / Story animado (motion graphics) para MP4, frame a frame (determinístico).
 *
 *   node scripts/render-video.mjs posts/<pasta>            # todas as cenas → export/video.mp4
 *   node scripts/render-video.mjs posts/<pasta> --fps 30
 *
 * Cada slide do post.json é uma cena. Duração por cena:
 *   slide.duration (s)  OU  automática = max(2.5, palavras × 0.3 + 1.2)  (regra: ler 2×)
 *   a última cena (CTA) fica ≥ 3 s parada no fim.
 * Transição entre cenas: crossfade de 0.4 s (xfade). Áudio opcional: meta.audio (caminho).
 * Requer ffmpeg no PATH.
 */
import { chromium } from "playwright";
import { readFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { resolve, join, dirname } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import { spawn, execFileSync } from "node:child_process";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const dir = args.find((a) => !a.startsWith("--"));
if (!dir) { console.error("Uso: node scripts/render-video.mjs <pasta-do-post> [--fps 30]"); process.exit(1); }
const FPS = args.includes("--fps") ? Number(args[args.indexOf("--fps") + 1]) : 30;
const XF = 0.4; // crossfade (s)

const postDir = resolve(dir);
const post = JSON.parse(readFileSync(join(postDir, "post.json"), "utf8"));
const vertical = ["story", "reel"].includes(post.meta?.format);
const W = 1080, H = vertical ? 1920 : 1440;
const out = join(postDir, "export");
const tmp = join(out, ".frames");
mkdirSync(tmp, { recursive: true });

const words = (s) => JSON.stringify(s).replace(/"(layout|theme|visual|type|src|icon|key|size|left|bottom|width)":"?[^,}]*"?/g, "")
  .replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean).length;
const durations = post.slides.map((s, i) => {
  if (s.duration) return s.duration;
  const d = Math.max(2.5, words(s) * 0.3 + 1.2);
  return i === post.slides.length - 1 ? Math.max(d, 4) : d;
});

const browser = await chromium.launch();
const tpl = pathToFileURL(join(ROOT, "templates/carousel/carousel.html")).href;
const clips = [];

for (let i = 0; i < post.slides.length; i++) {
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.addInitScript(({ post, i, root }) => {
    window.__POST__ = post; window.__SLIDE__ = i; window.__ROOT__ = root; window.__ANIM__ = true;
  }, { post, i, root: pathToFileURL(ROOT + "/").href });
  await page.goto(tpl);
  await page.waitForFunction(() => document.body.dataset.ready === "1");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState("networkidle");

  const clip = join(tmp, `scene-${i}.mp4`);
  const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-i", "-",
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "16", "-preset", "medium", clip]);
  const frames = Math.round(durations[i] * FPS);
  for (let f = 0; f < frames; f++) {
    const t = (f / FPS) * 1000;
    await page.evaluate((t) => document.getAnimations().forEach((a) => { a.pause(); a.currentTime = t; }), t);
    const buf = await page.screenshot({ type: "jpeg", quality: 95, clip: { x: 0, y: 0, width: W, height: H } });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
  }
  ff.stdin.end();
  await new Promise((r, j) => ff.on("close", (c) => (c === 0 ? r() : j(new Error("ffmpeg falhou")))));
  await page.close();
  clips.push(clip);
  console.log(`✓ cena ${i + 1}/${post.slides.length} (${durations[i].toFixed(1)} s)`);
}
await browser.close();

// junta as cenas com crossfade
const final = join(out, post.meta?.output || "video.mp4");
const inputs = clips.flatMap((c) => ["-i", c]);
let filter = "", last = "[0:v]", offset = 0;
for (let i = 1; i < clips.length; i++) {
  offset += durations[i - 1] - XF;
  const lbl = i === clips.length - 1 ? "[v]" : `[x${i}]`;
  filter += `${last}[${i}:v]xfade=transition=fade:duration=${XF}:offset=${offset.toFixed(3)}${lbl};`;
  last = lbl;
}
const audio = post.meta?.audio && existsSync(join(ROOT, post.meta.audio)) ? ["-i", join(ROOT, post.meta.audio)] : [];
const ffArgs = ["-y", "-loglevel", "error", ...inputs, ...audio];
if (clips.length > 1) ffArgs.push("-filter_complex", filter.replace(/;$/, ""), "-map", "[v]");
else ffArgs.push("-map", "0:v");
if (audio.length) ffArgs.push("-map", `${clips.length}:a`, "-c:a", "aac", "-b:a", "192k", "-shortest");
ffArgs.push("-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-r", String(FPS), "-movflags", "+faststart", final);
execFileSync("ffmpeg", ffArgs, { stdio: "inherit" });
rmSync(tmp, { recursive: true, force: true });
const total = durations.reduce((a, b) => a + b, 0) - XF * (clips.length - 1);
console.log(`✓ ${final.replace(ROOT + "/", "")} — ${total.toFixed(1)} s @ ${FPS} fps`);
