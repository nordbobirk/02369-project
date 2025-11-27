export function getCustomerEmail(
  data:
    | {
        email: any;
      }[]
    | null
) {
  const customerEmail =
    data && Array.isArray(data) && data.length > 0
      ? (data[0].email as unknown)
      : null;
  if (customerEmail && typeof customerEmail === "string") {
    return customerEmail;
  }
  throw new Error("failed to read email");
}
