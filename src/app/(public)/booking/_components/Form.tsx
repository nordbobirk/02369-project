"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Clock, DollarSign } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import {
  DetailLevel,
  Placement,
  Size,
  TattooColor,
  TattooType,
} from "@/lib/types";
import { FormTitle } from "./FormTitle";
import { TypeSelect } from "./TypeSelect";

// Placeholder functions for price and time estimates
const estimatePrice = (formData: BookingFormData): number => {
  return 1000;
};

const estimateTime = (formData: BookingFormData): number => {
  return 120;
};

// Type for the form data
export type BookingFormData = {
  tattooType: TattooType;
  flashImage?: File | null;
  customReferenceImages?: File[] | null;
  flashComments?: string;
  customDescription?: string;
  detailLevel: DetailLevel;
  placement: Placement;
  size: Size;
  colorOption: TattooColor;
  colorDescription?: string;
  isFirstTattoo: boolean;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
};

export default function BookingForm() {
  const [formData, setFormData] = useState<BookingFormData>({
    tattooType: "FLASH",
    flashImage: null,
    customReferenceImages: null,
    detailLevel: "LOW",
    placement: "ARM_LOWER",
    size: "SMALL",
    colorOption: "BLACK",
    isFirstTattoo: false,
    customerName: "",
    customerEmail: "",
    customerPhone: "",
  });

  const [customReferenceFiles, setCustomReferenceFiles] = useState<File[]>([]);
  const [flashImageFile, setFlashImageFile] = useState<File | null>(null);
  const [priceEstimate, setPriceEstimate] = useState<number>(0);
  const [timeEstimate, setTimeEstimate] = useState<number>(0);
  const flashFileInputRef = useRef<HTMLInputElement>(null);
  const customFileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Update estimates when form changes
  const updateEstimates = (data: BookingFormData) => {
    setPriceEstimate(estimatePrice(data));
    setTimeEstimate(estimateTime(data));
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    const newFormData = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    };

    setFormData(newFormData);
    updateEstimates(newFormData);
  };

  const handleFlashFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFlashImageFile(e.target.files[0]);
      setFormData({
        ...formData,
        flashImage: e.target.files[0],
      });
    }
  };

  const handleCustomFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setCustomReferenceFiles(filesArray);
      setFormData({
        ...formData,
        customReferenceImages: filesArray,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    // TODO: birk
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <FormTitle />
          <form onSubmit={handleSubmit} className="space-y-8">
            <TypeSelect
              formData={formData}
              handleInputChange={handleInputChange}
            />

            {/* Type-specific Information */}
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50">
              <h2 className="text-2xl font-bold text-white mb-6">
                2. Detaljer
              </h2>

              {formData.tattooType === "FLASH" ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Upload et screenshot af det flash, du ønsker at få
                      tatoveret.
                    </label>
                    <div
                      onClick={() => flashFileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-red-500/50 transition-colors"
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
                          <p className="text-slate-400 text-sm">
                            Click to change image
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="h-12 w-12 text-slate-500 mx-auto" />
                          <p className="text-slate-300">
                            Click to upload flash image
                          </p>
                          <p className="text-slate-400 text-sm">
                            PNG, JPG or WEBP (max. 5MB)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="flashComments"
                      className="block text-white font-medium mb-2"
                    >
                      Eventuelle kommentarer (valgfri)
                    </label>
                    <textarea
                      id="flashComments"
                      name="flashComments"
                      value={formData.flashComments}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Eventuelle små ændringer til flashet..."
                    ></textarea>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="customDescription"
                      className="block text-white font-medium mb-2"
                    >
                      Beskriv din ide*
                    </label>
                    <textarea
                      id="customDescription"
                      name="customDescription"
                      value={formData.customDescription || ""}
                      onChange={handleInputChange}
                      rows={4}
                      required
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Beskriv venligst din ide i detaljer..."
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      Referencebilleder (valgfri)
                    </label>
                    <div
                      onClick={() => customFileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-red-500/50 transition-colors"
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
                            {customReferenceFiles.length === 1
                              ? "file"
                              : "files"}{" "}
                            selected
                          </p>
                          <p className="text-slate-300 text-sm">
                            {customReferenceFiles
                              .map((file) => file.name)
                              .join(", ")}
                          </p>
                          <p className="text-slate-400 text-sm">
                            Click to add more images
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="h-12 w-12 text-slate-500 mx-auto" />
                          <p className="text-slate-300">
                            Click to upload reference images
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
                      className="block text-white font-medium mb-2"
                    >
                      Detaljegrad*
                    </label>
                    <select
                      id="detailLevel"
                      name="detailLevel"
                      value={formData.detailLevel || ""}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
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

            {/* General Information */}
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50">
              <h2 className="text-2xl font-bold text-white mb-6">
                3. Generel information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="placement"
                    className="block text-white font-medium mb-2"
                  >
                    Placering på kroppen*
                  </label>
                  <select
                    id="placement"
                    name="placement"
                    value={formData.placement}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                  <label
                    htmlFor="size"
                    className="block text-white font-medium mb-2"
                  >
                    Størrelse*
                  </label>
                  <select
                    id="size"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="SMALL">Lille (op til 5x5 cm)</option>
                    <option value="MEDIUM">
                      Medium (mellem 5x5 og 10x10 cm)
                    </option>
                    <option value="LARGE">Stor (større end 10x10 cm)</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-white font-medium mb-2">
                  Farver*
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label
                    className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all ${
                      formData.colorOption === "BLACK"
                        ? "bg-red-900/30 border-2 border-red-500/50"
                        : "bg-slate-800/50 border border-slate-700 hover:bg-slate-700/50"
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
                          ? "border-red-500"
                          : "border-slate-500"
                      }`}
                    >
                      {formData.colorOption === "BLACK" && (
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Sort</h3>
                      <p className="text-slate-400 text-sm">
                        Klassisk tatovering med sort blæk
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all ${
                      formData.colorOption === "COLORED"
                        ? "bg-red-900/30 border-2 border-red-500/50"
                        : "bg-slate-800/50 border border-slate-700 hover:bg-slate-700/50"
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
                          ? "border-red-500"
                          : "border-slate-500"
                      }`}
                    >
                      {formData.colorOption === "COLORED" && (
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Farver</h3>
                      <p className="text-slate-400 text-sm">Med farvet blæk</p>
                    </div>
                  </label>
                </div>

                {formData.colorOption === "COLORED" && (
                  <div className="mt-4">
                    <label
                      htmlFor="colorDescription"
                      className="block text-white font-medium mb-2"
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
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                    className="w-5 h-5 rounded border-slate-500 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-white">
                    Det er min første tatovering. (bruges kun til at tage ekstra
                    hensyn til dig)
                  </span>
                </label>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50">
              <h2 className="text-2xl font-bold text-white mb-6">
                4. Dine kontaktoplysninger
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-white font-medium mb-2"
                  >
                    Dit fulde navn*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-white font-medium mb-2"
                  >
                    Din emailadresse*
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="phone"
                  className="block text-white font-medium mb-2"
                >
                  Telefonnummer*
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Your phone number"
                />
              </div>
            </div>

            {/* Estimates */}
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50">
              <h2 className="text-2xl font-bold text-white mb-6">Estimater</h2>
              <p className="text-slate-400 mb-6">
                Nedenstående er grove estimater baseret på dine valg. Den
                endelige tid vil du modtage på mail, når din tid bliver
                bekræftet, og den endelige pris bekræftes på dagen.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 rounded-lg p-6 flex items-center gap-4">
                  <DollarSign className="h-10 w-10 text-red-500" />
                  <div>
                    <h3 className="text-white font-medium">Estimeret pris</h3>
                    <p className="text-2xl font-bold text-red-400">
                      DKK {priceEstimate}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-6 flex items-center gap-4">
                  <Clock className="h-10 w-10 text-red-500" />
                  <div>
                    <h3 className="text-white font-medium">Estimeret tid</h3>
                    <p className="text-2xl font-bold text-red-400">
                      {timeEstimate < 60
                        ? `${timeEstimate} minutter`
                        : `${Math.floor(timeEstimate / 60)} timer${
                            Math.floor(timeEstimate / 60) !== 1 ? "s" : ""
                          }${
                            timeEstimate % 60 > 0
                              ? ` ${timeEstimate % 60} min`
                              : ""
                          }`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col items-center">
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-12 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {isLoading ? (
                  <Spinner className="mr-2" />
                ) : (
                  "Indsend bookinganmodning"
                )}
              </Button>
              <p className="text-slate-400 text-sm mt-4 text-center">
                Jeg bekræfter din bookinganmodning via mail indenfor 1-2
                arbejdsdage.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
