import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ folder: string; file: string }> };

const CONTENT_TYPES: Record<string, string> = {
  ".avif": "image/avif",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
};

const VIDEO_EXTENSIONS = new Set([".mp4", ".webm", ".mov"]);

function safeSegment(value: string) {
  if (value === "." || value === "..") return null;
  return /^[a-z0-9_.-]+$/i.test(value) ? value : null;
}

export async function GET(request: Request, { params }: Params) {
  const { folder, file } = await params;
  const safeFolder = safeSegment(folder);
  const safeFile = safeSegment(file);

  if (!safeFolder || !safeFile) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const appRoot = process.env.APP_ROOT || process.cwd();
  const filePath = path.join(appRoot, "public", "uploads", safeFolder, safeFile);
  const extension = path.extname(safeFile).toLowerCase();
  const contentType = CONTENT_TYPES[extension] ?? "application/octet-stream";

  try {
    const buffer = await readFile(filePath);
    const cacheControl = "public, max-age=31536000, immutable";

    // Videos need byte-range support so the browser can seek and start playback
    // before the whole file has downloaded.
    const rangeHeader = request.headers.get("range");
    if (VIDEO_EXTENSIONS.has(extension) && rangeHeader) {
      const match = /bytes=(\d+)-(\d*)/.exec(rangeHeader);
      if (match) {
        const start = Number(match[1]);
        const end = match[2] ? Number(match[2]) : buffer.length - 1;
        const chunk = buffer.subarray(start, end + 1);
        return new NextResponse(chunk, {
          status: 206,
          headers: {
            "Content-Type": contentType,
            "Content-Range": `bytes ${start}-${end}/${buffer.length}`,
            "Accept-Ranges": "bytes",
            "Content-Length": String(chunk.length),
            "Cache-Control": cacheControl,
          },
        });
      }
    }

    return new NextResponse(buffer, {
      headers: {
        "Cache-Control": cacheControl,
        "Content-Type": contentType,
        "Accept-Ranges": "bytes",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
