#!/usr/bin/env python3
"""
一键构建整本 PDF:遍历 Ch1–Ch12,分别生成单章 PDF,最后合并。

用法:python3 tools/build_book.py

输出:
  output/chapters/第N章_*.pdf  每章单独 PDF
  output/figures/              Mermaid PNG 图
  output/book_intermediate/    预处理后的 .md
  output/自主智能体安全防护体系设计_完整版.pdf  合并后整本
"""

import sys
import subprocess
import shutil
import time
import glob
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
TOOLS = ROOT / "tools"
OUTPUT = ROOT / "output"
CHAPTERS_OUT = OUTPUT / "chapters"
INTER_OUT = OUTPUT / "book_intermediate"


def find_chapter_files(include_v2: bool = False):
    """找出所有章节 md 文件,按章号排序。附录排在最后。

    默认只扫 v3_第N章_*.md + v3_附录*_*.md(Sub-phase C 阶段)。
    --include-v2 时,同章号无 v3 版本则 fallback 第N章_*.md(v2)。

    v2 / v3 混合 build 仅供调试,生产 PDF 不应混用(论述风格与路线图差异)。
    排除:含「归档」「迁移前原稿」字样的文件。

    返回 (序号, 路径) 列表;附录用 100+ 序号占位以保证排在正文之后。
    """
    by_num: dict[int, Path] = {}

    # 优先扫 v3 章节
    for f in glob.glob(str(ROOT / "v3_第*章_*.md")):
        if "归档" in f or "迁移前原稿" in f:
            continue
        m = re.search(r"v3_第(\d+)章", Path(f).name)
        if m:
            by_num[int(m.group(1))] = Path(f)

    # 仅 --include-v2 时 fallback
    if include_v2:
        for f in glob.glob(str(ROOT / "第*章_*.md")):
            if "归档" in f or "迁移前原稿" in f:
                continue
            m = re.search(r"第(\d+)章", Path(f).name)
            if m:
                ch = int(m.group(1))
                by_num.setdefault(ch, Path(f))  # 不覆盖 v3

    chapters = sorted(by_num.items(), key=lambda x: x[0])

    # 附录:序号 100+(A=101 / B=102 / C=103)以保证排在正文之后
    appendix_letters = ["A", "B", "C", "D", "E", "F"]
    for i, letter in enumerate(appendix_letters, start=1):
        for f in glob.glob(str(ROOT / f"v3_附录{letter}_*.md")):
            if "归档" in f or "迁移前原稿" in f:
                continue
            chapters.append((100 + i, Path(f)))

    return chapters


def run(cmd: list[str], label: str) -> bool:
    """运行子进程,打印结果。"""
    t0 = time.time()
    result = subprocess.run(cmd, capture_output=True, text=True)
    dt = time.time() - t0
    ok = result.returncode == 0
    status = "✓" if ok else "✗"
    print(f"  {status} {label} ({dt:.1f}s)")
    if not ok:
        print(f"    STDERR: {result.stderr[:300]}")
    return ok


def build_chapter(ch_num: int, md_path: Path) -> Path | None:
    """为单章构建 PDF。返回 PDF 路径或 None。"""
    label = f"附录{chr(ord('A') + ch_num - 101)}" if ch_num >= 100 else f"Ch{ch_num}"
    print(f"\n[{label}] {md_path.name}")

    # 规范化输出文件名(去空格/括号)
    raw = md_path.stem
    clean = re.sub(r"[\s()（）]+", "_", raw).rstrip("_")
    clean = re.sub(r"_+", "_", clean)
    # 预处理后的 md
    pre_path = INTER_OUT / f"{clean}_preprocessed.md"
    # 最终 PDF
    pdf_path = CHAPTERS_OUT / f"{clean}.pdf"

    # 检查章节是否含 mermaid
    content = md_path.read_text(encoding="utf-8")
    has_mermaid = "```mermaid" in content

    # Step 1: 预处理(如有 mermaid)或复制
    if has_mermaid:
        ok = run(
            ["python3", str(TOOLS / "preprocess_mermaid.py"), str(md_path), str(pre_path)],
            "预处理 Mermaid → PNG",
        )
        if not ok:
            return None
    else:
        pre_path.write_text(content, encoding="utf-8")
        print(f"  • 无 Mermaid,直接复制")

    # Step 2: PDF 生成
    ok = run(
        ["python3", str(TOOLS / "md_to_pdf.py"), str(pre_path), str(pdf_path)],
        "渲染 PDF",
    )
    if not ok:
        return None

    size_kb = pdf_path.stat().st_size / 1024
    print(f"  ✓ 输出:{pdf_path.name} ({size_kb:.1f} KB)")
    return pdf_path


def merge_pdfs(pdf_paths: list[Path], output: Path):
    """合并多个 PDF 为一本。"""
    print(f"\n=== 合并 {len(pdf_paths)} 个章节 PDF → {output.name} ===")
    import pypdf
    writer = pypdf.PdfWriter()
    total_pages = 0
    for pdf in pdf_paths:
        reader = pypdf.PdfReader(str(pdf))
        n = len(reader.pages)
        total_pages += n
        for page in reader.pages:
            writer.add_page(page)
        print(f"  + {pdf.name} ({n} 页)")

    with open(output, "wb") as f:
        writer.write(f)
    size_mb = output.stat().st_size / 1024 / 1024
    print(f"\n✓ 整本 PDF:{output.name}")
    print(f"  总页数:{total_pages}")
    print(f"  大小:{size_mb:.2f} MB")


def main():
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument("--include-v2", action="store_true",
                   help="同章号无 v3 版本时 fallback v2 章节(默认仅 build v3 章节)")
    p.add_argument("--output-name", default="自主智能体安全防护体系设计_完整版.pdf",
                   help="整本 PDF 文件名")
    args = p.parse_args()

    print("=== 构建《自主智能体安全防护体系设计》完整 PDF ===\n")

    CHAPTERS_OUT.mkdir(parents=True, exist_ok=True)
    INTER_OUT.mkdir(parents=True, exist_ok=True)

    # 把项目根 figures/v3/ 镜像到中间目录,确保 weasyprint 以中间目录为
    # base_url 时仍能解析 ![](figures/v3/xxx.png) 引用。
    src_v3 = ROOT / "figures" / "v3"
    if src_v3.exists():
        dst_v3 = INTER_OUT / "figures" / "v3"
        dst_v3.mkdir(parents=True, exist_ok=True)
        for img in src_v3.glob("*.png"):
            shutil.copy2(img, dst_v3 / img.name)

    chapters = find_chapter_files(include_v2=args.include_v2)
    if not chapters:
        print("未发现 v3_第N章_*.md。如需 build v2,请加 --include-v2")
        sys.exit(1)
    mode = "v3 + v2 fallback" if args.include_v2 else "v3 only"
    print(f"发现 {len(chapters)} 个章节文件 ({mode}):")
    for n, f in chapters:
        label = f"附录{chr(ord('A') + n - 101)}" if n >= 100 else f"Ch{n}"
        print(f"  {label}: {f.name}")

    t_start = time.time()
    pdf_paths = []
    for n, md in chapters:
        pdf = build_chapter(n, md)
        if pdf is None:
            label = f"附录{chr(ord('A') + n - 101)}" if n >= 100 else f"Ch{n}"
            print(f"\n✗ {label} 构建失败,中止")
            sys.exit(1)
        pdf_paths.append(pdf)

    print(f"\n全部章节构建完成,耗时 {time.time() - t_start:.1f}s")

    # 合并
    book_pdf = OUTPUT / args.output_name
    merge_pdfs(pdf_paths, book_pdf)

    # 总结
    print(f"\n=== 完成 ===")
    print(f"章节 PDF 目录:{CHAPTERS_OUT}")
    print(f"整本 PDF:{book_pdf}")
    print(f"总耗时:{time.time() - t_start:.1f}s")


if __name__ == "__main__":
    main()
