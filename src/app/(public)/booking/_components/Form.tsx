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
import { ContactInfo } from "./ContactInfo";
import { Estimates } from "./Estimates";
import { inspect } from "util";

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
    e.preventDefault();
    console.log("submitting ", inspect(formData));
    setIsLoading(true);
    new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
      setIsLoading(false);
    });
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

            <ContactInfo
              formData={formData}
              handleInputChange={handleInputChange}
            />

            <Estimates
              timeEstimate={timeEstimate}
              priceEstimate={priceEstimate}
            />

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
