# -*- coding: utf-8 -*-
from pathlib import Path

css = r"""

/* ===== Admin CMS ===== */
#editbar{position:fixed;z-index:300;left:50%;bottom:20px;transform:translateX(-50%);display:flex;align-items:center;gap:10px;background:#0b0b0b;color:#fff;padding:9px 11px 9px 18px;border-radius:100px;box-shadow:0 16px 46px -10px rgba(0,0,0,.55);font-family:"Instrument Sans",sans-serif;font-size:14px;max-width:calc(100vw - 24px)}
#editbar .lbl{font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#editbar button{font-family:inherit;font-size:14px;font-weight:600;border:none;border-radius:100px;padding:10px 17px;cursor:pointer;white-space:nowrap;transition:transform .15s ease,opacity .15s ease}
#editbar button:hover{transform:translateY(-1px)}
#editbar .b-edit{background:#34548c;color:#fff}
#editbar .b-done{background:#e6a83c;color:#0b1f3f;display:none}
#editbar .b-exp{background:rgba(255,255,255,.15);color:#fff}
#editbar .b-vid{background:rgba(255,255,255,.12);color:#fff}
#editbar .b-adm{background:#e6a83c;color:#0b1f3f}
body.editing #editbar .b-edit{display:none}
body.editing #editbar .b-done{display:inline-block}
body.editing [contenteditable="true"]{outline:1.5px dashed rgba(52,84,140,.45);outline-offset:3px;border-radius:3px;cursor:text}
body.editing [contenteditable="true"]:hover{outline-color:#34548c;background:rgba(52,84,140,.05)}
body.editing [contenteditable="true"]:focus{outline:2px solid #34548c;background:rgba(52,84,140,.07)}
body.editing .ph{cursor:pointer;position:relative}
body.editing .ph::after{content:"Trocar imagem";position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(11,31,63,.58);color:#fff;font-family:"Instrument Sans",sans-serif;font-size:14px;font-weight:600;opacity:0;transition:opacity .2s ease;z-index:6;border-radius:inherit}
body.editing .ph:hover::after{opacity:1}
body.editing .editable-img-wrap{cursor:pointer}
@media print{#editbar{display:none}}

.adm-login{min-height:70vh;display:flex;align-items:center;justify-content:center;padding:120px 20px 80px;background:linear-gradient(160deg,#0b1f3f 0%,#16325f 55%,#0b1f3f 100%)}
.adm-login-card{width:100%;max-width:420px;background:var(--cream,#f6f1e6);border-radius:22px;padding:36px 32px;box-shadow:0 24px 60px rgba(0,0,0,.35)}
.adm-login-card .eyebrow{margin-bottom:10px}
.adm-login-card h1{font-size:clamp(28px,4vw,36px);margin:0 0 10px;color:var(--navy,#0b1f3f)}
.adm-login-card > p{color:var(--muted,#6b7280);font-size:15px;line-height:1.55;margin:0 0 22px}
.adm-login .adm-field{margin-bottom:14px}
.adm-login .adm-field label{display:block;font-size:12.5px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--muted);margin-bottom:7px}
.adm-login .adm-field input{width:100%;border:1.6px solid var(--line,#e5e0d6);border-radius:12px;padding:13px 15px;font-family:inherit;font-size:16px;color:var(--ink,#0b1f3f);background:#fff;box-sizing:border-box}
.adm-login .adm-field input:focus{border-color:var(--blue,#34548c);outline:none}

.adm-hero{padding:150px 0 40px;background:var(--cream,#f6f1e6)}
.adm-hero h1{font-size:clamp(34px,4.5vw,52px);color:var(--navy,#0b1f3f)}
.adm-hero p{color:var(--muted);margin-top:10px;max-width:44em}
.adm-tabs{display:flex;gap:10px;margin:26px 0 0;flex-wrap:wrap}
.adm-tab{font-family:inherit;font-size:14.5px;font-weight:700;border:1.6px solid var(--line);background:#fff;color:var(--ink);border-radius:100px;padding:11px 22px;cursor:pointer;transition:all .15s ease}
.adm-tab.on{background:var(--navy);border-color:var(--navy);color:var(--cream)}
.adm-pane{display:none;padding:34px 0 80px;background:var(--cream,#f6f1e6)}
.adm-pane.on{display:block}
.adm-card{background:#fff;border:1px solid var(--line);border-radius:18px;padding:30px 28px;margin-bottom:22px}
.adm-card h3{font-family:"Instrument Serif",serif;font-size:24px;font-weight:500;margin-bottom:6px;color:var(--navy)}
.adm-card .hint{font-size:13.5px;color:var(--muted);margin-bottom:18px}
.adm-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.adm-grid .full{grid-column:1/-1}
.adm-field label{display:block;font-size:12.5px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--muted);margin-bottom:7px}
.adm-field input,.adm-field select,.adm-field textarea{width:100%;border:1.6px solid var(--line);border-radius:12px;padding:13px 15px;font-family:"Instrument Sans",sans-serif;font-size:16px;color:var(--ink);background:#fff;box-sizing:border-box}
.adm-field textarea{min-height:220px;resize:vertical;line-height:1.6}
.adm-field input:focus,.adm-field select:focus,.adm-field textarea:focus{border-color:var(--blue);outline:none}
.adm-actions{display:flex;gap:10px;margin-top:18px;flex-wrap:wrap;align-items:center}
.adm-msg{font-size:14px;font-weight:600;margin-top:14px;color:var(--blue)}
.adm-msg.err{color:#a33}
.adm-list{display:flex;flex-direction:column;gap:10px}
.adm-item{display:flex;align-items:center;gap:14px;border:1px solid var(--line);border-radius:14px;padding:13px 16px;background:var(--cream)}
.adm-item .cat-pill{background:var(--gold);color:var(--navy);font-size:10.5px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;padding:4px 10px;border-radius:100px;white-space:nowrap}
.adm-item .ttl{flex:1;font-weight:600;font-size:15px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--navy);text-decoration:none}
.adm-item .st{font-size:12px;font-weight:700;color:var(--muted)}
.adm-item button{font-family:inherit;font-size:13px;font-weight:700;border:1.4px solid var(--line);background:#fff;border-radius:100px;padding:7px 14px;cursor:pointer;white-space:nowrap}
.adm-item button:hover{border-color:var(--navy)}
.adm-item button.danger:hover{border-color:#a33;color:#a33}
.adm-table{width:100%;border-collapse:collapse;font-size:14px}
.adm-table th{text-align:left;font-size:11.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);padding:10px 12px;border-bottom:1.6px solid var(--line)}
.adm-table td{padding:12px;border-bottom:1px solid var(--line);vertical-align:top}
.adm-table tr:last-child td{border-bottom:none}
.adm-table button{font-family:inherit;font-size:12px;font-weight:700;border:1.4px solid var(--line);background:#fff;border-radius:100px;padding:5px 12px;cursor:pointer}
.adm-empty{padding:26px;text-align:center;color:var(--muted);font-size:14.5px;border:1.6px dashed var(--line);border-radius:14px}
.adm-kpis{display:flex;gap:14px;margin-bottom:22px;flex-wrap:wrap}
.adm-kpi{flex:1;min-width:150px;background:var(--navy);color:var(--cream);border-radius:16px;padding:20px 22px}
.adm-kpi b{display:block;font-family:"Instrument Serif",serif;font-size:34px;font-weight:500;color:var(--gold)}
.adm-kpi span{font-size:12.5px;color:var(--muted-light,#c9c2b4)}
.adm-code{background:var(--navy);color:var(--cream);border-radius:14px;padding:18px 20px;font-family:ui-monospace,Menlo,monospace;font-size:12px;line-height:1.6;overflow-x:auto;white-space:pre;margin-top:12px}
.adm-note{font-size:13.5px;color:var(--muted);line-height:1.7;margin-top:12px}
.adm-note b{color:var(--ink)}
@media (max-width:720px){.adm-grid{grid-template-columns:1fr}.adm-card{padding:22px 18px}.adm-table{font-size:13px}.adm-table th,.adm-table td{padding:8px}#editbar{border-radius:18px;flex-wrap:wrap;justify-content:center;bottom:12px}}

.polmodal{position:fixed;inset:0;z-index:400;display:flex;align-items:center;justify-content:center;padding:20px}
.polmodal-back{position:absolute;inset:0;background:rgba(11,31,63,.55)}
.polmodal-card{position:relative;z-index:1;width:100%;max-width:680px;background:var(--cream);border-radius:22px;padding:28px 26px;box-shadow:0 24px 60px rgba(0,0,0,.35)}
.polmodal-card h3{font-size:26px;margin:0 0 8px;color:var(--navy)}
.polmodal-card .hint{font-size:13.5px;color:var(--muted);margin-bottom:14px}
.polmodal-x{position:absolute;top:14px;right:14px;border:none;background:transparent;font-size:18px;cursor:pointer;color:var(--muted)}
.polta{width:100%;min-height:280px;resize:vertical;border:1.6px solid var(--line);border-radius:14px;padding:14px 16px;font-family:"Instrument Sans",sans-serif;font-size:14px;line-height:1.6;color:var(--navy);outline:none;background:#fff;box-sizing:border-box}
.polta:focus{border-color:var(--blue)}
.polrow{display:flex;gap:10px;margin-top:16px;flex-wrap:wrap}
.polrow .btn{flex:1;justify-content:center}
.doc-reedit{display:none;margin-top:30px;font-size:13px}
body.editing .doc-reedit{display:block}
.doc-reedit a{color:var(--blue);font-weight:600;border-bottom:1px dashed var(--line);padding-bottom:1px}

.vshell{position:relative;border-radius:18px;overflow:hidden;background:var(--navy);aspect-ratio:16/9;cursor:default}
.vshell iframe,.vshell video{width:100%;height:100%;border:0;display:block;object-fit:cover}
.vph{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;color:var(--cream);text-align:center;padding:20px}
.vph b{font-family:"Instrument Serif",serif;font-size:22px;font-weight:500;color:var(--gold)}
.vph span{font-size:13px;opacity:.8}
body.editing .vshell{cursor:pointer;outline:1.5px dashed rgba(230,168,60,.5);outline-offset:4px}
"""

path = Path(__file__).resolve().parents[1] / "src" / "styles" / "index.css"
with path.open("a", encoding="utf-8") as f:
    f.write(css)
print("appended to", path)
