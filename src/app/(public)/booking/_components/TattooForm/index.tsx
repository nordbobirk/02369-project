import { useRef, useState } from "react";
import { TattooData } from "../Form";
import { General } from "./General";
import { TypeDetails } from "./TypeDetails";
import { TypeSelect } from "./TypeSelect";
import { TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type TattooFormOptions = {
  title: string;
  showTitle: boolean;
  showDelete: boolean;
};

export function TattooForm({
  tattooData,
  handleTattooInputChange,
  setTattooData,
  options,
  deleteTattoo,
}: {
  tattooData: TattooData;
  handleTattooInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  setTattooData: (tattooData: TattooData) => void;
  options: TattooFormOptions;
  deleteTattoo: () => void;
}) {
  const [customReferenceFiles, setCustomReferenceFiles] = useState<File[]>([]);
  const [flashImageFile, setFlashImageFile] = useState<File | null>(null);
  const flashFileInputRef = useRef<HTMLInputElement>(null);
  const customFileInputRef = useRef<HTMLInputElement>(null);

  const handleFlashFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFlashImageFile(e.target.files[0]);
      setTattooData({
        ...tattooData,
        flashImage: e.target.files[0],
      });
    }
  };

  const handleCustomFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setCustomReferenceFiles(filesArray);
      setTattooData({
        ...tattooData,
        customReferenceImages: filesArray,
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 border rounded-lg py-8 relative">
      {options.showDelete ? (
        <Button
          className="absolute top-0 right-0 m-4 hover:cursor-pointer"
          variant={"ghost"}
          onClick={deleteTattoo}
        >
          <TrashIcon />
        </Button>
      ) : null}
      <h2 className="text-3xl font-bold text-center">
        {options.showTitle ? options.title : ""}
      </h2>

      <TypeSelect
        tattooData={tattooData}
        handleTattooInputChange={handleTattooInputChange}
      />

      <TypeDetails
        tattooData={tattooData}
        customFileInputRef={customFileInputRef}
        flashFileInputRef={flashFileInputRef}
        customReferenceFiles={customReferenceFiles}
        flashImageFile={flashImageFile}
        handleCustomFilesChange={handleCustomFilesChange}
        handleFlashFileChange={handleFlashFileChange}
        handleTattooInputChange={handleTattooInputChange}
      />

      <General
        tattooData={tattooData}
        handleTattooInputChange={handleTattooInputChange}
      />
    </div>
  );
}
