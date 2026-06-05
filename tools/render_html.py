#!/usr/bin/env python3
"""把 v3 全书(Ch1-Ch10 + 附录A-D)渲染为单文件 HTML + 合并 markdown 发布产物。

为何不用 build_book.py:本机(RHEL7)缺 weasyprint 的系统库(pango/cairo,需 root),
PDF 路径不可用;HTML 路径仅需 python-markdown(py3.6 兼容 3.3.x)。Mermaid 图改由
浏览器端 mermaid.js(CDN)渲染,绕开缺失的 chromium。

输出:
  releases/v3.1/agent-security-frame-v3.1.md    合并全书 markdown(可在任意机器渲染 PDF)
  releases/v3.1/agent-security-frame-v3.1.html  单文件 HTML(浏览器直接打开)
  releases/v3.1/figures/                         图片(自包含)

用法:python3 tools/render_html.py
"""
import glob
import re
import shutil
from pathlib import Path

import markdown

ROOT = Path(__file__).resolve().parent.parent
REL = ROOT / "releases" / "v3.1"
TITLE = "自主智能体安全防护体系设计 / AI Agent Security Framework — v3.1"


def chapter_order():
    by_num = {}
    for f in glob.glob(str(ROOT / "v3_第*章_*.md")):
        if "归档" in f or "迁移前原稿" in f:
            continue
        m = re.search(r"v3_第(\d+)章", Path(f).name)
        if m:
            by_num[int(m.group(1))] = Path(f)
    out = sorted(by_num.items(), key=lambda x: x[0])
    for i, letter in enumerate(["A", "B", "C", "D"], start=1):
        for f in glob.glob(str(ROOT / f"v3_附录{letter}_*.md")):
            if "归档" in f or "迁移前原稿" in f:
                continue
            out.append((100 + i, Path(f)))
    return out


def label(n):
    return f"附录{chr(ord('A') + n - 101)}" if n >= 100 else f"第{n}章"


CSS = """
:root { --fg:#1a1a1a; --muted:#666; --rule:#e2e2e2; --accent:#b5482e; --code-bg:#f6f6f4; }
* { box-sizing: border-box; }
body { font-family: -apple-system, "PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", "Source Han Sans SC", sans-serif;
  color: var(--fg); line-height: 1.75; max-width: 860px; margin: 0 auto; padding: 3rem 1.4rem 6rem; font-size: 16px; }
h1,h2,h3,h4 { line-height: 1.35; font-weight: 700; }
h1 { font-size: 1.9rem; margin: 2.6rem 0 1rem; }
h2 { font-size: 1.5rem; margin: 2.4rem 0 .9rem; padding-top: .6rem; border-top: 2px solid var(--rule); }
h3 { font-size: 1.2rem; margin: 1.8rem 0 .6rem; color: #222; }
h4 { font-size: 1.05rem; margin: 1.3rem 0 .5rem; color: #333; }
p, li { font-size: 1rem; }
a { color: var(--accent); text-decoration: none; }
code { background: var(--code-bg); padding: .12em .35em; border-radius: 3px; font-size: .9em;
  font-family: "SF Mono", Menlo, Consolas, "Noto Sans Mono CJK SC", monospace; }
pre { background: var(--code-bg); padding: 1rem 1.2rem; border-radius: 6px; overflow-x: auto; border: 1px solid var(--rule); }
pre code { background: none; padding: 0; }
pre.mermaid { background: #fff; text-align: center; border: 1px dashed var(--rule); }
table { border-collapse: collapse; width: 100%; margin: 1.1rem 0; font-size: .92rem; }
th, td { border: 1px solid var(--rule); padding: .5rem .7rem; text-align: left; vertical-align: top; }
th { background: #faf7f5; font-weight: 700; }
blockquote { margin: 1.1rem 0; padding: .6rem 1rem; border-left: 3px solid var(--accent); background: #fbf8f7; color: #333; }
hr { border: none; border-top: 1px solid var(--rule); margin: 2.6rem 0; }
img { max-width: 100%; height: auto; display: block; margin: 1.2rem auto; }
.book-title { text-align: center; border: none; padding: 2rem 0 1rem; }
.book-title h1 { border: none; font-size: 2.1rem; margin: 0; }
.meta { text-align: center; color: var(--muted); margin-bottom: 1rem; }
.toc { background: #faf9f7; border: 1px solid var(--rule); border-radius: 6px; padding: 1rem 1.4rem; margin: 1.6rem 0 2.4rem; }
.toc ul { margin: .2rem 0; }
"""


def main():
    REL.mkdir(parents=True, exist_ok=True)
    chs = chapter_order()

    # ---- 合并 markdown ----
    parts = [f"# {TITLE}\n"]
    for n, p in chs:
        parts.append(p.read_text(encoding="utf-8").strip())
    merged_md = "\n\n---\n\n".join(parts) + "\n"
    (REL / "agent-security-frame-v3.1.md").write_text(merged_md, encoding="utf-8")

    # ---- 拷贝图片(自包含)----
    src_fig = ROOT / "figures" / "v3"
    if src_fig.exists():
        dst_fig = REL / "figures" / "v3"
        dst_fig.mkdir(parents=True, exist_ok=True)
        for img in src_fig.glob("*.png"):
            shutil.copy2(img, dst_fig / img.name)

    # ---- 暂存 mermaid 块(交给浏览器端 mermaid.js)----
    blocks = []
    def stash(m):
        blocks.append(m.group(1))
        return f"\n\nMERMAIDPH{len(blocks) - 1}MERMAIDPH\n\n"
    md_src = re.sub(r"```mermaid\s*\n(.*?)```", stash, merged_md, flags=re.S)

    body = markdown.markdown(
        md_src,
        extensions=["tables", "fenced_code", "toc", "sane_lists", "attr_list"],
    )
    for i, blk in enumerate(blocks):
        body = body.replace(f"<p>MERMAIDPH{i}MERMAIDPH</p>",
                            f'<pre class="mermaid">{blk.strip()}</pre>')

    # ---- 章节导航 ----
    toc_items = "".join(f"<li>{label(n)} — {p.stem.split('_', 1)[-1]}</li>" for n, p in chs)
    header = (f'<div class="book-title"><h1>{TITLE}</h1></div>'
              f'<div class="meta">v3.1 · 渲染于本机(HTML;PDF 见说明)</div>'
              f'<div class="toc"><strong>章节</strong><ul>{toc_items}</ul></div>')

    html = (
        '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width, initial-scale=1">'
        f'<title>{TITLE}</title><style>{CSS}</style>'
        '<script type="module">import mermaid from '
        '"https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs";'
        'mermaid.initialize({startOnLoad:true,theme:"neutral"});</script>'
        f'</head><body>{header}{body}</body></html>'
    )
    (REL / "agent-security-frame-v3.1.html").write_text(html, encoding="utf-8")

    md_kb = (REL / "agent-security-frame-v3.1.md").stat().st_size / 1024
    html_kb = (REL / "agent-security-frame-v3.1.html").stat().st_size / 1024
    print(f"章节数: {len(chs)} (Ch1-10 + 附录A-D)")
    print(f"mermaid 块: {len(blocks)} (浏览器端 mermaid.js 渲染)")
    print(f"✓ releases/v3.1/agent-security-frame-v3.1.md   ({md_kb:.0f} KB)")
    print(f"✓ releases/v3.1/agent-security-frame-v3.1.html ({html_kb:.0f} KB)")


if __name__ == "__main__":
    main()
