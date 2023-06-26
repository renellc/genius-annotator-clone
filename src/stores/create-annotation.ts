import { immer } from "zustand/middleware/immer";

import { v4 as UUIDV4 } from "uuid";
import { create } from "zustand";
import { type LyricSection } from "@/lib";

type CreateAnnotationState = {
  lyrics: LyricSection[];
};

interface CreateAnnotationActions {
  setLyrics: (text: string) => void;
  addAnnotationToLine: (
    lineNumber: number,
    selectedText: string,
    annotation: string
  ) => void;
  addAnnotationToBlock: (input: {
    startingLineNumber: number;
    endingLineNumber: number;
    selectedText: string;
    annotation: string;
  }) => void;
}

const createAnnotationStore = immer<
  CreateAnnotationState & { actions: CreateAnnotationActions }
>((set) => ({
  lyrics: [],
  annotations: {},
  actions: {
    setLyrics: (text) =>
      set((state) => {
        state.lyrics = text.split("\n").map((line, idx) => ({
          id: UUIDV4(),
          type: "line",
          lineNumber: idx,
          text: line,
        }));
      }),
    addAnnotationToLine: (lineNumber, selectedText, annotation) =>
      set((state) => {
        if (!state.lyrics[lineNumber]) {
          return;
        }

        state.lyrics[lineNumber].annotation = {
          selectedText: selectedText,
          content: annotation,
        };
      }),
  },
}));

export const useCreateAnnotationStore = create(createAnnotationStore);
