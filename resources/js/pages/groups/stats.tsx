import { useState } from "react";
import { format } from "date-fns";
import { AppShell, BackButton } from "@/components/web/app-shell";
import { formatMoney } from "@/lib/money";
import { BarChart3 } from "lucide-react";

interface MonthStat {
  month: string; // 'YYYY-MM'
  total_minor: number;
}

interface Props {
  group: { uuid: string; name: string; currency: string };
  months: MonthStat[];
}

const PAGE = 6;

export default function GroupStats({ group, months }: Props) {
  const [visible, setVisible] = useState(PAGE);
  const shown = months.slice(0, visible);
  const hasMore = visible < months.length;

  const monthLabel = (ym: string) => {
    const [year, month] = ym.split("-").map(Number);
    return format(new Date(year, month - 1, 1), "LLLL yyyy");
  };

  return (
    <AppShell
      title={t("groups:statistics")}
      header={
        <div className="flex-none px-4 pt-4 pb-1.5">
          <div className="mb-3 flex items-center justify-between">
            <BackButton href={`/groups/${group.uuid}`} />
            <span className="text-xs text-muted-foreground">{group.name}</span>
            <span className="size-10" />
          </div>
          <div className="px-1 pb-1">
            <h1 className="text-[23px] font-bold tracking-tight">
              {t("groups:statistics")}
            </h1>
            <div className="mt-0.5 text-[13px] text-muted-foreground">
              {t("groups:monthly_spending")}
            </div>
          </div>
        </div>
      }
    >
      {months.length === 0 ? (
        <div className="flex flex-col items-center px-8 pt-14 pb-10 text-center">
          <div className="mb-4 flex size-15 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground">
            <BarChart3 className="size-6" />
          </div>
          <div className="text-base font-semibold">
            {t("groups:no_stats_title")}
          </div>
          <div className="mt-1.5 max-w-60 text-[13.5px] leading-relaxed text-muted-foreground">
            {t("groups:no_stats_hint")}
          </div>
        </div>
      ) : (
        <div className="pt-2">
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            {shown.map((m) => (
              <div
                key={m.month}
                className="flex items-center justify-between border-b border-border px-4 py-3.5 last:border-b-0"
              >
                <span className="text-[14.5px] font-medium capitalize">
                  {monthLabel(m.month)}
                </span>
                <span className="text-[15px] font-semibold tabular-nums">
                  {formatMoney(m.total_minor, group.currency)}
                </span>
              </div>
            ))}
          </div>
          {hasMore && (
            <button
              type="button"
              onClick={() => setVisible((v) => v + PAGE)}
              className="mt-3 flex h-12 w-full cursor-pointer items-center justify-center rounded-2xl border border-dashed border-border text-sm font-semibold active:scale-[0.98]"
            >
              {t("groups:load_more")}
            </button>
          )}
        </div>
      )}
    </AppShell>
  );
}
