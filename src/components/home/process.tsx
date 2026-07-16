"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { PhoneCall, Truck, Sparkles, PackageCheck } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";

const ICONS = [PhoneCall, Truck, Sparkles, PackageCheck];

export function Process() {
  const t = useTranslations("home.process");
  const steps = [1, 2, 3, 4].map((i) => ({
    title: t(`step${i}Title` as "step1Title"),
    desc: t(`step${i}Desc` as "step1Desc"),
    Icon: ICONS[i - 1],
  }));

  return (
    <section className="bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />
        <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="absolute top-8 left-0 hidden h-px w-full bg-border lg:block" aria-hidden />
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="relative z-10 mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                <step.Icon className="size-7" />
                <span className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-background text-xs font-bold text-foreground ring-2 ring-primary">
                  {i + 1}
                </span>
              </div>
              <h3 className="mb-2 font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
