# -*- coding: utf-8 -*-
import re, base64
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "01. Exemplo do site" / "libra-site-producao (1).html"
PUBLIC = ROOT / "public"
text = SRC.read_text(encoding="utf-8", errors="replace")

m = re.search(r'--logo:url\("data:image/png;base64,([A-Za-z0-9+/=]+)"\)', text)
if m:
    data = base64.b64decode(m.group(1))
    (PUBLIC / "logo.png").write_bytes(data)
    print("logo.png", len(data))
else:
    print("logo miss")

# CSS lines 330-560 from file
lines = SRC.read_text(encoding="utf-8", errors="replace").splitlines()
out = ROOT / "scripts" / "_css_chunk.txt"
with out.open("w", encoding="utf-8") as w:
    for i, line in enumerate(lines[329:560], 330):
        if len(line) < 600:
            w.write("%d:%s\n" % (i, line))
print("css chunk")

# testimonials - look for class quote
idx = text.find('class="quote"')
print("quote idx", idx)
# who names
for m in re.finditer(r'<div class="who"><b>(.*?)</b><span>(.*?)</span>', text):
    print("WHO", m.group(1), "|", m.group(2))

# cookie / mcta CSS
for i, line in enumerate(lines, 1):
    if len(line) < 500 and any(k in line for k in (".cookie", ".ck-", ".mcta", ".fab", ".toast")):
        print("%d:%s" % (i, line[:300]))
