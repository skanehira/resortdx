import { useState, useEffect, useRef } from "react";
import type { Staff, ChatRoom, ChatMessage } from "../../types";
import {
  mockChatMessages,
  getChatRoomsByStaff,
  getMessagesByChatRoom,
  getUnreadCountByRoom,
  getLastMessageByRoom,
  getDMPartnerId,
  mockStaff,
} from "../../data/mock";
import { MessageIcon, PlusIcon, SendIcon, ArrowLeftIcon, UserIcon, CheckIcon } from "../ui/Icons";

interface StaffChatProps {
  currentStaff: Staff;
}

// チャットルーム一覧アイテム
interface ChatRoomItemProps {
  room: ChatRoom;
  currentStaffId: string;
  isSelected: boolean;
  onClick: () => void;
}

const ChatRoomItem = ({ room, currentStaffId, isSelected, onClick }: ChatRoomItemProps) => {
  const lastMessage = getLastMessageByRoom(room.id);
  const unreadCount = getUnreadCountByRoom(room.id, currentStaffId);

  // DM相手の名前を取得
  const getDisplayName = (): string => {
    if (room.type === "group") return room.name || "グループ";
    const partnerId = getDMPartnerId(room, currentStaffId);
    const partner = mockStaff.find((s) => s.id === partnerId);
    return partner?.name || "不明";
  };

  // アバター表示
  const getAvatar = () => {
    if (room.type === "group") {
      return (
        <div className="w-12 h-12 rounded-full bg-[var(--ai)] flex items-center justify-center text-white font-bold">
          G
        </div>
      );
    }
    const partnerId = getDMPartnerId(room, currentStaffId);
    const partner = mockStaff.find((s) => s.id === partnerId);
    if (partner) {
      return (
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
          style={{ backgroundColor: partner.avatarColor }}
        >
          {partner.name.charAt(0)}
        </div>
      );
    }
    return (
      <div className="w-12 h-12 rounded-full bg-[var(--nezumi)] flex items-center justify-center text-white">
        <UserIcon size={20} />
      </div>
    );
  };

  const formatTime = (dateStr: string): string => {
    const date = new Date(dateStr);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return date.toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return date.toLocaleDateString("ja-JP", { month: "short", day: "numeric" });
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 transition-colors ${
        isSelected ? "bg-[rgba(27,73,101,0.1)]" : "hover:bg-[var(--shironeri-warm)]"
      }`}
    >
      {getAvatar()}
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between gap-2">
          <p className="font-medium text-[var(--sumi)] truncate">{getDisplayName()}</p>
          {lastMessage && (
            <span className="text-xs text-[var(--nezumi)] shrink-0">
              {formatTime(lastMessage.sentAt)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className="text-sm text-[var(--nezumi)] truncate">
            {lastMessage?.content || "メッセージなし"}
          </p>
          {unreadCount > 0 && (
            <span className="shrink-0 min-w-5 h-5 px-1.5 rounded-full bg-[var(--shu)] text-white text-xs font-medium flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

// 新規チャット作成モーダル
interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStaffId: string;
  onCreateDM: (staffId: string) => void;
  onCreateGroup: (name: string, staffIds: string[]) => void;
}

const NewChatModal = ({
  isOpen,
  onClose,
  currentStaffId,
  onCreateDM,
  onCreateGroup,
}: NewChatModalProps) => {
  const [mode, setMode] = useState<"dm" | "group">("dm");
  const [groupName, setGroupName] = useState("");
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);

  const availableStaff = mockStaff.filter((s) => s.id !== currentStaffId);

  const handleToggleStaff = (staffId: string) => {
    setSelectedStaffIds((prev) =>
      prev.includes(staffId) ? prev.filter((id) => id !== staffId) : [...prev, staffId],
    );
  };

  const handleSubmit = () => {
    if (mode === "dm" && selectedStaffIds.length === 1) {
      onCreateDM(selectedStaffIds[0]);
    } else if (mode === "group" && selectedStaffIds.length > 0 && groupName) {
      onCreateGroup(groupName, selectedStaffIds);
    }
    onClose();
    setSelectedStaffIds([]);
    setGroupName("");
  };

  if (!isOpen) return null;

  const canSubmit =
    mode === "dm"
      ? selectedStaffIds.length === 1
      : selectedStaffIds.length > 0 && groupName.trim() !== "";

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between p-4 border-b border-[var(--shironeri-warm)]">
        <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--shironeri-warm)]">
          <ArrowLeftIcon size={20} />
        </button>
        <h2 className="text-lg font-display font-bold text-[var(--sumi)]">新規チャット</h2>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Mode Switch */}
      <div className="shrink-0 p-4 border-b border-[var(--shironeri-warm)]">
        <div className="flex gap-2">
          <button
            onClick={() => {
              setMode("dm");
              setSelectedStaffIds([]);
            }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              mode === "dm"
                ? "bg-[var(--ai)] text-white"
                : "bg-[var(--shironeri-warm)] text-[var(--sumi)]"
            }`}
          >
            個人チャット
          </button>
          <button
            onClick={() => {
              setMode("group");
              setSelectedStaffIds([]);
            }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              mode === "group"
                ? "bg-[var(--ai)] text-white"
                : "bg-[var(--shironeri-warm)] text-[var(--sumi)]"
            }`}
          >
            グループ
          </button>
        </div>
      </div>

      {/* Group Name Input */}
      {mode === "group" && (
        <div className="shrink-0 p-4 border-b border-[var(--shironeri-warm)]">
          <label className="block text-sm font-medium text-[var(--sumi)] mb-2">グループ名</label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="グループ名を入力"
            className="w-full p-3 border border-[var(--nezumi)]/30 rounded-lg text-sm focus:outline-none focus:border-[var(--ai)]"
          />
        </div>
      )}

      {/* Staff List */}
      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-sm text-[var(--nezumi)] mb-3">
          {mode === "dm" ? "スタッフを選択" : "メンバーを選択"}
          {selectedStaffIds.length > 0 && (
            <span className="ml-2 text-[var(--ai)]">({selectedStaffIds.length}名選択中)</span>
          )}
        </p>
        <div className="space-y-2">
          {availableStaff.map((staff) => {
            const isSelected = selectedStaffIds.includes(staff.id);
            return (
              <button
                key={staff.id}
                onClick={() => {
                  if (mode === "dm") {
                    setSelectedStaffIds([staff.id]);
                  } else {
                    handleToggleStaff(staff.id);
                  }
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isSelected
                    ? "bg-[rgba(27,73,101,0.1)] border border-[var(--ai)]"
                    : "bg-[var(--shironeri-warm)]"
                }`}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: staff.avatarColor }}
                >
                  {staff.name.charAt(0)}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-[var(--sumi)]">{staff.name}</p>
                  <p className="text-xs text-[var(--nezumi)]">{staff.role}</p>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-[var(--ai)] flex items-center justify-center">
                    <CheckIcon size={14} className="text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 p-4 border-t border-[var(--shironeri-warm)] safe-area-pb">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            canSubmit
              ? "bg-[var(--ai)] text-white"
              : "bg-[var(--nezumi)]/20 text-[var(--nezumi)] cursor-not-allowed"
          }`}
        >
          チャットを開始
        </button>
      </div>
    </div>
  );
};

// メインコンポーネント
export const StaffChat = ({ currentStaff }: StaffChatProps) => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // チャットルーム一覧を取得
  useEffect(() => {
    const rooms = getChatRoomsByStaff(currentStaff.id);
    setChatRooms(rooms);
  }, [currentStaff.id]);

  // メッセージが追加されたらスクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedRoomId]);

  const selectedRoom = selectedRoomId ? chatRooms.find((r) => r.id === selectedRoomId) : null;
  const roomMessages = selectedRoomId ? getMessagesByChatRoom(selectedRoomId) : [];

  // メッセージ送信
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedRoomId) return;

    const newMsg: ChatMessage = {
      id: `MSG-${Date.now()}`,
      chatRoomId: selectedRoomId,
      senderId: currentStaff.id,
      senderName: currentStaff.name,
      content: newMessage.trim(),
      sentAt: new Date().toISOString(),
      readBy: [currentStaff.id],
    };

    setMessages((prev) => [...prev, newMsg]);
    setNewMessage("");

    // 最終メッセージ時刻を更新
    setChatRooms((prev) =>
      prev.map((room) =>
        room.id === selectedRoomId ? { ...room, lastMessageAt: newMsg.sentAt } : room,
      ),
    );
  };

  // 新規DMを作成
  const handleCreateDM = (staffId: string) => {
    // 既存のDMがあるかチェック
    const existingRoom = chatRooms.find(
      (room) =>
        room.type === "dm" &&
        room.participants.includes(currentStaff.id) &&
        room.participants.includes(staffId),
    );

    if (existingRoom) {
      setSelectedRoomId(existingRoom.id);
      return;
    }

    // 新規DM作成
    const newRoom: ChatRoom = {
      id: `CHAT-${Date.now()}`,
      type: "dm",
      participants: [currentStaff.id, staffId],
      createdAt: new Date().toISOString(),
    };

    setChatRooms((prev) => [newRoom, ...prev]);
    setSelectedRoomId(newRoom.id);
  };

  // 新規グループを作成
  const handleCreateGroup = (name: string, staffIds: string[]) => {
    const newRoom: ChatRoom = {
      id: `CHAT-${Date.now()}`,
      type: "group",
      name,
      participants: [currentStaff.id, ...staffIds],
      createdAt: new Date().toISOString(),
    };

    setChatRooms((prev) => [newRoom, ...prev]);
    setSelectedRoomId(newRoom.id);
  };

  // ルーム名を取得
  const getRoomName = (room: ChatRoom): string => {
    if (room.type === "group") return room.name || "グループ";
    const partnerId = getDMPartnerId(room, currentStaff.id);
    const partner = mockStaff.find((s) => s.id === partnerId);
    return partner?.name || "不明";
  };

  // メッセージ一覧（モバイルビュー）
  const renderChatView = () => {
    if (!selectedRoom) return null;

    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="shrink-0 flex items-center gap-3 p-4 bg-white border-b border-[var(--shironeri-warm)]">
          <button
            onClick={() => setSelectedRoomId(null)}
            className="p-1 rounded hover:bg-[var(--shironeri-warm)]"
          >
            <ArrowLeftIcon size={24} />
          </button>
          <div className="flex-1">
            <p className="font-display font-medium text-[var(--sumi)]">
              {getRoomName(selectedRoom)}
            </p>
            {selectedRoom.type === "group" && (
              <p className="text-xs text-[var(--nezumi)]">
                {selectedRoom.participants.length}人のメンバー
              </p>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--shironeri)]">
          {roomMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-[var(--nezumi)]">
              <MessageIcon size={48} className="mb-4 opacity-50" />
              <p>まだメッセージがありません</p>
              <p className="text-sm mt-1">最初のメッセージを送信しましょう</p>
            </div>
          ) : (
            roomMessages.map((msg) => {
              const isOwn = msg.senderId === currentStaff.id;
              const sender = mockStaff.find((s) => s.id === msg.senderId);

              return (
                <div key={msg.id} className={`flex gap-2 ${isOwn ? "flex-row-reverse" : ""}`}>
                  {!isOwn && (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                      style={{
                        backgroundColor: sender?.avatarColor || "#888",
                      }}
                    >
                      {sender?.name.charAt(0) || "?"}
                    </div>
                  )}
                  <div className={`max-w-[75%] ${isOwn ? "items-end" : "items-start"}`}>
                    {!isOwn && selectedRoom.type === "group" && (
                      <p className="text-xs text-[var(--nezumi)] mb-1 ml-1">{msg.senderName}</p>
                    )}
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        isOwn
                          ? "bg-[var(--ai)] text-white rounded-br-sm"
                          : "bg-white text-[var(--sumi)] rounded-bl-sm"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    <p
                      className={`text-[10px] text-[var(--nezumi)] mt-1 ${isOwn ? "text-right mr-1" : "ml-1"}`}
                    >
                      {new Date(msg.sentAt).toLocaleTimeString("ja-JP", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="shrink-0 p-4 bg-white border-t border-[var(--shironeri-warm)] safe-area-pb">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="メッセージを入力..."
              className="flex-1 p-3 bg-[var(--shironeri-warm)] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ai)]/30"
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className={`p-3 rounded-full transition-colors ${
                newMessage.trim()
                  ? "bg-[var(--ai)] text-white"
                  : "bg-[var(--nezumi)]/20 text-[var(--nezumi)]"
              }`}
            >
              <SendIcon size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ルーム一覧ビュー
  const renderRoomList = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between p-4 bg-white border-b border-[var(--shironeri-warm)]">
        <h1 className="text-xl font-display font-semibold text-[var(--sumi)]">チャット</h1>
        <button
          onClick={() => setIsNewChatModalOpen(true)}
          className="p-2 rounded-full bg-[var(--ai)] text-white"
        >
          <PlusIcon size={20} />
        </button>
      </div>

      {/* Room List */}
      <div className="flex-1 overflow-y-auto">
        {chatRooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-[var(--nezumi)]">
            <MessageIcon size={48} className="mb-4 opacity-50" />
            <p>チャットがありません</p>
            <button
              onClick={() => setIsNewChatModalOpen(true)}
              className="mt-4 px-4 py-2 bg-[var(--ai)] text-white rounded-lg text-sm"
            >
              新規チャットを開始
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[var(--shironeri-warm)]">
            {chatRooms.map((room) => (
              <ChatRoomItem
                key={room.id}
                room={room}
                currentStaffId={currentStaff.id}
                isSelected={selectedRoomId === room.id}
                onClick={() => setSelectedRoomId(room.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-4rem)] bg-white">
      {selectedRoomId ? renderChatView() : renderRoomList()}

      {/* New Chat Modal */}
      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        currentStaffId={currentStaff.id}
        onCreateDM={handleCreateDM}
        onCreateGroup={handleCreateGroup}
      />
    </div>
  );
};
