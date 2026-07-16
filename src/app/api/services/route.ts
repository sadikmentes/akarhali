import { NextRequest, NextResponse } from "next/server";
import { serviceService } from "@/services/service.service";
import { requireAdmin } from "@/lib/api-guard";

export async function GET() {
  const services = await serviceService.list();
  return NextResponse.json({ success: true, data: services });
}

export async function POST(request: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await request.json();
  const service = await serviceService.create(body);
  return NextResponse.json({ success: true, data: service }, { status: 201 });
}
