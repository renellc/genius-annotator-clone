import {
  Annotation,
  Button,
  CreateAnnotationModal,
  CreateAnnotationModalProps,
  Lyrics,
} from "@/components";
import { LyricSection, LyricSectionLine } from "@/lib";
import { useCreateAnnotationStore } from "@/stores";
import { useState } from "react";

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

  const [currSelection, setCurrentSelection] = useState<{
    lyric: LyricSectionLine | LyricSectionLine[];
    selectedText: string;
    fromLineNumberIdx?: number;
    toLineNumberIdx?: number;
  } | null>(null);

  const [selectedAnnotation, setSelectedAnnotation] = useState<{
    lyric: LyricSection;
    nodePosition?: {
      offsetTop: number;
      offsetLeft: number;
    };
  } | null>(null);

  function onSaveAnnotation(
    input: Parameters<CreateAnnotationModalProps["onSaveAnnotation"]>[0]
  ) {
    const { selectedLyric, annotation } = input;
    if (selectedLyric === null || annotation === "") {
      return;
    }

    if (selectedLyric.fromLineNumberIdx && selectedLyric.toLineNumberIdx) {
      addAnnotationBlock({
        fromLineNumberIdx: selectedLyric.fromLineNumberIdx,
        toLineNumberIdx: selectedLyric.toLineNumberIdx,
        selectedText: selectedLyric.selectedText,
        annotation: annotation,
      });
    } else {
      addAnnotationLine(
        selectedLyric.lyric as LyricSectionLine,
        selectedLyric.selectedText,
        annotation
      );
    }

    setCurrentSelection(null);
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
        onLineSelected={({ lyric, selectedText }) => {
          setCreateAnnotationModalOpen(true);
          setCurrentSelection({ lyric, selectedText });
        }}
        onBlockSelected={({
          fromLineNumberIdx,
          toLineNumberIdx,
          selectedText,
        }) => {
          setCreateAnnotationModalOpen(true);
          setCurrentSelection({
            lyric: lyrics.slice(
              fromLineNumberIdx,
              toLineNumberIdx
            ) as LyricSectionLine[],
            selectedText,
            fromLineNumberIdx,
            toLineNumberIdx,
          });
        }}
        onAnnotationClicked={(lyric) => {
          if (lyric.lyric.id === selectedAnnotation?.lyric.id) {
            setSelectedAnnotation(null);
          } else {
            setSelectedAnnotation(lyric);
          }
        }}
      />

      <div className="w-full flex justify-center relative">
        {selectedAnnotation && (
          <Annotation
            lyricSection={selectedAnnotation}
            onClose={() => setSelectedAnnotation(null)}
          />
        )}
      </div>

      <div className="col-span-2 flex items-center justify-center">
        <Button>Save</Button>
      </div>

      <CreateAnnotationModal
        modalId="createAnnotationModal"
        open={createAnnotationModalOpen && currSelection !== null}
        onClose={() => setCreateAnnotationModalOpen(false)}
        selectedLyric={currSelection}
        onSaveAnnotation={onSaveAnnotation}
      />
    </div>
  );
};
