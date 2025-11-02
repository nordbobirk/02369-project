

export function formatPhoneNumber(phoneNumber: string): string {
    const match = phoneNumber.match(/^(\+\d{2})\s?(\d{2})(\d{2})(\d{2})(\d{2})$/);
    if (!match) return phoneNumber;
    return `${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`;
}