export function getEnvironmentUrl() {
  const env = process.env.NODE_ENV;
  if (env === "production") return "https://bebsisbooking.dk";
  return "http://localhost:3000";
}
