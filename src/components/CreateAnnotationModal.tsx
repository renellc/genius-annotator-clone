import { Fragment, useState } from "react";

import { LyricSectionLine } from "@/lib";

import { Modal, ModalProps } from "./Modal";
import { Button } from ".";

export interface CreateAnnotationModalProps extends ModalProps {
  selectedLyric: {
    lyric: LyricSectionLine | LyricSectionLine[];
    selectedText: string;
    fromLineNumberIdx?: number;
    toLineNumberIdx?: number;
  } | null;
  onSaveAnnotation: (input: {
    selectedLyric: CreateAnnotationModalProps["selectedLyric"],
    annotation: string
  }) => void;
};

export const CreateAnnotationModal = (props: CreateAnnotationModalProps) => {
  const { modalId, open, selectedLyric, onClose, onSaveAnnotation } = props;

  const [annotation, setAnnotation] = useState("");

  return (
    <Modal
      modalId={modalId}
      open={open}
      onClose={onClose}
    >
      <details>
        <summary>Selected Lyrics</summary>
        {!Array.isArray(selectedLyric?.lyric) ? (
          <>{selectedLyric?.lyric.text}</>
        ) : (
          <>
            {selectedLyric?.lyric.map((lyric) => (
              <Fragment key={lyric.id}>
                {lyric.text}
                <br />
              </Fragment>
            ))}
          </>
        )}
      </details>

      <form
        className="flex flex-col"
        onSubmit={(event) => {
          event.preventDefault();
          onSaveAnnotation({
            selectedLyric,
            annotation,
          });
        }}
      >
        <label className="flex flex-col">
          <span>Your Annotation</span>
          <textarea
            className={[
              "resize-none whitespace-pre-wrap overflow-x-hidden",
              "min-h-[40rem] min-w-[40rem]",
              "border border-slate-800 rounded-md",
              "px-3 py-2",
            ].join(" ")}
            onChange={(event) => setAnnotation(event.currentTarget.value)}
          />
        </label>

        <Button
          className="w-max mt-4"
          type="submit"
        >
          Save
        </Button>
      </form>
    </Modal>
  );
};

