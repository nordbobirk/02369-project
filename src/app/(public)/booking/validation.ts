import z from "zod";

/**
 * Validation schema for tattoo data in the booking form context
 */
export const tattooDataValidationSchema = z.object({
  tattooType: z.enum(["FLASH", "CUSTOM"]),
  flashImage: z.file().or(z.null()).optional(),
  customReferenceImages: z.array(z.file()).or(z.null()).optional(),
  flashComments: z.string().optional(),
  customDescription: z.string().optional(),
  detailLevel: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  placement: z.enum([
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
  ]),
  size: z.enum(["SMALL", "MEDIUM", "LARGE"]),
  colorOption: z.enum(["BLACK", "COLORED"]),
  colorDescription: z.string().optional(),
});

/**
 * Validation schema for booking data in the booking form context
 */
export const bookingDataValidationSchema = z.object({
  tattoos: z.array(tattooDataValidationSchema),
  isFirstTattoo: z.boolean(),
  customerName: z.string().nonempty(),
  customerEmail: z.email(),
  customerPhone: z.string().nonempty(),
});
