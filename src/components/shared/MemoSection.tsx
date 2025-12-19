import { useState } from "react";
import { EditIcon, CheckIcon, CloseIcon } from "../ui/Icons";

interface MemoSectionProps {
  title: string;
  value: string | null | undefined;
  onSave: (newValue: string | null) => void;
  placeholder?: string;
  editable?: boolean;
  variant?: "admin" | "personal" | "shared";
}

const variantStyles = {
  admin: {
    bg: "bg-[var(--ai)]/5",
    border: "border-[var(--ai)]/20",
    title: "text-[var(--ai)]",
    badge: "bg-[var(--ai)]/10 text-[var(--ai)]",
  },
  personal: {
    bg: "bg-[var(--kitsune)]/5",
    border: "border-[var(--kitsune)]/20",
    title: "text-[var(--kitsune)]",
    badge: "bg-[var(--kitsune)]/10 text-[var(--kitsune)]",
  },
  shared: {
    bg: "bg-[var(--wasurenagusa)]/5",
    border: "border-[var(--wasurenagusa)]/20",
    title: "text-[var(--wasurenagusa)]",
    badge: "bg-[var(--wasurenagusa)]/10 text-[var(--wasurenagusa)]",
  },
};

export const MemoSection = ({
  title,
  value,
  onSave,
  placeholder = "メモを入力...",
  editable = true,
  variant = "admin",
}: MemoSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || "");
  const styles = variantStyles[variant];

  const handleSave = () => {
    onSave(editValue.trim() || null);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value || "");
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") {
      handleCancel();
    } else if (e.key === "Enter" && e.metaKey) {
      handleSave();
    }
  };

  return (
    <div className={`rounded-lg border ${styles.border} ${styles.bg} p-3`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium ${styles.title}`}>{title}</span>
          {variant === "shared" && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${styles.badge}`}>全スタッフ</span>
          )}
          {variant === "personal" && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${styles.badge}`}>自分のみ</span>
          )}
        </div>
        {editable && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-[var(--nezumi)] hover:text-[var(--sumi)] hover:bg-[rgba(45,41,38,0.08)] rounded transition-colors"
            title="編集"
          >
            <EditIcon size={14} />
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={3}
            className="w-full px-3 py-2 text-sm border border-[rgba(45,41,38,0.2)] rounded-md focus:outline-none focus:border-[var(--ai)] focus:ring-1 focus:ring-[var(--ai)] resize-none"
            autoFocus
          />
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[var(--nezumi)]">
              Cmd+Enter で保存 / Esc でキャンセル
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={handleSave}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-[var(--ai)] text-white rounded hover:bg-[var(--ai-deep)] transition-colors"
              >
                <CheckIcon size={12} />
                保存
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-[var(--gofun)] text-[var(--sumi)] rounded hover:bg-[rgba(45,41,38,0.1)] transition-colors"
              >
                <CloseIcon size={12} />
                キャンセル
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={`text-sm ${value ? "text-[var(--sumi)]" : "text-[var(--nezumi)] italic"}`}>
          {value || (editable ? "クリックして編集..." : "メモなし")}
        </div>
      )}
    </div>
  );
};

interface MemoDisplayProps {
  title: string;
  value: string | null | undefined;
  variant?: "admin" | "personal" | "shared";
}

export const MemoDisplay = ({ title, value, variant = "admin" }: MemoDisplayProps) => {
  const styles = variantStyles[variant];

  if (!value) return null;

  return (
    <div className={`rounded-lg border ${styles.border} ${styles.bg} p-3`}>
      <div className="flex items-center gap-2 mb-1">
        <span className={`text-xs font-medium ${styles.title}`}>{title}</span>
        {variant === "shared" && (
          <span className={`text-[10px] px-1.5 py-0.5 rounded ${styles.badge}`}>全スタッフ</span>
        )}
      </div>
      <div className="text-sm text-[var(--sumi)] whitespace-pre-wrap">{value}</div>
    </div>
  );
};

export default MemoSection;
