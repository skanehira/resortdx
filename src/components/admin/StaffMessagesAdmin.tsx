import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { StaffMessage, UnifiedTask, Staff } from "../../types";
import { getStaffById, getRoomName } from "../../data/mock";
import { MessageIcon, HelpIcon, CheckIcon, ClockIcon, SendIcon, AlertIcon } from "../ui/Icons";
import { Modal } from "../ui/Modal";

interface StaffMessagesAdminProps {
  messages: StaffMessage[];
  tasks: UnifiedTask[];
  onReplyMessage: (messageId: string, reply: string) => void;
  onMarkAsRead: (messageId: string) => void;
}

// タブ切り替え用
type TabType = "messages" | "help_requests";

// スタッフアバター（インライン）
const StaffAvatar = ({ staff, size = "sm" }: { staff: Staff; size?: "xs" | "sm" | "md" }) => {
  const sizeClasses = {
    xs: "w-6 h-6 text-[10px]",
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
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

// ヘルプリクエストステータスバッジ
const HelpStatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { label: string; className: string }> = {
    pending: { label: "対応待ち", className: "badge-pending" },
    accepted: { label: "対応中", className: "badge-in-progress" },
    completed: { label: "完了", className: "badge-completed" },
    cancelled: { label: "キャンセル", className: "bg-gray-100 text-gray-600" },
  };
  const { label, className } = config[status] || config.pending;
  return <span className={`badge ${className}`}>{label}</span>;
};

// メッセージカード（管理者用）
interface MessageCardProps {
  message: StaffMessage;
  onReply: (messageId: string) => void;
  onMarkAsRead: (messageId: string) => void;
}

const MessageCard = ({ message, onReply, onMarkAsRead }: MessageCardProps) => {
  const staff = getStaffById(message.senderId);
  const isRead = !!message.readAt;
  const hasReply = !!message.reply;

  return (
    <div
      className={`shoji-panel p-4 space-y-3 ${!isRead ? "border-l-4 border-l-[var(--shu)]" : ""}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {staff && <StaffAvatar staff={staff} size="sm" />}
          <div>
            <p className="font-medium text-[var(--sumi)]">
              {message.senderName || staff?.name || "不明"}
            </p>
            <p className="text-xs text-[var(--nezumi)]">
              {new Date(message.sentAt).toLocaleString("ja-JP", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isRead ? (
            <span className="flex items-center gap-1 text-xs text-[var(--aotake)]">
              <CheckIcon size={12} />
              既読
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-[var(--shu)]">
              <ClockIcon size={12} />
              未読
            </span>
          )}
        </div>
      </div>

      {/* Message content */}
      <div className="p-3 bg-[var(--shironeri-warm)] rounded-lg">
        <p className="text-sm text-[var(--sumi)]">{message.content}</p>
      </div>

      {/* Related task */}
      {message.relatedTaskId && (
        <div className="text-xs text-[var(--nezumi)] p-2 bg-[var(--ai)]/5 rounded">
          関連タスク: {message.relatedTaskId}
        </div>
      )}

      {/* Reply section */}
      {hasReply && message.reply && (
        <div className="space-y-2 pt-2 border-t border-[var(--nezumi)]/10">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--nezumi)]">返信済み</span>
          </div>
          <div className="p-3 bg-[var(--kincha)]/10 rounded-lg ml-4">
            <p className="text-sm text-[var(--sumi)]">{message.reply.content}</p>
            <p className="text-xs text-[var(--nezumi)] mt-2">
              {message.reply.repliedBy} ・{" "}
              {new Date(message.reply.repliedAt).toLocaleString("ja-JP", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        {!isRead && (
          <button
            onClick={() => onMarkAsRead(message.id)}
            className="px-3 py-1.5 text-xs bg-[var(--shironeri-warm)] text-[var(--sumi)] rounded-lg hover:bg-[var(--nezumi)]/10 transition-colors"
          >
            既読にする
          </button>
        )}
        {!hasReply && (
          <button
            onClick={() => onReply(message.id)}
            className="px-3 py-1.5 text-xs bg-[var(--ai)] text-white rounded-lg hover:bg-[var(--ai-deep)] transition-colors flex items-center gap-1"
          >
            <SendIcon size={12} />
            返信する
          </button>
        )}
      </div>
    </div>
  );
};

// ヘルプリクエストカード
interface HelpRequestCardProps {
  task: UnifiedTask;
}

const HelpRequestCard = ({ task }: HelpRequestCardProps) => {
  const helpData = task.helpRequest;
  if (!helpData) return null;

  const requester = getStaffById(helpData.requesterId);
  const acceptedBy = helpData.acceptedBy ? getStaffById(helpData.acceptedBy) : null;
  const createdAt = task.createdAt || task.scheduledTime;

  return (
    <div className="shoji-panel p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {requester && <StaffAvatar staff={requester} size="sm" />}
          <div>
            <p className="font-medium text-[var(--sumi)]">
              {helpData.requesterName || requester?.name}
            </p>
            <p className="text-xs text-[var(--nezumi)]">
              {createdAt &&
                new Date(createdAt).toLocaleString("ja-JP", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
            </p>
          </div>
        </div>
        <HelpStatusBadge status={helpData.helpStatus} />
      </div>

      {/* Help message */}
      <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-400">
        <div className="flex items-center gap-2 mb-2">
          <HelpIcon size={16} className="text-purple-600" />
          <span className="text-sm font-medium text-purple-700">ヘルプリクエスト</span>
        </div>
        <p className="text-sm text-[var(--sumi)]">{helpData.message}</p>
      </div>

      {/* Target staff */}
      <div className="text-xs text-[var(--nezumi)]">
        対象:{" "}
        {helpData.targetStaffIds === "all"
          ? "全スタッフ"
          : `${helpData.targetStaffIds.length}名のスタッフ`}
      </div>

      {/* Room if any */}
      {task.roomId && (
        <div className="text-xs text-[var(--nezumi)] p-2 bg-[var(--shironeri-warm)] rounded">
          部屋: {getRoomName(task.roomId)}
        </div>
      )}

      {/* Accepted by */}
      {acceptedBy && helpData.helpStatus !== "pending" && (
        <div className="flex items-center gap-2 pt-2 border-t border-[var(--nezumi)]/10">
          <StaffAvatar staff={acceptedBy} size="xs" />
          <span className="text-xs text-[var(--nezumi)]">
            {acceptedBy.name}が対応
            {helpData.acceptedAt && (
              <>
                {" "}
                (
                {new Date(helpData.acceptedAt).toLocaleString("ja-JP", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                )
              </>
            )}
          </span>
        </div>
      )}
    </div>
  );
};

// 返信モーダル
interface ReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: StaffMessage | null;
  onSubmit: (messageId: string, reply: string) => void;
}

const ReplyModal = ({ isOpen, onClose, message, onSubmit }: ReplyModalProps) => {
  const [replyContent, setReplyContent] = useState("");

  const handleSubmit = () => {
    if (!message || !replyContent.trim()) return;
    onSubmit(message.id, replyContent.trim());
    setReplyContent("");
    onClose();
  };

  if (!message) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="メッセージに返信">
      <div className="space-y-4">
        {/* Original message */}
        <div>
          <p className="text-xs text-[var(--nezumi)] mb-2">元のメッセージ:</p>
          <div className="p-3 bg-[var(--shironeri-warm)] rounded-lg">
            <p className="text-sm text-[var(--sumi)]">{message.content}</p>
          </div>
        </div>

        {/* Reply input */}
        <div>
          <label className="text-sm font-medium text-[var(--sumi)]">返信内容</label>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="返信を入力..."
            className="w-full mt-2 p-3 border border-[var(--nezumi)]/30 rounded-lg text-sm resize-none focus:outline-none focus:border-[var(--ai)]"
            rows={4}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-[var(--shironeri-warm)] text-[var(--sumi)] rounded-lg hover:bg-[var(--nezumi)]/10"
          >
            キャンセル
          </button>
          <button
            onClick={handleSubmit}
            disabled={!replyContent.trim()}
            className={`px-4 py-2 text-sm rounded-lg flex items-center gap-2 ${
              replyContent.trim()
                ? "bg-[var(--ai)] text-white hover:bg-[var(--ai-deep)]"
                : "bg-[var(--nezumi)]/20 text-[var(--nezumi)] cursor-not-allowed"
            }`}
          >
            <SendIcon size={14} />
            送信
          </button>
        </div>
      </div>
    </Modal>
  );
};

// メインコンポーネント
export const StaffMessagesAdmin = ({
  messages,
  tasks,
  onReplyMessage,
  onMarkAsRead,
}: StaffMessagesAdminProps) => {
  const { t } = useTranslation("admin");
  const [activeTab, setActiveTab] = useState<TabType>("messages");
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<StaffMessage | null>(null);

  // ヘルプリクエストをフィルタリング
  const helpRequests = tasks.filter((task) => task.type === "help_request");

  // 未読メッセージ数
  const unreadCount = messages.filter((m) => !m.readAt).length;

  // 対応待ちヘルプリクエスト数
  const pendingHelpCount = helpRequests.filter(
    (t) => t.helpRequest?.helpStatus === "pending",
  ).length;

  // メッセージを新しい順にソート
  const sortedMessages = [...messages].sort((a, b) => {
    const dateA = a.sentAt ? new Date(a.sentAt).getTime() : 0;
    const dateB = b.sentAt ? new Date(b.sentAt).getTime() : 0;
    return dateB - dateA;
  });

  // ヘルプリクエストを新しい順にソート
  const sortedHelpRequests = [...helpRequests].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  const handleOpenReply = (messageId: string) => {
    const message = messages.find((m) => m.id === messageId);
    if (message) {
      setSelectedMessage(message);
      setReplyModalOpen(true);
    }
  };

  const handleReplySubmit = (messageId: string, reply: string) => {
    onReplyMessage(messageId, reply);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-semibold text-[var(--sumi)]">
          {t("staffMessages.title")}
        </h1>
        <p className="text-sm text-[var(--nezumi)] mt-1">{t("staffMessages.description")}</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="shoji-panel p-4 border-l-3 border-l-[var(--ai)]">
          <p className="text-sm text-[var(--nezumi)]">総メッセージ数</p>
          <p className="text-2xl font-display font-semibold mt-1">{messages.length}</p>
        </div>
        <div className="shoji-panel p-4 border-l-3 border-l-[var(--shu)]">
          <div className="flex items-center gap-2">
            <p className="text-sm text-[var(--nezumi)]">未読メッセージ</p>
            {unreadCount > 0 && <AlertIcon size={14} className="text-[var(--shu)]" />}
          </div>
          <p className="text-2xl font-display font-semibold mt-1">{unreadCount}</p>
        </div>
        <div className="shoji-panel p-4 border-l-3 border-l-purple-400">
          <p className="text-sm text-[var(--nezumi)]">ヘルプリクエスト</p>
          <p className="text-2xl font-display font-semibold mt-1">{helpRequests.length}</p>
        </div>
        <div className="shoji-panel p-4 border-l-3 border-l-[var(--kincha)]">
          <div className="flex items-center gap-2">
            <p className="text-sm text-[var(--nezumi)]">対応待ち</p>
            {pendingHelpCount > 0 && <AlertIcon size={14} className="text-[var(--kincha)]" />}
          </div>
          <p className="text-2xl font-display font-semibold mt-1">{pendingHelpCount}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[var(--shironeri-warm)] rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("messages")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-display rounded-md transition-all ${
            activeTab === "messages"
              ? "bg-white text-[var(--sumi)] shadow-sm"
              : "text-[var(--nezumi)] hover:text-[var(--sumi)]"
          }`}
        >
          <MessageIcon size={16} />
          メッセージ
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 text-xs bg-[var(--shu)] text-white rounded-full">
              {unreadCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("help_requests")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-display rounded-md transition-all ${
            activeTab === "help_requests"
              ? "bg-white text-[var(--sumi)] shadow-sm"
              : "text-[var(--nezumi)] hover:text-[var(--sumi)]"
          }`}
        >
          <HelpIcon size={16} />
          ヘルプリクエスト
          {pendingHelpCount > 0 && (
            <span className="px-1.5 py-0.5 text-xs bg-[var(--kincha)] text-white rounded-full">
              {pendingHelpCount}
            </span>
          )}
        </button>
      </div>

      {/* Content */}
      {activeTab === "messages" && (
        <div className="space-y-4">
          {sortedMessages.length === 0 ? (
            <div className="shoji-panel p-8 text-center">
              <MessageIcon size={48} className="mx-auto text-[var(--nezumi)]/30 mb-4" />
              <p className="text-[var(--nezumi)]">メッセージはありません</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {sortedMessages.map((message) => (
                <MessageCard
                  key={message.id}
                  message={message}
                  onReply={handleOpenReply}
                  onMarkAsRead={onMarkAsRead}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "help_requests" && (
        <div className="space-y-4">
          {sortedHelpRequests.length === 0 ? (
            <div className="shoji-panel p-8 text-center">
              <HelpIcon size={48} className="mx-auto text-[var(--nezumi)]/30 mb-4" />
              <p className="text-[var(--nezumi)]">ヘルプリクエストはありません</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {sortedHelpRequests.map((task) => (
                <HelpRequestCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reply Modal */}
      <ReplyModal
        isOpen={replyModalOpen}
        onClose={() => setReplyModalOpen(false)}
        message={selectedMessage}
        onSubmit={handleReplySubmit}
      />
    </div>
  );
};
