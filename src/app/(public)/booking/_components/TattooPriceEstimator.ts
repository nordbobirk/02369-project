import { DetailLevel, Size, TattooColor } from "@/lib/types";
import { TattooData } from "./Form";
const customBasePriceMatrix: Record<DetailLevel, Record<Size, number>> = {
  low: {
    small: 600,    
    medium: 1100,
    large: 2000,
  },
  medium: {
    small: 1200,
    medium: 1800,
    large: 2800,
  },
  high: {
    small: 2000,
    medium: 3000,
    large: 4500,
  },
};

const flashPriceMatrix: Record<TattooColor, Record<Size, number>> = {
  black: {
    small: 300,
    medium: 600,
    large: 1200,
  },
  colored: {
    small: 450,
    medium: 900,
    large: 1600,
  },
};

const customColorPriceMultiplier: Record<TattooColor, number> = {
  black: 1.0,
  colored: 1.20, // slightly higher multiplier for pricing (20% more)
};

export function getTattooPrice(tattoo: TattooData): number {
  // FLASH TATTOOS
  if (tattoo.tattooType === "flash") {
    return flashPriceMatrix[tattoo.colorOption][tattoo.size];
  }

  // CUSTOM TATTOOS
  if (tattoo.tattooType === "custom") {
    if (!tattoo.detailLevel) {
      console.warn(`Custom tattoo "${tattoo.title}" is missing detailLevel.`);
      return 0;
    }

    const basePrice = customBasePriceMatrix[tattoo.detailLevel][tattoo.size];
    const multiplier = customColorPriceMultiplier[tattoo.colorOption];

    return Math.round(basePrice * multiplier);
  }

  console.warn("Unknown tattoo type:", tattoo);
  return 0;
}