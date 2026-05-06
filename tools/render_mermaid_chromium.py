#!/usr/bin/env python3
"""
用系统 Chromium + mermaid.js CDN 渲染单个 Mermaid 块。
默认输出 PNG(光栅化,兼容性最好);可选 SVG(矢量但可能有 foreignObject 问题)。

用法:
  python3 render_mermaid_chromium.py --file input.mmd --out figures/fig.png
  python3 render_mermaid_chromium.py --code 'flowchart TD\nA --> B' --out figures/fig.png
  python3 render_mermaid_chromium.py --file input.mmd --out figures/fig.svg  # 输出 SVG(旧逻辑)
"""

import argparse
import re
import subprocess
import sys
import tempfile
import json
from pathlib import Path


HTML_TEMPLATE = """<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>mermaid</title>
<style>
  html, body {{ margin: 0; padding: 16px; background: white; font-family: "Microsoft YaHei", "Noto Sans CJK SC", sans-serif; }}
  #render {{ display: inline-block; }}
  /* 强制所有 mermaid SVG 里的文字用中文字体 */
  #render svg .nodeLabel, #render svg .edgeLabel, #render svg .label, #render svg text, #render svg foreignObject * {{
    font-family: "Microsoft YaHei", "Noto Sans CJK SC", "PingFang SC", sans-serif !important;
  }}
</style>
<script type="module">
  import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";
  mermaid.initialize({{
    startOnLoad: false,
    theme: "default",
    securityLevel: "loose",
    fontFamily: '"Microsoft YaHei", "Noto Sans CJK SC", sans-serif',
    flowchart: {{ useMaxWidth: false }},
    sequence: {{ useMaxWidth: false }},
    gantt: {{ useMaxWidth: false }},
  }});
  const code = {code_json};
  try {{
    const {{ svg }} = await mermaid.render("mmd-out", code);
    document.getElementById("render").innerHTML = svg;
    // 关闭 responsive 宽度,使用 viewBox 原尺寸
    const s = document.querySelector("#render svg");
    if (s) {{
      const vb = s.getAttribute("viewBox");
      if (vb) {{
        const [,, w, h] = vb.split(/\\s+/).map(Number);
        s.setAttribute("width", w);
        s.setAttribute("height", h);
        s.style.maxWidth = "none";
      }}
    }}
    document.title = "READY";
  }} catch (e) {{
    document.body.innerHTML = '<pre style="color:red">' + e.message + '</pre>';
    document.title = "ERROR";
  }}
</script>
</head>
<body>
<div id="render"></div>
</body>
</html>
"""


def find_chromium() -> str:
    for c in ["chromium", "google-chrome", "chrome"]:
        try:
            subprocess.run([c, "--version"], capture_output=True, check=True)
            return c
        except (subprocess.CalledProcessError, FileNotFoundError):
            pass
    raise RuntimeError("chromium/chrome not found")


def render(code: str, out_path: Path, as_png: bool):
    out_path.parent.mkdir(parents=True, exist_ok=True)
    chromium = find_chromium()

    with tempfile.TemporaryDirectory() as tdir:
        tdir = Path(tdir)
        html_file = tdir / "input.html"
        html_file.write_text(HTML_TEMPLATE.format(code_json=json.dumps(code)), encoding="utf-8")

        if as_png:
            # 用 chromium headless --screenshot,使用 "选择元素" 截图
            # 先大窗口渲染,再用 javascript 查询 SVG 边界,裁剪
            # 简化方案:先渲染大 viewport,最后用 PIL 自动裁白边
            tmp_png = tdir / "raw.png"
            result = subprocess.run([
                chromium,
                "--headless=new",
                "--disable-gpu",
                "--no-sandbox",
                "--hide-scrollbars",
                "--default-background-color=FFFFFFFF",
                "--virtual-time-budget=30000",
                "--window-size=2000,2400",
                f"--screenshot={tmp_png}",
                f"file://{html_file}",
            ], capture_output=True, text=True, timeout=90)
            if result.returncode != 0:
                raise RuntimeError(f"Chromium screenshot 失败: {result.stderr[:400]}")
            if not tmp_png.exists():
                raise RuntimeError("截图文件未生成")

            # 用 PIL 裁剪白边
            try:
                from PIL import Image, ImageChops
                img = Image.open(tmp_png).convert("RGB")
                bg = Image.new("RGB", img.size, (255, 255, 255))
                diff = ImageChops.difference(img, bg)
                bbox = diff.getbbox()
                if bbox:
                    # 加 16px padding
                    pad = 16
                    left = max(0, bbox[0] - pad)
                    top = max(0, bbox[1] - pad)
                    right = min(img.width, bbox[2] + pad)
                    bottom = min(img.height, bbox[3] + pad)
                    img = img.crop((left, top, right, bottom))
                img.save(out_path, "PNG", optimize=True)
            except ImportError:
                # PIL 不可用,保留原始 screenshot
                import shutil
                shutil.copy(tmp_png, out_path)
        else:
            # SVG 模式:从 DOM 提取
            result = subprocess.run([
                chromium,
                "--headless=new",
                "--disable-gpu",
                "--no-sandbox",
                "--virtual-time-budget=30000",
                "--dump-dom",
                f"file://{html_file}",
            ], capture_output=True, text=True, timeout=60)
            if result.returncode != 0:
                raise RuntimeError(f"Chromium dump-dom 失败: {result.stderr[:400]}")
            m = re.search(r"<svg[^>]*>.*?</svg>", result.stdout, re.DOTALL)
            if not m:
                (out_path.parent / f"{out_path.stem}_debug.html").write_text(result.stdout, encoding="utf-8")
                raise RuntimeError("未找到 <svg>(已保存 debug HTML)")
            out_path.write_text('<?xml version="1.0" encoding="UTF-8"?>\n' + m.group(0), encoding="utf-8")


def main():
    ap = argparse.ArgumentParser()
    group = ap.add_mutually_exclusive_group(required=True)
    group.add_argument("--code", help="Mermaid code string")
    group.add_argument("--file", help="Path to .mmd file")
    ap.add_argument("--out", required=True, help="Output path (.png 或 .svg,按后缀决定)")
    args = ap.parse_args()

    code = Path(args.file).read_text(encoding="utf-8") if args.file else args.code
    out_path = Path(args.out)
    as_png = out_path.suffix.lower() in (".png", ".jpg", ".jpeg")

    render(code, out_path, as_png)
    print(f"✓ {'PNG' if as_png else 'SVG'} rendered: {out_path}")


if __name__ == "__main__":
    main()
