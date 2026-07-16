import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { galleryRepository } from "@/repositories/gallery.repository";
import { galleryImageSchema } from "@/lib/validations/gallery.schema";
import { requireAdmin } from "@/lib/api-guard";

export async function GET() {
  const images = await galleryRepository.findAll();
  return NextResponse.json({ success: true, data: images });
}

export async function POST(request: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const body = await request.json();
    const data = galleryImageSchema.parse(body);
    const image = await galleryRepository.create(data);
    return NextResponse.json({ success: true, data: image }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0]?.message },
        { status: 400 }
      );
    }
    console.error(error);
    return NextResponse.json({ success: false, error: "Bir hata oluştu" }, { status: 500 });
  }
}
