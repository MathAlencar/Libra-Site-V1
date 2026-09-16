from pathlib import Path
import re
import base64

path = Path(r"01. Exemplo do site/libra-site-producao (1).html")
content = path.read_text(encoding="utf-8", errors="replace")

marker = 'id="home-video"'
idx = content.find(marker)
print("marker idx", idx)
chunk = content[idx : idx + 200]
print(chunk[:200])

# find base64 after home-video
start = content.find("data:video/mp4;base64,", idx)
print("data start", start)
if start < 0:
    raise SystemExit("no video data")
start += len("data:video/mp4;base64,")
end = content.find('"', start)
b64 = content[start:end]
raw = base64.b64decode(b64)
out = Path("public/videos")
out.mkdir(parents=True, exist_ok=True)
fp = out / "hero-bike.mp4"
fp.write_bytes(raw)
print("wrote", fp, "bytes", len(raw))

# also extract a poster frame isn't easy; keep unsplash fallback
