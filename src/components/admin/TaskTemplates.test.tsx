import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

// Mock data
vi.mock("../../data/mock", () => ({
  mockTaskTemplates: [
    {
      id: "TPL001",
      name: "客室清掃（スタンダード）",
      category: "cleaning",
      description: "スタンダード客室の清掃タスク",
      defaultDuration: 30,
      applicableRoomTypes: ["standard"],
      triggerConditions: [{ type: "check_in" }],
      relativeTime: { reference: "check_in", offsetMinutes: -120 },
    },
  ],
}));

// Import after mocking
import { TaskTemplates } from "./TaskTemplates";

describe("TemplateFormの共通Modal移行", () => {
  it("新規作成TemplateFormが共通Modalのrole=dialogを持つ", async () => {
    const user = userEvent.setup();
    render(<TaskTemplates />);

    const createButton = screen.getByText("新規作成");
    await user.click(createButton);

    // 共通Modalを使用している場合、role="dialog"が設定される
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "新規テンプレート作成" })).toBeInTheDocument();
  });

  it("TemplateFormのコンテンツ領域がスクロール可能", async () => {
    const user = userEvent.setup();
    render(<TaskTemplates />);

    const createButton = screen.getByText("新規作成");
    await user.click(createButton);

    // 共通Modalを使用している場合、modal-contentにoverflow-y-autoが設定される
    const content = screen.getByTestId("modal-content");
    expect(content).toHaveClass("overflow-y-auto");
  });

  it("ESCキーでTemplateFormが閉じる", async () => {
    const user = userEvent.setup();
    render(<TaskTemplates />);

    const createButton = screen.getByText("新規作成");
    await user.click(createButton);

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("編集TemplateFormが共通Modalのrole=dialogを持つ", async () => {
    const user = userEvent.setup();
    render(<TaskTemplates />);

    const editButton = screen.getByRole("button", { name: "編集" });
    await user.click(editButton);

    // 共通Modalを使用している場合、role="dialog"が設定される
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "テンプレート編集" })).toBeInTheDocument();
  });
});
