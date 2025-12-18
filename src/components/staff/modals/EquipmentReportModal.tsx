import { useState } from "react";
import type {
	RoomAmenity,
	RoomEquipment,
	StockLevel,
	EquipmentStatusType,
	EquipmentReport,
	AmenityUpdate,
	EquipmentUpdate,
} from "../../../types";
import { AMENITY_TYPE_LABELS, EQUIPMENT_TYPE_LABELS } from "../../../types";
import { CloseIcon, CheckIcon, WrenchIcon, AlertIcon } from "../../ui/Icons";

interface EquipmentReportModalProps {
	roomNumber: string;
	amenities: RoomAmenity[];
	equipment: RoomEquipment[];
	staffId: string;
	onSubmit: (report: EquipmentReport) => void;
	onClose: () => void;
}

// Stock level selector
const StockLevelSelector = ({
	currentLevel,
	onChange,
}: {
	currentLevel: StockLevel;
	onChange: (level: StockLevel) => void;
}) => {
	const levels: { value: StockLevel; label: string; color: string }[] = [
		{ value: "full", label: "十分", color: "var(--aotake)" },
		{ value: "half", label: "半分", color: "var(--ai)" },
		{ value: "low", label: "少", color: "var(--kincha)" },
		{ value: "empty", label: "無", color: "var(--shu)" },
	];

	return (
		<div className="flex gap-1">
			{levels.map(({ value, label, color }) => {
				const isSelected = currentLevel === value;
				return (
					<button
						key={value}
						onClick={() => onChange(value)}
						className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
							isSelected
								? "text-white"
								: "bg-[var(--nezumi)]/10 text-[var(--nezumi)]"
						}`}
						style={isSelected ? { backgroundColor: color } : undefined}
					>
						{label}
					</button>
				);
			})}
		</div>
	);
};

// Equipment status selector
const EquipmentStatusSelector = ({
	currentStatus,
	onChange,
}: {
	currentStatus: EquipmentStatusType;
	onChange: (status: EquipmentStatusType) => void;
}) => {
	const statuses: {
		value: EquipmentStatusType;
		label: string;
		icon: React.ReactNode;
		color: string;
	}[] = [
		{
			value: "working",
			label: "正常",
			icon: <CheckIcon size={14} />,
			color: "var(--aotake)",
		},
		{
			value: "needs_maintenance",
			label: "要点検",
			icon: <WrenchIcon size={14} />,
			color: "var(--kincha)",
		},
		{
			value: "broken",
			label: "故障",
			icon: <AlertIcon size={14} />,
			color: "var(--shu)",
		},
	];

	return (
		<div className="flex gap-1">
			{statuses.map(({ value, label, icon, color }) => {
				const isSelected = currentStatus === value;
				return (
					<button
						key={value}
						onClick={() => onChange(value)}
						className={`flex-1 py-2 px-2 rounded flex items-center justify-center gap-1 text-xs font-medium transition-colors ${
							isSelected
								? "text-white"
								: "bg-[var(--nezumi)]/10 text-[var(--nezumi)]"
						}`}
						style={isSelected ? { backgroundColor: color } : undefined}
					>
						{icon}
						<span>{label}</span>
					</button>
				);
			})}
		</div>
	);
};

export const EquipmentReportModal = ({
	roomNumber,
	amenities,
	equipment,
	staffId,
	onSubmit,
	onClose,
}: EquipmentReportModalProps) => {
	// 現在の状態をコピーして編集用stateを作成
	const [amenityStates, setAmenityStates] = useState<
		Record<string, StockLevel>
	>(() => Object.fromEntries(amenities.map((a) => [a.id, a.stockLevel])));

	const [equipmentStates, setEquipmentStates] = useState<
		Record<string, { status: EquipmentStatusType; notes: string }>
	>(() =>
		Object.fromEntries(
			equipment.map((e) => [e.id, { status: e.status, notes: e.notes || "" }]),
		),
	);

	const [generalNotes, setGeneralNotes] = useState("");

	const handleSubmit = () => {
		const amenityUpdates: AmenityUpdate[] = amenities
			.filter((a) => amenityStates[a.id] !== a.stockLevel)
			.map((a) => ({
				amenityId: a.id,
				type: a.type,
				previousLevel: a.stockLevel,
				newLevel: amenityStates[a.id],
			}));

		const equipmentUpdates: EquipmentUpdate[] = equipment
			.filter((e) => equipmentStates[e.id]?.status !== e.status)
			.map((e) => ({
				equipmentId: e.id,
				type: e.type,
				previousStatus: e.status,
				newStatus: equipmentStates[e.id].status,
				notes: equipmentStates[e.id].notes || undefined,
			}));

		const report: EquipmentReport = {
			inspectedAt: new Date().toISOString(),
			inspectedBy: staffId,
			amenityUpdates,
			equipmentUpdates,
		};

		onSubmit(report);
	};

	const handleNoChanges = () => {
		const report: EquipmentReport = {
			inspectedAt: new Date().toISOString(),
			inspectedBy: staffId,
			amenityUpdates: [],
			equipmentUpdates: [],
		};
		onSubmit(report);
	};

	return (
		<div
			className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center sm:items-center"
			onClick={onClose}
		>
			<div
				className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col animate-slide-up"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b border-[var(--shironeri-warm)]">
					<div>
						<h2 className="text-lg font-display font-bold text-[var(--sumi)]">
							設備・アメニティ確認
						</h2>
						<p className="text-sm text-[var(--nezumi)]">{roomNumber}号室</p>
					</div>
					<button
						onClick={onClose}
						className="p-2 rounded-full hover:bg-[var(--shironeri-warm)]"
					>
						<CloseIcon size={20} />
					</button>
				</div>

				{/* Content */}
				<div className="flex-1 overflow-y-auto p-4 space-y-6">
					{/* Amenities section */}
					<div>
						<h3 className="text-sm font-medium text-[var(--sumi)] mb-3">
							アメニティ
						</h3>
						<div className="space-y-3">
							{amenities.map((amenity) => (
								<div
									key={amenity.id}
									className="flex items-center justify-between p-3 bg-[var(--shironeri-warm)] rounded-lg"
								>
									<span className="text-sm text-[var(--sumi)]">
										{AMENITY_TYPE_LABELS[amenity.type]}
									</span>
									<StockLevelSelector
										currentLevel={amenityStates[amenity.id]}
										onChange={(level) =>
											setAmenityStates((prev) => ({
												...prev,
												[amenity.id]: level,
											}))
										}
									/>
								</div>
							))}
						</div>
					</div>

					{/* Equipment section */}
					<div>
						<h3 className="text-sm font-medium text-[var(--sumi)] mb-3">
							設備
						</h3>
						<div className="space-y-3">
							{equipment.map((eq) => (
								<div
									key={eq.id}
									className="p-3 bg-[var(--shironeri-warm)] rounded-lg space-y-2"
								>
									<div className="flex items-center justify-between">
										<span className="text-sm text-[var(--sumi)]">
											{EQUIPMENT_TYPE_LABELS[eq.type]}
										</span>
									</div>
									<EquipmentStatusSelector
										currentStatus={equipmentStates[eq.id]?.status || eq.status}
										onChange={(status) =>
											setEquipmentStates((prev) => ({
												...prev,
												[eq.id]: { ...prev[eq.id], status },
											}))
										}
									/>
									{equipmentStates[eq.id]?.status !== "working" && (
										<input
											type="text"
											placeholder="問題の詳細..."
											value={equipmentStates[eq.id]?.notes || ""}
											onChange={(e) =>
												setEquipmentStates((prev) => ({
													...prev,
													[eq.id]: { ...prev[eq.id], notes: e.target.value },
												}))
											}
											className="w-full p-2 text-sm border border-[var(--nezumi)]/30 rounded"
										/>
									)}
								</div>
							))}
						</div>
					</div>

					{/* General notes */}
					<div>
						<h3 className="text-sm font-medium text-[var(--sumi)] mb-2">
							メモ（任意）
						</h3>
						<textarea
							value={generalNotes}
							onChange={(e) => setGeneralNotes(e.target.value)}
							placeholder="その他気づいた点..."
							className="w-full p-3 border border-[var(--nezumi)]/30 rounded-lg text-sm resize-none"
							rows={2}
						/>
					</div>
				</div>

				{/* Footer */}
				<div className="p-4 border-t border-[var(--shironeri-warm)] flex gap-3">
					<button
						onClick={handleNoChanges}
						className="flex-1 py-3 bg-[var(--nezumi)]/20 text-[var(--sumi)] rounded-lg font-medium"
					>
						変更なし
					</button>
					<button
						onClick={handleSubmit}
						className="flex-1 py-3 bg-[var(--kincha)] text-white rounded-lg font-medium"
					>
						報告
					</button>
				</div>
			</div>
		</div>
	);
};
