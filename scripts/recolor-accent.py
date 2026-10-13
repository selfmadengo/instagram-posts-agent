#!/usr/bin/env python3
"""Troca o vermelho (acento Selfmade) de um PNG 3D pela cor de acento de um projeto, mantendo luz/sombra e alfa.
Uso: python3 scripts/recolor-accent.py <entrada.png|pasta> <saida.png|pasta> [hue_destino_0-255=155] [sat_min=70]
(155 ≈ 218° = azul EYC #2a5cb0). Para uma pasta, converte todos os PNG (ex.: frames de --spin)."""
import sys, os
import numpy as np
from PIL import Image

def recolor(src, dst, hue=155, smin=70):
    im = Image.open(src).convert("RGBA"); a = np.array(im)[..., 3]
    hsv = np.array(im.convert("RGB").convert("HSV")).astype(int)
    h, s = hsv[..., 0], hsv[..., 1]
    red = ((h < 12) | (h > 200)) & (s > smin)
    hsv[..., 0] = np.where(red, hue, h)
    hsv[..., 1] = np.where(red, (s * 0.85).astype(int), s)
    rgb = np.array(Image.fromarray(hsv.astype(np.uint8), "HSV").convert("RGB"))
    Image.fromarray(np.dstack([rgb, a]), "RGBA").save(dst, optimize=True)

src, dst = sys.argv[1], sys.argv[2]
hue = int(sys.argv[3]) if len(sys.argv) > 3 else 155
smin = int(sys.argv[4]) if len(sys.argv) > 4 else 70
if os.path.isdir(src):
    os.makedirs(dst, exist_ok=True)
    for f in sorted(os.listdir(src)):
        if f.endswith(".png"): recolor(os.path.join(src, f), os.path.join(dst, f), hue, smin)
else:
    recolor(src, dst, hue, smin)
print("✓", dst)
