# -*- coding: utf-8 -*-
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "01. Exemplo do site" / "libra-site-producao (1).html"
text = SRC.read_text(encoding="utf-8", errors="replace")
out = []
pos = 0
for n in range(3):
    i = text.find('class="quote"', pos)
    if i < 0:
        break
    chunk = text[i : i + 800]
    # strip huge assets
    chunk = re.sub(r'data:(?:image|video)/[a-zA-Z0-9+/=;,.-]+', "[DATA]", chunk)
    out.append(chunk)
    pos = i + 10

(ROOT / "scripts" / "clean" / "quotes_raw.txt").write_text("\n====\n".join(out), encoding="utf-8")
print("wrote", len(out))
