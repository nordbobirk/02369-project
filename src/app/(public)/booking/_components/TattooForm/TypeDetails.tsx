import { BookingFormData, TattooData } from "../Form";
import { Upload } from "lucide-react";

export function TypeDetails({
  tattooData,
  flashFileInputRef,
  customFileInputRef,
  handleFlashFileChange,
  handleCustomFilesChange,
  flashImageFile,
  customReferenceFiles,
  handleTattooInputChange,
}: {
  tattooData: TattooData;
  flashFileInputRef: React.RefObject<HTMLInputElement | null>;
  customFileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFlashFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCustomFilesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  flashImageFile: File | null;
  customReferenceFiles: File[];
  handleTattooInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}) {
  return (
    <div className="backdrop-blur-sm rounded-xl px-8">
      <h2 className="text-2xl font-bold mb-6">2. Detaljer</h2>

      {tattooData.tattooType === "FLASH" ? (
        <div className="space-y-6">
          <div>
            <label className="block font-medium mb-2">
              Upload et screenshot af det flash, du ønsker at få tatoveret.
            </label>
            <div
              onClick={() => flashFileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-slate-600/50 transition-colors hover:text-slate-900/50 text-slate-500/50"
            >
              <input
                type="file"
                ref={flashFileInputRef}
                onChange={handleFlashFileChange}
                accept="image/*"
                className="hidden"
              />
              {flashImageFile ? (
                <div className="space-y-2">
                  <p className="text-green-400 flex items-center justify-center gap-2">
                    <Upload className="h-5 w-5" />
                    {flashImageFile.name}
                  </p>
                  <p className="text-sm">Klik for at skifte billedet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-12 w-12 mx-auto" />
                  <p>Klik for at uploade et billede</p>
                  <p className="text-sm">PNG, JPG or WEBP (max. 5MB)</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="flashComments" className="block font-medium mb-2">
              Eventuelle kommentarer (valgfri)
            </label>
            <textarea
              id="flashComments"
              name="flashComments"
              value={tattooData.flashComments}
              onChange={handleTattooInputChange}
              rows={3}
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="Eventuelle små ændringer til flashet..."
            ></textarea>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <label
              htmlFor="customDescription"
              className="block font-medium mb-2"
            >
              Beskriv din ide*
            </label>
            <textarea
              id="customDescription"
              name="customDescription"
              value={tattooData.customDescription || ""}
              onChange={handleTattooInputChange}
              rows={4}
              required
              className="w-full px-4 py-3 rounded-lg border"
              placeholder="Beskriv venligst din ide i detaljer..."
            ></textarea>
          </div>

          <div>
            <label className="block font-medium mb-2">
              Referencebilleder (valgfri)
            </label>
            <div
              onClick={() => customFileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-slate-600/50 transition-colors hover:text-slate-900/50 text-slate-500/50"
            >
              <input
                type="file"
                ref={customFileInputRef}
                onChange={handleCustomFilesChange}
                accept="image/*"
                multiple
                className="hidden"
              />
              {customReferenceFiles.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-green-400 flex items-center justify-center gap-2">
                    <Upload className="h-5 w-5" />
                    {customReferenceFiles.length}{" "}
                    {customReferenceFiles.length === 1 ? "fil" : "filer"}{" "}
                    valgt
                  </p>
                  <p className="text-slate-300 text-sm">
                    {customReferenceFiles.map((file) => file.name).join(", ")}
                  </p>
                  <p className="text-slate-400 text-sm">
                    Klik for at vælge nye billeder
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-12 w-12 text-slate-500 mx-auto" />
                  <p className="text-slate-300">
                    Klik for at uploade referencebilleder
                  </p>
                  <p className="text-slate-400 text-sm">
                    PNG, JPG or WEBP (max. 5MB each)
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="detailLevel"
              className="block font-medium mb-2"
            >
              Detaljegrad*
            </label>
            <select
              id="detailLevel"
              name="detailLevel"
              value={tattooData.detailLevel || ""}
              onChange={handleTattooInputChange}
              required
              className="w-full px-4 py-3 border rounded-lg"
            >
              <option value="" disabled>
                Vælg detaljegrad
              </option>
              <option value="LOW">Meget simpel</option>
              <option value="MEDIUM">
                Simpel outline med noget skygge/tekstur
              </option>
              <option value="HIGH">Meget detaljeret</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
