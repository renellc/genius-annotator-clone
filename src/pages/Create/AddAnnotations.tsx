import { Button, Lyrics } from "@/components";
import { useCreateAnnotationStore } from "@/stores";

export const AddAnnotations = () => {
  const lyrics = useCreateAnnotationStore((state) => state.lyrics);

  return (
    <div className="grid grid-cols-2 gap-x-4">
      <div className="col-span-2 w-full flex items-center justify-center">
        <h1>Add Annotations</h1>
      </div>

      <Lyrics
        lyrics={lyrics}
        className="w-full"
        onLyricsSelected={(lyric) => console.log(lyric)}
      />

      <div className="w-full flex justify-center">Annotation View</div>

      <div className="col-span-2 flex items-center justify-center">
        <Button>Save</Button>
      </div>
    </div>
  );
};
