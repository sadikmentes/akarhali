import { NextRequest, NextResponse } from "next/server";
import { settingsService } from "@/services/settings.service";
import { requireAdmin } from "@/lib/api-guard";

function normalizeMapEmbedUrl(value: unknown) {
  if (typeof value !== "string") return value;

  const trimmed = value.trim();
  if (!trimmed) return null;

  const srcMatch = trimmed.match(/\ssrc=(["'])(.*?)\1/i);
  const candidate = srcMatch?.[2] ?? trimmed;

  try {
    const url = new URL(candidate);
    const isGoogleMapsEmbed =
      url.hostname === "www.google.com" && url.pathname.startsWith("/maps/embed");

    if (!isGoogleMapsEmbed) return false;
    return url.toString();
  } catch {
    return false;
  }
}

export async function GET() {
  const site = await settingsService.getSite();
  return NextResponse.json({ success: true, data: site });
}

export async function PATCH(request: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await request.json();
  const mapEmbedUrl = normalizeMapEmbedUrl(body.mapEmbedUrl);

  if (mapEmbedUrl === false) {
    return NextResponse.json(
      { success: false, error: "Geçerli bir Google Maps embed URL girin." },
      { status: 400 }
    );
  }

  const updated = await settingsService.updateSite({ ...body, mapEmbedUrl });
  return NextResponse.json({ success: true, data: updated });
}
