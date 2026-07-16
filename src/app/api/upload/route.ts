import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { uploadImage } from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/api-guard";

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
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

async function uploadLocal(fileBuffer: Buffer, folder: string, fileType: string) {
  const safeFolder = safeFolderName(folder);
  const extension = EXTENSIONS[fileType] ?? "jpg";
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

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { success: false, error: "Yalnızca JPEG, PNG, WEBP veya AVIF dosyaları kabul edilir" },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { success: false, error: "Dosya boyutu 8MB'ı aşamaz" },
      { status: 400 }
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = hasCloudinaryConfig()
      ? await uploadImage(buffer, folder)
      : await uploadLocal(buffer, folder, file.type);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Yükleme sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}
