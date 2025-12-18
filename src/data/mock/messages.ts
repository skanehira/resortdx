import type { StaffMessage } from "../../types";

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
		content:
			"102号室のエアコンから異音がしています。修理が必要かもしれません。",
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
		content:
			"鳥羽駅への迎えですが、電車が15分遅延しているとの連絡がありました。出発を調整します。",
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
