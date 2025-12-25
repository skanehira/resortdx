import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Modal } from "./Modal";

describe("Modal", () => {
  describe("基本レンダリング", () => {
    it("isOpen=falseの場合、モーダルがレンダリングされない", () => {
      render(
        <Modal isOpen={false} onClose={vi.fn()} title="テスト">
          コンテンツ
        </Modal>,
      );

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("isOpen=trueの場合、モーダルがレンダリングされる", () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="テスト">
          コンテンツ
        </Modal>,
      );

      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("タイトルが表示される", () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="テストタイトル">
          コンテンツ
        </Modal>,
      );

      expect(screen.getByText("テストタイトル")).toBeInTheDocument();
    });

    it("子要素がレンダリングされる", () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="テスト">
          <div data-testid="child">子要素</div>
        </Modal>,
      );

      expect(screen.getByTestId("child")).toBeInTheDocument();
    });
  });

  describe("レスポンシブ対応（max-h-[90vh]とスクロール）", () => {
    it("モーダルコンテナにmax-h-[90vh]が適用される", () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="テスト">
          コンテンツ
        </Modal>,
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveClass("max-h-[90vh]");
    });

    it("モーダルコンテナにflex flex-colが適用される", () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="テスト">
          コンテンツ
        </Modal>,
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveClass("flex", "flex-col");
    });

    it("コンテンツ領域にoverflow-y-autoが適用される", () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="テスト">
          コンテンツ
        </Modal>,
      );

      const content = screen.getByTestId("modal-content");
      expect(content).toHaveClass("overflow-y-auto");
    });
  });

  describe("footer prop", () => {
    it("footerが指定された場合、フッター領域がレンダリングされる", () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="テスト" footer={<button>保存</button>}>
          コンテンツ
        </Modal>,
      );

      expect(screen.getByRole("button", { name: "保存" })).toBeInTheDocument();
    });

    it("footerが指定されない場合、フッター領域がレンダリングされない", () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="テスト">
          コンテンツ
        </Modal>,
      );

      expect(screen.queryByTestId("modal-footer")).not.toBeInTheDocument();
    });
  });

  describe("fullscreen prop", () => {
    it("fullscreen=trueの場合、フルスクリーンスタイルが適用される", () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="テスト" fullscreen>
          コンテンツ
        </Modal>,
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveClass("h-full", "m-0", "rounded-none");
    });

    it("fullscreen=falseの場合、通常のスタイルが適用される", () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="テスト" fullscreen={false}>
          コンテンツ
        </Modal>,
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).not.toHaveClass("h-full");
      expect(dialog).toHaveClass("rounded-lg");
    });
  });

  describe("showCloseButton prop", () => {
    it("showCloseButton=true（デフォルト）の場合、閉じるボタンが表示される", () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="テスト">
          コンテンツ
        </Modal>,
      );

      expect(screen.getByRole("button", { name: /閉じる/ })).toBeInTheDocument();
    });

    it("showCloseButton=falseの場合、閉じるボタンが表示されない", () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="テスト" showCloseButton={false}>
          コンテンツ
        </Modal>,
      );

      expect(screen.queryByRole("button", { name: /閉じる/ })).not.toBeInTheDocument();
    });
  });

  describe("closeOnOverlayClick prop", () => {
    it("closeOnOverlayClick=true（デフォルト）の場合、オーバーレイクリックでonCloseが呼ばれる", async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      render(
        <Modal isOpen={true} onClose={onClose} title="テスト">
          コンテンツ
        </Modal>,
      );

      const overlay = screen.getByTestId("modal-overlay");
      await user.click(overlay);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("closeOnOverlayClick=falseの場合、オーバーレイクリックでonCloseが呼ばれない", async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      render(
        <Modal isOpen={true} onClose={onClose} title="テスト" closeOnOverlayClick={false}>
          コンテンツ
        </Modal>,
      );

      const overlay = screen.getByTestId("modal-overlay");
      await user.click(overlay);

      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe("インタラクション", () => {
    it("閉じるボタンをクリックするとonCloseが呼ばれる", async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      render(
        <Modal isOpen={true} onClose={onClose} title="テスト">
          コンテンツ
        </Modal>,
      );

      const closeButton = screen.getByRole("button", { name: /閉じる/ });
      await user.click(closeButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("ESCキーを押すとonCloseが呼ばれる", async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      render(
        <Modal isOpen={true} onClose={onClose} title="テスト">
          コンテンツ
        </Modal>,
      );

      await user.keyboard("{Escape}");

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("サイズ", () => {
    it.each([
      ["sm", "max-w-sm"],
      ["md", "max-w-md"],
      ["lg", "max-w-lg"],
      ["xl", "max-w-xl"],
      ["2xl", "max-w-2xl"],
    ] as const)("size=%sの場合、%sクラスが適用される", (size, expectedClass) => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="テスト" size={size}>
          コンテンツ
        </Modal>,
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveClass(expectedClass);
    });
  });
});
