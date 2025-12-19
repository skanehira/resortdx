import { useState } from "react";
import { ClockIcon, CheckIcon, CloseIcon } from "../../ui/Icons";

interface TimeEditFormProps {
  value: string;
  onSave: (newTime: string) => void;
  onCancel: () => void;
  label?: string;
}

export const TimeEditForm = ({ value, onSave, onCancel, label = "時間" }: TimeEditFormProps) => {
  const [time, setTime] = useState(value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (time) {
      onSave(time);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="flex items-center gap-2 flex-1">
        <ClockIcon size={16} className="text-[var(--nezumi)]" />
        <span className="text-xs text-[var(--nezumi)]">{label}</span>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="flex-1 px-2 py-1 text-sm border border-[rgba(45,41,38,0.2)] rounded-md focus:outline-none focus:border-[var(--ai)] focus:ring-1 focus:ring-[var(--ai)]"
          autoFocus
        />
      </div>
      <button
        type="submit"
        className="p-1.5 bg-[var(--ai)] text-white rounded-md hover:bg-[var(--ai-deep)] transition-colors"
        title="保存"
      >
        <CheckIcon size={14} />
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="p-1.5 bg-[var(--gofun)] text-[var(--sumi)] rounded-md hover:bg-[rgba(45,41,38,0.1)] transition-colors"
        title="キャンセル"
      >
        <CloseIcon size={14} />
      </button>
    </form>
  );
};

interface TimeDisplayProps {
  value: string;
  onEdit: () => void;
  label?: string;
}

export const TimeDisplay = ({ value, onEdit, label = "時間" }: TimeDisplayProps) => {
  return (
    <div
      className="flex items-center gap-2 cursor-pointer hover:bg-[rgba(45,41,38,0.04)] rounded-md px-2 py-1 -mx-2 transition-colors group"
      onClick={onEdit}
    >
      <ClockIcon size={16} className="text-[var(--nezumi)]" />
      <span className="text-xs text-[var(--nezumi)]">{label}</span>
      <span className="text-sm font-medium">{value}</span>
      <span className="text-xs text-[var(--nezumi)] opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
        クリックで編集
      </span>
    </div>
  );
};

// パネル内で使用する編集可能な時刻表示コンポーネント
interface EditableTimeDisplayProps {
  value: string;
  onTimeChange: (newTime: string) => void;
  label?: string;
  size?: "sm" | "md" | "lg";
  accentColor?: "ai" | "kincha" | "sumi";
}

export const EditableTimeDisplay = ({
  value,
  onTimeChange,
  label = "予定時刻",
  size = "md",
  accentColor = "ai",
}: EditableTimeDisplayProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    if (editValue && editValue !== value) {
      onTimeChange(editValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl",
  };

  const accentClasses = {
    ai: "text-[var(--ai)]",
    kincha: "text-[var(--kincha)]",
    sumi: "text-[var(--sumi)]",
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <ClockIcon size={18} className={accentClasses[accentColor]} />
          <span className="font-display font-semibold text-[var(--sumi)]">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="time"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`${sizeClasses[size]} font-display font-medium px-3 py-2 border-2 border-[var(--ai)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ai)]/30 bg-white`}
            autoFocus
          />
          <button
            type="button"
            onClick={handleSave}
            className="p-2 bg-[var(--ai)] text-white rounded-lg hover:bg-[var(--ai-deep)] transition-colors"
            title="保存"
          >
            <CheckIcon size={16} />
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="p-2 bg-[var(--shironeri-warm)] text-[var(--sumi)] rounded-lg hover:bg-[var(--nezumi)]/10 transition-colors"
            title="キャンセル"
          >
            <CloseIcon size={16} />
          </button>
        </div>
        <p className="text-xs text-[var(--nezumi)]">お客様都合による時間変更</p>
      </div>
    );
  }

  // ホバー時の背景色
  const hoverBgClasses = {
    ai: "hover:bg-[var(--ai)]/5",
    kincha: "hover:bg-[var(--kincha)]/5",
    sumi: "hover:bg-[var(--sumi)]/5",
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <ClockIcon size={18} className={accentClasses[accentColor]} />
        <span className="font-display font-semibold text-[var(--sumi)]">{label}</span>
      </div>
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className={`${sizeClasses[size]} font-display font-medium ${accentClasses[accentColor]} ${hoverBgClasses[accentColor]} px-3 py-2 -mx-3 rounded-lg cursor-pointer transition-all duration-200 border-2 border-transparent hover:border-[var(--${accentColor})]/20`}
        title="クリックで時間を変更"
      >
        {value}
      </button>
    </div>
  );
};

// インライン時刻編集（テーブル行など用）
interface InlineTimeEditProps {
  value: string;
  onTimeChange: (newTime: string) => void;
}

export const InlineTimeEdit = ({ value, onTimeChange }: InlineTimeEditProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    if (editValue && editValue !== value) {
      onTimeChange(editValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-1 min-w-0">
        <input
          type="time"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") handleCancel();
          }}
          className="w-[90px] px-1.5 py-0.5 text-sm border border-[var(--ai)] rounded focus:outline-none"
          autoFocus
        />
        <button
          type="button"
          onClick={handleSave}
          className="p-0.5 text-[var(--aotake)] hover:bg-[var(--aotake)]/10 rounded flex-shrink-0"
        >
          <CheckIcon size={12} />
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="p-0.5 text-[var(--nezumi)] hover:bg-[var(--nezumi)]/10 rounded flex-shrink-0"
        >
          <CloseIcon size={12} />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsEditing(true)}
      className="flex items-center gap-1 font-display font-semibold text-[var(--ai)] hover:text-[var(--ai-deep)] hover:bg-[var(--ai)]/5 px-2 py-1 -mx-2 rounded transition-all"
      title="クリックで時間を変更"
    >
      <ClockIcon size={14} />
      {value}
    </button>
  );
};

export default TimeEditForm;
