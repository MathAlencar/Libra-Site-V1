# -*- coding: utf-8 -*-
"""Extract short HTML from the example site without dumping base64."""
import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "01. Exemplo do site" / "libra-site-producao (1).html"
OUT = ROOT / "scripts" / "_html_body.txt"

SKIP_ATTR = re.compile(r'(src|poster|style|href)=("[^"]{400,}"|\'[^\']{400,}\')')
DATA_URI = re.compile(r'data:(image|video|font|application)/[^"\']+')

with SRC.open("r", encoding="utf-8", errors="replace") as f:
    lines = f.readlines()

# find body start
start = 0
for i, line in enumerate(lines):
    if "<body" in line.lower() or (i > 500 and "<header" in line.lower()):
        start = i
        break

# CSS vars / logo around line 217
css_bits = []
for i, line in enumerate(lines[:570], 1):
    if len(line) <= 450 and ("--logo" in line or "logo{" in line or "@font" in line or "--navy" in line):
        css_bits.append("%d:%s" % (i, line.rstrip()[:400]))

with OUT.open("w", encoding="utf-8") as w:
    w.write("===== CSS BITS =====\n")
    for b in css_bits:
        w.write(b + "\n")
    w.write("\n===== BODY SHORT LINES =====\n")
    for i in range(start, len(lines)):
        line = lines[i]
        if "<script" in line.lower() and i > 1300:
            w.write("\n===== SCRIPT START %d =====\n" % (i + 1))
            break
        if len(line) > 420:
            snippet = SKIP_ATTR.sub(r'\1="[LONG]"', line)
            if len(snippet) > 420:
                snippet = snippet[:300] + " … [truncated]\n"
            w.write("%d:%s" % (i + 1, snippet if snippet.endswith("\n") else snippet + "\n"))
        else:
            w.write("%d:%s" % (i + 1, line if line.endswith("\n") else line + "\n"))

print("wrote", OUT, "start_line", start + 1)
print("total lines", len(lines))
