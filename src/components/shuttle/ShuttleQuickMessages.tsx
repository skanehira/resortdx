import { useState } from "react";
import type { ShuttleMessageType } from "../../types";
import { STAFF_QUICK_MESSAGES, GUEST_QUICK_MESSAGES, GUEST_SOS_MESSAGE } from "../../types";
import { AlertIcon, ClockIcon, CheckIcon } from "../ui/Icons";

interface ShuttleQuickMessagesProps {
  userType: "staff" | "guest";
  onSendQuickMessage: (content: string, messageType: ShuttleMessageType) => void;
  disabled?: boolean;
}

export const ShuttleQuickMessages = ({
  userType,
  onSendQuickMessage,
  disabled = false,
}: ShuttleQuickMessagesProps) => {
  const [showSOSConfirm, setShowSOSConfirm] = useState(false);
  const [sosDetail, setSOSDetail] = useState("");

  const quickMessages = userType === "staff" ? STAFF_QUICK_MESSAGES : GUEST_QUICK_MESSAGES;

  const handleQuickSend = (content: string, type: ShuttleMessageType) => {
    onSendQuickMessage(content, type);
  };

  const handleSOSSend = () => {
    const message = sosDetail.trim()
      ? `${GUEST_SOS_MESSAGE.content}\n詳細: ${sosDetail.trim()}`
      : GUEST_SOS_MESSAGE.content;
    onSendQuickMessage(message, "sos");
    setShowSOSConfirm(false);
    setSOSDetail("");
  };

  return (
    <div className="space-y-3">
      {/* Quick message buttons */}
      <div className="flex flex-wrap gap-2">
        {quickMessages.map((msg) => (
          <button
            key={msg.id}
            onClick={() => handleQuickSend(msg.content, msg.type)}
            disabled={disabled}
            className={`
							flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium
							transition-all active:scale-95
							${disabled ? "opacity-50 cursor-not-allowed" : ""}
							${
                msg.type === "arrival"
                  ? "bg-[var(--aotake)]/10 text-[var(--aotake)] hover:bg-[var(--aotake)]/20"
                  : msg.type === "delay"
                    ? "bg-[var(--kincha)]/10 text-[var(--kincha)] hover:bg-[var(--kincha)]/20"
                    : "bg-[var(--ai)]/10 text-[var(--ai)] hover:bg-[var(--ai)]/20"
              }
						`}
          >
            {msg.type === "arrival" && <CheckIcon size={14} />}
            {msg.type === "delay" && <ClockIcon size={14} />}
            {msg.content}
          </button>
        ))}
      </div>

      {/* SOS Button (guest only) */}
      {userType === "guest" && !showSOSConfirm && (
        <button
          onClick={() => setShowSOSConfirm(true)}
          disabled={disabled}
          className={`
						w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl
						bg-[var(--shu)]/10 text-[var(--shu)] font-medium
						border-2 border-dashed border-[var(--shu)]/30
						hover:bg-[var(--shu)]/20 hover:border-[var(--shu)]/50
						transition-all active:scale-[0.98]
						${disabled ? "opacity-50 cursor-not-allowed" : ""}
					`}
        >
          <AlertIcon size={18} />
          <span>場所がわかりません・助けが必要</span>
        </button>
      )}

      {/* SOS Confirmation Panel */}
      {userType === "guest" && showSOSConfirm && (
        <div className="p-4 bg-[var(--shu)]/10 rounded-xl border border-[var(--shu)]/30 space-y-3 animate-fade-in">
          <div className="flex items-center gap-2 text-[var(--shu)]">
            <AlertIcon size={18} />
            <span className="font-bold">緊急連絡</span>
          </div>
          <p className="text-sm text-[var(--sumi)]">
            ドライバーに緊急連絡を送信します。
            <br />
            現在地の詳細があれば入力してください。
          </p>
          <textarea
            value={sosDetail}
            onChange={(e) => setSOSDetail(e.target.value)}
            placeholder="例: 駅の南口にいます / コンビニの前です"
            className="w-full p-3 text-sm border border-[var(--shu)]/30 rounded-lg resize-none focus:outline-none focus:border-[var(--shu)]"
            rows={2}
          />
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowSOSConfirm(false);
                setSOSDetail("");
              }}
              className="flex-1 py-2 bg-[var(--nezumi)]/20 text-[var(--sumi)] rounded-lg font-medium"
            >
              キャンセル
            </button>
            <button
              onClick={handleSOSSend}
              className="flex-1 py-2 bg-[var(--shu)] text-white rounded-lg font-medium flex items-center justify-center gap-2"
            >
              <AlertIcon size={16} />
              送信
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
