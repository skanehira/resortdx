import { useState, useEffect } from "react";
import type {
	UnifiedTask,
	CleaningChecklistItem,
	CleaningChecklistItemType,
	UnifiedTaskStatus,
} from "../../../types";
import { CLEANING_CHECKLIST_LABELS } from "../../../types";
import {
	CheckIcon,
	InspectionIcon,
	PlayIcon,
	CheckCircleIcon,
	EquipmentIcon,
	ChevronRightIcon,
} from "../../ui/Icons";
import { TaskCardBase } from "./TaskCardBase";

// Step Flow Component for Cleaning Tasks
interface CleaningTaskFlowProps {
	status: UnifiedTaskStatus;
	allChecked: boolean;
}

const CleaningTaskFlow = ({ status, allChecked }: CleaningTaskFlowProps) => {
	const currentStep =
		status === "pending"
			? 1
			: status === "in_progress" && !allChecked
				? 2
				: status === "in_progress" && allChecked
					? 3
					: 0;

	const steps = [
		{ label: "開始", key: "start" },
		{ label: "チェック", key: "check" },
		{ label: "完了", key: "complete" },
	];

	const getStepClass = (index: number) => {
		const stepNum = index + 1;
		if (stepNum < currentStep) return "task-step--completed";
		if (stepNum === currentStep) return "task-step--current";
		return "task-step--pending";
	};

	return (
		<div className="flex items-center p-3 bg-[var(--shironeri-warm)] rounded-lg mb-4">
			{steps.map((step, index) => (
				<>
					<div key={step.key} className="flex flex-col items-center">
						<div className={`task-step ${getStepClass(index)}`}>
							{index + 1 < currentStep ? <CheckIcon size={14} /> : index + 1}
						</div>
						<span
							className={`text-xs mt-1 ${
								index + 1 <= currentStep
									? "text-[var(--sumi)]"
									: "text-[var(--nezumi-light)]"
							}`}
						>
							{step.label}
						</span>
					</div>
					{index < steps.length - 1 && (
						<div
							className={`task-step-line ${
								index + 1 < currentStep ? "task-step-line--active" : ""
							}`}
						/>
					)}
				</>
			))}
		</div>
	);
};

// Step Flow Component for Inspection Tasks
interface InspectionFlowProps {
	status: UnifiedTaskStatus;
}

const InspectionFlow = ({ status }: InspectionFlowProps) => {
	const currentIndex =
		status === "pending" ? 0 : status === "in_progress" ? 1 : 2;

	const steps = [
		{ key: "start", label: "開始" },
		{ key: "inspect", label: "確認" },
		{ key: "report", label: "報告" },
	];

	return (
		<div className="flex items-center p-3 bg-[var(--shironeri-warm)] rounded-lg mb-3">
			{steps.map((step, index) => (
				<>
					<div key={step.key} className="flex flex-col items-center">
						<div
							className={`task-step ${
								index < currentIndex
									? "task-step--completed"
									: index === currentIndex
										? "task-step--current"
										: "task-step--pending"
							}`}
						>
							{index < currentIndex ? <CheckIcon size={14} /> : index + 1}
						</div>
						<span
							className={`text-xs mt-1 ${
								index <= currentIndex
									? "text-[var(--sumi)]"
									: "text-[var(--nezumi-light)]"
							}`}
						>
							{step.label}
						</span>
					</div>
					{index < steps.length - 1 && (
						<div
							className={`task-step-line ${
								index < currentIndex ? "task-step-line--active" : ""
							}`}
						/>
					)}
				</>
			))}
		</div>
	);
};

// Cleaning Checklist Component
interface CleaningChecklistProps {
	items: CleaningChecklistItem[];
	onToggleItem: (item: CleaningChecklistItemType) => void;
	disabled?: boolean;
}

const CleaningChecklist = ({
	items,
	onToggleItem,
	disabled = false,
}: CleaningChecklistProps) => {
	const checkedCount = items.filter((i) => i.isChecked).length;
	const totalCount = items.length;

	return (
		<div className="space-y-2">
			{/* Progress */}
			<div className="flex items-center justify-between text-xs text-[var(--nezumi)] mb-2">
				<span>清掃チェックリスト</span>
				<span>
					{checkedCount}/{totalCount}
				</span>
			</div>
			<div className="h-1.5 bg-[var(--shironeri-warm)] rounded-full overflow-hidden mb-3">
				<div
					className="h-full bg-[var(--aotake)] rounded-full transition-all duration-300"
					style={{
						width: `${totalCount > 0 ? (checkedCount / totalCount) * 100 : 0}%`,
					}}
				/>
			</div>

			{/* Checklist items */}
			<div className="space-y-2">
				{items.map((itemCheck) => (
					<button
						key={itemCheck.item}
						onClick={() => !disabled && onToggleItem(itemCheck.item)}
						disabled={disabled}
						className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
							itemCheck.isChecked
								? "bg-[var(--aotake)]/10"
								: "bg-[var(--shironeri-warm)]"
						} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
					>
						<div
							className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
								itemCheck.isChecked
									? "bg-[var(--aotake)] text-white"
									: "bg-white border-2 border-[var(--nezumi)]/30"
							}`}
						>
							{itemCheck.isChecked && <CheckIcon size={14} />}
						</div>
						<span
							className={`flex-1 text-left ${
								itemCheck.isChecked
									? "text-[var(--aotake)]"
									: "text-[var(--sumi)]"
							}`}
						>
							{CLEANING_CHECKLIST_LABELS[itemCheck.item]}
						</span>
					</button>
				))}
			</div>
		</div>
	);
};

interface HousekeepingCardProps {
	task: UnifiedTask;
	onStatusChange: (taskId: string, newStatus: UnifiedTask["status"]) => void;
	onToggleCleaningItem?: (
		taskId: string,
		item: CleaningChecklistItemType,
	) => void;
	onRequestEquipmentReport?: (taskId: string, roomNumber: string) => void;
}

export const HousekeepingCard = ({
	task,
	onStatusChange,
	onToggleCleaningItem,
	onRequestEquipmentReport,
}: HousekeepingCardProps) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const housekeeping = task.housekeeping;

	// 完了時にアコーディオンを閉じる
	useEffect(() => {
		if (task.status === "completed") {
			setIsExpanded(false);
		}
	}, [task.status]);

	if (!housekeeping) return null;

	const isInspection = housekeeping.category === "inspection";
	const hasCleaning =
		housekeeping.category === "cleaning" && housekeeping.cleaningChecklist;
	const isTurndown = housekeeping.category === "turndown";
	const isBath = housekeeping.category === "bath";

	const allChecked =
		housekeeping.cleaningChecklist?.every((i) => i.isChecked) ?? false;

	const remainingCount =
		housekeeping.cleaningChecklist?.filter((i) => !i.isChecked).length ?? 0;

	const handleStatusChange = (
		taskId: string,
		newStatus: UnifiedTask["status"],
	) => {
		if (
			isInspection &&
			newStatus === "completed" &&
			task.roomNumber &&
			onRequestEquipmentReport
		) {
			onRequestEquipmentReport(taskId, task.roomNumber);
			return;
		}
		onStatusChange(taskId, newStatus);
	};

	return (
		<TaskCardBase
			task={task}
			onStatusChange={handleStatusChange}
			onExpand={() => setIsExpanded(!isExpanded)}
			isExpanded={isExpanded}
		>
			{/* Cleaning Task UI */}
			{hasCleaning && (
				<div className="space-y-4">
					{/* Step Flow Indicator */}
					<CleaningTaskFlow status={task.status} allChecked={allChecked} />

					{/* State 1: Pending - Show start guidance */}
					{task.status === "pending" && (
						<>
							{/* Disabled checklist preview */}
							{housekeeping.cleaningChecklist && (
								<div className="opacity-60">
									<CleaningChecklist
										items={housekeeping.cleaningChecklist}
										onToggleItem={() => {}}
										disabled={true}
									/>
								</div>
							)}

							{/* Start button */}
							<button
								onClick={() => onStatusChange(task.id, "in_progress")}
								className="w-full py-3 bg-[var(--ai)] text-white rounded-lg font-medium flex items-center justify-center gap-2"
							>
								<PlayIcon size={18} />
								清掃を開始する
							</button>
						</>
					)}

					{/* State 2 & 3: In Progress */}
					{task.status === "in_progress" && housekeeping.cleaningChecklist && (
						<>
							<CleaningChecklist
								items={housekeeping.cleaningChecklist}
								onToggleItem={(item) => onToggleCleaningItem?.(task.id, item)}
								disabled={false}
							/>

							{/* Not all checked - show progress message */}
							{!allChecked && (
								<>
									<div className="text-center py-2 text-sm text-[var(--nezumi)]">
										残り {remainingCount} 項目
									</div>
									<button
										disabled
										className="w-full py-3 bg-[var(--nezumi)]/20 text-[var(--nezumi)] rounded-lg font-medium cursor-not-allowed"
									>
										全項目をチェックすると完了できます
									</button>
								</>
							)}

							{/* All checked - show completion UI */}
							{allChecked && (
								<>
									<div className="p-4 bg-[var(--aotake)]/10 border border-[var(--aotake)]/30 rounded-lg">
										<div className="flex items-center gap-2">
											<CheckCircleIcon
												size={20}
												className="text-[var(--aotake)]"
											/>
											<span className="font-medium text-[var(--aotake)]">
												全項目完了!
											</span>
										</div>
									</div>
									<button
										onClick={() => onStatusChange(task.id, "completed")}
										className="w-full py-3 bg-[var(--aotake)] text-white rounded-lg font-medium animate-pulse-subtle"
									>
										清掃完了を報告
									</button>
									{/* Optional equipment report */}
									{task.roomNumber && onRequestEquipmentReport && (
										<button
											onClick={() =>
												onRequestEquipmentReport(task.id, task.roomNumber!)
											}
											className="w-full py-2 text-sm text-[var(--kincha)] hover:text-[var(--kincha-light)] flex items-center justify-center gap-2"
										>
											<EquipmentIcon size={16} />
											設備・アメニティに問題がある場合はこちら
										</button>
									)}
								</>
							)}
						</>
					)}

					{/* State: Completed */}
					{task.status === "completed" && housekeeping.cleaningChecklist && (
						<CleaningChecklist
							items={housekeeping.cleaningChecklist}
							onToggleItem={() => {}}
							disabled={true}
						/>
					)}
				</div>
			)}

			{/* Inspection Task UI */}
			{isInspection && (
				<div className="space-y-3">
					{/* Step Flow Indicator */}
					<InspectionFlow status={task.status} />

					{/* State 1: Pending - Show start guidance */}
					{task.status === "pending" && (
						<>
							<div className="p-4 bg-[var(--kincha)]/10 border border-[var(--kincha)]/30 rounded-lg">
								<div className="flex items-center gap-2 mb-3">
									<InspectionIcon size={24} className="text-[var(--kincha)]" />
									<div>
										<p className="font-medium text-[var(--sumi)]">点検タスク</p>
										<p className="text-xs text-[var(--nezumi)]">
											清掃品質と設備状態を確認します
										</p>
									</div>
								</div>

								<div className="p-3 bg-white/50 rounded-lg">
									<p className="text-sm text-[var(--sumi)] mb-2">点検の流れ:</p>
									<ol className="text-sm text-[var(--nezumi)] space-y-1 list-decimal list-inside">
										<li>タスクを開始する</li>
										<li>客室の清掃品質を確認</li>
										<li>設備・アメニティの状態を報告</li>
									</ol>
								</div>
							</div>

							<button
								onClick={() => onStatusChange(task.id, "in_progress")}
								className="w-full py-3 bg-[var(--kincha)] text-white rounded-lg font-medium flex items-center justify-center gap-2"
							>
								<PlayIcon size={18} />
								点検を開始する
							</button>
						</>
					)}

					{/* State 2: In Progress */}
					{task.status === "in_progress" && (
						<>
							<div className="p-4 bg-[var(--kincha)]/10 border border-[var(--kincha)]/30 rounded-lg">
								<div className="flex items-center gap-2 mb-2">
									<div className="w-3 h-3 rounded-full bg-[var(--kincha)] animate-pulse" />
									<span className="font-medium text-[var(--kincha)]">
										点検中
									</span>
								</div>
								<p className="text-sm text-[var(--nezumi)]">
									客室の確認が完了したら、下のボタンから報告してください
								</p>
							</div>

							<button
								onClick={() =>
									task.roomNumber &&
									onRequestEquipmentReport?.(task.id, task.roomNumber)
								}
								className="w-full py-4 bg-[var(--kincha)] text-white rounded-lg font-medium flex items-center justify-center gap-3 relative overflow-hidden"
							>
								<div className="absolute inset-0 bg-white/20 -translate-x-full animate-shimmer" />
								<EquipmentIcon size={24} />
								<span className="text-lg">設備・アメニティ報告</span>
								<ChevronRightIcon size={20} />
							</button>

							<button
								onClick={() => onStatusChange(task.id, "completed")}
								className="w-full py-2 text-sm text-[var(--nezumi)] hover:text-[var(--sumi)]"
							>
								問題なしで完了する場合はこちら
							</button>
						</>
					)}

					{/* State 3: Completed */}
					{task.status === "completed" && (
						<div className="p-4 bg-[var(--aotake)]/10 border border-[var(--aotake)]/30 rounded-lg">
							<div className="flex items-center gap-2">
								<CheckCircleIcon size={20} className="text-[var(--aotake)]" />
								<span className="font-medium text-[var(--aotake)]">
									点検完了
								</span>
							</div>
							{housekeeping.equipmentReport && (
								<p className="text-sm text-[var(--nezumi)] mt-2">
									報告時刻:{" "}
									{new Date(
										housekeeping.equipmentReport.inspectedAt,
									).toLocaleTimeString("ja-JP")}
								</p>
							)}
						</div>
					)}
				</div>
			)}

			{/* Turndown Task UI */}
			{isTurndown && (
				<div className="space-y-3">
					<div className="p-3 bg-[var(--ai)]/10 rounded-lg">
						<p className="text-xs text-[var(--nezumi)]">タスク内容</p>
						<p className="font-medium text-[var(--sumi)]">
							ターンダウンサービス
						</p>
						{housekeeping.description && (
							<p className="mt-1 text-sm text-[var(--nezumi)]">
								{housekeeping.description}
							</p>
						)}
					</div>

					{task.status === "pending" && (
						<button
							onClick={() => onStatusChange(task.id, "in_progress")}
							className="w-full py-3 bg-[var(--ai)] text-white rounded-lg font-medium flex items-center justify-center gap-2"
						>
							<PlayIcon size={18} />
							作業を開始する
						</button>
					)}

					{task.status === "in_progress" && (
						<>
							<div className="p-4 bg-[var(--ai)]/10 border border-[var(--ai)]/30 rounded-lg">
								<div className="flex items-center gap-2">
									<div className="w-3 h-3 rounded-full bg-[var(--ai)] animate-pulse" />
									<span className="font-medium text-[var(--ai)]">作業中</span>
								</div>
							</div>
							<button
								onClick={() => onStatusChange(task.id, "completed")}
								className="w-full py-3 bg-[var(--aotake)] text-white rounded-lg font-medium"
							>
								作業完了
							</button>
						</>
					)}

					{task.status === "completed" && (
						<div className="p-4 bg-[var(--aotake)]/10 border border-[var(--aotake)]/30 rounded-lg">
							<div className="flex items-center gap-2">
								<CheckCircleIcon size={20} className="text-[var(--aotake)]" />
								<span className="font-medium text-[var(--aotake)]">完了</span>
							</div>
						</div>
					)}
				</div>
			)}

			{/* Bath Preparation Task UI */}
			{isBath && (
				<div className="space-y-3">
					<div className="p-3 bg-[var(--aotake)]/10 rounded-lg">
						<p className="text-xs text-[var(--nezumi)]">タスク内容</p>
						<p className="font-medium text-[var(--sumi)]">露天風呂準備</p>
						{housekeeping.description && (
							<p className="mt-1 text-sm text-[var(--nezumi)]">
								{housekeeping.description}
							</p>
						)}
					</div>

					{task.status === "pending" && (
						<button
							onClick={() => onStatusChange(task.id, "in_progress")}
							className="w-full py-3 bg-[var(--aotake)] text-white rounded-lg font-medium flex items-center justify-center gap-2"
						>
							<PlayIcon size={18} />
							準備を開始する
						</button>
					)}

					{task.status === "in_progress" && (
						<>
							<div className="p-4 bg-[var(--aotake)]/10 border border-[var(--aotake)]/30 rounded-lg">
								<div className="flex items-center gap-2">
									<div className="w-3 h-3 rounded-full bg-[var(--aotake)] animate-pulse" />
									<span className="font-medium text-[var(--aotake)]">
										準備中
									</span>
								</div>
							</div>
							<button
								onClick={() => onStatusChange(task.id, "completed")}
								className="w-full py-3 bg-[var(--aotake)] text-white rounded-lg font-medium"
							>
								準備完了
							</button>
						</>
					)}

					{task.status === "completed" && (
						<div className="p-4 bg-[var(--aotake)]/10 border border-[var(--aotake)]/30 rounded-lg">
							<div className="flex items-center gap-2">
								<CheckCircleIcon size={20} className="text-[var(--aotake)]" />
								<span className="font-medium text-[var(--aotake)]">完了</span>
							</div>
						</div>
					)}
				</div>
			)}
		</TaskCardBase>
	);
};
