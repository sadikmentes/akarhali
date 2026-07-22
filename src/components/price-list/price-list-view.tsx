"use client";

import { useState, type ComponentType, type SVGProps } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Sofa, BedDouble, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

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

const svgBase = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function CarpetIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...svgBase} {...props}>
      <rect x="4" y="6" width="16" height="12" rx="1" />
      <path d="M7 6v12M17 6v12" />
      <path d="M7 12l5-3 5 3-5 3-5-3z" />
      <path d="M4 6V4M8 6V4M12 6V4M16 6V4M20 6V4" />
      <path d="M4 18v2M8 18v2M12 18v2M16 18v2M20 18v2" />
    </svg>
  );
}

function CurtainIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...svgBase} {...props}>
      <path d="M3 4h18" />
      <path d="M5 4v11q0 3 2 3t2-3V4" />
      <path d="M7 4v13" />
      <path d="M15 4v11q0 3 2 3t2-3V4" />
      <path d="M17 4v13" />
    </svg>
  );
}

function QuiltIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...svgBase} {...props}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18M3 14h18" />
      <path d="M9 6v12M15 6v12" />
    </svg>
  );
}

// Category slug → icon. Falls back to a sparkle for anything unmatched.
const CATEGORY_ICONS: Record<string, IconType> = {
  hali: CarpetIcon,
  "koltuk-mobilya": Sofa,
  yatak: BedDouble,
  "yorgan-battaniye": QuiltIcon,
  perde: CurtainIcon,
  "ek-hizmetler": Sparkles,
};

const priceFormatter = new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 });

export function PriceListView({ groups }: { groups: PriceGroup[] }) {
  const t = useTranslations("priceList");
  const [activeId, setActiveId] = useState(groups[0]?.id);

  const active = groups.find((g) => g.id === activeId) ?? groups[0];
  const ActiveIcon = CATEGORY_ICONS[active.slug] ?? Sparkles;

  return (
    <div className="mx-auto max-w-3xl">
      {/* Category tabs */}
      <div
        role="tablist"
        aria-label={t("title")}
        className="flex flex-wrap justify-center gap-2.5"
      >
        {groups.map((group) => {
          const Icon = CATEGORY_ICONS[group.slug] ?? Sparkles;
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
              <Icon className="size-4" />
              {group.name}
            </button>
          );
        })}
      </div>

      {/* Active category panel */}
      <div className="mt-8">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm"
        >
          <header className="flex items-center gap-4 border-b border-border px-6 py-5">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ActiveIcon className="size-6" />
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-xl font-bold text-foreground">{active.name}</h2>
              <p className="text-sm text-muted-foreground">{active.rows.length} hizmet</p>
            </div>
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
