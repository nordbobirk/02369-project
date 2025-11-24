"use client";

import type React from "react";

import { useEffect, useState, useCallback } from "react";
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
import { TattooForm } from "./TattooForm";
import { AddTattooControls } from "./AddTattoo";
import { Error } from "./Error";
import { BookingSubmissionInput, submitBooking, submitFilePaths } from "../submitBooking";
import { initBrowserClient } from "@/lib/supabase/client";
import { BOOKING_IMAGES_BUCKET_NAME } from "@/lib/storage";
import { DatePicker } from "./DatePicker";
import { getTattooDuration } from "./TattooDurationEstimator";
import { useRouter } from "next/navigation";

// Placeholder functions for price and time estimates
const estimatePrice = (formData: BookingFormData): number => {
  return 1000;
};

export const estimateTime = (formData: BookingFormData): number => {
  let totalMinutes = 0;

  for (const tattoo of formData.tattoos) {
    totalMinutes += getTattooDuration(tattoo);
  }

  return totalMinutes;
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
  dateTime: Date;
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
  title: string;
  estimated_duration: number;
};

/**
 * The default tattoo in the form, ie. the default values for the forms tattoo section
 */
const getDefaultTattoo = (index: number) =>
({
  colorOption: "black",
  placement: "arm_lower",
  size: "medium",
  tattooType: "flash",
  title: getTattooTitle(index),
} as TattooData);

/**
 * Get the title for a tattoo
 * @param index the tattoos index
 * @returns the tattoos title
 */
const getTattooTitle = (index: number) => {
  return `Tatovering #${index + 1} `;
};

export default function BookingForm() {
  const [formData, setFormData] = useState<BookingFormData>({
    isFirstTattoo: false,
    tattoos: [getDefaultTattoo(0)],
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    dateTime: new Date(),
  });

  const [priceEstimate, setPriceEstimate] = useState<number>(0);
  const [timeEstimate, setTimeEstimate] = useState<number>(0);
  const [isSubmissionLoading, setIsSubmissionLoading] =
    useState<boolean>(false);
  const [selectedTattooIndex, setSelectedTattooIndex] = useState<number | null>(
    0
  );
  const [nextTattooTitleIndex, setNextTattooTitleIndex] = useState<number>(1);
  const [isFirstView, setIsFirstView] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const [isSelectionAvailable, setIsSelectionAvailable] = useState(false);

  // For navigating to confirmation page
  const router = useRouter();

  useEffect(() => {
    if (selectedTattooIndex !== null && !isFirstView) {
      const selectedTattooElement = document.getElementById(
        `tattoo-${selectedTattooIndex}`
      );
      if (selectedTattooElement) {
        setTimeout(() => {
          selectedTattooElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 25);
      }
    }
    if (isFirstView) setIsFirstView(false);
  }, [selectedTattooIndex]);

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
  const handleGlobalInputChange = useCallback(
    (
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
      } as BookingFormData;

      // Avoid setting state if nothing changed to prevent re-render loops
      const currentVal = (formData as any)[name];
      const newVal = (newFormData as any)[name];

      const valuesAreEqual = (() => {
        if (name === "dateTime") {
          const cur = currentVal as Date | undefined | null;
          const neu = newVal as Date | undefined | null;
          if (!cur && !neu) return true;
          if (!cur || !neu) return false;
          return cur.getTime() === neu.getTime();
        }
        return currentVal === newVal;
      })();

      if (valuesAreEqual) return;

      setFormData(newFormData);
      updateEstimates(newFormData);
    },
    [formData]
  );

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
    const tattoos = [...formData.tattoos];
    tattoos.push(getDefaultTattoo(nextTattooTitleIndex));
    setNextTattooTitleIndex(nextTattooTitleIndex + 1);
    setFormData({ ...formData, tattoos });
    const newSelectedTattooIndex = tattoos.length - 1;
    selectTattoo(newSelectedTattooIndex);
  };

  /**
   * Delete a tattoo from the form
   * @param deleteIndex index of the tattoo to delete
   */
  const deleteTattoo = (deleteIndex: number) => {
    const tattoos = [...formData.tattoos];
    tattoos.splice(deleteIndex, 1);
    setFormData({ ...formData, tattoos });
    selectTattoo(null);
  };

  /**
   * Check if the form is filled out and ready for submission
   */
  const isFormFilledOut = (): boolean => {
    return true; // for testing
    // return bookingDataValidationSchema.safeParse(formData).success;
  };

  /**
   * Set the selected tattoo
   * @param tattooIndex new selected index
   */
  const selectTattoo = (tattooIndex: number | null) => {
    setSelectedTattooIndex(tattooIndex);
  };

  /**
   * Handle form submission
   * @param e form event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = initBrowserClient();

    if (!isSelectionAvailable) {
      setError("Vælg venligst en gyldig dato og tid.");
      return;
    }

    setError("");

    const updatedTattoos = formData.tattoos.map((tattoo) => {
      const updatedDuration = getTattooDuration(tattoo);
      return {
        ...tattoo,
        estimated_duration: updatedDuration,
        uploadId: crypto.randomUUID(),
      };
    });

    let submissionData = {
      ...formData,
      tattoos: updatedTattoos,
    };

    setIsSubmissionLoading(true);
    const submissionResult = await submitBooking({
      ...submissionData,
      tattoos: submissionData.tattoos.map((tattoo) => ({
        colorOption: tattoo.colorOption,
        uploadId: tattoo.uploadId,
        tattooType: tattoo.tattooType,
        placement: tattoo.placement,
        size: tattoo.size,
        colorDescription: tattoo.colorDescription,
        customDescription: tattoo.customDescription,
        detailLevel: tattoo.detailLevel,
        flashComments: tattoo.flashComments,
        estimated_duration: tattoo.estimated_duration,
      })),
    });

    // upload image files
    for (const entry of submissionResult) {
      const tattoo = submissionData.tattoos.find(
        (t) => t.uploadId === entry.upload_id
      );
      if (!tattoo) continue;
      const files =
        tattoo.tattooType === "flash"
          ? [tattoo.flashImage]
          : tattoo.customReferenceImages;
      if (!files) continue;

      const paths = [];
      for (const file of files) {
        if (!file) continue;
        const { data, error } = await supabase.storage
          .from(BOOKING_IMAGES_BUCKET_NAME)
          .upload(
            `${new Date().getFullYear()}/${crypto.randomUUID()}.${file.name
              .split(".")
              .findLast((substr) => substr.length > 0)}`,
            file
          );
        if (!data) continue;
        paths.push(data.path);
      }
      submitFilePaths(paths, entry.id);
    }

    router.push("/booking/confirmation");
    setIsSubmissionLoading(false);
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
                  const newFormData = { ...formData };
                  newFormData.tattoos[index] = tattooData;
                  setFormData(newFormData);
                }}
                tattooData={tattoo}
                key={tattoo.title}
                options={{
                  showDelete: formData.tattoos.length > 1,
                  hidden: selectedTattooIndex != index,
                  id: `tattoo-${index}`,
                }}
                deleteTattoo={() => deleteTattoo(index)}
                selectTattoo={() => selectTattoo(index)}
                deselectTattoo={() => selectTattoo(null)}
              />
            ))}

            <AddTattooControls addTattoo={addTattoo} />

            <ContactInfo
              formData={formData}
              handleInputChange={handleGlobalInputChange}
            />

            <DatePicker
              formData={formData}
              handleInputChange={handleGlobalInputChange}
              onAvailabilityChange={setIsSelectionAvailable}
            />

            <Estimates
              timeEstimate={timeEstimate}
              priceEstimate={priceEstimate}
            />

            <Error error={error} />

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
