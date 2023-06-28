import { immer } from "zustand/middleware/immer";

import { v4 as UUIDV4 } from "uuid";
import { create } from "zustand";
import type { LyricSection, LyricSectionLine } from "@/lib";

type CreateAnnotationState = {
  lyrics: LyricSection[];
};

interface CreateAnnotationActions {
  setLyrics: (text: string) => void;
  addAnnotationToLine: (
    lyric: LyricSectionLine,
    selectedText: string,
    annotation: string
  ) => void;
  addAnnotationToBlock: (input: {
    fromLineNumberIdx: number;
    toLineNumberIdx: number;
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
    addAnnotationToLine: (line, selectedText, annotation) =>
      set((state) => {
        const lyricIdx = state.lyrics.findIndex((curr) => line.id === curr.id);
        if (lyricIdx < 0) {
          return;
        }

        state.lyrics[lyricIdx].annotation = {
          selectedText: selectedText,
          content: annotation,
        };
      }),
    addAnnotationToBlock: (input) => set((state) => {
      const { fromLineNumberIdx, toLineNumberIdx, selectedText, annotation } = input;
      if (fromLineNumberIdx > toLineNumberIdx) {
        return;
      }

      const toDelete = toLineNumberIdx - fromLineNumberIdx + 1;
      const lines = state.lyrics.splice(fromLineNumberIdx, toDelete) as LyricSectionLine[];
      state.lyrics.splice(fromLineNumberIdx, 0, {
        id: UUIDV4(),
        type: "block",
        text: lines,
        startingLineNumber: lines[0].lineNumber,
        endingLineNumber: lines[lines.length - 1].lineNumber,
        annotation: {
          selectedText,
          content: annotation,
        },
      });
    }),
  },
}));

export const useCreateAnnotationStore = create(createAnnotationStore);
