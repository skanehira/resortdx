import { useState, useCallback } from "react";
import {
	HashRouter,
	Routes,
	Route,
	Navigate,
	useNavigate,
	useLocation,
} from "react-router-dom";
import type {
	AdminPage,
	UnifiedTask,
	UnifiedTaskStatus,
	StaffMessage,
	MealStatus,
	ShuttleStatus,
	CelebrationItemCheck,
	CleaningChecklistItemType,
	EquipmentReport,
	RoomAmenity,
	RoomEquipment,
} from "./types";
import { Dashboard } from "./components/admin/Dashboard";
import { TaskTemplates } from "./components/admin/TaskTemplates";
import { StaffMonitor } from "./components/admin/StaffMonitor";
import { EquipmentManagement } from "./components/admin/EquipmentManagement";
import { ShuttleManagement } from "./components/admin/ShuttleManagement";
import { MealManagement } from "./components/admin/MealManagement";
import { CelebrationManagement } from "./components/admin/CelebrationManagement";
import { TaskHistory } from "./components/admin/TaskHistory";
import { UnifiedTaskList } from "./components/staff/UnifiedTaskList";
import { MobileMessages } from "./components/staff/MobileMessages";
import { GuestShuttleStatus } from "./components/guest/GuestShuttleStatus";
import { GuestMealStatus } from "./components/guest/GuestMealStatus";
import {
	mockStaff,
	mockUnifiedTasks,
	mockStaffMessages,
	roomAmenitiesMap,
	roomEquipmentMap,
} from "./data/mock";
import {
	DashboardIcon,
	TemplateIcon,
	StaffIcon,
	EquipmentIcon,
	HistoryIcon,
	TaskIcon,
	PhoneIcon,
	MenuIcon,
	CloseIcon,
	MessageIcon,
	ShuttleIcon,
	DiningIcon,
	CakeIcon,
} from "./components/ui/Icons";

// Admin Sidebar Navigation
interface SidebarProps {
	currentPage: AdminPage;
	onPageChange: (page: AdminPage) => void;
	onModeChange: () => void;
	isOpen: boolean;
	onClose: () => void;
}

const Sidebar = ({
	currentPage,
	onPageChange,
	onModeChange,
	isOpen,
	onClose,
}: SidebarProps) => {
	const navItems: { page: AdminPage; label: string; icon: React.ReactNode }[] =
		[
			{ page: "dashboard", label: "ダッシュボード", icon: <DashboardIcon /> },
			{
				page: "templates",
				label: "タスクテンプレート",
				icon: <TemplateIcon />,
			},
			{ page: "staff_monitor", label: "スタッフ管理", icon: <StaffIcon /> },
			{ page: "equipment", label: "設備管理", icon: <EquipmentIcon /> },
			{ page: "shuttle", label: "送迎管理", icon: <ShuttleIcon /> },
			{ page: "meal", label: "配膳管理", icon: <DiningIcon /> },
			{ page: "celebration", label: "記念日管理", icon: <CakeIcon /> },
			{
				page: "task_history",
				label: "タスク一覧",
				icon: <HistoryIcon />,
			},
		];

	return (
		<>
			{/* Overlay for mobile */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-black/30 z-40 lg:hidden"
					onClick={onClose}
				/>
			)}

			{/* Sidebar */}
			<aside
				className={`fixed top-0 left-0 h-full w-64 bg-[var(--ai-deep)] text-white z-50 transform transition-transform duration-300 lg:translate-x-0 ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				{/* Logo */}
				<div className="p-6 border-b border-[rgba(255,255,255,0.1)]">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-xl font-display font-semibold">Resort DX</h1>
							<p className="text-xs text-[rgba(255,255,255,0.6)] mt-1">
								リゾート業務管理システム
							</p>
						</div>
						<button onClick={onClose} className="lg:hidden p-1">
							<CloseIcon size={20} />
						</button>
					</div>
				</div>

				{/* Navigation */}
				<nav className="p-4 space-y-1">
					{navItems.map((item) => (
						<button
							key={item.page}
							onClick={() => {
								onPageChange(item.page);
								onClose();
							}}
							className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-left transition-all ${
								currentPage === item.page
									? "bg-[rgba(255,255,255,0.15)] text-white"
									: "text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.08)] hover:text-white"
							}`}
						>
							{item.icon}
							<span className="font-display text-sm">{item.label}</span>
						</button>
					))}
				</nav>

				{/* Mode Switch */}
				<div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[rgba(255,255,255,0.1)]">
					<button
						onClick={onModeChange}
						className="w-full flex items-center gap-3 px-4 py-3 bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.15)] rounded-md transition-all"
					>
						<PhoneIcon size={18} />
						<span className="font-display text-sm">スタッフ画面へ</span>
					</button>
				</div>
			</aside>
		</>
	);
};

// Mobile Bottom Navigation for Staff (3-tab layout)
type StaffView = "tasks" | "messages";

interface MobileNavProps {
	currentView: StaffView;
	onViewChange: (view: StaffView) => void;
	onModeChange: () => void;
	hasUnreadMessages?: boolean;
}

const MobileBottomNav = ({
	currentView,
	onViewChange,
	onModeChange,
	hasUnreadMessages = false,
}: MobileNavProps) => (
	<nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[rgba(45,41,38,0.1)] z-50 safe-area-pb">
		<div className="flex">
			<button
				onClick={() => onViewChange("tasks")}
				className={`flex-1 flex flex-col items-center py-3 transition-colors ${
					currentView === "tasks" ? "text-[var(--ai)]" : "text-[var(--nezumi)]"
				}`}
			>
				<TaskIcon size={22} />
				<span className="text-xs mt-1 font-display">タスク</span>
			</button>
			<button
				onClick={() => onViewChange("messages")}
				className={`flex-1 flex flex-col items-center py-3 transition-colors relative ${
					currentView === "messages"
						? "text-[var(--ai)]"
						: "text-[var(--nezumi)]"
				}`}
			>
				<div className="relative">
					<MessageIcon size={22} />
					{hasUnreadMessages && (
						<span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[var(--shu)] rounded-full" />
					)}
				</div>
				<span className="text-xs mt-1 font-display">メッセージ</span>
			</button>
			<button
				onClick={onModeChange}
				className="flex-1 flex flex-col items-center py-3 text-[var(--nezumi)]"
			>
				<DashboardIcon size={22} />
				<span className="text-xs mt-1 font-display">管理</span>
			</button>
		</div>
	</nav>
);

// Admin Layout
interface AdminLayoutProps {
	children: React.ReactNode;
	currentPage: AdminPage;
	onPageChange: (page: AdminPage) => void;
	onModeChange: () => void;
}

const AdminLayout = ({
	children,
	currentPage,
	onPageChange,
	onModeChange,
}: AdminLayoutProps) => {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<div className="min-h-screen bg-[var(--shironeri)] washi-bg fusuma-grid">
			<Sidebar
				currentPage={currentPage}
				onPageChange={onPageChange}
				onModeChange={onModeChange}
				isOpen={sidebarOpen}
				onClose={() => setSidebarOpen(false)}
			/>

			{/* Main Content */}
			<div className="lg:ml-64">
				{/* Top Bar */}
				<header className="sticky top-0 z-30 bg-[var(--shironeri)]/80 backdrop-blur-sm border-b border-[rgba(45,41,38,0.06)]">
					<div className="flex items-center justify-between px-4 py-3 lg:px-8">
						<button
							onClick={() => setSidebarOpen(true)}
							className="lg:hidden p-2 text-[var(--sumi)]"
						>
							<MenuIcon size={24} />
						</button>
						<div className="hidden lg:block" />
						<div className="flex items-center gap-4">
							<span className="text-sm text-[var(--nezumi)]">管理者モード</span>
							<div className="w-8 h-8 bg-[var(--ai)] rounded-full flex items-center justify-center text-white text-sm font-medium">
								管
							</div>
						</div>
					</div>
				</header>

				{/* Page Content */}
				<main className="p-4 lg:p-8">{children}</main>
			</div>
		</div>
	);
};

// Admin Pages Wrapper
const AdminPages = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const getCurrentPage = (): AdminPage => {
		const path = location.pathname;
		if (path.includes("templates")) return "templates";
		if (path.includes("staff_monitor")) return "staff_monitor";
		if (path.includes("equipment")) return "equipment";
		if (path.includes("shuttle")) return "shuttle";
		if (path.includes("meal")) return "meal";
		if (path.includes("celebration")) return "celebration";
		if (path.includes("task_history")) return "task_history";
		return "dashboard";
	};

	const handlePageChange = (page: AdminPage) => {
		navigate(`/admin/${page}`);
	};

	const handleModeChange = () => {
		navigate("/staff/tasks");
	};

	return (
		<AdminLayout
			currentPage={getCurrentPage()}
			onPageChange={handlePageChange}
			onModeChange={handleModeChange}
		>
			<Routes>
				<Route path="dashboard" element={<Dashboard />} />
				<Route path="templates" element={<TaskTemplates />} />
				<Route path="staff_monitor" element={<StaffMonitor />} />
				<Route path="equipment" element={<EquipmentManagement />} />
				<Route path="shuttle" element={<ShuttleManagement />} />
				<Route path="meal" element={<MealManagement />} />
				<Route path="celebration" element={<CelebrationManagement />} />
				<Route path="task_history" element={<TaskHistory />} />
				<Route path="*" element={<Navigate to="dashboard" replace />} />
			</Routes>
		</AdminLayout>
	);
};

// Staff Pages Wrapper with state management
const StaffPages = () => {
	const navigate = useNavigate();
	const location = useLocation();

	// デモ用: 最初のスタッフをログインユーザーとして使用
	const currentStaff = mockStaff[0];

	// 統合タスクのステート
	const [unifiedTasks, setUnifiedTasks] =
		useState<UnifiedTask[]>(mockUnifiedTasks);

	// メッセージのステート
	const [messages, setMessages] = useState<StaffMessage[]>(mockStaffMessages);

	// アメニティと設備データ
	const [roomAmenities] =
		useState<Record<string, RoomAmenity[]>>(roomAmenitiesMap);
	const [roomEquipment] =
		useState<Record<string, RoomEquipment[]>>(roomEquipmentMap);

	// カテゴリフィルターの状態保持（画面遷移しても保持）
	const [categoryFilter, setCategoryFilter] = useState<
		| "all"
		| "cleaning"
		| "inspection"
		| "meal"
		| "shuttle"
		| "celebration"
		| "help_request"
	>("all");

	// 未読メッセージの確認
	const hasUnreadMessages = messages.some(
		(m) => m.senderId === currentStaff.id && m.reply !== undefined && !m.readAt,
	);

	// タスクステータス変更ハンドラー
	const handleStatusChange = useCallback(
		(taskId: string, newStatus: UnifiedTaskStatus) => {
			setUnifiedTasks((prev) =>
				prev.map((task) =>
					task.id === taskId
						? {
								...task,
								status: newStatus,
								completedAt:
									newStatus === "completed"
										? new Date().toISOString()
										: task.completedAt,
							}
						: task,
				),
			);
		},
		[],
	);

	// 清掃チェックリストトグル
	const handleToggleCleaningItem = useCallback(
		(taskId: string, item: CleaningChecklistItemType) => {
			setUnifiedTasks((prev) =>
				prev.map((task) => {
					if (task.id !== taskId || !task.housekeeping?.cleaningChecklist)
						return task;
					return {
						...task,
						housekeeping: {
							...task.housekeeping,
							cleaningChecklist: task.housekeeping.cleaningChecklist.map(
								(checkItem) =>
									checkItem.item === item
										? { ...checkItem, isChecked: !checkItem.isChecked }
										: checkItem,
							),
						},
					};
				}),
			);
		},
		[],
	);

	// 配膳ステータス変更
	const handleMealStatusChange = useCallback(
		(taskId: string, newMealStatus: MealStatus) => {
			setUnifiedTasks((prev) =>
				prev.map((task) => {
					if (task.id !== taskId || !task.meal) return task;
					return {
						...task,
						meal: { ...task.meal, mealStatus: newMealStatus },
					};
				}),
			);
		},
		[],
	);

	// 送迎ステータス変更
	const handleShuttleStatusChange = useCallback(
		(taskId: string, newShuttleStatus: ShuttleStatus) => {
			setUnifiedTasks((prev) =>
				prev.map((task) => {
					if (task.id !== taskId || !task.shuttle) return task;
					return {
						...task,
						shuttle: { ...task.shuttle, shuttleStatus: newShuttleStatus },
					};
				}),
			);
		},
		[],
	);

	// 送迎メッセージ送信
	const handleSendShuttleMessage = useCallback(
		(
			taskId: string,
			content: string,
			messageType: "normal" | "arrival" | "delay" | "sos",
		) => {
			setUnifiedTasks((prev) =>
				prev.map((task) => {
					if (task.id !== taskId || !task.shuttle) return task;
					const newMessage = {
						id: `MSG-${Date.now()}`,
						shuttleTaskId: taskId,
						senderType: "staff" as const,
						senderId: currentStaff?.id || "unknown",
						senderName: currentStaff?.name || "スタッフ",
						content,
						messageType,
						sentAt: new Date().toISOString(),
						readAt: null,
						isQuickMessage: messageType !== "normal",
					};
					return {
						...task,
						shuttle: {
							...task.shuttle,
							messages: [...(task.shuttle.messages || []), newMessage],
							lastMessageAt: newMessage.sentAt,
							hasUnreadGuestMessages: true,
						},
					};
				}),
			);
		},
		[currentStaff?.id, currentStaff?.name],
	);

	// お祝いアイテムトグル
	const handleToggleCelebrationItem = useCallback(
		(taskId: string, item: CelebrationItemCheck["item"]) => {
			setUnifiedTasks((prev) =>
				prev.map((task) => {
					if (task.id !== taskId || !task.celebration) return task;
					return {
						...task,
						celebration: {
							...task.celebration,
							items: task.celebration.items.map((itemCheck) =>
								itemCheck.item === item
									? { ...itemCheck, isChecked: !itemCheck.isChecked }
									: itemCheck,
							),
						},
					};
				}),
			);
		},
		[],
	);

	// お祝い完了レポート
	const handleCelebrationReport = useCallback(
		(taskId: string, report: string) => {
			setUnifiedTasks((prev) =>
				prev.map((task) => {
					if (task.id !== taskId || !task.celebration) return task;
					return {
						...task,
						celebration: { ...task.celebration, completionReport: report },
					};
				}),
			);
		},
		[],
	);

	// ヘルプ依頼の受諾
	const handleAcceptHelp = useCallback(
		(taskId: string) => {
			setUnifiedTasks((prev) =>
				prev.map((task) => {
					if (task.id !== taskId || !task.helpRequest) return task;
					return {
						...task,
						status: "in_progress",
						assignedStaffId: currentStaff.id,
						helpRequest: {
							...task.helpRequest,
							helpStatus: "accepted",
							acceptedBy: currentStaff.id,
							acceptedAt: new Date().toISOString(),
						},
					};
				}),
			);
		},
		[currentStaff.id],
	);

	// ヘルプ完了
	const handleCompleteHelp = useCallback((taskId: string) => {
		setUnifiedTasks((prev) =>
			prev.map((task) => {
				if (task.id !== taskId || !task.helpRequest) return task;
				return {
					...task,
					helpRequest: { ...task.helpRequest, helpStatus: "completed" },
				};
			}),
		);
	}, []);

	// ヘルプキャンセル
	const handleCancelHelp = useCallback((taskId: string) => {
		setUnifiedTasks((prev) =>
			prev.map((task) => {
				if (task.id !== taskId || !task.helpRequest) return task;
				return {
					...task,
					status: "completed",
					helpRequest: { ...task.helpRequest, helpStatus: "cancelled" },
				};
			}),
		);
	}, []);

	// 設備報告
	const handleEquipmentReport = useCallback(
		(roomNumber: string, report: EquipmentReport) => {
			console.log("Equipment report submitted:", roomNumber, report);
			// 実際の実装ではサーバーに送信
		},
		[],
	);

	// ヘルプ依頼作成
	const handleCreateHelpRequest = useCallback(
		(data: {
			targetStaffIds: string[] | "all";
			message: string;
			relatedTaskId?: string;
		}) => {
			const newHelpTask: UnifiedTask = {
				id: `help-${Date.now()}`,
				type: "help_request",
				title: "ヘルプ依頼",
				description: data.message,
				roomNumber: null,
				scheduledTime: new Date().toLocaleTimeString("ja-JP", {
					hour: "2-digit",
					minute: "2-digit",
				}),
				estimatedDuration: 30,
				status: "pending",
				assignedStaffId: null,
				priority: "high",
				isAnniversaryRelated: false,
				completedAt: null,
				createdAt: new Date().toISOString(),
				notes: null,
				helpRequest: {
					requesterId: currentStaff.id,
					requesterName: currentStaff.name,
					targetStaffIds: data.targetStaffIds,
					message: data.message,
					helpStatus: "pending",
					acceptedBy: null,
					acceptedAt: null,
					originalTaskId: data.relatedTaskId,
				},
			};
			setUnifiedTasks((prev) => [newHelpTask, ...prev]);
		},
		[currentStaff.id, currentStaff.name],
	);

	// メッセージ送信
	const handleSendMessage = useCallback(
		(content: string, relatedTaskId?: string) => {
			const newMessage: StaffMessage = {
				id: `msg-${Date.now()}`,
				senderId: currentStaff.id,
				senderName: currentStaff.name,
				content,
				sentAt: new Date().toISOString(),
				readAt: null,
				relatedTaskId,
			};
			setMessages((prev) => [newMessage, ...prev]);
		},
		[currentStaff.id, currentStaff.name],
	);

	const getCurrentView = (): StaffView => {
		if (location.pathname.includes("messages")) return "messages";
		return "tasks";
	};

	const handleViewChange = (view: StaffView) => {
		navigate(`/staff/${view}`);
	};

	const handleModeChange = () => {
		navigate("/admin/dashboard");
	};

	return (
		<div className="min-h-screen bg-[var(--shironeri)]">
			<Routes>
				<Route
					path="tasks"
					element={
						<UnifiedTaskList
							tasks={unifiedTasks}
							currentStaff={currentStaff}
							allStaff={mockStaff}
							roomAmenities={roomAmenities}
							roomEquipment={roomEquipment}
							onStatusChange={handleStatusChange}
							onToggleCleaningItem={handleToggleCleaningItem}
							onMealStatusChange={handleMealStatusChange}
							onShuttleStatusChange={handleShuttleStatusChange}
							onSendShuttleMessage={handleSendShuttleMessage}
							onToggleCelebrationItem={handleToggleCelebrationItem}
							onCelebrationReport={handleCelebrationReport}
							onAcceptHelp={handleAcceptHelp}
							onCompleteHelp={handleCompleteHelp}
							onCancelHelp={handleCancelHelp}
							onEquipmentReport={handleEquipmentReport}
							onCreateHelpRequest={handleCreateHelpRequest}
							categoryFilter={categoryFilter}
							onCategoryFilterChange={setCategoryFilter}
						/>
					}
				/>
				<Route
					path="messages"
					element={
						<MobileMessages
							messages={messages}
							currentStaff={currentStaff}
							tasks={unifiedTasks}
							onSendMessage={handleSendMessage}
						/>
					}
				/>
				<Route path="*" element={<Navigate to="tasks" replace />} />
			</Routes>
			<MobileBottomNav
				currentView={getCurrentView()}
				onViewChange={handleViewChange}
				onModeChange={handleModeChange}
				hasUnreadMessages={hasUnreadMessages}
			/>
		</div>
	);
};

// Guest Shuttle Status Page Wrapper
const GuestShuttlePage = () => {
	// URLパラメータからtaskIdを取得（実際の実装では認証トークンなども含む）
	const params = new URLSearchParams(window.location.hash.split("?")[1] || "");
	const taskId = params.get("id") || undefined;

	return <GuestShuttleStatus taskId={taskId} />;
};

// Guest Meal Status Page Wrapper
const GuestMealPage = () => {
	// URLパラメータからtaskIdを取得（実際の実装では認証トークンなども含む）
	const params = new URLSearchParams(window.location.hash.split("?")[1] || "");
	const taskId = params.get("id") || undefined;

	return <GuestMealStatus taskId={taskId} />;
};

// Main App Component
function App() {
	return (
		<HashRouter>
			<Routes>
				<Route path="/admin/*" element={<AdminPages />} />
				<Route path="/staff/*" element={<StaffPages />} />
				<Route path="/guest/shuttle" element={<GuestShuttlePage />} />
				<Route path="/guest/meal" element={<GuestMealPage />} />
				<Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
			</Routes>
		</HashRouter>
	);
}

export default App;
