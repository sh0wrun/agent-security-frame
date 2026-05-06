#!/usr/bin/env python3
"""
裁剪 figures/v3/*.png 底部留白。
原始截图为 1400×4500,但实际内容只占顶部一部分,底部全白浪费空间。
本脚本用 PIL ImageChops.difference 检测白边边界,只裁底部白行,保留宽度。

用法:
  python3 tools/trim_screenshots.py                # 裁剪所有
  python3 tools/trim_screenshots.py --padding 30  # 调整底部留白(默认 20px)
  python3 tools/trim_screenshots.py --files arch.png cik.png  # 只裁指定
  python3 tools/trim_screenshots.py --dry-run     # 只显示尺寸,不写文件
"""

import argparse
from pathlib import Path
from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parent.parent
DIR = ROOT / "figures" / "v3"


def find_content_bottom(img: Image.Image, bg_color=(250, 250, 249), tol: int = 2) -> int:
    """返回最后一行非背景色像素的 y。bg_color 默认 v3-prototype body bg #fafaf9。
    tol 容差应对 PNG 压缩微小色差。返回 0 = 全是背景色。"""
    rgb = img.convert("RGB")
    bg = Image.new("RGB", rgb.size, bg_color)
    diff = ImageChops.difference(rgb, bg)
    # 把容差内的像素视为背景(每通道差异 ≤ tol → 设为 0)
    diff = diff.point(lambda v: 0 if v <= tol else v)
    bbox = diff.getbbox()
    if bbox is None:
        return 0
    return bbox[3]


def trim_one(path: Path, padding: int, dry_run: bool) -> bool:
    img = Image.open(path)
    h_orig = img.height
    bottom = find_content_bottom(img)
    if bottom == 0:
        print(f"  {path.name}: 全白图,跳过")
        return False
    new_h = min(h_orig, bottom + padding)
    if new_h >= h_orig:
        print(f"  {path.name}: {h_orig}px 已无可裁")
        return False
    saved = h_orig - new_h
    if dry_run:
        print(f"  {path.name}: {h_orig} -> {new_h} (省 {saved}px) [DRY RUN]")
        return False
    cropped = img.crop((0, 0, img.width, new_h))
    cropped.save(path, "PNG", optimize=True)
    new_size_kb = path.stat().st_size // 1024
    print(f"  OK {path.name}: {h_orig} -> {new_h} (省 {saved}px) | {new_size_kb} KB")
    return True


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--padding", type=int, default=20)
    p.add_argument("--files", nargs="*", default=[])
    p.add_argument("--dry-run", action="store_true")
    args = p.parse_args()

    targets = [DIR / f for f in args.files] if args.files else sorted(DIR.glob("*.png"))
    print(f"=== Trim {len(targets)} images (padding={args.padding}px) ===\n")

    ok = 0
    for path in targets:
        if not path.exists():
            print(f"  MISSING {path.name}")
            continue
        if trim_one(path, args.padding, args.dry_run):
            ok += 1

    print(f"\n=== Done {ok}/{len(targets)} ===")


if __name__ == "__main__":
    main()
