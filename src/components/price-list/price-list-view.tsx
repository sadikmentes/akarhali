"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export type PriceRow = {
  id: string;
  name: string;
  unit: "M2" | "PIECE";
  basePrice: number;
  discountPrice: number | null;
  isCampaignActive: boolean;
};

export type PriceGroup = {
  id: string;
  slug: string;
  name: string;
  rows: PriceRow[];
};

const priceFormatter = new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 });

export function PriceListView({ groups }: { groups: PriceGroup[] }) {
  const t = useTranslations("priceList");
  const [activeId, setActiveId] = useState(groups[0]?.id);

  const active = groups.find((g) => g.id === activeId) ?? groups[0];

  return (
    <div className="mx-auto max-w-3xl">
      {/* Service tabs */}
      <div
        role="tablist"
        aria-label={t("title")}
        className="flex flex-wrap justify-center gap-2.5"
      >
        {groups.map((group) => {
          const isActive = group.id === active.id;
          return (
            <button
              key={group.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveId(group.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200",
                isActive
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {group.name}
            </button>
          );
        })}
      </div>

      {/* Active service panel */}
      <div className="mt-8">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm"
        >
          <header className="border-b border-border px-6 py-5">
            <h2 className="truncate text-xl font-bold text-foreground">{active.name}</h2>
            <p className="text-sm text-muted-foreground">{active.rows.length} hizmet</p>
          </header>

          <ul className="divide-y divide-border/70">
            {active.rows.map((row) => {
              const unitLabel = row.unit === "M2" ? t("perM2") : t("perPiece");
              const hasDiscount = row.isCampaignActive && row.discountPrice != null;
              return (
                <li
                  key={row.id}
                  className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-muted/40"
                >
                  <span className="min-w-0 truncate font-medium text-foreground">{row.name}</span>
                  <span className="flex shrink-0 items-baseline gap-1.5 whitespace-nowrap">
                    {hasDiscount && (
                      <span className="text-sm text-muted-foreground line-through">
                        {priceFormatter.format(row.basePrice)}₺
                      </span>
                    )}
                    <span className="text-xl font-bold text-primary">
                      {priceFormatter.format(hasDiscount ? (row.discountPrice as number) : row.basePrice)}₺
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">/ {unitLabel}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
