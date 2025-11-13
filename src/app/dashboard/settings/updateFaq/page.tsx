// app/dashboard/settings/edit_faq/page.tsx
import { getFAQs } from "../edit_faq/actions";
import FAQList from "../edit_faq/FAQList";

/**
 * FAQ Page (Server Component)
 *
 * Loads FAQs from Supabase on the server and passes them
 * into the client-side FAQList component.
 */
export default async function Page() {
  // Load data from Supabase (server-side)
  const faqs = await getFAQs();

  // 2Render the FAQList client component
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">Rediger FAQ</h2>
      <FAQList initialFAQs={faqs} />
    </div>
  );
}
