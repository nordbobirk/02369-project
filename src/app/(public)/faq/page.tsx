import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { getFAQs } from "@/app/(public)/faq/actions";

export default async function Page() {
  const faqData = await getFAQs();

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-16 text-center">
          FAQ
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {faqData.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-black/80 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">{section.category}</h2>
              <Accordion type="single" collapsible className="w-full text-white">
                {section.items.map((item, itemIndex) => (
                  <AccordionItem key={itemIndex} value={`item-${sectionIndex}-${itemIndex}`}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance"><p>{item.answer}</p></AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
