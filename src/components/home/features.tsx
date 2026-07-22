"use client";

import { motion } from "framer-motion";
import { Truck, Users, Cpu, BadgePercent } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import type { HomeSectionContent } from "@/constants/home-content";

const ICONS = [Truck, Users, Cpu, BadgePercent];

export function Features({ title, subtitle, items }: HomeSectionContent) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading title={title} subtitle={subtitle} />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="size-6" />
              </div>
              <h3 className="mb-2 font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
