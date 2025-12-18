import { useState, useMemo, useRef } from "react";
import type { MealTask, MealStatus, MealOrderNotification } from "../../types";
import {
	MEAL_STATUS_LABELS,
	MEAL_TYPE_LABELS,
	COURSE_TYPE_LABELS,
	DIETARY_RESTRICTION_LABELS,
	ORDER_TYPE_LABELS,
} from "../../types";
import {
	mockMealTasks,
	mockMealOrderNotifications,
	getStaffById,
} from "../../data/mockData";
import {
	DiningIcon,
	ClockIcon,
	CheckIcon,
	ChevronRightIcon,
	AllergyIcon,
	NotificationBadgeIcon,
	CakeIcon,
} from "../ui/Icons";

// Current staff ID (in real app, this would come from auth context)
const CURRENT_STAFF_ID = "STF002"; // 伊藤花子 - 接客スタッフ

// Swipe threshold
const SWIPE_THRESHOLD = 80;

// Filter type
type MealFilter = "all" | "preparing" | "serving" | "completed" | "needs_check";

// Status badge component
const MealStatusBadge = ({
	status,
	needsCheck,
}: {
	status: MealStatus;
	needsCheck?: boolean;
}) => {
	if (needsCheck) {
		return (
			<span className="px-2 py-0.5 text-xs font-medium rounded-full bg-[var(--shu)] text-white">
				再確認要
			</span>
		);
	}

	const colorMap: Record<MealStatus, string> = {
		preparing: "bg-[var(--nezumi)] text-white",
		serving: "bg-[var(--ai)] text-white",
		completed: "bg-[var(--aotake)]/20 text-[var(--aotake)]",
		needs_check: "bg-[var(--shu)] text-white",
	};

	return (
		<span
			className={`px-2 py-0.5 text-xs font-medium rounded-full ${colorMap[status]}`}
		>
			{MEAL_STATUS_LABELS[status]}
		</span>
	);
};

// 4-stage progress indicator
const MealProgressIndicator = ({ status }: { status: MealStatus }) => {
	const stages: MealStatus[] = ["preparing", "serving", "completed"];
	const stageLabels = ["準備中", "配膳中", "完了"];
	const currentIndex =
		status === "needs_check" ? 0 : stages.indexOf(status as MealStatus);

	return (
		<div className="flex items-center gap-1">
			{stages.map((stage, index) => (
				<div key={stage} className="flex items-center">
					<div
						className={`w-3 h-3 rounded-full transition-colors ${
							index <= currentIndex
								? index === currentIndex
									? "bg-[var(--ai)]"
									: "bg-[var(--aotake)]"
								: "bg-[var(--nezumi)]/30"
						}`}
					/>
					{index < stages.length - 1 && (
						<div
							className={`w-5 h-0.5 ${
								index < currentIndex
									? "bg-[var(--aotake)]"
									: "bg-[var(--nezumi)]/30"
							}`}
						/>
					)}
				</div>
			))}
			<span className="ml-2 text-xs text-[var(--nezumi)]">
				{stageLabels[currentIndex] || "準備中"}
			</span>
		</div>
	);
};

// Current meal task highlight
const CurrentMealHighlight = ({
	task,
	onStatusChange,
	onToggleNeedsCheck,
}: {
	task: MealTask;
	onStatusChange: (newStatus: MealStatus) => void;
	onToggleNeedsCheck: () => void;
}) => {
	const getNextStatus = (): MealStatus | null => {
		const flow: Record<MealStatus, MealStatus | null> = {
			preparing: "serving",
			serving: "completed",
			completed: null,
			needs_check: "serving",
		};
		return flow[task.mealStatus];
	};

	const nextStatus = getNextStatus();

	const buttonLabels: Record<MealStatus, string> = {
		preparing: "配膳開始",
		serving: "配膳完了",
		completed: "",
		needs_check: "配膳開始",
	};

	return (
		<div className="shoji-panel p-4 border-l-3 border-l-[var(--ai)] animate-slide-up">
			<div className="flex items-center justify-between mb-3">
				<div className="flex items-center gap-2">
					<DiningIcon size={20} className="text-[var(--ai)]" />
					<span className="font-display font-semibold text-[var(--ai)]">
						現在対応中
					</span>
				</div>
				{task.isAnniversaryRelated && (
					<span className="flex items-center gap-1 px-2 py-1 bg-[var(--kincha)]/20 text-[var(--kincha)] text-xs rounded-full">
						<CakeIcon size={12} />
						記念日
					</span>
				)}
			</div>

			<div className="mb-3">
				<div className="text-lg font-display font-bold text-[var(--sumi)]">
					{task.roomNumber}号室 {task.guestName}様
					<span className="ml-2 text-sm font-normal text-[var(--nezumi)]">
						{task.guestCount}名
					</span>
				</div>
				<div className="flex items-center gap-2 text-sm text-[var(--nezumi)] mt-1">
					<ClockIcon size={14} />
					<span>{task.scheduledTime}</span>
					<span className="text-[var(--nezumi-light)]">|</span>
					<span>
						{MEAL_TYPE_LABELS[task.mealType]} /{" "}
						{COURSE_TYPE_LABELS[task.courseType]}
					</span>
				</div>
			</div>

			{/* Allergy warning */}
			{task.dietaryRestrictions.length > 0 && (
				<div className="mb-3 p-3 bg-[var(--shu)]/10 rounded-lg border border-[var(--shu)]/30">
					<div className="flex items-center gap-2 text-[var(--shu)] mb-1">
						<AllergyIcon size={16} />
						<span className="font-display font-semibold text-sm">
							アレルギー注意
						</span>
					</div>
					<div className="flex flex-wrap gap-1">
						{task.dietaryRestrictions.map((restriction) => (
							<span
								key={restriction}
								className="px-2 py-0.5 bg-[var(--shu)]/20 text-[var(--shu)] text-xs rounded"
							>
								{DIETARY_RESTRICTION_LABELS[restriction]}
							</span>
						))}
					</div>
					{task.dietaryNotes && (
						<p className="mt-2 text-xs text-[var(--sumi)]">
							{task.dietaryNotes}
						</p>
					)}
				</div>
			)}

			{/* Progress indicator */}
			<div className="relative mb-4 px-2">
				<div className="flex items-center justify-between">
					{["preparing", "serving", "completed"].map((stage, index) => {
						const stages: MealStatus[] = ["preparing", "serving", "completed"];
						const currentIndex =
							task.mealStatus === "needs_check"
								? 0
								: stages.indexOf(task.mealStatus);
						const stageLabels = ["準備中", "配膳中", "完了"];

						return (
							<div
								key={stage}
								className="flex flex-col items-center z-10"
								style={{ flex: 1 }}
							>
								<div
									className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
										index <= currentIndex
											? index === currentIndex
												? "bg-[var(--ai)] ring-4 ring-[var(--ai)]/20"
												: "bg-[var(--aotake)]"
											: "bg-[var(--nezumi)]/20"
									}`}
								>
									{index < currentIndex && (
										<CheckIcon size={14} className="text-white" />
									)}
								</div>
								<span
									className={`text-xs mt-1 ${
										index <= currentIndex
											? index === currentIndex
												? "text-[var(--ai)] font-medium"
												: "text-[var(--aotake)]"
											: "text-[var(--nezumi)]"
									}`}
								>
									{stageLabels[index]}
								</span>
							</div>
						);
					})}
				</div>
				{/* Progress line */}
				<div className="absolute top-3 left-0 right-0 h-0.5 bg-[var(--nezumi)]/20 -z-0 mx-8" />
				<div
					className="absolute top-3 left-0 h-0.5 bg-[var(--aotake)] transition-all -z-0 mx-8"
					style={{
						width: `${
							((task.mealStatus === "needs_check"
								? 0
								: ["preparing", "serving", "completed"].indexOf(
										task.mealStatus,
									)) /
								2) *
							100
						}%`,
					}}
				/>
			</div>

			{/* Needs check toggle */}
			<button
				onClick={onToggleNeedsCheck}
				className={`w-full mb-3 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
					task.needsCheck
						? "bg-[var(--shu)]/10 border-[var(--shu)] text-[var(--shu)]"
						: "bg-[var(--shironeri-warm)] border-[var(--shironeri-warm)] text-[var(--nezumi)]"
				}`}
			>
				{task.needsCheck ? "✓ 再確認要フラグON" : "再確認要にする"}
			</button>

			{/* Status update button */}
			{nextStatus && (
				<button
					onClick={() => onStatusChange(nextStatus)}
					className="w-full py-4 bg-[var(--ai)] text-white rounded-xl font-display font-bold text-lg hover:bg-[var(--ai-deep)] active:scale-[0.98] transition-all shadow-lg"
				>
					{buttonLabels[task.mealStatus]}
				</button>
			)}
		</div>
	);
};

// Order notification card
const OrderNotificationCard = ({
	notification,
	onMarkRead,
}: {
	notification: MealOrderNotification;
	onMarkRead: () => void;
}) => {
	return (
		<div
			className={`p-3 rounded-lg border-l-3 ${
				notification.isRead
					? "bg-[var(--shironeri-warm)] border-l-[var(--nezumi)]/30"
					: "bg-[var(--kincha)]/10 border-l-[var(--kincha)]"
			}`}
		>
			<div className="flex items-start justify-between">
				<div>
					<div className="flex items-center gap-2 mb-1">
						<span className="font-display font-semibold text-[var(--sumi)]">
							{notification.roomNumber}号室
						</span>
						<span className="px-2 py-0.5 text-xs rounded-full bg-[var(--kincha)]/20 text-[var(--kincha)]">
							{ORDER_TYPE_LABELS[notification.orderType]}
						</span>
					</div>
					<p className="text-sm text-[var(--sumi)]">{notification.content}</p>
					<p className="text-xs text-[var(--nezumi)] mt-1">
						{notification.createdAt}
					</p>
				</div>
				{!notification.isRead && (
					<button
						onClick={onMarkRead}
						className="px-2 py-1 text-xs text-[var(--ai)] hover:bg-[var(--ai)]/10 rounded"
					>
						確認
					</button>
				)}
			</div>
		</div>
	);
};

// Meal task card with swipe
const MealTaskCard = ({
	task,
	onStatusChange,
	onToggleNeedsCheck,
	onExpand,
	isExpanded,
}: {
	task: MealTask;
	onStatusChange: (newStatus: MealStatus) => void;
	onToggleNeedsCheck: () => void;
	onExpand: () => void;
	isExpanded: boolean;
}) => {
	const [swipeOffset, setSwipeOffset] = useState(0);
	const [isSwiping, setIsSwiping] = useState(false);
	const touchStartX = useRef(0);
	const touchStartY = useRef(0);
	const isScrolling = useRef(false);

	const getNextStatus = (): MealStatus | null => {
		const flow: Record<MealStatus, MealStatus | null> = {
			preparing: "serving",
			serving: "completed",
			completed: null,
			needs_check: "serving",
		};
		return flow[task.mealStatus];
	};

	const nextStatus = getNextStatus();

	const handleTouchStart = (e: React.TouchEvent) => {
		touchStartX.current = e.touches[0].clientX;
		touchStartY.current = e.touches[0].clientY;
		isScrolling.current = false;
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		const deltaX = e.touches[0].clientX - touchStartX.current;
		const deltaY = e.touches[0].clientY - touchStartY.current;

		// Detect if scrolling vertically
		if (!isSwiping && Math.abs(deltaY) > Math.abs(deltaX)) {
			isScrolling.current = true;
			return;
		}

		if (isScrolling.current) return;

		// Only allow left swipe to progress status
		if (deltaX < 0 && nextStatus && task.mealStatus !== "completed") {
			setIsSwiping(true);
			setSwipeOffset(Math.max(deltaX, -120));
		}
	};

	const handleTouchEnd = () => {
		if (swipeOffset < -SWIPE_THRESHOLD && nextStatus) {
			onStatusChange(nextStatus);
		}
		setSwipeOffset(0);
		setIsSwiping(false);
	};

	const buttonLabels: Record<MealStatus, string> = {
		preparing: "配膳開始",
		serving: "完了",
		completed: "",
		needs_check: "配膳開始",
	};

	return (
		<div className="relative overflow-hidden rounded-xl">
			{/* Swipe action background */}
			{task.mealStatus !== "completed" && nextStatus && (
				<div
					className={`absolute inset-y-0 right-0 flex items-center justify-end px-4 bg-[var(--aotake)] transition-opacity ${
						Math.abs(swipeOffset) > 30 ? "opacity-100" : "opacity-0"
					}`}
					style={{ width: "120px" }}
				>
					<span className="text-white font-medium">
						{buttonLabels[task.mealStatus]}
					</span>
				</div>
			)}

			{/* Card content */}
			<div
				className={`shoji-panel border-l-3 transition-transform ${
					task.mealStatus === "completed"
						? "border-l-[var(--aotake)] opacity-60"
						: task.needsCheck
							? "border-l-[var(--shu)]"
							: "border-l-[var(--nezumi)]"
				}`}
				style={{
					transform: `translateX(${swipeOffset}px)`,
					transition: isSwiping ? "none" : "transform 0.3s ease-out",
				}}
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
			>
				<button onClick={onExpand} className="w-full text-left p-4">
					<div className="flex items-start justify-between mb-2">
						<div className="flex items-center gap-2">
							<ClockIcon size={14} className="text-[var(--ai)]" />
							<span className="font-display font-semibold text-[var(--ai)]">
								{task.scheduledTime}
							</span>
							<MealStatusBadge
								status={task.mealStatus}
								needsCheck={task.needsCheck}
							/>
							{task.isAnniversaryRelated && (
								<span className="text-[var(--kincha)]">
									<CakeIcon size={14} />
								</span>
							)}
						</div>
						<ChevronRightIcon
							size={18}
							className={`text-[var(--nezumi)] transition-transform ${
								isExpanded ? "rotate-90" : ""
							}`}
						/>
					</div>

					<div className="mb-2">
						<span className="font-display font-medium text-[var(--sumi)]">
							{task.roomNumber}号室 {task.guestName}様
						</span>
						<span className="ml-2 text-sm text-[var(--nezumi)]">
							{task.guestCount}名
						</span>
					</div>

					<div className="flex items-center gap-2 text-sm text-[var(--nezumi)]">
						<span>{MEAL_TYPE_LABELS[task.mealType]}</span>
						<span className="text-[var(--nezumi-light)]">/</span>
						<span>{COURSE_TYPE_LABELS[task.courseType]}</span>
						{task.dietaryRestrictions.length > 0 && (
							<span className="flex items-center gap-1 text-[var(--shu)]">
								<AllergyIcon size={14} />
								{task.dietaryRestrictions.length}件
							</span>
						)}
					</div>

					{/* Expanded content */}
					{isExpanded && (
						<div className="mt-4 pt-4 border-t border-[var(--shironeri-warm)] space-y-3 animate-slide-up">
							{/* Progress */}
							<div>
								<div className="text-xs text-[var(--nezumi)] mb-2">
									ステータス
								</div>
								<MealProgressIndicator status={task.mealStatus} />
							</div>

							{/* Allergies */}
							{task.dietaryRestrictions.length > 0 && (
								<div className="p-3 bg-[var(--shu)]/10 rounded-lg">
									<div className="flex items-center gap-1 text-[var(--shu)] text-sm mb-1">
										<AllergyIcon size={14} />
										<span className="font-medium">アレルギー</span>
									</div>
									<div className="flex flex-wrap gap-1">
										{task.dietaryRestrictions.map((r) => (
											<span
												key={r}
												className="px-2 py-0.5 bg-[var(--shu)]/20 text-[var(--shu)] text-xs rounded"
											>
												{DIETARY_RESTRICTION_LABELS[r]}
											</span>
										))}
									</div>
									{task.dietaryNotes && (
										<p className="mt-1 text-xs text-[var(--sumi)]">
											{task.dietaryNotes}
										</p>
									)}
								</div>
							)}

							{/* Notes */}
							{task.notes && (
								<div className="p-3 bg-[var(--shironeri-warm)] rounded-lg text-sm text-[var(--sumi)]">
									{task.notes}
								</div>
							)}

							{/* Needs check toggle */}
							<button
								onClick={(e) => {
									e.stopPropagation();
									onToggleNeedsCheck();
								}}
								className={`w-full py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
									task.needsCheck
										? "bg-[var(--shu)]/10 border-[var(--shu)] text-[var(--shu)]"
										: "bg-[var(--shironeri-warm)] border-[var(--shironeri-warm)] text-[var(--nezumi)]"
								}`}
							>
								{task.needsCheck ? "✓ 再確認要フラグON" : "再確認要にする"}
							</button>

							{/* Action button */}
							{nextStatus && (
								<button
									onClick={(e) => {
										e.stopPropagation();
										onStatusChange(nextStatus);
									}}
									className="w-full py-3 bg-[var(--ai)] text-white rounded-lg font-display font-medium"
								>
									{buttonLabels[task.mealStatus]}にする
								</button>
							)}
						</div>
					)}
				</button>
			</div>
		</div>
	);
};

// Filter tabs
const FilterTabs = ({
	activeFilter,
	onFilterChange,
	counts,
}: {
	activeFilter: MealFilter;
	onFilterChange: (filter: MealFilter) => void;
	counts: Record<MealFilter, number>;
}) => {
	const filters: { key: MealFilter; label: string }[] = [
		{ key: "all", label: "すべて" },
		{ key: "preparing", label: "準備中" },
		{ key: "serving", label: "配膳中" },
		{ key: "completed", label: "完了" },
		{ key: "needs_check", label: "再確認" },
	];

	return (
		<div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
			{filters.map((filter) => (
				<button
					key={filter.key}
					onClick={() => onFilterChange(filter.key)}
					className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
						activeFilter === filter.key
							? "bg-[var(--ai)] text-white"
							: "bg-[var(--shironeri-warm)] text-[var(--nezumi)]"
					}`}
				>
					{filter.label}
					{counts[filter.key] > 0 && (
						<span className="ml-1">({counts[filter.key]})</span>
					)}
				</button>
			))}
		</div>
	);
};

// Progress summary
const ProgressSummary = ({
	completed,
	total,
}: {
	completed: number;
	total: number;
}) => {
	const percentage = total > 0 ? (completed / total) * 100 : 0;

	return (
		<div className="shoji-panel p-4">
			<div className="flex items-center justify-between mb-2">
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

// Main component
export const MobileMealList = () => {
	const [mealTasks, setMealTasks] = useState<MealTask[]>(() =>
		mockMealTasks.filter((t) => t.assignedStaffId === CURRENT_STAFF_ID),
	);
	const [notifications, setNotifications] = useState<MealOrderNotification[]>(
		() => mockMealOrderNotifications,
	);
	const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
	const [activeFilter, setActiveFilter] = useState<MealFilter>("all");
	const [showNotifications, setShowNotifications] = useState(true);

	// Get current staff
	const currentStaff = useMemo(() => {
		return getStaffById(CURRENT_STAFF_ID);
	}, []);

	// Stats
	const stats = useMemo(() => {
		const total = mealTasks.length;
		const completed = mealTasks.filter(
			(t) => t.mealStatus === "completed",
		).length;
		return { total, completed };
	}, [mealTasks]);

	// Filter counts
	const filterCounts = useMemo(() => {
		return {
			all: mealTasks.length,
			preparing: mealTasks.filter((t) => t.mealStatus === "preparing").length,
			serving: mealTasks.filter((t) => t.mealStatus === "serving").length,
			completed: mealTasks.filter((t) => t.mealStatus === "completed").length,
			needs_check: mealTasks.filter((t) => t.needsCheck).length,
		};
	}, [mealTasks]);

	// Unread notification count
	const unreadCount = useMemo(() => {
		return notifications.filter((n) => !n.isRead).length;
	}, [notifications]);

	// Get active task (serving, not completed)
	const activeTask = useMemo(() => {
		return mealTasks.find((t) => t.mealStatus === "serving");
	}, [mealTasks]);

	// Filtered and sorted tasks
	const filteredTasks = useMemo(() => {
		let tasks = [...mealTasks];

		// Apply filter
		if (activeFilter === "needs_check") {
			tasks = tasks.filter((t) => t.needsCheck);
		} else if (activeFilter !== "all") {
			tasks = tasks.filter((t) => t.mealStatus === activeFilter);
		}

		// Sort: active first, then by scheduled time
		return tasks.sort((a, b) => {
			const statusOrder = (status: MealStatus) => {
				if (status === "completed") return 3;
				if (status === "preparing") return 2;
				return 1; // serving
			};
			const orderDiff = statusOrder(a.mealStatus) - statusOrder(b.mealStatus);
			if (orderDiff !== 0) return orderDiff;
			return a.scheduledTime.localeCompare(b.scheduledTime);
		});
	}, [mealTasks, activeFilter]);

	// Other tasks (excluding active)
	const otherTasks = filteredTasks.filter((t) => t.id !== activeTask?.id);

	// Handle status change
	const handleStatusChange = (taskId: string, newStatus: MealStatus) => {
		setMealTasks((prev) =>
			prev.map((t) =>
				t.id === taskId
					? {
							...t,
							mealStatus: newStatus,
							needsCheck: newStatus === "completed" ? false : t.needsCheck,
							completedAt:
								newStatus === "completed"
									? new Date().toLocaleTimeString("ja-JP", {
											hour: "2-digit",
											minute: "2-digit",
										})
									: t.completedAt,
						}
					: t,
			),
		);
	};

	// Handle needs check toggle
	const handleToggleNeedsCheck = (taskId: string) => {
		setMealTasks((prev) =>
			prev.map((t) =>
				t.id === taskId
					? {
							...t,
							needsCheck: !t.needsCheck,
						}
					: t,
			),
		);
	};

	// Handle notification mark as read
	const handleMarkNotificationRead = (notificationId: string) => {
		setNotifications((prev) =>
			prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)),
		);
	};

	return (
		<div className="min-h-screen bg-[var(--shironeri)] pb-20">
			{/* Header */}
			<header className="sticky top-0 z-30 bg-[var(--shironeri)]/80 backdrop-blur-sm border-b border-[var(--shironeri-warm)]">
				<div className="px-4 py-3">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-lg font-display font-bold text-[var(--sumi)]">
								配膳タスク
							</h1>
							<p className="text-xs text-[var(--nezumi)]">
								{new Date().toLocaleDateString("ja-JP", {
									month: "long",
									day: "numeric",
									weekday: "short",
								})}
							</p>
						</div>
						<div className="flex items-center gap-3">
							{/* Notification badge */}
							{unreadCount > 0 && (
								<button
									onClick={() => setShowNotifications(!showNotifications)}
									className="relative p-2 rounded-full bg-[var(--kincha)]/10"
								>
									<NotificationBadgeIcon
										size={20}
										className="text-[var(--kincha)]"
									/>
									<span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--shu)] text-white text-xs rounded-full flex items-center justify-center">
										{unreadCount}
									</span>
								</button>
							)}
							{/* Staff info */}
							{currentStaff && (
								<div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--ai)]/10 rounded-full">
									<span className="text-sm font-medium text-[var(--ai)]">
										{currentStaff.name}
									</span>
								</div>
							)}
						</div>
					</div>
				</div>
			</header>

			<main className="p-4 space-y-4">
				{/* Progress summary */}
				<ProgressSummary completed={stats.completed} total={stats.total} />

				{/* Order notifications */}
				{showNotifications && unreadCount > 0 && (
					<div className="animate-slide-up">
						<div className="flex items-center justify-between mb-2">
							<h2 className="text-sm font-display font-medium text-[var(--kincha)] flex items-center gap-2">
								<NotificationBadgeIcon size={16} />
								新しい注文通知 ({unreadCount}件)
							</h2>
							<button
								onClick={() => setShowNotifications(false)}
								className="text-xs text-[var(--nezumi)]"
							>
								閉じる
							</button>
						</div>
						<div className="space-y-2">
							{notifications
								.filter((n) => !n.isRead)
								.map((notification) => (
									<OrderNotificationCard
										key={notification.id}
										notification={notification}
										onMarkRead={() =>
											handleMarkNotificationRead(notification.id)
										}
									/>
								))}
						</div>
					</div>
				)}

				{/* Filter tabs */}
				<FilterTabs
					activeFilter={activeFilter}
					onFilterChange={setActiveFilter}
					counts={filterCounts}
				/>

				{/* Active task */}
				{activeTask && activeFilter === "all" && (
					<CurrentMealHighlight
						task={activeTask}
						onStatusChange={(newStatus) =>
							handleStatusChange(activeTask.id, newStatus)
						}
						onToggleNeedsCheck={() => handleToggleNeedsCheck(activeTask.id)}
					/>
				)}

				{/* Task list */}
				{otherTasks.length > 0 && (
					<div>
						<h2 className="text-sm font-display font-medium text-[var(--nezumi)] mb-3">
							配膳予定 ({otherTasks.length}件)
						</h2>
						<div className="space-y-3">
							{otherTasks.map((task, index) => (
								<div
									key={task.id}
									className="animate-slide-up"
									style={{ animationDelay: `${index * 50}ms` }}
								>
									<MealTaskCard
										task={task}
										onStatusChange={(newStatus) =>
											handleStatusChange(task.id, newStatus)
										}
										onToggleNeedsCheck={() => handleToggleNeedsCheck(task.id)}
										onExpand={() =>
											setExpandedTaskId(
												expandedTaskId === task.id ? null : task.id,
											)
										}
										isExpanded={expandedTaskId === task.id}
									/>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Empty state */}
				{filteredTasks.length === 0 && (
					<div className="shoji-panel p-8 text-center">
						<DiningIcon
							size={48}
							className="mx-auto text-[var(--nezumi)]/30 mb-3"
						/>
						<p className="text-[var(--nezumi)]">
							{activeFilter === "all"
								? "本日の配膳タスクはありません"
								: `${activeFilter === "needs_check" ? "再確認要の" : MEAL_STATUS_LABELS[activeFilter] + "の"}タスクはありません`}
						</p>
					</div>
				)}
			</main>
		</div>
	);
};
