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
import { TypeDetails } from "./TypeDetails";
import { General } from "./General";

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

            <TypeDetails
              formData={formData}
              customFileInputRef={customFileInputRef}
              flashFileInputRef={flashFileInputRef}
              customReferenceFiles={customReferenceFiles}
              flashImageFile={flashImageFile}
              handleCustomFilesChange={handleCustomFilesChange}
              handleFlashFileChange={handleFlashFileChange}
              handleInputChange={handleInputChange}
            />

            <General
              formData={formData}
              handleInputChange={handleInputChange}
            />

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
