import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    return { session: null, response: NextResponse.json({ success: false, error: "Yetkisiz erişim" }, { status: 401 }) };
  }
  return { session, response: null };
}
