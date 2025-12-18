import { useState } from "react";
import type { StaffMessage, Staff, UnifiedTask } from "../../types";
import { SendIcon, CheckIcon, ClockIcon } from "../ui/Icons";

interface MobileMessagesProps {
	messages: StaffMessage[];
	currentStaff: Staff;
	tasks: UnifiedTask[]; // 関連タスク選択用
	onSendMessage: (content: string, relatedTaskId?: string) => void;
}

// 単一メッセージカード
const MessageCard = ({ message }: { message: StaffMessage }) => {
	const isRead = !!message.readAt;
	const hasReply = !!message.reply;

	return (
		<div className="shoji-panel p-4 space-y-3">
			{/* Header */}
			<div className="flex items-center justify-between">
				<span className="text-xs text-[var(--nezumi)]">
					{new Date(message.sentAt).toLocaleString("ja-JP", {
						month: "short",
						day: "numeric",
						hour: "2-digit",
						minute: "2-digit",
					})}
				</span>
				<div className="flex items-center gap-1">
					{isRead ? (
						<span className="flex items-center gap-1 text-xs text-[var(--aotake)]">
							<CheckIcon size={12} />
							既読
						</span>
					) : (
						<span className="flex items-center gap-1 text-xs text-[var(--nezumi)]">
							<ClockIcon size={12} />
							未読
						</span>
					)}
				</div>
			</div>

			{/* Message content */}
			<div className="p-3 bg-[var(--ai)]/10 rounded-lg rounded-tl-none">
				<p className="text-sm text-[var(--sumi)]">{message.content}</p>
			</div>

			{/* Related task */}
			{message.relatedTaskId && (
				<div className="text-xs text-[var(--nezumi)] p-2 bg-[var(--shironeri-warm)] rounded">
					関連タスク: {message.relatedTaskId}
				</div>
			)}

			{/* Reply */}
			{hasReply && message.reply && (
				<div className="space-y-2">
					<div className="flex items-center gap-2">
						<div className="flex-1 h-px bg-[var(--nezumi)]/20" />
						<span className="text-xs text-[var(--nezumi)]">返信</span>
						<div className="flex-1 h-px bg-[var(--nezumi)]/20" />
					</div>
					<div className="p-3 bg-[var(--kincha)]/10 rounded-lg rounded-tr-none ml-4">
						<p className="text-sm text-[var(--sumi)]">
							{message.reply.content}
						</p>
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
		</div>
	);
};

// メッセージ作成フォーム
interface MessageFormProps {
	tasks: UnifiedTask[];
	onSend: (content: string, relatedTaskId?: string) => void;
}

const MessageForm = ({ tasks, onSend }: MessageFormProps) => {
	const [content, setContent] = useState("");
	const [selectedTaskId, setSelectedTaskId] = useState<string>("");
	const [showTaskSelector, setShowTaskSelector] = useState(false);

	const handleSubmit = () => {
		if (!content.trim()) return;
		onSend(content.trim(), selectedTaskId || undefined);
		setContent("");
		setSelectedTaskId("");
	};

	// 未完了のタスクのみ表示
	const activeTasks = tasks.filter((t) => t.status !== "completed");

	return (
		<div className="shoji-panel p-4 space-y-4">
			<h3 className="text-sm font-medium text-[var(--sumi)]">
				管理者へメッセージを送信
			</h3>

			{/* Task selector (optional) */}
			<div>
				<button
					onClick={() => setShowTaskSelector(!showTaskSelector)}
					className="text-sm text-[var(--ai)] hover:underline"
				>
					{selectedTaskId
						? `関連タスク: ${activeTasks.find((t) => t.id === selectedTaskId)?.title || selectedTaskId}`
						: "タスクを関連付ける（任意）"}
				</button>

				{showTaskSelector && (
					<div className="mt-2 max-h-48 overflow-y-auto border border-[var(--nezumi)]/20 rounded-lg">
						<button
							onClick={() => {
								setSelectedTaskId("");
								setShowTaskSelector(false);
							}}
							className={`w-full p-3 text-left text-sm border-b border-[var(--nezumi)]/10 ${
								!selectedTaskId
									? "bg-[var(--ai)]/10 text-[var(--ai)]"
									: "text-[var(--nezumi)]"
							}`}
						>
							関連タスクなし
						</button>
						{activeTasks.map((task) => (
							<button
								key={task.id}
								onClick={() => {
									setSelectedTaskId(task.id);
									setShowTaskSelector(false);
								}}
								className={`w-full p-3 text-left text-sm border-b border-[var(--nezumi)]/10 last:border-b-0 ${
									selectedTaskId === task.id
										? "bg-[var(--ai)]/10 text-[var(--ai)]"
										: "text-[var(--sumi)] hover:bg-[var(--shironeri-warm)]"
								}`}
							>
								<span className="font-medium">{task.title}</span>
								{task.roomNumber && (
									<span className="text-xs text-[var(--nezumi)] ml-2">
										{task.roomNumber}号室
									</span>
								)}
							</button>
						))}
					</div>
				)}
			</div>

			{/* Message input */}
			<textarea
				value={content}
				onChange={(e) => setContent(e.target.value)}
				placeholder="メッセージを入力..."
				className="w-full p-3 border border-[var(--nezumi)]/30 rounded-lg text-sm resize-none focus:outline-none focus:border-[var(--ai)]"
				rows={4}
			/>

			{/* Send button */}
			<button
				onClick={handleSubmit}
				disabled={!content.trim()}
				className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
					content.trim()
						? "bg-[var(--ai)] text-white"
						: "bg-[var(--nezumi)]/20 text-[var(--nezumi)] cursor-not-allowed"
				}`}
			>
				<SendIcon size={18} />
				送信
			</button>
		</div>
	);
};

// メインコンポーネント
export const MobileMessages = ({
	messages,
	currentStaff,
	tasks,
	onSendMessage,
}: MobileMessagesProps) => {
	// 自分のメッセージのみ表示
	const myMessages = messages
		.filter((m) => m.senderId === currentStaff.id)
		.sort(
			(a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime(),
		);

	// 未読の返信があるかどうか
	const hasUnreadReplies = myMessages.some((m) => m.reply && m.readAt === null);

	return (
		<div className="min-h-screen bg-[var(--shironeri)] pb-20">
			{/* Header */}
			<div className="sticky top-0 z-10 bg-[var(--shironeri)] border-b border-[rgba(45,41,38,0.06)]">
				<div className="p-4">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-xl font-display font-semibold text-[var(--sumi)]">
								メッセージ
							</h1>
							<p className="text-sm text-[var(--nezumi)]">管理者への連絡</p>
						</div>
						{hasUnreadReplies && (
							<span className="px-2 py-1 bg-[var(--shu)] text-white text-xs rounded-full">
								返信あり
							</span>
						)}
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="p-4 space-y-4">
				{/* New message form */}
				<MessageForm tasks={tasks} onSend={onSendMessage} />

				{/* Messages list */}
				<div>
					<h3 className="text-sm font-medium text-[var(--nezumi)] mb-3">
						送信履歴 ({myMessages.length}件)
					</h3>
					<div className="space-y-3">
						{myMessages.map((message) => (
							<MessageCard key={message.id} message={message} />
						))}

						{myMessages.length === 0 && (
							<div className="shoji-panel p-8 text-center">
								<p className="text-[var(--nezumi)]">
									送信したメッセージはありません
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
