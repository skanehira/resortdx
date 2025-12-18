import { useState, useRef, useEffect } from "react";
import type { ShuttleMessage, ShuttleMessageType } from "../../types";
import { SendIcon, MessageIcon } from "../ui/Icons";

interface ShuttleMessagePanelProps {
  messages: ShuttleMessage[];
  currentSenderType: "staff" | "guest";
  currentSenderId: string;
  currentSenderName: string;
  onSendMessage: (content: string, messageType: ShuttleMessageType) => void;
  maxHeight?: string;
}

export const ShuttleMessagePanel = ({
  messages,
  currentSenderType,
  currentSenderId,
  currentSenderName: _currentSenderName,
  onSendMessage,
  maxHeight = "200px",
}: ShuttleMessagePanelProps) => {
  // currentSenderName is kept for future use (e.g., displaying "You" vs actual name)
  void _currentSenderName;
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 新しいメッセージが来たらスクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim(), "normal");
    setInputText("");
    inputRef.current?.focus();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMessageStyle = (message: ShuttleMessage) => {
    const isOwn = message.senderType === currentSenderType && message.senderId === currentSenderId;

    // メッセージタイプ別の背景色
    if (message.messageType === "sos") {
      return {
        container: `flex ${isOwn ? "justify-end" : "justify-start"}`,
        bubble: `max-w-[80%] px-3 py-2 rounded-2xl ${
          isOwn
            ? "bg-[var(--shu)] text-white rounded-br-md"
            : "bg-[var(--shu)]/20 text-[var(--shu)] rounded-bl-md"
        }`,
        time: isOwn ? "text-white/70" : "text-[var(--shu)]/70",
      };
    }

    if (message.messageType === "arrival") {
      return {
        container: `flex ${isOwn ? "justify-end" : "justify-start"}`,
        bubble: `max-w-[80%] px-3 py-2 rounded-2xl ${
          isOwn
            ? "bg-[var(--aotake)] text-white rounded-br-md"
            : "bg-[var(--aotake)]/20 text-[var(--aotake-dark)] rounded-bl-md"
        }`,
        time: isOwn ? "text-white/70" : "text-[var(--aotake)]/70",
      };
    }

    if (message.messageType === "delay") {
      return {
        container: `flex ${isOwn ? "justify-end" : "justify-start"}`,
        bubble: `max-w-[80%] px-3 py-2 rounded-2xl ${
          isOwn
            ? "bg-[var(--kincha)] text-white rounded-br-md"
            : "bg-[var(--kincha)]/20 text-[var(--kincha-dark)] rounded-bl-md"
        }`,
        time: isOwn ? "text-white/70" : "text-[var(--kincha)]/70",
      };
    }

    // 通常メッセージ
    return {
      container: `flex ${isOwn ? "justify-end" : "justify-start"}`,
      bubble: `max-w-[80%] px-3 py-2 rounded-2xl ${
        isOwn
          ? "bg-[var(--ai)] text-white rounded-br-md"
          : "bg-[var(--shironeri-warm)] text-[var(--sumi)] rounded-bl-md"
      }`,
      time: isOwn ? "text-white/70" : "text-[var(--nezumi)]",
    };
  };

  return (
    <div className="bg-white rounded-lg border border-[var(--nezumi)]/20 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[var(--shironeri-warm)] border-b border-[var(--nezumi)]/10">
        <MessageIcon size={16} className="text-[var(--ai)]" />
        <span className="text-sm font-medium text-[var(--sumi)]">
          {currentSenderType === "staff" ? "ゲストとのやり取り" : "ドライバーとのやり取り"}
        </span>
        {messages.length > 0 && (
          <span className="text-xs text-[var(--nezumi)] ml-auto">{messages.length}件</span>
        )}
      </div>

      {/* Messages */}
      <div className="overflow-y-auto p-3 space-y-2" style={{ maxHeight, minHeight: "80px" }}>
        {messages.length === 0 ? (
          <div className="text-center text-sm text-[var(--nezumi)] py-4">
            メッセージはまだありません
          </div>
        ) : (
          messages.map((message) => {
            const style = getMessageStyle(message);
            return (
              <div key={message.id} className={style.container}>
                <div className={style.bubble}>
                  {/* SOS badge */}
                  {message.messageType === "sos" && (
                    <span className="text-[10px] font-bold mb-1 block">SOS</span>
                  )}
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <div className={`text-[10px] mt-1 ${style.time}`}>
                    {message.senderType === currentSenderType ? "" : `${message.senderName} · `}
                    {formatTime(message.sentAt)}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 p-2 border-t border-[var(--nezumi)]/10"
      >
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="メッセージを入力..."
          className="flex-1 px-3 py-2 text-sm bg-[var(--shironeri-warm)] rounded-full border-none outline-none focus:ring-2 focus:ring-[var(--ai)]/30"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className={`p-2 rounded-full transition-colors ${
            inputText.trim()
              ? "bg-[var(--ai)] text-white"
              : "bg-[var(--nezumi)]/20 text-[var(--nezumi)]"
          }`}
        >
          <SendIcon size={18} />
        </button>
      </form>
    </div>
  );
};
