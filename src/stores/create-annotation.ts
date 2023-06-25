import { immer } from "zustand/middleware/immer";

import { v4 as UUIDV4 } from "uuid";
import { create } from "zustand";

type CreateAnnotationState = {
  lyrics: { lineNumber: number; line: string; annotationId?: string }[];
  annotations: Record<string, string>;
};

interface CreateAnnotationActions {
  setLyrics: (text: string) => void;
  addAnnotation: (lineNumber: number, annotation: string) => void;
}

const createAnnotationStore = immer<
  CreateAnnotationState & CreateAnnotationActions
>((set) => ({
  lyrics: [],
  annotations: {},
  setLyrics: (text) =>
    set((state) => {
      state.lyrics = text
        .split("\n")
        .map((line, idx) => ({ lineNumber: idx, line }));
    }),
  addAnnotation: (lineNumber, annotation) =>
    set((state) => {
      const lineIndex = state.lyrics.findIndex((curr) => {
        return curr.lineNumber === lineNumber;
      });

      if (lineIndex < 0 || state.lyrics[lineIndex].annotationId !== undefined) {
        return;
      }

      const annotationId = UUIDV4();
      state.annotations[annotationId] = annotation;
      state.lyrics[lineIndex].annotationId = annotationId;
    }),
}));

export const useCreateAnnotationStore = create(createAnnotationStore);
