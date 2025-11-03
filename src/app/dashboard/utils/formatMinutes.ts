/**
 * Formats a total number of minutes into a human-readable string
 *
 * @param totalMinutes minutes to format (number or string)
 * @returns string formatted as "x timer, y minutter"
 */
export function formatMinutesHrsMins(totalMinutes?: number | string): string {
    if (totalMinutes == null) return "0 minutter";

    let minutesNum: number;

    if (typeof totalMinutes === "string") {
        const s = totalMinutes.trim();
        if (s === "") return "0 minutter";
        const parsed = Number(s.replace(",", "."));
        if (!Number.isFinite(parsed) || parsed <= 0) return "0 minutter";
        minutesNum = parsed;
    } else {
        if (!Number.isFinite(totalMinutes) || totalMinutes <= 0) return "0 minutter";
        minutesNum = totalMinutes;
    }

    const minutes = Math.floor(minutesNum);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    const hourPart = hours ? `${hours} ${hours === 1 ? "time" : "timer"}` : "";
    const minutePart = mins ? `${mins} ${mins === 1 ? "minut" : "minutter"}` : "";

    return hourPart && minutePart ? `${hourPart}, ${minutePart}` : hourPart || minutePart;
}