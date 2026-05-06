#!/usr/bin/env python3
"""
将 markdown 文件转换为 PDF(中文优化)。
- 使用 python-markdown 渲染 HTML
- 使用 WeasyPrint 渲染 PDF
- 内嵌适配中文的 CSS

用法:python3 md_to_pdf.py <input.md> <output.pdf>
"""

import sys
import re
from pathlib import Path
import markdown
from weasyprint import HTML, CSS
from weasyprint.text.fonts import FontConfiguration


STYLE = """
@page {
    size: A4;
    margin: 2cm 2cm 2.2cm 2cm;

    @bottom-center {
        content: counter(page) " / " counter(pages);
        font-family: "Microsoft YaHei", sans-serif;
        font-size: 9pt;
        color: #999;
    }
}

body {
    font-family: "Microsoft YaHei", "微软雅黑", "Noto Sans CJK SC", sans-serif;
    font-size: 11pt;
    line-height: 1.7;
    color: #222;
    text-align: justify;
}

h1 {
    font-size: 22pt;
    color: #185FA5;
    border-bottom: 2px solid #185FA5;
    padding-bottom: 0.3em;
    margin-top: 1.5em;
    margin-bottom: 0.8em;
    page-break-before: auto;
    page-break-after: avoid;
}

h1:first-of-type {
    margin-top: 0;
}

h2 {
    font-size: 16pt;
    color: #185FA5;
    border-left: 4px solid #185FA5;
    padding-left: 0.4em;
    margin-top: 1.5em;
    margin-bottom: 0.6em;
    page-break-after: avoid;
}

h3 {
    font-size: 13pt;
    color: #333;
    margin-top: 1.2em;
    margin-bottom: 0.5em;
    page-break-after: avoid;
}

h4 {
    font-size: 11.5pt;
    color: #555;
    margin-top: 1em;
    margin-bottom: 0.4em;
    page-break-after: avoid;
}

p {
    margin: 0.5em 0;
    text-indent: 0;
}

strong, b {
    color: #222;
    font-weight: 600;
}

em, i {
    color: #185FA5;
}

ul, ol {
    margin: 0.5em 0;
    padding-left: 1.8em;
}

li {
    margin: 0.3em 0;
    line-height: 1.65;
}

code {
    background-color: #f5f4f0;
    color: #A32D2D;
    padding: 1px 5px;
    border-radius: 3px;
    font-family: "JetBrains Mono", "Consolas", monospace;
    font-size: 0.92em;
}

pre {
    background-color: #f5f4f0;
    border-left: 3px solid #ccc;
    padding: 0.7em 1em;
    border-radius: 3px;
    overflow-x: auto;
    font-size: 9.5pt;
    line-height: 1.45;
    page-break-inside: avoid;
}

pre code {
    background-color: transparent;
    color: #222;
    padding: 0;
    font-size: inherit;
}

blockquote {
    border-left: 3px solid #185FA5;
    padding-left: 0.8em;
    margin-left: 0;
    color: #666;
    font-size: 10.5pt;
    background-color: #f8f9fc;
    padding: 0.6em 0.8em;
    border-radius: 2px;
    page-break-inside: avoid;
}

table {
    border-collapse: collapse;
    width: 100%;
    margin: 0.8em 0;
    font-size: 10pt;
    page-break-inside: avoid;
}

th, td {
    border: 1px solid #ddd;
    padding: 6px 10px;
    text-align: left;
}

th {
    background-color: #f0f0ee;
    color: #333;
    font-weight: 600;
}

tr:nth-child(even) {
    background-color: #fafafa;
}

hr {
    border: none;
    border-top: 1px solid #e0e0e0;
    margin: 1.5em 0;
}

a {
    color: #185FA5;
    text-decoration: none;
}

img {
    display: block;
    max-width: 100%;
    margin: 0.8em auto;
    page-break-inside: avoid;
}

/* Mermaid SVG 居中且不挤占版面 */
p > img[src*="figures/"] {
    max-width: 92%;
}

/* 引用的参考文献 */
p:has(> sup), sup {
    font-size: 0.82em;
}

/* 章节间强制翻页 */
h1 + * {
    page-break-before: avoid;
}
"""


def md_to_html(md_path: Path) -> str:
    """把 markdown 转成带样式的 HTML。"""
    md_content = md_path.read_text(encoding="utf-8")

    md = markdown.Markdown(
        extensions=[
            "extra",        # 包括 tables / fenced_code / footnotes
            "sane_lists",
            "smarty",
            "toc",
        ],
        extension_configs={
            "toc": {"toc_depth": "2-4"},
        },
    )
    body = md.convert(md_content)

    html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>{md_path.stem}</title>
</head>
<body>
{body}
</body>
</html>"""
    return html


def main():
    if len(sys.argv) != 3:
        print("Usage: md_to_pdf.py <input.md> <output.pdf>")
        sys.exit(1)

    md_path = Path(sys.argv[1])
    pdf_path = Path(sys.argv[2])

    if not md_path.exists():
        print(f"ERROR: {md_path} not found")
        sys.exit(1)

    print(f"[1/3] Reading {md_path.name}...")
    html_content = md_to_html(md_path)

    # 保存中间 HTML 以便调试
    html_debug = pdf_path.with_suffix(".html")
    html_debug.write_text(html_content, encoding="utf-8")
    print(f"[2/3] HTML saved to {html_debug.name} (for debug)")

    print(f"[3/3] Rendering PDF with WeasyPrint...")
    font_config = FontConfiguration()
    # base_url 使相对路径(如 figures/xxx.svg)能被 weasyprint 正确解析
    base_url = str(md_path.parent.resolve()) + "/"
    HTML(string=html_content, base_url=base_url).write_pdf(
        target=str(pdf_path),
        stylesheets=[CSS(string=STYLE, font_config=font_config)],
        font_config=font_config,
    )

    size_kb = pdf_path.stat().st_size / 1024
    print(f"✓ PDF generated: {pdf_path} ({size_kb:.1f} KB)")


if __name__ == "__main__":
    main()
