import { NextRequest, NextResponse } from "next/server";
import { serviceService } from "@/services/service.service";
import { requireAdmin } from "@/lib/api-guard";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await request.json();
  const updated = await serviceService.update(id, body);
  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  await serviceService.delete(id);
  return NextResponse.json({ success: true });
}
