import { ReactNode } from "react";
import { Portal } from "./Portal";
import { Button } from ".";

export type ModalProps = {
  modalId: string;
  open?: boolean;
  onClose?: () => void;
  children?: ReactNode;
};

export const Modal = (props: ModalProps) => {
  const { modalId, open, onClose, children } = props;

  return (
    <Portal wrapperId={modalId}>
      {open && (
        <div
          className={[
            "w-screen h-screen",
            "fixed top-0 left-0 overflow-y-hidden",
            "flex flex-col items-center justify-center",
            "bg-black bg-opacity-20",
          ].join(" ")}
        >
          <div
            className={["bg-white p-4 rounded-md", "flex flex-col"].join(" ")}
          >
            <Button
              className="self-end mb-4"
              onClick={() => onClose && onClose()}
            >
              Close
            </Button>
            {children}
          </div>
        </div>
      )}
    </Portal>
  );
};
