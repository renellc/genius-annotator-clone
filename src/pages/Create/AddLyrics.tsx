import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/Button";
import { useCreateAnnotationStore, useCreateViewStore } from "@/stores";

export const AddLyrics = () => {
  const [goNext] = useCreateViewStore((state) => [state.goNext]);
  const setLyrics = useCreateAnnotationStore((state) => state.setLyrics);

  const [text, setText] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLyrics(text.trim());
    goNext();
  }

  return (
    <form
      className="flex flex-col items-center justify-center gap-y-2"
      onSubmit={onSubmit}
    >
      <label className="w-1/4 flex flex-col gap-y-1">
        <span>Your Lyrics</span>
        <textarea
          className={[
            "resize-none whitespace-pre-wrap overflow-x-hidden",
            "min-h-[40rem] w-full",
            "border border-slate-800 rounded-md",
            "px-3 py-2",
          ].join(" ")}
          value={text}
          required
          placeholder="Your lyrics here..."
          onChange={(event) => setText(event.currentTarget.value)}
        />
      </label>

      <div className="flex items-center gap-x-8">
        <Link to="/">Cancel</Link>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
};
