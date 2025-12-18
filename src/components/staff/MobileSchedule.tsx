import { useState, useRef, useEffect } from "react";
import { mockTasks, mockStaff, getReservationById } from "../../data/mockData";
import { TASK_CATEGORY_LABELS, type Task } from "../../types";
import { TimelineIcon, RoomIcon, CelebrationIcon, CheckIcon, AlertIcon } from "../ui/Icons";

// Simulating current logged-in staff
const CURRENT_STAFF = mockStaff[0];

// Timeline Item Component
interface TimelineItemProps {
	task: Task;
	isActive: boolean;
	onClick: () => void;
}

const TimelineItem = ({ task, isActive, onClick }: TimelineItemProps) => {
	const reservation = getReservationById(task.reservationId);

	const statusStyles: Record<string, string> = {
		pending: "bg-[var(--shironeri)] border-[var(--nezumi-light)]",
		in_progress: "bg-[rgba(27,73,101,0.05)] border-[var(--ai)]",
		completed: "bg-[rgba(93,174,139,0.05)] border-[var(--aotake)]",
	};

	const nodeStyles: Record<string, string> = {
		pending: "bg-white border-[var(--nezumi-light)]",
		in_progress: "bg-[var(--ai)] border-[var(--ai)]",
		completed: "bg-[var(--aotake)] border-[var(--aotake)]",
	};

	return (
		<div className="flex gap-4 animate-slide-up">
			{/* Timeline Node */}
			<div className="flex flex-col items-center">
				<div
					className={`w-4 h-4 rounded-full border-2 ${nodeStyles[task.status]} ${
						task.status === "in_progress" ? "ring-4 ring-[rgba(27,73,101,0.15)]" : ""
					}`}
				>
					{task.status === "completed" && <CheckIcon size={8} className="text-white m-0.5" />}
				</div>
				<div className="w-0.5 flex-1 bg-[rgba(45,41,38,0.1)] -mt-0.5" />
			</div>

			{/* Content */}
			<div
				onClick={onClick}
				className={`flex-1 mb-4 p-4 rounded-lg border-l-4 cursor-pointer transition-all active:scale-[0.99] ${statusStyles[task.status]} ${
					isActive ? "ring-2 ring-[var(--ai)]" : ""
				}`}
			>
				{/* Time */}
				<div className="flex items-center gap-2 mb-2">
					<span className="text-lg font-display font-semibold text-[var(--ai)]">
						{task.scheduledTime}
					</span>
					{task.priority === "urgent" && (
						<span className="badge badge-urgent">
							<AlertIcon size={10} />
							緊急
						</span>
					)}
					{task.isAnniversaryRelated && (
						<CelebrationIcon size={14} className="text-[var(--kincha)]" />
					)}
					{task.status === "completed" && <span className="badge badge-completed">完了</span>}
					{task.status === "in_progress" && <span className="badge badge-in-progress">作業中</span>}
				</div>

				{/* Title */}
				<h3
					className={`font-medium leading-tight ${
						task.status === "completed" ? "text-[var(--nezumi)] line-through" : "text-[var(--sumi)]"
					}`}
				>
					{task.title}
				</h3>

				{/* Meta */}
				<div className="flex items-center gap-2 mt-2 text-sm text-[var(--nezumi)]">
					<div className="flex items-center gap-1">
						<RoomIcon size={12} />
						<span>{task.roomNumber}号室</span>
					</div>
					<span>・</span>
					<span>{task.estimatedDuration}分</span>
					<span>・</span>
					<span>{TASK_CATEGORY_LABELS[task.category]}</span>
				</div>

				{/* Guest name if anniversary */}
				{reservation?.anniversary && (
					<div className="mt-2 text-sm text-[var(--kincha)]">
						{reservation.guestName}様 - {reservation.anniversary.description}
					</div>
				)}
			</div>
		</div>
	);
};

// Task Detail Modal Component
interface TaskDetailModalProps {
	task: Task;
	onClose: () => void;
	onStatusChange: (newStatus: Task["status"]) => void;
}

const TaskDetailModal = ({ task, onClose, onStatusChange }: TaskDetailModalProps) => {
	const reservation = getReservationById(task.reservationId);

	return (
		<div
			className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end"
			onClick={onClose}
		>
			<div
				className="w-full bg-[var(--shironeri)] rounded-t-2xl max-h-[80vh] overflow-y-auto animate-slide-up"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Handle bar */}
				<div className="sticky top-0 bg-[var(--shironeri)] pt-3 pb-2 flex justify-center">
					<div className="w-10 h-1 bg-[var(--nezumi-light)] rounded-full" />
				</div>

				{/* Content */}
				<div className="px-5 pb-8">
					{/* Header */}
					<div className="flex items-start justify-between gap-4 mb-4">
						<div>
							<div className="flex items-center gap-2 mb-1">
								<span className="text-2xl font-display font-semibold text-[var(--ai)]">
									{task.scheduledTime}
								</span>
								{task.priority === "urgent" && <span className="badge badge-urgent">緊急</span>}
							</div>
							<h2 className="text-xl font-display font-medium text-[var(--sumi)]">{task.title}</h2>
						</div>
						{task.isAnniversaryRelated && (
							<div className="p-2 bg-[rgba(184,134,11,0.1)] rounded-full">
								<CelebrationIcon size={24} className="text-[var(--kincha)]" />
							</div>
						)}
					</div>

					{/* Task Info */}
					<div className="grid grid-cols-2 gap-4 mb-6">
						<div className="shoji-panel p-3">
							<p className="text-xs text-[var(--nezumi)] mb-1">部屋番号</p>
							<p className="font-display font-medium text-[var(--sumi)]">{task.roomNumber}号室</p>
						</div>
						<div className="shoji-panel p-3">
							<p className="text-xs text-[var(--nezumi)] mb-1">所要時間</p>
							<p className="font-display font-medium text-[var(--sumi)]">
								{task.estimatedDuration}分
							</p>
						</div>
					</div>

					{/* Description */}
					{task.description && (
						<div className="mb-6">
							<p className="text-sm text-[var(--nezumi)] mb-2">詳細</p>
							<p className="text-[var(--sumi-light)] p-3 bg-[var(--shironeri-warm)] rounded">
								{task.description}
							</p>
						</div>
					)}

					{/* Guest Info */}
					{reservation && (
						<div className="mb-6">
							<p className="text-sm text-[var(--nezumi)] mb-2">ゲスト情報</p>
							<div className="shoji-panel p-4">
								<p className="font-medium text-[var(--sumi)] mb-2">{reservation.guestName}様</p>
								{reservation.anniversary && (
									<div className="p-3 bg-[rgba(184,134,11,0.05)] rounded mb-3">
										<p className="text-[var(--kincha)] font-medium text-sm">
											{reservation.anniversary.type === "birthday" ? "誕生日" : "結婚記念日"}
										</p>
										<p className="text-xs text-[var(--sumi-light)] mt-0.5">
											{reservation.anniversary.description}
										</p>
									</div>
								)}
								{reservation.specialRequests.length > 0 && (
									<div>
										<p className="text-xs text-[var(--nezumi)] mb-2">特記事項</p>
										<div className="flex flex-wrap gap-2">
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
						</div>
					)}

					{/* Actions */}
					<div className="space-y-3">
						{task.status === "pending" && (
							<button
								onClick={() => onStatusChange("in_progress")}
								className="w-full py-4 text-base rounded-lg bg-[var(--ai)] text-white font-display font-medium flex items-center justify-center gap-2"
							>
								<TimelineIcon size={20} />
								作業を開始する
							</button>
						)}
						{task.status === "in_progress" && (
							<>
								<button
									onClick={() => onStatusChange("completed")}
									className="w-full py-4 text-base rounded-lg bg-[var(--aotake)] text-white font-display font-medium flex items-center justify-center gap-2"
								>
									<CheckIcon size={20} />
									完了にする
								</button>
								<button
									onClick={() => onStatusChange("pending")}
									className="w-full py-4 text-base rounded-lg bg-white border border-[rgba(45,41,38,0.2)] text-[var(--sumi)] font-display font-medium"
								>
									作業を中断する
								</button>
							</>
						)}
						{task.status === "completed" && (
							<div className="py-4 text-center text-[var(--aotake)] font-display flex items-center justify-center gap-2">
								<CheckIcon size={20} />
								このタスクは完了しています
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

// Hour marker component for current time
const CurrentTimeMarker = () => {
	const now = new Date();
	const currentHour = now.getHours();
	const currentMinute = now.getMinutes();

	if (currentHour < 6 || currentHour > 22) return null;

	return (
		<div className="flex items-center gap-2 mb-4">
			<div className="text-sm font-display text-[var(--shu)]">
				{currentHour.toString().padStart(2, "0")}:{currentMinute.toString().padStart(2, "0")}
			</div>
			<div className="flex-1 h-0.5 bg-[var(--shu)]" />
			<div className="w-2 h-2 bg-[var(--shu)] rounded-full" />
		</div>
	);
};

// Main Mobile Schedule Component
export const MobileSchedule = () => {
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const timelineRef = useRef<HTMLDivElement>(null);

	// Get tasks for current staff
	const myTasks = mockTasks.filter((t) => t.assignedStaffId === CURRENT_STAFF.id);

	// Sort tasks by time
	const sortedTasks = [...myTasks].sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));

	// Find current/next task for auto-scroll
	const now = new Date();
	const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
	const currentOrNextTask = sortedTasks.find(
		(t) => t.scheduledTime >= currentTime && t.status !== "completed",
	);

	// Auto scroll to current time on mount
	useEffect(() => {
		const currentHour = now.getHours();
		if (currentHour >= 6 && currentHour <= 22 && timelineRef.current) {
			const hourIndex = currentHour - 6;
			const scrollTarget = hourIndex * 100; // Approximate scroll position
			timelineRef.current.scrollTop = Math.max(0, scrollTarget - 100);
		}
	}, []);

	const handleStatusChange = (newStatus: Task["status"]) => {
		console.log("Changing task", selectedTask?.id, "to", newStatus);
		setSelectedTask(null);
	};

	const completedCount = myTasks.filter((t) => t.status === "completed").length;
	const totalCount = myTasks.length;

	return (
		<div className="min-h-screen bg-[var(--shironeri)]">
			{/* Header */}
			<div className="sticky top-0 z-10 bg-[var(--shironeri)] border-b border-[rgba(45,41,38,0.06)]">
				<div className="p-4">
					<div className="flex items-center justify-between mb-3">
						<div>
							<h1 className="text-xl font-display font-semibold text-[var(--sumi)]">
								本日のスケジュール
							</h1>
							<p className="text-sm text-[var(--nezumi)]">
								{new Date().toLocaleDateString("ja-JP", {
									month: "long",
									day: "numeric",
									weekday: "long",
								})}
							</p>
						</div>
						<div className="text-right">
							<p className="text-2xl font-display text-[var(--ai)]">
								{completedCount}/{totalCount}
							</p>
							<p className="text-xs text-[var(--nezumi)]">完了</p>
						</div>
					</div>

					{/* Progress bar */}
					<div className="h-1.5 bg-[var(--shironeri-warm)] rounded-full overflow-hidden">
						<div
							className="h-full bg-[var(--aotake)] rounded-full transition-all duration-500"
							style={{
								width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%`,
							}}
						/>
					</div>
				</div>
			</div>

			{/* Timeline */}
			<div ref={timelineRef} className="p-4 pb-20">
				{/* Current time marker */}
				<CurrentTimeMarker />

				{/* Tasks Timeline */}
				<div className="relative">
					{sortedTasks.length > 0 ? (
						sortedTasks.map((task) => (
							<TimelineItem
								key={task.id}
								task={task}
								isActive={task.id === currentOrNextTask?.id}
								onClick={() => setSelectedTask(task)}
							/>
						))
					) : (
						<div className="text-center py-12">
							<TimelineIcon size={48} className="mx-auto text-[var(--nezumi-light)] mb-4" />
							<p className="text-[var(--nezumi)]">本日のタスクはありません</p>
						</div>
					)}
				</div>
			</div>

			{/* Task Detail Modal */}
			{selectedTask && (
				<TaskDetailModal
					task={selectedTask}
					onClose={() => setSelectedTask(null)}
					onStatusChange={handleStatusChange}
				/>
			)}
		</div>
	);
};
