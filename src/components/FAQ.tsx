import { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

interface FAQProps {
  darkMode: boolean;
}

export default function FAQ({ darkMode }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Do you charge fees for the initial space consultation and site visit?",
      a: "No! Our initial design discussion, site visits, structural measurement captures, and estimated catalog configurations are absolutely free of cost. We provide transparent estimates with zero obligation."
    },
    {
      q: "What is the standard timeline to deliver a luxury modular kitchen or bedroom?",
      a: "Our typical project delivery cycle ranges between 35 to 45 working days. This includes industrial precision manufacturing of modular boards at our factory, followed by 7-10 days of neat, dust-free installation at your apartment."
    },
    {
      q: "Do your custom wardrobes and modular kitchens come with a brand warranty?",
      a: "Absolutely! We provide up to 10 years of structural warranty on our modular cabinetry core BWR (Boiling Water Resistant) plywood sheets and dynamic heavy-duty hardware runners (soft-close hinges, Tandem drawers by Hafele, Hettich, or Ebco)."
    },
    {
      q: "What specific materials and plywood standards do you use?",
      a: "We exclusively use BWR (Boiling Water Resistant) marine-grade plywood (ISI-certified CenturyPly / Sylvan) with 100% moisture resilience. For outer design linings, we use premium German high-gloss acrylics, premium laminates, or luxury PU polished duco surfaces."
    },
    {
      q: "Can I customize the sizing and inner drawer counts of wardrobes?",
      a: "Yes! Every single cabinet, shelf grid, wardrobe, and drawer is bespoke. We don't stick to pre-packaged plastic sizes. Our designers blueprint layouts that match your specific clothing, shoe collection, or kitchen cookware storage."
    },
    {
      q: "Which regions and locations in West Bengal do you actively serve?",
      a: "Our core office and factory is situated in Ariadaha, Kolkata. We actively manage interior projects in Salt Lake, New Town, Rajarhat, Sector V, Sodpur, Barackpore, Dunlop, Garia, Jadavpur, Howrah, Hooghly, and surrounding North/South 24 Parganas municipalities."
    }
  ];

  return (
    <section
      id="faq"
      className={`py-24 transition-colors duration-500 border-t ${
        darkMode ? "bg-navy-950 border-navy-900" : "bg-white border-neutral-100"
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-gold-400 block mb-3">
            CLEARING DOUBTS
          </span>
          <h2
            className={`font-serif text-3xl sm:text-4xl font-semibold tracking-tight ${
              darkMode ? "text-white" : "text-navy-950"
            }`}
          >
            Frequently Asked Questions
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-gold-500 to-gold-300 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Dynamic Accordion list */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-xl border transition-all overflow-hidden ${
                  isOpen
                    ? darkMode
                      ? "bg-navy-900/60 border-gold-400/30"
                      : "bg-gold-50/20 border-gold-400/50 shadow-md"
                    : darkMode
                    ? "bg-navy-900/20 border-navy-800"
                    : "bg-neutral-50/50 border-neutral-200"
                }`}
              >
                {/* Trigger Button Panel */}
                <button
                  id={`faq-btn-${idx}`}
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 flex items-center justify-between text-left cursor-pointer"
                >
                  <div className="flex items-center space-x-3.5 pr-4">
                    <HelpCircle className="w-5 h-5 text-gold-400 shrink-0" />
                    <span
                      className={`font-serif font-bold text-sm md:text-md  leading-snug ${
                        isOpen
                          ? "text-gold-400"
                          : darkMode
                          ? "text-navy-100"
                          : "text-navy-950"
                      }`}
                    >
                      {faq.q}
                    </span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-gold-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                  )}
                </button>

                {/* Answer box content */}
                {isOpen && (
                  <div
                    id={`faq-ans-${idx}`}
                    className={`px-5 pb-5 pt-1 text-xs md:text-sm font-light leading-relaxed ${
                      darkMode ? "text-navy-300" : "text-neutral-600"
                    }`}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
