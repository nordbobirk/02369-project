

export function formatDateToDanish(dateInput?: string | Date): string {
    if (!dateInput) return "—";

    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    if (Number.isNaN(date.getTime())) return "—";

    const fmt = new Intl.DateTimeFormat("da-DK", {
        timeZone: "Europe/Copenhagen",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

    const parts = fmt.formatToParts(date).reduce<Record<string, string>>((acc, p) => {
        if (p.type !== "literal") acc[p.type] = p.value;
        return acc;
    }, {});

    const day = parts.day ?? "";
    const month = parts.month ?? "";
    const year = parts.year ?? "";
    const hour = parts.hour ?? "";
    const minute = parts.minute ?? "";

    return `${day}-${month}/${year}, ${hour}:${minute}`;
}