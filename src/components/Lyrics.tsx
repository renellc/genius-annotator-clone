import { useId } from "react";

import type { LyricSectionLine, LyricSection } from "@/lib";
import { useSelection } from "../hooks";

interface LyricSectionProps {
  section: LyricSection;
  onAnnotationClick?: (input: {
    lyric: LyricSection;
    nodePosition?: {
      offsetTop: number;
      offsetLeft: number;
    };
  }) => void;
}

const LyricSection = (props: LyricSectionProps) => {
  const { section, onAnnotationClick } = props;

  switch (section.type) {
    case "line": {
      const { id, text, annotation } = section;

      if (text === "") {
        return <div className="my-6"></div>;
      } else if (!annotation) {
        return <p data-lyric-id={id}>{text}</p>;
      }

      const unseletedText = text.split(annotation.selectedText, 2);

      return (
        <p data-lyric-id={id}>
          {unseletedText[0]}
          <span
            className="cursor-pointer bg-gray-300 py-1 hover:bg-gray-400"
            onClick={() => {
              if (!onAnnotationClick) {
                return;
              }

              const el = document.querySelectorAll(
                `[data-lyric-id='${id}']`
              )[0]! as HTMLElement;

              onAnnotationClick({
                lyric: section,
                nodePosition: {
                  offsetTop: el.offsetTop,
                  offsetLeft: el.offsetLeft,
                },
              });
            }}
          >
            {annotation.selectedText}
          </span>
          {unseletedText[1]}
        </p>
      );
    }
    case "block": {
      const { text, annotation } = section;

      // This should always be the same length as the text array
      const lines =
        annotation?.selectedText
          .split("\n")
          .filter((curr) => curr !== "")
          .map((selectedText, idx) => ({
            selectedText,
            line: text[idx],
            unselectedParts: text[idx].text.split(selectedText, 2),
          })) || [];

      return (
        <div className="group flex flex-col">
          {lines.map((line) => (
            <p
              key={line.line.id}
              data-lyric-id={line.line.id}
            >
              {line.unselectedParts[0]}
              <span
                className="cursor-pointer bg-gray-300 py-1 group-hover:bg-gray-400"
                onClick={() => onAnnotationClick && onAnnotationClick(section)}
              >
                {line.selectedText}
              </span>
              {line.unselectedParts[1]}
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
  onAnnotationClicked?: (input: {
    lyric: LyricSection;
    nodePosition?: {
      offsetTop: number;
      offsetLeft: number;
    };
  }) => void;
}

export const Lyrics = (props: LyricsProps) => {
  const {
    lyrics,
    className,
    onLineSelected,
    onBlockSelected,
    onAnnotationClicked,
  } = props;

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

      onLineSelected({
        lyric: lyrics[lyricSection] as LyricSectionLine,
        selectedText,
      });
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
          onAnnotationClick={(lyric) => {
            console.log("clicked");
            onAnnotationClicked && onAnnotationClicked(lyric);
          }}
        />
      ))}
    </div>
  );
};
