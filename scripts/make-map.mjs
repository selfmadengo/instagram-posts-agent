#!/usr/bin/env node
/**
 * Gera um mapa real (SVG) de uma região do mundo, com países destacados, e as coordenadas em píxeis das paragens.
 * Dados: world-atlas (Natural Earth 1:50m, domínio público).
 *
 *   node scripts/make-map.mjs <config.json>
 * config: { "out": "assets/maps/x.svg", "width": 936, "height": 620,
 *           "bbox": [lonMin, latMin, lonMax, latMax], "rotate": [-12, -51],
 *           "highlight": ["056","276"], "stops": [{ "name": "Bélgica", "lon": 4.35, "lat": 50.85 }],
 *           "style": { "land": "#12252f", "landStroke": "...", "hi": "#1d4a94", "hiStroke": "#ffcb05" } }
 * Imprime as paragens com x/y prontos a colar no post.json (layout pk-map).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { feature } from "topojson-client";
import { geoAzimuthalEqualArea, geoPath } from "d3-geo";
const require = createRequire(import.meta.url);
const cfg = JSON.parse(readFileSync(process.argv[2], "utf8"));
const topo = require("world-atlas/countries-50m.json");
const countries = feature(topo, topo.objects.countries).features;
const W = cfg.width, H = cfg.height, [x0, y0, x1, y1] = cfg.bbox;
const frame = { type: "Feature", geometry: { type: "Polygon", coordinates: [[[x0, y0], [x0, y1], [x1, y1], [x1, y0], [x0, y0]]] } };
const proj = geoAzimuthalEqualArea().rotate(cfg.rotate || [-(x0 + x1) / 2, -(y0 + y1) / 2]).fitExtent([[0, 0], [W, H]], frame).clipExtent([[-4, -4], [W + 4, H + 4]]);
const path = geoPath(proj).digits?.(1) ?? geoPath(proj);

const st = Object.assign({ land: "#12252f", landStroke: "rgba(255,255,255,.16)", hi: "#1d4a94", hiStroke: "#ffcb05" }, cfg.style || {});
const hi = new Set(cfg.highlight || []);
const near = countries.filter((f) => { const b = path.bounds(f); return b[1][0] > -50 && b[0][0] < W + 50 && b[1][1] > -50 && b[0][1] < H + 50; });
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<g fill="${st.land}" stroke="${st.landStroke}" stroke-width="1.2" stroke-linejoin="round">${near.filter((f) => !hi.has(f.id)).map((f) => `<path d="${path(f)}"/>`).join("")}</g>
<g fill="${st.hi}" stroke="${st.hiStroke}" stroke-width="3" stroke-linejoin="round">${near.filter((f) => hi.has(f.id)).map((f) => `<path d="${path(f)}"/>`).join("")}</g>
</svg>`;
writeFileSync(cfg.out, svg);
const stops = (cfg.stops || []).map((s) => { const [x, y] = proj([s.lon, s.lat]); return { ...s, x: Math.round(x), y: Math.round(y) }; });
console.log("✓", cfg.out, `${(svg.length / 1024).toFixed(0)} KB, ${near.length} países`);
console.log(JSON.stringify(stops, null, 1));
