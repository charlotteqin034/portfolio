#!/usr/bin/env python3
"""Stamp asset URLs in the HTML with a hash of their contents.

GitHub Pages sends `Cache-Control: max-age=600` on everything and there is no
way to change that, so a browser that has the old main.css or site.js keeps
using it after a deploy — the page looks unchanged even though the files on the
server are new. Appending ?v=<hash of the file> makes each deploy a different
URL, so the cache cannot answer for it.

    python3 tools/stamp.py            # rewrite the stamps
    python3 tools/stamp.py --check    # exit 1 if any stamp is stale
"""
import hashlib
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES = ("index.html", "project.html")

# href/src pointing at a local asset, with or without an existing ?v=
REF = re.compile(r'((?:href|src)=")(assets/[^"?]+)(\?v=[^"]*)?(")')


def digest(path):
    full = os.path.join(ROOT, path)
    if not os.path.isfile(full):
        return None
    with open(full, "rb") as fh:
        return hashlib.sha1(fh.read()).hexdigest()[:8]


def stamp(text):
    def sub(m):
        head, path, _old, tail = m.groups()
        h = digest(path)
        return head + path + (("?v=" + h) if h else "") + tail
    return REF.sub(sub, text)


def main():
    check = "--check" in sys.argv
    stale = []
    for page in PAGES:
        full = os.path.join(ROOT, page)
        with open(full, encoding="utf-8") as fh:
            before = fh.read()
        after = stamp(before)
        if before == after:
            continue
        stale.append(page)
        if not check:
            with open(full, "w", encoding="utf-8") as fh:
                fh.write(after)

    if check:
        print("stale: " + ", ".join(stale) if stale else "all stamps current")
        return 1 if stale else 0
    print("stamped: " + ", ".join(stale) if stale else "nothing to change")
    return 0


if __name__ == "__main__":
    sys.exit(main())
