#!/usr/bin/env python3
"""
用 Chromium headless 截 v3 主原型 7 tab 的高品质 PNG 图。
依赖:
  - http server 跑在 localhost:8000(prototypes/v3-skeleton/ 为 root)
  - chromium 在 /usr/bin/chromium
输出:output/figures/v3-screenshots/{tab_id}.png

用法:
  python3 tools/screenshot_v3_tabs.py
  python3 tools/screenshot_v3_tabs.py --width 1400 --height 4500
  python3 tools/screenshot_v3_tabs.py --tabs overview,principles
"""

import argparse
import subprocess
import sys
import urllib.request
from pathlib import Path
from time import sleep

ROOT = Path(__file__).resolve().parent.parent
# 输出到 figures/v3/(章节稿配图标准位置,入库;output/ 整个被 .gitignore 排除)
OUT_DIR = ROOT / "figures" / "v3"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# tab id : (URL, label, default-height-guess)
TABS = [
    ("overview",   "skeleton-A.html",                  "全景图(iframe → 骨架 A)"),
    ("principles", "v3-prototype.html#tab=principles", "设计原则"),
    ("arch",       "v3-prototype.html#tab=arch",       "架构层(7 层 + OpenClaw)"),
    ("surfaces",   "v3-prototype.html#tab=surfaces",   "攻击面(12 卡片)"),
    ("cik",        "v3-prototype.html#tab=cik",        "CIK 验证维度"),
    ("schemes",    "v3-prototype.html#tab=schemes",    "方案对比(6 方案)"),
    ("tools",      "v3-prototype.html#tab=tools",      "工具链全景(28 工具)"),
]


def check_server(base="http://localhost:8000/"):
    try:
        with urllib.request.urlopen(base, timeout=2) as resp:
            return resp.status == 200
    except Exception:
        return False


def screenshot(url: str, out_path: Path, width: int, height: int, wait_ms: int):
    """用 chromium headless 截图。virtual-time-budget 让 JS 跑到指定时长后再截。"""
    cmd = [
        "chromium",
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        "--no-sandbox",
        "--disable-dev-shm-usage",
        f"--window-size={width},{height}",
        f"--virtual-time-budget={wait_ms}",
        "--default-background-color=ffffff",
        f"--screenshot={out_path}",
        url,
    ]
    print(f"  → chromium ... --screenshot={out_path.name}")
    proc = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
    if proc.returncode != 0:
        print(f"  ⚠ stderr: {proc.stderr[:300]}")
    return out_path.exists() and out_path.stat().st_size > 1000


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--width",  type=int, default=1400)
    p.add_argument("--height", type=int, default=4500)
    p.add_argument("--wait",   type=int, default=15000, help="virtual-time-budget ms (give React + Babel time)")
    p.add_argument("--base",   default="http://localhost:8000/")
    p.add_argument("--tabs",   default="", help="comma list; empty = all 7")
    args = p.parse_args()

    if not check_server(args.base):
        print(f"❌ server not reachable at {args.base}")
        print(f"   start it with: cd {ROOT}/prototypes/v3-skeleton && python3 -m http.server 8000")
        sys.exit(1)

    selected = set(args.tabs.split(",")) if args.tabs else None
    targets = [t for t in TABS if not selected or t[0] in selected]

    print(f"=== 截 {len(targets)} 张图 → {OUT_DIR} ===")
    print(f"窗口 {args.width}x{args.height}, 等待 {args.wait}ms\n")

    ok = 0
    for tab_id, sub_url, label in targets:
        full_url = args.base.rstrip("/") + "/" + sub_url
        out = OUT_DIR / f"{tab_id}.png"
        print(f"[{tab_id}] {label}")
        print(f"  URL: {full_url}")
        if screenshot(full_url, out, args.width, args.height, args.wait):
            size_kb = out.stat().st_size // 1024
            print(f"  ✓ {out.name} ({size_kb} KB)\n")
            ok += 1
        else:
            print(f"  ✗ FAILED\n")

    print(f"=== 完成 {ok}/{len(targets)} ===")
    if ok > 0:
        print(f"\n提示:跑 `python3 tools/trim_screenshots.py` 裁剪底部留白(章节稿配图前必做)。")


if __name__ == "__main__":
    main()
