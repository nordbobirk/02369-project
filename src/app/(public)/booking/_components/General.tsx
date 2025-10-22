import { BookingFormData } from "./Form";

export function General({
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
    <div className="rounded-xl p-8 border">
      <h2 className="text-2xl font-bold mb-6">3. Generel information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="placement" className="block font-medium mb-2">
            Placering på kroppen*
          </label>
          <select
            id="placement"
            name="placement"
            value={formData.placement}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border rounded-lg"
          >
            <option value="ARM_UPPER">Overarm</option>
            <option value="ARM_LOWER">Underarm/forarm</option>
            <option value="LEG_UPPER">Lår</option>
            <option value="LEG_LOWER">Læg/skindeben</option>
            <option value="CHEST">Bryst</option>
            <option value="BACK">Ryg</option>
            <option value="SHOULDER">Skulder</option>
            <option value="NECK">Hals</option>
            <option value="HAND">Hånd/fingre</option>
            <option value="FOOT">Fod/ankel</option>
            <option value="RIBS">Ribben/side</option>
            <option value="STOMACH">Mave</option>
          </select>
        </div>

        <div>
          <label htmlFor="size" className="block font-medium mb-2">
            Størrelse*
          </label>
          <select
            id="size"
            name="size"
            value={formData.size}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border rounded-lg"
          >
            <option value="SMALL">Lille (op til 5x5 cm)</option>
            <option value="MEDIUM">Medium (mellem 5x5 og 10x10 cm)</option>
            <option value="LARGE">Stor (større end 10x10 cm)</option>
          </select>
        </div>
      </div>

      <div className="mt-6">
        <label className="block font-medium mb-2">Farver*</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label
            className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all ${
              formData.colorOption === "BLACK"
                ? "border-2 border-blue-500/50"
                : "border hover:bg-slate-100/50"
            }`}
          >
            <input
              type="radio"
              name="colorOption"
              value="BLACK"
              checked={formData.colorOption === "BLACK"}
              onChange={handleInputChange}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                formData.colorOption === "BLACK"
                  ? "border-blue-500"
                  : ""
              }`}
            >
              {formData.colorOption === "BLACK" && (
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              )}
            </div>
            <div>
              <h3 className="font-medium">Sort</h3>
              <p className="text-sm">Klassisk tatovering med sort blæk</p>
            </div>
          </label>

          <label
            className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all ${
              formData.colorOption === "COLORED"
                ? "border-2 border-blue-500/50"
                : "border hover:bg-slate-100/50"
            }`}
          >
            <input
              type="radio"
              name="colorOption"
              value="COLORED"
              checked={formData.colorOption === "COLORED"}
              onChange={handleInputChange}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                formData.colorOption === "COLORED"
                  ? "border-blue-500"
                  : ""
              }`}
            >
              {formData.colorOption === "COLORED" && (
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              )}
            </div>
            <div>
              <h3 className="font-medium">Farver</h3>
              <p className="text-sm">Med farvet blæk</p>
            </div>
          </label>
        </div>

        {formData.colorOption === "COLORED" && (
          <div className="mt-4">
            <label
              htmlFor="colorDescription"
              className="block font-medium mb-2"
            >
              Farve beskrivelse*
            </label>
            <textarea
              id="colorDescription"
              name="colorDescription"
              value={formData.colorDescription || ""}
              onChange={handleInputChange}
              rows={2}
              required
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="Beskriv de farver, du gerne vil have, og hvor de skal være..."
            ></textarea>
          </div>
        )}
      </div>

      <div className="mt-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="isFirstTattoo"
            checked={formData.isFirstTattoo}
            onChange={handleInputChange}
            className="w-5 h-5 rounded"
          />
          <span>
            Det er min første tatovering. (bruges kun til at tage ekstra hensyn
            til dig)
          </span>
        </label>
      </div>
    </div>
  );
}
