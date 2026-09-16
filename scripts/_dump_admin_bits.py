# -*- coding: utf-8 -*-
import os
import re

src = os.path.join(os.path.dirname(__file__), "..", "01. Exemplo do site", "libra-admin (1).html")
with open(src, "r", encoding="utf-8", errors="replace") as f:
    html = f.read()

for pat in ["adm-login", "polmodal", "b-vid", "b-adm", "vph", "vshell"]:
    positions = [m.start() for m in re.finditer(re.escape(pat), html)]
    print(pat, "count", len(positions), "first", positions[:3])

i = html.find(".polta{")
with open(os.path.join(os.path.dirname(__file__), "_pol_css.txt"), "w", encoding="utf-8") as o:
    o.write(html[max(0, i - 300) : i + 1500])

j = html.find('class="adm-login')
print("adm-login html at", j)
if j >= 0:
    with open(os.path.join(os.path.dirname(__file__), "_adm_login_html.txt"), "w", encoding="utf-8") as o:
        o.write(html[j - 80 : j + 2000])

# CSS rules mentioning adm-login
for m in re.finditer(r"[^{}]*adm-login[^{}]*\{[^}]*\}", html):
    print("RULE:", m.group(0)[:200])

# polmodal html
k = html.find('id="polmodal"')
print("polmodal at", k)
if k >= 0:
    with open(os.path.join(os.path.dirname(__file__), "_polmodal_html.txt"), "w", encoding="utf-8") as o:
        o.write(html[k : k + 1200])

# b-vid in editbar
print("editbar snippet:", html[html.find('id="editbar"') : html.find('id="editbar"') + 500])
