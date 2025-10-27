import { Clock, DollarSign } from "lucide-react";

export function Estimates({
  priceEstimate,
  timeEstimate,
}: {
  priceEstimate: number;
  timeEstimate: number;
}) {
  return (
    <div className="rounded-xl p-8 border">
      <h2 className="text-2xl font-bold mb-6">Estimater</h2>
      <p className="text-slate-400 mb-6">
        Nedenstående er grove estimater baseret på dine valg. Den endelige tid
        vil du modtage på mail, når din tid bliver bekræftet, og den endelige
        pris bekræftes på dagen.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-lg p-6 flex items-center gap-4">
          <DollarSign className="h-10 w-10" />
          <div>
            <h3 className="font-medium">Estimeret pris</h3>
            <p className="text-2xl font-bold">DKK {priceEstimate}</p>
          </div>
        </div>

        <div className="rounded-lg p-6 flex items-center gap-4">
          <Clock className="h-10 w-10" />
          <div>
            <h3 className="font-medium">Estimeret tid</h3>
            <p className="text-2xl font-bold">
              {timeEstimate < 60
                ? `${timeEstimate} minutter`
                : `${Math.floor(timeEstimate / 60)} timer${
                    Math.floor(timeEstimate / 60) !== 1 ? "s" : ""
                  }${timeEstimate % 60 > 0 ? ` ${timeEstimate % 60} min` : ""}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
