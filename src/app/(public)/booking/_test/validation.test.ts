import {
  tattooDataValidationSchema,
  bookingDataValidationSchema,
} from "../validation";
import z from "zod";

describe("validation.ts", () => {
  describe("tattooDataValidationSchema", () => {
    const validTattooData = {
      tattooType: "FLASH",
      placement: "ARM_UPPER",
      size: "MEDIUM",
      colorOption: "BLACK",
    };

    describe("tattooType validation", () => {
      it("should accept FLASH as tattooType", () => {
        const result = tattooDataValidationSchema.safeParse({
          ...validTattooData,
          tattooType: "FLASH",
        });
        expect(result.success).toBe(true);
      });

      it("should accept CUSTOM as tattooType", () => {
        const result = tattooDataValidationSchema.safeParse({
          ...validTattooData,
          tattooType: "CUSTOM",
        });
        expect(result.success).toBe(true);
      });

      it("should reject invalid tattooType", () => {
        const result = tattooDataValidationSchema.safeParse({
          ...validTattooData,
          tattooType: "INVALID",
        });
        expect(result.success).toBe(false);
      });

      it("should require tattooType", () => {
        const data = { ...validTattooData };
        delete (data as any).tattooType;
        const result = tattooDataValidationSchema.safeParse(data);
        expect(result.success).toBe(false);
      });
    });

    describe("placement validation", () => {
      it("should accept all valid placements", () => {
        const placements = [
          "ARM_UPPER",
          "ARM_LOWER",
          "LEG_UPPER",
          "LEG_LOWER",
          "CHEST",
          "BACK",
          "SHOULDER",
          "NECK",
          "HAND",
          "FOOT",
          "RIBS",
          "STOMACH",
        ];

        placements.forEach((placement) => {
          const result = tattooDataValidationSchema.safeParse({
            ...validTattooData,
            placement,
          });
          expect(result.success).toBe(true);
        });
      });

      it("should reject invalid placement", () => {
        const result = tattooDataValidationSchema.safeParse({
          ...validTattooData,
          placement: "INVALID_PLACEMENT",
        });
        expect(result.success).toBe(false);
      });

      it("should require placement", () => {
        const data = { ...validTattooData };
        delete (data as any).placement;
        const result = tattooDataValidationSchema.safeParse(data);
        expect(result.success).toBe(false);
      });
    });

    describe("size validation", () => {
      it("should accept SMALL size", () => {
        const result = tattooDataValidationSchema.safeParse({
          ...validTattooData,
          size: "SMALL",
        });
        expect(result.success).toBe(true);
      });

      it("should accept MEDIUM size", () => {
        const result = tattooDataValidationSchema.safeParse({
          ...validTattooData,
          size: "MEDIUM",
        });
        expect(result.success).toBe(true);
      });

      it("should accept LARGE size", () => {
        const result = tattooDataValidationSchema.safeParse({
          ...validTattooData,
          size: "LARGE",
        });
        expect(result.success).toBe(true);
      });

      it("should reject invalid size", () => {
        const result = tattooDataValidationSchema.safeParse({
          ...validTattooData,
          size: "EXTRA_LARGE",
        });
        expect(result.success).toBe(false);
      });

      it("should require size", () => {
        const data = { ...validTattooData };
        delete (data as any).size;
        const result = tattooDataValidationSchema.safeParse(data);
        expect(result.success).toBe(false);
      });
    });

    describe("colorOption validation", () => {
      it("should accept BLACK as colorOption", () => {
        const result = tattooDataValidationSchema.safeParse({
          ...validTattooData,
          colorOption: "BLACK",
        });
        expect(result.success).toBe(true);
      });

      it("should accept COLORED as colorOption", () => {
        const result = tattooDataValidationSchema.safeParse({
          ...validTattooData,
          colorOption: "COLORED",
        });
        expect(result.success).toBe(true);
      });

      it("should reject invalid colorOption", () => {
        const result = tattooDataValidationSchema.safeParse({
          ...validTattooData,
          colorOption: "GRAYSCALE",
        });
        expect(result.success).toBe(false);
      });

      it("should require colorOption", () => {
        const data = { ...validTattooData };
        delete (data as any).colorOption;
        const result = tattooDataValidationSchema.safeParse(data);
        expect(result.success).toBe(false);
      });
    });

    describe("detailLevel validation", () => {
      it("should accept LOW detailLevel", () => {
        const result = tattooDataValidationSchema.safeParse({
          ...validTattooData,
          detailLevel: "LOW",
        });
        expect(result.success).toBe(true);
      });

      it("should accept MEDIUM detailLevel", () => {
        const result = tattooDataValidationSchema.safeParse({
          ...validTattooData,
          detailLevel: "MEDIUM",
        });
        expect(result.success).toBe(true);
      });

      it("should accept HIGH detailLevel", () => {
        const result = tattooDataValidationSchema.safeParse({
          ...validTattooData,
          detailLevel: "HIGH",
        });
        expect(result.success).toBe(true);
      });

      it("should reject invalid detailLevel", () => {
        const result = tattooDataValidationSchema.safeParse({
          ...validTattooData,
          detailLevel: "ULTRA_HIGH",
        });
        expect(result.success).toBe(false);
      });

      it("should be optional", () => {
        const result = tattooDataValidationSchema.safeParse(validTattooData);
        expect(result.success).toBe(true);
      });
    });

    describe("flashComments validation", () => {
      it("should accept flashComments string", () => {
        const result = tattooDataValidationSchema.safeParse({
          ...validTattooData,
          flashComments: "Great design, love the style",
        });
        expect(result.success).toBe(true);
      });

      it("should accept empty flashComments string", () => {
        const result = tattooDataValidationSchema.safeParse({
          ...validTattooData,
          flashComments: "",
        });
        expect(result.success).toBe(true);
      });

      it("should be optional", () => {
        const result = tattooDataValidationSchema.safeParse(validTattooData);
        expect(result.success).toBe(true);
      });

      it("should reject non-string flashComments", () => {
        const result = tattooDataValidationSchema.safeParse({
          ...validTattooData,
          flashComments: 123,
        });
        expect(result.success).toBe(false);
      });
    });

    describe("customDescription validation", () => {
      it("should accept customDescription string", () => {
        const result = tattooDataValidationSchema.safeParse({
          ...validTattooData,
          customDescription: "A phoenix rising from flames",
        });
        expect(result.success).toBe(true);
      });

      it("should accept empty customDescription string", () => {
        const result = tattooDataValidationSchema.safeParse({
          ...validTattooData,
          customDescription: "",
        });
        expect(result.success).toBe(true);
      });

      it("should be optional", () => {
        const result = tattooDataValidationSchema.safeParse(validTattooData);
        expect(result.success).toBe(true);
      });

      it("should reject non-string customDescription", () => {
        const result = tattooDataValidationSchema.safeParse({
          ...validTattooData,
          customDescription: { description: "test" },
        });
        expect(result.success).toBe(false);
      });
    });

    describe("colorDescription validation", () => {
      it("should accept colorDescription string", () => {
        const result = tattooDataValidationSchema.safeParse({
          ...validTattooData,
          colorDescription: "Blue and red with black outline",
        });
        expect(result.success).toBe(true);
      });

      it("should accept empty colorDescription string", () => {
        const result = tattooDataValidationSchema.safeParse({
          ...validTattooData,
          colorDescription: "",
        });
        expect(result.success).toBe(true);
      });

      it("should be optional", () => {
        const result = tattooDataValidationSchema.safeParse(validTattooData);
        expect(result.success).toBe(true);
      });

      it("should reject non-string colorDescription", () => {
        const result = tattooDataValidationSchema.safeParse({
          ...validTattooData,
          colorDescription: ["blue", "red"],
        });
        expect(result.success).toBe(false);
      });
    });

    describe("complete valid tattoo data", () => {
      it("should validate complete tattoo data with all fields", () => {
        const completeTattooData = {
          tattooType: "FLASH",
          flashComments: "Beautiful design",
          detailLevel: "HIGH",
          placement: "CHEST",
          size: "LARGE",
          colorOption: "COLORED",
          colorDescription: "Red, black and white",
        };

        const result = tattooDataValidationSchema.safeParse(completeTattooData);
        expect(result.success).toBe(true);
      });

      it("should validate minimal tattoo data with only required fields", () => {
        const minimalTattooData = {
          tattooType: "CUSTOM",
          placement: "LEG_LOWER",
          size: "SMALL",
          colorOption: "BLACK",
        };

        const result = tattooDataValidationSchema.safeParse(minimalTattooData);
        expect(result.success).toBe(true);
      });
    });

    describe("file fields validation", () => {
      it("should accept flashImage as optional", () => {
        const result = tattooDataValidationSchema.safeParse({
          ...validTattooData,
          flashImage: null,
        });
        expect(result.success).toBe(true);
      });

      it("should accept customReferenceImages as optional array", () => {
        const result = tattooDataValidationSchema.safeParse({
          ...validTattooData,
          customReferenceImages: null,
        });
        expect(result.success).toBe(true);
      });
    });
  });

  describe("bookingDataValidationSchema", () => {
    const validBookingData = {
      tattoos: [
        {
          tattooType: "FLASH",
          placement: "ARM_UPPER",
          size: "MEDIUM",
          colorOption: "BLACK",
        },
      ],
      isFirstTattoo: true,
      customerName: "John Doe",
      customerEmail: "john@example.com",
      customerPhone: "1234567890",
    };

    describe("tattoos validation", () => {
      it("should accept array of valid tattoos", () => {
        const result = bookingDataValidationSchema.safeParse(validBookingData);
        expect(result.success).toBe(true);
      });

      it("should accept multiple tattoos", () => {
        const result = bookingDataValidationSchema.safeParse({
          ...validBookingData,
          tattoos: [
            {
              tattooType: "FLASH",
              placement: "ARM_UPPER",
              size: "MEDIUM",
              colorOption: "BLACK",
            },
            {
              tattooType: "CUSTOM",
              placement: "LEG_UPPER",
              size: "LARGE",
              colorOption: "COLORED",
              customDescription: "Phoenix design",
            },
          ],
        });
        expect(result.success).toBe(true);
      });

      it("should accept empty tattoos array", () => {
        const result = bookingDataValidationSchema.safeParse({
          ...validBookingData,
          tattoos: [],
        });
        expect(result.success).toBe(true);
      });

      it("should reject tattoos with invalid data", () => {
        const result = bookingDataValidationSchema.safeParse({
          ...validBookingData,
          tattoos: [
            {
              tattooType: "INVALID",
              placement: "ARM_UPPER",
              size: "MEDIUM",
              colorOption: "BLACK",
            },
          ],
        });
        expect(result.success).toBe(false);
      });

      it("should require tattoos array", () => {
        const data = { ...validBookingData };
        delete (data as any).tattoos;
        const result = bookingDataValidationSchema.safeParse(data);
        expect(result.success).toBe(false);
      });
    });

    describe("isFirstTattoo validation", () => {
      it("should accept true for isFirstTattoo", () => {
        const result = bookingDataValidationSchema.safeParse({
          ...validBookingData,
          isFirstTattoo: true,
        });
        expect(result.success).toBe(true);
      });

      it("should accept false for isFirstTattoo", () => {
        const result = bookingDataValidationSchema.safeParse({
          ...validBookingData,
          isFirstTattoo: false,
        });
        expect(result.success).toBe(true);
      });

      it("should reject non-boolean isFirstTattoo", () => {
        const result = bookingDataValidationSchema.safeParse({
          ...validBookingData,
          isFirstTattoo: "yes",
        });
        expect(result.success).toBe(false);
      });

      it("should require isFirstTattoo", () => {
        const data = { ...validBookingData };
        delete (data as any).isFirstTattoo;
        const result = bookingDataValidationSchema.safeParse(data);
        expect(result.success).toBe(false);
      });
    });

    describe("customerName validation", () => {
      it("should accept valid customerName", () => {
        const result = bookingDataValidationSchema.safeParse({
          ...validBookingData,
          customerName: "Jane Doe",
        });
        expect(result.success).toBe(true);
      });

      it("should reject empty customerName", () => {
        const result = bookingDataValidationSchema.safeParse({
          ...validBookingData,
          customerName: "",
        });
        expect(result.success).toBe(false);
      });

      it("should reject non-string customerName", () => {
        const result = bookingDataValidationSchema.safeParse({
          ...validBookingData,
          customerName: 123,
        });
        expect(result.success).toBe(false);
      });

      it("should require customerName", () => {
        const data = { ...validBookingData };
        delete (data as any).customerName;
        const result = bookingDataValidationSchema.safeParse(data);
        expect(result.success).toBe(false);
      });
    });

    describe("customerEmail validation", () => {
      it("should accept valid email", () => {
        const result = bookingDataValidationSchema.safeParse({
          ...validBookingData,
          customerEmail: "test@example.com",
        });
        expect(result.success).toBe(true);
      });

      it("should accept email with subdomain", () => {
        const result = bookingDataValidationSchema.safeParse({
          ...validBookingData,
          customerEmail: "user@mail.example.co.uk",
        });
        expect(result.success).toBe(true);
      });

      it("should reject invalid email format", () => {
        const result = bookingDataValidationSchema.safeParse({
          ...validBookingData,
          customerEmail: "not-an-email",
        });
        expect(result.success).toBe(false);
      });

      it("should reject email without domain", () => {
        const result = bookingDataValidationSchema.safeParse({
          ...validBookingData,
          customerEmail: "user@",
        });
        expect(result.success).toBe(false);
      });

      it("should reject email without @ symbol", () => {
        const result = bookingDataValidationSchema.safeParse({
          ...validBookingData,
          customerEmail: "userexample.com",
        });
        expect(result.success).toBe(false);
      });

      it("should require customerEmail", () => {
        const data = { ...validBookingData };
        delete (data as any).customerEmail;
        const result = bookingDataValidationSchema.safeParse(data);
        expect(result.success).toBe(false);
      });
    });

    describe("customerPhone validation", () => {
      it("should accept valid phone number", () => {
        const result = bookingDataValidationSchema.safeParse({
          ...validBookingData,
          customerPhone: "1234567890",
        });
        expect(result.success).toBe(true);
      });

      it("should accept phone with formatting", () => {
        const result = bookingDataValidationSchema.safeParse({
          ...validBookingData,
          customerPhone: "+45 40 40 40 40",
        });
        expect(result.success).toBe(true);
      });

      it("should accept international phone format", () => {
        const result = bookingDataValidationSchema.safeParse({
          ...validBookingData,
          customerPhone: "+1-555-123-4567",
        });
        expect(result.success).toBe(true);
      });

      it("should reject empty customerPhone", () => {
        const result = bookingDataValidationSchema.safeParse({
          ...validBookingData,
          customerPhone: "",
        });
        expect(result.success).toBe(false);
      });

      it("should reject non-string customerPhone", () => {
        const result = bookingDataValidationSchema.safeParse({
          ...validBookingData,
          customerPhone: 1234567890,
        });
        expect(result.success).toBe(false);
      });

      it("should require customerPhone", () => {
        const data = { ...validBookingData };
        delete (data as any).customerPhone;
        const result = bookingDataValidationSchema.safeParse(data);
        expect(result.success).toBe(false);
      });
    });

    describe("complete booking validation", () => {
      it("should validate complete booking data", () => {
        const result = bookingDataValidationSchema.safeParse(validBookingData);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual(validBookingData);
        }
      });

      it("should validate booking with complex tattoo data", () => {
        const complexBooking = {
          tattoos: [
            {
              tattooType: "FLASH",
              flashComments: "Love this design",
              detailLevel: "HIGH",
              placement: "CHEST",
              size: "LARGE",
              colorOption: "COLORED",
              colorDescription: "Vibrant colors",
            },
          ],
          isFirstTattoo: false,
          customerName: "Alice Smith",
          customerEmail: "alice@example.com",
          customerPhone: "+45 1234 5678",
        };

        const result = bookingDataValidationSchema.safeParse(complexBooking);
        expect(result.success).toBe(true);
      });

      it("should reject incomplete booking data", () => {
        const incompleteBooking = {
          tattoos: [
            {
              tattooType: "FLASH",
              placement: "ARM_UPPER",
              size: "MEDIUM",
              colorOption: "BLACK",
            },
          ],
          isFirstTattoo: true,
          customerName: "John Doe",
          customerEmail: "john@example.com",
          // Missing customerPhone
        };

        const result = bookingDataValidationSchema.safeParse(incompleteBooking);
        expect(result.success).toBe(false);
      });
    });

    describe("error handling", () => {
      it("should return detailed error information for invalid data", () => {
        const invalidData = {
          tattoos: [
            {
              tattooType: "INVALID_TYPE",
              placement: "ARM_UPPER",
              size: "MEDIUM",
              colorOption: "BLACK",
            },
          ],
          isFirstTattoo: true,
          customerName: "John Doe",
          customerEmail: "invalid-email",
          customerPhone: "",
        };

        const result = bookingDataValidationSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBeDefined();
          expect(result.error.issues.length).toBeGreaterThan(0);
        }
      });

      it("should report multiple validation errors", () => {
        const multipleErrors = {
          tattoos: [],
          isFirstTattoo: "not a boolean",
          customerName: "",
          customerEmail: "not-an-email",
          customerPhone: "",
        };

        const result = bookingDataValidationSchema.safeParse(multipleErrors);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues.length).toBeGreaterThanOrEqual(3);
        }
      });
    });
  });
});

