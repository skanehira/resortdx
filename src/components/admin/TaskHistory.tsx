import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
	mockTasks,
	mockTaskTemplates,
	mockRooms,
	mockReservations,
	getStaffById,
	getReservationById,
	getRoomName,
} from "../../data/mock";
import {
	ROOM_TYPE_LABELS,
	TASK_CATEGORY_LABELS,
	type Task,
	type TaskStatus,
	type TaskCategory,
} from "../../types";
import {
	TaskIcon,
	RoomIcon,
	CelebrationIcon,
	AlertIcon,
	ClockIcon,
	TimelineIcon,
	SearchIcon,
	TemplateIcon,
	CheckIcon,
	NoteIcon,
	PlusIcon,
} from "../ui/Icons";
import { Modal } from "../ui/Modal";
import { InlineTimeEdit } from "./shared/TimeEditForm";
import { StaffSelector } from "../shared/StaffSelector";

// Status Badge Component
const StatusBadge = ({
	status,
	t,
}: {
	status: TaskStatus;
	t: (key: string) => string;
}) => {
	const config = {
		pending: { label: t("status.pending"), class: "badge-pending" },
		in_progress: { label: t("status.inProgress"), class: "badge-in-progress" },
		completed: { label: t("status.completed"), class: "badge-completed" },
	};
	return (
		<span className={`badge ${config[status].class}`}>
			{config[status].label}
		</span>
	);
};

// Priority Badge Component
const PriorityBadge = ({
	priority,
	t,
}: {
	priority: Task["priority"];
	t: (key: string) => string;
}) => {
	if (priority === "normal") return null;
	const config = {
		high: { label: t("priority.high"), class: "badge-anniversary" },
		urgent: { label: t("priority.urgent"), class: "badge-urgent" },
	};
	return (
		<span className={`badge ${config[priority].class}`}>
			{config[priority].label}
		</span>
	);
};

// Filter Tabs Component
interface FilterTabsProps {
	selected: TaskStatus | "all";
	onChange: (status: TaskStatus | "all") => void;
	counts: Record<TaskStatus | "all", number>;
	t: (key: string) => string;
}

const FilterTabs = ({ selected, onChange, counts, t }: FilterTabsProps) => {
	const tabs: { key: TaskStatus | "all"; label: string }[] = [
		{ key: "all", label: t("common.all") },
		{ key: "pending", label: t("status.pending") },
		{ key: "in_progress", label: t("status.inProgress") },
		{ key: "completed", label: t("status.completed") },
	];

	return (
		<div className="flex gap-1 p-1 bg-[var(--shironeri-warm)] rounded-lg">
			{tabs.map((tab) => (
				<button
					key={tab.key}
					onClick={() => onChange(tab.key)}
					className={`flex-1 px-4 py-2.5 text-sm font-display rounded-md transition-all ${
						selected === tab.key
							? "bg-white text-[var(--sumi)] shadow-sm"
							: "text-[var(--nezumi)] hover:text-[var(--sumi)]"
					}`}
				>
					{tab.label}
					<span
						className={`ml-2 ${
							selected === tab.key
								? "text-[var(--ai)]"
								: "text-[var(--nezumi-light)]"
						}`}
					>
						{counts[tab.key]}
					</span>
				</button>
			))}
		</div>
	);
};

// Task Detail Modal Component
const TaskDetailModal = ({
	task,
	isOpen,
	onClose,
	onSave,
	onNotesChange,
	t,
}: {
	task: Task | null;
	isOpen: boolean;
	onClose: () => void;
	onSave: (
		taskId: string,
		updates: { scheduledTime: string; assignedStaffId: string | null },
	) => void;
	onNotesChange: (taskId: string, notes: string) => void;
	t: (key: string) => string;
}) => {
	const [notes, setNotes] = useState(task?.notes || "");

	// task変更時にnotesを同期
	useEffect(() => {
		setNotes(task?.notes || "");
	}, [task?.id, task?.notes]);

	if (!task) return null;

	const reservation = getReservationById(task.reservationId);

	const handleTimeChange = (newTime: string) => {
		onSave(task.id, {
			scheduledTime: newTime,
			assignedStaffId: task.assignedStaffId,
		});
	};

	const handleAssigneeChange = (staffId: string | null) => {
		onSave(task.id, {
			scheduledTime: task.scheduledTime,
			assignedStaffId: staffId,
		});
	};

	const handleNotesBlur = () => {
		if (notes !== (task.notes || "")) {
			onNotesChange(task.id, notes);
		}
	};

	// Find matching template by category
	const template = mockTaskTemplates.find((t) => t.category === task.category);

	// Get related tasks for the same reservation
	const relatedTasks = mockTasks.filter(
		(t) => t.reservationId === task.reservationId,
	);
	const relatedTaskStats = {
		total: relatedTasks.length,
		completed: relatedTasks.filter((t) => t.status === "completed").length,
		in_progress: relatedTasks.filter((t) => t.status === "in_progress").length,
		pending: relatedTasks.filter((t) => t.status === "pending").length,
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={t("taskDetail.title")}
			size="2xl"
		>
			<div className="space-y-4">
				{/* Task Title and Status */}
				<div>
					<h3 className="text-lg font-display font-semibold text-[var(--sumi)]">
						{task.title}
					</h3>
					<div className="flex items-center gap-2 mt-2 flex-wrap">
						<StatusBadge status={task.status} t={t} />
						<PriorityBadge priority={task.priority} t={t} />
						{task.isAnniversaryRelated && (
							<span className="badge badge-anniversary">
								<CelebrationIcon size={12} />
								{t("taskDetail.anniversaryRelated")}
							</span>
						)}
					</div>
				</div>

				{/* Task Info */}
				<div className="grid grid-cols-2 gap-4 py-3 border-t border-b border-[rgba(45,41,38,0.06)]">
					<div className="flex items-center gap-2 text-sm flex-nowrap">
						<ClockIcon
							size={16}
							className="text-[var(--nezumi)] flex-shrink-0"
						/>
						<span className="text-[var(--nezumi)] whitespace-nowrap flex-shrink-0">
							{t("taskDetail.scheduledTime")}:
						</span>
						{task.status !== "completed" ? (
							<InlineTimeEdit
								value={task.scheduledTime}
								onTimeChange={handleTimeChange}
							/>
						) : (
							<span className="font-medium">{task.scheduledTime}</span>
						)}
					</div>
					<div className="flex items-center gap-2 text-sm">
						<RoomIcon size={16} className="text-[var(--nezumi)]" />
						<span className="text-[var(--nezumi)]">
							{t("taskDetail.room")}:
						</span>
						<span className="font-medium">{getRoomName(task.roomId)}</span>
					</div>
					<div className="flex items-center gap-2 text-sm">
						<TaskIcon size={16} className="text-[var(--nezumi)]" />
						<span className="text-[var(--nezumi)]">
							{t("taskDetail.category")}:
						</span>
						<span className="font-medium">
							{TASK_CATEGORY_LABELS[task.category]}
						</span>
					</div>
					<div className="flex items-center gap-2 text-sm">
						<TimelineIcon size={16} className="text-[var(--nezumi)]" />
						<span className="text-[var(--nezumi)]">
							{t("taskDetail.duration")}:
						</span>
						<span className="font-medium">
							{task.estimatedDuration}
							{t("taskDetail.minutes")}
						</span>
					</div>
				</div>

				{/* Completion Time (for completed tasks) */}
				{task.status === "completed" && task.completedAt && (
					<div className="p-3 bg-[rgba(93,174,139,0.1)] rounded border border-[rgba(93,174,139,0.2)]">
						<div className="flex items-center gap-2">
							<CheckIcon size={16} className="text-[var(--aotake)]" />
							<span className="text-sm text-[var(--aotake)] font-medium">
								{t("taskDetail.completedAt")}: {task.completedAt}
							</span>
						</div>
					</div>
				)}

				{/* Template Info */}
				{template && (
					<div className="flex items-center gap-2 p-3 bg-[var(--shironeri-warm)] rounded">
						<TemplateIcon size={16} className="text-[var(--ai)]" />
						<span className="text-sm text-[var(--nezumi)]">
							{t("taskDetail.template")}:
						</span>
						<span className="text-sm font-medium text-[var(--sumi)]">
							{template.name}
						</span>
					</div>
				)}

				{/* Description */}
				{task.description && (
					<div>
						<p className="text-xs text-[var(--nezumi)] mb-1">
							{t("taskDetail.description")}
						</p>
						<p className="text-sm text-[var(--sumi-light)]">
							{task.description}
						</p>
					</div>
				)}

				{/* Assigned Staff */}
				<div>
					<p className="text-xs text-[var(--nezumi)] mb-2">
						{t("taskDetail.assignee")}
					</p>
					<StaffSelector
						value={task.assignedStaffId}
						onChange={handleAssigneeChange}
						showUnassigned
						ariaLabel="担当者を選択"
					/>
				</div>

				{/* Guest Info */}
				{reservation && (
					<div>
						<p className="text-xs text-[var(--nezumi)] mb-2">
							{t("taskDetail.guestInfo")}
						</p>
						<div className="p-3 bg-[var(--shironeri-warm)] rounded">
							<p className="font-medium">{reservation.guestName}</p>
							<p className="text-sm text-[var(--nezumi)]">
								{reservation.numberOfGuests}
								{t("dashboard.guestCount")} ・{" "}
								{ROOM_TYPE_LABELS[reservation.roomType]}
							</p>
							{reservation.anniversary && (
								<div className="mt-2 p-2 bg-[rgba(184,134,11,0.1)] rounded">
									<p className="text-sm text-[var(--kincha)] font-medium">
										{reservation.anniversary.type === "birthday"
											? t("anniversary.birthday")
											: t("anniversary.weddingAnniversary")}
									</p>
									<p className="text-xs text-[var(--sumi-light)]">
										{reservation.anniversary.description}
									</p>
								</div>
							)}
						</div>
					</div>
				)}

				{/* Related Task Stats */}
				<div>
					<p className="text-xs text-[var(--nezumi)] mb-2">
						{t("taskDetail.reservationProgress")}
					</p>
					<div className="grid grid-cols-3 gap-2">
						<div className="p-2 bg-[var(--shironeri-warm)] rounded text-center">
							<p className="text-lg font-display font-semibold text-[var(--aotake)]">
								{relatedTaskStats.completed}
							</p>
							<p className="text-xs text-[var(--nezumi)]">
								{t("status.completed")}
							</p>
						</div>
						<div className="p-2 bg-[var(--shironeri-warm)] rounded text-center">
							<p className="text-lg font-display font-semibold text-[var(--ai)]">
								{relatedTaskStats.in_progress}
							</p>
							<p className="text-xs text-[var(--nezumi)]">
								{t("status.inProgress")}
							</p>
						</div>
						<div className="p-2 bg-[var(--shironeri-warm)] rounded text-center">
							<p className="text-lg font-display font-semibold text-[var(--nezumi)]">
								{relatedTaskStats.pending}
							</p>
							<p className="text-xs text-[var(--nezumi)]">
								{t("status.pending")}
							</p>
						</div>
					</div>
				</div>

				{/* Notes */}
				<div>
					<div className="flex items-center gap-2 mb-2">
						<NoteIcon size={16} className="text-[var(--ai)]" />
						<p className="text-xs text-[var(--nezumi)]">
							{t("taskDetail.notes")}
						</p>
					</div>
					<textarea
						value={notes}
						onChange={(e) => setNotes(e.target.value)}
						onBlur={handleNotesBlur}
						placeholder={t("taskDetail.notesPlaceholder")}
						className="w-full px-3 py-2 text-sm border border-[rgba(45,41,38,0.12)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ai)] focus:border-transparent resize-none"
						rows={3}
					/>
				</div>
			</div>
		</Modal>
	);
};

// Create Task Modal Component
const CreateTaskModal = ({
	isOpen,
	onClose,
	onCreate,
	t,
}: {
	isOpen: boolean;
	onClose: () => void;
	onCreate: (task: Task) => void;
	t: (key: string) => string;
}) => {
	const [formData, setFormData] = useState({
		category: "cleaning" as TaskCategory,
		title: "",
		description: "",
		roomId: "",
		reservationId: "",
		scheduledTime: "",
		estimatedDuration: 30,
		priority: "normal" as "normal" | "high" | "urgent",
		assignedStaffId: "",
		isAnniversaryRelated: false,
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.roomId || !formData.scheduledTime || !formData.title) {
			return;
		}

		const newTask: Task = {
			id: `TASK${Date.now()}`,
			reservationId: formData.reservationId || `RES${Date.now()}`,
			category: formData.category,
			title: formData.title,
			description: formData.description,
			roomId: formData.roomId,
			scheduledTime: formData.scheduledTime,
			estimatedDuration: formData.estimatedDuration,
			status: "pending",
			assignedStaffId: formData.assignedStaffId || null,
			priority: formData.priority,
			isAnniversaryRelated: formData.isAnniversaryRelated,
		};

		onCreate(newTask);
		onClose();
		// Reset form
		setFormData({
			category: "cleaning",
			title: "",
			description: "",
			roomId: "",
			reservationId: "",
			scheduledTime: "",
			estimatedDuration: 30,
			priority: "normal",
			assignedStaffId: "",
			isAnniversaryRelated: false,
		});
	};

	const categoryOptions: TaskCategory[] = [
		"cleaning",
		"inspection",
		"meal_service",
		"turndown",
		"pickup",
		"bath",
		"celebration",
		"other",
	];

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={t("taskManagement.createTask")}
			size="lg"
		>
			<form onSubmit={handleSubmit} className="space-y-4">
				{/* Category and Title */}
				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="block text-sm text-[var(--nezumi)] mb-1">
							{t("taskDetail.category")}{" "}
							<span className="text-[var(--shu)]">*</span>
						</label>
						<select
							value={formData.category}
							onChange={(e) =>
								setFormData({
									...formData,
									category: e.target.value as TaskCategory,
								})
							}
							className="w-full px-3 py-2 border border-[rgba(45,41,38,0.12)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ai)]/30"
						>
							{categoryOptions.map((cat) => (
								<option key={cat} value={cat}>
									{TASK_CATEGORY_LABELS[cat]}
								</option>
							))}
						</select>
					</div>
					<div>
						<label className="block text-sm text-[var(--nezumi)] mb-1">
							{t("priority.normal")}{" "}
							<span className="text-[var(--shu)]">*</span>
						</label>
						<select
							value={formData.priority}
							onChange={(e) =>
								setFormData({
									...formData,
									priority: e.target.value as "normal" | "high" | "urgent",
								})
							}
							className="w-full px-3 py-2 border border-[rgba(45,41,38,0.12)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ai)]/30"
						>
							<option value="normal">{t("priority.normal")}</option>
							<option value="high">{t("priority.high")}</option>
							<option value="urgent">{t("priority.urgent")}</option>
						</select>
					</div>
				</div>

				{/* Title */}
				<div>
					<label className="block text-sm text-[var(--nezumi)] mb-1">
						タスク名 <span className="text-[var(--shu)]">*</span>
					</label>
					<input
						type="text"
						value={formData.title}
						onChange={(e) =>
							setFormData({ ...formData, title: e.target.value })
						}
						placeholder="例: 客室清掃"
						className="w-full px-3 py-2 border border-[rgba(45,41,38,0.12)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ai)]/30"
						required
					/>
				</div>

				{/* Room and Reservation */}
				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="block text-sm text-[var(--nezumi)] mb-1">
							{t("taskDetail.room")}{" "}
							<span className="text-[var(--shu)]">*</span>
						</label>
						<select
							value={formData.roomId}
							onChange={(e) =>
								setFormData({ ...formData, roomId: e.target.value })
							}
							className="w-full px-3 py-2 border border-[rgba(45,41,38,0.12)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ai)]/30"
							required
						>
							<option value="">選択してください</option>
							{mockRooms.map((room) => (
								<option key={room.id} value={room.id}>
									{room.name}
								</option>
							))}
						</select>
					</div>
					<div>
						<label className="block text-sm text-[var(--nezumi)] mb-1">
							予約
						</label>
						<select
							value={formData.reservationId}
							onChange={(e) =>
								setFormData({ ...formData, reservationId: e.target.value })
							}
							className="w-full px-3 py-2 border border-[rgba(45,41,38,0.12)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ai)]/30"
						>
							<option value="">なし</option>
							{mockReservations.map((res) => (
								<option key={res.id} value={res.id}>
									{res.guestName}
								</option>
							))}
						</select>
					</div>
				</div>

				{/* Time and Duration */}
				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="block text-sm text-[var(--nezumi)] mb-1">
							{t("taskDetail.scheduledTime")}{" "}
							<span className="text-[var(--shu)]">*</span>
						</label>
						<input
							type="time"
							value={formData.scheduledTime}
							onChange={(e) =>
								setFormData({ ...formData, scheduledTime: e.target.value })
							}
							className="w-full px-3 py-2 border border-[rgba(45,41,38,0.12)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ai)]/30"
							required
						/>
					</div>
					<div>
						<label className="block text-sm text-[var(--nezumi)] mb-1">
							{t("taskDetail.duration")}（{t("taskDetail.minutes")}）
						</label>
						<input
							type="number"
							min="5"
							max="480"
							value={formData.estimatedDuration}
							onChange={(e) =>
								setFormData({
									...formData,
									estimatedDuration: parseInt(e.target.value) || 30,
								})
							}
							className="w-full px-3 py-2 border border-[rgba(45,41,38,0.12)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ai)]/30"
						/>
					</div>
				</div>

				{/* Assignee */}
				<div>
					<label className="block text-sm text-[var(--nezumi)] mb-1">
						{t("taskDetail.assignee")}
					</label>
					<StaffSelector
						value={formData.assignedStaffId || null}
						onChange={(staffId) =>
							setFormData({ ...formData, assignedStaffId: staffId ?? "" })
						}
						showUnassigned
						ariaLabel="担当者を選択"
					/>
				</div>

				{/* Description */}
				<div>
					<label className="block text-sm text-[var(--nezumi)] mb-1">
						{t("taskDetail.description")}
					</label>
					<textarea
						value={formData.description}
						onChange={(e) =>
							setFormData({ ...formData, description: e.target.value })
						}
						placeholder="タスクの詳細を入力..."
						className="w-full px-3 py-2 border border-[rgba(45,41,38,0.12)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ai)]/30 resize-none"
						rows={3}
					/>
				</div>

				{/* Anniversary Related */}
				<div>
					<label className="flex items-center gap-2 cursor-pointer">
						<input
							type="checkbox"
							checked={formData.isAnniversaryRelated}
							onChange={(e) =>
								setFormData({
									...formData,
									isAnniversaryRelated: e.target.checked,
								})
							}
							className="w-4 h-4 rounded border-[var(--nezumi)]"
						/>
						<span className="text-sm text-[var(--sumi)]">
							{t("taskDetail.anniversaryRelated")}
						</span>
						<CelebrationIcon size={16} className="text-[var(--kincha)]" />
					</label>
				</div>

				{/* Submit Button */}
				<button
					type="submit"
					className="w-full py-3 bg-[var(--ai)] text-white rounded-lg font-display font-medium hover:bg-[var(--ai-deep)] transition-colors"
				>
					{t("taskManagement.createTask")}
				</button>
			</form>
		</Modal>
	);
};

// Task Row Component
interface TaskRowProps {
	task: Task;
	onClick: (task: Task) => void;
	t: (key: string) => string;
}

const TaskRow = ({ task, onClick, t }: TaskRowProps) => {
	const staff = task.assignedStaffId
		? getStaffById(task.assignedStaffId)
		: null;
	const reservation = getReservationById(task.reservationId);
	const roomName = getRoomName(task.roomId);
	// Remove room name from task title
	const titleWithoutRoom = task.title
		.replace(` ${roomName}`, "")
		.replace(roomName, "");

	const priorityLabels = {
		normal: t("priority.normal"),
		high: t("priority.high"),
		urgent: t("priority.urgent"),
	};

	return (
		<tr
			onClick={() => onClick(task)}
			className={`cursor-pointer hover:bg-[var(--shironeri-warm)] transition-colors ${
				task.isAnniversaryRelated ? "bg-[rgba(184,134,11,0.03)]" : ""
			} ${task.priority === "urgent" ? "bg-[rgba(199,62,58,0.03)]" : ""}`}
		>
			<td className="font-display">{task.scheduledTime}</td>
			<td>
				<div className="flex flex-col">
					<span className="font-medium whitespace-nowrap">{roomName}</span>
				</div>
			</td>
			<td>
				<div className="flex items-center gap-2">
					<span className="text-xs px-2 py-0.5 bg-[var(--shironeri-warm)] rounded whitespace-nowrap">
						{TASK_CATEGORY_LABELS[task.category]}
					</span>
					<span className="font-medium">{titleWithoutRoom}</span>
					{task.isAnniversaryRelated && (
						<CelebrationIcon size={14} className="text-[var(--kincha)]" />
					)}
				</div>
			</td>
			<td>
				<span
					className={`text-sm ${
						task.priority === "urgent"
							? "text-[var(--shu)] font-medium"
							: task.priority === "high"
								? "text-[var(--kincha)]"
								: "text-[var(--nezumi)]"
					}`}
				>
					{priorityLabels[task.priority]}
				</span>
			</td>
			<td>
				{staff ? (
					<div className="flex items-center gap-2">
						<div
							className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
							style={{ backgroundColor: staff.avatarColor }}
						>
							{staff.name.charAt(0)}
						</div>
						<span className="text-sm">{staff.name}</span>
					</div>
				) : (
					<span className="text-[var(--nezumi-light)]">
						{t("taskDetail.unassigned")}
					</span>
				)}
			</td>
			<td>
				{reservation && (
					<span className="text-sm text-[var(--sumi-light)]">
						{reservation.guestName}
					</span>
				)}
			</td>
			<td>
				<StatusBadge status={task.status} t={t} />
			</td>
		</tr>
	);
};

// Main Task List Component
export const TaskHistory = () => {
	const { t } = useTranslation("admin");
	const [tasks, setTasks] = useState<Task[]>(mockTasks);
	const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
	const [categoryFilter, setCategoryFilter] = useState<TaskCategory | "all">(
		"all",
	);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

	// Filter and sort tasks
	const filteredTasks = useMemo(() => {
		let filtered = [...tasks];

		// Status filter
		if (statusFilter !== "all") {
			filtered = filtered.filter((task) => task.status === statusFilter);
		}

		// Category filter
		if (categoryFilter !== "all") {
			filtered = filtered.filter((task) => task.category === categoryFilter);
		}

		// Search filter
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(task) =>
					task.title.toLowerCase().includes(query) ||
					getRoomName(task.roomId).toLowerCase().includes(query) ||
					task.description?.toLowerCase().includes(query),
			);
		}

		// Sort by scheduled time
		return filtered.sort((a, b) =>
			a.scheduledTime.localeCompare(b.scheduledTime),
		);
	}, [tasks, statusFilter, categoryFilter, searchQuery]);

	const handleTaskClick = (task: Task) => {
		setSelectedTask(task);
		setIsDetailModalOpen(true);
	};

	const handleTaskUpdate = (
		taskId: string,
		updates: { scheduledTime: string; assignedStaffId: string | null },
	) => {
		setTasks((prev) =>
			prev.map((task) => (task.id === taskId ? { ...task, ...updates } : task)),
		);
		// Update selectedTask to reflect changes
		if (selectedTask?.id === taskId) {
			setSelectedTask({ ...selectedTask, ...updates });
		}
	};

	const handleNotesChange = (taskId: string, notes: string) => {
		setTasks((prev) =>
			prev.map((task) => (task.id === taskId ? { ...task, notes } : task)),
		);
		// Update selectedTask to reflect changes
		if (selectedTask?.id === taskId) {
			setSelectedTask({ ...selectedTask, notes });
		}
	};

	const handleCreateTask = (newTask: Task) => {
		setTasks((prev) => [...prev, newTask]);
	};

	// Stats
	const counts: Record<TaskStatus | "all", number> = {
		all: tasks.length,
		pending: tasks.filter((task) => task.status === "pending").length,
		in_progress: tasks.filter((task) => task.status === "in_progress").length,
		completed: tasks.filter((task) => task.status === "completed").length,
	};

	const urgentCount = tasks.filter(
		(task) => task.priority === "urgent" && task.status !== "completed",
	).length;

	const categories: { key: TaskCategory | "all"; label: string }[] = [
		{ key: "all", label: t("category.all") },
		{ key: "cleaning", label: t("category.cleaning") },
		{ key: "meal_service", label: t("category.mealService") },
		{ key: "bath", label: t("category.bath") },
		{ key: "pickup", label: t("category.pickup") },
		{ key: "celebration", label: t("category.celebration") },
		{ key: "turndown", label: t("category.turndown") },
	];

	return (
		<div className="space-y-6 animate-fade-in">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-display font-semibold text-[var(--sumi)] ink-stroke inline-block">
						{t("taskManagement.taskList")}
					</h1>
					<p className="text-sm text-[var(--nezumi)] mt-2">
						{t("taskManagement.description")}
					</p>
				</div>
				<button
					onClick={() => setIsCreateModalOpen(true)}
					className="flex items-center gap-2 px-4 py-2 bg-[var(--ai)] text-white rounded-lg font-display font-medium hover:bg-[var(--ai-deep)] transition-colors"
				>
					<PlusIcon size={18} />
					新規作成
				</button>
			</div>

			{/* Urgent Alert */}
			{urgentCount > 0 && (
				<div className="shoji-panel p-4 border-l-3 border-l-[var(--shu)] bg-[rgba(199,62,58,0.02)]">
					<div className="flex items-center gap-3">
						<AlertIcon size={20} className="text-[var(--shu)]" />
						<div>
							<p className="font-display font-medium text-[var(--shu)]">
								{t("taskManagement.urgentTasksAlert")}: {urgentCount}
								{t("taskManagement.urgentTasksAlertItems")}
							</p>
							<p className="text-sm text-[var(--sumi-light)]">
								{t("taskManagement.urgentNeedsAttention")}
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Summary Stats */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<div className="shoji-panel p-4 border-l-3 border-l-[var(--ai)]">
					<p className="text-2xl font-display font-semibold text-[var(--sumi)]">
						{counts.all}
					</p>
					<p className="text-sm text-[var(--nezumi)]">
						{t("taskManagement.totalTasks")}
					</p>
				</div>
				<div className="shoji-panel p-4 border-l-3 border-l-[var(--nezumi-light)]">
					<p className="text-2xl font-display font-semibold text-[var(--sumi)]">
						{counts.pending}
					</p>
					<p className="text-sm text-[var(--nezumi)]">{t("status.pending")}</p>
				</div>
				<div className="shoji-panel p-4 border-l-3 border-l-[var(--ai)]">
					<p className="text-2xl font-display font-semibold text-[var(--ai)]">
						{counts.in_progress}
					</p>
					<p className="text-sm text-[var(--nezumi)]">
						{t("status.inProgress")}
					</p>
				</div>
				<div className="shoji-panel p-4 border-l-3 border-l-[var(--aotake)]">
					<p className="text-2xl font-display font-semibold text-[var(--aotake)]">
						{counts.completed}
					</p>
					<p className="text-sm text-[var(--nezumi)]">
						{t("status.completed")}
					</p>
				</div>
			</div>

			{/* Filters */}
			<div className="space-y-4">
				{/* Status Filter */}
				<FilterTabs
					selected={statusFilter}
					onChange={setStatusFilter}
					counts={counts}
					t={t}
				/>

				{/* Category and Search */}
				<div className="flex flex-col md:flex-row gap-4">
					{/* Category Filter */}
					<div className="flex gap-2 flex-wrap">
						{categories.map((cat) => (
							<button
								key={cat.key}
								onClick={() => setCategoryFilter(cat.key)}
								className={`px-3 py-1.5 text-sm rounded-md transition-all ${
									categoryFilter === cat.key
										? "bg-[var(--ai)] text-white"
										: "bg-[var(--shironeri-warm)] text-[var(--sumi)] hover:bg-[rgba(27,73,101,0.1)]"
								}`}
							>
								{cat.label}
							</button>
						))}
					</div>

					{/* Search */}
					<div className="relative flex-1 max-w-xs">
						<SearchIcon
							size={16}
							className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--nezumi-light)]"
						/>
						<input
							type="text"
							placeholder={t("taskManagement.searchPlaceholder")}
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-9 pr-4 py-2 text-sm border border-[rgba(45,41,38,0.12)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--ai)] focus:border-transparent"
						/>
					</div>
				</div>
			</div>

			{/* Task Table */}
			<div className="shoji-panel">
				<div className="table-container shadow-none">
					<table>
						<thead>
							<tr>
								<th className="w-20 whitespace-nowrap">{t("table.time")}</th>
								<th className="w-52 whitespace-nowrap">{t("table.room")}</th>
								<th className="whitespace-nowrap">{t("table.task")}</th>
								<th className="w-20 whitespace-nowrap">
									{t("table.priority")}
								</th>
								<th className="w-36 whitespace-nowrap">
									{t("table.assignee")}
								</th>
								<th className="w-32 whitespace-nowrap">{t("table.guest")}</th>
								<th className="w-28 whitespace-nowrap">{t("table.status")}</th>
							</tr>
						</thead>
						<tbody>
							{filteredTasks.map((task) => (
								<TaskRow
									key={task.id}
									task={task}
									onClick={handleTaskClick}
									t={t}
								/>
							))}
						</tbody>
					</table>

					{filteredTasks.length === 0 && (
						<div className="text-center py-12">
							<TaskIcon
								size={48}
								className="mx-auto text-[var(--nezumi-light)] mb-4"
							/>
							<p className="text-[var(--nezumi)]">
								{searchQuery
									? t("taskManagement.noTasksMatchSearch")
									: t("taskManagement.noTasksFound")}
							</p>
						</div>
					)}
				</div>
			</div>

			{/* Task Detail Modal */}
			<TaskDetailModal
				task={selectedTask}
				isOpen={isDetailModalOpen}
				onClose={() => setIsDetailModalOpen(false)}
				onSave={handleTaskUpdate}
				onNotesChange={handleNotesChange}
				t={t}
			/>

			{/* Create Task Modal */}
			<CreateTaskModal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
				onCreate={handleCreateTask}
				t={t}
			/>
		</div>
	);
};
