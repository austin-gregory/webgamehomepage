import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "assets", "source", "dark-game-factory.png");
const outPublic = path.join(root, "public");
const outApp = path.join(root, "src", "app");

await mkdir(outPublic, { recursive: true });
await mkdir(outApp, { recursive: true });

const tasks = [
  // Favicons (Next.js picks up src/app/icon.png automatically)
  { out: path.join(outApp, "icon.png"), size: 192 },
  { out: path.join(outApp, "apple-icon.png"), size: 180 },
];

for (const t of tasks) {
  let pipeline = sharp(src).resize(t.size, t.size, { fit: "inside" });
  if (t.format === "webp") {
    pipeline = pipeline.webp({ quality: t.quality ?? 82, effort: 5 });
  } else {
    pipeline = pipeline.png({ compressionLevel: 9, palette: false });
  }
  await pipeline.toFile(t.out);
  console.log("wrote", path.relative(root, t.out));
}

// OG image: 1200x630 standard, logo centered on black
await sharp({
  create: {
    width: 1200,
    height: 630,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 1 },
  },
})
  .composite([
    {
      input: await sharp(src)
        .resize(600, 600, { fit: "inside" })
        .png()
        .toBuffer(),
      gravity: "center",
    },
  ])
  .png({ compressionLevel: 9 })
  .toFile(path.join(outPublic, "og-image.png"));
console.log("wrote", "public/og-image.png");
console.log("done.");
