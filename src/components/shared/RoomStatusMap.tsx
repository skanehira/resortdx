import { useState } from "react";
import type { RoomCleaningStatus, Task, Staff } from "../../types";
import { ROOM_CLEANING_STATUS_LABELS } from "../../types";
import { getRoomName } from "../../data/mock";
import { RoomIcon, ClockIcon } from "../ui/Icons";
import { Modal } from "../ui/Modal";

// フロア別部屋配置 (roomId based)
const FLOOR_LAYOUT: Record<string, string[]> = {
  "3F": ["ROOM-005", "ROOM-006"],
  "2F": ["ROOM-003", "ROOM-004"],
  "1F": ["ROOM-001", "ROOM-002"],
};

export interface RoomStatusInfo {
  roomId: string;
  status: RoomCleaningStatus;
  cleaningTask: Task | null;
  assignedStaff: Staff | null;
}

interface RoomStatusMapProps {
  roomStatuses: RoomStatusInfo[];
  currentStaffId?: string;
  onRoomClick?: (roomId: string) => void;
}

// ステータス別の色設定
const STATUS_COLORS: Record<RoomCleaningStatus, { bg: string; border: string; text: string }> = {
  not_cleaned: {
    bg: "bg-[var(--shu)]/20",
    border: "border-[var(--shu)]",
    text: "text-[var(--shu)]",
  },
  cleaning: {
    bg: "bg-[var(--ai)]/20",
    border: "border-[var(--ai)]",
    text: "text-[var(--ai)]",
  },
  cleaned: {
    bg: "bg-[var(--aotake)]/20",
    border: "border-[var(--aotake)]",
    text: "text-[var(--aotake)]",
  },
  inspected: {
    bg: "bg-[var(--kincha)]/20",
    border: "border-[var(--kincha)]",
    text: "text-[var(--kincha)]",
  },
};

// 部屋カード
const RoomCard = ({
  roomId,
  status,
  assignedStaff,
  isMyRoom,
  onClick,
}: {
  roomId: string;
  status: RoomCleaningStatus;
  assignedStaff: Staff | null;
  isMyRoom: boolean;
  onClick: () => void;
}) => {
  const colors = STATUS_COLORS[status];
  const roomName = getRoomName(roomId);

  return (
    <button
      onClick={onClick}
      className={`
        relative p-3 rounded-lg border-2 transition-all min-w-[100px]
        ${colors.bg} ${colors.border}
        ${isMyRoom ? "ring-2 ring-offset-2 ring-[var(--ai)]" : ""}
        hover:scale-105 active:scale-95
      `}
    >
      {/* 部屋名 */}
      <div className="text-sm font-display font-bold text-[var(--sumi)] truncate">{roomName}</div>

      {/* ステータス */}
      <div className={`text-xs font-medium ${colors.text}`}>
        {ROOM_CLEANING_STATUS_LABELS[status]}
      </div>

      {/* 担当者イニシャル（清掃中の場合） */}
      {assignedStaff && status === "cleaning" && (
        <div
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
          style={{ backgroundColor: assignedStaff.avatarColor }}
        >
          {assignedStaff.name.charAt(0)}
        </div>
      )}

      {/* 自分の担当マーク */}
      {isMyRoom && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-[var(--ai)] text-white text-[10px] rounded-full">
          担当
        </div>
      )}
    </button>
  );
};

// 詳細モーダル
const RoomDetailModal = ({ room, onClose }: { room: RoomStatusInfo; onClose: () => void }) => {
  const colors = STATUS_COLORS[room.status];
  const roomName = getRoomName(room.roomId);

  return (
    <Modal isOpen={true} onClose={onClose} title={roomName} size="md">
      {/* ステータスバッジ */}
      <div className="flex items-center gap-3 -mt-2 mb-4">
        <div className={`p-2 rounded-lg ${colors.bg} ${colors.border} border`}>
          <RoomIcon size={24} className={colors.text} />
        </div>
        <span className={`text-sm font-medium ${colors.text}`}>
          {ROOM_CLEANING_STATUS_LABELS[room.status]}
        </span>
      </div>

      {/* 詳細情報 */}
      <div className="space-y-3">
        {/* 担当者 */}
        {room.assignedStaff && (
          <div className="flex items-center gap-3 p-3 bg-[var(--shironeri-warm)] rounded-lg">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: room.assignedStaff.avatarColor }}
            >
              {room.assignedStaff.name.charAt(0)}
            </div>
            <div>
              <p className="text-xs text-[var(--nezumi)]">担当スタッフ</p>
              <p className="font-medium text-[var(--sumi)]">{room.assignedStaff.name}</p>
            </div>
          </div>
        )}

        {/* 予定時間 */}
        {room.cleaningTask && (
          <div className="flex items-center gap-3 p-3 bg-[var(--shironeri-warm)] rounded-lg">
            <ClockIcon size={20} className="text-[var(--nezumi)]" />
            <div>
              <p className="text-xs text-[var(--nezumi)]">予定時間</p>
              <p className="font-medium text-[var(--sumi)]">
                {room.cleaningTask.scheduledTime} 〜（
                {room.cleaningTask.estimatedDuration}分）
              </p>
            </div>
          </div>
        )}

        {/* タスク説明 */}
        {room.cleaningTask?.description && (
          <div className="p-3 bg-[var(--shironeri-warm)] rounded-lg">
            <p className="text-xs text-[var(--nezumi)] mb-1">メモ</p>
            <p className="text-sm text-[var(--sumi)]">{room.cleaningTask.description}</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

// 凡例
const Legend = () => (
  <div className="flex flex-wrap gap-3 justify-center">
    {(Object.entries(ROOM_CLEANING_STATUS_LABELS) as [RoomCleaningStatus, string][]).map(
      ([status, label]) => {
        const colors = STATUS_COLORS[status];
        return (
          <div key={status} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-sm ${colors.bg} ${colors.border} border`} />
            <span className="text-xs text-[var(--nezumi)]">{label}</span>
          </div>
        );
      },
    )}
  </div>
);

// メインコンポーネント
export const RoomStatusMap = ({
  roomStatuses,
  currentStaffId,
  onRoomClick,
}: RoomStatusMapProps) => {
  const [selectedRoom, setSelectedRoom] = useState<RoomStatusInfo | null>(null);

  const getRoomStatus = (roomId: string): RoomStatusInfo | undefined => {
    return roomStatuses.find((r) => r.roomId === roomId);
  };

  const handleRoomClick = (roomId: string) => {
    const room = getRoomStatus(roomId);
    if (room) {
      setSelectedRoom(room);
      onRoomClick?.(roomId);
    }
  };

  return (
    <div className="space-y-4">
      {/* 凡例 */}
      <Legend />

      {/* フロア別マップ */}
      <div className="space-y-4">
        {Object.entries(FLOOR_LAYOUT)
          .reverse()
          .map(([floor, rooms]) => (
            <div key={floor} className="flex items-center gap-4">
              {/* フロアラベル */}
              <div className="w-12 text-sm font-display font-medium text-[var(--nezumi)]">
                {floor}
              </div>

              {/* 部屋グリッド */}
              <div className="flex gap-3 flex-wrap">
                {rooms.map((roomId) => {
                  const room = getRoomStatus(roomId);
                  if (!room) {
                    return (
                      <div
                        key={roomId}
                        className="min-w-[100px] h-16 rounded-lg border-2 border-dashed border-[var(--nezumi-light)] flex items-center justify-center text-[var(--nezumi-light)] text-sm"
                      >
                        {getRoomName(roomId)}
                      </div>
                    );
                  }

                  const isMyRoom =
                    currentStaffId !== undefined &&
                    room.cleaningTask?.assignedStaffId === currentStaffId;

                  return (
                    <RoomCard
                      key={roomId}
                      roomId={roomId}
                      status={room.status}
                      assignedStaff={room.assignedStaff}
                      isMyRoom={isMyRoom}
                      onClick={() => handleRoomClick(roomId)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
      </div>

      {/* 詳細モーダル */}
      {selectedRoom && (
        <RoomDetailModal room={selectedRoom} onClose={() => setSelectedRoom(null)} />
      )}
    </div>
  );
};
