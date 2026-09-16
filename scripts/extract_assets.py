# -*- coding: utf-8 -*-
"""Extract logo, images, map SVG, quotes, extra CSS from example HTML."""
import os
import re
import base64
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "01. Exemplo do site" / "libra-site-producao (1).html"
PUBLIC = ROOT / "public"
IMG = PUBLIC / "images"
IMG.mkdir(parents=True, exist_ok=True)

text = SRC.read_text(encoding="utf-8", errors="replace")

# Logo mask
m = re.search(r"--logo:url\((['\"]?)(data:image/svg\+xml[^)'\"]+)\1\)", text)
if m:
    uri = m.group(2)
    # data:image/svg+xml,... might be utf8 encoded
    if uri.startswith("data:image/svg+xml;base64,"):
        raw = base64.b64decode(uri.split(",", 1)[1])
        (PUBLIC / "logo.svg").write_bytes(raw)
        print("logo.svg", len(raw))
    elif uri.startswith("data:image/svg+xml"):
        payload = uri.split(",", 1)[1]
        from urllib.parse import unquote
        (PUBLIC / "logo.svg").write_text(unquote(payload), encoding="utf-8")
        print("logo.svg text")
else:
    print("NO LOGO FOUND")
    # search nearby
    i = text.find("--logo")
    print("idx", i, repr(text[i:i+120] if i>=0 else ""))

# Unique images (skip tiny)
seen = {}
pat = re.compile(r'data:image/(png|jpeg|jpg|webp|gif|svg\+xml);base64,([A-Za-z0-9+/=]+)')
n = 0
for kind, b64 in pat.findall(text):
    key = b64[:80] + str(len(b64))
    if key in seen:
        continue
    if len(b64) < 2000:
        continue
    n += 1
    seen[key] = n
    ext = "png" if kind == "png" else ("jpg" if kind in ("jpeg", "jpg") else ("webp" if kind == "webp" else "gif"))
    data = base64.b64decode(b64)
    path = IMG / ("img-%02d.%s" % (n, ext))
    path.write_bytes(data)
    print("wrote", path.name, "kb", round(len(data)/1024, 1))
    if n >= 20:
        break

print("images extracted", n)

# Brazil map svg inner
mm = re.search(r'(<svg class="br-map"[^>]*>.*?</svg>)', text, re.S)
if mm:
    (PUBLIC / "brazil-map.svg").write_text(mm.group(1), encoding="utf-8")
    print("brazil-map.svg", len(mm.group(1)))

# Quotes from carousel
quotes = re.findall(r'<blockquote>(.*?)</blockquote>', text, re.S)
whos = re.findall(r'<div class="who">(.*?)</div>', text, re.S)
out = ROOT / "scripts" / "_quotes.txt"
with out.open("w", encoding="utf-8") as w:
    for i, q in enumerate(quotes):
        w.write("Q%d: %s\n" % (i, re.sub(r"<[^>]+>", "", q)[:400]))
    w.write("\n")
    for i, q in enumerate(whos):
        w.write("W%d: %s\n" % (i, re.sub(r"\s+", " ", q)[:400]))
print("quotes", len(quotes), "whos", len(whos))

# Extra CSS blocks of interest
css_out = ROOT / "scripts" / "_extra_css.txt"
keys = ["hero-full", "hero-video", "hero-shade", "hero-inner", "hero-chiprow", "hero-fade", "hero-scroll", "mcta", "cookie", "ck-banner", "ticker", "br-map", "br-grid", "br-chip", "vdepo", "mburger", "artwrap", "wiz", "wleft", "wright"]
with css_out.open("w", encoding="utf-8") as w:
    for k in keys:
        idx = 0
        c = 0
        while True:
            i = text.find(k, idx)
            if i < 0:
                break
            # find css rule if nearby
            line_start = text.rfind("\n", 0, i)
            line = text[line_start+1:text.find("\n", i)]
            if len(line) < 500 and ("{" in line or k in line[:40]):
                w.write(line + "\n")
                c += 1
            idx = i + len(k)
            if c > 8:
                break
print("extra css written")
