"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  DetailLevel,
  Placement,
  Size,
  TattooColor,
  TattooType,
} from "@/lib/types";
import { FormTitle } from "./FormTitle";
import { ContactInfo } from "./ContactInfo";
import { Estimates } from "./Estimates";
import { inspect } from "util";
import { TattooForm } from "./TattooForm";
import { AddTattooControls } from "./AddTattoo";
import { bookingDataValidationSchema } from "../validation";

// Placeholder functions for price and time estimates
const estimatePrice = (formData: BookingFormData): number => {
  return 1000;
};

const estimateTime = (formData: BookingFormData): number => {
  return 120;
};

/**
 * Form data for the booking form
 */
export type BookingFormData = {
  tattoos: TattooData[];
  isFirstTattoo: boolean;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
};

/**
 * Data object representing a single tattoo
 */
export type TattooData = {
  tattooType: TattooType;
  flashImage?: File | null;
  customReferenceImages?: File[] | null;
  flashComments?: string;
  customDescription?: string;
  detailLevel?: DetailLevel;
  placement: Placement;
  size: Size;
  colorOption: TattooColor;
  colorDescription?: string;
};

/**
 * The default tattoo in the form, ie. the default values for the forms tattoo section
 */
const DEFAULT_TATTOO: TattooData = {
  colorOption: "BLACK",
  placement: "ARM_LOWER",
  size: "MEDIUM",
  tattooType: "FLASH",
};

export default function BookingForm() {
  const [formData, setFormData] = useState<BookingFormData>({
    isFirstTattoo: false,
    tattoos: [DEFAULT_TATTOO],
    customerName: "",
    customerEmail: "",
    customerPhone: "",
  });

  const [priceEstimate, setPriceEstimate] = useState<number>(0);
  const [timeEstimate, setTimeEstimate] = useState<number>(0);
  const [isSubmissionLoading, setIsSubmissionLoading] =
    useState<boolean>(false);
  const [selectedTattooIndex, setSelectedTattooIndex] = useState<number | null>(
    0
  );

  /**
   * Update the pricing and duration estimates in state based on mutated {@link BookingFormData}
   * @param data booking form data, see {@link BookingFormData}
   */
  const updateEstimates = (data: BookingFormData) => {
    setPriceEstimate(estimatePrice(data));
    setTimeEstimate(estimateTime(data));
  };

  /**
   * Handle input changes to global form values, ie. values not tied to a specific tattoo (e.g. customer info).
   * @param e change event
   */
  const handleGlobalInputChange = (
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

  /**
   * Handle input changes to a tattoo based on the change event and the tattoos index.
   * @param tattooIndex index of the tattoo
   * @param e change event
   */
  const handleTattooInputChange = (
    tattooIndex: number,
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    const newTattooData = {
      ...formData.tattoos[tattooIndex],
      [name]: type === "checkbox" ? checked : value,
    };

    const newFormData = {
      ...formData,
    };
    newFormData.tattoos[tattooIndex] = newTattooData;

    setFormData(newFormData);
    updateEstimates(newFormData);
  };

  /**
   * Add another tattoo to the booking
   */
  const addTattoo = () => {
    const tattoos = formData.tattoos;
    tattoos.push(DEFAULT_TATTOO);
    setFormData({ ...formData, tattoos });
    setSelectedTattooIndex(
      formData.tattoos.length > 0 ? formData.tattoos.length - 1 : null
    );
    const selectedTattooElement = document.getElementById(
      `tattoo-${selectedTattooIndex}`
    );
    if (selectedTattooElement)
      selectedTattooElement.scrollIntoView({ behavior: "smooth" });
  };

  /**
   * Delete a tattoo from the form
   * @param deleteIndex index of the tattoo to delete
   */
  const deleteTattoo = (deleteIndex: number) => {
    const tattoos = [...formData.tattoos];
    tattoos.splice(deleteIndex, 1);
    setFormData({ ...formData, tattoos });
    setSelectedTattooIndex(
      selectedTattooIndex === null
        ? null
        : selectedTattooIndex > 0
        ? selectedTattooIndex - 1
        : 0
    );
    const selectedTattooElement = document.getElementById(
      `tattoo-${selectedTattooIndex}`
    );
    if (selectedTattooElement)
      selectedTattooElement.scrollIntoView({ behavior: "smooth" });
  };

  /**
   * Check if the form is filled out and ready for submission
   */
  const isFormFilledOut = (): boolean => {
    return bookingDataValidationSchema.safeParse(formData).success;
  };

  /**
   * Handle form submission
   * @param e form event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("submitting ", inspect(formData));
    setIsSubmissionLoading(true);
    new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
      setIsSubmissionLoading(false);
    });
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <FormTitle />
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* map tattoo array */}
            {formData.tattoos.map((tattoo, index) => (
              <TattooForm
                handleTattooInputChange={(e) =>
                  handleTattooInputChange(index, e)
                }
                setTattooData={(tattooData: TattooData) => {
                  const newFormData = formData;
                  newFormData.tattoos[index] = tattooData;
                  setFormData(newFormData);
                }}
                tattooData={tattoo}
                key={index}
                options={{
                  title: `Tatovering #${index + 1} (${
                    tattoo.tattooType.substring(0, 1).toUpperCase() +
                    tattoo.tattooType.substring(1).toLowerCase()
                  })`,
                  showDelete: formData.tattoos.length > 1,
                  hidden: selectedTattooIndex != index,
                  id: `tattoo-${index}`,
                }}
                deleteTattoo={() => deleteTattoo(index)}
                selectTattoo={() => setSelectedTattooIndex(index)}
                deselectTattoo={() => setSelectedTattooIndex(null)}
              />
            ))}

            <AddTattooControls addTattoo={addTattoo} />

            <ContactInfo
              formData={formData}
              handleInputChange={handleGlobalInputChange}
            />

            <Estimates
              timeEstimate={timeEstimate}
              priceEstimate={priceEstimate}
            />

            {/* Submit Button */}
            <div className="flex flex-col items-center">
              {!isFormFilledOut() ? (
                <p className="pb-4 text-red-500 font-bold">
                  Udfyld hele formularen før du kan indsende din
                  bookinganmodning
                </p>
              ) : null}
              <Button
                type="submit"
                disabled={!isFormFilledOut()}
                className="bg-red-600 disabled:bg-slate-500 hover:bg-red-700 text-white px-12 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {isSubmissionLoading ? (
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
