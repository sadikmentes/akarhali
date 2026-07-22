"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Tag, Sparkles } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { whatsappHref, telHref } from "@/lib/utils";

type Slide = { src: string; alt: string };

// Shown only when the admin has not uploaded any slider images yet.
const DEFAULT_SLIDES: Slide[] = [
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
  phone?: string | null;
  slides?: Slide[];
};

export function Hero({ title, subtitle, whatsapp, phone, slides }: HeroProps) {
  const t = useTranslations("home.hero");
  const SLIDES = slides && slides.length > 0 ? slides : DEFAULT_SLIDES;
  const slideCount = SLIDES.length;
  const [slide, setSlide] = useState(0);
  const waUrl = whatsappHref(whatsapp);
  const telUrl = telHref(phone);

  useEffect(() => {
    if (slideCount <= 1) return;
    const id = setInterval(() => setSlide((s) => (s + 1) % slideCount), 5000);
    return () => clearInterval(id);
  }, [slideCount]);

  return (
    <section className="relative isolate overflow-hidden">
      {/* Masaüstü: görsel arka plan, yazılar üstünde. Telefonda bu blok gizlenir
          çünkü dar ekranda yatay bir görsel arka planda çok küçük kalıyordu. */}
      <div className="absolute inset-0 -z-10 hidden lg:block">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {/* Arka plan: aynı görselin bulanık, kutuyu dolduran kopyası.
                Öndeki görsel object-contain olduğu için kenarlarda kalan
                boşluğu doldurur, böylece kırpma da boş şerit de olmaz. */}
            <Image
              src={SLIDES[slide].src}
              alt=""
              aria-hidden
              fill
              sizes="100vw"
              className="scale-110 object-cover blur-xl"
            />
            {/* object-contain: görselin tamamı görünür, hiçbir yeri kesilmez. */}
            <Image
              src={SLIDES[slide].src}
              alt={SLIDES[slide].alt}
              fill
              priority={slide === 0}
              sizes="100vw"
              className="object-contain"
            />
          </motion.div>
        </AnimatePresence>
        {/* Karartma katmanları: görsel daha net görünsün diye hafif tutuldu,
            yazılar okunur kalsın diye tamamen kaldırılmadı. */}
        <div className="absolute inset-0 bg-slate-950/25" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(8,47,73,0.45)_0%,_rgba(14,116,144,0.30)_42%,_rgba(13,148,136,0.16)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_52%)]" />
      </div>

      {/* Telefon: görsel akışta ve kendi oranıyla, yani tam genişlikte ve
          hiç kırpılmadan görünür. Yazılar aşağıdaki koyu bloğa iner. */}
      <div className="bg-slate-950 lg:hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.img
          key={SLIDES[slide].src}
          src={SLIDES[slide].src}
          alt={SLIDES[slide].alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="block h-auto w-full"
        />
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-6 bg-[linear-gradient(135deg,_rgba(8,47,73,1)_0%,_rgba(14,116,144,0.95)_100%)] px-4 py-12 text-center sm:px-6 lg:min-h-[680px] lg:bg-none lg:px-8 lg:py-32">
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
          {telUrl && (
            <Button size="lg" asChild className="bg-white text-slate-900 hover:bg-white/90">
              <a href={telUrl}>
                <Phone className="size-5" />
                {t("cta1")}
              </a>
            </Button>
          )}
          {waUrl && (
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white/40 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
            >
              <a href={waUrl} target="_blank" rel="noopener noreferrer">
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
