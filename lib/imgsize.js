import fs from "node:fs";
import path from "node:path";

/**
 * Read intrinsic pixel dimensions straight out of the file header.
 * Supports PNG, JPEG and WebP (VP8 / VP8L / VP8X), which is everything
 * this site ships. Keeps width/height out of the CMS: the client uploads
 * a photo and the correct attributes appear by themselves.
 */
function fromBuffer(buf) {
  // PNG: 8-byte signature, then IHDR with width/height as big-endian uint32
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }

  // WebP: "RIFF" .... "WEBP"
  if (buf.length > 30 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    const fourcc = buf.toString("ascii", 12, 16);
    if (fourcc === "VP8 ") {
      // lossy: 14-bit width/height after the 3-byte start code
      return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
    }
    if (fourcc === "VP8L") {
      const b = buf.readUInt32LE(21);
      return { width: (b & 0x3fff) + 1, height: ((b >> 14) & 0x3fff) + 1 };
    }
    if (fourcc === "VP8X") {
      const w = 1 + (buf[24] | (buf[25] << 8) | (buf[26] << 16));
      const h = 1 + (buf[27] | (buf[28] << 8) | (buf[29] << 16));
      return { width: w, height: h };
    }
  }

  // JPEG: walk the segments until a Start-Of-Frame marker
  if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length - 9) {
      if (buf[i] !== 0xff) { i++; continue; }
      const marker = buf[i + 1];
      // SOF0..SOF15, skipping DHT(c4), JPG(c8) and DAC(cc)
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
      }
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }

  return null;
}

const cache = new Map();

/**
 * @param {string} src  site-absolute path, e.g. "/assets/img/hero.webp"
 * @param {string} root directory that `src` is relative to
 */
export function imageSize(src, root = "src") {
  if (!src || typeof src !== "string") return null;
  if (cache.has(src)) return cache.get(src);

  const file = path.join(root, src.replace(/^\//, ""));
  let result = null;
  try {
    const fd = fs.openSync(file, "r");
    const buf = Buffer.alloc(Math.min(65536, fs.fstatSync(fd).size));
    fs.readSync(fd, buf, 0, buf.length, 0);
    fs.closeSync(fd);
    result = fromBuffer(buf);
  } catch {
    result = null;
  }

  cache.set(src, result);
  return result;
}
