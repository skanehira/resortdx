import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { HelpRequestModal } from "./HelpRequestModal";
import type { Staff } from "../../../types";

const mockStaff: Staff[] = [
  {
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
  },
  {
    id: "STF002",
    name: "佐藤花子",
    nameKana: "サトウハナコ",
    role: "cleaning",
    skills: [],
    status: "on_duty",
    shiftStart: "09:00",
    shiftEnd: "18:00",
    currentTaskId: null,
    avatarColor: "#E57373",
    employmentType: "full_time",
    hireDate: "2024-01-01",
    phoneNumber: "090-2345-6789",
    certifications: [],
    languages: [],
    assignedArea: "all",
  },
];

describe("HelpRequestModalの共通Modal移行", () => {
  it("HelpRequestModalが共通Modalのrole=dialogを持つ", () => {
    render(
      <HelpRequestModal
        currentStaffId="STF001"
        allStaff={mockStaff}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    // 共通Modalを使用している場合、role="dialog"が設定される
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "ヘルプ依頼" })).toBeInTheDocument();
  });

  it("HelpRequestModalのコンテンツ領域がスクロール可能", () => {
    render(
      <HelpRequestModal
        currentStaffId="STF001"
        allStaff={mockStaff}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    // 共通Modalを使用している場合、modal-contentにoverflow-y-autoが設定される
    const content = screen.getByTestId("modal-content");
    expect(content).toHaveClass("overflow-y-auto");
  });

  it("ESCキーでHelpRequestModalが閉じる", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <HelpRequestModal
        currentStaffId="STF001"
        allStaff={mockStaff}
        onSubmit={vi.fn()}
        onClose={onClose}
      />,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("HelpRequestModalにフッターが表示される", () => {
    render(
      <HelpRequestModal
        currentStaffId="STF001"
        allStaff={mockStaff}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    // 共通Modalを使用している場合、modal-footerが存在する
    const footer = screen.getByTestId("modal-footer");
    expect(footer).toBeInTheDocument();

    // フッター内にボタンがある
    expect(screen.getByRole("button", { name: "キャンセル" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "依頼する" })).toBeInTheDocument();
  });
});
