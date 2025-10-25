import { Button } from "@/components/ui/button";

export function AddTattooControls({ addTattoo }: { addTattoo: () => void }) {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col justify-center items-center">
        <Button
          className="bg-orange-500 lg-rounded hover:bg-orange-600 text-white text-xl hover:cursor-pointer"
          onClick={addTattoo}
        >
          Tilføj tatovering
        </Button>
        <p className="text-xs text-center pt-2">
          Du kan tilføje andre tatoveringer til samme booking. Det kan du
          eksempelvis gøre, hvis du vil have lavet to små tatoveringer.
        </p>
      </div>
    </div>
  );
}
