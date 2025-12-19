import { useTranslation } from "react-i18next";
import type { UnifiedTask } from "../../types";

type TaskStatus = UnifiedTask["status"];

interface StatusBadgeProps {
  status: TaskStatus;
  size?: "sm" | "md";
}

const STATUS_CONFIG: Record<TaskStatus, { bg: string; text: string }> = {
  pending: { bg: "bg-[var(--nezumi)]/20", text: "text-[var(--nezumi)]" },
  in_progress: { bg: "bg-[var(--ai)]/20", text: "text-[var(--ai)]" },
  completed: { bg: "bg-[var(--aotake)]/20", text: "text-[var(--aotake)]" },
};

export const StatusBadge = ({ status, size = "sm" }: StatusBadgeProps) => {
  const { t } = useTranslation("types");

  const config = STATUS_CONFIG[status];
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <span className={`rounded-full font-medium ${sizeClasses} ${config.bg} ${config.text}`}>
      {t(`taskStatus.${status}`)}
    </span>
  );
};
