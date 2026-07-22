import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { userRepository, omitPasswordHash } from "@/repositories/user.repository";
import { requireAdmin } from "@/lib/api-guard";

const accountSchema = z.object({
  name: z.string().min(2, "Kullanıcı adı en az 2 karakter olmalı"),
  currentPassword: z.string().min(1, "Mevcut şifrenizi girin"),
  newPassword: z
    .string()
    .min(8, "Yeni şifre en az 8 karakter olmalı")
    .optional()
    .or(z.literal("")),
});

// Updates the signed-in account's username and (optionally) password.
export async function PATCH(request: NextRequest) {
  const { session, response } = await requireAdmin();
  if (response) return response;

  try {
    const body = accountSchema.parse(await request.json());
    const user = await userRepository.findById(session!.user.id);
    if (!user) {
      return NextResponse.json({ success: false, error: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    const passwordOk = await bcrypt.compare(body.currentPassword, user.passwordHash);
    if (!passwordOk) {
      return NextResponse.json({ success: false, error: "Mevcut şifre hatalı" }, { status: 400 });
    }

    const data: { name: string; passwordHash?: string } = { name: body.name.trim() };
    if (body.newPassword) {
      data.passwordHash = await bcrypt.hash(body.newPassword, 12);
    }

    const updated = await userRepository.update(user.id, data);
    return NextResponse.json({ success: true, data: omitPasswordHash(updated) });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0]?.message }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ success: false, error: "Bir hata oluştu" }, { status: 500 });
  }
}
