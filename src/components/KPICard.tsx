import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface KPICardProps {
  title: string;
  value: number | string;
  trend: string;
  subtitle: string;
  variant: "new" | "momentum" | "overdue" | "highvalue";
  icon: ReactNode;
}

const variantStyles = {
  new: "border-status-new/20",
  momentum: "border-status-momentum/20",
  overdue: "border-status-overdue/20",
  highvalue: "border-status-highvalue/20",
};

const iconBgStyles = {
  new: "bg-status-new-bg text-status-new",
  momentum: "bg-status-momentum-bg text-status-momentum",
  overdue: "bg-status-overdue-bg text-status-overdue",
  highvalue: "bg-status-highvalue-bg text-status-highvalue",
};

const trendStyles = {
  new: "text-status-new",
  momentum: "text-status-momentum",
  overdue: "text-status-overdue",
  highvalue: "text-status-highvalue",
};

export function KPICard({ title, value, trend, subtitle, variant, icon }: KPICardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-5 transition-shadow hover:shadow-md cursor-pointer animate-fade-in",
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[13px] font-medium text-muted-foreground">{title}</p>
          <p className="mt-1 text-3xl font-bold text-card-foreground">{value}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className={cn("text-xs font-semibold", trendStyles[variant])}>
              {trend}
            </span>
            <span className="text-xs text-muted-foreground">{subtitle}</span>
          </div>
        </div>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", iconBgStyles[variant])}>
          {icon}
        </div>
      </div>
    </div>
  );
}
