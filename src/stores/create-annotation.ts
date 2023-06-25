import { immer } from "zustand/middleware/immer";

import { v4 as UUIDV4 } from "uuid";
import { create } from "zustand";

type CreateAnnotationState = {
  lyrics: string;
  annotations: Record<string, string>;
  lines: Record<string, string>;
};

interface CreateAnnotationActions {
  setLyrics: (text: string) => void;
  addAnnotation: (line: string, annotation: string) => void;
}

const createAnnotationStore = immer<
  CreateAnnotationState & CreateAnnotationActions
>((set) => ({
  lyrics: "",
  lines: {},
  annotations: {},
  setLyrics: (text) =>
    set((state) => {
      state.lyrics = text;
    }),
  addAnnotation: (line, annotation) =>
    set((state) => {
      if (!state.lines[line]) {
        return;
      }

      const annotationId = UUIDV4();
      state.annotations[annotationId] = annotation;
      state.lines[line] = annotationId;
    }),
}));

export const useCreateAnnotationStore = create(createAnnotationStore);
