import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { priceService } from "@/services/price.service";
import { requireAdmin } from "@/lib/api-guard";

export async function GET() {
  const prices = await priceService.list();
  return NextResponse.json({ success: true, data: prices });
}

export async function POST(request: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const body = await request.json();
    const price = await priceService.create(body);
    return NextResponse.json({ success: true, data: price }, { status: 201 });
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
