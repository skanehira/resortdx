import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { mockStaff } from "../../data/mock";
import {
  STAFF_ROLE_LABELS,
  STAFF_STATUS_LABELS,
  TASK_CATEGORY_LABELS,
  EMPLOYMENT_TYPE_LABELS,
  CERTIFICATION_LABELS,
  LANGUAGE_LABELS,
  ASSIGNED_AREA_LABELS,
  type Staff,
  type StaffRole,
  type StaffStatus,
  type EmploymentType,
  type Certification,
  type Language,
  type AssignedArea,
  type TaskCategory,
} from "../../types";
import { StaffIcon, CheckIcon, PhoneIcon, EditIcon, CloseIcon, SearchIcon } from "../ui/Icons";
import { Modal } from "../ui/Modal";

// Status color map
const statusColorMap: Record<StaffStatus, string> = {
  on_duty: "bg-[var(--aotake)]",
  on_break: "bg-[var(--kincha)]",
  day_off: "bg-[var(--nezumi)]",
  absent: "bg-[var(--shu)]",
  out: "bg-[var(--ai)]",
};

// Status Indicator Component
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
    type="button"
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

// Staff Avatar Component
const StaffAvatar = ({
  staff,
  size = "md",
}: {
  staff: Staff;
  size?: "sm" | "md" | "lg" | "xl";
}) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-lg",
    xl: "w-20 h-20 text-2xl",
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

// Staff Edit Modal Component
interface StaffEditModalProps {
  staff: Staff | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (staff: Staff) => void;
  t: (key: string) => string;
}

const StaffEditModal = ({ staff, isOpen, onClose, onSave, t }: StaffEditModalProps) => {
  const [formData, setFormData] = useState<Staff | null>(null);

  useEffect(() => {
    if (staff) {
      setFormData({ ...staff });
    }
  }, [staff]);

  if (!formData) return null;

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const allCertifications: Certification[] = [
    "driver_license",
    "driver_license_2",
    "cooking_license",
    "food_hygiene",
    "sommelier",
    "hotel_business",
    "service_hospitality",
    "first_aid",
  ];

  const allLanguages: Language[] = ["japanese", "english", "chinese", "korean", "other"];

  const allSkills: TaskCategory[] = [
    "cleaning",
    "inspection",
    "meal_service",
    "turndown",
    "pickup",
    "bath",
    "celebration",
    "other",
  ];

  const toggleCertification = (cert: Certification) => {
    setFormData((prev) => {
      if (!prev) return prev;
      const newCerts = prev.certifications.includes(cert)
        ? prev.certifications.filter((c) => c !== cert)
        : [...prev.certifications, cert];
      return { ...prev, certifications: newCerts };
    });
  };

  const toggleLanguage = (lang: Language) => {
    setFormData((prev) => {
      if (!prev) return prev;
      const newLangs = prev.languages.includes(lang)
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang];
      return { ...prev, languages: newLangs };
    });
  };

  const toggleSkill = (skill: TaskCategory) => {
    setFormData((prev) => {
      if (!prev) return prev;
      const newSkills = prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill];
      return { ...prev, skills: newSkills };
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("staffManagement.editStaff")} size="lg">
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        {/* Basic Info Section */}
        <div>
          <h4 className="font-display font-medium text-[var(--sumi)] mb-3">
            {t("staffManagement.basicInfo")}
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[var(--nezumi)] mb-1">
                {t("staffManagement.name")}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--nezumi)] mb-1">
                {t("staffManagement.nameKana")}
              </label>
              <input
                type="text"
                value={formData.nameKana}
                onChange={(e) => setFormData({ ...formData, nameKana: e.target.value })}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--nezumi)] mb-1">
                {t("staffManagement.role")}
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value as StaffRole,
                  })
                }
                className="input w-full"
              >
                {Object.entries(STAFF_ROLE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-[var(--nezumi)] mb-1">
                {t("staffManagement.employmentType")}
              </label>
              <select
                value={formData.employmentType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    employmentType: e.target.value as EmploymentType,
                  })
                }
                className="input w-full"
              >
                {Object.entries(EMPLOYMENT_TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-[var(--nezumi)] mb-1">
                {t("staffManagement.hireDate")}
              </label>
              <input
                type="date"
                value={formData.hireDate}
                onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--nezumi)] mb-1">
                {t("staffManagement.assignedArea")}
              </label>
              <select
                value={formData.assignedArea}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    assignedArea: e.target.value as AssignedArea,
                  })
                }
                className="input w-full"
              >
                {Object.entries(ASSIGNED_AREA_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Shift Info */}
        <div>
          <h4 className="font-display font-medium text-[var(--sumi)] mb-3">
            {t("staffManagement.shiftInfo")}
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[var(--nezumi)] mb-1">
                {t("staffManagement.shiftStart")}
              </label>
              <input
                type="time"
                value={formData.shiftStart}
                onChange={(e) => setFormData({ ...formData, shiftStart: e.target.value })}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--nezumi)] mb-1">
                {t("staffManagement.shiftEnd")}
              </label>
              <input
                type="time"
                value={formData.shiftEnd}
                onChange={(e) => setFormData({ ...formData, shiftEnd: e.target.value })}
                className="input w-full"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-display font-medium text-[var(--sumi)] mb-3">
            {t("staffManagement.contactInfo")}
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[var(--nezumi)] mb-1">
                {t("staffManagement.phoneNumber")}
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--nezumi)] mb-1">
                {t("staffManagement.emergencyPhone")}
              </label>
              <input
                type="tel"
                value={formData.emergencyContact?.phone || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emergencyContact: {
                      phone: e.target.value,
                      relationship: formData.emergencyContact?.relationship || "",
                    },
                  })
                }
                className="input w-full"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-[var(--nezumi)] mb-1">
                {t("staffManagement.relationship")}
              </label>
              <input
                type="text"
                value={formData.emergencyContact?.relationship || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emergencyContact: {
                      phone: formData.emergencyContact?.phone || "",
                      relationship: e.target.value,
                    },
                  })
                }
                className="input w-full"
              />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div>
          <h4 className="font-display font-medium text-[var(--sumi)] mb-3">
            {t("staffManagement.availableSkills")}
          </h4>
          <div className="flex flex-wrap gap-2">
            {allSkills.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={`px-3 py-1.5 text-sm rounded border transition-all ${
                  formData.skills.includes(skill)
                    ? "bg-[var(--ai)] text-white border-[var(--ai)]"
                    : "bg-white text-[var(--sumi-light)] border-[rgba(45,41,38,0.2)] hover:border-[var(--ai)]"
                }`}
              >
                {TASK_CATEGORY_LABELS[skill]}
              </button>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div>
          <h4 className="font-display font-medium text-[var(--sumi)] mb-3">
            {t("staffManagement.certifications")}
          </h4>
          <div className="flex flex-wrap gap-2">
            {allCertifications.map((cert) => (
              <button
                key={cert}
                type="button"
                onClick={() => toggleCertification(cert)}
                className={`px-3 py-1.5 text-sm rounded border transition-all ${
                  formData.certifications.includes(cert)
                    ? "bg-[var(--aotake)] text-white border-[var(--aotake)]"
                    : "bg-white text-[var(--sumi-light)] border-[rgba(45,41,38,0.2)] hover:border-[var(--aotake)]"
                }`}
              >
                {CERTIFICATION_LABELS[cert]}
              </button>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div>
          <h4 className="font-display font-medium text-[var(--sumi)] mb-3">
            {t("staffManagement.languages")}
          </h4>
          <div className="flex flex-wrap gap-2">
            {allLanguages.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => toggleLanguage(lang)}
                className={`px-3 py-1.5 text-sm rounded border transition-all ${
                  formData.languages.includes(lang)
                    ? "bg-[var(--kincha)] text-white border-[var(--kincha)]"
                    : "bg-white text-[var(--sumi-light)] border-[rgba(45,41,38,0.2)] hover:border-[var(--kincha)]"
                }`}
              >
                {LANGUAGE_LABELS[lang]}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <h4 className="font-display font-medium text-[var(--sumi)] mb-3">
            {t("staffManagement.notes")}
          </h4>
          <textarea
            value={formData.notes || ""}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="input w-full h-24 resize-none"
            placeholder={t("staffManagement.notesPlaceholder")}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-[rgba(45,41,38,0.1)] mt-4">
        <button type="button" onClick={onClose} className="flex-1 btn btn-secondary">
          {t("common.cancel")}
        </button>
        <button type="button" onClick={handleSave} className="flex-1 btn btn-primary">
          {t("common.save")}
        </button>
      </div>
    </Modal>
  );
};

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
              type="button"
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

// Staff Card Component (compact version for list)
interface StaffCardProps {
  staff: Staff;
  isSelected: boolean;
  onSelect: () => void;
  onStatusChange: (staff: Staff) => void;
}

const StaffCard = ({ staff, isSelected, onSelect, onStatusChange }: StaffCardProps) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left shoji-panel p-4 cursor-pointer transition-all ${
        isSelected ? "ring-2 ring-[var(--ai)] bg-[rgba(27,73,101,0.02)]" : "hover:shadow-md"
      }`}
    >
      <div className="flex items-center gap-3">
        <StaffAvatar staff={staff} size="md" />
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
          <p className="text-sm text-[var(--nezumi)]">
            {STAFF_ROLE_LABELS[staff.role]} ・ {EMPLOYMENT_TYPE_LABELS[staff.employmentType]}
          </p>
          <p className="text-xs text-[var(--nezumi-light)]">
            {staff.shiftStart} - {staff.shiftEnd}
          </p>
        </div>
      </div>
    </button>
  );
};

// Staff Detail Panel Component
interface StaffDetailPanelProps {
  staff: Staff;
  onEdit: () => void;
  onClose: () => void;
  t: (key: string) => string;
}

const StaffDetailPanel = ({ staff, onEdit, onClose, t }: StaffDetailPanelProps) => {
  const tenure = (() => {
    const hire = new Date(staff.hireDate);
    const now = new Date();
    const years = now.getFullYear() - hire.getFullYear();
    const months = now.getMonth() - hire.getMonth();
    if (years > 0) {
      return `${years}${t("staffManagement.years")}${months > 0 ? `${months}${t("staffManagement.months")}` : ""}`;
    }
    return `${months + years * 12}${t("staffManagement.months")}`;
  })();

  return (
    <div className="shoji-panel animate-slide-up">
      {/* Header */}
      <div className="p-4 border-b border-[rgba(45,41,38,0.06)] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <StaffAvatar staff={staff} size="xl" />
          <div>
            <h3 className="text-xl font-display font-medium text-[var(--sumi)]">{staff.name}</h3>
            <p className="text-sm text-[var(--nezumi)]">{staff.nameKana}</p>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge status={staff.status} />
              <span className="text-xs text-[var(--nezumi-light)]">
                {STAFF_ROLE_LABELS[staff.role]}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onEdit} className="btn btn-secondary text-sm">
            <EditIcon size={14} />
            {t("common:edit")}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-[var(--shironeri-warm)] rounded transition-colors"
          >
            <CloseIcon size={18} className="text-[var(--nezumi)]" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Basic Info */}
        <div>
          <h4 className="text-sm font-display font-medium text-[var(--sumi)] mb-3">
            {t("staffManagement.basicInfo")}
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-[var(--nezumi)]">{t("staffManagement.staffId")}</span>
              <p className="font-medium text-[var(--sumi)]">{staff.id}</p>
            </div>
            <div>
              <span className="text-[var(--nezumi)]">{t("staffManagement.employmentType")}</span>
              <p className="font-medium text-[var(--sumi)]">
                {EMPLOYMENT_TYPE_LABELS[staff.employmentType]}
              </p>
            </div>
            <div>
              <span className="text-[var(--nezumi)]">{t("staffManagement.hireDate")}</span>
              <p className="font-medium text-[var(--sumi)]">
                {staff.hireDate} ({tenure})
              </p>
            </div>
            <div>
              <span className="text-[var(--nezumi)]">{t("staffManagement.assignedArea")}</span>
              <p className="font-medium text-[var(--sumi)]">
                {ASSIGNED_AREA_LABELS[staff.assignedArea]}
              </p>
            </div>
            <div>
              <span className="text-[var(--nezumi)]">{t("staffManagement.shiftTime")}</span>
              <p className="font-medium text-[var(--sumi)]">
                {staff.shiftStart} - {staff.shiftEnd}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-sm font-display font-medium text-[var(--sumi)] mb-3">
            {t("staffManagement.contactInfo")}
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <PhoneIcon size={14} className="text-[var(--ai)]" />
              <div>
                <span className="text-[var(--nezumi)]">{t("staffManagement.phoneNumber")}</span>
                <p className="font-medium text-[var(--sumi)]">{staff.phoneNumber}</p>
              </div>
            </div>
            {staff.emergencyContact && (
              <div className="flex items-center gap-2">
                <PhoneIcon size={14} className="text-[var(--shu)]" />
                <div>
                  <span className="text-[var(--nezumi)]">
                    {t("staffManagement.emergencyContact")} ({staff.emergencyContact.relationship})
                  </span>
                  <p className="font-medium text-[var(--sumi)]">{staff.emergencyContact.phone}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        <div>
          <h4 className="text-sm font-display font-medium text-[var(--sumi)] mb-3">
            {t("staffManagement.availableSkills")}
          </h4>
          <div className="flex flex-wrap gap-1">
            {staff.skills.map((skill) => (
              <span key={skill} className="text-xs px-2 py-1 bg-[var(--ai)] text-white rounded">
                {TASK_CATEGORY_LABELS[skill]}
              </span>
            ))}
            {staff.skills.length === 0 && (
              <span className="text-xs text-[var(--nezumi)]">{t("staffManagement.noSkills")}</span>
            )}
          </div>
        </div>

        {/* Certifications */}
        <div>
          <h4 className="text-sm font-display font-medium text-[var(--sumi)] mb-3">
            {t("staffManagement.certifications")}
          </h4>
          <div className="flex flex-wrap gap-1">
            {staff.certifications.map((cert) => (
              <span key={cert} className="text-xs px-2 py-1 bg-[var(--aotake)] text-white rounded">
                {CERTIFICATION_LABELS[cert]}
              </span>
            ))}
            {staff.certifications.length === 0 && (
              <span className="text-xs text-[var(--nezumi)]">
                {t("staffManagement.noCertifications")}
              </span>
            )}
          </div>
        </div>

        {/* Languages */}
        <div>
          <h4 className="text-sm font-display font-medium text-[var(--sumi)] mb-3">
            {t("staffManagement.languages")}
          </h4>
          <div className="flex flex-wrap gap-1">
            {staff.languages.map((lang) => (
              <span key={lang} className="text-xs px-2 py-1 bg-[var(--kincha)] text-white rounded">
                {LANGUAGE_LABELS[lang]}
              </span>
            ))}
          </div>
        </div>

        {/* Notes */}
        {staff.notes && (
          <div>
            <h4 className="text-sm font-display font-medium text-[var(--sumi)] mb-3">
              {t("staffManagement.notes")}
            </h4>
            <p className="text-sm text-[var(--sumi)] p-3 bg-[var(--shironeri-warm)] rounded">
              {staff.notes}
            </p>
          </div>
        )}
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
          type="button"
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);

  // Modal state
  const [statusChangeStaff, setStatusChangeStaff] = useState<Staff | null>(null);
  const [editStaff, setEditStaff] = useState<Staff | null>(null);

  // Filter staff
  const filteredStaff = staffList.filter((staff) => {
    const matchesRole = roleFilter === "all" || staff.role === roleFilter;
    const matchesSearch =
      searchQuery === "" ||
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.nameKana.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  // Stats
  const onDutyCount = staffList.filter((s) => s.status === "on_duty").length;
  const fullTimeCount = staffList.filter((s) => s.employmentType === "full_time").length;
  const partTimeCount = staffList.filter(
    (s) =>
      s.employmentType === "part_time" ||
      s.employmentType === "temp" ||
      s.employmentType === "dispatch",
  ).length;

  const selectedStaff = selectedStaffId ? staffList.find((s) => s.id === selectedStaffId) : null;

  // Handlers
  const handleStatusChange = (staffId: string, newStatus: StaffStatus) => {
    setStaffList((prev) => prev.map((s) => (s.id === staffId ? { ...s, status: newStatus } : s)));
  };

  const handleSaveStaff = (updatedStaff: Staff) => {
    setStaffList((prev) => prev.map((s) => (s.id === updatedStaff.id ? updatedStaff : s)));
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
        <div className="shoji-panel p-4 border-l-3 border-l-[var(--ai)]">
          <p className="text-2xl font-display font-semibold text-[var(--sumi)]">
            {staffList.length}
          </p>
          <p className="text-sm text-[var(--nezumi)]">{t("staffManagement.totalStaff")}</p>
        </div>
        <div className="shoji-panel p-4 border-l-3 border-l-[var(--aotake)]">
          <p className="text-2xl font-display font-semibold text-[var(--sumi)]">{onDutyCount}</p>
          <p className="text-sm text-[var(--nezumi)]">{t("staffManagement.onDutyStaff")}</p>
        </div>
        <div className="shoji-panel p-4 border-l-3 border-l-[var(--kincha)]">
          <p className="text-2xl font-display font-semibold text-[var(--sumi)]">{fullTimeCount}</p>
          <p className="text-sm text-[var(--nezumi)]">{t("staffManagement.fullTimeStaff")}</p>
        </div>
        <div className="shoji-panel p-4 border-l-3 border-l-[var(--nezumi)]">
          <p className="text-2xl font-display font-semibold text-[var(--sumi)]">{partTimeCount}</p>
          <p className="text-sm text-[var(--nezumi)]">{t("staffManagement.partTimeStaff")}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="shoji-panel p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <SearchIcon
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--nezumi)]"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("staffManagement.searchPlaceholder")}
            className="input w-full"
            style={{ paddingLeft: "3rem" }}
          />
        </div>
        {/* Role Filter */}
        <RoleFilter selected={roleFilter} onChange={setRoleFilter} t={t} />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Staff List */}
        <div className="lg:col-span-1 space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto">
          {filteredStaff.map((staff) => (
            <StaffCard
              key={staff.id}
              staff={staff}
              isSelected={selectedStaffId === staff.id}
              onSelect={() => setSelectedStaffId(selectedStaffId === staff.id ? null : staff.id)}
              onStatusChange={(s) => setStatusChangeStaff(s)}
            />
          ))}
          {filteredStaff.length === 0 && (
            <div className="shoji-panel p-8 text-center">
              <StaffIcon size={32} className="mx-auto text-[var(--nezumi-light)] mb-2" />
              <p className="text-[var(--nezumi)]">{t("staffManagement.noStaffFound")}</p>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-2">
          {selectedStaff ? (
            <StaffDetailPanel
              staff={selectedStaff}
              onEdit={() => setEditStaff(selectedStaff)}
              onClose={() => setSelectedStaffId(null)}
              t={t}
            />
          ) : (
            <div className="shoji-panel p-12 text-center">
              <StaffIcon size={48} className="mx-auto text-[var(--nezumi-light)] mb-4" />
              <p className="text-[var(--nezumi)]">{t("staffManagement.selectStaffToView")}</p>
            </div>
          )}
        </div>
      </div>

      {/* Status Change Modal */}
      <StatusChangeModal
        staff={statusChangeStaff}
        isOpen={statusChangeStaff !== null}
        onClose={() => setStatusChangeStaff(null)}
        onStatusChange={handleStatusChange}
        t={t}
      />

      {/* Staff Edit Modal */}
      <StaffEditModal
        staff={editStaff}
        isOpen={editStaff !== null}
        onClose={() => setEditStaff(null)}
        onSave={handleSaveStaff}
        t={t}
      />
    </div>
  );
};
