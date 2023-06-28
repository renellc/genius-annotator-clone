import { LyricSection } from "@/lib";
import { Button } from ".";

export type AnnotationProps = {
  lyricSection: {
    lyric: LyricSection;
    nodePosition?: {
      offsetTop: number;
      offsetLeft: number;
    };
  };
  className?: string;
  onClose?: () => void;
};

export const Annotation = (props: AnnotationProps) => {
  const { lyricSection, className, onClose } = props;

  return (
    <div
      className={`absolute w-max h-max flex flex-row ${
        className ? className : ""
      }`}
      style={
        lyricSection.nodePosition && {
          top: `${lyricSection.nodePosition.offsetTop}px`,
          left: "0px",
        }
      }
    >
      <aside className="w-96 p-6 mr-4 bg-gray-200 leading-8">
        <p>{lyricSection.lyric.annotation?.content}</p>
      </aside>
      <Button
        className="w-max h-max"
        onClick={() => onClose && onClose()}
      >
        Close
      </Button>
    </div>
  );
};
