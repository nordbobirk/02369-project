import { TattooData } from "../Form";

export function General({
  tattooData,
  handleTattooInputChange,
}: {
  tattooData: TattooData;
  handleTattooInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}) {
  return (
    <div className="rounded-xl px-8">
      <h2 className="text-2xl font-bold mb-6">3. Generel information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="placement" className="block font-medium mb-2">
            Placering på kroppen*
          </label>
          <select
            id="placement"
            name="placement"
            value={tattooData.placement}
            onChange={handleTattooInputChange}
            required
            className="w-full px-4 py-3 border rounded-lg"
          >
            <option value="arm_upper">Overarm</option>
            <option value="arm_lower">Underarm/forarm</option>
            <option value="leg_upper">Lår</option>
            <option value="leg_lower">Læg/skindeben</option>
            <option value="chest">Bryst</option>
            <option value="back">Ryg</option>
            <option value="shoulder">Skulder</option>
            <option value="neck">Hals</option>
            <option value="hand">Hånd/fingre</option>
            <option value="foot">Fod/ankel</option>
            <option value="ribs">Ribben/side</option>
            <option value="stomach">Mave</option>
          </select>
        </div>

        <div>
          <label htmlFor="size" className="block font-medium mb-2">
            Størrelse*
          </label>
          <select
            id="size"
            name="size"
            value={tattooData.size}
            onChange={handleTattooInputChange}
            required
            className="w-full px-4 py-3 border rounded-lg"
          >
            <option value="small">Lille (op til 5x5 cm)</option>
            <option value="medium">Medium (mellem 5x5 og 10x10 cm)</option>
            <option value="large">Stor (større end 10x10 cm)</option>
          </select>
        </div>
      </div>

      <div className="mt-6">
        <label className="block font-medium mb-2">Farver*</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label
            className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all ${
              tattooData.colorOption === "black"
                ? "border-2 border-blue-500/50"
                : "border hover:bg-slate-100/50"
            }`}
          >
            <input
              type="radio"
              name="colorOption"
              value="black"
              checked={tattooData.colorOption === "black"}
              onChange={handleTattooInputChange}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                tattooData.colorOption === "black" ? "border-blue-500" : ""
              }`}
            >
              {tattooData.colorOption === "black" && (
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
              tattooData.colorOption === "colored"
                ? "border-2 border-blue-500/50"
                : "border hover:bg-slate-100/50"
            }`}
          >
            <input
              type="radio"
              name="colorOption"
              value="colored"
              checked={tattooData.colorOption === "colored"}
              onChange={handleTattooInputChange}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                tattooData.colorOption === "colored" ? "border-blue-500" : ""
              }`}
            >
              {tattooData.colorOption === "colored" && (
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              )}
            </div>
            <div>
              <h3 className="font-medium">Farver</h3>
              <p className="text-sm">Med farvet blæk</p>
            </div>
          </label>
        </div>

        {tattooData.colorOption === "colored" && (
          <div className="mt-4">
            <label
              htmlFor="colorDescription"
              className="block font-medium mb-2"
            >
              Beskrivelse af farver*
            </label>
            <textarea
              id="colorDescription"
              name="colorDescription"
              value={tattooData.colorDescription || ""}
              onChange={handleTattooInputChange}
              rows={2}
              required
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="Beskriv de farver, du gerne vil have, og hvor de skal være..."
            ></textarea>
          </div>
        )}
      </div>
    </div>
  );
}
