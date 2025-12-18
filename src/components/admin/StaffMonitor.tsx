import { useState } from "react";
import { mockStaff, mockTasks, getTasksByStaff } from "../../data/mock";
import {
	STAFF_ROLE_LABELS,
	TASK_CATEGORY_LABELS,
	type Staff,
	type Task,
	type StaffRole,
} from "../../types";
import {
	StaffIcon,
	TaskIcon,
	TimelineIcon,
	CheckIcon,
	AlertIcon,
	RefreshIcon,
} from "../ui/Icons";
import { Modal } from "../ui/Modal";

// Status Indicator Component
const StatusIndicator = ({ isOnDuty }: { isOnDuty: boolean }) => (
	<span
		className={`inline-block w-2 h-2 rounded-full ${
			isOnDuty ? "bg-[var(--aotake)]" : "bg-[var(--nezumi-light)]"
		}`}
	/>
);

// Staff Avatar Component
const StaffAvatar = ({
	staff,
	size = "md",
}: {
	staff: Staff;
	size?: "sm" | "md" | "lg";
}) => {
	const sizeClasses = {
		sm: "w-8 h-8 text-xs",
		md: "w-10 h-10 text-sm",
		lg: "w-14 h-14 text-lg",
	};

	return (
		<div
			className={`${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-medium`}
			style={{ backgroundColor: staff.avatarColor }}
		>
			{staff.name.charAt(0)}
		</div>
	);
};

// Task Badge Component
const TaskBadge = ({ status }: { status: Task["status"] }) => {
	const styles = {
		pending: "badge badge-pending",
		in_progress: "badge badge-in-progress",
		completed: "badge badge-completed",
	};
	const labels = {
		pending: "未着手",
		in_progress: "作業中",
		completed: "完了",
	};
	return <span className={styles[status]}>{labels[status]}</span>;
};

// Staff Card Component
interface StaffCardProps {
	staff: Staff;
	tasks: Task[];
	isSelected: boolean;
	onSelect: () => void;
}

const StaffCard = ({ staff, tasks, isSelected, onSelect }: StaffCardProps) => {
	const activeTasks = tasks.filter((t) => t.status !== "completed");
	const completedTasks = tasks.filter((t) => t.status === "completed");
	const inProgressTask = tasks.find((t) => t.status === "in_progress");

	return (
		<div
			onClick={onSelect}
			className={`shoji-panel p-5 cursor-pointer transition-all ${
				isSelected
					? "ring-2 ring-[var(--ai)] bg-[rgba(27,73,101,0.02)]"
					: "hover:shadow-md"
			}`}
		>
			{/* Header */}
			<div className="flex items-start gap-3 mb-4">
				<StaffAvatar staff={staff} size="lg" />
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2">
						<h3 className="font-display font-medium text-[var(--sumi)] truncate">
							{staff.name}
						</h3>
						<StatusIndicator isOnDuty={staff.isOnDuty} />
					</div>
					<p className="text-sm text-[var(--nezumi)]">
						{STAFF_ROLE_LABELS[staff.role]}
					</p>
					<p className="text-xs text-[var(--nezumi-light)]">
						{staff.shiftStart} - {staff.shiftEnd}
					</p>
				</div>
			</div>

			{/* Current Task */}
			{inProgressTask && (
				<div className="mb-4 p-3 bg-[rgba(27,73,101,0.05)] rounded border-l-2 border-[var(--ai)]">
					<p className="text-xs text-[var(--ai)] font-display mb-1">作業中</p>
					<p className="text-sm font-medium text-[var(--sumi)]">
						{inProgressTask.title}
					</p>
					<p className="text-xs text-[var(--nezumi)] mt-1">
						{inProgressTask.scheduledTime} - {inProgressTask.roomNumber}号室
					</p>
				</div>
			)}

			{/* Task Stats */}
			<div className="grid grid-cols-3 gap-2 text-center">
				<div className="py-2 bg-[var(--shironeri-warm)] rounded">
					<p className="text-lg font-display font-semibold text-[var(--nezumi)]">
						{activeTasks.length}
					</p>
					<p className="text-[10px] text-[var(--nezumi-light)]">残タスク</p>
				</div>
				<div className="py-2 bg-[var(--shironeri-warm)] rounded">
					<p className="text-lg font-display font-semibold text-[var(--ai)]">
						{tasks.filter((t) => t.status === "in_progress").length}
					</p>
					<p className="text-[10px] text-[var(--nezumi-light)]">作業中</p>
				</div>
				<div className="py-2 bg-[var(--shironeri-warm)] rounded">
					<p className="text-lg font-display font-semibold text-[var(--aotake)]">
						{completedTasks.length}
					</p>
					<p className="text-[10px] text-[var(--nezumi-light)]">完了</p>
				</div>
			</div>

			{/* Skills */}
			<div className="mt-4 pt-3 border-t border-[rgba(45,41,38,0.06)]">
				<p className="text-xs text-[var(--nezumi)] mb-2">対応可能業務</p>
				<div className="flex flex-wrap gap-1">
					{staff.skills.map((skill) => (
						<span
							key={skill}
							className="text-[10px] px-2 py-0.5 bg-[var(--shironeri-warm)] text-[var(--sumi-light)] rounded"
						>
							{TASK_CATEGORY_LABELS[skill]}
						</span>
					))}
				</div>
			</div>
		</div>
	);
};

// Reassign Modal Component
interface ReassignModalProps {
	isOpen: boolean;
	onClose: () => void;
	task: Task | null;
	currentStaff: Staff | null;
	availableStaff: Staff[];
	onReassign: (taskId: string, newStaffId: string) => void;
}

const ReassignModal = ({
	isOpen,
	onClose,
	task,
	currentStaff,
	availableStaff,
	onReassign,
}: ReassignModalProps) => {
	const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);

	if (!task) return null;

	const handleReassign = () => {
		if (selectedStaffId) {
			onReassign(task.id, selectedStaffId);
			onClose();
			setSelectedStaffId(null);
		}
	};

	// Filter staff who can handle this task category
	const qualifiedStaff = availableStaff.filter(
		(s) => s.skills.includes(task.category) && s.id !== currentStaff?.id,
	);

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="タスク再割当" size="md">
			{/* Task Info */}
			<div className="p-4 bg-[var(--shironeri-warm)] rounded mb-4">
				<div className="flex items-center gap-2 mb-2">
					<span className="text-lg font-display font-semibold text-[var(--ai)]">
						{task.scheduledTime}
					</span>
					<TaskBadge status={task.status} />
				</div>
				<h4 className="font-medium text-[var(--sumi)]">{task.title}</h4>
				<p className="text-sm text-[var(--nezumi)] mt-1">
					{TASK_CATEGORY_LABELS[task.category]} ・ {task.roomNumber}号室 ・{" "}
					{task.estimatedDuration}分
				</p>
			</div>

			{/* Current Assignment */}
			{currentStaff && (
				<div className="mb-4">
					<p className="text-xs text-[var(--nezumi)] mb-2">現在の担当者</p>
					<div className="flex items-center gap-3 p-3 border border-[rgba(45,41,38,0.1)] rounded">
						<StaffAvatar staff={currentStaff} size="sm" />
						<div>
							<p className="font-medium text-[var(--sumi)]">
								{currentStaff.name}
							</p>
							<p className="text-xs text-[var(--nezumi)]">
								{STAFF_ROLE_LABELS[currentStaff.role]}
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Staff Selection */}
			<div className="mb-4">
				<p className="text-xs text-[var(--nezumi)] mb-2">新しい担当者を選択</p>
				<div className="space-y-2 max-h-60 overflow-y-auto">
					{qualifiedStaff.map((s) => {
						const staffTasks = getTasksByStaff(s.id);
						const activeTasks = staffTasks.filter(
							(t) => t.status !== "completed",
						).length;
						const isSelected = selectedStaffId === s.id;

						return (
							<button
								key={s.id}
								onClick={() => setSelectedStaffId(s.id)}
								className={`w-full flex items-center gap-3 p-3 rounded border transition-all ${
									isSelected
										? "border-[var(--ai)] bg-[rgba(27,73,101,0.05)]"
										: "border-[rgba(45,41,38,0.1)] hover:border-[rgba(45,41,38,0.2)]"
								}`}
							>
								<StaffAvatar staff={s} size="sm" />
								<div className="flex-1 text-left">
									<div className="flex items-center gap-2">
										<p className="font-medium text-[var(--sumi)]">{s.name}</p>
										<StatusIndicator isOnDuty={s.isOnDuty} />
									</div>
									<p className="text-xs text-[var(--nezumi)]">
										{STAFF_ROLE_LABELS[s.role]} ・ 残{activeTasks}件
									</p>
								</div>
								{isSelected && (
									<CheckIcon size={18} className="text-[var(--ai)]" />
								)}
							</button>
						);
					})}

					{qualifiedStaff.length === 0 && (
						<div className="p-4 text-center text-[var(--nezumi)]">
							<p>対応可能なスタッフがいません</p>
						</div>
					)}
				</div>
			</div>

			{/* Actions */}
			<div className="flex gap-3">
				<button onClick={onClose} className="flex-1 btn btn-secondary">
					キャンセル
				</button>
				<button
					onClick={handleReassign}
					disabled={!selectedStaffId}
					className={`flex-1 btn btn-primary ${
						!selectedStaffId ? "opacity-50 cursor-not-allowed" : ""
					}`}
				>
					再割当する
				</button>
			</div>
		</Modal>
	);
};

// Task List for Selected Staff
interface StaffTaskListProps {
	staff: Staff;
	tasks: Task[];
	onReassign: (task: Task) => void;
}

const StaffTaskList = ({ staff, tasks, onReassign }: StaffTaskListProps) => {
	const sortedTasks = [...tasks].sort((a, b) => {
		const statusOrder = { in_progress: 0, pending: 1, completed: 2 };
		if (statusOrder[a.status] !== statusOrder[b.status]) {
			return statusOrder[a.status] - statusOrder[b.status];
		}
		return a.scheduledTime.localeCompare(b.scheduledTime);
	});

	return (
		<div className="shoji-panel animate-slide-up">
			<div className="p-4 border-b border-[rgba(45,41,38,0.06)] flex items-center justify-between">
				<div className="flex items-center gap-3">
					<StaffAvatar staff={staff} />
					<div>
						<h3 className="font-display font-medium text-[var(--sumi)]">
							{staff.name}のタスク一覧
						</h3>
						<p className="text-sm text-[var(--nezumi)]">
							{tasks.length}件のタスク
						</p>
					</div>
				</div>
			</div>

			<div className="divide-y divide-[rgba(45,41,38,0.04)]">
				{sortedTasks.map((task) => (
					<div
						key={task.id}
						className={`p-4 ${
							task.status === "in_progress"
								? "bg-[rgba(27,73,101,0.02)]"
								: task.status === "completed"
									? "bg-[rgba(93,174,139,0.02)]"
									: ""
						}`}
					>
						<div className="flex items-start justify-between gap-4">
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2 mb-1">
									<span className="text-sm font-display text-[var(--ai)]">
										{task.scheduledTime}
									</span>
									<TaskBadge status={task.status} />
									{task.priority === "urgent" && (
										<span className="badge badge-urgent">緊急</span>
									)}
								</div>
								<p className="font-medium text-[var(--sumi)]">{task.title}</p>
								<p className="text-sm text-[var(--nezumi)] mt-1">
									{TASK_CATEGORY_LABELS[task.category]} ・ {task.roomNumber}号室
									・ {task.estimatedDuration}分
								</p>
								{task.description && (
									<p className="text-sm text-[var(--sumi-light)] mt-2 p-2 bg-[var(--shironeri-warm)] rounded">
										{task.description}
									</p>
								)}
							</div>
							{task.status !== "completed" && (
								<button
									onClick={() => onReassign(task)}
									className="btn btn-ghost text-xs px-3"
								>
									<RefreshIcon size={14} />
									再割当
								</button>
							)}
						</div>
					</div>
				))}

				{sortedTasks.length === 0 && (
					<div className="p-8 text-center">
						<TaskIcon
							size={32}
							className="mx-auto text-[var(--nezumi-light)] mb-2"
						/>
						<p className="text-[var(--nezumi)]">
							割り当てられたタスクはありません
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

// Workload Chart Component
const WorkloadChart = ({ staff }: { staff: Staff[] }) => {
	const maxTasks = Math.max(
		...staff.map((s) => getTasksByStaff(s.id).length),
		1,
	);

	return (
		<div className="shoji-panel p-5">
			<h3 className="font-display font-medium text-[var(--sumi)] mb-4 flex items-center gap-2">
				<TimelineIcon size={18} />
				負荷バランス
			</h3>
			<div className="space-y-3">
				{staff.map((s) => {
					const tasks = getTasksByStaff(s.id);
					const percentage = (tasks.length / maxTasks) * 100;
					const completedPercentage =
						tasks.length > 0
							? (tasks.filter((t) => t.status === "completed").length /
									tasks.length) *
								100
							: 0;

					return (
						<div key={s.id} className="flex items-center gap-3">
							<div className="w-20 truncate text-sm text-[var(--sumi-light)]">
								{s.name.split(" ")[0]}
							</div>
							<div className="flex-1 h-6 bg-[var(--shironeri-warm)] rounded overflow-hidden relative">
								<div
									className="h-full bg-[var(--nezumi-light)] transition-all duration-300"
									style={{ width: `${percentage}%` }}
								/>
								<div
									className="absolute top-0 left-0 h-full bg-[var(--aotake)] transition-all duration-300"
									style={{
										width: `${(percentage * completedPercentage) / 100}%`,
									}}
								/>
							</div>
							<div className="w-12 text-right text-sm font-display text-[var(--sumi)]">
								{tasks.length}件
							</div>
						</div>
					);
				})}
			</div>
			<div className="flex items-center gap-4 mt-4 pt-3 border-t border-[rgba(45,41,38,0.06)] text-xs text-[var(--nezumi)]">
				<div className="flex items-center gap-1">
					<div className="w-3 h-3 bg-[var(--aotake)] rounded" />
					完了
				</div>
				<div className="flex items-center gap-1">
					<div className="w-3 h-3 bg-[var(--nezumi-light)] rounded" />
					未完了
				</div>
			</div>
		</div>
	);
};

// Role Filter Component
interface RoleFilterProps {
	selected: StaffRole | "all";
	onChange: (role: StaffRole | "all") => void;
}

const RoleFilter = ({ selected, onChange }: RoleFilterProps) => {
	const roles: (StaffRole | "all")[] = [
		"all",
		"cleaning",
		"service",
		"kitchen",
		"driver",
		"concierge",
	];

	return (
		<div className="flex flex-wrap gap-2">
			{roles.map((role) => (
				<button
					key={role}
					onClick={() => onChange(role)}
					className={`px-4 py-2 text-sm font-display rounded transition-all ${
						selected === role
							? "bg-[var(--ai)] text-white"
							: "bg-[var(--shironeri-warm)] text-[var(--sumi-light)] hover:bg-[rgba(45,41,38,0.08)]"
					}`}
				>
					{role === "all" ? "すべて" : STAFF_ROLE_LABELS[role]}
				</button>
			))}
		</div>
	);
};

// Main Staff Monitor Component
export const StaffMonitor = () => {
	const [roleFilter, setRoleFilter] = useState<StaffRole | "all">("all");
	const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
	const [reassignModalOpen, setReassignModalOpen] = useState(false);
	const [taskToReassign, setTaskToReassign] = useState<Task | null>(null);

	const filteredStaff =
		roleFilter === "all"
			? mockStaff
			: mockStaff.filter((s) => s.role === roleFilter);

	const onDutyStaff = mockStaff.filter((s) => s.isOnDuty);
	const totalActiveTasks = mockTasks.filter(
		(t) => t.status !== "completed",
	).length;
	const unassignedTasks = mockTasks.filter(
		(t) => !t.assignedStaffId && t.status !== "completed",
	);

	const selectedStaff = selectedStaffId
		? mockStaff.find((s) => s.id === selectedStaffId)
		: null;
	const selectedStaffTasks = selectedStaffId
		? getTasksByStaff(selectedStaffId)
		: [];

	const handleOpenReassignModal = (task: Task) => {
		setTaskToReassign(task);
		setReassignModalOpen(true);
	};

	const handleCloseReassignModal = () => {
		setReassignModalOpen(false);
		setTaskToReassign(null);
	};

	const handleReassign = (taskId: string, newStaffId: string) => {
		console.log("Reassigning task", taskId, "to staff", newStaffId);
		// In a real app, this would update the backend and refresh the data
	};

	return (
		<div className="space-y-6 animate-fade-in">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-display font-semibold text-[var(--sumi)] ink-stroke inline-block">
						スタッフ管理
					</h1>
					<p className="text-sm text-[var(--nezumi)] mt-2">
						スタッフの稼働状況とタスク割当を管理します
					</p>
				</div>
			</div>

			{/* Summary Stats */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<div className="shoji-panel p-4 border-l-3 border-l-[var(--aotake)]">
					<p className="text-2xl font-display font-semibold text-[var(--sumi)]">
						{onDutyStaff.length}
					</p>
					<p className="text-sm text-[var(--nezumi)]">出勤中スタッフ</p>
				</div>
				<div className="shoji-panel p-4 border-l-3 border-l-[var(--ai)]">
					<p className="text-2xl font-display font-semibold text-[var(--sumi)]">
						{totalActiveTasks}
					</p>
					<p className="text-sm text-[var(--nezumi)]">アクティブタスク</p>
				</div>
				<div className="shoji-panel p-4 border-l-3 border-l-[var(--kincha)]">
					<p className="text-2xl font-display font-semibold text-[var(--sumi)]">
						{mockTasks.filter((t) => t.status === "in_progress").length}
					</p>
					<p className="text-sm text-[var(--nezumi)]">作業中タスク</p>
				</div>
				{unassignedTasks.length > 0 ? (
					<div className="shoji-panel p-4 border-l-3 border-l-[var(--shu)] bg-[rgba(199,62,58,0.02)]">
						<div className="flex items-center gap-2">
							<AlertIcon size={18} className="text-[var(--shu)]" />
							<p className="text-2xl font-display font-semibold text-[var(--shu)]">
								{unassignedTasks.length}
							</p>
						</div>
						<p className="text-sm text-[var(--nezumi)]">未割当タスク</p>
					</div>
				) : (
					<div className="shoji-panel p-4 border-l-3 border-l-[var(--aotake)]">
						<div className="flex items-center gap-2">
							<CheckIcon size={18} className="text-[var(--aotake)]" />
							<p className="text-2xl font-display font-semibold text-[var(--aotake)]">
								0
							</p>
						</div>
						<p className="text-sm text-[var(--nezumi)]">未割当タスク</p>
					</div>
				)}
			</div>

			{/* Role Filter */}
			<div className="shoji-panel p-4">
				<RoleFilter selected={roleFilter} onChange={setRoleFilter} />
			</div>

			{/* Main Content */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Staff List */}
				<div className="lg:col-span-2 space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{filteredStaff.map((staff) => (
							<StaffCard
								key={staff.id}
								staff={staff}
								tasks={getTasksByStaff(staff.id)}
								isSelected={selectedStaffId === staff.id}
								onSelect={() =>
									setSelectedStaffId(
										selectedStaffId === staff.id ? null : staff.id,
									)
								}
							/>
						))}
					</div>
				</div>

				{/* Side Panel */}
				<div className="space-y-4">
					{/* Workload Chart */}
					<WorkloadChart staff={onDutyStaff} />

					{/* Selected Staff Tasks */}
					{selectedStaff && (
						<StaffTaskList
							staff={selectedStaff}
							tasks={selectedStaffTasks}
							onReassign={handleOpenReassignModal}
						/>
					)}

					{!selectedStaff && (
						<div className="shoji-panel p-8 text-center">
							<StaffIcon
								size={48}
								className="mx-auto text-[var(--nezumi-light)] mb-4"
							/>
							<p className="text-[var(--nezumi)]">
								スタッフを選択して
								<br />
								詳細を表示
							</p>
						</div>
					)}
				</div>
			</div>

			{/* Reassign Modal */}
			<ReassignModal
				isOpen={reassignModalOpen}
				onClose={handleCloseReassignModal}
				task={taskToReassign}
				currentStaff={selectedStaff || null}
				availableStaff={onDutyStaff}
				onReassign={handleReassign}
			/>
		</div>
	);
};
