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
};

function safeSegment(value: string) {
  return /^[a-z0-9_.-]+$/i.test(value) ? value : null;
}

export async function GET(_request: Request, { params }: Params) {
  const { folder, file } = await params;
  const safeFolder = safeSegment(folder);
  const safeFile = safeSegment(file);

  if (!safeFolder || !safeFile) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const appRoot = process.env.APP_ROOT || process.cwd();
  const filePath = path.join(appRoot, "public", "uploads", safeFolder, safeFile);

  try {
    const buffer = await readFile(filePath);
    const contentType = CONTENT_TYPES[path.extname(safeFile).toLowerCase()] ?? "application/octet-stream";

    return new NextResponse(buffer, {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Type": contentType,
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
