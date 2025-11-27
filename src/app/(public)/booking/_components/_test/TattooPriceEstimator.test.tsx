import { getTattooPrice } from "../TattooPriceEstimator";
import { TattooData } from "../Form";

describe("getTattooPrice", () => {
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  const baseTattoo: Omit<TattooData, "tattooType"> = {
    flashImage: null,
    customReferenceImages: null,
    flashComments: "",
    customDescription: "",
    detailLevel: undefined,
    placement: "arm_lower",
    size: "medium",
    colorOption: "black",
    colorDescription: "",
    title: "Test Tattoo",
    estimated_duration: 0,
    estimated_price: 0,
  };

  // ----------------------------------
  // FLASH TATTOOS
  // ----------------------------------
  it("returns correct price for black flash tattoo", () => {
    const tattoo: TattooData = {
      ...baseTattoo,
      tattooType: "flash",
      size: "medium",
      colorOption: "black",
    };

    expect(getTattooPrice(tattoo)).toBe(600);
  });

  it("returns correct price for colored flash tattoo", () => {
    const tattoo: TattooData = {
      ...baseTattoo,
      tattooType: "flash",
      size: "large",
      colorOption: "colored",
    };

    expect(getTattooPrice(tattoo)).toBe(1600);
  });

  // ----------------------------------
  // CUSTOM TATTOOS
  // ----------------------------------
  it("returns correct price for custom black tattoo", () => {
    const tattoo: TattooData = {
      ...baseTattoo,
      tattooType: "custom",
      detailLevel: "medium",
      size: "medium",
      colorOption: "black",
    };

    // customBasePriceMatrix.medium.medium = 1800 → * 1.0
    expect(getTattooPrice(tattoo)).toBe(1800);
  });

  it("returns correct price for custom colored tattoo", () => {
    const tattoo: TattooData = {
      ...baseTattoo,
      tattooType: "custom",
      detailLevel: "high",
      size: "small",
      colorOption: "colored",
    };

    // 2000 * 1.20 = 2400 → rounded → 2400
    expect(getTattooPrice(tattoo)).toBe(2400);
  });

  // ----------------------------------
  // ERROR CASES
  // ----------------------------------
  it("returns 0 and warns if custom tattoo missing detailLevel", () => {
    const tattoo: TattooData = {
      ...baseTattoo,
      tattooType: "custom",
      detailLevel: undefined,
    };

    expect(getTattooPrice(tattoo)).toBe(0);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("missing detailLevel")
    );
  });

  it("returns 0 and warns for unknown tattoo type", () => {
    const tattoo = {
      ...baseTattoo,
      tattooType: "weird-type" as any,
    };

    expect(getTattooPrice(tattoo)).toBe(0);
    expect(warnSpy).toHaveBeenCalled();
  });
});
