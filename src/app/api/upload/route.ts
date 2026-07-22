import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { uploadImage } from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/api-guard";

const MAX_IMAGE_SIZE = 8 * 1024 * 1024; // 8MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

const IMAGE_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

const VIDEO_EXTENSIONS: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};

function hasCloudinaryConfig() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

function safeFolderName(folder: string) {
  return folder.replace(/[^a-z0-9_-]/gi, "").toLowerCase() || "misc";
}

async function uploadLocal(fileBuffer: Buffer, folder: string, extension: string) {
  const safeFolder = safeFolderName(folder);
  const fileName = `${Date.now()}-${randomUUID()}.${extension}`;
  const appRoot = process.env.APP_ROOT || process.cwd();
  const uploadDir = path.join(appRoot, "public", "uploads", safeFolder);

  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, fileName), fileBuffer);

  return {
    url: `/uploads/${safeFolder}/${fileName}`,
    publicId: `local/${safeFolder}/${fileName}`,
  };
}

export async function POST(request: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const formData = await request.formData();
  const file = formData.get("file");
  const folder = (formData.get("folder") as string) || "misc";

  if (!(file instanceof File)) {
    return NextResponse.json({ success: false, error: "Dosya bulunamadı" }, { status: 400 });
  }

  const isImage = file.type in IMAGE_EXTENSIONS;
  const isVideo = file.type in VIDEO_EXTENSIONS;

  if (!isImage && !isVideo) {
    return NextResponse.json(
      { success: false, error: "Yalnızca görsel (JPEG, PNG, WEBP) veya video (MP4, WEBM) dosyaları kabul edilir" },
      { status: 400 }
    );
  }

  const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
  if (file.size > maxSize) {
    return NextResponse.json(
      { success: false, error: isVideo ? "Video boyutu 100MB'ı aşamaz" : "Dosya boyutu 8MB'ı aşamaz" },
      { status: 400 }
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    // Videos are always stored locally under public/uploads (Cloudinary's image
    // upload endpoint does not accept video); images use Cloudinary when configured.
    if (isVideo) {
      const result = await uploadLocal(buffer, folder, VIDEO_EXTENSIONS[file.type]);
      return NextResponse.json({ success: true, data: result });
    }

    const result = hasCloudinaryConfig()
      ? await uploadImage(buffer, folder)
      : await uploadLocal(buffer, folder, IMAGE_EXTENSIONS[file.type]);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Yükleme sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}
