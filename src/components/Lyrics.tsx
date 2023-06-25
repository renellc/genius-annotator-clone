import { useId } from "react";

interface LyricLineProps {
  lyric: { lineNumber: number; line: string; annotationId?: string };
  onAnnotationClick?: (line: LyricLineProps["lyric"]) => void;
}

const LyricLine = (props: LyricLineProps) => {
  const { lyric, onAnnotationClick } = props;

  if (lyric.line === "") {
    return <br />;
  }

  if (!lyric.annotationId) {
    return (
      <>
        {lyric.line}
        <br />
      </>
    );
  }

  return (
    <>
      <span
        className="cursor-pointer bg-gray-300 py-1 hover:bg-gray-400"
        onClick={() => onAnnotationClick && onAnnotationClick(lyric)}
      >
        {lyric.line}
      </span>
      <br />
    </>
  );
};

interface LyricsProps {
  lyrics: { lineNumber: number; line: string; annotationId?: string }[];
  className?: string;
  onLyricsSelected?: (input: {
    lyric: LyricsProps["lyrics"][number];
    selectedText: string;
  }) => void;
}

export const Lyrics = (props: LyricsProps) => {
  const { lyrics, className, onLyricsSelected } = props;

  const containerId = useId();

  function onDoneSelectLyrics() {
    const selection = window.getSelection();

    // If the mouse event was simply just clicking on the container
    if (!selection || selection.type !== "Range") {
      return;
    }

    // If the selection is not within the container
    if (
      !selection.anchorNode?.parentElement ||
      selection.anchorNode.parentElement.id !== containerId
    ) {
      return;
    }

    const { startContainer } = selection.getRangeAt(0);
    const lyricIdx = lyrics.findIndex((curr) => {
      return curr.line === startContainer.textContent;
    });

    if (lyricIdx < 0) {
      return;
    }

    onLyricsSelected &&
      onLyricsSelected({
        lyric: lyrics[lyricIdx],
        selectedText: selection.toString().split("\n")[0],
      });
  }

  return (
    <div
      className={`flex flex-col items-center justify-center leading-7 ${
        className ?? ""
      }`}
      onMouseUp={onDoneSelectLyrics}
    >
      <p id={containerId}>
        {lyrics.map((lyric) => (
          <LyricLine
            key={`${lyric.lineNumber}-${
              lyric.line === "" ? "break" : lyric.line
            }`}
            lyric={lyric}
          />
        ))}
      </p>
    </div>
  );
};
