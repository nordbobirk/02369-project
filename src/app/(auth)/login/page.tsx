import { initServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  const supabase = await initServerClient();
  const { data } = await supabase.auth.getClaims();

  if (data && data.claims) {
    // user is already authenticated, redirect to dashboard
    redirect("/dashboard");
  }

  return <LoginForm />;
}
