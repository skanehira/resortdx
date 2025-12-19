import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { StaffSharedNote, Staff } from "../../types";
import {
  PlusIcon,
  AlertIcon,
  ClockIcon,
  UserIcon,
  EditIcon,
  TrashIcon,
  CheckIcon,
  CloseIcon,
} from "../ui/Icons";

interface StaffSharedNotesProps {
  notes: StaffSharedNote[];
  currentStaff: Staff;
  onAddNote: (content: string, isImportant: boolean, expiresAt: string | null) => void;
  onUpdateNote: (
    noteId: string,
    updates: Partial<Pick<StaffSharedNote, "content" | "isImportant" | "expiresAt">>,
  ) => void;
  onDeleteNote: (noteId: string) => void;
}

// Note card component
const NoteCard = ({
  note,
  isOwnNote,
  onEdit,
  onDelete,
  onToggleImportant,
}: {
  note: StaffSharedNote;
  isOwnNote: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggleImportant: () => void;
}) => {
  const { t } = useTranslation("staff");
  const isExpired = note.expiresAt && new Date(note.expiresAt) < new Date();

  if (isExpired) return null;

  return (
    <div
      className={`shoji-panel p-4 ${
        note.isImportant ? "border-l-4 border-[var(--shu)] bg-[var(--shu)]/5" : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {note.isImportant && (
            <span className="px-2 py-0.5 bg-[var(--shu)]/20 text-[var(--shu)] text-xs font-medium rounded-full flex items-center gap-1">
              <AlertIcon size={12} />
              {t("sharedNotes.important")}
            </span>
          )}
        </div>
        {isOwnNote && (
          <div className="flex items-center gap-1">
            <button
              onClick={onToggleImportant}
              className={`p-1.5 rounded-lg transition-colors ${
                note.isImportant
                  ? "bg-[var(--shu)]/20 text-[var(--shu)]"
                  : "bg-[var(--shironeri-warm)] text-[var(--nezumi)]"
              }`}
              title={t("sharedNotes.markImportant")}
            >
              <AlertIcon size={16} />
            </button>
            <button
              onClick={onEdit}
              className="p-1.5 rounded-lg bg-[var(--shironeri-warm)] text-[var(--nezumi)] hover:bg-[var(--ai)]/20 transition-colors"
            >
              <EditIcon size={16} />
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 rounded-lg bg-[var(--shironeri-warm)] text-[var(--nezumi)] hover:bg-[var(--shu)]/20 transition-colors"
            >
              <TrashIcon size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <p className="text-[var(--sumi)] whitespace-pre-wrap">{note.content}</p>

      {/* Footer */}
      <div className="flex items-center gap-4 mt-3 text-xs text-[var(--nezumi)]">
        <span className="flex items-center gap-1">
          <UserIcon size={12} />
          {note.createdByName}
        </span>
        <span className="flex items-center gap-1">
          <ClockIcon size={12} />
          {new Date(note.createdAt).toLocaleString("ja-JP", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        {note.expiresAt && (
          <span className="flex items-center gap-1 text-[var(--kincha)]">
            〜{" "}
            {new Date(note.expiresAt).toLocaleString("ja-JP", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
        {note.updatedAt && (
          <span className="text-[var(--nezumi-light)]">
            ({t("sharedNotes.updated")}:{" "}
            {new Date(note.updatedAt).toLocaleString("ja-JP", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
            )
          </span>
        )}
      </div>
    </div>
  );
};

// Note editor modal
const NoteEditorModal = ({
  note,
  onSave,
  onCancel,
}: {
  note?: StaffSharedNote;
  onSave: (content: string, isImportant: boolean, expiresAt: string | null) => void;
  onCancel: () => void;
}) => {
  const { t } = useTranslation("staff");
  const [content, setContent] = useState(note?.content || "");
  const [isImportant, setIsImportant] = useState(note?.isImportant || false);
  const [hasExpiry, setHasExpiry] = useState(!!note?.expiresAt);
  const [expiryDate, setExpiryDate] = useState(() => {
    if (note?.expiresAt) {
      return note.expiresAt.slice(0, 16);
    }
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 16);
  });

  const handleSubmit = () => {
    if (!content.trim()) return;
    onSave(content.trim(), isImportant, hasExpiry ? new Date(expiryDate).toISOString() : null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[var(--shironeri-warm)]">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-display font-semibold text-[var(--sumi)]">
              {note ? t("sharedNotes.editNote") : t("sharedNotes.addNote")}
            </h3>
            <button onClick={onCancel} className="p-2 text-[var(--nezumi)]">
              <CloseIcon size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Text area */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t("sharedNotes.inputPlaceholder")}
            className="w-full p-3 border border-[var(--nezumi)]/30 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--ai)]/30"
            rows={4}
            autoFocus
          />

          {/* Important toggle */}
          <button
            onClick={() => setIsImportant(!isImportant)}
            className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
              isImportant
                ? "bg-[var(--shu)]/10 border-[var(--shu)]/30"
                : "bg-[var(--shironeri-warm)] border-transparent"
            }`}
          >
            <span className="flex items-center gap-2">
              <AlertIcon
                size={18}
                className={isImportant ? "text-[var(--shu)]" : "text-[var(--nezumi)]"}
              />
              <span className={isImportant ? "text-[var(--shu)]" : "text-[var(--sumi)]"}>
                {t("sharedNotes.markImportant")}
              </span>
            </span>
            <div
              className={`w-10 h-6 rounded-full transition-colors ${
                isImportant ? "bg-[var(--shu)]" : "bg-[var(--nezumi)]/30"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform mt-0.5 ${
                  isImportant ? "translate-x-[18px]" : "translate-x-0.5"
                }`}
              />
            </div>
          </button>

          {/* Expiry toggle and date */}
          <div className="space-y-2">
            <button
              onClick={() => setHasExpiry(!hasExpiry)}
              className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                hasExpiry
                  ? "bg-[var(--kincha)]/10 border-[var(--kincha)]/30"
                  : "bg-[var(--shironeri-warm)] border-transparent"
              }`}
            >
              <span className="flex items-center gap-2">
                <ClockIcon
                  size={18}
                  className={hasExpiry ? "text-[var(--kincha)]" : "text-[var(--nezumi)]"}
                />
                <span className={hasExpiry ? "text-[var(--kincha)]" : "text-[var(--sumi)]"}>
                  {t("sharedNotes.setExpiry")}
                </span>
              </span>
              <div
                className={`w-10 h-6 rounded-full transition-colors ${
                  hasExpiry ? "bg-[var(--kincha)]" : "bg-[var(--nezumi)]/30"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform mt-0.5 ${
                    hasExpiry ? "translate-x-[18px]" : "translate-x-0.5"
                  }`}
                />
              </div>
            </button>
            {hasExpiry && (
              <input
                type="datetime-local"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full p-3 border border-[var(--nezumi)]/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ai)]/30"
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--shironeri-warm)] flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-3 bg-[var(--shironeri-warm)] text-[var(--nezumi)] rounded-lg font-medium"
          >
            {t("sharedNotes.cancel")}
          </button>
          <button
            onClick={handleSubmit}
            disabled={!content.trim()}
            className={`flex-1 py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
              content.trim()
                ? "bg-[var(--ai)] text-white"
                : "bg-[var(--nezumi)]/20 text-[var(--nezumi)] cursor-not-allowed"
            }`}
          >
            <CheckIcon size={18} />
            {t("sharedNotes.save")}
          </button>
        </div>
      </div>
    </div>
  );
};

export const StaffSharedNotes = ({
  notes,
  currentStaff,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
}: StaffSharedNotesProps) => {
  const { t } = useTranslation("staff");
  const [showEditor, setShowEditor] = useState(false);
  const [editingNote, setEditingNote] = useState<StaffSharedNote | null>(null);

  // Sort notes: important first, then by date
  const sortedNotes = useMemo(() => {
    const now = new Date();
    return [...notes]
      .filter((note) => !note.expiresAt || new Date(note.expiresAt) > now)
      .sort((a, b) => {
        if (a.isImportant !== b.isImportant) {
          return a.isImportant ? -1 : 1;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [notes]);

  const handleSave = (content: string, isImportant: boolean, expiresAt: string | null) => {
    if (editingNote) {
      onUpdateNote(editingNote.id, { content, isImportant, expiresAt });
    } else {
      onAddNote(content, isImportant, expiresAt);
    }
    setShowEditor(false);
    setEditingNote(null);
  };

  const handleEdit = (note: StaffSharedNote) => {
    setEditingNote(note);
    setShowEditor(true);
  };

  const handleDelete = (noteId: string) => {
    if (confirm(t("sharedNotes.deleteConfirm"))) {
      onDeleteNote(noteId);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--shironeri)] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--shironeri)] border-b border-[rgba(45,41,38,0.06)]">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--nezumi)]">{t("sharedNotes.subtitle")}</p>
              <h1 className="text-xl font-display font-semibold text-[var(--sumi)]">
                {t("sharedNotes.title")}
              </h1>
            </div>
            <button
              onClick={() => {
                setEditingNote(null);
                setShowEditor(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--ai)] text-white rounded-lg font-medium"
            >
              <PlusIcon size={18} />
              {t("sharedNotes.addNote")}
            </button>
          </div>
        </div>
      </div>

      {/* Notes list */}
      <div className="p-4 space-y-3">
        {sortedNotes.length === 0 ? (
          <div className="shoji-panel p-8 text-center">
            <AlertIcon size={48} className="mx-auto text-[var(--nezumi-light)] mb-4" />
            <p className="text-[var(--nezumi)]">{t("sharedNotes.noNotes")}</p>
          </div>
        ) : (
          sortedNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              isOwnNote={note.createdBy === currentStaff.id}
              onEdit={() => handleEdit(note)}
              onDelete={() => handleDelete(note.id)}
              onToggleImportant={() => onUpdateNote(note.id, { isImportant: !note.isImportant })}
            />
          ))
        )}
      </div>

      {/* Editor modal */}
      {showEditor && (
        <NoteEditorModal
          note={editingNote || undefined}
          onSave={handleSave}
          onCancel={() => {
            setShowEditor(false);
            setEditingNote(null);
          }}
        />
      )}
    </div>
  );
};
