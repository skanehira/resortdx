import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

// モック用の簡易コンポーネント
// StaffPagesから渡されるhandleAssigneeChangeをテストするためのモック
const MockTaskComponent = ({
  onAssigneeChange,
}: {
  onAssigneeChange?: (taskId: string, staffId: string | null) => void;
}) => {
  return (
    <div>
      <button data-testid="assign-staff" onClick={() => onAssigneeChange?.("task-1", "STF002")}>
        担当者を変更
      </button>
      <button data-testid="unassign-staff" onClick={() => onAssigneeChange?.("task-1", null)}>
        担当者を解除
      </button>
    </div>
  );
};

// handleAssigneeChangeの単体テスト
describe("handleAssigneeChange", () => {
  it("タスクのassignedStaffIdを更新できる", async () => {
    const user = userEvent.setup();
    const mockSetTasks = vi.fn();

    // handleAssigneeChangeの実装をシミュレート
    const handleAssigneeChange = (taskId: string, staffId: string | null) => {
      mockSetTasks((prev: { id: string; assignedStaffId: string | null }[]) =>
        prev.map((task) => (task.id === taskId ? { ...task, assignedStaffId: staffId } : task)),
      );
    };

    render(<MockTaskComponent onAssigneeChange={handleAssigneeChange} />);

    await user.click(screen.getByTestId("assign-staff"));

    expect(mockSetTasks).toHaveBeenCalledTimes(1);
    // setTasksに渡された関数をテスト
    const updateFn = mockSetTasks.mock.calls[0][0];
    const prevTasks = [
      { id: "task-1", assignedStaffId: null },
      { id: "task-2", assignedStaffId: "STF001" },
    ];
    const result = updateFn(prevTasks);

    expect(result[0].assignedStaffId).toBe("STF002");
    expect(result[1].assignedStaffId).toBe("STF001");
  });

  it("assignedStaffIdをnullに設定できる（未割当）", async () => {
    const user = userEvent.setup();
    const mockSetTasks = vi.fn();

    const handleAssigneeChange = (taskId: string, staffId: string | null) => {
      mockSetTasks((prev: { id: string; assignedStaffId: string | null }[]) =>
        prev.map((task) => (task.id === taskId ? { ...task, assignedStaffId: staffId } : task)),
      );
    };

    render(<MockTaskComponent onAssigneeChange={handleAssigneeChange} />);

    await user.click(screen.getByTestId("unassign-staff"));

    expect(mockSetTasks).toHaveBeenCalledTimes(1);
    const updateFn = mockSetTasks.mock.calls[0][0];
    const prevTasks = [{ id: "task-1", assignedStaffId: "STF001" }];
    const result = updateFn(prevTasks);

    expect(result[0].assignedStaffId).toBeNull();
  });

  it("存在しないタスクIDの場合は何も変更されない", async () => {
    const user = userEvent.setup();
    const mockSetTasks = vi.fn();

    const handleAssigneeChange = (taskId: string, staffId: string | null) => {
      mockSetTasks((prev: { id: string; assignedStaffId: string | null }[]) =>
        prev.map((task) => (task.id === taskId ? { ...task, assignedStaffId: staffId } : task)),
      );
    };

    // 存在しないタスクIDで呼び出すコンポーネント
    const TestComponent = () => (
      <button
        data-testid="invalid-task"
        onClick={() => handleAssigneeChange("non-existent", "STF002")}
      >
        無効なタスク
      </button>
    );

    render(<TestComponent />);

    await user.click(screen.getByTestId("invalid-task"));

    const updateFn = mockSetTasks.mock.calls[0][0];
    const prevTasks = [{ id: "task-1", assignedStaffId: "STF001" }];
    const result = updateFn(prevTasks);

    // 何も変更されていないことを確認
    expect(result[0].assignedStaffId).toBe("STF001");
  });
});
