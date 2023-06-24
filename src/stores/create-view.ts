import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type CreateViewScreen = "add-lyrics" | "add-annotations";

type CreateViewState = {
  screens: Record<
    CreateViewScreen,
    {
      next: CreateViewScreen | null;
      prev: CreateViewScreen | null;
    }
  >;
  startScreen: CreateViewScreen;
  activeScreen: CreateViewScreen | null;
};

interface CreateViewActions {
  goStart: () => void;
  goNext: () => void;
  goPrev: () => void;
}

const createViewStore = immer<CreateViewState & CreateViewActions>((set) => ({
  screens: {
    "add-lyrics": {
      next: "add-annotations",
      prev: null,
    },
    "add-annotations": {
      next: null,
      prev: "add-lyrics",
    },
  },
  startScreen: "add-lyrics",
  activeScreen: "add-lyrics",
  goStart: () =>
    set((state) => {
      if (state.activeScreen) {
        state.activeScreen = state.startScreen;
      }
    }),
  goNext: () =>
    set((state) => {
      if (state.activeScreen) {
        state.activeScreen = state.screens[state.activeScreen].next;
      }
    }),
  goPrev: () =>
    set((state) => {
      if (state.activeScreen) {
        state.activeScreen = state.screens[state.activeScreen].prev;
      }
    }),
}));

export const useCreateViewStore = create(createViewStore);
