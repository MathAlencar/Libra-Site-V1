# -*- coding: utf-8 -*-
import re, os
src = os.path.join(os.path.dirname(__file__), '..', '01. Exemplo do site', 'libra-admin (1).html')
out = os.path.join(os.path.dirname(__file__), '_editbar_css.txt')
with open(src, 'r', encoding='utf-8', errors='replace') as f:
    content = f.read()
# find editbar css
for pat in ['#editbar', 'body.editing', '.adm-login', 'polmodal', 'polta']:
    idxs = [m.start() for m in re.finditer(re.escape(pat), content)]
    print(pat, len(idxs), 'first at', idxs[0] if idxs else None)

# extract short CSS lines containing editbar
lines = content.splitlines()
with open(out, 'w', encoding='utf-8') as w:
    for i, line in enumerate(lines, 1):
        if len(line) > 400: continue
        if any(k in line for k in ('#editbar', 'body.editing', '.b-edit', '.b-done', '.b-exp', '.b-vid', 'adm-login', 'polta', 'polrow', 'doc-pending')):
            w.write('%d:%s\n' % (i, line))
print('wrote', out)
