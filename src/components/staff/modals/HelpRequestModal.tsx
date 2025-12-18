import { useState } from "react";
import type { Staff } from "../../../types";
import { CloseIcon, UserIcon, CheckIcon } from "../../ui/Icons";

interface HelpRequestModalProps {
  currentStaffId: string;
  allStaff: Staff[];
  relatedTaskId?: string;
  onSubmit: (data: {
    targetStaffIds: string[] | "all";
    message: string;
    relatedTaskId?: string;
  }) => void;
  onClose: () => void;
}

type TargetMode = "all" | "specific";

export const HelpRequestModal = ({
  currentStaffId,
  allStaff,
  relatedTaskId,
  onSubmit,
  onClose,
}: HelpRequestModalProps) => {
  const [targetMode, setTargetMode] = useState<TargetMode>("all");
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  // 自分以外の勤務中スタッフのみ表示
  const availableStaff = allStaff.filter(
    (staff) => staff.id !== currentStaffId && staff.status === "on_duty",
  );

  const handleToggleStaff = (staffId: string) => {
    setSelectedStaffIds((prev) =>
      prev.includes(staffId) ? prev.filter((id) => id !== staffId) : [...prev, staffId],
    );
  };

  const handleSubmit = () => {
    if (!message.trim()) return;
    if (targetMode === "specific" && selectedStaffIds.length === 0) return;

    onSubmit({
      targetStaffIds: targetMode === "all" ? "all" : selectedStaffIds,
      message: message.trim(),
      relatedTaskId,
    });
  };

  const canSubmit = message.trim() && (targetMode === "all" || selectedStaffIds.length > 0);

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full h-full sm:h-auto sm:rounded-2xl sm:max-w-lg sm:max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between p-4 border-b border-[var(--shironeri-warm)]">
          <div>
            <h2 className="text-lg font-display font-bold text-[var(--sumi)]">ヘルプ依頼</h2>
            <p className="text-sm text-[var(--nezumi)]">他のスタッフに助けを求める</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--shironeri-warm)]">
            <CloseIcon size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Target selection */}
          <div>
            <h3 className="text-sm font-medium text-[var(--sumi)] mb-3">依頼先</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setTargetMode("all")}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                  targetMode === "all"
                    ? "bg-purple-500 text-white"
                    : "bg-[var(--shironeri-warm)] text-[var(--sumi)]"
                }`}
              >
                全スタッフ
              </button>
              <button
                onClick={() => setTargetMode("specific")}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                  targetMode === "specific"
                    ? "bg-purple-500 text-white"
                    : "bg-[var(--shironeri-warm)] text-[var(--sumi)]"
                }`}
              >
                特定のスタッフ
              </button>
            </div>
          </div>

          {/* Staff selection (when specific mode) */}
          {targetMode === "specific" && (
            <div>
              <h3 className="text-sm font-medium text-[var(--sumi)] mb-3">
                スタッフを選択
                {selectedStaffIds.length > 0 && (
                  <span className="ml-2 text-purple-500">({selectedStaffIds.length}名選択中)</span>
                )}
              </h3>
              {availableStaff.length === 0 ? (
                <p className="text-sm text-[var(--nezumi)] p-4 bg-[var(--shironeri-warm)] rounded-lg text-center">
                  現在勤務中の他スタッフがいません
                </p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {availableStaff.map((staff) => {
                    const isSelected = selectedStaffIds.includes(staff.id);
                    return (
                      <button
                        key={staff.id}
                        onClick={() => handleToggleStaff(staff.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                          isSelected
                            ? "bg-purple-100 border border-purple-300"
                            : "bg-[var(--shironeri-warm)]"
                        }`}
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: staff.avatarColor }}
                        >
                          {staff.name.charAt(0)}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium text-[var(--sumi)]">{staff.name}</p>
                          <p className="text-xs text-[var(--nezumi)]">
                            {staff.role === "cleaning" && "清掃"}
                            {staff.role === "service" && "接客"}
                            {staff.role === "kitchen" && "調理場"}
                            {staff.role === "driver" && "送迎"}
                            {staff.role === "concierge" && "コンシェルジュ"}
                            {staff.role === "manager" && "マネージャー"}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                            <CheckIcon size={14} className="text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* All staff info */}
          {targetMode === "all" && (
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <UserIcon size={16} className="text-purple-500" />
                <span className="text-sm font-medium text-purple-700">全員にブロードキャスト</span>
              </div>
              <p className="text-xs text-purple-600">
                現在勤務中の全スタッフ({availableStaff.length}名)に通知されます
              </p>
            </div>
          )}

          {/* Message input */}
          <div>
            <h3 className="text-sm font-medium text-[var(--sumi)] mb-2">
              依頼内容 <span className="text-[var(--shu)]">*</span>
            </h3>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="どのような助けが必要ですか？詳しく記入してください..."
              className="w-full p-3 border border-[var(--nezumi)]/30 rounded-lg text-sm resize-none focus:outline-none focus:border-purple-500"
              rows={4}
            />
            <p className="text-xs text-[var(--nezumi)] mt-1">
              具体的な内容を記入すると、適切なスタッフが対応しやすくなります
            </p>
          </div>

          {/* Related task info */}
          {relatedTaskId && (
            <div className="p-3 bg-[var(--shironeri-warm)] rounded-lg">
              <p className="text-xs text-[var(--nezumi)]">関連タスク: {relatedTaskId}</p>
            </div>
          )}
        </div>

        {/* Footer - pb-20 for bottom nav bar space on mobile */}
        <div className="shrink-0 p-4 pb-20 sm:pb-4 border-t border-[var(--shironeri-warm)] flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-[var(--nezumi)]/20 text-[var(--sumi)] rounded-lg font-medium"
          >
            キャンセル
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
              canSubmit
                ? "bg-purple-500 text-white"
                : "bg-[var(--nezumi)]/20 text-[var(--nezumi)] cursor-not-allowed"
            }`}
          >
            依頼する
          </button>
        </div>
      </div>
    </div>
  );
};
