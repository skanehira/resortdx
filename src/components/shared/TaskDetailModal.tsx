import { useState, useEffect } from "react";
import { mockTasks, mockTaskTemplates, getReservationById, getRoomName } from "../../data/mock";
import { ROOM_TYPE_LABELS, TASK_CATEGORY_LABELS, type Task, type TaskStatus } from "../../types";
import {
  TaskIcon,
  RoomIcon,
  CelebrationIcon,
  ClockIcon,
  TimelineIcon,
  TemplateIcon,
  CheckIcon,
  NoteIcon,
} from "../ui/Icons";
import { Modal } from "../ui/Modal";
import { InlineTimeEdit } from "../admin/shared/TimeEditForm";
import { StaffSelector } from "./StaffSelector";

// Status Badge Component
const StatusBadge = ({ status, t }: { status: TaskStatus; t: (key: string) => string }) => {
  const config = {
    pending: { label: t("status.pending"), class: "badge-pending" },
    in_progress: { label: t("status.inProgress"), class: "badge-in-progress" },
    completed: { label: t("status.completed"), class: "badge-completed" },
  };
  return <span className={`badge ${config[status].class}`}>{config[status].label}</span>;
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
  return <span className={`badge ${config[priority].class}`}>{config[priority].label}</span>;
};

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    taskId: string,
    updates: { scheduledTime: string; assignedStaffId: string | null },
  ) => void;
  onNotesChange: (taskId: string, notes: string) => void;
  t: (key: string) => string;
}

export const TaskDetailModal = ({
  task,
  isOpen,
  onClose,
  onSave,
  onNotesChange,
  t,
}: TaskDetailModalProps) => {
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
  const relatedTasks = mockTasks.filter((t) => t.reservationId === task.reservationId);
  const relatedTaskStats = {
    total: relatedTasks.length,
    completed: relatedTasks.filter((t) => t.status === "completed").length,
    in_progress: relatedTasks.filter((t) => t.status === "in_progress").length,
    pending: relatedTasks.filter((t) => t.status === "pending").length,
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("taskDetail.title")} size="2xl">
      <div className="space-y-4">
        {/* Task Title and Status */}
        <div>
          <h3 className="text-lg font-display font-semibold text-[var(--sumi)]">{task.title}</h3>
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
            <ClockIcon size={16} className="text-[var(--nezumi)] flex-shrink-0" />
            <span className="text-[var(--nezumi)] whitespace-nowrap flex-shrink-0">
              {t("taskDetail.scheduledTime")}:
            </span>
            {task.status !== "completed" ? (
              <InlineTimeEdit value={task.scheduledTime} onTimeChange={handleTimeChange} />
            ) : (
              <span className="font-medium">{task.scheduledTime}</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <RoomIcon size={16} className="text-[var(--nezumi)]" />
            <span className="text-[var(--nezumi)]">{t("taskDetail.room")}:</span>
            <span className="font-medium">{getRoomName(task.roomId)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TaskIcon size={16} className="text-[var(--nezumi)]" />
            <span className="text-[var(--nezumi)]">{t("taskDetail.category")}:</span>
            <span className="font-medium">{TASK_CATEGORY_LABELS[task.category]}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TimelineIcon size={16} className="text-[var(--nezumi)]" />
            <span className="text-[var(--nezumi)]">{t("taskDetail.duration")}:</span>
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
            <span className="text-sm text-[var(--nezumi)]">{t("taskDetail.template")}:</span>
            <span className="text-sm font-medium text-[var(--sumi)]">{template.name}</span>
          </div>
        )}

        {/* Description */}
        {task.description && (
          <div>
            <p className="text-xs text-[var(--nezumi)] mb-1">{t("taskDetail.description")}</p>
            <p className="text-sm text-[var(--sumi-light)]">{task.description}</p>
          </div>
        )}

        {/* Assigned Staff */}
        <div>
          <p className="text-xs text-[var(--nezumi)] mb-2">{t("taskDetail.assignee")}</p>
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
            <p className="text-xs text-[var(--nezumi)] mb-2">{t("taskDetail.guestInfo")}</p>
            <div className="p-3 bg-[var(--shironeri-warm)] rounded">
              <p className="font-medium">{reservation.guestName}</p>
              <p className="text-sm text-[var(--nezumi)]">
                {reservation.numberOfGuests}
                {t("dashboard.guestCount")} ・ {ROOM_TYPE_LABELS[reservation.roomType]}
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
          <p className="text-xs text-[var(--nezumi)] mb-2">{t("taskDetail.reservationProgress")}</p>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 bg-[var(--shironeri-warm)] rounded text-center">
              <p className="text-lg font-display font-semibold text-[var(--aotake)]">
                {relatedTaskStats.completed}
              </p>
              <p className="text-xs text-[var(--nezumi)]">{t("status.completed")}</p>
            </div>
            <div className="p-2 bg-[var(--shironeri-warm)] rounded text-center">
              <p className="text-lg font-display font-semibold text-[var(--ai)]">
                {relatedTaskStats.in_progress}
              </p>
              <p className="text-xs text-[var(--nezumi)]">{t("status.inProgress")}</p>
            </div>
            <div className="p-2 bg-[var(--shironeri-warm)] rounded text-center">
              <p className="text-lg font-display font-semibold text-[var(--nezumi)]">
                {relatedTaskStats.pending}
              </p>
              <p className="text-xs text-[var(--nezumi)]">{t("status.pending")}</p>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <NoteIcon size={16} className="text-[var(--ai)]" />
            <p className="text-xs text-[var(--nezumi)]">{t("taskDetail.notes")}</p>
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
