import { Button } from "@/components";
import { useCreateAnnotationStore } from "@/stores";

export const AddAnnotations = () => {
  const lyrics = useCreateAnnotationStore((state) => state.lyrics);

  console.log(lyrics.split("\n"));

  return (
    <div className="grid grid-cols-2 gap-x-4">
      <div className="col-span-2 w-full flex items-center justify-center">
        <h1>Add Annotations</h1>
      </div>

      <div
        className="w-full flex flex-col items-center justify-center leading-7"
        dangerouslySetInnerHTML={{
          __html: lyrics
            .split("\n")
            .map((line) => `${line}<br />`)
            .join(""),
        }}
      />

      <div className="w-full flex justify-center">Annotation View</div>

      <div className="col-span-2 flex items-center justify-center">
        <Button>Save</Button>
      </div>
    </div>
  );
};
