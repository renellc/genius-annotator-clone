import { useId } from "react";

import type { LyricSectionLine, LyricSection } from "@/lib";
import { useSelection } from "../hooks";

interface LyricLineProps {
  section: LyricSection;
  onAnnotationClick?: (lyric: LyricSection) => void;
}

const LyricSection = (props: LyricLineProps) => {
  const { section, onAnnotationClick } = props;

  switch (section.type) {
    case "line": {
      const { id, text, annotation } = section;

      if (text === "") {
        return <div className="my-6"></div>;
      } else if (!annotation) {
        return <p data-lyric-id={id}>{text}</p>;
      }

      return (
        <p data-lyric-id={id}>
          <span
            className="cursor-pointer bg-gray-300 py-1 hover:bg-gray-400"
            onClick={() => onAnnotationClick && onAnnotationClick(section)}
          >
            {text}
          </span>
        </p>
      );
    }
    case "block": {
      const { text } = section;
      return (
        <div className="group flex flex-col">
          {text.map((line) => (
            <p
              key={line.id}
              data-lyric-id={line.id}
            >
              <span
                className="cursor-pointer bg-gray-300 py-1 group-hover:bg-gray-400"
                onClick={() => onAnnotationClick && onAnnotationClick(section)}
              >

                {line.text}
              </span>
            </p>
          ))}
        </div>
      );
    }
  }
};

interface LyricsProps {
  lyrics: LyricSection[];
  className?: string;
  onLineSelected?: (input: {
    lyric: LyricSectionLine;
    selectedText: string;
  }) => void;
  onBlockSelected?: (input: {
    fromLineNumberIdx: number;
    toLineNumberIdx: number;
    selectedText: string;
  }) => void;
}

export const Lyrics = (props: LyricsProps) => {
  const { lyrics, className, onLineSelected, onBlockSelected } = props;

  const containerId = useId();
  const currSelection = useSelection({ selectionContainerId: containerId });

  function onDoneSelectLyrics() {
    console.log(currSelection);
    if (!currSelection) {
      return;
    }

    const { selection, range, selectedText } = currSelection;

    // We check what the common ancestor is for the selection to determine if
    // the user's selection is only one line or if it spans multiple lines.
    //
    // Refer to https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
    // for more info
    const commonAncestorNodeType = range.commonAncestorContainer.nodeType;
    if (commonAncestorNodeType === 1 && onBlockSelected) {
      // The ancestor node is an element (the lyrics container), which means we
      // have a selection that spans multiple lines
      const numberOfLines = selection.toString().split("\n").length;
      const lyricSectionIdxs: number[] = [];

      let startEl = range.startContainer.parentElement as HTMLParagraphElement;
      for (let i = 0; i < numberOfLines; i++) {
        const lyricSectionIdx = lyrics.findIndex((curr) => {
          return curr.type === "line" && curr.id === startEl.dataset.lyricId;
        });

        if (lyricSectionIdx < 0) {
          return;
        }

        lyricSectionIdxs.push(lyricSectionIdx);
        startEl = startEl.nextSibling as HTMLParagraphElement;
      }

      lyricSectionIdxs.sort();

      onBlockSelected({
        fromLineNumberIdx: lyricSectionIdxs[0],
        toLineNumberIdx: lyricSectionIdxs[lyricSectionIdxs.length - 1],
        selectedText,
      });
      console.log(range);
    } else if (commonAncestorNodeType === 3 && onLineSelected) {
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

      onLineSelected({ lyric: lyrics[lyricSection] as LyricSectionLine, selectedText });
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
        "leading-8",
        className ? className : "",
      ].join(" ")}
      onMouseUp={onDoneSelectLyrics}
    >
      {lyrics.map((lyric) => (
        <LyricSection
          key={lyric.id}
          section={lyric}
        />
      ))}
    </div>
  );
};

