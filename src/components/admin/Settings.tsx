import { useState } from "react";
import { mockRooms, mockAmenityTypes, mockEquipmentTypes } from "../../data/mock";
import type {
  Room,
  AmenityTypeMaster,
  EquipmentTypeMaster,
  RoomType,
  StockLevel,
} from "../../types";
import { ROOM_TYPE_LABELS, STOCK_LEVEL_LABELS } from "../../types";
import { Modal } from "../ui/Modal";
import {
  SettingsIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  RoomIcon,
  AmenityIcon,
  EquipmentIcon,
  CheckIcon,
} from "../ui/Icons";

// Tab types
type SettingsTab = "rooms" | "amenities" | "equipment" | "dev";

// === Room Management Section ===
interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  room?: Room | null;
  onSave: (room: Omit<Room, "id"> & { id?: string }) => void;
}

const RoomModal = ({ isOpen, onClose, room, onSave }: RoomModalProps) => {
  const [formData, setFormData] = useState<Omit<Room, "id">>({
    name: room?.name || "",
    type: room?.type || "standard",
    capacity: room?.capacity || 2,
    hasOutdoorBath: room?.hasOutdoorBath || false,
  });

  const handleSubmit = () => {
    if (!formData.name) return;
    onSave(room ? { ...formData, id: room.id } : formData);
    onClose();
  };

  const roomTypes: RoomType[] = ["standard", "deluxe", "suite", "premium_suite"];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={room ? "客室タイプを編集" : "新規客室タイプを追加"}
      size="md"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-display text-[var(--sumi-light)] mb-2">
            客室名 <span className="text-[var(--shu)]">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="スタイリッシュスイート"
            className="input w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-display text-[var(--sumi-light)] mb-2">
              客室タイプ
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as RoomType })}
              className="input w-full"
            >
              {roomTypes.map((type) => (
                <option key={type} value={type}>
                  {ROOM_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-display text-[var(--sumi-light)] mb-2">定員</label>
            <input
              type="number"
              min={1}
              max={10}
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              className="input w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="hasOutdoorBath"
            checked={formData.hasOutdoorBath}
            onChange={(e) => setFormData({ ...formData, hasOutdoorBath: e.target.checked })}
            className="w-4 h-4"
          />
          <label htmlFor="hasOutdoorBath" className="text-sm text-[var(--sumi)]">
            露天風呂付き
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button onClick={onClose} className="btn btn-secondary">
            キャンセル
          </button>
          <button onClick={handleSubmit} disabled={!formData.name} className="btn btn-primary">
            {room ? "更新" : "追加"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// === Amenity Type Management Section ===
interface AmenityTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  amenityType?: AmenityTypeMaster | null;
  onSave: (amenityType: Omit<AmenityTypeMaster, "id"> & { id?: string }) => void;
}

const AmenityTypeModal = ({ isOpen, onClose, amenityType, onSave }: AmenityTypeModalProps) => {
  const [formData, setFormData] = useState<Omit<AmenityTypeMaster, "id">>({
    key: amenityType?.key || "",
    label: amenityType?.label || "",
    defaultThreshold: amenityType?.defaultThreshold || "low",
    isActive: amenityType?.isActive ?? true,
  });

  const thresholds: StockLevel[] = ["full", "half", "low", "empty"];

  const handleSubmit = () => {
    if (!formData.key || !formData.label) return;
    onSave(amenityType ? { ...formData, id: amenityType.id } : formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={amenityType ? "アメニティ種類を編集" : "新規アメニティ種類を追加"}
      size="md"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-display text-[var(--sumi-light)] mb-2">
            識別キー <span className="text-[var(--shu)]">*</span>
          </label>
          <input
            type="text"
            value={formData.key}
            onChange={(e) => setFormData({ ...formData, key: e.target.value })}
            placeholder="shampoo"
            className="input w-full"
          />
          <p className="text-xs text-[var(--nezumi)] mt-1">システム内部で使用する英字キー</p>
        </div>

        <div>
          <label className="block text-sm font-display text-[var(--sumi-light)] mb-2">
            表示名 <span className="text-[var(--shu)]">*</span>
          </label>
          <input
            type="text"
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            placeholder="シャンプー"
            className="input w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-display text-[var(--sumi-light)] mb-2">
            補充閾値
          </label>
          <select
            value={formData.defaultThreshold}
            onChange={(e) =>
              setFormData({
                ...formData,
                defaultThreshold: e.target.value as StockLevel,
              })
            }
            className="input w-full"
          >
            {thresholds.map((t) => (
              <option key={t} value={t}>
                {STOCK_LEVEL_LABELS[t]}
              </option>
            ))}
          </select>
          <p className="text-xs text-[var(--nezumi)] mt-1">この残量以下で補充タスクを生成</p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActiveAmenity"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="w-4 h-4"
          />
          <label htmlFor="isActiveAmenity" className="text-sm text-[var(--sumi)]">
            有効
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button onClick={onClose} className="btn btn-secondary">
            キャンセル
          </button>
          <button
            onClick={handleSubmit}
            disabled={!formData.key || !formData.label}
            className="btn btn-primary"
          >
            {amenityType ? "更新" : "追加"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// === Equipment Type Management Section ===
interface EquipmentTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipmentType?: EquipmentTypeMaster | null;
  onSave: (equipmentType: Omit<EquipmentTypeMaster, "id"> & { id?: string }) => void;
}

const EquipmentTypeModal = ({
  isOpen,
  onClose,
  equipmentType,
  onSave,
}: EquipmentTypeModalProps) => {
  const [formData, setFormData] = useState<Omit<EquipmentTypeMaster, "id">>({
    key: equipmentType?.key || "",
    label: equipmentType?.label || "",
    isActive: equipmentType?.isActive ?? true,
  });

  const handleSubmit = () => {
    if (!formData.key || !formData.label) return;
    onSave(equipmentType ? { ...formData, id: equipmentType.id } : formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={equipmentType ? "設備種類を編集" : "新規設備種類を追加"}
      size="md"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-display text-[var(--sumi-light)] mb-2">
            識別キー <span className="text-[var(--shu)]">*</span>
          </label>
          <input
            type="text"
            value={formData.key}
            onChange={(e) => setFormData({ ...formData, key: e.target.value })}
            placeholder="air_conditioner"
            className="input w-full"
          />
          <p className="text-xs text-[var(--nezumi)] mt-1">システム内部で使用する英字キー</p>
        </div>

        <div>
          <label className="block text-sm font-display text-[var(--sumi-light)] mb-2">
            表示名 <span className="text-[var(--shu)]">*</span>
          </label>
          <input
            type="text"
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            placeholder="エアコン"
            className="input w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActiveEquipment"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="w-4 h-4"
          />
          <label htmlFor="isActiveEquipment" className="text-sm text-[var(--sumi)]">
            有効
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button onClick={onClose} className="btn btn-secondary">
            キャンセル
          </button>
          <button
            onClick={handleSubmit}
            disabled={!formData.key || !formData.label}
            className="btn btn-primary"
          >
            {equipmentType ? "更新" : "追加"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// === Main Settings Component ===
export const Settings = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("rooms");

  // Room state
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [deleteRoomId, setDeleteRoomId] = useState<string | null>(null);

  // Amenity type state
  const [amenityTypes, setAmenityTypes] = useState<AmenityTypeMaster[]>(mockAmenityTypes);
  const [editingAmenityType, setEditingAmenityType] = useState<AmenityTypeMaster | null>(null);
  const [isAmenityModalOpen, setIsAmenityModalOpen] = useState(false);
  const [deleteAmenityId, setDeleteAmenityId] = useState<string | null>(null);

  // Equipment type state
  const [equipmentTypes, setEquipmentTypes] = useState<EquipmentTypeMaster[]>(mockEquipmentTypes);
  const [editingEquipmentType, setEditingEquipmentType] = useState<EquipmentTypeMaster | null>(
    null,
  );
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [deleteEquipmentId, setDeleteEquipmentId] = useState<string | null>(null);

  // Room handlers
  const handleSaveRoom = (roomData: Omit<Room, "id"> & { id?: string }) => {
    if (roomData.id) {
      setRooms((prev) => prev.map((r) => (r.id === roomData.id ? (roomData as Room) : r)));
    } else {
      const newRoom: Room = {
        ...roomData,
        id: `ROOM-${Date.now()}`,
      };
      setRooms((prev) => [...prev, newRoom]);
    }
    setEditingRoom(null);
  };

  const handleDeleteRoom = () => {
    if (deleteRoomId) {
      setRooms((prev) => prev.filter((r) => r.id !== deleteRoomId));
      setDeleteRoomId(null);
    }
  };

  // Amenity type handlers
  const handleSaveAmenityType = (data: Omit<AmenityTypeMaster, "id"> & { id?: string }) => {
    if (data.id) {
      setAmenityTypes((prev) =>
        prev.map((a) => (a.id === data.id ? (data as AmenityTypeMaster) : a)),
      );
    } else {
      const newAmenityType: AmenityTypeMaster = {
        ...data,
        id: `AMT-${Date.now()}`,
      };
      setAmenityTypes((prev) => [...prev, newAmenityType]);
    }
    setEditingAmenityType(null);
  };

  const handleDeleteAmenityType = () => {
    if (deleteAmenityId) {
      setAmenityTypes((prev) => prev.filter((a) => a.id !== deleteAmenityId));
      setDeleteAmenityId(null);
    }
  };

  // Equipment type handlers
  const handleSaveEquipmentType = (data: Omit<EquipmentTypeMaster, "id"> & { id?: string }) => {
    if (data.id) {
      setEquipmentTypes((prev) =>
        prev.map((e) => (e.id === data.id ? (data as EquipmentTypeMaster) : e)),
      );
    } else {
      const newEquipmentType: EquipmentTypeMaster = {
        ...data,
        id: `EQT-${Date.now()}`,
      };
      setEquipmentTypes((prev) => [...prev, newEquipmentType]);
    }
    setEditingEquipmentType(null);
  };

  const handleDeleteEquipmentType = () => {
    if (deleteEquipmentId) {
      setEquipmentTypes((prev) => prev.filter((e) => e.id !== deleteEquipmentId));
      setDeleteEquipmentId(null);
    }
  };

  const tabs: { key: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { key: "rooms", label: "客室タイプ", icon: <RoomIcon size={18} /> },
    {
      key: "amenities",
      label: "アメニティ種類",
      icon: <AmenityIcon size={18} />,
    },
    {
      key: "equipment",
      label: "設備種類",
      icon: <EquipmentIcon size={18} />,
    },
    {
      key: "dev",
      label: "開発ツール",
      icon: <SettingsIcon size={18} />,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-[var(--sumi)] ink-stroke inline-block">
            設定
          </h1>
          <p className="text-sm text-[var(--nezumi)] mt-2">マスターデータの管理</p>
        </div>
        <div className="flex items-center gap-2">
          <SettingsIcon size={24} className="text-[var(--nezumi)]" />
        </div>
      </div>

      {/* Tabs */}
      <div className="shoji-panel p-1">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded text-sm font-display transition-all ${
                activeTab === tab.key
                  ? "bg-[var(--ai)] text-white"
                  : "text-[var(--sumi-light)] hover:bg-[rgba(45,41,38,0.05)]"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="shoji-panel">
        {/* Rooms Tab */}
        {activeTab === "rooms" && (
          <div>
            <div className="p-4 border-b border-[rgba(45,41,38,0.06)] flex items-center justify-between">
              <h2 className="font-display font-medium text-[var(--sumi)]">
                客室タイプ一覧 ({rooms.length}件)
              </h2>
              <button
                onClick={() => {
                  setEditingRoom(null);
                  setIsRoomModalOpen(true);
                }}
                className="btn btn-primary text-sm"
              >
                <PlusIcon size={16} />
                新規追加
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[var(--shironeri-warm)]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-display text-[var(--sumi-light)]">
                      客室名
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-display text-[var(--sumi-light)]">
                      タイプ
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-display text-[var(--sumi-light)]">
                      定員
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-display text-[var(--sumi-light)]">
                      露天風呂
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-display text-[var(--sumi-light)]">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(45,41,38,0.04)]">
                  {rooms.map((room) => (
                    <tr key={room.id} className="hover:bg-[rgba(45,41,38,0.02)]">
                      <td className="px-4 py-3 font-medium text-[var(--sumi)]">{room.name}</td>
                      <td className="px-4 py-3 text-sm text-[var(--nezumi)]">
                        {ROOM_TYPE_LABELS[room.type]}
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--nezumi)]">{room.capacity}名</td>
                      <td className="px-4 py-3">
                        {room.hasOutdoorBath && (
                          <CheckIcon size={16} className="text-[var(--aotake)]" />
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingRoom(room);
                              setIsRoomModalOpen(true);
                            }}
                            className="p-1.5 text-[var(--ai)] hover:bg-[rgba(27,73,101,0.1)] rounded"
                          >
                            <EditIcon size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteRoomId(room.id)}
                            className="p-1.5 text-[var(--shu)] hover:bg-[rgba(199,62,58,0.1)] rounded"
                          >
                            <TrashIcon size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Amenities Tab */}
        {activeTab === "amenities" && (
          <div>
            <div className="p-4 border-b border-[rgba(45,41,38,0.06)] flex items-center justify-between">
              <h2 className="font-display font-medium text-[var(--sumi)]">
                アメニティ種類一覧 ({amenityTypes.length}件)
              </h2>
              <button
                onClick={() => {
                  setEditingAmenityType(null);
                  setIsAmenityModalOpen(true);
                }}
                className="btn btn-primary text-sm"
              >
                <PlusIcon size={16} />
                新規追加
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[var(--shironeri-warm)]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-display text-[var(--sumi-light)]">
                      識別キー
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-display text-[var(--sumi-light)]">
                      表示名
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-display text-[var(--sumi-light)]">
                      補充閾値
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-display text-[var(--sumi-light)]">
                      状態
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-display text-[var(--sumi-light)]">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(45,41,38,0.04)]">
                  {amenityTypes.map((amenity) => (
                    <tr key={amenity.id} className="hover:bg-[rgba(45,41,38,0.02)]">
                      <td className="px-4 py-3 font-mono text-sm text-[var(--sumi)]">
                        {amenity.key}
                      </td>
                      <td className="px-4 py-3 text-[var(--sumi)]">{amenity.label}</td>
                      <td className="px-4 py-3 text-sm text-[var(--nezumi)]">
                        {STOCK_LEVEL_LABELS[amenity.defaultThreshold]}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            amenity.isActive
                              ? "bg-[rgba(93,174,139,0.1)] text-[var(--aotake)]"
                              : "bg-[rgba(45,41,38,0.1)] text-[var(--nezumi)]"
                          }`}
                        >
                          {amenity.isActive ? "有効" : "無効"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingAmenityType(amenity);
                              setIsAmenityModalOpen(true);
                            }}
                            className="p-1.5 text-[var(--ai)] hover:bg-[rgba(27,73,101,0.1)] rounded"
                          >
                            <EditIcon size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteAmenityId(amenity.id)}
                            className="p-1.5 text-[var(--shu)] hover:bg-[rgba(199,62,58,0.1)] rounded"
                          >
                            <TrashIcon size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Equipment Tab */}
        {activeTab === "equipment" && (
          <div>
            <div className="p-4 border-b border-[rgba(45,41,38,0.06)] flex items-center justify-between">
              <h2 className="font-display font-medium text-[var(--sumi)]">
                設備種類一覧 ({equipmentTypes.length}件)
              </h2>
              <button
                onClick={() => {
                  setEditingEquipmentType(null);
                  setIsEquipmentModalOpen(true);
                }}
                className="btn btn-primary text-sm"
              >
                <PlusIcon size={16} />
                新規追加
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[var(--shironeri-warm)]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-display text-[var(--sumi-light)]">
                      識別キー
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-display text-[var(--sumi-light)]">
                      表示名
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-display text-[var(--sumi-light)]">
                      状態
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-display text-[var(--sumi-light)]">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(45,41,38,0.04)]">
                  {equipmentTypes.map((equipment) => (
                    <tr key={equipment.id} className="hover:bg-[rgba(45,41,38,0.02)]">
                      <td className="px-4 py-3 font-mono text-sm text-[var(--sumi)]">
                        {equipment.key}
                      </td>
                      <td className="px-4 py-3 text-[var(--sumi)]">{equipment.label}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            equipment.isActive
                              ? "bg-[rgba(93,174,139,0.1)] text-[var(--aotake)]"
                              : "bg-[rgba(45,41,38,0.1)] text-[var(--nezumi)]"
                          }`}
                        >
                          {equipment.isActive ? "有効" : "無効"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingEquipmentType(equipment);
                              setIsEquipmentModalOpen(true);
                            }}
                            className="p-1.5 text-[var(--ai)] hover:bg-[rgba(27,73,101,0.1)] rounded"
                          >
                            <EditIcon size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteEquipmentId(equipment.id)}
                            className="p-1.5 text-[var(--shu)] hover:bg-[rgba(199,62,58,0.1)] rounded"
                          >
                            <TrashIcon size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Dev Tools Tab */}
        {activeTab === "dev" && (
          <div className="p-6">
            <h2 className="font-display font-medium text-[var(--sumi)] mb-4">画面プレビュー</h2>
            <p className="text-sm text-[var(--nezumi)] mb-6">
              開発・テスト用に各ユーザー画面を確認できます
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Guest Portal */}
              <a
                href="#/guest/portal"
                className="block p-4 border border-[rgba(45,41,38,0.1)] rounded-lg hover:border-[var(--ai)] hover:bg-[rgba(27,73,101,0.02)] transition-all"
              >
                <div className="text-2xl mb-2">📱</div>
                <h3 className="font-display font-medium text-[var(--sumi)]">ゲストポータル</h3>
                <p className="text-xs text-[var(--nezumi)] mt-1">
                  QRコードからアクセスするゲスト用画面
                </p>
                <span className="inline-block mt-3 text-xs text-[var(--ai)]">/#/guest/portal</span>
              </a>

              {/* Guest Shuttle */}
              <a
                href="#/guest/shuttle"
                className="block p-4 border border-[rgba(45,41,38,0.1)] rounded-lg hover:border-[var(--ai)] hover:bg-[rgba(27,73,101,0.02)] transition-all"
              >
                <div className="text-2xl mb-2">🚐</div>
                <h3 className="font-display font-medium text-[var(--sumi)]">送迎ステータス</h3>
                <p className="text-xs text-[var(--nezumi)] mt-1">ゲスト向け送迎状況確認画面</p>
                <span className="inline-block mt-3 text-xs text-[var(--ai)]">/#/guest/shuttle</span>
              </a>

              {/* Guest Meal */}
              <a
                href="#/guest/meal"
                className="block p-4 border border-[rgba(45,41,38,0.1)] rounded-lg hover:border-[var(--ai)] hover:bg-[rgba(27,73,101,0.02)] transition-all"
              >
                <div className="text-2xl mb-2">🍽️</div>
                <h3 className="font-display font-medium text-[var(--sumi)]">お食事ステータス</h3>
                <p className="text-xs text-[var(--nezumi)] mt-1">ゲスト向け配膳状況確認画面</p>
                <span className="inline-block mt-3 text-xs text-[var(--ai)]">/#/guest/meal</span>
              </a>

              {/* Staff View */}
              <a
                href="#/staff/tasks"
                className="block p-4 border border-[rgba(45,41,38,0.1)] rounded-lg hover:border-[var(--ai)] hover:bg-[rgba(27,73,101,0.02)] transition-all"
              >
                <div className="text-2xl mb-2">👷</div>
                <h3 className="font-display font-medium text-[var(--sumi)]">スタッフ画面</h3>
                <p className="text-xs text-[var(--nezumi)] mt-1">スタッフ用タスク管理画面</p>
                <span className="inline-block mt-3 text-xs text-[var(--ai)]">/#/staff/tasks</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Room Modal */}
      <RoomModal
        isOpen={isRoomModalOpen}
        onClose={() => {
          setIsRoomModalOpen(false);
          setEditingRoom(null);
        }}
        room={editingRoom}
        onSave={handleSaveRoom}
      />

      {/* Amenity Type Modal */}
      <AmenityTypeModal
        isOpen={isAmenityModalOpen}
        onClose={() => {
          setIsAmenityModalOpen(false);
          setEditingAmenityType(null);
        }}
        amenityType={editingAmenityType}
        onSave={handleSaveAmenityType}
      />

      {/* Equipment Type Modal */}
      <EquipmentTypeModal
        isOpen={isEquipmentModalOpen}
        onClose={() => {
          setIsEquipmentModalOpen(false);
          setEditingEquipmentType(null);
        }}
        equipmentType={editingEquipmentType}
        onSave={handleSaveEquipmentType}
      />

      {/* Delete Room Confirmation */}
      <Modal
        isOpen={deleteRoomId !== null}
        onClose={() => setDeleteRoomId(null)}
        title="客室タイプを削除"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-[var(--sumi)]">
            この客室タイプを削除してもよろしいですか？この操作は取り消せません。
          </p>
          <div className="flex justify-end gap-2">
            <button onClick={() => setDeleteRoomId(null)} className="btn btn-secondary">
              キャンセル
            </button>
            <button
              onClick={handleDeleteRoom}
              className="btn bg-[var(--shu)] text-white hover:opacity-90"
            >
              削除
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Amenity Type Confirmation */}
      <Modal
        isOpen={deleteAmenityId !== null}
        onClose={() => setDeleteAmenityId(null)}
        title="アメニティ種類を削除"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-[var(--sumi)]">
            このアメニティ種類を削除してもよろしいですか？この操作は取り消せません。
          </p>
          <div className="flex justify-end gap-2">
            <button onClick={() => setDeleteAmenityId(null)} className="btn btn-secondary">
              キャンセル
            </button>
            <button
              onClick={handleDeleteAmenityType}
              className="btn bg-[var(--shu)] text-white hover:opacity-90"
            >
              削除
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Equipment Type Confirmation */}
      <Modal
        isOpen={deleteEquipmentId !== null}
        onClose={() => setDeleteEquipmentId(null)}
        title="設備種類を削除"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-[var(--sumi)]">
            この設備種類を削除してもよろしいですか？この操作は取り消せません。
          </p>
          <div className="flex justify-end gap-2">
            <button onClick={() => setDeleteEquipmentId(null)} className="btn btn-secondary">
              キャンセル
            </button>
            <button
              onClick={handleDeleteEquipmentType}
              className="btn bg-[var(--shu)] text-white hover:opacity-90"
            >
              削除
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
