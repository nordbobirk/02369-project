import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";

export function DeleteTattooButton({
  deleteTattoo,
  disabled,
}: {
  deleteTattoo: () => void;
  disabled?: boolean;
}) {
  return (
    <Button
      disabled={disabled}
      onClick={deleteTattoo}
      className="cursor-pointer"
      variant="ghost"
    >
      <TrashIcon className="size-6"/>
    </Button>
  );
}
