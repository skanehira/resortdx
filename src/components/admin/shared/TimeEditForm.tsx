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

export default TimeEditForm;
