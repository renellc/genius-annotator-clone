import { useEffect } from "react";
import { useCreateViewStore } from "../../stores";
import { AddLyrics } from "./AddLyrics";

export const Create = () => {
  const [activeScreen, goStart] = useCreateViewStore((state) => [
    state.activeScreen,
    state.goStart,
  ]);

  useEffect(() => {
    // On initial nav to this route, we start from the beginning
    goStart();
  }, []);

  switch (activeScreen) {
    case "add-lyrics":
      return (
        <div className="h-full">
          <AddLyrics />
        </div>
      );
    default:
      return <div className="h-full">None</div>;
  }
};
