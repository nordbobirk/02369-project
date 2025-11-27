import { initServerClient } from "../supabase/server";

export async function getNotificationEmail() {
  const supabase = await initServerClient();
  const res = await supabase
    .from("notifications")
    .select("email")
    .order("updated_at", { ascending: false })
    .limit(1);
  const artistEmail =
    res && res.data && Array.isArray(res.data) && res.data.length > 0
      ? (res.data[0].email as string)
      : null;
  if (!artistEmail) {
    throw new Error("failed to get notification email");
  }
  return artistEmail;
}
