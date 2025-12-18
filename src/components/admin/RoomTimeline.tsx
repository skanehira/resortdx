import { useState, useMemo, useCallback } from "react";
import {
	mockReservations,
	mockTasks,
	getStaffById,
	getTimeSlots,
} from "../../data/mockData";
import {
	ROOM_TYPE_LABELS,
	TASK_CATEGORY_LABELS,
	type Task,
	type Reservation,
} from "../../types";
import {
	TimelineIcon,
	RoomIcon,
	CelebrationIcon,
	CheckIcon,
	ChevronRightIcon,
} from "../ui/Icons";

// Drag context type
interface DragInfo {
	taskId: string;
	originalTime: string;
	originalRoom: string;
}

// Time slot header component
const TimeSlotHeader = ({ slots }: { slots: string[] }) => (
	<div className="flex border-b border-[rgba(45,41,38,0.08)]">
		<div className="w-32 flex-shrink-0 p-3 bg-[var(--shironeri-warm)] font-display text-sm text-[var(--sumi-light)]">
			部屋
		</div>
		<div className="flex-1 flex overflow-x-auto">
			{slots.map((slot) => (
				<div
					key={slot}
					className="flex-shrink-0 w-20 p-2 text-center text-xs text-[var(--nezumi)] border-l border-[rgba(45,41,38,0.04)] bg-[var(--shironeri-warm)]"
				>
					{slot}
				</div>
			))}
		</div>
	</div>
);

// Current time indicator
const CurrentTimeIndicator = ({ slots }: { slots: string[] }) => {
	const now = new Date();
	const currentHour = now.getHours();
	const currentMinute = now.getMinutes();
	const currentTimeInMinutes = currentHour * 60 + currentMinute;

	const startTime = 6 * 60; // 06:00
	const endTime = 23 * 60; // 23:00

	if (currentTimeInMinutes < startTime || currentTimeInMinutes > endTime) {
		return null;
	}

	const totalSlots = slots.length;
	const slotWidth = 80; // w-20 = 80px
	const roomWidth = 128; // w-32 = 128px
	const position =
		roomWidth +
		((currentTimeInMinutes - startTime) / (endTime - startTime)) *
			(totalSlots * slotWidth);

	return (
		<div
			className="absolute top-0 bottom-0 w-0.5 bg-[var(--shu)] z-20 pointer-events-none"
			style={{ left: `${position}px` }}
		>
			<div className="absolute -top-1 -left-1 w-2 h-2 bg-[var(--shu)] rounded-full" />
		</div>
	);
};

// Task block on timeline
interface TaskBlockProps {
	task: Task;
	slotWidth: number;
	startSlotIndex: number;
	onDragStart: (task: Task) => void;
	isDragging: boolean;
}

const TaskBlock = ({
	task,
	slotWidth,
	startSlotIndex,
	onDragStart,
	isDragging,
}: TaskBlockProps) => {
	const staff = task.assignedStaffId
		? getStaffById(task.assignedStaffId)
		: null;

	const categoryColors: Record<string, string> = {
		cleaning: "bg-[var(--aotake)]",
		meal_service: "bg-[var(--kincha)]",
		bath: "bg-[var(--ai)]",
		pickup: "bg-[var(--sumi-light)]",
		celebration: "bg-[var(--kincha)]",
		turndown: "bg-[var(--ai-light)]",
		other: "bg-[var(--nezumi)]",
	};

	const statusStyles: Record<string, string> = {
		completed: "opacity-50",
		in_progress: "ring-2 ring-white ring-offset-1",
		pending: "",
	};

	// Calculate width based on duration (each slot = 30 min, width = 80px)
	const durationSlots = Math.ceil(task.estimatedDuration / 30);
	const width = durationSlots * slotWidth - 4;
	const left = startSlotIndex * slotWidth + 2;

	const handleDragStart = (e: React.DragEvent) => {
		if (task.status === "completed") {
			e.preventDefault();
			return;
		}
		e.dataTransfer.setData("taskId", task.id);
		e.dataTransfer.effectAllowed = "move";
		onDragStart(task);
	};

	return (
		<div
			draggable={task.status !== "completed"}
			onDragStart={handleDragStart}
			className={`absolute top-1 bottom-1 rounded text-white text-xs flex items-center px-2 overflow-hidden transition-all hover:brightness-110 ${categoryColors[task.category]} ${statusStyles[task.status]} ${
				task.status !== "completed"
					? "cursor-grab active:cursor-grabbing"
					: "cursor-default"
			} ${isDragging ? "opacity-50 scale-95" : ""}`}
			style={{ left: `${left}px`, width: `${width}px` }}
			title={`${task.title}\n${task.scheduledTime} - ${task.estimatedDuration}分\n担当: ${staff?.name || "未割当"}${task.status !== "completed" ? "\n\nドラッグして時間を変更" : ""}`}
		>
			<div className="truncate flex items-center gap-1">
				{task.status === "completed" && <CheckIcon size={12} />}
				{task.isAnniversaryRelated && <CelebrationIcon size={12} />}
				<span className="truncate">{TASK_CATEGORY_LABELS[task.category]}</span>
			</div>
		</div>
	);
};

// Room row component
interface RoomRowProps {
	roomNumber: string;
	reservation: Reservation | null;
	tasks: Task[];
	slots: string[];
	onRoomClick: () => void;
	isSelected: boolean;
	onDragStart: (task: Task) => void;
	onDrop: (taskId: string, newTime: string, newRoom: string) => void;
	draggingTaskId: string | null;
	isDragOver: boolean;
	onDragEnter: () => void;
	onDragLeave: () => void;
}

const RoomRow = ({
	roomNumber,
	reservation,
	tasks,
	slots,
	onRoomClick,
	isSelected,
	onDragStart,
	onDrop,
	draggingTaskId,
	isDragOver,
	onDragEnter,
	onDragLeave,
}: RoomRowProps) => {
	const slotWidth = 80;

	const getSlotIndex = (time: string): number => {
		const [hours, minutes] = time.split(":").map(Number);
		const timeInMinutes = hours * 60 + minutes;
		const startTime = 6 * 60; // 06:00
		return Math.floor((timeInMinutes - startTime) / 30);
	};

	const getTimeFromPosition = (
		clientX: number,
		containerRect: DOMRect,
	): string => {
		const relativeX = clientX - containerRect.left;
		const slotIndex = Math.floor(relativeX / slotWidth);
		const startMinutes = 6 * 60; // 06:00
		const targetMinutes = startMinutes + slotIndex * 30;
		const hours = Math.floor(targetMinutes / 60);
		const minutes = targetMinutes % 60;
		return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		const taskId = e.dataTransfer.getData("taskId");
		if (!taskId) return;

		const container = e.currentTarget as HTMLElement;
		const rect = container.getBoundingClientRect();
		const newTime = getTimeFromPosition(e.clientX, rect);
		onDrop(taskId, newTime, roomNumber);
	};

	return (
		<div
			className={`flex border-b border-[rgba(45,41,38,0.04)] hover:bg-[rgba(45,41,38,0.01)] ${
				isSelected ? "bg-[rgba(27,73,101,0.03)]" : ""
			} ${isDragOver ? "bg-[rgba(27,73,101,0.08)]" : ""}`}
		>
			{/* Room Info */}
			<div
				className={`w-32 flex-shrink-0 p-3 border-r border-[rgba(45,41,38,0.06)] cursor-pointer ${
					reservation?.anniversary ? "bg-[rgba(184,134,11,0.05)]" : "bg-white"
				}`}
				onClick={onRoomClick}
			>
				<div className="flex items-center gap-2">
					<span className="font-display font-medium text-[var(--sumi)]">
						{roomNumber}
					</span>
					{reservation?.anniversary && (
						<CelebrationIcon size={14} className="text-[var(--kincha)]" />
					)}
				</div>
				{reservation && (
					<p className="text-xs text-[var(--nezumi)] truncate mt-0.5">
						{reservation.guestName}
					</p>
				)}
			</div>

			{/* Timeline */}
			<div
				className="flex-1 relative h-14 overflow-x-auto"
				onDragOver={handleDragOver}
				onDrop={handleDrop}
				onDragEnter={onDragEnter}
				onDragLeave={onDragLeave}
			>
				{/* Grid lines */}
				<div className="absolute inset-0 flex pointer-events-none">
					{slots.map((slot) => (
						<div
							key={slot}
							className={`flex-shrink-0 w-20 border-l ${
								slot.endsWith(":00")
									? "border-[rgba(45,41,38,0.08)]"
									: "border-[rgba(45,41,38,0.03)]"
							} ${isDragOver ? "bg-[rgba(27,73,101,0.03)]" : ""}`}
						/>
					))}
				</div>

				{/* Tasks */}
				{tasks.map((task) => {
					const slotIndex = getSlotIndex(task.scheduledTime);
					return (
						<TaskBlock
							key={task.id}
							task={task}
							slotWidth={slotWidth}
							startSlotIndex={slotIndex}
							onDragStart={onDragStart}
							isDragging={draggingTaskId === task.id}
						/>
					);
				})}
			</div>
		</div>
	);
};

// Room Detail Panel
interface RoomDetailProps {
	roomNumber: string;
	reservation: Reservation | null;
	tasks: Task[];
}

const RoomDetail = ({ roomNumber, reservation, tasks }: RoomDetailProps) => {
	const sortedTasks = [...tasks].sort((a, b) =>
		a.scheduledTime.localeCompare(b.scheduledTime),
	);

	return (
		<div className="shoji-panel animate-slide-in-right">
			<div className="p-4 border-b border-[rgba(45,41,38,0.08)] flex items-center justify-between">
				<div className="flex items-center gap-2">
					<RoomIcon size={20} className="text-[var(--ai)]" />
					<h3 className="font-display font-medium text-[var(--sumi)]">
						{roomNumber}号室
					</h3>
					{reservation?.anniversary && (
						<span className="badge badge-anniversary">
							<CelebrationIcon size={12} />
							{reservation.anniversary.type === "birthday"
								? "誕生日"
								: "記念日"}
						</span>
					)}
				</div>
			</div>

			{/* Reservation Info */}
			{reservation && (
				<div className="p-4 border-b border-[rgba(45,41,38,0.06)] bg-[var(--shironeri-warm)]">
					<div className="grid grid-cols-2 gap-3 text-sm">
						<div>
							<p className="text-[var(--nezumi)]">ゲスト</p>
							<p className="font-medium">{reservation.guestName}</p>
						</div>
						<div>
							<p className="text-[var(--nezumi)]">部屋タイプ</p>
							<p className="font-medium">
								{ROOM_TYPE_LABELS[reservation.roomType]}
							</p>
						</div>
						<div>
							<p className="text-[var(--nezumi)]">チェックイン</p>
							<p className="font-medium">{reservation.checkInTime}</p>
						</div>
						<div>
							<p className="text-[var(--nezumi)]">人数</p>
							<p className="font-medium">{reservation.numberOfGuests}名</p>
						</div>
					</div>
					{reservation.specialRequests.length > 0 && (
						<div className="mt-3 pt-3 border-t border-[rgba(45,41,38,0.08)]">
							<p className="text-xs text-[var(--nezumi)] mb-1">特記事項</p>
							<div className="flex flex-wrap gap-1">
								{reservation.specialRequests.map((req, idx) => (
									<span
										key={idx}
										className="text-xs px-2 py-0.5 bg-white rounded"
									>
										{req}
									</span>
								))}
							</div>
						</div>
					)}
				</div>
			)}

			{/* Task List */}
			<div className="divide-y divide-[rgba(45,41,38,0.04)]">
				{sortedTasks.map((task) => {
					const staff = task.assignedStaffId
						? getStaffById(task.assignedStaffId)
						: null;

					return (
						<div
							key={task.id}
							className={`p-4 ${
								task.status === "completed"
									? "bg-[rgba(93,174,139,0.02)]"
									: task.status === "in_progress"
										? "bg-[rgba(27,73,101,0.02)]"
										: ""
							}`}
						>
							<div className="flex items-start gap-3">
								<div
									className={`w-1 h-full self-stretch rounded ${
										task.status === "completed"
											? "bg-[var(--aotake)]"
											: task.status === "in_progress"
												? "bg-[var(--ai)]"
												: "bg-[var(--nezumi-light)]"
									}`}
								/>
								<div className="flex-1">
									<div className="flex items-center gap-2 mb-1">
										<span className="text-sm font-display text-[var(--ai)]">
											{task.scheduledTime}
										</span>
										<span
											className={`badge ${
												task.status === "completed"
													? "badge-completed"
													: task.status === "in_progress"
														? "badge-in-progress"
														: "badge-pending"
											}`}
										>
											{task.status === "completed"
												? "完了"
												: task.status === "in_progress"
													? "作業中"
													: "未着手"}
										</span>
										{task.isAnniversaryRelated && (
											<CelebrationIcon
												size={14}
												className="text-[var(--kincha)]"
											/>
										)}
									</div>
									<p className="font-medium text-[var(--sumi)]">{task.title}</p>
									<div className="flex items-center gap-2 mt-1 text-sm text-[var(--nezumi)]">
										<span>{TASK_CATEGORY_LABELS[task.category]}</span>
										<span>・</span>
										<span>{task.estimatedDuration}分</span>
										{staff && (
											<>
												<span>・</span>
												<div className="flex items-center gap-1">
													<div
														className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px]"
														style={{ backgroundColor: staff.avatarColor }}
													>
														{staff.name.charAt(0)}
													</div>
													<span>{staff.name}</span>
												</div>
											</>
										)}
									</div>
								</div>
							</div>
						</div>
					);
				})}

				{sortedTasks.length === 0 && (
					<div className="p-8 text-center">
						<TimelineIcon
							size={32}
							className="mx-auto text-[var(--nezumi-light)] mb-2"
						/>
						<p className="text-[var(--nezumi)]">タスクがありません</p>
					</div>
				)}
			</div>
		</div>
	);
};

// Main Room Timeline Component
export const RoomTimeline = () => {
	const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
	const [dragInfo, setDragInfo] = useState<DragInfo | null>(null);
	const [dragOverRoom, setDragOverRoom] = useState<string | null>(null);
	const timeSlots = useMemo(() => getTimeSlots(), []);

	// Get unique room numbers from reservations
	const rooms = useMemo(() => {
		const roomSet = new Set(mockReservations.map((r) => r.roomNumber));
		return Array.from(roomSet).sort();
	}, []);

	const getReservationByRoom = (roomNumber: string): Reservation | null => {
		return mockReservations.find((r) => r.roomNumber === roomNumber) || null;
	};

	const getTasksByRoom = (roomNumber: string): Task[] => {
		return mockTasks.filter((t) => t.roomNumber === roomNumber);
	};

	const selectedReservation = selectedRoom
		? getReservationByRoom(selectedRoom)
		: null;
	const selectedTasks = selectedRoom ? getTasksByRoom(selectedRoom) : [];

	// Drag handlers
	const handleDragStart = useCallback((task: Task) => {
		setDragInfo({
			taskId: task.id,
			originalTime: task.scheduledTime,
			originalRoom: task.roomNumber,
		});
	}, []);

	const handleDrop = useCallback(
		(taskId: string, newTime: string, newRoom: string) => {
			if (dragInfo) {
				console.log(
					`タスク ${taskId} を ${dragInfo.originalTime} から ${newTime} に、${dragInfo.originalRoom}号室 から ${newRoom}号室 に移動`,
				);
				// In a real app, this would update the backend
			}
			setDragInfo(null);
			setDragOverRoom(null);
		},
		[dragInfo],
	);

	const handleDragEnd = useCallback(() => {
		setDragInfo(null);
		setDragOverRoom(null);
	}, []);

	// Stats
	const completedTasksCount = mockTasks.filter(
		(t) => t.status === "completed",
	).length;
	const inProgressTasksCount = mockTasks.filter(
		(t) => t.status === "in_progress",
	).length;
	const anniversaryRooms = rooms.filter((r) => {
		const res = getReservationByRoom(r);
		return res?.anniversary;
	});

	return (
		<div className="space-y-6 animate-fade-in">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-display font-semibold text-[var(--sumi)] ink-stroke inline-block">
						部屋別タイムライン
					</h1>
					<p className="text-sm text-[var(--nezumi)] mt-2">
						部屋ごとのタスクスケジュールを時間軸で確認・管理します
					</p>
				</div>
				<div className="text-right">
					<p className="text-3xl font-display text-[var(--ai)]">
						{new Date().toLocaleTimeString("ja-JP", {
							hour: "2-digit",
							minute: "2-digit",
						})}
					</p>
					<p className="text-sm text-[var(--nezumi)]">現在時刻</p>
				</div>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<div className="shoji-panel p-4 border-l-3 border-l-[var(--ai)]">
					<p className="text-2xl font-display font-semibold text-[var(--sumi)]">
						{rooms.length}
					</p>
					<p className="text-sm text-[var(--nezumi)]">本日の稼働部屋</p>
				</div>
				<div className="shoji-panel p-4 border-l-3 border-l-[var(--aotake)]">
					<p className="text-2xl font-display font-semibold text-[var(--aotake)]">
						{completedTasksCount}
					</p>
					<p className="text-sm text-[var(--nezumi)]">完了タスク</p>
				</div>
				<div className="shoji-panel p-4 border-l-3 border-l-[var(--kincha)]">
					<p className="text-2xl font-display font-semibold text-[var(--kincha)]">
						{inProgressTasksCount}
					</p>
					<p className="text-sm text-[var(--nezumi)]">作業中</p>
				</div>
				<div className="shoji-panel p-4 border-l-3 border-l-[var(--kincha)]">
					<div className="flex items-center gap-2">
						<CelebrationIcon size={18} className="text-[var(--kincha)]" />
						<p className="text-2xl font-display font-semibold text-[var(--sumi)]">
							{anniversaryRooms.length}
						</p>
					</div>
					<p className="text-sm text-[var(--nezumi)]">記念日対応</p>
				</div>
			</div>

			{/* Legend */}
			<div className="shoji-panel p-4">
				<div className="flex flex-wrap items-center gap-4 text-sm">
					<span className="text-[var(--nezumi)] font-display">カテゴリ:</span>
					<div className="flex items-center gap-1">
						<div className="w-3 h-3 bg-[var(--aotake)] rounded" />
						<span>清掃</span>
					</div>
					<div className="flex items-center gap-1">
						<div className="w-3 h-3 bg-[var(--kincha)] rounded" />
						<span>配膳/記念日</span>
					</div>
					<div className="flex items-center gap-1">
						<div className="w-3 h-3 bg-[var(--ai)] rounded" />
						<span>風呂準備</span>
					</div>
					<div className="flex items-center gap-1">
						<div className="w-3 h-3 bg-[var(--sumi-light)] rounded" />
						<span>送迎</span>
					</div>
					<span className="border-l border-[rgba(45,41,38,0.2)] pl-4 text-[var(--nezumi)]">
						<ChevronRightIcon
							size={14}
							className="inline -rotate-90 text-[var(--shu)]"
						/>{" "}
						現在時刻
					</span>
				</div>
			</div>

			{/* Main Content */}
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
				{/* Timeline */}
				<div className="lg:col-span-3">
					<div className="shoji-panel overflow-hidden">
						{/* Time Header */}
						<TimeSlotHeader slots={timeSlots} />

						{/* Room Rows */}
						<div className="relative" onDragEnd={handleDragEnd}>
							<CurrentTimeIndicator slots={timeSlots} />
							{rooms.map((roomNumber) => (
								<RoomRow
									key={roomNumber}
									roomNumber={roomNumber}
									reservation={getReservationByRoom(roomNumber)}
									tasks={getTasksByRoom(roomNumber)}
									slots={timeSlots}
									onRoomClick={() =>
										setSelectedRoom(
											selectedRoom === roomNumber ? null : roomNumber,
										)
									}
									isSelected={selectedRoom === roomNumber}
									onDragStart={handleDragStart}
									onDrop={handleDrop}
									draggingTaskId={dragInfo?.taskId || null}
									isDragOver={dragOverRoom === roomNumber}
									onDragEnter={() => setDragOverRoom(roomNumber)}
									onDragLeave={() => setDragOverRoom(null)}
								/>
							))}
						</div>
					</div>
				</div>

				{/* Detail Panel */}
				<div className="lg:col-span-1">
					{selectedRoom ? (
						<RoomDetail
							roomNumber={selectedRoom}
							reservation={selectedReservation}
							tasks={selectedTasks}
						/>
					) : (
						<div className="shoji-panel p-8 text-center">
							<RoomIcon
								size={48}
								className="mx-auto text-[var(--nezumi-light)] mb-4"
							/>
							<p className="text-[var(--nezumi)]">
								部屋を選択して
								<br />
								詳細を表示
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
