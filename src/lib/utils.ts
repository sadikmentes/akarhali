import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Builds a working WhatsApp link from whatever the admin entered — a full URL,
// or a raw Turkish number like "05457909441" -> "https://wa.me/905457909441".
export function whatsappHref(value?: string | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  let digits = trimmed.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.startsWith("00")) digits = digits.slice(2);
  else if (digits.startsWith("0")) digits = `90${digits.slice(1)}`;
  else if (digits.length === 10) digits = `90${digits}`;
  return `https://wa.me/${digits}`;
}

// Builds a safe tel: link, keeping a leading + and digits only.
export function telHref(value?: string | null): string | null {
  if (!value) return null;
  const hasPlus = value.trim().startsWith("+");
  const digits = value.replace(/\D/g, "");
  if (!digits) return null;
  return `tel:${hasPlus ? "+" : ""}${digits}`;
}

// Turns a Turkish label into a URL-safe slug (e.g. "Koltuk & Mobilya" -> "koltuk-mobilya").
export function slugify(value: string) {
  const map: Record<string, string> = {
    ç: "c", ğ: "g", ı: "i", i: "i", ö: "o", ş: "s", ü: "u",
    Ç: "c", Ğ: "g", İ: "i", I: "i", Ö: "o", Ş: "s", Ü: "u",
  };
  return value
    .trim()
    .replace(/[çğıiöşüÇĞİIÖŞÜ]/g, (ch) => map[ch] ?? ch)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
