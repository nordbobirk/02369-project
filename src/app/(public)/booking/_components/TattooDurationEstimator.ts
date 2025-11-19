import { DetailLevel, Size, TattooColor } from "@/lib/types";
import { TattooData } from "./Form";
const customBaseMatrix: Record<DetailLevel, Record<Size, number>> = {
  low: {
    small: 30,
    medium: 60,
    large: 120,
  },
  medium: {
    small: 60,
    medium: 120,
    large: 240,
  },
  high: {
    small: 120,
    medium: 240,
    large: 360,
  },
};

const flashBaseMatrix: Record<TattooColor, Record<Size, number>> = {
  black: {
    small: 20,     // simple flash linework
    medium: 40,
    large: 75,
  },
  colored: {
    small: 35,     // more prep + packing color
    medium: 70,
    large: 120,
  },
};

const customColorMultiplier: Record<TattooColor, number> = {
  black: 1.0,
  colored: 1.35, // color takes ~35% longer for custom pieces
};

export function getTattooDuration(tattoo: TattooData): number {
  // FLASH TATTOOS
  if (tattoo.tattooType === "flash") {
    return flashBaseMatrix[tattoo.colorOption][tattoo.size];
  }

  // CUSTOM TATTOOS
  if (tattoo.tattooType === "custom") {
    if (!tattoo.detailLevel) {
      console.warn(`Custom tattoo "${tattoo.title}" is missing detailLevel.`);
      return 0;
    }

    const base = customBaseMatrix[tattoo.detailLevel][tattoo.size];
    const multiplier = customColorMultiplier[tattoo.colorOption];

    return Math.round(base * multiplier);
  }

  console.warn("Unknown tattoo type:", tattoo);
  return 0;
}