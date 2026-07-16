import { NextRequest, NextResponse } from "next/server";
import { userRepository } from "@/repositories/user.repository";
import { requireAdmin } from "@/lib/api-guard";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { session, response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;

  if (session?.user.id === id) {
    return NextResponse.json(
      { success: false, error: "Kendi hesabınızı silemezsiniz" },
      { status: 400 }
    );
  }

  await userRepository.delete(id);
  return NextResponse.json({ success: true });
}
