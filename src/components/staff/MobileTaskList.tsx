import { useState } from "react";
import { mockTasks, mockStaff, getReservationById } from "../../data/mockData";
import { type Task, type TaskStatus } from "../../types";
import {
	TaskIcon,
	CheckIcon,
	RoomIcon,
	CelebrationIcon,
	ChevronRightIcon,
	AlertIcon,
} from "../ui/Icons";

// Simulating current logged-in staff (using first staff for demo)
const CURRENT_STAFF = mockStaff[0];

// Status tab component
interface StatusTabsProps {
	selected: TaskStatus | "all";
	onChange: (status: TaskStatus | "all") => void;
	counts: Record<TaskStatus | "all", number>;
}

const StatusTabs = ({ selected, onChange, counts }: StatusTabsProps) => {
	const tabs: { key: TaskStatus | "all"; label: string }[] = [
		{ key: "all", label: "すべて" },
		{ key: "pending", label: "未着手" },
		{ key: "in_progress", label: "作業中" },
		{ key: "completed", label: "完了" },
	];

	return (
		<div className="flex gap-1 p-1 bg-[var(--shironeri-warm)] rounded-lg overflow-x-auto">
			{tabs.map((tab) => (
				<button
					key={tab.key}
					onClick={() => onChange(tab.key)}
					className={`flex-1 min-w-0 px-3 py-2.5 text-sm font-display rounded-md transition-all whitespace-nowrap ${
						selected === tab.key
							? "bg-white text-[var(--sumi)] shadow-sm"
							: "text-[var(--nezumi)] hover:text-[var(--sumi)]"
					}`}
				>
					{tab.label}
					<span
						className={`ml-1.5 text-xs ${
							selected === tab.key ? "text-[var(--ai)]" : "text-[var(--nezumi-light)]"
						}`}
					>
						{counts[tab.key]}
					</span>
				</button>
			))}
		</div>
	);
};

// Task Card Component (Mobile optimized)
interface TaskCardProps {
	task: Task;
	onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

const TaskCard = ({ task, onStatusChange }: TaskCardProps) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const reservation = getReservationById(task.reservationId);

	const statusColors: Record<TaskStatus, string> = {
		pending: "border-l-[var(--nezumi-light)]",
		in_progress: "border-l-[var(--ai)]",
		completed: "border-l-[var(--aotake)]",
	};

	const handleStatusChange = (newStatus: TaskStatus) => {
		onStatusChange(task.id, newStatus);
	};

	return (
		<div
			className={`shoji-panel border-l-4 ${statusColors[task.status]} overflow-hidden animate-slide-up`}
		>
			{/* Main Content - Tappable */}
			<div
				className="p-4 cursor-pointer active:bg-[var(--shironeri-warm)]"
				onClick={() => setIsExpanded(!isExpanded)}
			>
				<div className="flex items-start justify-between gap-3">
					<div className="flex-1 min-w-0">
						{/* Time and Priority */}
						<div className="flex items-center gap-2 mb-1">
							<span className="text-lg font-display font-semibold text-[var(--ai)]">
								{task.scheduledTime}
							</span>
							{task.priority === "urgent" && (
								<span className="badge badge-urgent">
									<AlertIcon size={12} />
									緊急
								</span>
							)}
							{task.priority === "high" && <span className="badge badge-anniversary">優先</span>}
							{task.isAnniversaryRelated && (
								<CelebrationIcon size={16} className="text-[var(--kincha)]" />
							)}
						</div>

						{/* Task Title */}
						<h3 className="font-medium text-[var(--sumi)] leading-tight">{task.title}</h3>

						{/* Meta Info */}
						<div className="flex items-center gap-2 mt-2 text-sm text-[var(--nezumi)]">
							<div className="flex items-center gap-1">
								<RoomIcon size={14} />
								<span>{task.roomNumber}号室</span>
							</div>
							<span>・</span>
							<span>{task.estimatedDuration}分</span>
						</div>
					</div>

					{/* Expand Arrow */}
					<ChevronRightIcon
						size={20}
						className={`text-[var(--nezumi-light)] transition-transform ${
							isExpanded ? "rotate-90" : ""
						}`}
					/>
				</div>
			</div>

			{/* Expanded Content */}
			{isExpanded && (
				<div className="px-4 pb-4 pt-0 border-t border-[rgba(45,41,38,0.06)] mt-0 animate-fade-in">
					{/* Description */}
					{task.description && (
						<div className="py-3 border-b border-[rgba(45,41,38,0.04)]">
							<p className="text-sm text-[var(--sumi-light)]">{task.description}</p>
						</div>
					)}

					{/* Guest Info */}
					{reservation && (
						<div className="py-3 border-b border-[rgba(45,41,38,0.04)]">
							<p className="text-xs text-[var(--nezumi)] mb-1">ゲスト情報</p>
							<p className="text-sm font-medium">{reservation.guestName}</p>
							{reservation.anniversary && (
								<div className="mt-2 p-2 bg-[rgba(184,134,11,0.05)] rounded text-sm">
									<p className="text-[var(--kincha)] font-medium">
										{reservation.anniversary.type === "birthday" ? "誕生日" : "結婚記念日"}
									</p>
									<p className="text-[var(--sumi-light)] text-xs mt-0.5">
										{reservation.anniversary.description}
									</p>
								</div>
							)}
							{reservation.specialRequests.length > 0 && (
								<div className="mt-2">
									<p className="text-xs text-[var(--nezumi)] mb-1">特記事項</p>
									<div className="flex flex-wrap gap-1">
										{reservation.specialRequests.map((req, idx) => (
											<span
												key={idx}
												className="text-xs px-2 py-1 bg-[var(--shironeri-warm)] rounded"
											>
												{req}
											</span>
										))}
									</div>
								</div>
							)}
						</div>
					)}

					{/* Action Buttons */}
					<div className="pt-4 space-y-2">
						{task.status === "pending" && (
							<button
								onClick={() => handleStatusChange("in_progress")}
								className="w-full btn btn-primary py-3 text-base"
							>
								<TaskIcon size={18} />
								作業を開始する
							</button>
						)}
						{task.status === "in_progress" && (
							<>
								<button
									onClick={() => handleStatusChange("completed")}
									className="w-full py-3 text-base rounded bg-[var(--aotake)] text-white font-display font-medium flex items-center justify-center gap-2"
								>
									<CheckIcon size={18} />
									完了にする
								</button>
								<button
									onClick={() => handleStatusChange("pending")}
									className="w-full btn btn-secondary py-3 text-base"
								>
									作業を中断する
								</button>
							</>
						)}
						{task.status === "completed" && (
							<div className="flex items-center justify-center gap-2 py-3 text-[var(--aotake)]">
								<CheckIcon size={18} />
								<span className="font-display">完了済み</span>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

// Progress Summary Component
const ProgressSummary = ({ tasks }: { tasks: Task[] }) => {
	const completed = tasks.filter((t) => t.status === "completed").length;
	const total = tasks.length;
	const percentage = total > 0 ? (completed / total) * 100 : 0;

	return (
		<div className="shoji-panel p-4">
			<div className="flex items-center justify-between mb-3">
				<span className="text-sm text-[var(--nezumi)]">本日の進捗</span>
				<span className="font-display font-semibold text-[var(--sumi)]">
					{completed}/{total}件完了
				</span>
			</div>
			<div className="h-2 bg-[var(--shironeri-warm)] rounded-full overflow-hidden">
				<div
					className="h-full bg-[var(--aotake)] rounded-full transition-all duration-500"
					style={{ width: `${percentage}%` }}
				/>
			</div>
		</div>
	);
};

// Current Task Highlight Component
const CurrentTaskHighlight = ({
	task,
	onStatusChange,
}: {
	task: Task | null;
	onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}) => {
	if (!task) return null;

	return (
		<div className="shoji-panel p-4 bg-[rgba(27,73,101,0.03)] border-l-4 border-l-[var(--ai)]">
			<div className="flex items-center gap-2 mb-2">
				<div className="w-2 h-2 bg-[var(--ai)] rounded-full animate-pulse" />
				<span className="text-sm font-display text-[var(--ai)]">現在作業中</span>
			</div>
			<h3 className="font-medium text-[var(--sumi)] mb-1">{task.title}</h3>
			<p className="text-sm text-[var(--nezumi)]">
				{task.roomNumber}号室 ・ {task.estimatedDuration}分
			</p>
			<button
				onClick={() => onStatusChange(task.id, "completed")}
				className="mt-3 w-full py-2.5 rounded bg-[var(--aotake)] text-white font-display font-medium flex items-center justify-center gap-2"
			>
				<CheckIcon size={16} />
				完了にする
			</button>
		</div>
	);
};

// Main Mobile Task List Component
export const MobileTaskList = () => {
	const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");

	// Get tasks for current staff
	const myTasks = mockTasks.filter((t) => t.assignedStaffId === CURRENT_STAFF.id);

	// Sort tasks: in_progress first, then pending by time, then completed
	const sortedTasks = [...myTasks].sort((a, b) => {
		const statusOrder = { in_progress: 0, pending: 1, completed: 2 };
		if (statusOrder[a.status] !== statusOrder[b.status]) {
			return statusOrder[a.status] - statusOrder[b.status];
		}
		return a.scheduledTime.localeCompare(b.scheduledTime);
	});

	const filteredTasks =
		statusFilter === "all" ? sortedTasks : sortedTasks.filter((t) => t.status === statusFilter);

	const currentTask = myTasks.find((t) => t.status === "in_progress");

	const counts: Record<TaskStatus | "all", number> = {
		all: myTasks.length,
		pending: myTasks.filter((t) => t.status === "pending").length,
		in_progress: myTasks.filter((t) => t.status === "in_progress").length,
		completed: myTasks.filter((t) => t.status === "completed").length,
	};

	const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
		console.log("Changing task", taskId, "to", newStatus);
		// In real app, this would update state/backend
	};

	const currentTime = new Date().toLocaleTimeString("ja-JP", {
		hour: "2-digit",
		minute: "2-digit",
	});

	return (
		<div className="min-h-screen bg-[var(--shironeri)] pb-20">
			{/* Header */}
			<div className="sticky top-0 z-10 bg-[var(--shironeri)] border-b border-[rgba(45,41,38,0.06)]">
				<div className="p-4">
					<div className="flex items-center justify-between mb-4">
						<div>
							<p className="text-sm text-[var(--nezumi)]">こんにちは</p>
							<h1 className="text-xl font-display font-semibold text-[var(--sumi)]">
								{CURRENT_STAFF.name}さん
							</h1>
						</div>
						<div className="text-right">
							<p className="text-2xl font-display text-[var(--ai)]">{currentTime}</p>
						</div>
					</div>
					<StatusTabs selected={statusFilter} onChange={setStatusFilter} counts={counts} />
				</div>
			</div>

			{/* Content */}
			<div className="p-4 space-y-4">
				{/* Progress Summary */}
				<ProgressSummary tasks={myTasks} />

				{/* Current Task Highlight */}
				{statusFilter !== "completed" && (
					<CurrentTaskHighlight task={currentTask || null} onStatusChange={handleStatusChange} />
				)}

				{/* Task List */}
				<div className="space-y-3">
					{filteredTasks
						.filter((t) => t.id !== currentTask?.id || statusFilter !== "all")
						.map((task, index) => (
							<div key={task.id} className={`stagger-${(index % 5) + 1}`}>
								<TaskCard task={task} onStatusChange={handleStatusChange} />
							</div>
						))}

					{filteredTasks.length === 0 && (
						<div className="shoji-panel p-8 text-center">
							<TaskIcon size={48} className="mx-auto text-[var(--nezumi-light)] mb-4" />
							<p className="text-[var(--nezumi)]">
								{statusFilter === "completed"
									? "完了したタスクはありません"
									: statusFilter === "pending"
										? "未着手のタスクはありません"
										: statusFilter === "in_progress"
											? "作業中のタスクはありません"
											: "割り当てられたタスクはありません"}
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
