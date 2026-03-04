import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  type: "stage" | "momentum" | "status";
  value: string;
  className?: string;
}

const stageColors: Record<string, string> = {
  new: "status-new",
  contacted: "bg-status-new-bg text-status-new",
  qualified: "bg-status-momentum-bg text-status-momentum",
  proposal: "bg-status-highvalue-bg text-status-highvalue",
  negotiation: "bg-status-stalled-bg text-status-stalled",
  closed: "bg-status-momentum-bg text-status-momentum",
};

const momentumColors: Record<string, string> = {
  hot: "bg-status-momentum-bg text-status-momentum",
  warm: "bg-status-new-bg text-status-new",
  stalled: "bg-status-stalled-bg text-status-stalled",
  cold: "bg-status-overdue-bg text-status-overdue",
};

const statusColors: Record<string, string> = {
  active: "bg-status-momentum-bg text-status-momentum",
  overdue: "bg-status-overdue-bg text-status-overdue",
  "at-risk": "bg-status-stalled-bg text-status-stalled",
  won: "bg-status-momentum-bg text-status-momentum",
  lost: "bg-muted text-muted-foreground",
};

export function StatusBadge({ type, value, className }: StatusBadgeProps) {
  const colorMap = type === "stage" ? stageColors : type === "momentum" ? momentumColors : statusColors;
  const colorClass = colorMap[value] || "bg-muted text-muted-foreground";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize",
        colorClass,
        className
      )}
    >
      {value === "at-risk" ? "At Risk" : value}
    </span>
  );
}
