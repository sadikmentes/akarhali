"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import type { Campaign } from "@/types";

export function CampaignSection({ campaigns }: { campaigns: Campaign[] }) {
  const t = useTranslations("home.campaigns");
  const tCta = useTranslations("cta");

  if (campaigns.length === 0) return null;

  return (
    <section className="bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.slice(0, 3).map((c, i) => {
            const title = c.titleTr;
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-4/3 bg-muted">
                  <Image
                    src={c.image}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 right-3 rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white shadow">
                    %{c.discountPercent}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="line-clamp-2 font-semibold">{title}</h3>
                </div>
              </motion.div>
            );
          })}
        </div>
        <div className="mt-8 flex justify-center">
          <Button asChild size="lg">
            <Link href="/campaigns">{tCta("viewAll")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
