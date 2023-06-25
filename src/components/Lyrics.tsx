type LyricLineProps = {
  lyric: { lineNumber: number; line: string; annotationId?: string };
  onAnnotationClick?: (line: LyricLineProps["lyric"]) => void;
};

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
        className="cursor-pointer bg-slate-500 py-2 hover:bg-slate-700"
        onClick={() => onAnnotationClick && onAnnotationClick(lyric)}
      >
        {lyric.line}
      </span>
      <br />
    </>
  );
};

type LyricsProps = {
  lyrics: { lineNumber: number; line: string; annotationId?: string }[];
  className?: string;
  onLyricsSelected?: (input: {
    lyric: LyricsProps["lyrics"][number];
    selectedText: string;
  }) => void;
};

export const Lyrics = (props: LyricsProps) => {
  const { lyrics, className, onLyricsSelected } = props;

  function onDoneSelectLyrics() {
    const selection = window.getSelection();
    if (!selection || selection.type !== "Range") {
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
      {lyrics.map((lyric) => (
        <LyricLine
          key={`${lyric.lineNumber}-${
            lyric.line === "" ? "break" : lyric.line
          }`}
          lyric={lyric}
        />
      ))}
    </div>
  );
};
