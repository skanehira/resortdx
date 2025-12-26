import type { StaffMessage, GuestRequest } from "../../types";

const getToday = (): string => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

export const mockStaffMessages: StaffMessage[] = [
  {
    id: "MSG001",
    senderId: "STF001",
    content:
      "201号室の清掃完了しました。アメニティの補充をお願いしたいのですが、在庫は十分ありますか？",
    sentAt: getToday() + "T10:45:00",
    readAt: getToday() + "T10:50:00",
    relatedTaskId: "UT-HK-001",
    reply: {
      content:
        "在庫確認しました。シャンプーとコンディショナーの在庫が少なめです。本日中に発注しますので、現状の在庫で対応お願いします。",
      repliedBy: "管理者",
      repliedAt: getToday() + "T10:52:00",
    },
  },
  {
    id: "MSG002",
    senderId: "STF003",
    content: "102号室のエアコンから異音がしています。修理が必要かもしれません。",
    sentAt: getToday() + "T11:30:00",
    readAt: getToday() + "T11:35:00",
    relatedTaskId: null,
    reply: {
      content:
        "報告ありがとうございます。メンテナンス業者に連絡しました。本日夕方に確認に来る予定です。",
      repliedBy: "管理者",
      repliedAt: getToday() + "T11:40:00",
    },
  },
  {
    id: "MSG003",
    senderId: "STF002",
    content:
      "201号室のお客様から、デザートのタイミングを少し遅らせてほしいとリクエストがありました。19:45頃でよろしいでしょうか？",
    sentAt: getToday() + "T19:15:00",
    readAt: null,
    relatedTaskId: "UT-ML-001",
    reply: null,
  },
  {
    id: "MSG004",
    senderId: "STF004",
    content: "鳥羽駅への迎えですが、電車が15分遅延しているとの連絡がありました。出発を調整します。",
    sentAt: getToday() + "T15:00:00",
    readAt: getToday() + "T15:05:00",
    relatedTaskId: "UT-SH-001",
    reply: {
      content: "了解です。お客様にはおもてなしの気持ちで対応お願いします。",
      repliedBy: "管理者",
      repliedAt: getToday() + "T15:07:00",
    },
  },
  {
    id: "MSG005",
    senderId: "STF005",
    content:
      "401号室のバースデーセッティングについて、バルーンの色はピンクと白でよろしいでしょうか？ご主人様から追加のご希望があれば確認したいです。",
    sentAt: getToday() + "T13:30:00",
    readAt: null,
    relatedTaskId: "UT-CB-002",
    reply: null,
  },
];

// === Staff Message Helper Functions ===
export const getMessagesByStaff = (staffId: string): StaffMessage[] =>
  mockStaffMessages.filter((m) => m.senderId === staffId);

export const getUnreadMessages = (): StaffMessage[] =>
  mockStaffMessages.filter((m) => m.readAt === null);

// === Guest Requests ===
export const mockGuestRequests: GuestRequest[] = [
  {
    id: "GR001",
    roomId: "101",
    guestName: "山田 太郎",
    requestType: "checkout",
    content: "チェックアウトを11時まで延長していただけますでしょうか？",
    status: "completed",
    createdAt: getToday() + "T08:30:00",
    readAt: getToday() + "T08:35:00",
    reply: {
      content:
        "ご連絡ありがとうございます。11時までのレイトチェックアウトを承りました。ごゆっくりお過ごしください。",
      repliedBy: "フロント 鈴木",
      repliedAt: getToday() + "T08:40:00",
    },
    completedAt: getToday() + "T08:40:00",
    completedBy: "STF006",
  },
  {
    id: "GR002",
    roomId: "201",
    guestName: "佐藤 花子",
    requestType: "amenity",
    content: "歯ブラシセットを追加で2つお願いします。",
    status: "in_progress",
    createdAt: getToday() + "T09:15:00",
    readAt: getToday() + "T09:20:00",
    reply: {
      content: "かしこまりました。ただいまお部屋にお届けいたします。",
      repliedBy: "清掃 田中",
      repliedAt: getToday() + "T09:22:00",
    },
    completedAt: null,
    completedBy: null,
  },
  {
    id: "GR003",
    roomId: "301",
    guestName: "鈴木 一郎",
    requestType: "no_cleaning",
    content: "本日は清掃不要でお願いします。タオルだけ交換していただけると助かります。",
    status: "pending",
    createdAt: getToday() + "T10:00:00",
    readAt: null,
    reply: null,
    completedAt: null,
    completedBy: null,
  },
  {
    id: "GR004",
    roomId: "401",
    guestName: "田中 美咲",
    requestType: "meal",
    content: "夕食の時間を19:00から19:30に変更していただけますか？",
    status: "completed",
    createdAt: getToday() + "T14:30:00",
    readAt: getToday() + "T14:35:00",
    reply: {
      content: "ご連絡ありがとうございます。19:30にお食事をご用意いたします。",
      repliedBy: "配膳 木村",
      repliedAt: getToday() + "T14:40:00",
    },
    completedAt: getToday() + "T14:40:00",
    completedBy: "STF002",
  },
  {
    id: "GR005",
    roomId: "102",
    guestName: "高橋 健太",
    requestType: "towel",
    content: "バスタオルを2枚追加でお願いできますか？",
    status: "pending",
    createdAt: getToday() + "T11:45:00",
    readAt: null,
    reply: null,
    completedAt: null,
    completedBy: null,
  },
  {
    id: "GR006",
    roomId: "201",
    guestName: "佐藤 花子",
    requestType: "celebration",
    content:
      "サプライズで小さなケーキを追加でお願いできますか？メッセージプレートに「おめでとう」と書いていただけると嬉しいです。",
    status: "in_progress",
    createdAt: getToday() + "T13:00:00",
    readAt: getToday() + "T13:10:00",
    reply: {
      content:
        "ケーキのご手配を承りました。「おめでとう」のメッセージプレートをお付けして、夕食時にお出しいたします。",
      repliedBy: "コンシェルジュ 伊藤",
      repliedAt: getToday() + "T13:15:00",
    },
    completedAt: null,
    completedBy: null,
  },
  {
    id: "GR007",
    roomId: "302",
    guestName: "渡辺 優子",
    requestType: "other",
    content: "お部屋に加湿器を設置していただくことは可能でしょうか？乾燥が気になります。",
    status: "pending",
    createdAt: getToday() + "T16:20:00",
    readAt: null,
    reply: null,
    completedAt: null,
    completedBy: null,
  },
];

// === Guest Request Helper Functions ===
export const getGuestRequestsByRoom = (roomId: string): GuestRequest[] =>
  mockGuestRequests.filter((r) => r.roomId === roomId);

export const getUnreadGuestRequests = (): GuestRequest[] =>
  mockGuestRequests.filter((r) => r.readAt === null);

export const getPendingGuestRequests = (): GuestRequest[] =>
  mockGuestRequests.filter((r) => r.status === "pending");
