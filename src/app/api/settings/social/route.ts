import { NextRequest, NextResponse } from "next/server";
import { settingsService } from "@/services/settings.service";
import { requireAdmin } from "@/lib/api-guard";

export async function GET() {
  const social = await settingsService.getSocial();
  return NextResponse.json({ success: true, data: social });
}

export async function PATCH(request: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await request.json();
  const updated = await settingsService.updateSocial(body);
  return NextResponse.json({ success: true, data: updated });
}
