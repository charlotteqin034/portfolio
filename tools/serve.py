#!/usr/bin/env python3
"""Local dev server that tells the browser never to cache.

`python3 -m http.server` sends no cache headers at all, which lets browsers
heuristically hang on to the HTML, CSS and JS — so you edit a file, reload, and
see the old page. This sends no-store on everything instead.

    python3 tools/serve.py [port]     # default 4444
"""
import functools
import http.server
import os
import socketserver
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 4444
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def send_head(self):
        # ignore the browser's If-Modified-Since so it never gets a bare 304
        self.headers.replace_header("If-Modified-Since", "") \
            if "If-Modified-Since" in self.headers else None
        self.headers.replace_header("If-None-Match", "") \
            if "If-None-Match" in self.headers else None
        return super().send_head()


class ReusableServer(socketserver.TCPServer):
    allow_reuse_address = True


if __name__ == "__main__":
    handler = functools.partial(NoCacheHandler, directory=ROOT)
    with ReusableServer(("127.0.0.1", PORT), handler) as httpd:
        print(f"pixel-portfolio → http://127.0.0.1:{PORT}  (Ctrl+C to stop)")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nstopped")
