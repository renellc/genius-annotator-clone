import { Button } from "@/components/Button";
import { useCreateViewStore } from "../../stores";
import { Link } from "react-router-dom";

export const AddLyrics = () => {
  const [goNext] = useCreateViewStore((state) => [state.goNext]);

  return (
    <div className="flex flex-col items-center justify-center gap-y-2">
      <label className="w-1/4 flex flex-col gap-y-1">
        <span>Your Lyrics</span>
        <textarea
          className={[
            "resize-none whitespace-pre-wrap overflow-x-hidden",
            "min-h-[40rem] w-full",
            "border border-slate-800 rounded-md",
            "px-3 py-2",
          ].join(" ")}
          placeholder="Your lyrics here..."
        />
      </label>

      <div className="flex items-center gap-x-8">
        <Link to="/">Cancel</Link>
        <Button onClick={goNext}>Next</Button>
      </div>
    </div>
  );
};
