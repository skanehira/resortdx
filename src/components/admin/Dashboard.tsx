import { mockReservations, mockTasks, mockDailyStats, getStaffById } from "../../data/mockData";
import { ROOM_TYPE_LABELS, TASK_CATEGORY_LABELS, type Task, type Reservation } from "../../types";
import {
	ReservationIcon,
	TaskIcon,
	GuestIcon,
	CelebrationIcon,
	TimelineIcon,
	AlertIcon,
} from "../ui/Icons";

// Status Badge Component
const StatusBadge = ({ status }: { status: Task["status"] }) => {
	const classes = {
		pending: "badge badge-pending",
		in_progress: "badge badge-in-progress",
		completed: "badge badge-completed",
	};
	const labels = {
		pending: "未着手",
		in_progress: "作業中",
		completed: "完了",
	};
	return <span className={classes[status]}>{labels[status]}</span>;
};

// Priority Badge Component
const PriorityBadge = ({ priority }: { priority: Task["priority"] }) => {
	if (priority === "normal") return null;
	const classes = {
		high: "badge badge-anniversary",
		urgent: "badge badge-urgent",
	};
	const labels = {
		high: "優先",
		urgent: "緊急",
	};
	return <span className={classes[priority]}>{labels[priority]}</span>;
};

// Stat Card Component
interface StatCardProps {
	icon: React.ReactNode;
	label: string;
	value: number;
	subValue?: string;
	accent?: "ai" | "aotake" | "kincha" | "shu";
}

const StatCard = ({ icon, label, value, subValue, accent = "ai" }: StatCardProps) => {
	const accentColors = {
		ai: "border-l-[var(--ai)]",
		aotake: "border-l-[var(--aotake)]",
		kincha: "border-l-[var(--kincha)]",
		shu: "border-l-[var(--shu)]",
	};

	return (
		<div className={`shoji-panel p-5 border-l-3 ${accentColors[accent]} animate-slide-up`}>
			<div className="flex items-start justify-between">
				<div>
					<p className="text-sm text-[var(--nezumi)] font-display tracking-wide">{label}</p>
					<p className="text-3xl font-display font-semibold mt-1 text-[var(--sumi)]">{value}</p>
					{subValue && <p className="text-xs text-[var(--nezumi-light)] mt-1">{subValue}</p>}
				</div>
				<div className="text-[var(--nezumi-light)] opacity-60">{icon}</div>
			</div>
		</div>
	);
};

// Reservation Row Component
const ReservationRow = ({ reservation }: { reservation: Reservation }) => {
	const hasAnniversary = !!reservation.anniversary;

	return (
		<tr className={hasAnniversary ? "bg-[rgba(184,134,11,0.03)]" : ""}>
			<td className="font-display font-medium">{reservation.checkInTime}</td>
			<td>
				<span className="font-medium">{reservation.roomNumber}</span>
				<span className="text-xs text-[var(--nezumi)] ml-2">
					{ROOM_TYPE_LABELS[reservation.roomType]}
				</span>
			</td>
			<td>
				<div className="flex items-center gap-2">
					{reservation.guestName}
					{hasAnniversary && (
						<span className="badge badge-anniversary">
							<CelebrationIcon size={12} />
							{reservation.anniversary?.type === "birthday"
								? "誕生日"
								: reservation.anniversary?.type === "wedding"
									? "結婚記念"
									: "記念日"}
						</span>
					)}
				</div>
			</td>
			<td className="text-center">{reservation.numberOfGuests}名</td>
			<td>
				{reservation.specialRequests.length > 0 ? (
					<span className="text-sm text-[var(--sumi-light)]">
						{reservation.specialRequests[0]}
						{reservation.specialRequests.length > 1 &&
							` +${reservation.specialRequests.length - 1}`}
					</span>
				) : (
					<span className="text-[var(--nezumi-light)]">-</span>
				)}
			</td>
		</tr>
	);
};

// Task Row Component
const TaskRow = ({ task }: { task: Task }) => {
	const staff = task.assignedStaffId ? getStaffById(task.assignedStaffId) : null;

	return (
		<tr
			className={`${task.isAnniversaryRelated ? "bg-[rgba(184,134,11,0.03)]" : ""} ${task.priority === "urgent" ? "bg-[rgba(199,62,58,0.03)]" : ""}`}
		>
			<td className="font-display">{task.scheduledTime}</td>
			<td>
				<div className="flex items-center gap-2">
					<span className="text-xs px-2 py-0.5 bg-[var(--shironeri-warm)] rounded">
						{TASK_CATEGORY_LABELS[task.category]}
					</span>
					<span className="font-medium">{task.title}</span>
					{task.isAnniversaryRelated && (
						<CelebrationIcon size={14} className="text-[var(--kincha)]" />
					)}
				</div>
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
					<span className="text-[var(--nezumi-light)]">未割当</span>
				)}
			</td>
			<td>
				<div className="flex items-center gap-2">
					<StatusBadge status={task.status} />
					<PriorityBadge priority={task.priority} />
				</div>
			</td>
		</tr>
	);
};

// Progress Ring Component
const ProgressRing = ({ progress, size = 120 }: { progress: number; size?: number }) => {
	const strokeWidth = 8;
	const radius = (size - strokeWidth) / 2;
	const circumference = radius * 2 * Math.PI;
	const offset = circumference - (progress / 100) * circumference;

	return (
		<div className="relative inline-flex items-center justify-center">
			<svg width={size} height={size} className="-rotate-90">
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="none"
					stroke="var(--shironeri-warm)"
					strokeWidth={strokeWidth}
				/>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="none"
					stroke="var(--aotake)"
					strokeWidth={strokeWidth}
					strokeDasharray={circumference}
					strokeDashoffset={offset}
					strokeLinecap="round"
					className="transition-all duration-500 ease-out"
				/>
			</svg>
			<div className="absolute inset-0 flex flex-col items-center justify-center">
				<span className="text-2xl font-display font-semibold text-[var(--sumi)]">
					{Math.round(progress)}%
				</span>
				<span className="text-xs text-[var(--nezumi)]">完了</span>
			</div>
		</div>
	);
};

// Main Dashboard Component
export const Dashboard = () => {
	const todayReservations = mockReservations.filter(
		(r) => r.status === "confirmed" || r.status === "checked_in",
	);

	const upcomingTasks = mockTasks
		.filter((t) => t.status !== "completed")
		.sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime))
		.slice(0, 8);

	const urgentTasks = mockTasks.filter((t) => t.priority === "urgent" && t.status !== "completed");

	const taskProgress = (mockDailyStats.completedTasks / mockDailyStats.totalTasks) * 100;

	const currentTime = new Date().toLocaleTimeString("ja-JP", {
		hour: "2-digit",
		minute: "2-digit",
	});

	const currentDate = new Date().toLocaleDateString("ja-JP", {
		year: "numeric",
		month: "long",
		day: "numeric",
		weekday: "long",
	});

	return (
		<div className="space-y-8 animate-fade-in">
			{/* Header */}
			<div className="flex items-end justify-between">
				<div>
					<h1 className="text-2xl font-display font-semibold text-[var(--sumi)] ink-stroke inline-block">
						ダッシュボード
					</h1>
					<p className="text-sm text-[var(--nezumi)] mt-2">{currentDate}</p>
				</div>
				<div className="text-right">
					<p className="text-3xl font-display text-[var(--ai)]">{currentTime}</p>
				</div>
			</div>

			{/* Urgent Alerts */}
			{urgentTasks.length > 0 && (
				<div className="shoji-panel p-4 border-l-3 border-l-[var(--shu)] bg-[rgba(199,62,58,0.02)] animate-slide-up">
					<div className="flex items-center gap-3">
						<AlertIcon size={20} className="text-[var(--shu)]" />
						<div>
							<p className="font-display font-medium text-[var(--shu)]">
								緊急タスク: {urgentTasks.length}件
							</p>
							<p className="text-sm text-[var(--sumi-light)]">
								{urgentTasks.map((t) => t.title).join("、")}
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Stats Grid */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				<div className="stagger-1">
					<StatCard
						icon={<ReservationIcon size={28} />}
						label="本日のチェックイン"
						value={mockDailyStats.checkInsToday}
						subValue="予約"
						accent="ai"
					/>
				</div>
				<div className="stagger-2">
					<StatCard
						icon={<TaskIcon size={28} />}
						label="本日のタスク"
						value={mockDailyStats.totalTasks}
						subValue={`完了: ${mockDailyStats.completedTasks}`}
						accent="aotake"
					/>
				</div>
				<div className="stagger-3">
					<StatCard
						icon={<GuestIcon size={28} />}
						label="本日のゲスト"
						value={todayReservations.reduce((sum, r) => sum + r.numberOfGuests, 0)}
						subValue="名様"
						accent="ai"
					/>
				</div>
				<div className="stagger-4">
					<StatCard
						icon={<CelebrationIcon size={28} />}
						label="記念日ゲスト"
						value={mockDailyStats.anniversaryGuests}
						subValue="組"
						accent="kincha"
					/>
				</div>
			</div>

			{/* Main Content Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Task Progress */}
				<div className="shoji-panel p-6 animate-slide-up stagger-1">
					<h2 className="text-lg font-display font-medium text-[var(--sumi)] mb-4 flex items-center gap-2">
						<TimelineIcon size={18} />
						タスク進捗
					</h2>
					<div className="flex flex-col items-center">
						<ProgressRing progress={taskProgress} size={140} />
						<div className="mt-4 grid grid-cols-3 gap-4 w-full text-center">
							<div>
								<p className="text-lg font-display font-semibold text-[var(--aotake)]">
									{mockDailyStats.completedTasks}
								</p>
								<p className="text-xs text-[var(--nezumi)]">完了</p>
							</div>
							<div>
								<p className="text-lg font-display font-semibold text-[var(--ai)]">
									{mockDailyStats.inProgressTasks}
								</p>
								<p className="text-xs text-[var(--nezumi)]">作業中</p>
							</div>
							<div>
								<p className="text-lg font-display font-semibold text-[var(--nezumi)]">
									{mockDailyStats.pendingTasks}
								</p>
								<p className="text-xs text-[var(--nezumi)]">未着手</p>
							</div>
						</div>
					</div>
				</div>

				{/* Today's Reservations */}
				<div className="lg:col-span-2 shoji-panel animate-slide-up stagger-2">
					<div className="p-4 border-b border-[rgba(45,41,38,0.06)]">
						<h2 className="text-lg font-display font-medium text-[var(--sumi)] flex items-center gap-2">
							<ReservationIcon size={18} />
							本日の予約一覧
						</h2>
					</div>
					<div className="table-container shadow-none">
						<table>
							<thead>
								<tr>
									<th className="w-20">到着</th>
									<th className="w-32">部屋</th>
									<th>ゲスト名</th>
									<th className="w-20 text-center">人数</th>
									<th>特記事項</th>
								</tr>
							</thead>
							<tbody>
								{todayReservations.map((reservation) => (
									<ReservationRow key={reservation.id} reservation={reservation} />
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			{/* Upcoming Tasks */}
			<div className="shoji-panel animate-slide-up stagger-3">
				<div className="p-4 border-b border-[rgba(45,41,38,0.06)] flex items-center justify-between">
					<h2 className="text-lg font-display font-medium text-[var(--sumi)] flex items-center gap-2">
						<TaskIcon size={18} />
						直近のタスク
					</h2>
					<span className="text-sm text-[var(--nezumi)]">
						{upcomingTasks.length}件の未完了タスク
					</span>
				</div>
				<div className="table-container shadow-none">
					<table>
						<thead>
							<tr>
								<th className="w-20">時刻</th>
								<th>タスク</th>
								<th className="w-36">担当者</th>
								<th className="w-32">ステータス</th>
							</tr>
						</thead>
						<tbody>
							{upcomingTasks.map((task) => (
								<TaskRow key={task.id} task={task} />
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Quick Task Summary by Category */}
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
				{(["cleaning", "meal_service", "bath", "pickup", "celebration", "turndown"] as const).map(
					(category) => {
						const categoryTasks = mockTasks.filter((t) => t.category === category);
						const completedCount = categoryTasks.filter((t) => t.status === "completed").length;
						return (
							<div
								key={category}
								className="shoji-panel p-4 text-center card-hover animate-slide-up"
							>
								<p className="text-2xl font-display font-semibold text-[var(--sumi)]">
									{completedCount}/{categoryTasks.length}
								</p>
								<p className="text-xs text-[var(--nezumi)] mt-1">
									{TASK_CATEGORY_LABELS[category]}
								</p>
								<div className="mt-2 h-1 bg-[var(--shironeri-warm)] rounded-full overflow-hidden">
									<div
										className="h-full bg-[var(--aotake)] transition-all duration-300"
										style={{
											width: `${categoryTasks.length > 0 ? (completedCount / categoryTasks.length) * 100 : 0}%`,
										}}
									/>
								</div>
							</div>
						);
					},
				)}
			</div>
		</div>
	);
};
