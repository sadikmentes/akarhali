"use client";

import { Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/shared/social-icons";
import { cn, whatsappHref, telHref } from "@/lib/utils";

type FloatingButtonsProps = {
  whatsapp?: string | null;
  phone?: string | null;
  instagram?: string | null;
  facebook?: string | null;
};

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.76.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.87 9.87 0 0 0 12.04 2Zm0 18.13h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.36c0-4.53 3.69-8.22 8.24-8.22 2.2 0 4.27.86 5.82 2.41a8.17 8.17 0 0 1 2.41 5.82c0 4.54-3.69 8.21-8.22 8.21Zm4.51-6.16c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.96-.15.16-.29.18-.53.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.22-1.46-1.37-1.7-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.23.25-.85.83-.85 2.02s.87 2.34 1 2.5c.12.16 1.71 2.61 4.14 3.66.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.46-.6 1.66-1.17.21-.58.21-1.08.14-1.18-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  );
}

export function FloatingButtons({ whatsapp, phone, instagram, facebook }: FloatingButtonsProps) {
  const waUrl = whatsappHref(whatsapp);
  const telUrl = telHref(phone);
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
      {facebook && (
        <a
          href={facebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook üzerinden ulaşın"
          className="flex size-14 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-lg transition-transform hover:scale-110"
        >
          <FacebookIcon className="size-6" />
        </a>
      )}
      {instagram && (
        <a
          href={instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram üzerinden ulaşın"
          className={cn(
            "flex size-14 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-110",
            "bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600"
          )}
        >
          <InstagramIcon className="size-6" />
        </a>
      )}
      {waUrl && (
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp üzerinden ulaşın"
          className="flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110"
        >
          <WhatsAppIcon className="size-7" />
        </a>
      )}
      {telUrl && (
        <a
          href={telUrl}
          aria-label="Bizi arayın"
          className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110 sm:hidden"
        >
          <Phone className="size-6" />
        </a>
      )}
    </div>
  );
}
