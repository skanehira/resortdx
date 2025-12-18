import type { ChatRoom, ChatMessage } from "../../types";

// === Mock Chat Rooms ===
export const mockChatRooms: ChatRoom[] = [
  {
    id: "CHAT-001",
    type: "dm",
    participants: ["STF001", "STF002"],
    lastMessageAt: "2024-12-19T10:30:00",
    createdAt: "2024-12-01T09:00:00",
  },
  {
    id: "CHAT-002",
    type: "dm",
    participants: ["STF001", "STF003"],
    lastMessageAt: "2024-12-19T09:15:00",
    createdAt: "2024-12-05T14:00:00",
  },
  {
    id: "CHAT-003",
    type: "group",
    name: "清掃チーム",
    participants: ["STF001", "STF003", "STF005"],
    lastMessageAt: "2024-12-19T11:00:00",
    createdAt: "2024-12-10T08:00:00",
  },
  {
    id: "CHAT-004",
    type: "group",
    name: "本日シフト",
    participants: ["STF001", "STF002", "STF003", "STF004", "STF005"],
    lastMessageAt: "2024-12-19T08:30:00",
    createdAt: "2024-12-19T07:00:00",
  },
  {
    id: "CHAT-005",
    type: "dm",
    participants: ["STF001", "STF004"],
    lastMessageAt: "2024-12-18T18:45:00",
    createdAt: "2024-12-15T10:00:00",
  },
];

// === Mock Chat Messages ===
export const mockChatMessages: ChatMessage[] = [
  // CHAT-001 (田中 ↔ 山田)
  {
    id: "MSG-001",
    chatRoomId: "CHAT-001",
    senderId: "STF002",
    senderName: "山田 花子",
    content: "201号室の清掃完了しました！",
    sentAt: "2024-12-19T10:25:00",
    readBy: ["STF002", "STF001"],
  },
  {
    id: "MSG-002",
    chatRoomId: "CHAT-001",
    senderId: "STF001",
    senderName: "田中 太郎",
    content: "ありがとうございます！点検に向かいます",
    sentAt: "2024-12-19T10:30:00",
    readBy: ["STF001"],
  },

  // CHAT-002 (田中 ↔ 鈴木)
  {
    id: "MSG-003",
    chatRoomId: "CHAT-002",
    senderId: "STF003",
    senderName: "鈴木 一郎",
    content: "305号室のエアコン、少し調子悪いかもしれません",
    sentAt: "2024-12-19T09:10:00",
    readBy: ["STF003", "STF001"],
  },
  {
    id: "MSG-004",
    chatRoomId: "CHAT-002",
    senderId: "STF001",
    senderName: "田中 太郎",
    content: "確認しておきます。報告ありがとうございます！",
    sentAt: "2024-12-19T09:15:00",
    readBy: ["STF001"],
  },

  // CHAT-003 (清掃チーム)
  {
    id: "MSG-005",
    chatRoomId: "CHAT-003",
    senderId: "STF001",
    senderName: "田中 太郎",
    content: "本日のチェックアウト多めです。効率よく回りましょう",
    sentAt: "2024-12-19T10:45:00",
    readBy: ["STF001", "STF003"],
  },
  {
    id: "MSG-006",
    chatRoomId: "CHAT-003",
    senderId: "STF003",
    senderName: "鈴木 一郎",
    content: "了解です！3階から始めます",
    sentAt: "2024-12-19T10:50:00",
    readBy: ["STF003"],
  },
  {
    id: "MSG-007",
    chatRoomId: "CHAT-003",
    senderId: "STF005",
    senderName: "高橋 美咲",
    content: "私は2階担当します",
    sentAt: "2024-12-19T11:00:00",
    readBy: ["STF005"],
  },

  // CHAT-004 (本日シフト)
  {
    id: "MSG-008",
    chatRoomId: "CHAT-004",
    senderId: "STF001",
    senderName: "田中 太郎",
    content: "おはようございます。本日もよろしくお願いします！",
    sentAt: "2024-12-19T08:00:00",
    readBy: ["STF001", "STF002", "STF003", "STF004", "STF005"],
  },
  {
    id: "MSG-009",
    chatRoomId: "CHAT-004",
    senderId: "STF004",
    senderName: "佐藤 健二",
    content: "今日は記念日のお客様がいるので、サプライズ準備お願いします",
    sentAt: "2024-12-19T08:15:00",
    readBy: ["STF001", "STF002", "STF003", "STF004", "STF005"],
  },
  {
    id: "MSG-010",
    chatRoomId: "CHAT-004",
    senderId: "STF002",
    senderName: "山田 花子",
    content: "承知しました！ケーキは16時に届く予定です",
    sentAt: "2024-12-19T08:30:00",
    readBy: ["STF002", "STF003", "STF004"],
  },

  // CHAT-005 (田中 ↔ 佐藤)
  {
    id: "MSG-011",
    chatRoomId: "CHAT-005",
    senderId: "STF001",
    senderName: "田中 太郎",
    content: "明日の送迎、10時と14時でお願いできますか？",
    sentAt: "2024-12-18T18:30:00",
    readBy: ["STF001", "STF004"],
  },
  {
    id: "MSG-012",
    chatRoomId: "CHAT-005",
    senderId: "STF004",
    senderName: "佐藤 健二",
    content: "大丈夫です。車両確認しておきます",
    sentAt: "2024-12-18T18:45:00",
    readBy: ["STF004"],
  },
];

// === Helper Functions ===

// チャットルーム一覧を取得（スタッフID指定）
export const getChatRoomsByStaff = (staffId: string): ChatRoom[] =>
  mockChatRooms
    .filter((room) => room.participants.includes(staffId))
    .sort((a, b) => {
      const timeA = a.lastMessageAt
        ? new Date(a.lastMessageAt).getTime()
        : new Date(a.createdAt).getTime();
      const timeB = b.lastMessageAt
        ? new Date(b.lastMessageAt).getTime()
        : new Date(b.createdAt).getTime();
      return timeB - timeA;
    });

// チャットルームのメッセージを取得
export const getMessagesByChatRoom = (chatRoomId: string): ChatMessage[] =>
  mockChatMessages
    .filter((msg) => msg.chatRoomId === chatRoomId)
    .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());

// 未読メッセージ数を取得
export const getUnreadCountByRoom = (chatRoomId: string, staffId: string): number =>
  mockChatMessages.filter((msg) => msg.chatRoomId === chatRoomId && !msg.readBy.includes(staffId))
    .length;

// チャットルームの最新メッセージを取得
export const getLastMessageByRoom = (chatRoomId: string): ChatMessage | undefined =>
  mockChatMessages
    .filter((msg) => msg.chatRoomId === chatRoomId)
    .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())[0];

// チャットルームを取得
export const getChatRoomById = (chatRoomId: string): ChatRoom | undefined =>
  mockChatRooms.find((room) => room.id === chatRoomId);

// DM相手のスタッフIDを取得
export const getDMPartnerId = (room: ChatRoom, currentStaffId: string): string | null => {
  if (room.type !== "dm") return null;
  return room.participants.find((id) => id !== currentStaffId) || null;
};
