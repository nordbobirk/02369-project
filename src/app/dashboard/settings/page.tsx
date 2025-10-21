import { initServerClient } from "@/lib/supabase/server";
import { SubmitButton } from "./Submit";
import { DeleteAll } from "./DeleteAll";

export default async function Page() {
  const supabase = await initServerClient();
  const response = await supabase.from("settings").select();

  return <div>
    <pre>{JSON.stringify(response.data)}</pre>
    <SubmitButton />
    <DeleteAll />
  </div>;
}
