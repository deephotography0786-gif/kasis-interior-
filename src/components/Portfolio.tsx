import React, { useState } from "react";
import { Project } from "../types.ts";
import { Eye, Info, Sparkles, MapPin, Minimize2, Landmark, Tag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PortfolioProps {
  projects: Project[];
  darkMode: boolean;
}

export default function Portfolio({ projects, darkMode }: PortfolioProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Before/After slider state (track active project ID and slide percentage)
  const [activeSliderProjId, setActiveSliderProjId] = useState<string | null>(null);
  const [sliderPercentage, setSliderPercentage] = useState<number>(50);

  const filterTabs = [
    { id: "all", name: "All Projects" },
    { id: "bedroom", name: "Bedroom" },
    { id: "living", name: "Living Room" },
    { id: "kitchen", name: "Modular Kitchen" },
    { id: "office", name: "Office" },
    { id: "furniture", name: "Furniture" },
    { id: "dining", name: "Dining Area" }
  ];

  const filteredProjects = activeFilter === "all"
    ? projects
    : projects.filter(p => p.category.toLowerCase() === activeFilter.toLowerCase());

  // Handle slide mouse / touch move
  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPercentage(percentage);
  };

  return (
    <section
      id="portfolio"
      className={`py-24 transition-colors duration-500 ${
        darkMode ? "bg-navy-900" : "bg-neutral-50/50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-gold-400 block mb-3">
            Elite Space Showcase
          </span>
          <h2
            className={`font-serif text-3xl sm:text-4xl font-semibold tracking-tight ${
              darkMode ? "text-white" : "text-navy-950"
            }`}
          >
            Our Realized Masterpieces
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-gold-500 to-gold-300 mx-auto mt-4 rounded-full"></div>
          <p className={`mt-4 text-xs font-light leading-relaxed max-w-xl mx-auto ${darkMode ? "text-navy-300" : "text-neutral-500"}`}>
            Explore actual case-studies completed by our Kolkata carpenters and designers. Click on any card for budget, materials, and transform previews.
          </p>
        </div>

        {/* Category Filters Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {filterTabs.map((tab) => (
            <button
              id={`portfolio-tab-${tab.id}`}
              key={tab.id}
              onClick={() => {
                setActiveFilter(tab.id);
                setActiveSliderProjId(null);
              }}
              className={`px-4.5 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeFilter === tab.id
                  ? "bg-navy-950 text-gold-300 border-2 border-gold-400 font-extrabold shadow-md shadow-gold-500/10"
                  : darkMode
                  ? "bg-navy-950/40 text-navy-300 border border-navy-800 hover:border-gold-400/40 hover:text-white"
                  : "bg-white text-navy-800 border border-neutral-200/80 hover:border-gold-400"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Gallery Dynamic Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => {
            const hasBeforeUrl = !!project.beforeImage;
            const isSliderActive = activeSliderProjId === project.id;

            return (
              <div
                key={project.id}
                className={`group overflow-hidden rounded-2xl border transition-all duration-500 ${
                  darkMode
                    ? "bg-navy-950 border-navy-800/80 hover:border-gold-400/30"
                    : "bg-white border-neutral-200/80 hover:border-gold-400/50 shadow-sm"
                }`}
              >
                {/* Media Container Panel */}
                <div className="h-64 relative overflow-hidden bg-navy-900 select-none">
                  {hasBeforeUrl && isSliderActive ? (
                    /* Interactive Before/After slide viewer */
                    <div
                      onMouseMove={handleSliderMove}
                      onTouchMove={handleSliderMove}
                      className="absolute inset-0 cursor-ew-resize overflow-hidden"
                    >
                      {/* After Layer (Full) */}
                      <img
                        src={project.image}
                        alt="After"
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                      />
                      {/* Before Layer (Clipped) */}
                      <div
                        className="absolute inset-0 overflow-hidden pointer-events-none"
                        style={{ width: `${sliderPercentage}%` }}
                      >
                        <img
                          src={project.beforeImage}
                          alt="Before"
                          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                          style={{ width: "100%", maxWidth: "none" }}
                        />
                        <span className="absolute top-4 left-4 z-20 px-2 py-0.5 rounded bg-black/70 border border-white/20 text-white font-mono text-[9px] uppercase tracking-wider">
                          Before Space
                        </span>
                      </div>
                      
                      {/* Interactive Divider Line handle */}
                      <div
                        className="absolute top-0 bottom-0 w-1 bg-gold-400 z-35"
                        style={{ left: `${sliderPercentage}%` }}
                      >
                        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gold-400 border border-navy-950 shadow flex items-center justify-center">
                          <span className="text-[9px] font-bold text-navy-950">↔</span>
                        </div>
                      </div>
                      
                      <span className="absolute top-4 right-4 z-20 px-2 py-0.5 rounded bg-gold-400 text-navy-950 font-sans text-[9px] font-bold uppercase tracking-wider">
                        Luxury Design
                      </span>
                    </div>
                  ) : (
                    /* General project display cover */
                    <>
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-85 transition-opacity"></div>
                      
                      {/* Quick tool hover overlay menu */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-navy-950/45 backdrop-blur-[2px] gap-2">
                        <button
                          id={`proj-zoom-${project.id}`}
                          onClick={() => setSelectedProject(project)}
                          className="p-3 rounded-full bg-gold-400 hover:bg-gold-500 text-navy-950 transition-transform hover:scale-110 cursor-pointer"
                          title="Open Details Lightbox"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        {hasBeforeUrl && (
                          <button
                            id={`proj-slider-${project.id}`}
                            onClick={() => {
                              setActiveSliderProjId(project.id);
                              setSliderPercentage(50);
                            }}
                            className="p-3 rounded-full bg-white text-navy-950 hover:bg-gold-100 transition-transform hover:scale-110 cursor-pointer text-xs font-bold uppercase flex items-center space-x-1"
                            title="Interactive Transform Slider"
                          >
                            <span className="text-[10px] font-black tracking-wider px-1">Before / After</span>
                          </button>
                        )}
                      </div>
                    </>
                  )}
                  
                  {/* Category Pill Tag Overlay */}
                  <span className="absolute bottom-4 left-4 z-10 px-2.5 py-1 rounded bg-navy-950/85 backdrop-blur-sm border border-gold-400/30 text-gold-300 font-sans text-[10px] uppercase tracking-widest font-semibold">
                    {project.category}
                  </span>
                </div>

                {/* Information Card Body */}
                <div className="p-5 flex flex-col justify-between">
                  <div>
                    <h3
                      className={`font-serif text-lg font-bold tracking-tight mb-2 truncate ${
                        darkMode ? "text-white" : "text-navy-950"
                      }`}
                    >
                      {project.title}
                    </h3>
                    <p className={`text-xs font-light leading-relaxed h-10 overflow-hidden mb-4 ${darkMode ? "text-navy-300" : "text-neutral-500"}`}>
                      {project.description}
                    </p>
                  </div>

                  {/* Core specifications sub-banner */}
                  <div className="flex items-center justify-between border-t border-navy-800/10 dark:border-navy-800/40 pt-3 mt-1">
                    <span className="flex items-center space-x-1 font-mono text-[11px] text-gold-400 font-semibold">
                      <span>{project.budget || "Custom Budget"}</span>
                    </span>
                    <span className={`text-[10px] flex items-center space-x-0.5 ${darkMode ? "text-navy-400" : "text-neutral-400"}`}>
                      <MapPin className="w-3 h-3 text-gold-400" />
                      <span>{project.location || "Kolkata, WB"}</span>
                    </span>
                  </div>

                  {/* Option returning slider trigger to preview image */}
                  {isSliderActive && (
                    <button
                      onClick={() => setActiveSliderProjId(null)}
                      className="mt-3.5 text-center text-[10px] font-bold text-gold-300 uppercase hover:underline"
                    >
                      ← Back to normal photo
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* --- DETAILED DETAIL LIGHTBOX POPUP MODE --- */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-105 flex items-center justify-center p-4 bg-navy-950/95 backdrop-blur-md"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className={`w-full max-w-4xl rounded-2xl overflow-hidden border ${
                  darkMode ? "bg-navy-950 border-navy-800" : "bg-white border-neutral-200 shadow-2xl"
                }`}
              >
                {/* Lighbox Grid split */}
                <div className="grid grid-cols-1 md:grid-cols-2">
                  
                  {/* Photo panel */}
                  <div className="relative h-64 md:h-[450px]">
                    <img
                      src={selectedProject.image}
                      alt={selectedProject.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 to-transparent"></div>
                    
                    {selectedProject.beforeImage && (
                      <div className="absolute bottom-4 left-4 p-2 bg-navy-950/80 backdrop-blur-md border border-white/20 rounded text-center">
                        <p className="text-[9px] text-neutral-400 uppercase tracking-widest leading-none font-semibold mb-1">Click to view Slider</p>
                        <button
                          onClick={() => {
                            setActiveSliderProjId(selectedProject.id);
                            setSelectedProject(null);
                          }}
                          className="text-[9.5px] font-bold text-gold-300 uppercase leading-none hover:underline"
                        >
                          Enable Before/After view
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Information Detail Panel column */}
                  <div className="p-6 md:p-8 flex flex-col justify-between">
                    <div className="relative">
                      {/* Exit box trigger */}
                      <button
                        id="details-lightbox-close"
                        onClick={() => setSelectedProject(null)}
                        className={`absolute -top-2 -right-2 p-2 rounded-full cursor-pointer hover:bg-neutral-100 dark:hover:bg-navy-900 ${
                          darkMode ? "text-navy-300 hover:text-white" : "text-navy-800 hover:text-navy-950"
                        }`}
                        title="Close Modal"
                      >
                        <Minimize2 className="w-5 h-5" />
                      </button>

                      <span className="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gold-400/20 text-gold-300 border border-gold-400/30 uppercase tracking-widest mb-4">
                        {selectedProject.category}
                      </span>
                      
                      <h3 className={`font-serif text-2xl font-bold mb-4 tracking-tight leading-snug ${
                        darkMode ? "text-white" : "text-navy-950"
                      }`}>
                        {selectedProject.title}
                      </h3>
                      
                      <p className={`text-sm font-light leading-relaxed mb-6 ${
                        darkMode ? "text-navy-200" : "text-neutral-600"
                      }`}>
                        {selectedProject.description}
                      </p>

                      {/* Client case studies table cards */}
                      <div className="space-y-3.5 border-t border-navy-800/10 dark:border-navy-800/40 pt-5">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? "text-navy-400" : "text-neutral-500"}`}>
                            Client Representative Name:
                          </span>
                          <span className={`text-xs font-bold ${darkMode ? "text-white" : "text-navy-950"}`}>
                            {selectedProject.clientName || "Private Estate"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? "text-navy-400" : "text-neutral-500"}`}>
                            Exact Project Budget:
                          </span>
                          <span className="text-xs font-bold text-gold-400 font-mono">
                            {selectedProject.budget || "Custom Quote"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? "text-navy-400" : "text-neutral-500"}`}>
                            Project Location:
                          </span>
                          <span className={`text-xs font-bold ${darkMode ? "text-white" : "text-navy-950"}`}>
                            {selectedProject.location || "Kolkata, West Bengal"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Return Action Trigger */}
                    <div className="pt-6 border-t border-navy-800/10 dark:border-navy-800/40 mt-6 md:mt-0">
                      <button
                        onClick={() => setSelectedProject(null)}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-navy-950 font-bold uppercase text-xs tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
                      >
                        Close Details Window
                      </button>
                    </div>
                  </div>

                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
