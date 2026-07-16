"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Tag, Sparkles } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

const SLIDES = [
  {
    src: "/images/hero-facility.jpg",
    alt: "Akar Halı yıkama tesisi ve profesyonel temizlik hattı",
  },
  {
    src: "/images/hero-cleaning-line.jpg",
    alt: "Akar Halı otomatik yıkama ve kurutma sistemi",
  },
  {
    src: "/images/hero-service.jpg",
    alt: "Akar Halı servis ve halı temizleme süreci",
  },
];

type HeroProps = {
  title: string;
  subtitle: string;
  whatsapp?: string | null;
};

export function Hero({ title, subtitle, whatsapp }: HeroProps) {
  const t = useTranslations("home.hero");
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={SLIDES[slide].src}
              alt={SLIDES[slide].alt}
              fill
              priority={slide === 0}
              sizes="100vw"
              className="object-cover object-top"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-slate-950/45" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(8,47,73,0.76)_0%,_rgba(14,116,144,0.54)_42%,_rgba(13,148,136,0.32)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_52%)]" />
      </div>

      <div className="mx-auto flex min-h-[620px] max-w-7xl flex-col items-center justify-center gap-6 px-4 py-24 text-center sm:min-h-[680px] sm:px-6 sm:py-32 lg:px-8">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm"
        >
          <Sparkles className="size-4" />
          {t("badge")}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl text-balance text-lg text-white/90"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3 pt-4"
        >
          <Button size="lg" asChild className="bg-white text-slate-900 hover:bg-white/90">
            <a href="tel:+905550000000">
              <Phone className="size-5" />
              {t("cta1")}
            </a>
          </Button>
          {whatsapp && (
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white/40 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
            >
              <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                {t("cta2")}
              </a>
            </Button>
          )}
          <Button
            size="lg"
            variant="outline"
            asChild
            className="border-white/40 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
          >
            <Link href="/price-list">
              <Tag className="size-5" />
              <span className="sr-only sm:not-sr-only">Fiyat Listesi</span>
            </Link>
          </Button>
        </motion.div>

        <div className="flex gap-2 pt-6" role="tablist" aria-label="Slayt göstergesi">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={slide === i}
              aria-label={`Slayt ${i + 1}`}
              onClick={() => setSlide(i)}
              className={`h-2 rounded-full transition-all ${
                slide === i ? "w-8 bg-white" : "w-2 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
