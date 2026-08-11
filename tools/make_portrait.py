#!/usr/bin/env python3
"""Generate the low-res, Bayer-dithered portrait placeholder used behind the hero type.

Output is deliberately tiny (140x184) so the CSS can blow it up with
`image-rendering: pixelated` and get chunky, on-theme pixels. Greyscale on
purpose -- main.css lays a purple duotone over it, so a real photo dropped in
later picks up the exact same treatment.
"""
import math
import struct
import zlib
from pathlib import Path

W, H = 140, 184

BAYER = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5],
]
LEVELS = 6

# light comes from the upper left, same as the reference shot
LX, LY, LZ = -0.46, -0.58, 0.67
_n = math.sqrt(LX * LX + LY * LY + LZ * LZ)
LX, LY, LZ = LX / _n, LY / _n, LZ / _n

HEAD_CX, HEAD_CY, HEAD_RX, HEAD_RY = 70.0, 62.0, 30.0, 37.0
SHOULDER_TOP = 112.0


def smooth(edge0, edge1, x):
    t = max(0.0, min(1.0, (x - edge0) / (edge1 - edge0)))
    return t * t * (3 - 2 * t)


def torso_half_width(y):
    """Neck flaring out into shoulders, then straightening into the body."""
    if y < 96:
        return 11.0 + (y - 88) * 0.35 if y > 88 else 10.0
    t = smooth(94, SHOULDER_TOP + 14, y)
    return 12.0 + t * 52.0 + max(0.0, y - 132) * 0.18


def sample(x, y):
    """Return (value, coverage) for a pixel centre. value is 0..1 luminance."""
    fx, fy = x + 0.5, y + 0.5

    dx = (fx - HEAD_CX) / HEAD_RX
    dy = (fy - HEAD_CY) / HEAD_RY
    head_r2 = dx * dx + dy * dy

    if head_r2 <= 1.0:
        nz = math.sqrt(max(0.0, 1.0 - head_r2))
        lam = max(0.0, dx * LX + dy * LY + nz * LZ)
        val = 0.05 + 0.74 * (lam ** 0.95)
        # hair reads as everything outside the face oval: a cap over the skull
        # that comes down past the ears, symmetric so it never looks lopsided
        fdx = (fx - HEAD_CX) / (HEAD_RX * 0.76)
        fdy = (fy - (HEAD_CY + 8)) / (HEAD_RY * 0.70)
        hair = 1.0 - smooth(1.20, 0.82, fdx * fdx + fdy * fdy)
        val *= 1.0 - 0.44 * hair
        val += 0.18 * hair * max(0.0, nz - 0.50) ** 1.4  # sheen on the hair
        # No facial features on purpose: at 140px the dither turns eyes and a
        # mouth into noise. An abstract bust reads as a deliberate placeholder.
        cov = smooth(1.0, 0.86, head_r2)
        return min(1.0, val), cov

    hw = torso_half_width(fy)
    if fy >= 84 and abs(fx - HEAD_CX) <= hw:
        u = (fx - HEAD_CX) / hw
        nz = math.sqrt(max(0.0, 1.0 - u * u))
        lam = max(0.0, u * LX * 0.85 + nz * LZ)
        val = 0.04 + 0.62 * (lam ** 1.05)
        # shoulders sit in shadow under the jaw
        val *= 0.45 + 0.55 * smooth(88, 124, fy)
        # dark clothing swallows the lower body
        val *= 1.0 - 0.55 * smooth(120, 172, fy)
        cov = smooth(1.0, 0.82, abs(u))
        return min(1.0, val), cov

    return 0.0, 0.0


def main():
    rows = []
    for y in range(H):
        row = bytearray([0])  # filter type 0
        for x in range(W):
            val, cov = sample(x, y)
            if cov <= 0.0:
                row += b"\x00\x00\x00\x00"
                continue

            t = BAYER[y & 3][x & 3] / 16.0
            q = math.floor(val * (LEVELS - 1) + t) / (LEVELS - 1)
            q = max(0.0, min(1.0, q))

            g = int(round(14 + q * 236))

            # dissolve the silhouette edge and fade the bottom into the page
            a = cov
            a *= 1.0 - smooth(150.0, float(H), y + 0.5)
            a *= 0.30 + 0.70 * min(1.0, val * 1.9 + 0.12)
            if a < 1.0 and (BAYER[y & 3][x & 3] / 16.0) > a:
                a = 0.0
            alpha = int(round(max(0.0, min(1.0, a)) * 255))
            row += bytes((g, g, g, alpha))
        rows.append(bytes(row))

    raw = b"".join(rows)

    def chunk(tag, data):
        return (
            struct.pack(">I", len(data))
            + tag
            + data
            + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
        )

    png = b"\x89PNG\r\n\x1a\n"
    png += chunk(b"IHDR", struct.pack(">IIBBBBB", W, H, 8, 6, 0, 0, 0))
    png += chunk(b"IDAT", zlib.compress(raw, 9))
    png += chunk(b"IEND", b"")

    out = Path(__file__).resolve().parent.parent / "assets" / "img" / "portrait.png"
    out.write_bytes(png)
    print(f"wrote {out} ({len(png)} bytes, {W}x{H})")


if __name__ == "__main__":
    main()
