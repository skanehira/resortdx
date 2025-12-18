import { useState } from "react";
import {
	HashRouter,
	Routes,
	Route,
	Navigate,
	useNavigate,
	useLocation,
} from "react-router-dom";
import type { AdminPage } from "./types";
import { Dashboard } from "./components/admin/Dashboard";
import { TaskTemplates } from "./components/admin/TaskTemplates";
import { StaffMonitor } from "./components/admin/StaffMonitor";
import { EquipmentManagement } from "./components/admin/EquipmentManagement";
import { ShuttleManagement } from "./components/admin/ShuttleManagement";
import { TaskHistory } from "./components/admin/TaskHistory";
import { MobileTaskList } from "./components/staff/MobileTaskList";
import { MobileSchedule } from "./components/staff/MobileSchedule";
import { MobileShuttleList } from "./components/staff/MobileShuttleList";
import { GuestShuttleStatus } from "./components/guest/GuestShuttleStatus";
import {
	DashboardIcon,
	TemplateIcon,
	StaffIcon,
	EquipmentIcon,
	HistoryIcon,
	TaskIcon,
	TimelineIcon,
	PhoneIcon,
	MenuIcon,
	CloseIcon,
	ShuttleIcon,
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
			{ page: "staff_monitor", label: "スタッフモニタ", icon: <StaffIcon /> },
			{ page: "equipment", label: "設備管理", icon: <EquipmentIcon /> },
			{ page: "shuttle", label: "送迎管理", icon: <ShuttleIcon /> },
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
								タスク管理システム
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

// Mobile Bottom Navigation for Staff
interface MobileNavProps {
	currentView: "tasks" | "schedule" | "shuttle";
	onViewChange: (view: "tasks" | "schedule" | "shuttle") => void;
	onModeChange: () => void;
}

const MobileBottomNav = ({
	currentView,
	onViewChange,
	onModeChange,
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
				onClick={() => onViewChange("schedule")}
				className={`flex-1 flex flex-col items-center py-3 transition-colors ${
					currentView === "schedule"
						? "text-[var(--ai)]"
						: "text-[var(--nezumi)]"
				}`}
			>
				<TimelineIcon size={22} />
				<span className="text-xs mt-1 font-display">スケジュール</span>
			</button>
			<button
				onClick={() => onViewChange("shuttle")}
				className={`flex-1 flex flex-col items-center py-3 transition-colors ${
					currentView === "shuttle"
						? "text-[var(--ai)]"
						: "text-[var(--nezumi)]"
				}`}
			>
				<ShuttleIcon size={22} />
				<span className="text-xs mt-1 font-display">送迎</span>
			</button>
			<button
				onClick={onModeChange}
				className="flex-1 flex flex-col items-center py-3 text-[var(--nezumi)]"
			>
				<DashboardIcon size={22} />
				<span className="text-xs mt-1 font-display">管理画面</span>
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
				<Route path="task_history" element={<TaskHistory />} />
				<Route path="*" element={<Navigate to="dashboard" replace />} />
			</Routes>
		</AdminLayout>
	);
};

// Staff Pages Wrapper
const StaffPages = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const getCurrentView = (): "tasks" | "schedule" | "shuttle" => {
		if (location.pathname.includes("schedule")) return "schedule";
		if (location.pathname.includes("shuttle")) return "shuttle";
		return "tasks";
	};

	const handleViewChange = (view: "tasks" | "schedule" | "shuttle") => {
		navigate(`/staff/${view}`);
	};

	const handleModeChange = () => {
		navigate("/admin/dashboard");
	};

	return (
		<div className="min-h-screen bg-[var(--shironeri)]">
			<Routes>
				<Route path="tasks" element={<MobileTaskList />} />
				<Route path="schedule" element={<MobileSchedule />} />
				<Route path="shuttle" element={<MobileShuttleList />} />
				<Route path="*" element={<Navigate to="tasks" replace />} />
			</Routes>
			<MobileBottomNav
				currentView={getCurrentView()}
				onViewChange={handleViewChange}
				onModeChange={handleModeChange}
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

// Main App Component
function App() {
	return (
		<HashRouter>
			<Routes>
				<Route path="/admin/*" element={<AdminPages />} />
				<Route path="/staff/*" element={<StaffPages />} />
				<Route path="/guest/shuttle" element={<GuestShuttlePage />} />
				<Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
			</Routes>
		</HashRouter>
	);
}

export default App;
