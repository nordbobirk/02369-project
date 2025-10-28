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
  hidden: boolean;
  id: string;
};

export function TattooForm({
  tattooData,
  handleTattooInputChange,
  setTattooData,
  options,
  deleteTattoo,
  selectTattoo,
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
  selectTattoo: () => void;
}) {
  const [customReferenceFiles, setCustomReferenceFiles] = useState<File[]>([]);
  const [flashImageFile, setFlashImageFile] = useState<File | null>(null);
  const flashFileInputRef = useRef<HTMLInputElement>(null);
  const customFileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState<boolean>(false);

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

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setSaving(true);
    handleTattooInputChange(e);
    new Promise((resolve) =>
      setTimeout(resolve, 500 + Math.random() * 500)
    ).then(() => {
      setSaving(false);
    });
  };

  if (options.hidden) {
    return (
      <div
        className="border-2 border-black rounded-lg py-8 hover:cursor-pointer"
        onClick={selectTattoo}
      >
        <h2 className="text-3xl font-bold text-center">{options.title}</h2>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col gap-4 border-2 border-black rounded-lg py-8 relative"
      id={options.id}
    >
      {options.showDelete ? (
        <Button
          className="absolute top-0 right-0 m-4 px-4 hover:cursor-pointer"
          variant={"ghost"}
          onClick={deleteTattoo}
        >
          <TrashIcon className="size-6" />
        </Button>
      ) : null}
      <h2 className="text-3xl font-bold text-center">
        {options.showTitle ? options.title : ""}
      </h2>

      <TypeSelect
        tattooData={tattooData}
        handleTattooInputChange={handleInputChange}
      />

      <TypeDetails
        tattooData={tattooData}
        customFileInputRef={customFileInputRef}
        flashFileInputRef={flashFileInputRef}
        customReferenceFiles={customReferenceFiles}
        flashImageFile={flashImageFile}
        handleCustomFilesChange={handleCustomFilesChange}
        handleFlashFileChange={handleFlashFileChange}
        handleTattooInputChange={handleInputChange}
      />

      <General
        tattooData={tattooData}
        handleTattooInputChange={handleInputChange}
      />

      <div className="flex justify-center text-slate-500/50 text-m">
        {saving ? "Gemmer..." : "Informationerne om din tatovering er gemt"}
      </div>
    </div>
  );
}
