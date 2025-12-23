import { useState, useMemo } from "react";
import type { ShuttleTask, Vehicle, ShuttleStatus, Staff } from "../../types";
import { SHUTTLE_STATUS_LABELS, VEHICLE_STATUS_LABELS } from "../../types";
import {
  mockShuttleTasks,
  mockVehicles,
  mockStaff,
  getVehicleById,
  getStaffById,
  getUnassignedShuttleTasks,
} from "../../data/mock";
import {
  ShuttleIcon,
  LocationIcon,
  PassengerIcon,
  CarIcon,
  ClockIcon,
  AlertIcon,
  CheckIcon,
  CloseIcon,
  ArrowRightIcon,
  WrenchIcon,
  UserIcon,
  PlusIcon,
} from "../ui/Icons";
import { EditableTimeDisplay } from "./shared/TimeEditForm";
import { StaffSelector } from "../shared/StaffSelector";

// Filter type for shuttle tasks
type FilterType = "all" | "pickup" | "dropoff" | "unassigned";

// Status badge component
const ShuttleStatusBadge = ({ status }: { status: ShuttleStatus }) => {
  const colorMap: Record<ShuttleStatus, string> = {
    not_departed: "bg-[var(--nezumi)] text-white",
    heading: "bg-[var(--ai)] text-white",
    arrived: "bg-[var(--aotake)] text-white",
    boarded: "bg-[var(--kincha)] text-white",
    completed: "bg-[var(--aotake)]/20 text-[var(--aotake)]",
  };

  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colorMap[status]}`}>
      {SHUTTLE_STATUS_LABELS[status]}
    </span>
  );
};

// Vehicle status badge
const VehicleStatusBadge = ({ status }: { status: Vehicle["status"] }) => {
  const colorMap: Record<Vehicle["status"], string> = {
    available: "bg-[var(--aotake)]/20 text-[var(--aotake)]",
    in_use: "bg-[var(--ai)]/20 text-[var(--ai)]",
    maintenance: "bg-[var(--shu)]/20 text-[var(--shu)]",
  };

  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colorMap[status]}`}>
      {VEHICLE_STATUS_LABELS[status]}
    </span>
  );
};

// Priority badge
const PriorityBadge = ({ priority }: { priority: ShuttleTask["priority"] }) => {
  if (priority === "normal") return null;

  const colorMap = {
    high: "bg-[var(--kincha)]/20 text-[var(--kincha)]",
    urgent: "bg-[var(--shu)]/20 text-[var(--shu)]",
  };

  const labelMap = {
    high: "優先",
    urgent: "緊急",
  };

  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colorMap[priority]}`}>
      {labelMap[priority]}
    </span>
  );
};

// 5-stage progress indicator
const ShuttleProgressIndicator = ({ status }: { status: ShuttleStatus }) => {
  const stages: ShuttleStatus[] = ["not_departed", "heading", "arrived", "boarded", "completed"];
  const currentIndex = stages.indexOf(status);

  return (
    <div className="flex items-center gap-1">
      {stages.map((stage, index) => (
        <div key={stage} className="flex items-center">
          <div
            className={`w-2 h-2 rounded-full transition-colors ${
              index <= currentIndex
                ? index === currentIndex
                  ? "bg-[var(--ai)]"
                  : "bg-[var(--aotake)]"
                : "bg-[var(--nezumi)]/30"
            }`}
          />
          {index < stages.length - 1 && (
            <div
              className={`w-3 h-0.5 ${
                index < currentIndex ? "bg-[var(--aotake)]" : "bg-[var(--nezumi)]/30"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

// Summary stats component
const SummaryStats = ({
  total,
  completed,
  inProgress,
  unassigned,
}: {
  total: number;
  completed: number;
  inProgress: number;
  unassigned: number;
}) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
    <div className="shoji-panel p-4">
      <div className="text-2xl font-display font-bold text-[var(--sumi)]">{total}</div>
      <div className="text-sm text-[var(--nezumi)]">本日の送迎</div>
    </div>
    <div className="shoji-panel p-4">
      <div className="text-2xl font-display font-bold text-[var(--aotake)]">{completed}</div>
      <div className="text-sm text-[var(--nezumi)]">完了</div>
    </div>
    <div className="shoji-panel p-4">
      <div className="text-2xl font-display font-bold text-[var(--ai)]">{inProgress}</div>
      <div className="text-sm text-[var(--nezumi)]">進行中</div>
    </div>
    <div className="shoji-panel p-4">
      <div
        className={`text-2xl font-display font-bold ${
          unassigned > 0 ? "text-[var(--shu)]" : "text-[var(--nezumi)]"
        }`}
      >
        {unassigned}
      </div>
      <div className="text-sm text-[var(--nezumi)]">未割当</div>
    </div>
  </div>
);

// Filter tabs component
const FilterTabs = ({
  activeFilter,
  onFilterChange,
  counts,
}: {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts: Record<FilterType, number>;
}) => {
  const tabs: { key: FilterType; label: string }[] = [
    { key: "all", label: "すべて" },
    { key: "pickup", label: "迎車" },
    { key: "dropoff", label: "送車" },
    { key: "unassigned", label: "未割当" },
  ];

  return (
    <div className="flex gap-2 p-1 bg-[var(--shironeri-warm)] rounded-lg overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onFilterChange(tab.key)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-display whitespace-nowrap transition-colors ${
            activeFilter === tab.key
              ? "bg-white text-[var(--sumi)] shadow-sm"
              : "text-[var(--nezumi)] hover:text-[var(--sumi)]"
          }`}
        >
          {tab.label}
          <span
            className={`text-xs ${
              activeFilter === tab.key
                ? tab.key === "unassigned" && counts[tab.key] > 0
                  ? "text-[var(--shu)]"
                  : "text-[var(--ai)]"
                : ""
            }`}
          >
            {counts[tab.key]}
          </span>
        </button>
      ))}
    </div>
  );
};

// Shuttle task card
const ShuttleTaskCard = ({
  task,
  onClick,
  isSelected,
}: {
  task: ShuttleTask;
  onClick: () => void;
  isSelected: boolean;
}) => {
  const vehicle = task.assignedVehicleId ? getVehicleById(task.assignedVehicleId) : null;
  const driver = task.assignedDriverId ? getStaffById(task.assignedDriverId) : null;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left shoji-panel p-4 border-l-3 transition-all hover:shadow-md ${
        isSelected
          ? "border-l-[var(--ai)] bg-[var(--ai)]/5"
          : task.shuttleStatus === "completed"
            ? "border-l-[var(--aotake)]"
            : !task.assignedDriverId || !task.assignedVehicleId
              ? "border-l-[var(--shu)]"
              : task.shuttleStatus === "heading"
                ? "border-l-[var(--ai)]"
                : "border-l-[var(--nezumi)]"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <ClockIcon size={14} className="text-[var(--ai)]" />
          <span className="font-display font-semibold text-[var(--ai)]">{task.scheduledTime}</span>
          <ShuttleStatusBadge status={task.shuttleStatus} />
          <PriorityBadge priority={task.priority} />
        </div>
        {task.guestArrivalNotified && (
          <span className="px-2 py-0.5 text-xs bg-[var(--kincha)]/20 text-[var(--kincha)] rounded-full">
            到着通知あり
          </span>
        )}
      </div>

      <div className="mb-2">
        <div className="font-display font-medium text-[var(--sumi)]">
          {task.guestName}様
          <span className="ml-2 text-sm text-[var(--nezumi)]">{task.numberOfGuests}名</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-[var(--nezumi)] mb-3">
        <LocationIcon size={14} />
        <span>{task.pickupLocation}</span>
        <ArrowRightIcon size={14} />
        <span>{task.dropoffLocation}</span>
      </div>

      <div className="flex items-center justify-between">
        <ShuttleProgressIndicator status={task.shuttleStatus} />
        <div className="flex items-center gap-2 text-xs text-[var(--nezumi)]">
          {vehicle ? (
            <span className="flex items-center gap-1">
              <CarIcon size={12} />
              {vehicle.name}
            </span>
          ) : (
            <span className="text-[var(--shu)]">車両未割当</span>
          )}
          {driver ? (
            <span className="flex items-center gap-1">
              <UserIcon size={12} />
              {driver.name}
            </span>
          ) : (
            <span className="text-[var(--shu)]">ドライバー未割当</span>
          )}
        </div>
      </div>
    </button>
  );
};

// Vehicle card
const VehicleCard = ({
  vehicle,
  onClick,
  isSelected,
}: {
  vehicle: Vehicle;
  onClick: () => void;
  isSelected: boolean;
}) => {
  const driver = vehicle.currentDriverId ? getStaffById(vehicle.currentDriverId) : null;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg border transition-all ${
        isSelected
          ? "border-[var(--ai)] bg-[var(--ai)]/5"
          : "border-transparent hover:bg-[var(--shironeri-warm)]"
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <CarIcon size={16} className="text-[var(--sumi)]" />
          <span className="font-display font-medium text-[var(--sumi)]">{vehicle.name}</span>
        </div>
        <VehicleStatusBadge status={vehicle.status} />
      </div>
      <div className="text-xs text-[var(--nezumi)]">
        {vehicle.licensePlate} / 定員{vehicle.capacity}名
      </div>
      {driver && (
        <div className="mt-1 text-xs text-[var(--ai)]">
          <UserIcon size={12} className="inline mr-1" />
          {driver.name}
        </div>
      )}
      {vehicle.notes && <div className="mt-1 text-xs text-[var(--shu)]">{vehicle.notes}</div>}
    </button>
  );
};

// Driver card
const DriverCard = ({
  driver,
  onClick,
  isAvailable,
}: {
  driver: Staff;
  onClick: () => void;
  isAvailable: boolean;
}) => (
  <button
    onClick={onClick}
    className={`w-full text-left p-3 rounded-lg border transition-all ${
      isAvailable
        ? "border-transparent hover:bg-[var(--shironeri-warm)]"
        : "border-transparent opacity-50"
    }`}
    disabled={!isAvailable}
  >
    <div className="flex items-center gap-2">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
        style={{ backgroundColor: driver.avatarColor }}
      >
        {driver.name.charAt(0)}
      </div>
      <div>
        <div className="font-display font-medium text-[var(--sumi)]">{driver.name}</div>
        <div className="text-xs text-[var(--nezumi)]">
          {driver.shiftStart} - {driver.shiftEnd}
        </div>
      </div>
    </div>
    <div className="mt-1 text-xs">
      {isAvailable ? (
        <span className="text-[var(--aotake)]">待機中</span>
      ) : (
        <span className="text-[var(--ai)]">稼働中</span>
      )}
    </div>
  </button>
);

// Assignment modal
const AssignmentModal = ({
  task,
  vehicles,
  drivers,
  onClose,
  onAssign,
}: {
  task: ShuttleTask;
  vehicles: Vehicle[];
  drivers: Staff[];
  onClose: () => void;
  onAssign: (vehicleId: string, driverId: string) => void;
}) => {
  const [selectedVehicle, setSelectedVehicle] = useState<string>(task.assignedVehicleId || "");
  const [selectedDriver, setSelectedDriver] = useState<string>(task.assignedDriverId || "");

  const availableVehicles = vehicles.filter(
    (v) => v.status === "available" || v.id === task.assignedVehicleId,
  );
  const availableDrivers = drivers.filter(
    (d) =>
      d.role === "driver" &&
      d.status === "on_duty" &&
      (!d.currentTaskId || d.id === task.assignedDriverId),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-[var(--shironeri-warm)] p-4 flex items-center justify-between">
          <h3 className="font-display font-semibold text-lg text-[var(--sumi)]">割当変更</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[var(--shironeri-warm)] rounded-full transition-colors"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        <div className="p-4">
          {/* Task info */}
          <div className="shoji-panel p-3 mb-4">
            <div className="text-sm text-[var(--nezumi)] mb-1">{task.scheduledTime}</div>
            <div className="font-display font-medium text-[var(--sumi)]">
              {task.guestName}様 {task.numberOfGuests}名
            </div>
            <div className="text-sm text-[var(--nezumi)] flex items-center gap-1 mt-1">
              <LocationIcon size={12} />
              {task.pickupLocation} → {task.dropoffLocation}
            </div>
          </div>

          {/* Vehicle selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[var(--sumi)] mb-2">車両</label>
            <div className="space-y-2">
              {availableVehicles.map((vehicle) => (
                <label
                  key={vehicle.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedVehicle === vehicle.id
                      ? "border-[var(--ai)] bg-[var(--ai)]/5"
                      : "border-[var(--shironeri-warm)] hover:bg-[var(--shironeri-warm)]"
                  }`}
                >
                  <input
                    type="radio"
                    name="vehicle"
                    value={vehicle.id}
                    checked={selectedVehicle === vehicle.id}
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                    className="sr-only"
                  />
                  <CarIcon size={16} />
                  <div className="flex-1">
                    <div className="font-medium">{vehicle.name}</div>
                    <div className="text-xs text-[var(--nezumi)]">定員{vehicle.capacity}名</div>
                  </div>
                  {selectedVehicle === vehicle.id && (
                    <CheckIcon size={16} className="text-[var(--ai)]" />
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Driver selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[var(--sumi)] mb-2">ドライバー</label>
            <div className="space-y-2">
              {availableDrivers.map((driver) => (
                <label
                  key={driver.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedDriver === driver.id
                      ? "border-[var(--ai)] bg-[var(--ai)]/5"
                      : "border-[var(--shironeri-warm)] hover:bg-[var(--shironeri-warm)]"
                  }`}
                >
                  <input
                    type="radio"
                    name="driver"
                    value={driver.id}
                    checked={selectedDriver === driver.id}
                    onChange={(e) => setSelectedDriver(e.target.value)}
                    className="sr-only"
                  />
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                    style={{ backgroundColor: driver.avatarColor }}
                  >
                    {driver.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{driver.name}</div>
                    <div className="text-xs text-[var(--nezumi)]">
                      {driver.shiftStart} - {driver.shiftEnd}
                    </div>
                  </div>
                  {selectedDriver === driver.id && (
                    <CheckIcon size={16} className="text-[var(--ai)]" />
                  )}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-[var(--shironeri-warm)] p-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-[var(--nezumi)] text-[var(--nezumi)] rounded-lg font-display hover:bg-[var(--shironeri-warm)] transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={() => onAssign(selectedVehicle, selectedDriver)}
            disabled={!selectedVehicle || !selectedDriver}
            className="flex-1 py-3 bg-[var(--ai)] text-white rounded-lg font-display hover:bg-[var(--ai-deep)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            割当を保存
          </button>
        </div>
      </div>
    </div>
  );
};

// Task detail modal
const TaskDetailModal = ({
  task,
  onClose,
  onStatusChange,
  onOpenAssignment,
  onTimeChange,
  onDriverChange,
}: {
  task: ShuttleTask;
  onClose: () => void;
  onStatusChange: (taskId: string, newStatus: ShuttleStatus) => void;
  onOpenAssignment: () => void;
  onTimeChange: (taskId: string, newTime: string) => void;
  onDriverChange: (taskId: string, driverId: string | null) => void;
}) => {
  const vehicle = task.assignedVehicleId ? getVehicleById(task.assignedVehicleId) : null;

  const getNextStatus = (current: ShuttleStatus): ShuttleStatus | null => {
    const flow: Record<ShuttleStatus, ShuttleStatus | null> = {
      not_departed: "heading",
      heading: "arrived",
      arrived: "boarded",
      boarded: "completed",
      completed: null,
    };
    return flow[current];
  };

  const nextStatus = getNextStatus(task.shuttleStatus);

  const statusButtonLabels: Record<ShuttleStatus, string> = {
    not_departed: "出発",
    heading: "到着",
    arrived: "乗車確認",
    boarded: "完了",
    completed: "",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-[var(--shironeri-warm)] p-4 flex items-center justify-between">
          <h3 className="font-display font-semibold text-lg text-[var(--sumi)]">送迎詳細</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[var(--shironeri-warm)] rounded-full transition-colors"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Status and progress */}
          <div className="text-center">
            <ShuttleStatusBadge status={task.shuttleStatus} />
            <div className="mt-3">
              <ShuttleProgressIndicator status={task.shuttleStatus} />
            </div>
          </div>

          {/* Guest info */}
          <div className="shoji-panel p-4">
            <div className="flex items-center gap-2 mb-2">
              <PassengerIcon size={18} className="text-[var(--ai)]" />
              <span className="font-display font-semibold text-[var(--sumi)]">ゲスト情報</span>
            </div>
            <div className="text-lg font-display font-medium text-[var(--sumi)]">
              {task.guestName}様
            </div>
            <div className="text-sm text-[var(--nezumi)]">
              {task.guestNameKana} / {task.numberOfGuests}名
            </div>
            {task.guestArrivalNotified && (
              <div className="mt-2 px-3 py-2 bg-[var(--kincha)]/10 rounded-lg text-sm text-[var(--kincha)]">
                到着通知: {task.guestNotifiedAt}
              </div>
            )}
          </div>

          {/* Route info */}
          <div className="shoji-panel p-4">
            <div className="flex items-center gap-2 mb-2">
              <LocationIcon size={18} className="text-[var(--ai)]" />
              <span className="font-display font-semibold text-[var(--sumi)]">送迎ルート</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center">
                <div className="text-sm text-[var(--nezumi)]">出発</div>
                <div className="font-medium text-[var(--sumi)]">{task.pickupLocation}</div>
              </div>
              <ArrowRightIcon size={20} className="text-[var(--nezumi)]" />
              <div className="text-center">
                <div className="text-sm text-[var(--nezumi)]">到着</div>
                <div className="font-medium text-[var(--sumi)]">{task.dropoffLocation}</div>
              </div>
            </div>
            <div className="mt-2 text-sm text-[var(--nezumi)]">
              所要時間: 約{task.estimatedDuration}分
            </div>
          </div>

          {/* Schedule */}
          <div className="shoji-panel p-4">
            <EditableTimeDisplay
              value={task.scheduledTime}
              onTimeChange={(newTime) => onTimeChange(task.id, newTime)}
              label="出発予定時刻"
              size="lg"
              accentColor="ai"
            />
          </div>

          {/* Assignment info */}
          <div className="shoji-panel p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CarIcon size={18} className="text-[var(--ai)]" />
                <span className="font-display font-semibold text-[var(--sumi)]">割当</span>
              </div>
              <button
                onClick={onOpenAssignment}
                className="text-sm text-[var(--ai)] hover:underline"
              >
                変更
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--nezumi)] w-16">車両:</span>
                {vehicle ? (
                  <span className="font-medium text-[var(--sumi)]">
                    {vehicle.name} ({vehicle.licensePlate})
                  </span>
                ) : (
                  <span className="text-[var(--shu)]">未割当</span>
                )}
              </div>
              <div>
                <span className="text-sm text-[var(--nezumi)] block mb-1">ドライバー:</span>
                <StaffSelector
                  value={task.assignedDriverId}
                  onChange={(driverId) => onDriverChange(task.id, driverId)}
                  showUnassigned
                  ariaLabel="ドライバーを選択"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          {task.notes && (
            <div className="shoji-panel p-4">
              <div className="text-sm text-[var(--nezumi)] mb-1">備考</div>
              <div className="text-[var(--sumi)]">{task.notes}</div>
            </div>
          )}

          {/* Status update button */}
          {nextStatus && (
            <button
              onClick={() => onStatusChange(task.id, nextStatus)}
              className="w-full py-3 bg-[var(--ai)] text-white rounded-lg font-display font-medium hover:bg-[var(--ai-deep)] transition-colors"
            >
              {statusButtonLabels[task.shuttleStatus]}にする
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Create shuttle modal
const CreateShuttleModal = ({
  onClose,
  onCreate,
  vehicles,
  drivers,
}: {
  onClose: () => void;
  onCreate: (task: ShuttleTask) => void;
  vehicles: Vehicle[];
  drivers: Staff[];
}) => {
  const [formData, setFormData] = useState({
    guestName: "",
    guestNameKana: "",
    numberOfGuests: 1,
    direction: "pickup" as "pickup" | "dropoff",
    pickupLocation: "",
    dropoffLocation: "",
    scheduledTime: "",
    estimatedDuration: 15,
    assignedVehicleId: "",
    assignedDriverId: "",
    priority: "normal" as "normal" | "high" | "urgent",
    notes: "",
  });

  const availableVehicles = vehicles.filter((v) => v.status === "available");
  const availableDrivers = drivers.filter(
    (d) => d.role === "driver" && d.status === "on_duty" && !d.currentTaskId,
  );

  const handleDirectionChange = (direction: "pickup" | "dropoff") => {
    setFormData({
      ...formData,
      direction,
      pickupLocation: direction === "pickup" ? "" : "旅館",
      dropoffLocation: direction === "pickup" ? "旅館" : "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.guestName ||
      !formData.pickupLocation ||
      !formData.dropoffLocation ||
      !formData.scheduledTime
    ) {
      return;
    }

    const newTask: ShuttleTask = {
      id: `SHT${Date.now()}`,
      reservationId: `RES${Date.now()}`,
      guestName: formData.guestName,
      guestNameKana: formData.guestNameKana,
      numberOfGuests: formData.numberOfGuests,
      pickupLocation: formData.pickupLocation,
      dropoffLocation: formData.dropoffLocation,
      direction: formData.direction,
      scheduledTime: formData.scheduledTime,
      estimatedDuration: formData.estimatedDuration,
      shuttleStatus: "not_departed",
      assignedVehicleId: formData.assignedVehicleId || null,
      assignedDriverId: formData.assignedDriverId || null,
      priority: formData.priority,
      guestArrivalNotified: false,
      notes: formData.notes || undefined,
      createdAt: new Date().toISOString(),
    };

    onCreate(newTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-[var(--shironeri-warm)] p-4 flex items-center justify-between">
          <h3 className="font-display font-semibold text-lg text-[var(--sumi)]">送迎を追加</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[var(--shironeri-warm)] rounded-full transition-colors"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Direction */}
          <div className="shoji-panel p-4">
            <label className="block text-sm text-[var(--nezumi)] mb-2">
              送迎種別 <span className="text-[var(--shu)]">*</span>
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleDirectionChange("pickup")}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                  formData.direction === "pickup"
                    ? "bg-[var(--ai)] text-white"
                    : "bg-[var(--shironeri-warm)] text-[var(--sumi)]"
                }`}
              >
                迎車（お迎え）
              </button>
              <button
                type="button"
                onClick={() => handleDirectionChange("dropoff")}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                  formData.direction === "dropoff"
                    ? "bg-[var(--ai)] text-white"
                    : "bg-[var(--shironeri-warm)] text-[var(--sumi)]"
                }`}
              >
                送車（お送り）
              </button>
            </div>
          </div>

          {/* Guest Info */}
          <div className="shoji-panel p-4 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <PassengerIcon size={18} className="text-[var(--ai)]" />
              <span className="font-display font-semibold text-[var(--sumi)]">ゲスト情報</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-[var(--nezumi)] mb-1">
                  お名前 <span className="text-[var(--shu)]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.guestName}
                  onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                  placeholder="例: 山田"
                  className="w-full px-3 py-2 border border-[var(--shironeri-warm)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ai)]/30"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--nezumi)] mb-1">
                  人数 <span className="text-[var(--shu)]">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.numberOfGuests}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      numberOfGuests: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full px-3 py-2 border border-[var(--shironeri-warm)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ai)]/30"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-[var(--nezumi)] mb-1">フリガナ</label>
              <input
                type="text"
                value={formData.guestNameKana}
                onChange={(e) => setFormData({ ...formData, guestNameKana: e.target.value })}
                placeholder="例: ヤマダ"
                className="w-full px-3 py-2 border border-[var(--shironeri-warm)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ai)]/30"
              />
            </div>
          </div>

          {/* Route */}
          <div className="shoji-panel p-4 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <LocationIcon size={18} className="text-[var(--ai)]" />
              <span className="font-display font-semibold text-[var(--sumi)]">ルート</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-[var(--nezumi)] mb-1">
                  出発地 <span className="text-[var(--shu)]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.pickupLocation}
                  onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                  placeholder={formData.direction === "pickup" ? "例: 鳥羽駅" : "旅館"}
                  className="w-full px-3 py-2 border border-[var(--shironeri-warm)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ai)]/30"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--nezumi)] mb-1">
                  目的地 <span className="text-[var(--shu)]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.dropoffLocation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dropoffLocation: e.target.value,
                    })
                  }
                  placeholder={formData.direction === "pickup" ? "旅館" : "例: 鳥羽駅"}
                  className="w-full px-3 py-2 border border-[var(--shironeri-warm)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ai)]/30"
                  required
                />
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="shoji-panel p-4 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <ClockIcon size={18} className="text-[var(--ai)]" />
              <span className="font-display font-semibold text-[var(--sumi)]">スケジュール</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-[var(--nezumi)] mb-1">
                  出発時刻 <span className="text-[var(--shu)]">*</span>
                </label>
                <input
                  type="time"
                  value={formData.scheduledTime}
                  onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--shironeri-warm)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ai)]/30"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--nezumi)] mb-1">所要時間（分）</label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={formData.estimatedDuration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estimatedDuration: parseInt(e.target.value) || 15,
                    })
                  }
                  className="w-full px-3 py-2 border border-[var(--shironeri-warm)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ai)]/30"
                />
              </div>
            </div>
          </div>

          {/* Assignment */}
          <div className="shoji-panel p-4 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <CarIcon size={18} className="text-[var(--ai)]" />
              <span className="font-display font-semibold text-[var(--sumi)]">割当</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-[var(--nezumi)] mb-1">車両</label>
                <select
                  value={formData.assignedVehicleId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      assignedVehicleId: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-[var(--shironeri-warm)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ai)]/30"
                >
                  <option value="">未割当</option>
                  {availableVehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.name} (定員{vehicle.capacity}名)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-[var(--nezumi)] mb-1">ドライバー</label>
                <select
                  value={formData.assignedDriverId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      assignedDriverId: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-[var(--shironeri-warm)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ai)]/30"
                >
                  <option value="">未割当</option>
                  {availableDrivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm text-[var(--nezumi)] mb-1">優先度</label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: e.target.value as "normal" | "high" | "urgent",
                  })
                }
                className="w-full px-3 py-2 border border-[var(--shironeri-warm)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ai)]/30"
              >
                <option value="normal">通常</option>
                <option value="high">優先</option>
                <option value="urgent">緊急</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm text-[var(--nezumi)] mb-1">備考</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="特記事項があれば入力..."
              className="w-full px-3 py-2 border border-[var(--shironeri-warm)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ai)]/30 resize-none"
              rows={3}
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-3 bg-[var(--ai)] text-white rounded-lg font-display font-medium hover:bg-[var(--ai-deep)] transition-colors"
          >
            送迎を追加
          </button>
        </form>
      </div>
    </div>
  );
};

// Main component
export const ShuttleManagement = () => {
  const [shuttleTasks, setShuttleTasks] = useState<ShuttleTask[]>(mockShuttleTasks);
  const [vehicles] = useState<Vehicle[]>(mockVehicles);
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Computed stats
  const stats = useMemo(() => {
    const total = shuttleTasks.length;
    const completed = shuttleTasks.filter((t) => t.shuttleStatus === "completed").length;
    const inProgress = shuttleTasks.filter((t) =>
      ["heading", "arrived", "boarded"].includes(t.shuttleStatus),
    ).length;
    const unassigned = getUnassignedShuttleTasks().length;
    return { total, completed, inProgress, unassigned };
  }, [shuttleTasks]);

  // Filter counts
  const filterCounts = useMemo(() => {
    return {
      all: shuttleTasks.length,
      pickup: shuttleTasks.filter((t) => t.direction === "pickup").length,
      dropoff: shuttleTasks.filter((t) => t.direction === "dropoff").length,
      unassigned: shuttleTasks.filter(
        (t) => (!t.assignedVehicleId || !t.assignedDriverId) && t.shuttleStatus !== "completed",
      ).length,
    };
  }, [shuttleTasks]);

  // Filtered and sorted tasks
  const filteredTasks = useMemo(() => {
    let tasks = [...shuttleTasks];

    switch (filter) {
      case "pickup":
        tasks = tasks.filter((t) => t.direction === "pickup");
        break;
      case "dropoff":
        tasks = tasks.filter((t) => t.direction === "dropoff");
        break;
      case "unassigned":
        tasks = tasks.filter(
          (t) => (!t.assignedVehicleId || !t.assignedDriverId) && t.shuttleStatus !== "completed",
        );
        break;
    }

    // Sort by scheduled time, with completed at the end
    return tasks.sort((a, b) => {
      if (a.shuttleStatus === "completed" && b.shuttleStatus !== "completed") return 1;
      if (a.shuttleStatus !== "completed" && b.shuttleStatus === "completed") return -1;
      return a.scheduledTime.localeCompare(b.scheduledTime);
    });
  }, [shuttleTasks, filter]);

  const selectedTask = selectedTaskId ? shuttleTasks.find((t) => t.id === selectedTaskId) : null;

  // Handlers
  const handleStatusChange = (taskId: string, newStatus: ShuttleStatus) => {
    setShuttleTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              shuttleStatus: newStatus,
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

  const handleAssign = (vehicleId: string, driverId: string) => {
    if (selectedTaskId) {
      setShuttleTasks((prev) =>
        prev.map((t) =>
          t.id === selectedTaskId
            ? { ...t, assignedVehicleId: vehicleId, assignedDriverId: driverId }
            : t,
        ),
      );
    }
    setShowAssignmentModal(false);
  };

  const handleCreateTask = (newTask: ShuttleTask) => {
    setShuttleTasks((prev) => [...prev, newTask]);
  };

  const handleTimeChange = (taskId: string, newTime: string) => {
    setShuttleTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, scheduledTime: newTime } : t)),
    );
  };

  const handleDriverChange = (taskId: string, driverId: string | null) => {
    setShuttleTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, assignedDriverId: driverId } : t)),
    );
  };

  // Drivers list
  const drivers = mockStaff.filter((s) => s.role === "driver");

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-[var(--sumi)]">送迎管理</h1>
          <p className="text-sm text-[var(--nezumi)] mt-1">
            本日の送迎スケジュールと車両状況を管理
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--ai)] text-white rounded-lg font-display font-medium hover:bg-[var(--ai-deep)] transition-colors"
        >
          <PlusIcon size={18} />
          新規作成
        </button>
      </div>

      {/* Summary stats */}
      <SummaryStats
        total={stats.total}
        completed={stats.completed}
        inProgress={stats.inProgress}
        unassigned={stats.unassigned}
      />

      {/* Alert for unassigned tasks */}
      {stats.unassigned > 0 && (
        <div className="flex items-center gap-3 p-4 bg-[var(--shu)]/10 border border-[var(--shu)]/30 rounded-lg">
          <AlertIcon size={20} className="text-[var(--shu)]" />
          <span className="text-[var(--shu)] font-medium">
            {stats.unassigned}件の送迎タスクが未割当です
          </span>
        </div>
      )}

      {/* Filter tabs */}
      <FilterTabs activeFilter={filter} onFilterChange={setFilter} counts={filterCounts} />

      {/* Main content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Schedule list */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="font-display font-semibold text-[var(--sumi)]">スケジュール一覧</h2>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredTasks.map((task) => (
              <ShuttleTaskCard
                key={task.id}
                task={task}
                onClick={() => setSelectedTaskId(task.id)}
                isSelected={selectedTaskId === task.id}
              />
            ))}
            {filteredTasks.length === 0 && (
              <div className="shoji-panel p-8 text-center">
                <ShuttleIcon size={40} className="mx-auto text-[var(--nezumi)]/50 mb-2" />
                <p className="text-[var(--nezumi)]">該当する送迎タスクがありません</p>
              </div>
            )}
          </div>
        </div>

        {/* Side panel */}
        <div className="space-y-4">
          {/* Vehicles */}
          <div className="shoji-panel p-4">
            <h3 className="font-display font-semibold text-[var(--sumi)] mb-3 flex items-center gap-2">
              <CarIcon size={18} />
              車両
            </h3>
            <div className="space-y-1">
              {vehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onClick={() => setSelectedVehicleId(vehicle.id)}
                  isSelected={selectedVehicleId === vehicle.id}
                />
              ))}
            </div>
          </div>

          {/* Drivers */}
          <div className="shoji-panel p-4">
            <h3 className="font-display font-semibold text-[var(--sumi)] mb-3 flex items-center gap-2">
              <UserIcon size={18} />
              ドライバー
            </h3>
            <div className="space-y-1">
              {drivers.map((driver) => (
                <DriverCard
                  key={driver.id}
                  driver={driver}
                  onClick={() => {}}
                  isAvailable={!driver.currentTaskId}
                />
              ))}
            </div>
          </div>

          {/* Maintenance alert */}
          {vehicles.some((v) => v.status === "maintenance") && (
            <div className="shoji-panel p-4 border-l-3 border-l-[var(--kincha)]">
              <div className="flex items-center gap-2 text-[var(--kincha)] mb-2">
                <WrenchIcon size={16} />
                <span className="font-display font-semibold">メンテナンス中</span>
              </div>
              {vehicles
                .filter((v) => v.status === "maintenance")
                .map((v) => (
                  <div key={v.id} className="text-sm text-[var(--sumi)]">
                    {v.name}: {v.notes || "メンテナンス作業中"}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Task detail modal */}
      {selectedTask && !showAssignmentModal && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTaskId(null)}
          onStatusChange={handleStatusChange}
          onOpenAssignment={() => setShowAssignmentModal(true)}
          onTimeChange={handleTimeChange}
          onDriverChange={handleDriverChange}
        />
      )}

      {/* Assignment modal */}
      {selectedTask && showAssignmentModal && (
        <AssignmentModal
          task={selectedTask}
          vehicles={vehicles}
          drivers={mockStaff}
          onClose={() => setShowAssignmentModal(false)}
          onAssign={handleAssign}
        />
      )}

      {/* Create modal */}
      {showCreateModal && (
        <CreateShuttleModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateTask}
          vehicles={vehicles}
          drivers={mockStaff}
        />
      )}
    </div>
  );
};
