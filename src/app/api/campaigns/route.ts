import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { campaignService } from "@/services/campaign.service";
import { requireAdmin } from "@/lib/api-guard";

export async function GET() {
  const campaigns = await campaignService.list();
  return NextResponse.json({ success: true, data: campaigns });
}

export async function POST(request: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const body = await request.json();
    const campaign = await campaignService.create(body);
    return NextResponse.json({ success: true, data: campaign }, { status: 201 });
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
