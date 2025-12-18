import { useState, useRef, useEffect } from "react";
import { mockTasks, mockStaff, getReservationById } from "../../data/mockData";
import { TASK_CATEGORY_LABELS, type Task, type TaskStatus } from "../../types";
import {
	TimelineIcon,
	RoomIcon,
	CelebrationIcon,
	CheckIcon,
	AlertIcon,
	ArrowLeftIcon,
	TaskIcon,
	ClockIcon,
} from "../ui/Icons";

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
						task.status === "in_progress"
							? "ring-4 ring-[rgba(27,73,101,0.15)]"
							: ""
					}`}
				>
					{task.status === "completed" && (
						<CheckIcon size={8} className="text-white m-0.5" />
					)}
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
					{task.status === "completed" && (
						<span className="badge badge-completed">完了</span>
					)}
					{task.status === "in_progress" && (
						<span className="badge badge-in-progress">作業中</span>
					)}
				</div>

				{/* Title */}
				<h3
					className={`font-medium leading-tight ${
						task.status === "completed"
							? "text-[var(--nezumi)] line-through"
							: "text-[var(--sumi)]"
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

// Fullscreen Task Detail Component
interface TaskDetailViewProps {
	task: Task;
	onClose: () => void;
	onStatusChange: (newStatus: TaskStatus) => void;
}

const TaskDetailView = ({
	task,
	onClose,
	onStatusChange,
}: TaskDetailViewProps) => {
	const reservation = getReservationById(task.reservationId);

	const statusConfig = {
		pending: { label: "未着手", class: "badge-pending" },
		in_progress: { label: "作業中", class: "badge-in-progress" },
		completed: { label: "完了", class: "badge-completed" },
	};

	const priorityConfig = {
		normal: { label: "通常", class: "text-[var(--nezumi)]" },
		high: { label: "優先", class: "text-[var(--kincha)]" },
		urgent: { label: "緊急", class: "text-[var(--shu)] font-medium" },
	};

	return (
		<div className="fixed inset-0 z-50 bg-[var(--shironeri)] animate-fade-in">
			{/* Header */}
			<div className="sticky top-0 z-10 bg-[var(--shironeri)] border-b border-[rgba(45,41,38,0.06)]">
				<div className="flex items-center justify-between p-4">
					<button
						onClick={onClose}
						className="flex items-center gap-2 text-[var(--ai)] font-display"
					>
						<ArrowLeftIcon size={20} />
						<span>戻る</span>
					</button>
					<span className={`badge ${statusConfig[task.status].class}`}>
						{statusConfig[task.status].label}
					</span>
				</div>
			</div>

			{/* Scrollable Content */}
			<div className="overflow-y-auto h-[calc(100vh-64px-100px)] pb-4">
				<div className="p-4 space-y-6">
					{/* Task Title and Time */}
					<div className="shoji-panel p-5">
						<div className="flex items-start justify-between gap-4">
							<div className="flex-1">
								<div className="flex items-center gap-2 mb-2">
									<span className="text-2xl font-display font-semibold text-[var(--ai)]">
										{task.scheduledTime}
									</span>
									{task.priority === "urgent" && (
										<span className="badge badge-urgent">
											<AlertIcon size={10} />
											緊急
										</span>
									)}
									{task.priority === "high" && (
										<span className="badge badge-anniversary">優先</span>
									)}
								</div>
								<h1 className="text-xl font-display font-semibold text-[var(--sumi)]">
									{task.title}
								</h1>
								{task.isAnniversaryRelated && (
									<div className="flex items-center gap-1 mt-2 text-[var(--kincha)]">
										<CelebrationIcon size={16} />
										<span className="text-sm">記念日関連タスク</span>
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Task Info Grid */}
					<div className="grid grid-cols-2 gap-3">
						<div className="shoji-panel p-4">
							<div className="flex items-center gap-2 text-[var(--nezumi)] mb-2">
								<RoomIcon size={16} />
								<span className="text-xs">部屋番号</span>
							</div>
							<p className="text-lg font-display font-semibold text-[var(--sumi)]">
								{task.roomNumber}号室
							</p>
						</div>
						<div className="shoji-panel p-4">
							<div className="flex items-center gap-2 text-[var(--nezumi)] mb-2">
								<ClockIcon size={16} />
								<span className="text-xs">所要時間</span>
							</div>
							<p className="text-lg font-display font-semibold text-[var(--sumi)]">
								{task.estimatedDuration}分
							</p>
						</div>
						<div className="shoji-panel p-4">
							<div className="flex items-center gap-2 text-[var(--nezumi)] mb-2">
								<TaskIcon size={16} />
								<span className="text-xs">カテゴリ</span>
							</div>
							<p className="text-lg font-display font-semibold text-[var(--sumi)]">
								{TASK_CATEGORY_LABELS[task.category]}
							</p>
						</div>
						<div className="shoji-panel p-4">
							<div className="flex items-center gap-2 text-[var(--nezumi)] mb-2">
								<AlertIcon size={16} />
								<span className="text-xs">優先度</span>
							</div>
							<p
								className={`text-lg font-display font-semibold ${priorityConfig[task.priority].class}`}
							>
								{priorityConfig[task.priority].label}
							</p>
						</div>
					</div>

					{/* Description */}
					{task.description && (
						<div className="shoji-panel p-4">
							<p className="text-sm text-[var(--nezumi)] mb-2">タスク詳細</p>
							<p className="text-[var(--sumi-light)] leading-relaxed">
								{task.description}
							</p>
						</div>
					)}

					{/* Guest Info */}
					{reservation && (
						<div className="shoji-panel p-4">
							<p className="text-sm text-[var(--nezumi)] mb-3">ゲスト情報</p>
							<div className="space-y-3">
								<div className="flex items-center gap-3">
									<div className="w-12 h-12 bg-[var(--ai)] rounded-full flex items-center justify-center text-white font-display font-semibold text-lg">
										{reservation.guestName.charAt(0)}
									</div>
									<div>
										<p className="font-medium text-[var(--sumi)]">
											{reservation.guestName}様
										</p>
										<p className="text-sm text-[var(--nezumi)]">
											{reservation.numberOfGuests}名様
										</p>
									</div>
								</div>

								{reservation.anniversary && (
									<div className="p-4 bg-[rgba(184,134,11,0.08)] rounded-lg border-l-3 border-[var(--kincha)]">
										<div className="flex items-center gap-2 mb-1">
											<CelebrationIcon
												size={18}
												className="text-[var(--kincha)]"
											/>
											<p className="text-[var(--kincha)] font-display font-medium">
												{reservation.anniversary.type === "birthday"
													? "誕生日"
													: "結婚記念日"}
											</p>
										</div>
										<p className="text-sm text-[var(--sumi-light)]">
											{reservation.anniversary.description}
										</p>
										{reservation.anniversary.giftRequested && (
											<p className="text-xs text-[var(--kincha)] mt-2">
												ギフト対応あり
											</p>
										)}
									</div>
								)}

								{reservation.specialRequests.length > 0 && (
									<div>
										<p className="text-xs text-[var(--nezumi)] mb-2">
											特記事項
										</p>
										<div className="flex flex-wrap gap-2">
											{reservation.specialRequests.map((req, idx) => (
												<span
													key={idx}
													className="text-sm px-3 py-1.5 bg-[var(--shironeri-warm)] rounded-full"
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
				</div>
			</div>

			{/* Fixed Bottom Actions */}
			<div className="fixed bottom-0 left-0 right-0 p-4 bg-[var(--shironeri)] border-t border-[rgba(45,41,38,0.06)] safe-area-pb">
				{task.status === "pending" && (
					<button
						onClick={() => onStatusChange("in_progress")}
						className="w-full py-4 text-base rounded-lg bg-[var(--ai)] text-white font-display font-medium flex items-center justify-center gap-2"
					>
						<TaskIcon size={20} />
						作業を開始する
					</button>
				)}
				{task.status === "in_progress" && (
					<div className="space-y-3">
						<button
							onClick={() => onStatusChange("completed")}
							className="w-full py-4 text-base rounded-lg bg-[var(--aotake)] text-white font-display font-medium flex items-center justify-center gap-2"
						>
							<CheckIcon size={20} />
							完了にする
						</button>
						<button
							onClick={() => onStatusChange("pending")}
							className="w-full py-3 text-base rounded-lg bg-white border border-[rgba(45,41,38,0.2)] text-[var(--sumi)] font-display font-medium"
						>
							作業を中断する
						</button>
					</div>
				)}
				{task.status === "completed" && (
					<div className="py-4 text-center text-[var(--aotake)] font-display flex items-center justify-center gap-2">
						<CheckIcon size={20} />
						このタスクは完了済みです
					</div>
				)}
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
				{currentHour.toString().padStart(2, "0")}:
				{currentMinute.toString().padStart(2, "0")}
			</div>
			<div className="flex-1 h-0.5 bg-[var(--shu)]" />
			<div className="w-2 h-2 bg-[var(--shu)] rounded-full" />
		</div>
	);
};

// Main Mobile Schedule Component
export const MobileSchedule = () => {
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [tasks, setTasks] = useState<Task[]>(() =>
		mockTasks.filter((t) => t.assignedStaffId === CURRENT_STAFF.id),
	);
	const timelineRef = useRef<HTMLDivElement>(null);

	// Get tasks for current staff (use local state)
	const myTasks = tasks;

	// Sort tasks by time
	const sortedTasks = [...myTasks].sort((a, b) =>
		a.scheduledTime.localeCompare(b.scheduledTime),
	);

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

	const handleStatusChange = (newStatus: TaskStatus) => {
		if (!selectedTask) return;

		// Update the task in state
		setTasks((prevTasks) =>
			prevTasks.map((task) =>
				task.id === selectedTask.id ? { ...task, status: newStatus } : task,
			),
		);

		// Update the selected task to reflect the change
		setSelectedTask((prev) => (prev ? { ...prev, status: newStatus } : null));
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
							<TimelineIcon
								size={48}
								className="mx-auto text-[var(--nezumi-light)] mb-4"
							/>
							<p className="text-[var(--nezumi)]">本日のタスクはありません</p>
						</div>
					)}
				</div>
			</div>

			{/* Task Detail Fullscreen View */}
			{selectedTask && (
				<TaskDetailView
					task={selectedTask}
					onClose={() => setSelectedTask(null)}
					onStatusChange={handleStatusChange}
				/>
			)}
		</div>
	);
};
