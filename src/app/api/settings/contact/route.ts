import { NextRequest, NextResponse } from "next/server";
import { settingsService } from "@/services/settings.service";
import { requireAdmin } from "@/lib/api-guard";

export async function GET() {
  const contact = await settingsService.getContact();
  return NextResponse.json({ success: true, data: contact });
}

export async function PATCH(request: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await request.json();
  const updated = await settingsService.updateContact(body);
  return NextResponse.json({ success: true, data: updated });
}
