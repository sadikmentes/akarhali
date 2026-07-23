import type { LucideIcon } from "lucide-react";

const TONES = {
  emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  sky: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
} as const;

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "emerald",
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  tone?: keyof typeof TONES;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-card p-6 ring-1 ring-foreground/10 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:ring-foreground/15">
      <div
        className={`absolute -top-6 -right-6 size-24 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100 ${TONES[tone].split(" ")[0]}`}
      />
      <div className="relative flex items-center gap-4">
        <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${TONES[tone]}`}>
          <Icon className="size-6" />
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-bold tabular-nums">{value}</p>
          <p className="truncate text-sm text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}
