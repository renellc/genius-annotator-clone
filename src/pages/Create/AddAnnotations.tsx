import { Button, Lyrics } from "@/components";
import { Modal } from "@/components/Modal";
import { useCreateAnnotationStore } from "@/stores";
import { FormEvent, Fragment, useState } from "react";

export const AddAnnotations = () => {
  const [lyrics] = useCreateAnnotationStore((state) => [state.lyrics]);
  const [addAnnotationLine, addAnnotationBlock] = useCreateAnnotationStore(
    (state) => [
      state.actions.addAnnotationToLine,
      state.actions.addAnnotationToBlock,
    ]
  );

  const [createAnnotationModalOpen, setCreateAnnotationModalOpen] =
    useState(false);

  const [selectedLyric, setSelectedLyric] = useState<{
    lyric: (typeof lyrics)[number];
    selectedText: string;
  } | null>(null);

  const [newAnnotation, setNewAnnotation] = useState("");

  function onSaveAnnotation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (selectedLyric === null || newAnnotation === "") {
      return;
    }

    if (selectedLyric.lyric.type !== "line") {
      return;
    }

    addAnnotationLine(
      selectedLyric.lyric.lineNumber,
      selectedLyric.selectedText,
      newAnnotation
    );
    setNewAnnotation("");
    setSelectedLyric(null);
    setCreateAnnotationModalOpen(false);
  }

  return (
    <div className="grid grid-cols-2 gap-x-4">
      <div className="col-span-2 w-full flex items-center justify-center">
        <h1>Add Annotations</h1>
      </div>

      <Lyrics
        lyrics={lyrics}
        className="w-full"
        onLyricsSelected={(lyric) => {
          setCreateAnnotationModalOpen(true);
          setSelectedLyric(lyric);
        }}
      />

      <div className="w-full flex justify-center">Annotation View</div>

      <div className="col-span-2 flex items-center justify-center">
        <Button>Save</Button>
      </div>

      <Modal
        modalId="createAnnotationModal"
        open={createAnnotationModalOpen && selectedLyric !== null}
        onClose={() => setCreateAnnotationModalOpen(false)}
      >
        <details>
          <summary>Selected Lyrics</summary>
          {selectedLyric?.lyric.type === "line" ? (
            <>{selectedLyric.lyric.text}</>
          ) : (
            <>
              {selectedLyric?.lyric.text.map((lyric) => (
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
          onSubmit={onSaveAnnotation}
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
              onChange={(event) => setNewAnnotation(event.currentTarget.value)}
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
    </div>
  );
};
