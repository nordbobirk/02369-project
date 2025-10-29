import { Button } from "@/components/ui/button";
import { ChevronDown, TrashIcon } from "lucide-react";
import { TattooFormOptions } from ".";
import { DeleteTattooButton } from "./DeleteTattooButton";
import { TattooTitle } from "./TattooTitle";

export function CollapsedTattoo({
  options,
  selectTattoo,
  deleteTattoo,
}: {
  options: TattooFormOptions;
  selectTattoo: () => void;
  deleteTattoo: () => void;
}) {
  return (
    <div
      className="border-2 border-black rounded-lg py-8 relative cursor-pointer"
      id={options.id}
      onClick={selectTattoo}
    >
      <div className="absolute top-0 right-0 py-2">
        {options.showDelete ? (
          <DeleteTattooButton deleteTattoo={deleteTattoo} />
        ) : (
          <DeleteTattooButton deleteTattoo={deleteTattoo} disabled />
        )}
        <Button
          className="cursor-pointer"
          variant="ghost"
          onClick={selectTattoo}
        >
          <ChevronDown className="size-6" />
        </Button>
      </div>
      <TattooTitle title={options.title} />
    </div>
  );
}
