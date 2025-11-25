export function getEnvironmentUrl() {
  const env = process.env.NODE_ENV;
  if (env === "production") return "bebsisbooking.dk";
  return "localhost:3000";
}
