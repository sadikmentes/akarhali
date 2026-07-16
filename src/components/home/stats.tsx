"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";

type StatsProps = {
  years: number;
  clients: number;
  projects: number;
  team: number;
};

function Counter({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1500;
    const start = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [inView, target]);

  return (
    <span ref={ref}>{value.toLocaleString("tr-TR")}+</span>
  );
}

export function Stats({ years, clients, projects, team }: StatsProps) {
  const t = useTranslations("home.stats");
  const items = [
    { label: t("years"), value: years },
    { label: t("clients"), value: clients },
    { label: t("projects"), value: projects },
    { label: t("team"), value: team },
  ];

  return (
    <section className="bg-primary py-16 text-primary-foreground">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="text-center"
          >
            <div className="text-4xl font-bold sm:text-5xl">
              <Counter target={item.value} />
            </div>
            <p className="mt-2 text-sm text-primary-foreground/80">{item.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
