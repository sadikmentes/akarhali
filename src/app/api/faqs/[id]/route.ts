import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { faqRepository } from "@/repositories/misc.repository";
import { faqSchema } from "@/lib/validations/content.schema";
import { requireAdmin } from "@/lib/api-guard";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  try {
    const data = faqSchema.parse(await request.json());
    const updated = await faqRepository.update(id, {
      ...data,
      questionEn: data.questionEn ?? data.questionTr,
      answerEn: data.answerEn ?? data.answerTr,
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0]?.message }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ success: false, error: "Bir hata oluştu" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  await faqRepository.delete(id);
  return NextResponse.json({ success: true });
}
