import { useState, useEffect } from "react";
import { NoteIcon } from "../ui/Icons";

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
    icon: "text-[var(--ai)]",
    focus: "focus:ring-[var(--ai)]",
  },
  personal: {
    icon: "text-[var(--kitsune)]",
    focus: "focus:ring-[var(--kitsune)]",
  },
  shared: {
    icon: "text-[var(--wasurenagusa)]",
    focus: "focus:ring-[var(--wasurenagusa)]",
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
  const [editValue, setEditValue] = useState(value || "");
  const styles = variantStyles[variant];

  // Sync state when value prop changes
  useEffect(() => {
    setEditValue(value || "");
  }, [value]);

  const handleBlur = () => {
    const trimmedValue = editValue.trim() || null;
    if (trimmedValue !== (value || null)) {
      onSave(trimmedValue);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <NoteIcon size={16} className={styles.icon} />
        <span className="text-xs text-[var(--nezumi)]">{title}</span>
      </div>
      {editable ? (
        <textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          placeholder={placeholder}
          rows={3}
          className={`w-full px-3 py-2 text-sm border border-[rgba(45,41,38,0.12)] rounded-lg focus:outline-none focus:ring-2 ${styles.focus} focus:border-transparent resize-none`}
        />
      ) : (
        <div className={`text-sm ${value ? "text-[var(--sumi)]" : "text-[var(--nezumi)] italic"}`}>
          {value || "メモなし"}
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
    <div>
      <div className="flex items-center gap-2 mb-2">
        <NoteIcon size={16} className={styles.icon} />
        <span className="text-xs text-[var(--nezumi)]">{title}</span>
      </div>
      <div className="text-sm text-[var(--sumi)] whitespace-pre-wrap px-3 py-2 bg-[rgba(45,41,38,0.04)] rounded-lg">
        {value}
      </div>
    </div>
  );
};

export default MemoSection;
