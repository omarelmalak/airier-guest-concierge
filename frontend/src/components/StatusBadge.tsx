import { cn } from "@/lib/utils";
import { AIStatus } from "@/data/mockData";

interface StatusBadgeProps {
  status: AIStatus;
  className?: string;
}

const statusConfig = {
  online: {
    label: "AI online",
    dotClass: "bg-status-online",
    bgClass: "bg-status-online/10 text-status-online border-status-online/20",
  },
  warning: {
    label: "Action required",
    dotClass: "bg-status-warning",
    bgClass: "bg-status-warning/10 text-status-warning border-status-warning/20",
  },
  offline: {
    label: "AI offline",
    dotClass: "bg-status-offline",
    bgClass: "bg-status-offline/10 text-status-offline border-status-offline/20",
  },
};

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        config.bgClass,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse-soft", config.dotClass)} />
      {config.label}
    </div>
  );
};

export default StatusBadge;
