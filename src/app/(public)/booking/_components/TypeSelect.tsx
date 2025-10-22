import { InstagramTextLink } from "@/components/common/Socials";
import { BookingFormData } from "./Form";

export function TypeSelect({
  formData,
  handleInputChange,
}: {
  formData: BookingFormData;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}) {
  return (
    <div className="backdrop-blur-sm rounded-xl p-8 border">
      <h2 className="text-2xl font-bold mb-6">
        1. Hvilken type tatovering ønsker du?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* flash */}
        <label
          className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all ${
            formData.tattooType === "FLASH"
              ? "border-2 border-blue-500/50"
              : "border border-slate-700 hover:bg-slate-100/50"
          }`}
        >
          <input
            type="radio"
            name="tattooType"
            value="FLASH"
            checked={formData.tattooType === "FLASH"}
            onChange={handleInputChange}
            className="sr-only"
          />
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center border ${
              formData.tattooType === "FLASH"
                ? "border-blue-500"
                : ""
            }`}
          >
            {formData.tattooType === "FLASH" && (
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            )}
          </div>
          <div>
            <h3 className="font-medium">Flash</h3>
            <p className="text-sm">Vælg en af mine mange flashes.</p>
          </div>
        </label>

        {/* custom */}
        <label
          className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all ${
            formData.tattooType === "CUSTOM"
              ? "border-2 border-blue-500/50 hover:bg-slate-100/50"
              : "border border-slate-700 hover:bg-slate-100/50"
          }`}
        >
          <input
            type="radio"
            name="tattooType"
            value="CUSTOM"
            checked={formData.tattooType === "CUSTOM"}
            onChange={handleInputChange}
            className="sr-only"
          />
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center border ${
              formData.tattooType === "CUSTOM"
                ? "border-blue-500"
                : "border-slate-500"
            }`}
          >
            {formData.tattooType === "CUSTOM" && (
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            )}
          </div>
          <div>
            <h3 className="font-medium">Custom</h3>
            <p className="text-sm">
              En custom tatovering designet netop til dig.
            </p>
          </div>
        </label>
      </div>
      {formData.tattooType === "FLASH" && (
        <p className="text-sm pt-4">
          Du kan se alle mine flashes på min{" "}
          <InstagramTextLink text={"Instagram"} />. Hvert flash er unikt, og jeg
          tatoverer kun et flash én gang - så det bliver helt dit eget.
        </p>
      )}
    </div>
  );
}
