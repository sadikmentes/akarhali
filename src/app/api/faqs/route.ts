import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { faqRepository } from "@/repositories/misc.repository";
import { faqSchema } from "@/lib/validations/content.schema";
import { requireAdmin } from "@/lib/api-guard";

export async function GET() {
  const faqs = await faqRepository.findAll();
  return NextResponse.json({ success: true, data: faqs });
}

export async function POST(request: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const data = faqSchema.parse(await request.json());
    const faq = await faqRepository.create({
      ...data,
      questionEn: data.questionEn ?? data.questionTr,
      answerEn: data.answerEn ?? data.answerTr,
    });
    return NextResponse.json({ success: true, data: faq }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0]?.message }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ success: false, error: "Bir hata oluştu" }, { status: 500 });
  }
}
