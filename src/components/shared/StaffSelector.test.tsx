import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { StaffSelector } from "./StaffSelector";

describe("StaffSelector", () => {
  describe("レンダリング", () => {
    it("selectボックスがレンダリングされる", () => {
      const onChange = vi.fn();
      render(<StaffSelector value={null} onChange={onChange} />);

      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("スタッフ一覧がオプションとして表示される", () => {
      const onChange = vi.fn();
      render(<StaffSelector value={null} onChange={onChange} />);

      // mockStaffの最初のスタッフ名がオプションに含まれる
      expect(screen.getByRole("option", { name: /中村 さくら/ })).toBeInTheDocument();
    });

    it("showUnassigned=trueの場合、未割当オプションが表示される", () => {
      const onChange = vi.fn();
      render(<StaffSelector value={null} onChange={onChange} showUnassigned />);

      expect(screen.getByRole("option", { name: /未割当/ })).toBeInTheDocument();
    });

    it("valueに対応するスタッフが選択状態になる", () => {
      const onChange = vi.fn();
      render(<StaffSelector value="STF001" onChange={onChange} />);

      const select = screen.getByRole("combobox") as HTMLSelectElement;
      expect(select.value).toBe("STF001");
    });

    it("disabled=trueの場合、selectが無効化される", () => {
      const onChange = vi.fn();
      render(<StaffSelector value={null} onChange={onChange} disabled />);

      expect(screen.getByRole("combobox")).toBeDisabled();
    });
  });

  describe("インタラクション", () => {
    it("スタッフを選択するとonChangeが呼ばれる", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<StaffSelector value={null} onChange={onChange} showUnassigned />);

      const select = screen.getByRole("combobox");
      await user.selectOptions(select, "STF002");

      expect(onChange).toHaveBeenCalledWith("STF002");
    });

    it("未割当を選択するとonChangeがnullで呼ばれる", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<StaffSelector value="STF001" onChange={onChange} showUnassigned />);

      const select = screen.getByRole("combobox");
      await user.selectOptions(select, "");

      expect(onChange).toHaveBeenCalledWith(null);
    });
  });
});
