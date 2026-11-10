#!/usr/bin/env python3
"""字节级可复现打包：out/ → tar.gz（固定顺序/权限/时间戳/gzip mtime）。

用法: python3 scripts/pack-out.py <out_dir> <output_tar_gz>
- 文件顺序：相对路径排序
- 所有条目 mtime=0、uid/gid=0、uname/gname=""、mode=0644（目录 0755）
- gzip mtime=0（不受构建时间影响）
"""
import os
import sys
import tarfile
import gzip

def main() -> int:
    if len(sys.argv) != 3:
        print("usage: pack-out.py <out_dir> <output.tar.gz>", file=sys.stderr)
        return 2
    out_dir, out_tar = sys.argv[1], sys.argv[2]
    names = []
    for root, _dirs, files in os.walk(out_dir):
        for f in files:
            full = os.path.join(root, f)
            rel = os.path.relpath(full, out_dir).replace(os.sep, "/")
            names.append(rel)
    names.sort()
    # 关键：gzip 头不能带输出文件名（GzipFile(filename=...) 会写 FNAME → 文件名不同则字节不同）
    with open(out_tar, "wb") as raw, gzip.GzipFile(filename="", fileobj=raw, mode="wb", compresslevel=9, mtime=0) as gz:
        with tarfile.open(fileobj=gz, mode="w", format=tarfile.PAX_FORMAT) as tar:
            for rel in names:
                full = os.path.join(out_dir, rel)
                info = tarfile.TarInfo(name=f"./{rel}")
                info.size = os.path.getsize(full)
                info.mtime = 0
                info.mode = 0o644
                info.uid = info.gid = 0
                info.uname = info.gname = ""
                with open(full, "rb") as fh:
                    tar.addfile(info, fh)
    print(f"packed {len(names)} files -> {out_tar}")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
