import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { GuestRequest, GuestRequestStatus, GuestRequestType } from "../../types";
import { GUEST_REQUEST_TYPE_LABELS } from "../../types";
import { getRoomName } from "../../data/mock";
import { MessageIcon, CheckIcon, ClockIcon, SendIcon, AlertIcon, UserIcon } from "../ui/Icons";
import { Modal } from "../ui/Modal";

interface GuestMessagesAdminProps {
  requests: GuestRequest[];
  onReplyRequest: (requestId: string, reply: string) => void;
  onMarkAsRead: (requestId: string) => void;
  onUpdateStatus: (requestId: string, status: GuestRequestStatus) => void;
}

// リクエストタイプアイコン
const REQUEST_TYPE_ICONS: Record<GuestRequestType, string> = {
  checkout: "🕐",
  no_cleaning: "🚫",
  amenity: "🧴",
  towel: "🛁",
  meal: "🍽️",
  celebration: "🎂",
  other: "💬",
};

// ステータスバッジ
const StatusBadge = ({ status }: { status: GuestRequestStatus }) => {
  const config: Record<GuestRequestStatus, { label: string; className: string }> = {
    pending: { label: "未対応", className: "badge-pending" },
    in_progress: { label: "対応中", className: "badge-in-progress" },
    completed: { label: "完了", className: "badge-completed" },
    cancelled: { label: "キャンセル", className: "bg-gray-100 text-gray-600" },
  };
  const { label, className } = config[status] || config.pending;
  return <span className={`badge ${className}`}>{label}</span>;
};

// リクエストタイプバッジ
const RequestTypeBadge = ({ type }: { type: GuestRequestType }) => {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-[var(--ai)]/10 text-[var(--ai)] rounded-full">
      <span>{REQUEST_TYPE_ICONS[type]}</span>
      {GUEST_REQUEST_TYPE_LABELS[type]}
    </span>
  );
};

// リクエストカード
interface RequestCardProps {
  request: GuestRequest;
  onReply: (requestId: string) => void;
  onMarkAsRead: (requestId: string) => void;
  onUpdateStatus: (requestId: string, status: GuestRequestStatus) => void;
}

const RequestCard = ({ request, onReply, onMarkAsRead, onUpdateStatus }: RequestCardProps) => {
  const isRead = !!request.readAt;
  const hasReply = !!request.reply;
  const isPending = request.status === "pending";
  const isInProgress = request.status === "in_progress";

  return (
    <div
      className={`shoji-panel p-4 space-y-3 ${!isRead ? "border-l-4 border-l-[var(--shu)]" : ""}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--ai)]/10 flex items-center justify-center">
            <UserIcon size={20} className="text-[var(--ai)]" />
          </div>
          <div>
            <p className="font-medium text-[var(--sumi)]">{request.guestName}</p>
            <p className="text-xs text-[var(--nezumi)]">
              {getRoomName(request.roomId)} ・{" "}
              {new Date(request.createdAt).toLocaleString("ja-JP", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StatusBadge status={request.status} />
          {isRead ? (
            <span className="flex items-center gap-1 text-xs text-[var(--aotake)]">
              <CheckIcon size={12} />
              確認済
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-[var(--shu)]">
              <ClockIcon size={12} />
              未確認
            </span>
          )}
        </div>
      </div>

      {/* Request type badge */}
      <div>
        <RequestTypeBadge type={request.requestType} />
      </div>

      {/* Request content */}
      <div className="p-3 bg-[var(--shironeri-warm)] rounded-lg">
        <p className="text-sm text-[var(--sumi)]">{request.content}</p>
      </div>

      {/* Reply section */}
      {hasReply && request.reply && (
        <div className="space-y-2 pt-2 border-t border-[var(--nezumi)]/10">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--nezumi)]">返信済み</span>
          </div>
          <div className="p-3 bg-[var(--kincha)]/10 rounded-lg ml-4">
            <p className="text-sm text-[var(--sumi)]">{request.reply.content}</p>
            <p className="text-xs text-[var(--nezumi)] mt-2">
              {request.reply.repliedBy} ・{" "}
              {new Date(request.reply.repliedAt).toLocaleString("ja-JP", {
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
      <div className="flex flex-wrap gap-2 pt-2">
        {!isRead && (
          <button
            onClick={() => onMarkAsRead(request.id)}
            className="px-3 py-1.5 text-xs bg-[var(--shironeri-warm)] text-[var(--sumi)] rounded-lg hover:bg-[var(--nezumi)]/10 transition-colors"
          >
            確認済みにする
          </button>
        )}
        {!hasReply && (
          <button
            onClick={() => onReply(request.id)}
            className="px-3 py-1.5 text-xs bg-[var(--ai)] text-white rounded-lg hover:bg-[var(--ai-deep)] transition-colors flex items-center gap-1"
          >
            <SendIcon size={12} />
            返信する
          </button>
        )}
        {isPending && (
          <button
            onClick={() => onUpdateStatus(request.id, "in_progress")}
            className="px-3 py-1.5 text-xs bg-[var(--kincha)] text-white rounded-lg hover:bg-[var(--kincha)]/80 transition-colors"
          >
            対応開始
          </button>
        )}
        {isInProgress && (
          <button
            onClick={() => onUpdateStatus(request.id, "completed")}
            className="px-3 py-1.5 text-xs bg-[var(--aotake)] text-white rounded-lg hover:bg-[var(--aotake)]/80 transition-colors flex items-center gap-1"
          >
            <CheckIcon size={12} />
            完了
          </button>
        )}
      </div>
    </div>
  );
};

// 返信モーダル
interface ReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: GuestRequest | null;
  onSubmit: (requestId: string, reply: string) => void;
}

const ReplyModal = ({ isOpen, onClose, request, onSubmit }: ReplyModalProps) => {
  const [replyContent, setReplyContent] = useState("");

  const handleSubmit = () => {
    if (!request || !replyContent.trim()) return;
    onSubmit(request.id, replyContent.trim());
    setReplyContent("");
    onClose();
  };

  if (!request) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="ゲストへ返信">
      <div className="space-y-4">
        {/* Original request */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <p className="text-xs text-[var(--nezumi)]">元のリクエスト:</p>
            <RequestTypeBadge type={request.requestType} />
          </div>
          <div className="p-3 bg-[var(--shironeri-warm)] rounded-lg">
            <p className="text-sm text-[var(--sumi)]">{request.content}</p>
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
export const GuestMessagesAdmin = ({
  requests,
  onReplyRequest,
  onMarkAsRead,
  onUpdateStatus,
}: GuestMessagesAdminProps) => {
  const { t } = useTranslation("admin");
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<GuestRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<GuestRequestStatus | "all">("all");

  // カウント
  const unreadCount = requests.filter((r) => !r.readAt).length;
  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const inProgressCount = requests.filter((r) => r.status === "in_progress").length;
  const completedCount = requests.filter((r) => r.status === "completed").length;

  // フィルタリング
  const filteredRequests =
    filterStatus === "all" ? requests : requests.filter((r) => r.status === filterStatus);

  // リクエストを新しい順にソート
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  const handleOpenReply = (requestId: string) => {
    const request = requests.find((r) => r.id === requestId);
    if (request) {
      setSelectedRequest(request);
      setReplyModalOpen(true);
    }
  };

  const handleReplySubmit = (requestId: string, reply: string) => {
    onReplyRequest(requestId, reply);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-semibold text-[var(--sumi)]">
          {t("guestMessages.title")}
        </h1>
        <p className="text-sm text-[var(--nezumi)] mt-1">{t("guestMessages.description")}</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="shoji-panel p-4 border-l-3 border-l-[var(--ai)]">
          <p className="text-sm text-[var(--nezumi)]">総リクエスト数</p>
          <p className="text-2xl font-display font-semibold mt-1">{requests.length}</p>
        </div>
        <div className="shoji-panel p-4 border-l-3 border-l-[var(--shu)]">
          <div className="flex items-center gap-2">
            <p className="text-sm text-[var(--nezumi)]">未確認</p>
            {unreadCount > 0 && <AlertIcon size={14} className="text-[var(--shu)]" />}
          </div>
          <p className="text-2xl font-display font-semibold mt-1">{unreadCount}</p>
        </div>
        <div className="shoji-panel p-4 border-l-3 border-l-[var(--kincha)]">
          <div className="flex items-center gap-2">
            <p className="text-sm text-[var(--nezumi)]">未対応</p>
            {pendingCount > 0 && <AlertIcon size={14} className="text-[var(--kincha)]" />}
          </div>
          <p className="text-2xl font-display font-semibold mt-1">{pendingCount}</p>
        </div>
        <div className="shoji-panel p-4 border-l-3 border-l-[var(--aotake)]">
          <p className="text-sm text-[var(--nezumi)]">対応中</p>
          <p className="text-2xl font-display font-semibold mt-1">{inProgressCount}</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-1 p-1 bg-[var(--shironeri-warm)] rounded-lg w-fit">
        <button
          onClick={() => setFilterStatus("all")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-display rounded-md transition-all ${
            filterStatus === "all"
              ? "bg-white text-[var(--sumi)] shadow-sm"
              : "text-[var(--nezumi)] hover:text-[var(--sumi)]"
          }`}
        >
          すべて
          <span className="px-1.5 py-0.5 text-xs bg-[var(--nezumi)]/10 rounded-full">
            {requests.length}
          </span>
        </button>
        <button
          onClick={() => setFilterStatus("pending")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-display rounded-md transition-all ${
            filterStatus === "pending"
              ? "bg-white text-[var(--sumi)] shadow-sm"
              : "text-[var(--nezumi)] hover:text-[var(--sumi)]"
          }`}
        >
          未対応
          {pendingCount > 0 && (
            <span className="px-1.5 py-0.5 text-xs bg-[var(--kincha)] text-white rounded-full">
              {pendingCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setFilterStatus("in_progress")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-display rounded-md transition-all ${
            filterStatus === "in_progress"
              ? "bg-white text-[var(--sumi)] shadow-sm"
              : "text-[var(--nezumi)] hover:text-[var(--sumi)]"
          }`}
        >
          対応中
          <span className="px-1.5 py-0.5 text-xs bg-[var(--ai)]/10 rounded-full">
            {inProgressCount}
          </span>
        </button>
        <button
          onClick={() => setFilterStatus("completed")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-display rounded-md transition-all ${
            filterStatus === "completed"
              ? "bg-white text-[var(--sumi)] shadow-sm"
              : "text-[var(--nezumi)] hover:text-[var(--sumi)]"
          }`}
        >
          完了
          <span className="px-1.5 py-0.5 text-xs bg-[var(--aotake)]/10 rounded-full">
            {completedCount}
          </span>
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {sortedRequests.length === 0 ? (
          <div className="shoji-panel p-8 text-center">
            <MessageIcon size={48} className="mx-auto text-[var(--nezumi)]/30 mb-4" />
            <p className="text-[var(--nezumi)]">
              {filterStatus === "all"
                ? "リクエストはありません"
                : `${
                    filterStatus === "pending"
                      ? "未対応"
                      : filterStatus === "in_progress"
                        ? "対応中"
                        : "完了"
                  }のリクエストはありません`}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {sortedRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onReply={handleOpenReply}
                onMarkAsRead={onMarkAsRead}
                onUpdateStatus={onUpdateStatus}
              />
            ))}
          </div>
        )}
      </div>

      {/* Reply Modal */}
      <ReplyModal
        isOpen={replyModalOpen}
        onClose={() => setReplyModalOpen(false)}
        request={selectedRequest}
        onSubmit={handleReplySubmit}
      />
    </div>
  );
};
