import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const PUBLIC_DIR = path.resolve(process.cwd(), 'public');

function crc32(buf) {
  // Standard CRC32 (IEEE 802.3)
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      const mask = -(crc & 1);
      crc = (crc >>> 1) ^ (0xedb88320 & mask);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const crcBuf = Buffer.alloc(4);
  const crc = crc32(Buffer.concat([typeBuf, data]));
  crcBuf.writeUInt32BE(crc, 0);

  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function makePng({ width, height, rgba }) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // bit depth
  ihdr.writeUInt8(6, 9); // color type: RGBA
  ihdr.writeUInt8(0, 10); // compression
  ihdr.writeUInt8(0, 11); // filter
  ihdr.writeUInt8(0, 12); // interlace

  // Raw image data: each row starts with filter byte 0
  const rowLen = 1 + width * 4;
  const raw = Buffer.alloc(rowLen * height);

  for (let y = 0; y < height; y++) {
    const rowStart = y * rowLen;
    raw[rowStart] = 0; // no filter

    for (let x = 0; x < width; x++) {
      const px = rowStart + 1 + x * 4;
      raw[px + 0] = rgba[0];
      raw[px + 1] = rgba[1];
      raw[px + 2] = rgba[2];
      raw[px + 3] = rgba[3];
    }
  }

  const compressed = zlib.deflateSync(raw, { level: 9 });

  const png = Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0)),
  ]);

  return png;
}

function writeIcon(filename, width, height, rgba) {
  const outPath = path.join(PUBLIC_DIR, filename);
  const png = makePng({ width, height, rgba });
  fs.writeFileSync(outPath, png);
  return outPath;
}

function main() {
  if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });

  // TimeCraft brand-ish deep slate background
  const bg = [0x0f, 0x17, 0x2a, 0xff];

  const p192 = writeIcon('icon-192.png', 192, 192, bg);
  const p512 = writeIcon('icon-512.png', 512, 512, bg);

  // Optional small logo used by some crawlers / previews
  const logo = writeIcon('logo.png', 512, 512, bg);

  // Optional OG image placeholder (1200x630). Keep it simple & compressed.
  const og = writeIcon('og-image.png', 1200, 630, bg);

  // Screenshot placeholder referenced by manifest (1280x720).
  const screenshot = writeIcon('screenshot.png', 1280, 720, bg);

  console.log('Generated icons:');
  console.log('-', p192);
  console.log('-', p512);
  console.log('-', logo);
  console.log('-', og);
  console.log('-', screenshot);
}

main();
