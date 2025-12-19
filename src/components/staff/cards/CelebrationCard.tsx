import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { UnifiedTask, CelebrationItemCheck } from "../../../types";
import { CELEBRATION_TYPE_LABELS, CELEBRATION_ITEM_LABELS } from "../../../types";
import {
  CheckIcon,
  CakeIcon,
  FlowerIcon,
  ChampagneIcon,
  DecorationIcon,
  MessageCardIcon,
  PlayIcon,
  CheckCircleIcon,
} from "../../ui/Icons";
import { TaskCardBase } from "./TaskCardBase";
import { MemoSection, MemoDisplay } from "../../shared/MemoSection";

// アイテムアイコンのマッピング
const ITEM_ICONS: Record<string, React.FC<{ size?: number; className?: string }>> = {
  cake: CakeIcon,
  flowers: FlowerIcon,
  champagne: ChampagneIcon,
  decoration: DecorationIcon,
  message_card: MessageCardIcon,
};

type MemoType = "personal" | "shared";

interface CelebrationCardProps {
  task: UnifiedTask;
  onStatusChange: (taskId: string, newStatus: UnifiedTask["status"]) => void;
  onToggleCelebrationItem?: (taskId: string, item: CelebrationItemCheck["item"]) => void;
  onCompletionReport?: (taskId: string, report: string) => void;
  onMemoChange?: (taskId: string, memoType: MemoType, value: string | null) => void;
}

export const CelebrationCard = ({
  task,
  onStatusChange,
  onToggleCelebrationItem,
  onCompletionReport,
  onMemoChange,
}: CelebrationCardProps) => {
  const { t } = useTranslation("staff");
  const [isExpanded, setIsExpanded] = useState(false);
  const [completionNote, setCompletionNote] = useState("");
  const celebration = task.celebration;

  // 完了時にアコーディオンを閉じる
  useEffect(() => {
    if (task.status === "completed") {
      setIsExpanded(false);
    }
  }, [task.status]);

  if (!celebration) return null;

  const checkedCount = celebration.items.filter((i) => i.isChecked).length;
  const totalCount = celebration.items.length;
  const allChecked = checkedCount === totalCount;

  const handleComplete = () => {
    if (allChecked) {
      onCompletionReport?.(task.id, completionNote);
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
        {/* Celebration info */}
        <div className="p-3 bg-[var(--shu)]/10 rounded-lg">
          <p className="text-xs text-[var(--nezumi)]">お祝いタイプ</p>
          <p className="font-medium text-[var(--sumi)]">
            {CELEBRATION_TYPE_LABELS[celebration.celebrationType]}
          </p>
          {celebration.celebrationDescription && (
            <p className="mt-1 text-sm text-[var(--nezumi)]">
              {celebration.celebrationDescription}
            </p>
          )}
        </div>

        {/* Guest info */}
        <div className="p-3 bg-[var(--shironeri-warm)] rounded-lg">
          <p className="text-xs text-[var(--nezumi)]">ゲスト</p>
          <p className="font-medium text-[var(--sumi)]">{celebration.guestName}様</p>
        </div>

        {/* State 1: Pending - Show start guidance */}
        {task.status === "pending" && (
          <>
            {/* Progress (disabled) */}
            <div className="opacity-60">
              <div className="flex items-center justify-between text-xs text-[var(--nezumi)]">
                <span>準備アイテム</span>
                <span>
                  {checkedCount}/{totalCount}
                </span>
              </div>
              <div className="h-1.5 bg-[var(--shironeri-warm)] rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-[var(--shu)] rounded-full transition-all duration-300"
                  style={{
                    width: `${totalCount > 0 ? (checkedCount / totalCount) * 100 : 0}%`,
                  }}
                />
              </div>

              {/* Item checklist preview */}
              <div className="space-y-2 mt-4">
                {celebration.items.map((itemCheck) => {
                  const IconComponent = ITEM_ICONS[itemCheck.item] || CheckIcon;
                  return (
                    <div
                      key={itemCheck.item}
                      className="w-full flex items-center gap-3 p-3 rounded-lg bg-[var(--shironeri-warm)] cursor-not-allowed"
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white border border-[var(--nezumi)]/30">
                        <IconComponent size={16} />
                      </div>
                      <span className="flex-1 text-left text-[var(--sumi)]">
                        {CELEBRATION_ITEM_LABELS[itemCheck.item]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Start button */}
            <button
              onClick={() => onStatusChange(task.id, "in_progress")}
              className="w-full py-3 bg-[var(--shu)] text-white rounded-lg font-medium flex items-center justify-center gap-2"
            >
              <PlayIcon size={18} />
              準備を開始する
            </button>
          </>
        )}

        {/* State 2: In Progress */}
        {task.status === "in_progress" && (
          <>
            {/* Progress */}
            <div className="flex items-center justify-between text-xs text-[var(--nezumi)]">
              <span>準備アイテム</span>
              <span>
                {checkedCount}/{totalCount}
              </span>
            </div>
            <div className="h-1.5 bg-[var(--shironeri-warm)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--shu)] rounded-full transition-all duration-300"
                style={{
                  width: `${totalCount > 0 ? (checkedCount / totalCount) * 100 : 0}%`,
                }}
              />
            </div>

            {/* Item checklist */}
            <div className="space-y-2">
              {celebration.items.map((itemCheck) => {
                const IconComponent = ITEM_ICONS[itemCheck.item] || CheckIcon;
                return (
                  <button
                    key={itemCheck.item}
                    onClick={() => onToggleCelebrationItem?.(task.id, itemCheck.item)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      itemCheck.isChecked ? "bg-[var(--shu)]/10" : "bg-[var(--shironeri-warm)]"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        itemCheck.isChecked
                          ? "bg-[var(--shu)] text-white"
                          : "bg-white border border-[var(--nezumi)]/30"
                      }`}
                    >
                      <IconComponent size={16} />
                    </div>
                    <span
                      className={`flex-1 text-left ${
                        itemCheck.isChecked ? "text-[var(--shu)]" : "text-[var(--sumi)]"
                      }`}
                    >
                      {CELEBRATION_ITEM_LABELS[itemCheck.item]}
                    </span>
                    {itemCheck.isChecked && <CheckIcon size={16} className="text-[var(--shu)]" />}
                  </button>
                );
              })}
            </div>

            {/* Not all checked - show progress */}
            {!allChecked && (
              <>
                <div className="text-center py-2 text-sm text-[var(--nezumi)]">
                  残り {totalCount - checkedCount} 項目
                </div>
                <button
                  disabled
                  className="w-full py-3 bg-[var(--nezumi)]/20 text-[var(--nezumi)] rounded-lg font-medium cursor-not-allowed"
                >
                  全アイテムを確認すると完了できます
                </button>
              </>
            )}

            {/* All checked - show completion UI */}
            {allChecked && (
              <>
                <div className="p-4 bg-[var(--aotake)]/10 border border-[var(--aotake)]/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon size={20} className="text-[var(--aotake)]" />
                    <span className="font-medium text-[var(--aotake)]">全アイテム準備完了!</span>
                  </div>
                </div>

                {/* Completion note */}
                <div className="space-y-2">
                  <label className="block text-xs text-[var(--nezumi)]">完了メモ（任意）</label>
                  <textarea
                    value={completionNote}
                    onChange={(e) => setCompletionNote(e.target.value)}
                    placeholder="演出の様子などを記録..."
                    className="w-full p-3 border border-[var(--nezumi)]/30 rounded-lg text-sm resize-none"
                    rows={2}
                  />
                </div>

                <button
                  onClick={handleComplete}
                  className="w-full py-3 bg-[var(--shu)] text-white rounded-lg font-medium animate-pulse-subtle"
                >
                  お祝い演出完了
                </button>
              </>
            )}
          </>
        )}

        {/* State 3: Completed */}
        {task.status === "completed" && (
          <>
            {/* Progress (completed) */}
            <div className="flex items-center justify-between text-xs text-[var(--nezumi)]">
              <span>準備アイテム</span>
              <span>
                {checkedCount}/{totalCount}
              </span>
            </div>
            <div className="h-1.5 bg-[var(--shironeri-warm)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--aotake)] rounded-full" style={{ width: "100%" }} />
            </div>

            {/* Item checklist (read-only) */}
            <div className="space-y-2 opacity-60">
              {celebration.items.map((itemCheck) => {
                const IconComponent = ITEM_ICONS[itemCheck.item] || CheckIcon;
                return (
                  <div
                    key={itemCheck.item}
                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-[var(--aotake)]/10"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--aotake)] text-white">
                      <IconComponent size={16} />
                    </div>
                    <span className="flex-1 text-left text-[var(--aotake)]">
                      {CELEBRATION_ITEM_LABELS[itemCheck.item]}
                    </span>
                    <CheckIcon size={16} className="text-[var(--aotake)]" />
                  </div>
                );
              })}
            </div>

            {/* Completion report display */}
            {celebration.completionReport && (
              <div className="p-3 bg-[var(--aotake)]/10 rounded-lg">
                <p className="text-xs text-[var(--nezumi)] mb-1">完了メモ</p>
                <p className="text-sm text-[var(--sumi)]">{celebration.completionReport}</p>
              </div>
            )}

            <div className="p-4 bg-[var(--aotake)]/10 border border-[var(--aotake)]/30 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircleIcon size={20} className="text-[var(--aotake)]" />
                <span className="font-medium text-[var(--aotake)]">お祝い演出完了</span>
              </div>
            </div>
          </>
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
