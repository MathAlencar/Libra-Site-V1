# -*- coding: utf-8 -*-
from pathlib import Path
import re
ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "01. Exemplo do site" / "libra-site-producao (1).html"
text = SRC.read_text(encoding="utf-8", errors="replace")
i = text.find('class="quote"')
print(text[i:i+2500])
print("----NEXT----")
j = text.find('class="quote"', i+10)
print(text[j:j+1800] if j>0 else "none")
k = text.find('class="quote"', j+10 if j>0 else i+10)
print("----3----")
print(text[k:k+1800] if k>0 else "none")
