import { useState, useMemo } from "react";
import {
	mockRoomAmenities,
	mockRoomEquipments,
	mockReservations,
	getRoomEquipmentStatus,
	getStaffById,
} from "../../data/mockData";
import {
	AMENITY_TYPE_LABELS,
	EQUIPMENT_TYPE_LABELS,
	STOCK_LEVEL_LABELS,
	STOCK_LEVEL_VALUES,
	EQUIPMENT_STATUS_LABELS,
	ROOM_TYPE_LABELS,
	type RoomAmenity,
	type RoomEquipment,
	type StockLevel,
	type EquipmentStatusType,
} from "../../types";
import {
	RoomIcon,
	AlertIcon,
	AmenityIcon,
	EquipmentIcon,
	WrenchIcon,
	CheckIcon,
	PackageIcon,
} from "../ui/Icons";
import { Modal } from "../ui/Modal";

// Type for filter
type FilterType = "all" | "needs_attention" | "amenities" | "equipment";

// Stock Level Indicator Component
const StockLevelIndicator = ({ level }: { level: StockLevel }) => {
	const levelValue = STOCK_LEVEL_VALUES[level];
	const dots = [1, 2, 3, 4];

	return (
		<div className="flex items-center gap-1">
			{dots.map((dot) => (
				<div
					key={dot}
					className={`w-2 h-2 rounded-full ${
						dot <= levelValue
							? level === "empty"
								? "bg-[var(--shu)]"
								: level === "low"
									? "bg-[var(--kincha)]"
									: "bg-[var(--aotake)]"
							: "bg-[var(--shironeri-warm)]"
					}`}
				/>
			))}
			<span
				className={`ml-2 text-xs ${
					level === "empty"
						? "text-[var(--shu)]"
						: level === "low"
							? "text-[var(--kincha)]"
							: "text-[var(--nezumi)]"
				}`}
			>
				{STOCK_LEVEL_LABELS[level]}
			</span>
		</div>
	);
};

// Equipment Status Badge Component
const EquipmentStatusBadge = ({ status }: { status: EquipmentStatusType }) => {
	const config = {
		working: { class: "badge-completed", icon: <CheckIcon size={12} /> },
		needs_maintenance: {
			class: "badge-in-progress",
			icon: <WrenchIcon size={12} />,
		},
		broken: { class: "badge-urgent", icon: <AlertIcon size={12} /> },
	};

	return (
		<span className={`badge ${config[status].class} flex items-center gap-1`}>
			{config[status].icon}
			{EQUIPMENT_STATUS_LABELS[status]}
		</span>
	);
};

// Summary Stats Component
const SummaryStats = ({
	needsReplenishment,
	needsMaintenance,
	normalCount,
}: {
	needsReplenishment: number;
	needsMaintenance: number;
	normalCount: number;
}) => (
	<div className="grid grid-cols-3 gap-4">
		<div className="shoji-panel p-4 border-l-3 border-l-[var(--kincha)]">
			<div className="flex items-center gap-3">
				<div className="w-10 h-10 bg-[rgba(184,134,11,0.1)] rounded-lg flex items-center justify-center">
					<PackageIcon size={20} className="text-[var(--kincha)]" />
				</div>
				<div>
					<p className="text-2xl font-display font-semibold text-[var(--kincha)]">
						{needsReplenishment}
					</p>
					<p className="text-xs text-[var(--nezumi)]">要補充</p>
				</div>
			</div>
		</div>
		<div className="shoji-panel p-4 border-l-3 border-l-[var(--shu)]">
			<div className="flex items-center gap-3">
				<div className="w-10 h-10 bg-[rgba(199,62,58,0.1)] rounded-lg flex items-center justify-center">
					<WrenchIcon size={20} className="text-[var(--shu)]" />
				</div>
				<div>
					<p className="text-2xl font-display font-semibold text-[var(--shu)]">
						{needsMaintenance}
					</p>
					<p className="text-xs text-[var(--nezumi)]">要メンテナンス</p>
				</div>
			</div>
		</div>
		<div className="shoji-panel p-4 border-l-3 border-l-[var(--aotake)]">
			<div className="flex items-center gap-3">
				<div className="w-10 h-10 bg-[rgba(93,174,139,0.1)] rounded-lg flex items-center justify-center">
					<CheckIcon size={20} className="text-[var(--aotake)]" />
				</div>
				<div>
					<p className="text-2xl font-display font-semibold text-[var(--aotake)]">
						{normalCount}
					</p>
					<p className="text-xs text-[var(--nezumi)]">正常</p>
				</div>
			</div>
		</div>
	</div>
);

// Filter Tabs Component
const FilterTabs = ({
	selected,
	onChange,
}: {
	selected: FilterType;
	onChange: (filter: FilterType) => void;
}) => {
	const tabs: { key: FilterType; label: string }[] = [
		{ key: "all", label: "すべて" },
		{ key: "needs_attention", label: "要対応" },
		{ key: "amenities", label: "消耗品" },
		{ key: "equipment", label: "設備" },
	];

	return (
		<div className="flex gap-2">
			{tabs.map((tab) => (
				<button
					key={tab.key}
					onClick={() => onChange(tab.key)}
					className={`px-4 py-2 text-sm font-display rounded-md transition-all ${
						selected === tab.key
							? "bg-[var(--ai)] text-white"
							: "bg-[var(--shironeri-warm)] text-[var(--sumi)] hover:bg-[rgba(27,73,101,0.1)]"
					}`}
				>
					{tab.label}
				</button>
			))}
		</div>
	);
};

// Room Card Component
const RoomCard = ({
	roomNumber,
	isSelected,
	onSelect,
}: {
	roomNumber: string;
	isSelected: boolean;
	onSelect: () => void;
}) => {
	const status = getRoomEquipmentStatus(roomNumber);
	const reservation = mockReservations.find((r) => r.roomNumber === roomNumber);
	const hasIssues = status.amenitiesLow > 0 || status.equipmentIssues > 0;

	return (
		<button
			onClick={onSelect}
			className={`w-full p-4 rounded-lg text-left transition-all ${
				isSelected
					? "bg-[var(--ai)] text-white"
					: hasIssues
						? "bg-[rgba(184,134,11,0.05)] hover:bg-[rgba(184,134,11,0.1)]"
						: "bg-white hover:bg-[var(--shironeri-warm)]"
			} border ${isSelected ? "border-[var(--ai)]" : "border-[rgba(45,41,38,0.08)]"}`}
		>
			<div className="flex items-center justify-between mb-2">
				<div className="flex items-center gap-2">
					<RoomIcon
						size={18}
						className={isSelected ? "text-white" : "text-[var(--ai)]"}
					/>
					<span className="font-display font-semibold">{roomNumber}号室</span>
				</div>
				{hasIssues && !isSelected && (
					<span className="w-2 h-2 rounded-full bg-[var(--kincha)]" />
				)}
			</div>
			{reservation && (
				<p
					className={`text-xs ${isSelected ? "text-white/80" : "text-[var(--nezumi)]"}`}
				>
					{reservation.guestName} 様
				</p>
			)}
			<div
				className={`flex gap-3 mt-2 text-xs ${isSelected ? "text-white/80" : "text-[var(--nezumi)]"}`}
			>
				{status.amenitiesLow > 0 && (
					<span
						className={
							isSelected ? "text-white" : "text-[var(--kincha)] font-medium"
						}
					>
						補充: {status.amenitiesLow}件
					</span>
				)}
				{status.equipmentIssues > 0 && (
					<span
						className={
							isSelected ? "text-white" : "text-[var(--shu)] font-medium"
						}
					>
						設備: {status.equipmentIssues}件
					</span>
				)}
				{!hasIssues && <span>正常</span>}
			</div>
		</button>
	);
};

// Amenity Row Component
const AmenityRow = ({
	amenity,
	onUpdate,
}: {
	amenity: RoomAmenity;
	onUpdate: (amenity: RoomAmenity) => void;
}) => {
	const isLow =
		STOCK_LEVEL_VALUES[amenity.stockLevel] <=
		STOCK_LEVEL_VALUES[amenity.threshold];
	const staff = amenity.lastCheckedBy
		? getStaffById(amenity.lastCheckedBy)
		: null;

	return (
		<div
			className={`flex items-center justify-between p-3 rounded-lg ${
				isLow ? "bg-[rgba(184,134,11,0.05)]" : "bg-[var(--shironeri-warm)]"
			}`}
		>
			<div className="flex items-center gap-3">
				<AmenityIcon
					size={18}
					className={isLow ? "text-[var(--kincha)]" : "text-[var(--nezumi)]"}
				/>
				<div>
					<p className="font-medium text-sm">
						{AMENITY_TYPE_LABELS[amenity.type]}
					</p>
					<p className="text-xs text-[var(--nezumi)]">
						最終確認: {amenity.lastCheckedAt}
						{staff && ` (${staff.name})`}
					</p>
				</div>
			</div>
			<div className="flex items-center gap-3">
				<StockLevelIndicator level={amenity.stockLevel} />
				<button
					onClick={() => onUpdate(amenity)}
					className="px-3 py-1 text-xs bg-white border border-[rgba(45,41,38,0.12)] rounded hover:bg-[var(--shironeri-warm)] transition-colors"
				>
					更新
				</button>
			</div>
		</div>
	);
};

// Equipment Row Component
const EquipmentRow = ({
	equipment,
	onUpdate,
}: {
	equipment: RoomEquipment;
	onUpdate: (equipment: RoomEquipment) => void;
}) => {
	const hasIssue = equipment.status !== "working";

	return (
		<div
			className={`flex items-center justify-between p-3 rounded-lg ${
				hasIssue ? "bg-[rgba(199,62,58,0.05)]" : "bg-[var(--shironeri-warm)]"
			}`}
		>
			<div className="flex items-center gap-3">
				<EquipmentIcon
					size={18}
					className={hasIssue ? "text-[var(--shu)]" : "text-[var(--nezumi)]"}
				/>
				<div>
					<p className="font-medium text-sm">
						{EQUIPMENT_TYPE_LABELS[equipment.type]}
					</p>
					<p className="text-xs text-[var(--nezumi)]">
						最終メンテナンス: {equipment.lastMaintenanceAt || "未実施"}
					</p>
					{equipment.notes && (
						<p className="text-xs text-[var(--shu)] mt-1">{equipment.notes}</p>
					)}
				</div>
			</div>
			<div className="flex items-center gap-3">
				<EquipmentStatusBadge status={equipment.status} />
				<button
					onClick={() => onUpdate(equipment)}
					className="px-3 py-1 text-xs bg-white border border-[rgba(45,41,38,0.12)] rounded hover:bg-[var(--shironeri-warm)] transition-colors"
				>
					更新
				</button>
			</div>
		</div>
	);
};

// Room Detail Panel Component
const RoomDetailPanel = ({
	roomNumber,
	amenities,
	equipment,
	filter,
	onUpdateAmenity,
	onUpdateEquipment,
}: {
	roomNumber: string;
	amenities: RoomAmenity[];
	equipment: RoomEquipment[];
	filter: FilterType;
	onUpdateAmenity: (amenity: RoomAmenity) => void;
	onUpdateEquipment: (equipment: RoomEquipment) => void;
}) => {
	const reservation = mockReservations.find((r) => r.roomNumber === roomNumber);

	const showAmenities =
		filter === "all" || filter === "amenities" || filter === "needs_attention";
	const showEquipment =
		filter === "all" || filter === "equipment" || filter === "needs_attention";

	const filteredAmenities =
		filter === "needs_attention"
			? amenities.filter(
					(a) =>
						STOCK_LEVEL_VALUES[a.stockLevel] <= STOCK_LEVEL_VALUES[a.threshold],
				)
			: amenities;

	const filteredEquipment =
		filter === "needs_attention"
			? equipment.filter((e) => e.status !== "working")
			: equipment;

	return (
		<div className="shoji-panel p-6 h-full overflow-y-auto">
			{/* Header */}
			<div className="mb-6">
				<div className="flex items-center gap-3 mb-2">
					<span className="px-3 py-1 bg-[var(--ai)] text-white text-sm font-display rounded">
						{roomNumber}号室
					</span>
					{reservation && (
						<span className="text-sm text-[var(--nezumi)]">
							{ROOM_TYPE_LABELS[reservation.roomType]}
						</span>
					)}
				</div>
				{reservation && (
					<p className="text-sm text-[var(--sumi)]">
						{reservation.guestName} 様 ({reservation.numberOfGuests}名)
					</p>
				)}
			</div>

			{/* Amenities Section */}
			{showAmenities && filteredAmenities.length > 0 && (
				<div className="mb-6">
					<h3 className="flex items-center gap-2 text-sm font-display font-semibold text-[var(--sumi)] mb-3">
						<AmenityIcon size={16} />
						アメニティ
					</h3>
					<div className="space-y-2">
						{filteredAmenities.map((amenity) => (
							<AmenityRow
								key={amenity.id}
								amenity={amenity}
								onUpdate={onUpdateAmenity}
							/>
						))}
					</div>
				</div>
			)}

			{/* Equipment Section */}
			{showEquipment && filteredEquipment.length > 0 && (
				<div>
					<h3 className="flex items-center gap-2 text-sm font-display font-semibold text-[var(--sumi)] mb-3">
						<EquipmentIcon size={16} />
						設備
					</h3>
					<div className="space-y-2">
						{filteredEquipment.map((equip) => (
							<EquipmentRow
								key={equip.id}
								equipment={equip}
								onUpdate={onUpdateEquipment}
							/>
						))}
					</div>
				</div>
			)}

			{/* Empty State */}
			{filter === "needs_attention" &&
				filteredAmenities.length === 0 &&
				filteredEquipment.length === 0 && (
					<div className="text-center py-12">
						<CheckIcon
							size={48}
							className="mx-auto text-[var(--aotake)] mb-4"
						/>
						<p className="text-[var(--aotake)] font-medium">
							この部屋は問題ありません
						</p>
					</div>
				)}
		</div>
	);
};

// Update Amenity Modal
const UpdateAmenityModal = ({
	amenity,
	isOpen,
	onClose,
	onSave,
}: {
	amenity: RoomAmenity | null;
	isOpen: boolean;
	onClose: () => void;
	onSave: (id: string, level: StockLevel) => void;
}) => {
	const [selectedLevel, setSelectedLevel] = useState<StockLevel>(
		amenity?.stockLevel || "full",
	);

	if (!amenity) return null;

	const levels: StockLevel[] = ["full", "half", "low", "empty"];

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={`${AMENITY_TYPE_LABELS[amenity.type]} - 残量更新`}
			size="sm"
		>
			<div className="space-y-4">
				<p className="text-sm text-[var(--nezumi)]">
					{amenity.roomNumber}号室の残量を選択してください
				</p>
				<div className="grid grid-cols-2 gap-2">
					{levels.map((level) => (
						<button
							key={level}
							onClick={() => setSelectedLevel(level)}
							className={`p-3 rounded-lg border-2 transition-all ${
								selectedLevel === level
									? "border-[var(--ai)] bg-[rgba(27,73,101,0.05)]"
									: "border-[rgba(45,41,38,0.12)] hover:border-[var(--ai)]"
							}`}
						>
							<StockLevelIndicator level={level} />
						</button>
					))}
				</div>
				<div className="flex gap-3 pt-4">
					<button
						onClick={onClose}
						className="flex-1 px-4 py-2 text-sm border border-[rgba(45,41,38,0.12)] rounded-lg hover:bg-[var(--shironeri-warm)] transition-colors"
					>
						キャンセル
					</button>
					<button
						onClick={() => {
							onSave(amenity.id, selectedLevel);
							onClose();
						}}
						className="flex-1 px-4 py-2 text-sm bg-[var(--ai)] text-white rounded-lg hover:bg-[var(--ai-deep)] transition-colors"
					>
						保存
					</button>
				</div>
			</div>
		</Modal>
	);
};

// Update Equipment Modal
const UpdateEquipmentModal = ({
	equipment,
	isOpen,
	onClose,
	onSave,
}: {
	equipment: RoomEquipment | null;
	isOpen: boolean;
	onClose: () => void;
	onSave: (id: string, status: EquipmentStatusType, notes: string) => void;
}) => {
	const [selectedStatus, setSelectedStatus] = useState<EquipmentStatusType>(
		equipment?.status || "working",
	);
	const [notes, setNotes] = useState(equipment?.notes || "");

	if (!equipment) return null;

	const statuses: EquipmentStatusType[] = [
		"working",
		"needs_maintenance",
		"broken",
	];

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={`${EQUIPMENT_TYPE_LABELS[equipment.type]} - 状態更新`}
			size="sm"
		>
			<div className="space-y-4">
				<p className="text-sm text-[var(--nezumi)]">
					{equipment.roomNumber}号室の設備状態を選択してください
				</p>
				<div className="space-y-2">
					{statuses.map((status) => (
						<button
							key={status}
							onClick={() => setSelectedStatus(status)}
							className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
								selectedStatus === status
									? "border-[var(--ai)] bg-[rgba(27,73,101,0.05)]"
									: "border-[rgba(45,41,38,0.12)] hover:border-[var(--ai)]"
							}`}
						>
							<EquipmentStatusBadge status={status} />
						</button>
					))}
				</div>
				{selectedStatus !== "working" && (
					<div>
						<label className="block text-xs text-[var(--nezumi)] mb-1">
							備考
						</label>
						<textarea
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							className="w-full p-2 text-sm border border-[rgba(45,41,38,0.12)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ai)]"
							rows={2}
							placeholder="状態の詳細を入力..."
						/>
					</div>
				)}
				<div className="flex gap-3 pt-4">
					<button
						onClick={onClose}
						className="flex-1 px-4 py-2 text-sm border border-[rgba(45,41,38,0.12)] rounded-lg hover:bg-[var(--shironeri-warm)] transition-colors"
					>
						キャンセル
					</button>
					<button
						onClick={() => {
							onSave(equipment.id, selectedStatus, notes);
							onClose();
						}}
						className="flex-1 px-4 py-2 text-sm bg-[var(--ai)] text-white rounded-lg hover:bg-[var(--ai-deep)] transition-colors"
					>
						保存
					</button>
				</div>
			</div>
		</Modal>
	);
};

// Main Component
export const EquipmentManagement = () => {
	const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
	const [filter, setFilter] = useState<FilterType>("all");
	const [amenities, setAmenities] = useState<RoomAmenity[]>(mockRoomAmenities);
	const [equipment, setEquipment] =
		useState<RoomEquipment[]>(mockRoomEquipments);
	const [editingAmenity, setEditingAmenity] = useState<RoomAmenity | null>(
		null,
	);
	const [editingEquipment, setEditingEquipment] =
		useState<RoomEquipment | null>(null);

	// Get unique room numbers
	const roomNumbers = useMemo(() => {
		const rooms = new Set<string>();
		for (const r of mockReservations) {
			rooms.add(r.roomNumber);
		}
		return Array.from(rooms).sort();
	}, []);

	// Calculate stats
	const stats = useMemo(() => {
		const needsReplenishment = amenities.filter(
			(a) =>
				STOCK_LEVEL_VALUES[a.stockLevel] <= STOCK_LEVEL_VALUES[a.threshold],
		).length;
		const needsMaintenance = equipment.filter(
			(e) => e.status !== "working",
		).length;
		const normalCount =
			amenities.length +
			equipment.length -
			needsReplenishment -
			needsMaintenance;
		return { needsReplenishment, needsMaintenance, normalCount };
	}, [amenities, equipment]);

	// Filter rooms based on filter type
	const filteredRooms = useMemo(() => {
		if (filter === "needs_attention") {
			return roomNumbers.filter((room) => {
				const roomAmenities = amenities.filter((a) => a.roomNumber === room);
				const roomEquipment = equipment.filter((e) => e.roomNumber === room);
				const hasLowAmenities = roomAmenities.some(
					(a) =>
						STOCK_LEVEL_VALUES[a.stockLevel] <= STOCK_LEVEL_VALUES[a.threshold],
				);
				const hasEquipmentIssues = roomEquipment.some(
					(e) => e.status !== "working",
				);
				return hasLowAmenities || hasEquipmentIssues;
			});
		}
		return roomNumbers;
	}, [roomNumbers, amenities, equipment, filter]);

	// Get amenities and equipment for selected room
	const selectedRoomAmenities = selectedRoom
		? amenities.filter((a) => a.roomNumber === selectedRoom)
		: [];
	const selectedRoomEquipment = selectedRoom
		? equipment.filter((e) => e.roomNumber === selectedRoom)
		: [];

	// Handle amenity update
	const handleAmenityUpdate = (id: string, level: StockLevel) => {
		setAmenities((prev) =>
			prev.map((a) =>
				a.id === id
					? {
							...a,
							stockLevel: level,
							lastCheckedAt: new Date().toLocaleTimeString("ja-JP", {
								hour: "2-digit",
								minute: "2-digit",
							}),
						}
					: a,
			),
		);
	};

	// Handle equipment update
	const handleEquipmentUpdate = (
		id: string,
		status: EquipmentStatusType,
		notes: string,
	) => {
		setEquipment((prev) =>
			prev.map((e) =>
				e.id === id
					? {
							...e,
							status,
							notes: notes || null,
							lastMaintenanceAt:
								status === "working"
									? new Date().toISOString().split("T")[0]
									: e.lastMaintenanceAt,
						}
					: e,
			),
		);
	};

	return (
		<div className="space-y-6 animate-fade-in">
			{/* Header */}
			<div>
				<h1 className="text-2xl font-display font-semibold text-[var(--sumi)] ink-stroke inline-block">
					設備管理
				</h1>
				<p className="text-sm text-[var(--nezumi)] mt-2">
					各部屋の備品・設備の状態を管理します
				</p>
			</div>

			{/* Summary Stats */}
			<SummaryStats
				needsReplenishment={stats.needsReplenishment}
				needsMaintenance={stats.needsMaintenance}
				normalCount={stats.normalCount}
			/>

			{/* Urgent Alert */}
			{(stats.needsReplenishment > 0 || stats.needsMaintenance > 0) && (
				<div className="shoji-panel p-4 border-l-3 border-l-[var(--kincha)] bg-[rgba(184,134,11,0.02)]">
					<div className="flex items-center gap-3">
						<AlertIcon size={20} className="text-[var(--kincha)]" />
						<div>
							<p className="font-display font-medium text-[var(--kincha)]">
								対応が必要なアイテムがあります
							</p>
							<p className="text-sm text-[var(--sumi-light)]">
								{stats.needsReplenishment > 0 &&
									`補充: ${stats.needsReplenishment}件`}
								{stats.needsReplenishment > 0 &&
									stats.needsMaintenance > 0 &&
									" / "}
								{stats.needsMaintenance > 0 &&
									`メンテナンス: ${stats.needsMaintenance}件`}
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Filter */}
			<FilterTabs selected={filter} onChange={setFilter} />

			{/* Main Content */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[500px]">
				{/* Room List */}
				<div className="shoji-panel p-4 overflow-y-auto">
					<h3 className="text-sm font-display font-semibold text-[var(--sumi)] mb-3">
						部屋一覧
					</h3>
					<div className="space-y-2">
						{filteredRooms.map((room) => (
							<RoomCard
								key={room}
								roomNumber={room}
								isSelected={selectedRoom === room}
								onSelect={() => setSelectedRoom(room)}
							/>
						))}
						{filteredRooms.length === 0 && (
							<div className="text-center py-8">
								<CheckIcon
									size={32}
									className="mx-auto text-[var(--aotake)] mb-2"
								/>
								<p className="text-sm text-[var(--nezumi)]">
									対応が必要な部屋はありません
								</p>
							</div>
						)}
					</div>
				</div>

				{/* Detail Panel */}
				<div className="lg:col-span-2">
					{selectedRoom ? (
						<RoomDetailPanel
							roomNumber={selectedRoom}
							amenities={selectedRoomAmenities}
							equipment={selectedRoomEquipment}
							filter={filter}
							onUpdateAmenity={(a) => setEditingAmenity(a)}
							onUpdateEquipment={(e) => setEditingEquipment(e)}
						/>
					) : (
						<div className="shoji-panel p-6 h-full flex items-center justify-center">
							<div className="text-center">
								<RoomIcon
									size={48}
									className="mx-auto text-[var(--nezumi-light)] mb-4"
								/>
								<p className="text-[var(--nezumi)]">部屋を選択してください</p>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Update Modals */}
			<UpdateAmenityModal
				amenity={editingAmenity}
				isOpen={!!editingAmenity}
				onClose={() => setEditingAmenity(null)}
				onSave={handleAmenityUpdate}
			/>
			<UpdateEquipmentModal
				equipment={editingEquipment}
				isOpen={!!editingEquipment}
				onClose={() => setEditingEquipment(null)}
				onSave={handleEquipmentUpdate}
			/>
		</div>
	);
};
