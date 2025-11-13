import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { getFAQs } from "@/app/(public)/faq/actions";

export default async function Page() {
  const faqData = await getFAQs();

  // Check if the count is odd
  const isOdd = faqData.length % 2 !== 0;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-16 text-center">
          Frequently asked questions
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {faqData.map((section, sectionIndex) => {
            // If odd and this is the last item, center it
            const isLastAndOdd = isOdd && sectionIndex === faqData.length - 1;
            return (
              <div
                key={sectionIndex}
                className={`border-2 border-black rounded-2xl p-8 ${
                  isLastAndOdd ? "md:col-span-2 md:w-1/2 md:mx-auto" : ""
                }`}
              >
                <h2 className="text-2xl font-bold text-black mb-4">
                  {section.category}
                </h2>
                <Accordion type="single" collapsible className="w-full text-black">
                  {section.items.map((item, itemIndex) => (
                    <AccordionItem
                      key={itemIndex}
                      value={`item-${sectionIndex}-${itemIndex}`}
                      className="border-b border-pink-200 last:border-none"
                    >
                      <div className="border border-pink-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                        <AccordionTrigger className="w-full text-left px-4 py-4 bg-pink-50 text-gray-900 font-medium text-lg cursor-pointer no-underline hover:no-underline focus:no-underline bg-pink-100 hover:bg-pink-300">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="px-4 py-4 bg-white text-gray-700 leading-relaxed">
                          <div className="space-y-2">
                            {item.answer.split("\n").map((line, idx) => (
                              <p key={idx}>{line}</p>
                            ))}
                          </div>
                        </AccordionContent>
                      </div>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
