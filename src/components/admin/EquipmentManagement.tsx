import { useState, useMemo } from "react";
import {
  mockRoomAmenities,
  mockRoomEquipments,
  mockReservations,
  mockRooms,
  getRoomEquipmentStatus,
  getStaffById,
  getRoomName,
} from "../../data/mock";
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
  type AmenityType,
  type EquipmentType,
} from "../../types";
import {
  RoomIcon,
  AlertIcon,
  AmenityIcon,
  EquipmentIcon,
  WrenchIcon,
  CheckIcon,
  PackageIcon,
  PlusIcon,
  CloseIcon,
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
          <p className="text-2xl font-display font-semibold text-[var(--aotake)]">{normalCount}</p>
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
  roomId,
  isSelected,
  onSelect,
}: {
  roomId: string;
  isSelected: boolean;
  onSelect: () => void;
}) => {
  const status = getRoomEquipmentStatus(roomId);
  const reservation = mockReservations.find((r) => r.roomId === roomId);
  const hasIssues = status.amenitiesLow > 0 || status.equipmentIssues > 0;
  const roomName = getRoomName(roomId);

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
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <RoomIcon size={18} className={isSelected ? "text-white" : "text-[var(--ai)]"} />
          <span className="font-display font-semibold">{roomName}</span>
        </div>
        {hasIssues && !isSelected && <span className="w-2 h-2 rounded-full bg-[var(--kincha)]" />}
      </div>
      {reservation && (
        <p className={`text-xs ${isSelected ? "text-white/80" : "text-[var(--nezumi)]"}`}>
          {reservation.guestName} 様
        </p>
      )}
      <div
        className={`flex gap-3 mt-2 text-xs ${isSelected ? "text-white/80" : "text-[var(--nezumi)]"}`}
      >
        {status.amenitiesLow > 0 && (
          <span className={isSelected ? "text-white" : "text-[var(--kincha)] font-medium"}>
            補充: {status.amenitiesLow}件
          </span>
        )}
        {status.equipmentIssues > 0 && (
          <span className={isSelected ? "text-white" : "text-[var(--shu)] font-medium"}>
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
  const isLow = STOCK_LEVEL_VALUES[amenity.stockLevel] <= STOCK_LEVEL_VALUES[amenity.threshold];
  const staff = amenity.lastCheckedBy ? getStaffById(amenity.lastCheckedBy) : null;

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
          <p className="font-medium text-sm">{AMENITY_TYPE_LABELS[amenity.type]}</p>
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
          <p className="font-medium text-sm">{EQUIPMENT_TYPE_LABELS[equipment.type]}</p>
          <p className="text-xs text-[var(--nezumi)]">
            最終メンテナンス: {equipment.lastMaintenanceAt || "未実施"}
          </p>
          {equipment.notes && <p className="text-xs text-[var(--shu)] mt-1">{equipment.notes}</p>}
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
  roomId,
  amenities,
  equipment,
  filter,
  onUpdateAmenity,
  onUpdateEquipment,
}: {
  roomId: string;
  amenities: RoomAmenity[];
  equipment: RoomEquipment[];
  filter: FilterType;
  onUpdateAmenity: (amenity: RoomAmenity) => void;
  onUpdateEquipment: (equipment: RoomEquipment) => void;
}) => {
  const reservation = mockReservations.find((r) => r.roomId === roomId);

  const showAmenities = filter === "all" || filter === "amenities" || filter === "needs_attention";
  const showEquipment = filter === "all" || filter === "equipment" || filter === "needs_attention";

  const filteredAmenities =
    filter === "needs_attention"
      ? amenities.filter((a) => STOCK_LEVEL_VALUES[a.stockLevel] <= STOCK_LEVEL_VALUES[a.threshold])
      : amenities;

  const filteredEquipment =
    filter === "needs_attention" ? equipment.filter((e) => e.status !== "working") : equipment;

  return (
    <div className="shoji-panel p-6 h-full overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="px-3 py-1 bg-[var(--ai)] text-white text-sm font-display rounded">
            {getRoomName(roomId)}
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
              <AmenityRow key={amenity.id} amenity={amenity} onUpdate={onUpdateAmenity} />
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
              <EquipmentRow key={equip.id} equipment={equip} onUpdate={onUpdateEquipment} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filter === "needs_attention" &&
        filteredAmenities.length === 0 &&
        filteredEquipment.length === 0 && (
          <div className="text-center py-12">
            <CheckIcon size={48} className="mx-auto text-[var(--aotake)] mb-4" />
            <p className="text-[var(--aotake)] font-medium">この部屋は問題ありません</p>
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
  const [selectedLevel, setSelectedLevel] = useState<StockLevel>(amenity?.stockLevel || "full");

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
          {getRoomName(amenity.roomId)}の残量を選択してください
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

  const statuses: EquipmentStatusType[] = ["working", "needs_maintenance", "broken"];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${EQUIPMENT_TYPE_LABELS[equipment.type]} - 状態更新`}
      size="sm"
    >
      <div className="space-y-4">
        <p className="text-sm text-[var(--nezumi)]">
          {getRoomName(equipment.roomId)}の設備状態を選択してください
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
            <label className="block text-xs text-[var(--nezumi)] mb-1">備考</label>
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

// Create Item Modal
const CreateItemModal = ({
  onClose,
  onCreateAmenity,
  onCreateEquipment,
  roomIds,
}: {
  onClose: () => void;
  onCreateAmenity: (amenity: RoomAmenity) => void;
  onCreateEquipment: (equipment: RoomEquipment) => void;
  roomIds: string[];
}) => {
  const [itemType, setItemType] = useState<"amenity" | "equipment">("amenity");
  const [formData, setFormData] = useState({
    roomId: roomIds[0] || "",
    amenityType: "toothbrush" as AmenityType,
    equipmentType: "air_conditioner" as EquipmentType,
    stockLevel: "full" as StockLevel,
    threshold: "low" as StockLevel,
    status: "working" as EquipmentStatusType,
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.roomId) return;

    if (itemType === "amenity") {
      const newAmenity: RoomAmenity = {
        id: `AMN${Date.now()}`,
        roomId: formData.roomId,
        type: formData.amenityType,
        stockLevel: formData.stockLevel,
        threshold: formData.threshold,
        lastCheckedAt: new Date().toLocaleTimeString("ja-JP", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        lastCheckedBy: null,
      };
      onCreateAmenity(newAmenity);
    } else {
      const newEquipment: RoomEquipment = {
        id: `EQP${Date.now()}`,
        roomId: formData.roomId,
        type: formData.equipmentType,
        status: formData.status,
        lastMaintenanceAt:
          formData.status === "working" ? new Date().toISOString().split("T")[0] : null,
        notes: formData.notes || null,
      };
      onCreateEquipment(newEquipment);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-[var(--shironeri-warm)] p-4 flex items-center justify-between">
          <h3 className="font-display font-semibold text-lg text-[var(--sumi)]">
            備品・設備を追加
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[var(--shironeri-warm)] rounded-full transition-colors"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Item Type Selection */}
          <div className="shoji-panel p-4">
            <label className="block text-sm text-[var(--nezumi)] mb-2">
              種別 <span className="text-[var(--shu)]">*</span>
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setItemType("amenity")}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                  itemType === "amenity"
                    ? "bg-[var(--ai)] text-white"
                    : "bg-[var(--shironeri-warm)] text-[var(--sumi)]"
                }`}
              >
                <AmenityIcon size={18} />
                アメニティ
              </button>
              <button
                type="button"
                onClick={() => setItemType("equipment")}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                  itemType === "equipment"
                    ? "bg-[var(--ai)] text-white"
                    : "bg-[var(--shironeri-warm)] text-[var(--sumi)]"
                }`}
              >
                <EquipmentIcon size={18} />
                設備
              </button>
            </div>
          </div>

          {/* Room Selection */}
          <div className="shoji-panel p-4">
            <div className="flex items-center gap-2 mb-3">
              <RoomIcon size={18} className="text-[var(--ai)]" />
              <span className="font-display font-semibold text-[var(--sumi)]">設置先</span>
            </div>
            <div>
              <label className="block text-sm text-[var(--nezumi)] mb-1">
                部屋 <span className="text-[var(--shu)]">*</span>
              </label>
              <select
                value={formData.roomId}
                onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                className="w-full px-3 py-2 border border-[var(--shironeri-warm)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ai)]/30"
                required
              >
                {roomIds.map((roomId) => (
                  <option key={roomId} value={roomId}>
                    {getRoomName(roomId)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Amenity Options */}
          {itemType === "amenity" && (
            <div className="shoji-panel p-4 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <AmenityIcon size={18} className="text-[var(--ai)]" />
                <span className="font-display font-semibold text-[var(--sumi)]">
                  アメニティ詳細
                </span>
              </div>
              <div>
                <label className="block text-sm text-[var(--nezumi)] mb-1">
                  種類 <span className="text-[var(--shu)]">*</span>
                </label>
                <select
                  value={formData.amenityType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      amenityType: e.target.value as AmenityType,
                    })
                  }
                  className="w-full px-3 py-2 border border-[var(--shironeri-warm)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ai)]/30"
                >
                  {Object.entries(AMENITY_TYPE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-[var(--nezumi)] mb-1">現在の残量</label>
                  <select
                    value={formData.stockLevel}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stockLevel: e.target.value as StockLevel,
                      })
                    }
                    className="w-full px-3 py-2 border border-[var(--shironeri-warm)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ai)]/30"
                  >
                    {Object.entries(STOCK_LEVEL_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[var(--nezumi)] mb-1">補充閾値</label>
                  <select
                    value={formData.threshold}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        threshold: e.target.value as StockLevel,
                      })
                    }
                    className="w-full px-3 py-2 border border-[var(--shironeri-warm)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ai)]/30"
                  >
                    {Object.entries(STOCK_LEVEL_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Equipment Options */}
          {itemType === "equipment" && (
            <div className="shoji-panel p-4 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <EquipmentIcon size={18} className="text-[var(--ai)]" />
                <span className="font-display font-semibold text-[var(--sumi)]">設備詳細</span>
              </div>
              <div>
                <label className="block text-sm text-[var(--nezumi)] mb-1">
                  種類 <span className="text-[var(--shu)]">*</span>
                </label>
                <select
                  value={formData.equipmentType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      equipmentType: e.target.value as EquipmentType,
                    })
                  }
                  className="w-full px-3 py-2 border border-[var(--shironeri-warm)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ai)]/30"
                >
                  {Object.entries(EQUIPMENT_TYPE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-[var(--nezumi)] mb-1">状態</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as EquipmentStatusType,
                    })
                  }
                  className="w-full px-3 py-2 border border-[var(--shironeri-warm)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ai)]/30"
                >
                  {Object.entries(EQUIPMENT_STATUS_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              {formData.status !== "working" && (
                <div>
                  <label className="block text-sm text-[var(--nezumi)] mb-1">備考</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="状態の詳細を入力..."
                    className="w-full px-3 py-2 border border-[var(--shironeri-warm)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ai)]/30 resize-none"
                    rows={2}
                  />
                </div>
              )}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-3 bg-[var(--ai)] text-white rounded-lg font-display font-medium hover:bg-[var(--ai-deep)] transition-colors"
          >
            追加
          </button>
        </form>
      </div>
    </div>
  );
};

// Main Component
export const EquipmentManagement = () => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const [amenities, setAmenities] = useState<RoomAmenity[]>(mockRoomAmenities);
  const [equipment, setEquipment] = useState<RoomEquipment[]>(mockRoomEquipments);
  const [editingAmenity, setEditingAmenity] = useState<RoomAmenity | null>(null);
  const [editingEquipment, setEditingEquipment] = useState<RoomEquipment | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Get room IDs from mockRooms
  const roomIds = useMemo(() => {
    return mockRooms.map((r) => r.id);
  }, []);

  // Calculate stats
  const stats = useMemo(() => {
    const needsReplenishment = amenities.filter(
      (a) => STOCK_LEVEL_VALUES[a.stockLevel] <= STOCK_LEVEL_VALUES[a.threshold],
    ).length;
    const needsMaintenance = equipment.filter((e) => e.status !== "working").length;
    const normalCount = amenities.length + equipment.length - needsReplenishment - needsMaintenance;
    return { needsReplenishment, needsMaintenance, normalCount };
  }, [amenities, equipment]);

  // Filter rooms based on filter type
  const filteredRooms = useMemo(() => {
    if (filter === "needs_attention") {
      return roomIds.filter((roomId) => {
        const roomAmenities = amenities.filter((a) => a.roomId === roomId);
        const roomEquipment = equipment.filter((e) => e.roomId === roomId);
        const hasLowAmenities = roomAmenities.some(
          (a) => STOCK_LEVEL_VALUES[a.stockLevel] <= STOCK_LEVEL_VALUES[a.threshold],
        );
        const hasEquipmentIssues = roomEquipment.some((e) => e.status !== "working");
        return hasLowAmenities || hasEquipmentIssues;
      });
    }
    return roomIds;
  }, [roomIds, amenities, equipment, filter]);

  // Get amenities and equipment for selected room
  const selectedRoomAmenities = selectedRoom
    ? amenities.filter((a) => a.roomId === selectedRoom)
    : [];
  const selectedRoomEquipment = selectedRoom
    ? equipment.filter((e) => e.roomId === selectedRoom)
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
  const handleEquipmentUpdate = (id: string, status: EquipmentStatusType, notes: string) => {
    setEquipment((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              status,
              notes: notes || null,
              lastMaintenanceAt:
                status === "working" ? new Date().toISOString().split("T")[0] : e.lastMaintenanceAt,
            }
          : e,
      ),
    );
  };

  // Handle create amenity
  const handleCreateAmenity = (newAmenity: RoomAmenity) => {
    setAmenities((prev) => [...prev, newAmenity]);
  };

  // Handle create equipment
  const handleCreateEquipment = (newEquipment: RoomEquipment) => {
    setEquipment((prev) => [...prev, newEquipment]);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-[var(--sumi)] ink-stroke inline-block">
            設備管理
          </h1>
          <p className="text-sm text-[var(--nezumi)] mt-2">各部屋の備品・設備の状態を管理します</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--ai)] text-white rounded-lg font-display font-medium hover:bg-[var(--ai-deep)] transition-colors"
        >
          <PlusIcon size={18} />
          新規作成
        </button>
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
                {stats.needsReplenishment > 0 && `補充: ${stats.needsReplenishment}件`}
                {stats.needsReplenishment > 0 && stats.needsMaintenance > 0 && " / "}
                {stats.needsMaintenance > 0 && `メンテナンス: ${stats.needsMaintenance}件`}
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
          <h3 className="text-sm font-display font-semibold text-[var(--sumi)] mb-3">部屋一覧</h3>
          <div className="space-y-2">
            {filteredRooms.map((roomId) => (
              <RoomCard
                key={roomId}
                roomId={roomId}
                isSelected={selectedRoom === roomId}
                onSelect={() => setSelectedRoom(roomId)}
              />
            ))}
            {filteredRooms.length === 0 && (
              <div className="text-center py-8">
                <CheckIcon size={32} className="mx-auto text-[var(--aotake)] mb-2" />
                <p className="text-sm text-[var(--nezumi)]">対応が必要な部屋はありません</p>
              </div>
            )}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-2">
          {selectedRoom ? (
            <RoomDetailPanel
              roomId={selectedRoom}
              amenities={selectedRoomAmenities}
              equipment={selectedRoomEquipment}
              filter={filter}
              onUpdateAmenity={(a) => setEditingAmenity(a)}
              onUpdateEquipment={(e) => setEditingEquipment(e)}
            />
          ) : (
            <div className="shoji-panel p-6 h-full flex items-center justify-center">
              <div className="text-center">
                <RoomIcon size={48} className="mx-auto text-[var(--nezumi-light)] mb-4" />
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

      {/* Create Modal */}
      {showCreateModal && (
        <CreateItemModal
          onClose={() => setShowCreateModal(false)}
          onCreateAmenity={handleCreateAmenity}
          onCreateEquipment={handleCreateEquipment}
          roomIds={roomIds}
        />
      )}
    </div>
  );
};
