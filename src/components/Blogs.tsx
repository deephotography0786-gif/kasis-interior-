import { useState } from "react";
import { Blog } from "../types.ts";
import { Calendar, User, Eye, ArrowUpRight, BookOpen, Clock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface BlogsProps {
  blogs: Blog[];
  darkMode: boolean;
}

export default function Blogs({ blogs, darkMode }: BlogsProps) {
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  return (
    <section
      id="blog"
      className={`py-24 transition-colors duration-500 ${
        darkMode ? "bg-navy-900 border-t border-navy-800" : "bg-neutral-50/60 border-t border-neutral-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-gold-400 block mb-3">
            Elite Design Journal
          </span>
          <h2
            className={`font-serif text-3xl sm:text-4xl font-semibold tracking-tight ${
              darkMode ? "text-white" : "text-navy-950"
            }`}
          >
            Insights & Guides From Our Designers
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-gold-500 to-gold-300 mx-auto mt-4 rounded-full"></div>
          <p className={`mt-4 text-xs font-light leading-relaxed max-w-xl mx-auto ${darkMode ? "text-navy-300" : "text-neutral-500"}`}>
            Stay up to date with modular kitchen materials planning, luxurious lighting schemes, or space-saving bedroom aesthetics designed for contemporary East Indian architectures.
          </p>
        </div>

        {/* Blog Posts Dynamic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogs.map((b) => (
            <div
              key={b.id}
              className={`group overflow-hidden rounded-2xl border transition-all duration-500 flex flex-col md:flex-row ${
                darkMode
                  ? "bg-navy-950 border-navy-800/80 hover:border-gold-400/30"
                  : "bg-white border-neutral-200/80 hover:border-gold-400 shadow-sm"
              }`}
            >
              {/* Cover panel image */}
              <div className="w-full md:w-5/12 h-56 md:h-auto relative overflow-hidden bg-navy-900 shrink-0">
                <img
                  src={b.image}
                  alt={b.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 to-transparent md:hidden"></div>
              </div>

              {/* Text Card Body */}
              <div className="p-6 md:p-7 flex flex-col justify-between flex-grow">
                <div>
                  {/* Meta markers line */}
                  <div className="flex items-center space-x-3.5 mb-3 font-mono text-[10px] uppercase font-bold text-gold-400">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 mr-0.5 shrink-0" />
                      <span>{b.date}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <User className="w-3.5 h-3.5 mr-0.5 shrink-0" />
                      <span>{b.author}</span>
                    </span>
                  </div>

                  <h3
                    className={`font-serif text-lg md:text-xl font-bold tracking-tight mb-3 group-hover:text-gold-400 leading-snug transition-colors ${
                      darkMode ? "text-white" : "text-navy-950"
                    }`}
                  >
                    {b.title}
                  </h3>
                  
                  <p className={`text-xs font-light leading-relaxed mb-6 h-12 overflow-hidden ${
                    darkMode ? "text-navy-300" : "text-neutral-500"
                  }`}>
                    {b.excerpt}
                  </p>
                </div>

                <div className="border-t border-navy-800/10 dark:border-navy-800/40 pt-4 mt-2">
                  <button
                    id={`blog-btn-more-${b.id}`}
                    onClick={() => setSelectedBlog(b)}
                    className="text-xs font-extrabold tracking-widest uppercase text-gold-400 hover:text-gold-300 flex items-center space-x-1 group/btn cursor-pointer"
                  >
                    <span>Read Article Blueprint</span>
                    <ArrowUpRight className="w-4 h-4 transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- DETAILED ARTICLE FULL-DRAWER OVERLAY MODAL --- */}
        <AnimatePresence>
          {selectedBlog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-105 flex items-center justify-center p-4 bg-navy-950/95 backdrop-blur-md overflow-y-auto"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 20 }}
                className={`w-full max-w-3xl rounded-2xl overflow-hidden border my-8 ${
                  darkMode ? "bg-navy-950 border-navy-800 text-white" : "bg-white border-neutral-200 text-navy-950 shadow-2xl"
                }`}
              >
                {/* Visual Header Banner */}
                <div className="relative h-64 md:h-80 bg-navy-900">
                  <img
                    src={selectedBlog.image}
                    alt={selectedBlog.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 to-transparent"></div>
                  
                  <button
                    id="blog-drawer-close"
                    onClick={() => setSelectedBlog(null)}
                    className="absolute top-4 right-4 z-20 px-3.5 py-1.5 rounded-full bg-black/70 border border-white/20 hover:bg-black text-white text-xs font-bold leading-none cursor-pointer"
                  >
                    Close Article ✕
                  </button>

                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center space-x-2.5 text-gold-300 font-mono text-[10px] uppercase font-bold mb-2">
                      <span className="flex items-center space-x-0.5"><Clock className="w-3.5 h-3.5 shrink-0" /> <span>5 Mins Read</span></span>
                      <span>•</span>
                      <span>{selectedBlog.date}</span>
                    </div>
                    <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-white leading-tight">
                      {selectedBlog.title}
                    </h3>
                  </div>
                </div>

                {/* Inner Body text */}
                <div className="p-6 md:p-10">
                  <div
                    className={`font-sans leading-relaxed text-sm md:text-base space-y-4 markdown-body overflow-y-auto max-h-[300px] pr-2 ${
                      darkMode ? "text-navy-200" : "text-neutral-700"
                    }`}
                  >
                    {/* Simplified markdown reader split */}
                    {selectedBlog.content.split("\n\n").map((para, k) => {
                      if (para.startsWith("#")) {
                        return (
                          <h4
                            key={k}
                            className={`font-serif text-lg md:text-xl font-bold mt-6 mb-2 ${
                              darkMode ? "text-gold-200" : "text-navy-950"
                            }`}
                          >
                            {para.replace(/#/g, "").trim()}
                          </h4>
                        );
                      }
                      if (para.startsWith("*")) {
                        return (
                          <ul key={k} className="list-disc pl-5 my-2.5 space-y-1">
                            {para.split("\n").map((li, liK) => (
                              <li key={liK} className="text-xs md:text-sm font-light">
                                {li.replace(/\*/g, "").trim()}
                              </li>
                            ))}
                          </ul>
                        );
                      }
                      return (
                        <p key={k} className="text-xs md:text-sm font-light leading-relaxed">
                          {para}
                        </p>
                      );
                    })}
                  </div>

                  <div className="mt-10 border-t border-navy-800/10 dark:border-navy-800/40 pt-6 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-gold-400 flex items-center justify-center font-bold text-navy-950 font-serif text-xs">
                        {selectedBlog.author.charAt(0)}
                      </div>
                      <div>
                        <p className={`text-xs font-bold ${darkMode ? "text-white" : "text-navy-950"}`}>
                          Published by: {selectedBlog.author}
                        </p>
                        <p className="text-[10px] text-neutral-400">Editorial Design Consultant</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedBlog(null)}
                      className="px-6 py-2 rounded-lg bg-navy-950 text-gold-400 hover:text-white border border-navy-800 text-xs font-bold leading-none cursor-pointer"
                    >
                      Close Journal Read
                    </button>
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
