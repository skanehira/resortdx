import { mockStaff } from "../../data/mock";

export interface StaffSelectorProps {
  /** 現在の担当者ID */
  value: string | null;
  /** 担当者変更時のコールバック */
  onChange: (staffId: string | null) => void;
  /** 無効化フラグ */
  disabled?: boolean;
  /** 「未割当」オプションを表示するか */
  showUnassigned?: boolean;
  /** 追加のCSSクラス */
  className?: string;
  /** アクセシビリティ用のラベル */
  ariaLabel?: string;
}

export const StaffSelector = ({
  value,
  onChange,
  disabled = false,
  showUnassigned = false,
  className = "",
  ariaLabel = "担当者を選択",
}: StaffSelectorProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value === "" ? null : e.target.value;
    onChange(newValue);
  };

  return (
    <select
      value={value ?? ""}
      onChange={handleChange}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`w-full px-3 py-2 border border-[var(--shironeri-warm)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ai)]/30 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {showUnassigned && <option value="">未割当</option>}
      {mockStaff.map((staff) => (
        <option key={staff.id} value={staff.id}>
          {staff.name}
        </option>
      ))}
    </select>
  );
};
