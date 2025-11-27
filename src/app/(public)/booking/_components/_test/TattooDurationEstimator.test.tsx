import { getTattooDuration } from "../TattooDurationEstimator";
import { TattooData } from "../Form";

describe("getTattooDuration", () => {
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

  // -----------------------------
  // FLASH
  // -----------------------------
  it("returns correct duration for black flash tattoo", () => {
    const tattoo: TattooData = {
      ...baseTattoo,
      tattooType: "flash",
      colorOption: "black",
      size: "medium",
    };

    expect(getTattooDuration(tattoo)).toBe(40);
  });

  it("returns correct duration for colored flash tattoo", () => {
    const tattoo: TattooData = {
      ...baseTattoo,
      tattooType: "flash",
      colorOption: "colored",
      size: "large",
    };

    expect(getTattooDuration(tattoo)).toBe(120);
  });

  // -----------------------------
  // CUSTOM
  // -----------------------------
  it("returns correct duration for custom black tattoo", () => {
    const tattoo: TattooData = {
      ...baseTattoo,
      tattooType: "custom",
      detailLevel: "medium",
      colorOption: "black",
      size: "medium",
    };

    // customBaseMatrix.medium.medium = 90 → * 1.0
    expect(getTattooDuration(tattoo)).toBe(90);
  });

  it("returns correct duration for custom colored tattoo", () => {
    const tattoo: TattooData = {
      ...baseTattoo,
      tattooType: "custom",
      detailLevel: "high",
      colorOption: "colored",
      size: "small",
    };

    // customBaseMatrix.high.small = 120 * 1.15 = 138 → rounded → 138
    expect(getTattooDuration(tattoo)).toBe(138);
  });

  // -----------------------------
  // ERROR CASES
  // -----------------------------
  it("returns 0 and warns if custom tattoo missing detailLevel", () => {
    const tattoo: TattooData = {
      ...baseTattoo,
      tattooType: "custom",
      detailLevel: undefined,
    };

    expect(getTattooDuration(tattoo)).toBe(0);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('missing detailLevel')
    );
  });

  it("returns 0 and warns for unknown tattoo type", () => {
    const tattoo = {
      ...baseTattoo,
      tattooType: "weird-type" as any,
    };

    expect(getTattooDuration(tattoo)).toBe(0);
    expect(warnSpy).toHaveBeenCalled();
  });
});
