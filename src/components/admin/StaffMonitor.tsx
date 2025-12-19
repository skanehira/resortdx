import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { mockStaff, mockTasks, getTasksByStaff, getRoomName } from "../../data/mock";
import {
  STAFF_ROLE_LABELS,
  STAFF_STATUS_LABELS,
  TASK_CATEGORY_LABELS,
  type Staff,
  type Task,
  type StaffRole,
  type StaffStatus,
  type EmergencyContact,
} from "../../types";
import {
  StaffIcon,
  TaskIcon,
  TimelineIcon,
  CheckIcon,
  AlertIcon,
  RefreshIcon,
  PhoneIcon,
  EditIcon,
} from "../ui/Icons";
import { Modal } from "../ui/Modal";

// Status Indicator Component
const statusColorMap: Record<StaffStatus, string> = {
  on_duty: "bg-[var(--aotake)]",
  on_break: "bg-[var(--kincha)]",
  day_off: "bg-[var(--nezumi)]",
  absent: "bg-[var(--shu)]",
  out: "bg-[var(--ai)]",
};

const StatusIndicator = ({ status }: { status: StaffStatus }) => (
  <span className={`inline-block w-2 h-2 rounded-full ${statusColorMap[status]}`} />
);

// Status Badge with label
const StatusBadge = ({
  status,
  onClick,
}: {
  status: StaffStatus;
  onClick?: (e?: React.MouseEvent) => void;
}) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium transition-all ${
      onClick ? "hover:opacity-80 cursor-pointer" : ""
    }`}
    style={{
      backgroundColor: `var(--${status === "on_duty" ? "aotake" : status === "on_break" ? "kincha" : status === "day_off" ? "nezumi" : status === "absent" ? "shu" : "ai"})`,
      color: "white",
    }}
  >
    {STAFF_STATUS_LABELS[status]}
    {onClick && <EditIcon size={12} />}
  </button>
);

// Status Change Modal
const StatusChangeModal = ({
  staff,
  isOpen,
  onClose,
  onStatusChange,
  t,
}: {
  staff: Staff | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (staffId: string, newStatus: StaffStatus) => void;
  t: (key: string) => string;
}) => {
  if (!staff) return null;

  const statuses: StaffStatus[] = ["on_duty", "on_break", "day_off", "absent", "out"];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("staffManagement.statusChange")} size="sm">
      <div className="space-y-3">
        <p className="text-sm text-[var(--nezumi)]">
          {staff.name}
          {t("staffManagement.selectStatus")}
        </p>
        <div className="space-y-2">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => {
                onStatusChange(staff.id, s);
                onClose();
              }}
              className={`w-full flex items-center gap-3 p-3 rounded border transition-all ${
                staff.status === s
                  ? "border-[var(--ai)] bg-[rgba(27,73,101,0.05)]"
                  : "border-[rgba(45,41,38,0.1)] hover:border-[rgba(45,41,38,0.2)]"
              }`}
            >
              <StatusIndicator status={s} />
              <span className="font-medium">{STAFF_STATUS_LABELS[s]}</span>
              {staff.status === s && <CheckIcon size={16} className="ml-auto text-[var(--ai)]" />}
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
};

// Emergency Contact Modal
const EmergencyContactModal = ({
  staff,
  isOpen,
  onClose,
  onSave,
  t,
}: {
  staff: Staff | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (staffId: string, contact: EmergencyContact) => void;
  t: (key: string) => string;
}) => {
  const [phone, setPhone] = useState("");
  const [relationship, setRelationship] = useState("");

  // Reset state when staff changes
  useEffect(() => {
    if (staff) {
      setPhone(staff.emergencyContact?.phone || "");
      setRelationship(staff.emergencyContact?.relationship || "");
    }
  }, [staff]);

  if (!staff) return null;

  const handleSave = () => {
    onSave(staff.id, { phone, relationship });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("staffManagement.emergencyContact")}
      size="sm"
    >
      <div className="space-y-4">
        <p className="text-sm text-[var(--nezumi)]">
          {staff.name}
          {t("staffManagement.emergencyContactFor")}
        </p>
        <div>
          <label className="block text-sm font-display text-[var(--sumi-light)] mb-2">
            {t("staffManagement.phoneNumber")}
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t("staffManagement.phonePlaceholder")}
            className="input w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-display text-[var(--sumi-light)] mb-2">
            {t("staffManagement.relationship")}
          </label>
          <input
            type="text"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            placeholder={t("staffManagement.relationshipPlaceholder")}
            className="input w-full"
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="btn btn-secondary">
            {t("common.cancel")}
          </button>
          <button onClick={handleSave} className="btn btn-primary">
            {t("common.save")}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Staff Avatar Component
const StaffAvatar = ({ staff, size = "md" }: { staff: Staff; size?: "sm" | "md" | "lg" }) => {
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
const TaskBadge = ({ status, t }: { status: Task["status"]; t: (key: string) => string }) => {
  const styles = {
    pending: "badge badge-pending",
    in_progress: "badge badge-in-progress",
    completed: "badge badge-completed",
  };
  const labels = {
    pending: t("status.pending"),
    in_progress: t("status.inProgress"),
    completed: t("status.completed"),
  };
  return <span className={styles[status]}>{labels[status]}</span>;
};

// Staff Card Component
interface StaffCardProps {
  staff: Staff;
  tasks: Task[];
  isSelected: boolean;
  onSelect: () => void;
  onStatusChange: (staff: Staff) => void;
  onEmergencyContact: (staff: Staff) => void;
  t: (key: string) => string;
}

const StaffCard = ({
  staff,
  tasks,
  isSelected,
  onSelect,
  onStatusChange,
  onEmergencyContact,
  t,
}: StaffCardProps) => {
  const activeTasks = tasks.filter((task) => task.status !== "completed");
  const completedTasks = tasks.filter((task) => task.status === "completed");
  const inProgressTask = tasks.find((task) => task.status === "in_progress");

  return (
    <div
      onClick={onSelect}
      className={`shoji-panel p-5 cursor-pointer transition-all ${
        isSelected ? "ring-2 ring-[var(--ai)] bg-[rgba(27,73,101,0.02)]" : "hover:shadow-md"
      }`}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <StaffAvatar staff={staff} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-display font-medium text-[var(--sumi)] truncate">{staff.name}</h3>
            <StatusBadge
              status={staff.status}
              onClick={(e) => {
                e?.stopPropagation();
                onStatusChange(staff);
              }}
            />
          </div>
          <p className="text-sm text-[var(--nezumi)]">{STAFF_ROLE_LABELS[staff.role]}</p>
          <p className="text-xs text-[var(--nezumi-light)]">
            {staff.shiftStart} - {staff.shiftEnd}
          </p>
          {/* Emergency Contact */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEmergencyContact(staff);
            }}
            className="mt-2 inline-flex items-center gap-1 text-xs text-[var(--ai)] hover:text-[var(--ai-dark)] transition-colors"
          >
            <PhoneIcon size={12} />
            {staff.emergencyContact
              ? `${t("staffManagement.emergencyContact")}: ${staff.emergencyContact.relationship}`
              : t("staffManagement.registerEmergencyContact")}
          </button>
        </div>
      </div>

      {/* Current Task */}
      {inProgressTask && (
        <div className="mb-4 p-3 bg-[rgba(27,73,101,0.05)] rounded border-l-2 border-[var(--ai)]">
          <p className="text-xs text-[var(--ai)] font-display mb-1">
            {t("staffManagement.currentTask")}
          </p>
          <p className="text-sm font-medium text-[var(--sumi)]">{inProgressTask.title}</p>
          <p className="text-xs text-[var(--nezumi)] mt-1">
            {inProgressTask.scheduledTime} - {getRoomName(inProgressTask.roomId)}
          </p>
        </div>
      )}

      {/* Task Stats */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="py-2 bg-[var(--shironeri-warm)] rounded">
          <p className="text-lg font-display font-semibold text-[var(--nezumi)]">
            {activeTasks.length}
          </p>
          <p className="text-[10px] text-[var(--nezumi-light)]">
            {t("staffManagement.remainingTasks")}
          </p>
        </div>
        <div className="py-2 bg-[var(--shironeri-warm)] rounded">
          <p className="text-lg font-display font-semibold text-[var(--ai)]">
            {tasks.filter((task) => task.status === "in_progress").length}
          </p>
          <p className="text-[10px] text-[var(--nezumi-light)]">
            {t("staffManagement.currentTask")}
          </p>
        </div>
        <div className="py-2 bg-[var(--shironeri-warm)] rounded">
          <p className="text-lg font-display font-semibold text-[var(--aotake)]">
            {completedTasks.length}
          </p>
          <p className="text-[10px] text-[var(--nezumi-light)]">
            {t("staffManagement.completedTasks")}
          </p>
        </div>
      </div>

      {/* Skills */}
      <div className="mt-4 pt-3 border-t border-[rgba(45,41,38,0.06)]">
        <p className="text-xs text-[var(--nezumi)] mb-2">{t("staffManagement.availableSkills")}</p>
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
  t: (key: string, options?: Record<string, unknown>) => string;
}

const ReassignModal = ({
  isOpen,
  onClose,
  task,
  currentStaff,
  availableStaff,
  onReassign,
  t,
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
    <Modal isOpen={isOpen} onClose={onClose} title={t("staffManagement.taskReassign")} size="md">
      {/* Task Info */}
      <div className="p-4 bg-[var(--shironeri-warm)] rounded mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-display font-semibold text-[var(--ai)]">
            {task.scheduledTime}
          </span>
          <TaskBadge status={task.status} t={t} />
        </div>
        <h4 className="font-medium text-[var(--sumi)]">{task.title}</h4>
        <p className="text-sm text-[var(--nezumi)] mt-1">
          {TASK_CATEGORY_LABELS[task.category]} ・ {getRoomName(task.roomId)} ・{" "}
          {task.estimatedDuration}
          {t("taskDetail.minutes")}
        </p>
      </div>

      {/* Current Assignment */}
      {currentStaff && (
        <div className="mb-4">
          <p className="text-xs text-[var(--nezumi)] mb-2">
            {t("staffManagement.currentAssignee")}
          </p>
          <div className="flex items-center gap-3 p-3 border border-[rgba(45,41,38,0.1)] rounded">
            <StaffAvatar staff={currentStaff} size="sm" />
            <div>
              <p className="font-medium text-[var(--sumi)]">{currentStaff.name}</p>
              <p className="text-xs text-[var(--nezumi)]">{STAFF_ROLE_LABELS[currentStaff.role]}</p>
            </div>
          </div>
        </div>
      )}

      {/* Staff Selection */}
      <div className="mb-4">
        <p className="text-xs text-[var(--nezumi)] mb-2">
          {t("staffManagement.selectNewAssignee")}
        </p>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {qualifiedStaff.map((s) => {
            const staffTasks = getTasksByStaff(s.id);
            const activeTaskCount = staffTasks.filter(
              (taskItem) => taskItem.status !== "completed",
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
                    <StatusIndicator status={s.status} />
                  </div>
                  <p className="text-xs text-[var(--nezumi)]">
                    {STAFF_ROLE_LABELS[s.role]} ・{" "}
                    {t("staffManagement.remainingCount", {
                      count: activeTaskCount,
                    })}
                  </p>
                </div>
                {isSelected && <CheckIcon size={18} className="text-[var(--ai)]" />}
              </button>
            );
          })}

          {qualifiedStaff.length === 0 && (
            <div className="p-4 text-center text-[var(--nezumi)]">
              <p>{t("staffManagement.noAvailableStaff")}</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 btn btn-secondary">
          {t("common.cancel")}
        </button>
        <button
          onClick={handleReassign}
          disabled={!selectedStaffId}
          className={`flex-1 btn btn-primary ${
            !selectedStaffId ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {t("staffManagement.doReassign")}
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
  t: (key: string, options?: Record<string, unknown>) => string;
}

const StaffTaskList = ({ staff, tasks, onReassign, t }: StaffTaskListProps) => {
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
              {t("staffManagement.staffTaskList", { name: staff.name })}
            </h3>
            <p className="text-sm text-[var(--nezumi)]">
              {t("staffManagement.taskCount", { count: tasks.length })}
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
                  <TaskBadge status={task.status} t={t} />
                  {task.priority === "urgent" && (
                    <span className="badge badge-urgent">{t("priority.urgent")}</span>
                  )}
                </div>
                <p className="font-medium text-[var(--sumi)]">{task.title}</p>
                <p className="text-sm text-[var(--nezumi)] mt-1">
                  {TASK_CATEGORY_LABELS[task.category]} ・ {getRoomName(task.roomId)} ・{" "}
                  {task.estimatedDuration}
                  {t("taskDetail.minutes")}
                </p>
                {task.description && (
                  <p className="text-sm text-[var(--sumi-light)] mt-2 p-2 bg-[var(--shironeri-warm)] rounded">
                    {task.description}
                  </p>
                )}
              </div>
              {task.status !== "completed" && (
                <button onClick={() => onReassign(task)} className="btn btn-ghost text-xs px-3">
                  <RefreshIcon size={14} />
                  {t("staffManagement.reassign")}
                </button>
              )}
            </div>
          </div>
        ))}

        {sortedTasks.length === 0 && (
          <div className="p-8 text-center">
            <TaskIcon size={32} className="mx-auto text-[var(--nezumi-light)] mb-2" />
            <p className="text-[var(--nezumi)]">{t("staffManagement.noAssignedTasks")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Workload Chart Component
const WorkloadChart = ({ staff, t }: { staff: Staff[]; t: (key: string) => string }) => {
  const maxTasks = Math.max(...staff.map((s) => getTasksByStaff(s.id).length), 1);

  return (
    <div className="shoji-panel p-5">
      <h3 className="font-display font-medium text-[var(--sumi)] mb-4 flex items-center gap-2">
        <TimelineIcon size={18} />
        {t("staffManagement.workloadBalance")}
      </h3>
      <div className="space-y-3">
        {staff.map((s) => {
          const tasks = getTasksByStaff(s.id);
          const percentage = (tasks.length / maxTasks) * 100;
          const completedPercentage =
            tasks.length > 0
              ? (tasks.filter((task) => task.status === "completed").length / tasks.length) * 100
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
                {tasks.length}
                {t("staffManagement.items")}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[rgba(45,41,38,0.06)] text-xs text-[var(--nezumi)]">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-[var(--aotake)] rounded" />
          {t("status.completed")}
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-[var(--nezumi-light)] rounded" />
          {t("staffManagement.incomplete")}
        </div>
      </div>
    </div>
  );
};

// Role Filter Component
interface RoleFilterProps {
  selected: StaffRole | "all";
  onChange: (role: StaffRole | "all") => void;
  t: (key: string) => string;
}

const RoleFilter = ({ selected, onChange, t }: RoleFilterProps) => {
  const roles: (StaffRole | "all")[] = [
    "all",
    "cleaning",
    "service",
    "kitchen",
    "driver",
    "concierge",
    "manager",
    "front",
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
          {role === "all" ? t("staffManagement.allRoles") : STAFF_ROLE_LABELS[role]}
        </button>
      ))}
    </div>
  );
};

// Main Staff Monitor Component
export const StaffMonitor = () => {
  const { t } = useTranslation("admin");
  const [staffList, setStaffList] = useState<Staff[]>(mockStaff);
  const [roleFilter, setRoleFilter] = useState<StaffRole | "all">("all");
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [taskToReassign, setTaskToReassign] = useState<Task | null>(null);

  // Staff status and emergency contact modal state
  const [statusChangeStaff, setStatusChangeStaff] = useState<Staff | null>(null);
  const [emergencyContactStaff, setEmergencyContactStaff] = useState<Staff | null>(null);

  const filteredStaff =
    roleFilter === "all" ? staffList : staffList.filter((s) => s.role === roleFilter);

  const onDutyStaff = staffList.filter((s) => s.status === "on_duty");
  const totalActiveTasks = mockTasks.filter((t) => t.status !== "completed").length;
  const unassignedTasks = mockTasks.filter((t) => !t.assignedStaffId && t.status !== "completed");

  const selectedStaff = selectedStaffId ? staffList.find((s) => s.id === selectedStaffId) : null;
  const selectedStaffTasks = selectedStaffId ? getTasksByStaff(selectedStaffId) : [];

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

  // Status change handler
  const handleStatusChange = (staffId: string, newStatus: StaffStatus) => {
    setStaffList((prev) => prev.map((s) => (s.id === staffId ? { ...s, status: newStatus } : s)));
  };

  // Emergency contact save handler
  const handleSaveEmergencyContact = (staffId: string, contact: EmergencyContact) => {
    setStaffList((prev) =>
      prev.map((s) => (s.id === staffId ? { ...s, emergencyContact: contact } : s)),
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-[var(--sumi)] ink-stroke inline-block">
            {t("staffManagement.title")}
          </h1>
          <p className="text-sm text-[var(--nezumi)] mt-2">{t("staffManagement.description")}</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="shoji-panel p-4 border-l-3 border-l-[var(--aotake)]">
          <p className="text-2xl font-display font-semibold text-[var(--sumi)]">
            {onDutyStaff.length}
          </p>
          <p className="text-sm text-[var(--nezumi)]">{t("staffManagement.onDutyStaff")}</p>
        </div>
        <div className="shoji-panel p-4 border-l-3 border-l-[var(--ai)]">
          <p className="text-2xl font-display font-semibold text-[var(--sumi)]">
            {totalActiveTasks}
          </p>
          <p className="text-sm text-[var(--nezumi)]">{t("staffManagement.activeTasks")}</p>
        </div>
        <div className="shoji-panel p-4 border-l-3 border-l-[var(--kincha)]">
          <p className="text-2xl font-display font-semibold text-[var(--sumi)]">
            {mockTasks.filter((task) => task.status === "in_progress").length}
          </p>
          <p className="text-sm text-[var(--nezumi)]">{t("staffManagement.inProgressTasks")}</p>
        </div>
        {unassignedTasks.length > 0 ? (
          <div className="shoji-panel p-4 border-l-3 border-l-[var(--shu)] bg-[rgba(199,62,58,0.02)]">
            <div className="flex items-center gap-2">
              <AlertIcon size={18} className="text-[var(--shu)]" />
              <p className="text-2xl font-display font-semibold text-[var(--shu)]">
                {unassignedTasks.length}
              </p>
            </div>
            <p className="text-sm text-[var(--nezumi)]">{t("staffManagement.unassignedTasks")}</p>
          </div>
        ) : (
          <div className="shoji-panel p-4 border-l-3 border-l-[var(--aotake)]">
            <div className="flex items-center gap-2">
              <CheckIcon size={18} className="text-[var(--aotake)]" />
              <p className="text-2xl font-display font-semibold text-[var(--aotake)]">0</p>
            </div>
            <p className="text-sm text-[var(--nezumi)]">{t("staffManagement.unassignedTasks")}</p>
          </div>
        )}
      </div>

      {/* Role Filter */}
      <div className="shoji-panel p-4">
        <RoleFilter selected={roleFilter} onChange={setRoleFilter} t={t} />
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
                onSelect={() => setSelectedStaffId(selectedStaffId === staff.id ? null : staff.id)}
                onStatusChange={(s) => setStatusChangeStaff(s)}
                onEmergencyContact={(s) => setEmergencyContactStaff(s)}
                t={t}
              />
            ))}
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          {/* Workload Chart */}
          <WorkloadChart staff={onDutyStaff} t={t} />

          {/* Selected Staff Tasks */}
          {selectedStaff && (
            <StaffTaskList
              staff={selectedStaff}
              t={t}
              tasks={selectedStaffTasks}
              onReassign={handleOpenReassignModal}
            />
          )}

          {!selectedStaff && (
            <div className="shoji-panel p-8 text-center">
              <StaffIcon size={48} className="mx-auto text-[var(--nezumi-light)] mb-4" />
              <p className="text-[var(--nezumi)]">{t("staffManagement.selectStaffToView")}</p>
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
        t={t}
      />

      {/* Status Change Modal */}
      <StatusChangeModal
        staff={statusChangeStaff}
        isOpen={statusChangeStaff !== null}
        onClose={() => setStatusChangeStaff(null)}
        onStatusChange={handleStatusChange}
        t={t}
      />

      {/* Emergency Contact Modal */}
      <EmergencyContactModal
        staff={emergencyContactStaff}
        isOpen={emergencyContactStaff !== null}
        onClose={() => setEmergencyContactStaff(null)}
        onSave={handleSaveEmergencyContact}
        t={t}
      />
    </div>
  );
};
