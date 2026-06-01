import { ShieldCheck, Award, HardHat, Sparkles, Star, ChevronRight } from "lucide-react";
import { WebConfig } from "../types.ts";

interface AboutProps {
  config: WebConfig;
  darkMode: boolean;
  onOpenConsultation: () => void;
}

export default function About({ config, darkMode, onOpenConsultation }: AboutProps) {
  const pillars = [
    {
      icon: <HardHat className="w-5 h-5 text-gold-400" />,
      title: "Skilled Craftsmen",
      desc: "Our highly trained in-house carpentry crew & paint engineers ensure sub-millimeter installation accuracy."
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-gold-400" />,
      title: "Premium Handpicked Materials",
      desc: "100% genuine BWR Boiling Waterproof ply (CenturyPly / Austin), Hafele channel runners, and Asian Paints finishes."
    },
    {
      icon: <Sparkles className="w-5 h-5 text-gold-400" />,
      title: "Bespoke Custom Designs",
      desc: "No fixed catalog binding. We construct custom furniture layouts and customized partitions matching your exact space."
    },
    {
      icon: <Award className="w-5 h-5 text-gold-400" />,
      title: "End-to-End Execution",
      desc: "From initial 3D design mapping and site planning to modular installation, deep cleaning, and project handover."
    }
  ];

  const steps = [
    { num: "01", name: "Free Consultation", desc: "Site visit & dimensions capture with zero initial obligation." },
    { num: "02", name: "Premium 3D Renderings", desc: "Detailed colors, finishes, and texture mockups matching client ideas." },
    { num: "03", name: "Precision Manufacturing", desc: "Pre-cut modular cabinetry produced using industrial technology." },
    { num: "04", name: "Masterful Installation", desc: "Completed within 45 days with strict quality checks." }
  ];

  return (
    <section
      id="about"
      className={`py-24 transition-colors duration-500 ${
        darkMode ? "bg-navy-900 border-t border-navy-800" : "bg-neutral-50/70 border-t border-neutral-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-gold-400 block mb-3">
            Elite Luxury & Trust
          </span>
          <h2
            className={`font-serif text-3xl sm:text-4xl font-semibold tracking-tight ${
              darkMode ? "text-white" : "text-navy-950"
            }`}
          >
            Refining Homes Across Kolkata Since 2014
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-gold-500 to-gold-300 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Narrative & Visual Grid Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          {/* Narrative Content Column */}
          <div className="lg:col-span-7">
            <h3
              className={`font-serif text-2xl sm:text-3xl font-regular leading-tight mb-6 ${
                darkMode ? "text-navy-100" : "text-navy-900"
              }`}
            >
              We believe a home is not just walls, it's an extension of your legacy.
            </h3>
            <p
              className={`font-sans text-md leading-relaxed mb-8 ${
                darkMode ? "text-navy-300" : "text-neutral-600"
              }`}
            >
              At <strong className="text-gold-400 font-semibold">Kasis Interior</strong>, we've spent more than a decade designing and setting up premium, luxury-grade interior projects in Kolkata. Operating from Ariadaha, we supply our homeowners with authentic custom furniture, modular kitchen systems, False Ceilings, and luxury lighting designs that outperform standard franchise presets in texture, utility, and absolute longevity.
            </p>

            {/* Core Pillars Bullet Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {pillars.map((pillar, i) => (
                <div
                  key={i}
                  className={`p-5 rounded-xl border transition-all duration-300 ${
                    darkMode
                      ? "bg-navy-950/45 border-navy-800/80 hover:border-gold-400/30"
                      : "bg-white border-neutral-200/60 hover:border-gold-400/50"
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-gold-400/10 rounded-lg">{pillar.icon}</div>
                    <h4 className={`font-semibold text-sm ${darkMode ? "text-white" : "text-navy-950"}`}>
                      {pillar.title}
                    </h4>
                  </div>
                  <p className={`text-xs leading-normal ${darkMode ? "text-navy-300" : "text-neutral-500"}`}>
                    {pillar.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Showcase Card Column */}
          <div className="lg:col-span-5">
            <div className="relative">
              {/* Main Premium Render Image */}
              <div className="relative z-10 overflow-hidden rounded-2xl border-4 border-gold-400/30 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80"
                  alt="Premium Luxury Interior Design Living Space"
                  className="w-full h-[450px] object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent"></div>
                
                {/* Embedded Stats Overlay Tag */}
                <div className="absolute bottom-6 left-6 right-6 p-5 rounded-xl bg-navy-950/80 backdrop-blur-md border border-gold-400/20 text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-serif text-lg font-bold text-gold-400">Award-Winning Studio</p>
                      <p className="text-xs text-navy-200">ISO 9001:2015 Quality Woodworking Certified</p>
                    </div>
                    <div className="flex text-gold-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Geometric outlines behind box */}
              <div className="absolute -top-6 -left-6 w-32 h-32 border-t-4 border-l-4 border-gold-400/40 pointer-events-none rounded-tl-xl"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 border-b-4 border-r-4 border-gold-400/40 pointer-events-none rounded-br-xl"></div>
            </div>
          </div>
        </div>

        {/* Workflow roadmap steps banner */}
        <div className={`p-8 md:p-10 rounded-2xl border ${
          darkMode ? "bg-navy-950 border-navy-800" : "bg-white border-neutral-200 shadow-sm"
        }`}>
          <h3 className={`font-serif text-xl font-bold mb-8 text-center ${darkMode ? "text-white" : "text-navy-950"}`}>
            Our Transparent Four-Step Design Lifecycle
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative group">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="font-serif text-4xl font-extrabold text-gold-400/30 group-hover:text-gold-400 transition-colors">
                    {step.num}
                  </span>
                  <p className={`font-sans font-bold text-sm leading-none ${darkMode ? "text-white" : "text-navy-950"}`}>
                    {step.name}
                  </p>
                </div>
                <p className={`text-xs ml-10 ${darkMode ? "text-navy-300" : "text-neutral-500"}`}>
                  {step.desc}
                </p>
                {/* Connecting arrow indicator for desktop size */}
                {idx < 3 && (
                  <div className="hidden md:block absolute top-1.5 -right-4 text-gold-400/25">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <button
              onClick={onOpenConsultation}
              className="px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-navy-950 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 transition-all shadow-md cursor-pointer inline-flex items-center space-x-1.5"
            >
              <span>Book Site Dimension Capture Today</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
