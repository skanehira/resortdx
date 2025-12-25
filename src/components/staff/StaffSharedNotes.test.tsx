import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

// Mock i18n
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "sharedNotes.title": "共有ノート",
        "sharedNotes.subtitle": "スタッフ間の申し送り",
        "sharedNotes.addNote": "ノートを追加",
        "sharedNotes.editNote": "ノートを編集",
        "sharedNotes.inputPlaceholder": "申し送り内容を入力",
        "sharedNotes.markImportant": "重要としてマーク",
        "sharedNotes.setExpiry": "期限を設定",
        "sharedNotes.cancel": "キャンセル",
        "sharedNotes.save": "保存",
        "sharedNotes.noNotes": "ノートがありません",
      };
      return translations[key] || key;
    },
  }),
}));

import { StaffSharedNotes } from "./StaffSharedNotes";
import type { Staff } from "../../types";

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

describe("NoteEditorModalの共通Modal移行", () => {
  it("NoteEditorModalが共通Modalのrole=dialogを持つ", async () => {
    const user = userEvent.setup();
    render(
      <StaffSharedNotes
        notes={[]}
        currentStaff={mockStaff}
        onAddNote={vi.fn()}
        onUpdateNote={vi.fn()}
        onDeleteNote={vi.fn()}
      />,
    );

    const addButton = screen.getByText("ノートを追加");
    await user.click(addButton);

    // 共通Modalを使用している場合、role="dialog"が設定される
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "ノートを追加" })).toBeInTheDocument();
  });

  it("NoteEditorModalのコンテンツ領域がスクロール可能", async () => {
    const user = userEvent.setup();
    render(
      <StaffSharedNotes
        notes={[]}
        currentStaff={mockStaff}
        onAddNote={vi.fn()}
        onUpdateNote={vi.fn()}
        onDeleteNote={vi.fn()}
      />,
    );

    const addButton = screen.getByText("ノートを追加");
    await user.click(addButton);

    // 共通Modalを使用している場合、modal-contentにoverflow-y-autoが設定される
    const content = screen.getByTestId("modal-content");
    expect(content).toHaveClass("overflow-y-auto");
  });

  it("ESCキーでNoteEditorModalが閉じる", async () => {
    const user = userEvent.setup();
    render(
      <StaffSharedNotes
        notes={[]}
        currentStaff={mockStaff}
        onAddNote={vi.fn()}
        onUpdateNote={vi.fn()}
        onDeleteNote={vi.fn()}
      />,
    );

    const addButton = screen.getByText("ノートを追加");
    await user.click(addButton);

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
