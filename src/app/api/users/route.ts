import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { userRepository, omitPasswordHash } from "@/repositories/user.repository";
import { requireAdmin } from "@/lib/api-guard";

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8, "Şifre en az 8 karakter olmalı"),
  role: z.enum(["ADMIN", "EDITOR"]).default("ADMIN"),
});

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const users = await userRepository.findAll();
  return NextResponse.json({
    success: true,
    data: users.map(omitPasswordHash),
  });
}

export async function POST(request: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const body = createUserSchema.parse(await request.json());
    const existing = await userRepository.findByEmail(body.email.toLowerCase());
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Bu e-posta zaten kullanılıyor" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(body.password, 12);
    const user = await userRepository.create({
      name: body.name,
      email: body.email.toLowerCase(),
      passwordHash,
      role: body.role,
    });

    return NextResponse.json({ success: true, data: omitPasswordHash(user) }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0]?.message },
        { status: 400 }
      );
    }
    console.error(error);
    return NextResponse.json({ success: false, error: "Bir hata oluştu" }, { status: 500 });
  }
}
