"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { GALLERY_CATEGORY_LABELS } from "@/constants/site";
import type { GalleryImage } from "@/types";

// Canonical display order for the gallery filter tabs.
const CATEGORY_ORDER = [
  "CARPET",
  "SOFA",
  "CURTAIN",
  "YATAK",
  "YORGAN",
  "BATTANIYE",
  "SANDALYE",
  "YASTIK",
] as const;

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const t = useTranslations("gallery");
  const [active, setActive] = useState<string>("ALL");

  // Only show tabs for categories that actually have images.
  const present = CATEGORY_ORDER.filter((cat) => images.some((img) => img.category === cat));
  const tabs = ["ALL", ...present];

  const filtered =
    active === "ALL"
      ? images.filter((img) => img.category !== "BEFORE" && img.category !== "AFTER")
      : images.filter((img) => img.category === active);

  return (
    <div>
      <div className="mb-8 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Galeri kategorileri">
        {tabs.map((cat) => (
          <button
            key={cat}
            role="tab"
            aria-selected={active === cat}
            onClick={() => setActive(cat)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              active === cat
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/70"
            )}
          >
            {cat === "ALL" ? t("all") : GALLERY_CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <AnimatePresence>
          {filtered.map((img) => (
            <motion.div
              key={img.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative aspect-square overflow-hidden rounded-xl border"
            >
              <Image
                src={img.url}
                alt={img.titleTr ?? "Galeri görseli"}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <p className="py-12 text-center text-muted-foreground">
          {t("all") === "Tümü" ? "Bu kategoride görsel bulunmuyor." : "No images in this category."}
        </p>
      )}
    </div>
  );
}
