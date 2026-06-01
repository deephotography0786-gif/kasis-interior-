import React, { useState } from "react";
import { Bed, Sofa, Utensils, Briefcase, Sparkles, Sliders, CheckCircle, HelpCircle, Landmark, Table, Calculator } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ServicesProps {
  darkMode: boolean;
  onOpenConsultation: () => void;
}

interface ServiceItem {
  icon: React.ReactNode;
  title: string;
  image: string;
  items: string[];
  description: string;
}

export default function Services({ darkMode, onOpenConsultation }: ServicesProps) {
  const [activeCategory, setActiveCategory] = useState<"all" | "residential" | "furniture" | "decor" | "commercial">("all");
  
  // Budget calculator state variables
  const [bhk, setBhk] = useState<"1bhk" | "2bhk" | "3bhk" | "custom">("2bhk");
  const [addons, setAddons] = useState({
    kitchen: true,
    wardrobe: true,
    falseCeiling: false,
    sofaLiving: false,
    officeWork: false
  });
  const [finishQuality, setFinishQuality] = useState<"premium" | "ultra" | "regal">("premium");

  const serviceCategories = [
    { id: "all", name: "All Solutions" },
    { id: "residential", name: "Residential Interior" },
    { id: "furniture", name: "Custom Furniture" },
    { id: "decor", name: "Decor & Lighting" },
    { id: "commercial", name: "Commercial Office" }
  ];

  const servicesMap: { [key: string]: ServiceItem[] } = {
    residential: [
      {
        icon: <Bed className="w-5 h-5 text-gold-400" />,
        title: "Bedroom Interior",
        image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=600&q=80",
        description: "Bespoke sound-insulated walls, ambient mood lighting, upholstered beds, and fully custom glass sliding wardrobes.",
        items: ["King Size Cushioned Beds", "Automatic LED Closets", "Bespoke Dressing Tables", "Warm Profile Mood Lights"]
      },
      {
        icon: <Sofa className="w-5 h-5 text-gold-400" />,
        title: "Living Room Interior",
        image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80",
        description: "Central entertainment nodes, gold profile geometric walls, bespoke velvet seating, and matching partition lattices.",
        items: ["Custom Fluted Backdrop Panels", "Curved Deep Sofa Lounges", "Floating TV Cabinet Consoles", "Designer Marble Center Tables"]
      },
      {
        icon: <Utensils className="w-5 h-5 text-gold-400" />,
        title: "Modular Kitchen",
        image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80",
        description: "Moisture-defying BWR layout built with high gloss premium European acrylic finish cabinets.",
        items: ["Seamless Soft-Close Tandem Drawers", "Stainless Steel Tall Storage units", "Integrated Microwave/Oven nodes", "High-Load Quartz Countertops"]
      },
      {
        icon: <Table className="w-5 h-5 text-gold-400" />,
        title: "Dining Space Design",
        image: "https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&w=600&q=80",
        description: "Fabulous custom dining settings featuring exquisite stone slabs and premium gold metal accents.",
        items: ["Polished Calcutta Marble Tops", "Luxurious Velvet Bucket Seating", "Ambient Statement Chandeliers", "Hand-Carved Matching Sideboards"]
      }
    ],
    furniture: [
      {
        icon: <Sofa className="w-5 h-5 text-gold-400" />,
        title: "Bedroom & Sofa Furniture",
        image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80",
        description: "Comfort-aligned master beds, tufted modern Chesterfields, and bespoke accent wingback lounge chairs.",
        items: ["Luxury Upholstered Bedframes", "Custom Curved Sectionals", "Pillowed Wingback Chairs", "Plush Ottoman Stools"]
      },
      {
        icon: <Table className="w-5 h-5 text-gold-400" />,
        title: "Bespoke Dining & Chairs",
        image: "https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&w=600&q=80",
        description: "Custom table layouts matching specific spatial counts, constructed using high-density teak wood and engineered stones.",
        items: ["Teakwood Dining Frames", "Brass-Inlaid Center Tables", "Ergonomic Tufted Armchairs", "Glass-Front Display Cabinets"]
      },
      {
        icon: <Briefcase className="w-5 h-5 text-gold-400" />,
        title: "Office & Study Cabinets",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
        description: "Ergonomic workspace desks, custom integrated library shelving units, and hidden cable channels.",
        items: ["Walnut Study Executive Tables", "Height Adjustable Work Desks", "Modular Bookcase Lattices", "Minimal Floating Storage Units"]
      }
    ],
    decor: [
      {
        icon: <Sparkles className="w-5 h-5 text-gold-400" />,
        title: "Designer Mirrors & Walls",
        image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80",
        description: "Premium laser-cut golden vanity mirrors and custom panels utilizing marine-grade engineered baseboards.",
        items: ["Geometric Gold-Border Profile Mirrors", "Velvet Tufted Headboards", "WPC Fluted Accent Wall Cladding", "High-Def Metallic Texture Paints"]
      },
      {
        icon: <Sliders className="w-5 h-5 text-gold-400" />,
        title: "False Ceilings & Lighting",
        image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
        description: "Acoustically sound gypsum-board false ceiling integrations with smart recessed profile lights and cove layouts.",
        items: ["Saint-Gobain Gypsum Frameworks", "CRI 90+ Warm Recessed COB Lights", "Color Changing App Controlled LEDs", "Embedded Golden Metallic Strips"]
      }
    ],
    commercial: [
      {
        icon: <Briefcase className="w-5 h-5 text-gold-400" />,
        title: "Office Interior & Lobbies",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
        description: "Ergonomically compliant premium workspaces, soundproof meeting rooms, and high-prestige reception areas.",
        items: ["High Density Backlit Reception Consoles", "Linear Modular Employee Tables", "Gypboard Acoustical Meeting Rooms", "Heavy Duty Level 5 Carpeting"]
      }
    ]
  };

  // Compile filter logic
  const getRenderServices = () => {
    if (activeCategory === "all") {
      return Object.values(servicesMap).flat();
    }
    return servicesMap[activeCategory] || [];
  };

  // Dynamic budget estimator logic
  const calculateBudget = () => {
    let base = 0;
    if (bhk === "1bhk") base = 180000;
    else if (bhk === "2bhk") base = 320000;
    else if (bhk === "3bhk") base = 480000;
    else base = 650000; // Custom/Bungalow

    let multiplier = 1;
    if (finishQuality === "premium") multiplier = 1.0;
    else if (finishQuality === "ultra") multiplier = 1.35;
    else multiplier = 1.7; // Regal (Teak wood, high-end marble, Hafele/Hettich glass, German acrylic)

    let addonCost = 0;
    if (addons.kitchen) addonCost += 150000;
    if (addons.wardrobe) addonCost += 90000 * (bhk === "3bhk" ? 3 : bhk === "2bhk" ? 2 : 1);
    if (addons.falseCeiling) addonCost += 45000 * (bhk === "3bhk" ? 3 : bhk === "2bhk" ? 2 : 1);
    if (addons.sofaLiving) addonCost += 75000;
    if (addons.officeWork) addonCost += 35000;

    const total = (base + addonCost) * multiplier;
    return Math.round(total);
  };

  const getMaterialsList = () => {
    if (finishQuality === "premium") {
      return ["100% BWR Waterproof Plywood", "Vir / Century Laminate finishes", "Pneumatic Standard soft-close channels", "Asian Paints Royal Emulsion"];
    } else if (finishQuality === "ultra") {
      return ["Goldwood/Century Club Marine Ply", "Merino Glossy PVC/Laminate Finish", "Hettich soft-close architectural hardware", "Elegantly finished Fluted Wall boards"];
    } else {
      return ["Sylvan Club Premium / Teak block Core", "Pure German-Acrylic High-Gloss finish", "Hafele premium slide modules & fittings", "Custom PU Gloss/Marble inlay embellishments"];
    }
  };

  return (
    <section
      id="services"
      className={`py-24 transition-colors duration-500 ${
        darkMode ? "bg-navy-950" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-gold-400 block mb-3">
            Elite Living Packages
          </span>
          <h2
            className={`font-serif text-3xl sm:text-4xl font-semibold tracking-tight ${
              darkMode ? "text-white" : "text-navy-950"
            }`}
          >
            End-To-End Interior & Furniture Solutions
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-gold-500 to-gold-300 mx-auto mt-4 rounded-full"></div>
          <p className={`mt-4 text-sm font-light ${darkMode ? "text-navy-300" : "text-neutral-500"}`}>
            We bridge high-end, bespoke layout design with factory-grade precise board cuttings.
          </p>
        </div>

        {/* Category Filters Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {serviceCategories.map((category) => (
            <button
              id={`service-cat-${category.id}`}
              key={category.id}
              onClick={() => setActiveCategory(category.id as any)}
              className={`px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeCategory === category.id
                  ? "bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold shadow-md shadow-gold-500/10"
                  : darkMode
                  ? "bg-navy-900 text-navy-300 border border-navy-800 hover:border-gold-400/40 hover:text-white"
                  : "bg-neutral-100 text-navy-800 border border-neutral-200 hover:border-gold-400 hover:bg-white"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Dynamic Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {getRenderServices().map((service, i) => (
            <div
              key={i}
              className={`group overflow-hidden rounded-2xl border transition-all duration-500 ${
                darkMode
                  ? "bg-navy-900/60 border-navy-800/80 hover:border-gold-400/40 shadow-xl"
                  : "bg-white border-neutral-200/70 hover:border-gold-400/50 hover:shadow-xl shadow-sm"
              }`}
            >
              {/* Product Image Panel */}
              <div className="h-56 relative overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-transparent"></div>
                <div className="absolute top-4 left-4 p-2.5 bg-navy-950/80 backdrop-blur-md border border-gold-400/30 rounded-lg text-gold-300">
                  {service.icon}
                </div>
              </div>

              {/* Card Body content */}
              <div className="p-6">
                <h3
                  className={`font-serif text-xl font-bold mb-3 ${
                    darkMode ? "text-white" : "text-navy-950"
                  }`}
                >
                  {service.title}
                </h3>
                <p className={`text-xs font-light mb-5 leading-relaxed h-16 overflow-hidden ${darkMode ? "text-navy-300" : "text-neutral-500"}`}>
                  {service.description}
                </p>

                {/* Bullets lists */}
                <ul className="space-y-2 mb-6 border-t pt-4 border-navy-800/20 dark:border-navy-800/60">
                  {service.items.map((sub, j) => (
                    <li key={j} className="flex items-start space-x-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-1.5 flex-shrink-0"></span>
                      <span className={`text-[11px] font-medium leading-none ${darkMode ? "text-navy-200" : "text-neutral-600"}`}>
                        {sub}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={onOpenConsultation}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-center transition-all duration-300 border cursor-pointer ${
                    darkMode
                      ? "border-navy-800 text-gold-300 bg-navy-950 hover:bg-gold-400 hover:text-navy-950"
                      : "border-neutral-200 text-navy-900 bg-neutral-50 hover:bg-gold-500 hover:text-white"
                  }`}
                >
                  Consult Designer
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* --- PREMIUM EXCLUSIVE: INTERACTIVE ESTIMATION TOOL PANEL --- */}
        <div
          id="instant-budget-estimator"
          className={`p-6 md:p-10 rounded-2xl border ${
            darkMode
              ? "bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 border-navy-800 shadow-2xl"
              : "bg-gradient-to-br from-white via-neutral-50 to-white border-neutral-200 shadow-lg"
          }`}
        >
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Form selections column */}
            <div className="w-full lg:w-7/12">
              <div className="flex items-center space-x-2.5 mb-6">
                <div className="p-3 bg-gold-400/10 text-gold-400 rounded-xl">
                  <Calculator className="w-6 h-6" />
                </div>
                <div>
                  <h3 className={`font-serif text-2xl font-bold ${darkMode ? "text-white" : "text-navy-950"}`}>
                    Interactive Budget Estimator
                  </h3>
                  <p className={`text-xs ${darkMode ? "text-navy-300" : "text-neutral-500"}`}>
                    Configure your space options to receive a realistic cost breakdown.
                  </p>
                </div>
              </div>

              {/* Set size BHK buttons */}
              <div className="mb-6">
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2.5 ${darkMode ? "text-navy-300" : "text-navy-800"}`}>
                  1. Choose Apartment Sizing:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: "1bhk", val: "1 BHK Plan" },
                    { id: "2bhk", val: "2 BHK Plan" },
                    { id: "3bhk", val: "3 BHK Plan" },
                    { id: "custom", val: "Bespoke Villa" }
                  ].map((preset) => (
                    <button
                      id={`calc-bhk-${preset.id}`}
                      key={preset.id}
                      onClick={() => setBhk(preset.id as any)}
                      className={`py-2 px-1 rounded-lg text-xs font-bold transition-all ${
                        bhk === preset.id
                          ? "bg-gold-400/20 text-gold-300 border-2 border-gold-400"
                          : darkMode
                          ? "bg-navy-950 border border-navy-800 text-navy-400"
                          : "bg-white border border-neutral-200 text-neutral-600"
                      }`}
                    >
                      {preset.val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Core components toggles array */}
              <div className="mb-6">
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2.5 ${darkMode ? "text-navy-300" : "text-navy-800"}`}>
                  2. Active Components:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: "kitchen", label: "Modular L-Shape/Island Kitchen" },
                    { key: "wardrobe", label: "Custom Ceiling-Height Wardrobes" },
                    { key: "falseCeiling", label: "Designer False Gypsum Ceilings" },
                    { key: "sofaLiving", label: "Living Wall Panel & Cushioned Sofa" },
                    { key: "officeWork", label: "Integrated Study/Workspace Desks" }
                  ].map((addon) => (
                    <label
                      key={addon.key}
                      className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer select-none transition-all ${
                        addons[addon.key as keyof typeof addons]
                          ? darkMode
                            ? "bg-navy-950/60 border-gold-400/40"
                            : "bg-gold-50/50 border-gold-400/30"
                          : darkMode
                          ? "bg-navy-950/20 border-navy-800/40"
                          : "bg-white border-neutral-200/40"
                      }`}
                    >
                      <input
                        id={`calc-addon-${addon.key}`}
                        type="checkbox"
                        checked={addons[addon.key as keyof typeof addons]}
                        onChange={(e) =>
                          setAddons({ ...addons, [addon.key]: e.target.checked })
                        }
                        className="rounded text-gold-400 focus:ring-gold-400 h-4 w-4 bg-navy-950 accent-gold-400"
                      />
                      <span className={`text-[12px] font-medium ${darkMode ? "text-navy-200" : "text-neutral-700"}`}>
                        {addon.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Materials and finishes selector */}
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2.5 ${darkMode ? "text-navy-300" : "text-navy-800"}`}>
                  3. Select Material Finish Quality Tier:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: "premium", name: "Premium Tier", desc: "Green BWR Ply + Standard Laminate" },
                    { id: "ultra", name: "Ultra-Premium", desc: "Sylvan Club BWR + High Gloss Lam" },
                    { id: "regal", name: "Regal Luxury", desc: "Austinpole Marine + PU Gold Finish" }
                  ].map((finish) => (
                    <button
                      id={`calc-finish-${finish.id}`}
                      key={finish.id}
                      onClick={() => setFinishQuality(finish.id as any)}
                      className={`p-3 rounded-lg text-left border transition-all ${
                        finishQuality === finish.id
                          ? "bg-gold-400/20 border-gold-400/80 text-gold-300"
                          : darkMode
                          ? "bg-navy-950 border-navy-800 text-navy-400 hover:border-navy-700"
                          : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300"
                      }`}
                    >
                      <p className="text-xs font-bold leading-none mb-1">{finish.name}</p>
                      <p className="text-[10px] text-navy-400 leading-normal">{finish.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Price output summary column */}
            <div className="w-full lg:w-5/12">
              <div className={`p-6 rounded-2xl border flex flex-col justify-between items-center text-center ${
                darkMode ? "bg-navy-950/60 border-navy-800" : "bg-white border-neutral-200/80 shadow-md"
              }`}>
                <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-gold-400 mb-2">Estimated Package Cost</span>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={calculateBudget()}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-serif text-3xl sm:text-4xl font-extrabold text-white text-glow-gold bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent mb-4 leading-none"
                  >
                    ₹ {calculateBudget().toLocaleString("en-IN")} *
                  </motion.p>
                </AnimatePresence>
                
                <p className={`text-[10px] leading-normal max-w-xs mb-6 ${darkMode ? "text-navy-300" : "text-neutral-500"}`}>
                  * Excludes West Bengal GST. Includes raw carpentry, surface laminations, procurement, transport, and 45-day complete setup.
                </p>

                {/* Sub-Material list representation */}
                <div className="w-full text-left bg-navy-950/40 p-4 rounded-xl border border-navy-800 mb-6">
                  <h4 className="text-[11px] uppercase tracking-wider text-gold-400 font-bold mb-2.5">Included Materials Blueprint:</h4>
                  <ul className="space-y-2">
                    {getMaterialsList().map((mat, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <CheckCircle className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                        <span className={`text-[11px] ${darkMode ? "text-navy-200" : "text-neutral-200"}`}>{mat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  id="calc-cta-book"
                  onClick={onOpenConsultation}
                  className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-navy-950 font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-lg shadow-gold-500/10 active:scale-95 transition-all"
                >
                  Confirm Estimate & Get Free Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
