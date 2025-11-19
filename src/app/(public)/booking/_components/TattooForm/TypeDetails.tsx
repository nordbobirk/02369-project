import { TattooData } from "../Form";
import { Upload, X } from "lucide-react";
import { useMemo } from "react";

export function TypeDetails({
  tattooData,
  flashFileInputRef,
  customFileInputRef,
  handleFlashFileChange,
  handleFlashFileDelete,
  handleCustomFilesChange,
  handleCustomFileDelete,
  flashImageFile,
  customReferenceFiles,
  handleTattooInputChange,
}: {
  tattooData: TattooData;
  flashFileInputRef: React.RefObject<HTMLInputElement | null>;
  customFileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFlashFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFlashFileDelete: () => void;
  handleCustomFilesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCustomFileDelete: (index: number) => void;
  flashImageFile: File | null;
  customReferenceFiles: File[];
  handleTattooInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}) {
  const flashPreviewUrl = useMemo(
    () => (flashImageFile ? URL.createObjectURL(flashImageFile) : null),
    [flashImageFile]
  );

  const customPreviewUrls = useMemo(
    () => customReferenceFiles.map((file) => URL.createObjectURL(file)),
    [customReferenceFiles]
  );

  return (
    <div className="backdrop-blur-sm rounded-xl px-8">
      <h2 className="text-2xl font-bold mb-6">2. Detaljer</h2>

      {tattooData.tattooType === "flash" ? (
        <div className="space-y-6">
          <div>
            <label className="block font-medium mb-2">
              Upload et screenshot af det flash, du ønsker at få tatoveret.
            </label>
            <div
              onClick={() => flashFileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 rounded-lg p-4 sm:p-6 md:p-8 text-center cursor-pointer hover:border-slate-600/50 transition-colors hover:text-slate-900/50 text-slate-500/50"
            >
              <input
                type="file"
                ref={flashFileInputRef}
                onChange={handleFlashFileChange}
                accept="image/*"
                className="hidden"
              />
              {flashImageFile ? (
                <div className="space-y-4">
                  {/* Preview */}
                  <div className="mx-auto max-w-xs">
                    <img
                      src={flashPreviewUrl || ""}
                      alt={flashImageFile.name}
                      className="mx-auto max-h-56 w-auto object-contain rounded-md"
                    />
                  </div>

                  {/* Name + actions */}
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-green-400 flex items-center justify-center gap-2 max-w-full">
                      <Upload className="h-5 w-5 shrink-0" />
                      <span className="truncate max-w-xs sm:max-w-sm md:max-w-md">
                        {flashImageFile.name}
                      </span>
                    </p>
                    <div className="flex items-center gap-3 text-sm">
                      <span>Klik for at skifte billedet</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFlashFileDelete();
                        }}
                        className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                        Fjern
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-12 w-12 mx-auto" />
                  <p>Klik for at uploade et billede</p>
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
              className="border-2 border-dashed border-slate-300 rounded-lg p-4 sm:p-6 md:p-8 text-center cursor-pointer hover:border-slate-600/50 transition-colors hover:text-slate-900/50 text-slate-500/50"
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
                <div className="space-y-4">
                  {/* Grid of previews */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {customReferenceFiles.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="relative group border border-slate-700 rounded-md p-2 flex flex-col items-center gap-2 bg-slate-900/40"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <img
                          src={customPreviewUrls[index]}
                          alt={file.name}
                          className="h-24 w-full object-contain rounded"
                        />
                        <p className="text-xs text-slate-200 truncate w-full text-center">
                          {file.name}
                        </p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCustomFileDelete(index);
                          }}
                          className="absolute top-1.5 right-1.5 inline-flex items-center justify-center rounded-full bg-slate-900/80 text-red-400 hover:text-red-500 p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Info text */}
                  <div className="space-y-1 text-sm">
                    <p className="text-green-400 flex items-center justify-center gap-2">
                      <Upload className="h-5 w-5" />
                      <span>
                        {customReferenceFiles.length}{" "}
                        {customReferenceFiles.length === 1 ? "fil" : "filer"}{" "}
                        valgt
                      </span>
                    </p>
                    <p className="text-slate-400 text-xs">
                      Klik for at tilføje flere billeder eller skifte ud.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-12 w-12 text-slate-500 mx-auto" />
                  <p className="text-slate-300">
                    Klik for at uploade referencebilleder
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="detailLevel" className="block font-medium mb-2">
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
              <option value="low">Meget simpel</option>
              <option value="medium">
                Simpel outline med noget skygge/tekstur
              </option>
              <option value="high">Meget detaljeret</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
