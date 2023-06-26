import { useId } from "react";

import { type LyricSection } from "@/lib";

interface LyricLineProps {
  lyric: LyricSection;
  onAnnotationClick?: (lyric: LyricSection) => void;
}

const LyricLine = (props: LyricLineProps) => {
  const { lyric, onAnnotationClick } = props;

  switch (lyric.type) {
    case "line": {
      if (lyric.text === "") {
        return <div className="my-6"></div>;
      } else if (!lyric.annotation) {
        return <p data-lyric-id={lyric.id}>{lyric.text}</p>;
      }

      return (
        <p data-lyric-id={lyric.id}>
          <span
            className="cursor-pointer bg-gray-300 py-1 hover:bg-gray-400"
            onClick={() => onAnnotationClick && onAnnotationClick(lyric)}
          >
            {lyric.text}
          </span>
        </p>
      );
    }
    case "block": {
      return null;
    }
  }
};

interface LyricsProps {
  lyrics: LyricSection[];
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
    if (!selection || selection.type !== "Range" || !onLyricsSelected) {
      return;
    }

    // If the selection is not within the container
    if (
      !selection.anchorNode?.parentElement?.parentElement ||
      selection.anchorNode.parentElement.parentElement.id !== containerId
    ) {
      return;
    }

    const selectedText = selection.toString();
    const range = selection.getRangeAt(0);

    // We check what the common ancestor is for the selection to determine if
    // the user's selection is only one line or if it spans multiple lines.
    //
    // Refer to https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
    // for more info
    const commonAncestorNodeType = range.commonAncestorContainer.nodeType;
    if (commonAncestorNodeType === 1) {
      // The ancestor node is an element (the lyrics container), which means we
      // have a selection that spans multiple lines
      // TODO
    } else if (commonAncestorNodeType === 3) {
      // The ancestor node is just text, which means the selection is just a
      // single line

      // Since each lyric is rendered in a <p> tag with a lyric id, we can
      // assume the parent is a <p> tag and has the lyric id.
      const pContainerElement = range.commonAncestorContainer
        .parentElement as HTMLParagraphElement;
      const lyricId = pContainerElement.dataset.lyricId;

      const lyricSection = lyrics.findIndex((curr) => {
        return curr.type === "line" && curr.id === lyricId;
      });

      if (lyricSection < 0) {
        return;
      }

      onLyricsSelected({ lyric: lyrics[lyricSection], selectedText });
    } else {
      // We just return because we are only concerned with the parent being an
      // element or a text node
      return;
    }
  }

  return (
    <div
      id={containerId}
      className={[
        "w-max place-self-center",
        "flex flex-col justify-center",
        "leading-7",
        className ? className : "",
      ].join(" ")}
      onMouseUp={onDoneSelectLyrics}
    >
      {lyrics.map((lyric) => (
        <LyricLine
          key={lyric.id}
          lyric={lyric}
        />
      ))}
    </div>
  );
};
