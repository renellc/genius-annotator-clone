type LyricSectionCommon = {
  id: string;
  annotation?: {
    selectedText: string;
    content: string;
  };
};

export type LyricSectionLine = LyricSectionCommon & {
  type: "line";
  text: string;
  lineNumber: number;
};

export type LyricSectionBlock = LyricSectionCommon & {
  type: "block";
  text: LyricSectionLine[];
  startingLineNumber: number;
  endingLineNumber: number;
};

export type LyricSection = LyricSectionLine | LyricSectionBlock;
