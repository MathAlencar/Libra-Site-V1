# -*- coding: utf-8 -*-
"""Extract clean text content from section HTML files."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SEC = ROOT / "scripts" / "sections"
OUT = ROOT / "scripts" / "clean"

OUT.mkdir(exist_ok=True)

def clean(html: str) -> str:
    html = re.sub(r"\[ASSET[^\]]*\]", "[IMG]", html)
    html = re.sub(r"\[LONG[^\]]*\]", lambda m: "", html)
    # Keep structure but remove base64 leftovers if any
    html = re.sub(r'data:(?:image|video)/[^"\']+', "data:removed", html)
    # strip line number prefixes like "608:"
    html = re.sub(r"(?m)^\d+:\s?", "", html)
    return html

for f in sorted(SEC.glob("*.html")):
    text = clean(f.read_text(encoding="utf-8"))
    (OUT / f.name).write_text(text, encoding="utf-8")
    print(f.name, len(text))

# Extract quotes from body
body = (ROOT / "scripts" / "_body_only.txt").read_text(encoding="utf-8")
quotes = []
for m in re.finditer(
    r'<blockquote>(.*?)</blockquote>[\s\S]*?<div class="who"><b>(.*?)</b><span>(.*?)</span>',
    body,
):
    quotes.append((m.group(2), m.group(3), m.group(1)))
(OUT / "quotes.txt").write_text(
    "\n\n".join(f"{n}\n{loc}\n{q}" for n, loc, q in quotes), encoding="utf-8"
)
print("quotes", len(quotes))

# Footer
fi = body.find("<footer")
fe = body.find("</footer>")
if fi >= 0 and fe > fi:
    foot = clean(body[fi : fe + 9])
    (OUT / "footer.html").write_text(foot, encoding="utf-8")
    print("footer", len(foot))
