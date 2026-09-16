# -*- coding: utf-8 -*-
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
body = (ROOT / "scripts" / "_body_only.txt").read_text(encoding="utf-8")

ids = re.findall(r'id="(pg-[^"]+|home)"', body)
(ROOT / "scripts" / "_ids.txt").write_text("\n".join(ids), encoding="utf-8")

# Split by main pages
parts = re.split(r'(?=<main\b)', body)
out_dir = ROOT / "scripts" / "sections"
out_dir.mkdir(exist_ok=True)
for i, part in enumerate(parts):
    if not part.strip().startswith("<main"):
        (out_dir / f"00_preamble.html").write_text(part[:20000], encoding="utf-8")
        continue
    m = re.search(r'id="([^"]+)"', part)
    name = m.group(1) if m else f"part{i}"
    # strip scripts roughly
    clean = re.sub(r"<script[\s\S]*?</script>", "", part)
    (out_dir / f"{name}.html").write_text(clean[:80000], encoding="utf-8")

# Also dump CSS from short file (lines that are CSS only)
css_short = (ROOT / "scripts" / "_css_short.txt").read_text(encoding="utf-8")
# Extract from :root or .wrap through end of useful CSS before body
print("ids", ids)
print("parts", len(parts))
print("written", list(out_dir.glob("*.html")))
