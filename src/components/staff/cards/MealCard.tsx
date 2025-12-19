import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { UnifiedTask, MealStatus } from "../../../types";
import {
  MEAL_TYPE_LABELS,
  COURSE_TYPE_LABELS,
  DIETARY_RESTRICTION_LABELS,
  MEAL_STATUS_LABELS,
} from "../../../types";
import { AlertIcon, UserIcon } from "../../ui/Icons";
import { TaskCardBase } from "./TaskCardBase";
import { MemoSection, MemoDisplay } from "../../shared/MemoSection";

// 配膳ステータスの進捗表示
const MealProgressIndicator = ({ status }: { status: MealStatus }) => {
  const stages: MealStatus[] = ["preparing", "serving", "completed"];
  const currentIndex = stages.indexOf(status === "needs_check" ? "serving" : status);

  return (
    <div className="flex items-center gap-1">
      {stages.map((stage, index) => (
        <div key={stage} className="flex items-center">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
              ${
                index <= currentIndex
                  ? "bg-[var(--kincha)] text-white"
                  : "bg-[var(--nezumi)]/20 text-[var(--nezumi)]"
              }`}
          >
            {index + 1}
          </div>
          {index < stages.length - 1 && (
            <div
              className={`w-8 h-0.5 ${
                index < currentIndex ? "bg-[var(--kincha)]" : "bg-[var(--nezumi)]/20"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

type MemoType = "personal" | "shared";

interface MealCardProps {
  task: UnifiedTask;
  onStatusChange: (taskId: string, newStatus: UnifiedTask["status"]) => void;
  onMealStatusChange?: (taskId: string, newMealStatus: MealStatus) => void;
  onMemoChange?: (taskId: string, memoType: MemoType, value: string | null) => void;
}

export const MealCard = ({
  task,
  onStatusChange,
  onMealStatusChange,
  onMemoChange,
}: MealCardProps) => {
  const { t } = useTranslation("staff");
  const [isExpanded, setIsExpanded] = useState(false);
  const meal = task.meal;

  // 完了時にアコーディオンを閉じる
  useEffect(() => {
    if (task.status === "completed") {
      setIsExpanded(false);
    }
  }, [task.status]);

  if (!meal) return null;

  const hasAllergies = meal.dietaryRestrictions.length > 0;

  const handleProgressMealStatus = () => {
    if (!onMealStatusChange) return;
    const nextStatus: Record<MealStatus, MealStatus> = {
      preparing: "serving",
      serving: "completed",
      completed: "completed",
      needs_check: "serving",
    };
    const next = nextStatus[meal.mealStatus];
    onMealStatusChange(task.id, next);

    // 完了時は統合ステータスも更新
    if (next === "completed") {
      onStatusChange(task.id, "completed");
    }
  };

  return (
    <TaskCardBase
      task={task}
      onStatusChange={onStatusChange}
      onExpand={() => setIsExpanded(!isExpanded)}
      isExpanded={isExpanded}
    >
      <div className="space-y-4">
        {/* Meal info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[var(--shironeri-warm)] rounded-lg p-3">
            <p className="text-xs text-[var(--nezumi)]">食事タイプ</p>
            <p className="font-medium text-[var(--sumi)]">{MEAL_TYPE_LABELS[meal.mealType]}</p>
          </div>
          <div className="bg-[var(--shironeri-warm)] rounded-lg p-3">
            <p className="text-xs text-[var(--nezumi)]">コース</p>
            <p className="font-medium text-[var(--sumi)]">{COURSE_TYPE_LABELS[meal.courseType]}</p>
          </div>
        </div>

        {/* Guest info */}
        <div className="flex items-center gap-3 p-3 bg-[var(--shironeri-warm)] rounded-lg">
          <UserIcon size={20} className="text-[var(--nezumi)]" />
          <div>
            <p className="font-medium text-[var(--sumi)]">{meal.guestName}様</p>
            <p className="text-xs text-[var(--nezumi)]">{meal.guestCount}名様</p>
          </div>
        </div>

        {/* Allergies warning */}
        {hasAllergies && (
          <div className="p-3 bg-[var(--shu)]/10 border border-[var(--shu)]/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertIcon size={16} className="text-[var(--shu)]" />
              <span className="text-sm font-medium text-[var(--shu)]">アレルギー・食事制限</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {meal.dietaryRestrictions.map((restriction) => (
                <span
                  key={restriction}
                  className="px-2 py-0.5 bg-[var(--shu)]/20 text-[var(--shu)] text-xs rounded"
                >
                  {DIETARY_RESTRICTION_LABELS[restriction]}
                </span>
              ))}
            </div>
            {meal.dietaryNotes && (
              <p className="mt-2 text-xs text-[var(--sumi)]">{meal.dietaryNotes}</p>
            )}
          </div>
        )}

        {/* Progress indicator */}
        <div className="flex items-center justify-between">
          <MealProgressIndicator status={meal.mealStatus} />
          <span className="text-sm text-[var(--nezumi)]">
            {MEAL_STATUS_LABELS[meal.mealStatus]}
          </span>
        </div>

        {/* Needs check flag */}
        {meal.needsCheck && (
          <div className="p-3 bg-[var(--kincha)]/10 border border-[var(--kincha)]/30 rounded-lg">
            <p className="text-sm text-[var(--kincha)] font-medium">再確認が必要です</p>
          </div>
        )}

        {/* Action button */}
        {meal.mealStatus !== "completed" && (
          <button
            onClick={handleProgressMealStatus}
            className="w-full py-3 bg-[var(--kincha)] text-white rounded-lg font-medium"
          >
            {meal.mealStatus === "preparing"
              ? "配膳開始"
              : meal.mealStatus === "serving"
                ? "配膳完了"
                : "確認完了"}
          </button>
        )}

        {/* Memo Section */}
        <div className="mt-4 space-y-3">
          {/* Admin Memo (read-only) */}
          <MemoDisplay title={t("memo.fromAdmin")} value={task.adminMemo} variant="admin" />

          {/* Shared Memo (read-only) */}
          <MemoDisplay title={t("memo.sharedMemo")} value={task.sharedMemo} variant="shared" />

          {/* Personal Memo (editable) */}
          <MemoSection
            title={t("memo.personalMemo")}
            value={task.personalMemo}
            onSave={(value) => onMemoChange?.(task.id, "personal", value)}
            placeholder={t("memo.placeholder")}
            editable={true}
            variant="personal"
          />
        </div>
      </div>
    </TaskCardBase>
  );
};
