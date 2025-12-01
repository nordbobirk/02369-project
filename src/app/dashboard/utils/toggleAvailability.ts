
//logic function//
export type AvailabilityMap = Record<string, boolean>;

export function toggleAvailabilityLocal(
  availability: AvailabilityMap,
  date: string
): AvailabilityMap {
  const prev = availability[date] ?? false;
  return {
    ...availability,
    [date]: !prev,
  };
}
