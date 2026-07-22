import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { heroSlideService } from "@/services/hero-slide.service";
import { heroSlideSchema } from "@/lib/validations/hero-slide.schema";
import { requireAdmin } from "@/lib/api-guard";

export async function GET() {
  const slides = await heroSlideService.list();
  return NextResponse.json({ success: true, data: slides });
}

export async function POST(request: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const body = await request.json();
    const data = heroSlideSchema.parse(body);
    const slide = await heroSlideService.create(data);
    return NextResponse.json({ success: true, data: slide }, { status: 201 });
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
