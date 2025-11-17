'use server'

import { initServerClient } from "@/lib/supabase/server";


type FAQRow = {
  id: number;
  question: string;
  answer: string;
  index: number;
  category: string;
};

type FAQItem = {
  question: string;
  answer: string;
};

type FAQSection = {
  category: string;
  items: FAQItem[];
};


export async function getFAQs(): Promise<FAQSection[]> {
  const supabase = await initServerClient();
  const { data, error } = await supabase
    .from('faq_contents')
    .select('*')
    .order('index', { ascending: true });

  if (error) throw error;

  const faqs = data as FAQRow[];

  // Groups the rows by category so it has the format: 
  // { temp: { category: 'temp', items: [ {...}, {...} ] }, otherCategory: { category: 'otherCategory', items: [ ... ] } }
  const grouped = Object.values(
    faqs.reduce((acc, { category, question, answer }) => {
      if (!acc[category]) {
        acc[category] = { category, items: [] };
      }
      acc[category].items.push({ question, answer });
      return acc;
    }, {} as Record<string, FAQSection>)
  );

  return grouped;
}
