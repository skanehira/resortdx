import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { RoomStatusMap, type RoomStatusInfo } from "./RoomStatusMap";

const mockRoomStatuses: RoomStatusInfo[] = [
  {
    roomId: "ROOM-001",
    status: "cleaning",
    cleaningTask: {
      id: "T001",
      reservationId: "RES001",
      category: "cleaning",
      title: "清掃",
      description: "チェックアウト清掃",
      roomId: "ROOM-001",
      status: "in_progress",
      priority: "normal",
      estimatedDuration: 30,
      scheduledTime: "10:00",
      assignedStaffId: "STF001",
      isAnniversaryRelated: false,
    },
    assignedStaff: {
      id: "STF001",
      name: "田中太郎",
      nameKana: "タナカタロウ",
      role: "cleaning",
      skills: [],
      status: "on_duty",
      shiftStart: "09:00",
      shiftEnd: "18:00",
      currentTaskId: null,
      avatarColor: "#4A90A4",
      employmentType: "full_time",
      hireDate: "2024-01-01",
      phoneNumber: "090-1234-5678",
      certifications: [],
      languages: [],
      assignedArea: "all",
    },
  },
];

describe("RoomDetailModalの共通Modal移行", () => {
  it("RoomDetailModalが共通Modalのrole=dialogを持つ", async () => {
    const user = userEvent.setup();
    render(<RoomStatusMap roomStatuses={mockRoomStatuses} />);

    // 部屋カードをクリックしてモーダルを開く
    const roomCard = screen.getByRole("button", {
      name: /スタイリッシュスイート/,
    });
    await user.click(roomCard);

    // 共通Modalを使用している場合、role="dialog"が設定される
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("RoomDetailModalのコンテンツ領域がスクロール可能", async () => {
    const user = userEvent.setup();
    render(<RoomStatusMap roomStatuses={mockRoomStatuses} />);

    const roomCard = screen.getByRole("button", {
      name: /スタイリッシュスイート/,
    });
    await user.click(roomCard);

    // 共通Modalを使用している場合、modal-contentにoverflow-y-autoが設定される
    const content = screen.getByTestId("modal-content");
    expect(content).toHaveClass("overflow-y-auto");
  });

  it("ESCキーでRoomDetailModalが閉じる", async () => {
    const user = userEvent.setup();
    render(<RoomStatusMap roomStatuses={mockRoomStatuses} />);

    const roomCard = screen.getByRole("button", {
      name: /スタイリッシュスイート/,
    });
    await user.click(roomCard);

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
