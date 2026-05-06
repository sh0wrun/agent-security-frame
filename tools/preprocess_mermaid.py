#!/usr/bin/env python3
"""
预处理 markdown 文件:提取所有 ```mermaid ... ``` 块,用 mmdc 渲染为 SVG,
替换 markdown 中对应块为 ![](path/to/svg) 图片引用。

用法:python3 preprocess_mermaid.py <input.md> <output.md>

前置依赖:
- mmdc(mermaid-cli)在 tools/node_modules/.bin/ 下
- 输出的 SVG 文件放在 <output.md 同级目录>/figures/ 下

输出:
- <output.md>:预处理后的 markdown
- <同级目录>/figures/<stem>_fig_N.svg:每个 mermaid 图的 SVG
"""

import sys
import re
import hashlib
import subprocess
import shutil
from pathlib import Path


MERMAID_RE = re.compile(
    r"```mermaid\s*\n(.*?)```",
    re.DOTALL,
)


def find_mmdc():
    """定位 mmdc 可执行文件。找不到时返回 None 而非抛异常。"""
    here = Path(__file__).resolve().parent
    candidates = [
        here / "node_modules" / ".bin" / "mmdc",
        Path("/usr/local/bin/mmdc"),
        Path("/usr/bin/mmdc"),
    ]
    for c in candidates:
        if c.exists() and c.is_file():
            return str(c)
    return shutil.which("mmdc")


def render_with_mmdc(mmdc_path: str, code: str, out_svg: Path, puppeteer_cfg: Path = None):
    """用 mmdc 渲染 mermaid code。"""
    out_svg.parent.mkdir(parents=True, exist_ok=True)
    tmp_mmd = out_svg.with_suffix(".mmd")
    tmp_mmd.write_text(code, encoding="utf-8")
    try:
        cmd = [
            mmdc_path,
            "-i", str(tmp_mmd),
            "-o", str(out_svg),
            "-b", "transparent",
            "-t", "default",
        ]
        if puppeteer_cfg and puppeteer_cfg.exists():
            cmd += ["-p", str(puppeteer_cfg)]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
        if result.returncode != 0:
            print(f"  ⚠ mmdc stderr: {result.stderr[:500]}", file=sys.stderr)
            raise RuntimeError(f"mmdc failed with exit {result.returncode}")
    finally:
        tmp_mmd.unlink(missing_ok=True)


def render_with_chromium(code: str, out_svg: Path):
    """Fallback:用系统 Chromium + mermaid.js CDN 渲染。"""
    here = Path(__file__).resolve().parent
    chromium_script = here / "render_mermaid_chromium.py"
    if not chromium_script.exists():
        raise RuntimeError(f"fallback script not found: {chromium_script}")
    # 写 code 到临时文件(避免命令行转义问题)
    tmp_mmd = out_svg.with_suffix(".mmd")
    tmp_mmd.parent.mkdir(parents=True, exist_ok=True)
    tmp_mmd.write_text(code, encoding="utf-8")
    try:
        result = subprocess.run([
            sys.executable, str(chromium_script),
            "--file", str(tmp_mmd),
            "--out", str(out_svg),
        ], capture_output=True, text=True, timeout=120)
        if result.returncode != 0:
            print(f"  ⚠ chromium stderr: {result.stderr[:500]}", file=sys.stderr)
            raise RuntimeError(f"chromium renderer failed")
    finally:
        tmp_mmd.unlink(missing_ok=True)


def render_mermaid(code: str, out_svg: Path, mmdc_path=None, puppeteer_cfg=None):
    """统一接口:优先 mmdc,失败则降级 Chromium。"""
    if mmdc_path:
        try:
            render_with_mmdc(mmdc_path, code, out_svg, puppeteer_cfg)
            return "mmdc"
        except Exception as e:
            print(f"  ⚠ mmdc 失败,降级 Chromium:{e}", file=sys.stderr)
    render_with_chromium(code, out_svg)
    return "chromium"


def main():
    if len(sys.argv) != 3:
        print("Usage: preprocess_mermaid.py <input.md> <output.md>")
        sys.exit(1)

    in_path = Path(sys.argv[1])
    out_path = Path(sys.argv[2])
    figures_dir = out_path.parent / "figures"
    figures_dir.mkdir(parents=True, exist_ok=True)

    # Puppeteer config(容器/无桌面环境需要 --no-sandbox)
    puppeteer_cfg = Path(__file__).resolve().parent / "puppeteer.json"
    if not puppeteer_cfg.exists():
        puppeteer_cfg.write_text('{"args": ["--no-sandbox", "--disable-setuid-sandbox"]}\n')

    mmdc_path = find_mmdc()
    if mmdc_path:
        print(f"[1/3] Using mmdc: {mmdc_path}")
    else:
        print(f"[1/3] mmdc 不可用,使用 Chromium + mermaid.js CDN 作为 fallback")

    md_content = in_path.read_text(encoding="utf-8")
    # 简化 stem:去掉空格/括号/非 ASCII 后缀,便于 URL 解析
    raw_stem = in_path.stem
    # 保留中文但去掉空格、括号
    clean_stem = re.sub(r"[\s()（）]+", "", raw_stem)
    # 若仍含复杂字符,只保留"第N章"前缀
    m_chapter = re.match(r"(第\d+章)", clean_stem)
    stem = m_chapter.group(1) if m_chapter else clean_stem[:10]

    counter = [0]

    def replace_block(match: re.Match) -> str:
        counter[0] += 1
        idx = counter[0]
        code = match.group(1).rstrip()
        h = hashlib.md5(code.encode("utf-8")).hexdigest()[:8]
        # 默认 PNG(光栅化,兼容性最好,避免 mermaid foreignObject 问题)
        fname = f"{stem}_fig{idx:02d}_{h}.png"
        out_svg = figures_dir / fname
        print(f"  [fig {idx}] rendering {fname} ...")
        try:
            backend = render_mermaid(code, out_svg, mmdc_path=mmdc_path, puppeteer_cfg=puppeteer_cfg)
            print(f"  ✓ fig {idx} 完成 (使用 {backend})")
        except Exception as e:
            print(f"  ✗ fig {idx} 失败: {e}", file=sys.stderr)
            return match.group(0)
        # 用相对路径引用 SVG
        rel = f"figures/{fname}"
        return f"![Figure {idx}]({rel})"

    print(f"[2/3] Processing {in_path.name}...")
    new_content, n_replaced = MERMAID_RE.subn(replace_block, md_content)
    n_replaced = counter[0]

    out_path.write_text(new_content, encoding="utf-8")
    print(f"[3/3] Preprocessed → {out_path.name} ({n_replaced} mermaid blocks replaced with SVG)")


if __name__ == "__main__":
    main()
