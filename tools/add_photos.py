#!/usr/bin/env python3
"""Resize photos for the web and print ready-to-paste <figure> markup.

Usage:
    python3 tools/add_photos.py originals/IMG_0001.jpg originals/IMG_0002.jpg \
        --tag "Salat Party" --alt "DJ behind the decks under red light"

Each source image becomes two WebP files in photos/:
    <slug>-900.webp   grid thumbnail (long edge up to 900 px)
    <slug>-2000.webp  lightbox version (long edge up to 2000 px, never upscaled)

Originals stay in originals/ (git-ignored), so the repository only carries the
web-sized files. Paste the printed markup into index.html inside <div class="grid">.
"""
import argparse
import html
import re
import sys
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "photos"
GRID = 900
FULL = 2000


def slugify(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-") or "photo"


def save(img: Image.Image, long_edge: int, path: Path) -> tuple[int, int]:
    copy = img.copy()
    copy.thumbnail((long_edge, long_edge), Image.LANCZOS)  # thumbnail never upscales
    copy.save(path, "WEBP", quality=82, method=6)
    return copy.size


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("files", nargs="+", type=Path)
    ap.add_argument("--tag", default="", help="caption shown in the lightbox (event, client or place)")
    ap.add_argument("--alt", default="", help="alt text describing the photo")
    ap.add_argument("--slug", default="", help="file name base (single file only)")
    args = ap.parse_args()

    OUT.mkdir(exist_ok=True)
    for src in args.files:
        img = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
        slug = args.slug if args.slug and len(args.files) == 1 else slugify(src.stem)
        w, h = save(img, GRID, OUT / f"{slug}-{GRID}.webp")
        save(img, FULL, OUT / f"{slug}-{FULL}.webp")
        alt = html.escape(args.alt or args.tag, quote=True)
        tag = html.escape(args.tag, quote=True)
        print(
            f'<figure class="tile"><a href="photos/{slug}-{FULL}.webp" data-caption="{tag}">'
            f'<img src="photos/{slug}-{GRID}.webp" width="{w}" height="{h}" alt="{alt}" loading="lazy" decoding="async">'
            f"</a></figure>"
        )
    return 0


if __name__ == "__main__":
    sys.exit(main())
