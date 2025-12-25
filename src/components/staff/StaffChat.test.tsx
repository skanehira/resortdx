import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import type { Staff } from "../../types";

// Mock data
vi.mock("../../data/mock", () => ({
  mockChatMessages: [],
  getChatRoomsByStaff: () => [],
  getMessagesByChatRoom: () => [],
  getUnreadCountByRoom: () => 0,
  getLastMessageByRoom: () => null,
  getDMPartnerId: () => null,
  mockStaff: [
    {
      id: "STF002",
      name: "佐藤花子",
      avatarColor: "#E57373",
      role: "service",
    },
    {
      id: "STF003",
      name: "山田太郎",
      avatarColor: "#4FC3F7",
      role: "cleaning",
    },
  ],
}));

import { StaffChat } from "./StaffChat";

const mockStaff = {
  id: "STF001",
  name: "田中太郎",
  nameKana: "タナカタロウ",
  role: "service",
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
} as Staff;

describe("NewChatModalの共通Modal移行", () => {
  it("NewChatModalが共通Modalのrole=dialogを持つ", async () => {
    const user = userEvent.setup();
    render(<StaffChat currentStaff={mockStaff} />);

    // 新規チャットボタンをクリック
    const newChatButton = screen.getByRole("button", { name: "" }); // PlusIconのボタン
    await user.click(newChatButton);

    // 共通Modalを使用している場合、role="dialog"が設定される
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "新規チャット" })).toBeInTheDocument();
  });

  it("NewChatModalのコンテンツ領域がスクロール可能", async () => {
    const user = userEvent.setup();
    render(<StaffChat currentStaff={mockStaff} />);

    const newChatButton = screen.getByRole("button", { name: "" });
    await user.click(newChatButton);

    // 共通Modalを使用している場合、modal-contentにoverflow-y-autoが設定される
    const content = screen.getByTestId("modal-content");
    expect(content).toHaveClass("overflow-y-auto");
  });

  it("ESCキーでNewChatModalが閉じる", async () => {
    const user = userEvent.setup();
    render(<StaffChat currentStaff={mockStaff} />);

    const newChatButton = screen.getByRole("button", { name: "" });
    await user.click(newChatButton);

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("NewChatModalがフルスクリーンモードで表示される", async () => {
    const user = userEvent.setup();
    render(<StaffChat currentStaff={mockStaff} />);

    const newChatButton = screen.getByRole("button", { name: "" });
    await user.click(newChatButton);

    const dialog = screen.getByRole("dialog");
    // fullscreenモードでは w-full h-full クラスが適用される
    expect(dialog).toHaveClass("w-full", "h-full");
  });
});
