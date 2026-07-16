"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Truck, Users, Cpu, BadgePercent } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";

const ICONS = [Truck, Users, Cpu, BadgePercent];

export function Features() {
  const t = useTranslations("home.features");
  const items = [1, 2, 3, 4].map((i) => ({
    title: t(`item${i}Title` as "item1Title"),
    desc: t(`item${i}Desc` as "item1Desc"),
    Icon: ICONS[i - 1],
  }));

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading title={t("title")} subtitle={t("subtitle")} />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-lg"
          >
            <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <item.Icon className="size-6" />
            </div>
            <h3 className="mb-2 font-semibold">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
