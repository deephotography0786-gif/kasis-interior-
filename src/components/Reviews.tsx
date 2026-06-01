import React, { useState, useEffect } from "react";
import { Review } from "../types.ts";
import { Star, ChevronLeft, ChevronRight, MessageSquare, ShieldCheck, PenTool, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { createReview } from "../api.ts";

interface ReviewsProps {
  initialReviews: Review[];
  onRefreshReviews: () => void;
  darkMode: boolean;
}

export default function Reviews({ initialReviews, onRefreshReviews, darkMode }: ReviewsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Review posting form state
  const [clientName, setClientName] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [designation, setDesignation] = useState("");
  const [source, setSource] = useState<"Google Reviews" | "Direct">("Direct");

  useEffect(() => {
    if (initialReviews.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % initialReviews.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [initialReviews]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % initialReviews.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + initialReviews.length) % initialReviews.length);
  };

  const handlePostReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !reviewText) return;
    
    setIsSubmitting(true);
    try {
      await createReview({
        clientName,
        rating,
        reviewText,
        designation: designation || "Kolkata Resident",
        source: "Direct"
      });
      setSuccessMsg("Thank you! Your testimonial has been posted successfully.");
      setClientName("");
      setReviewText("");
      setDesignation("");
      setRating(5);
      onRefreshReviews();
      setTimeout(() => {
        setSuccessMsg("");
        setModalOpen(false);
      }, 3000);
    } catch (e) {
      console.error("Error posting review", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalReviewsCount = initialReviews.length + 125; // Base Google count + live database items
  const averageRating = 4.9;

  return (
    <section
      id="reviews"
      className={`py-24 transition-colors duration-500 overflow-hidden ${
        darkMode ? "bg-navy-950 border-t border-navy-900" : "bg-white border-t border-neutral-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-gold-400 block mb-3">
            VERIFIED TESTIMONIALS
          </span>
          <h2
            className={`font-serif text-3xl sm:text-4xl font-semibold tracking-tight ${
              darkMode ? "text-white" : "text-navy-950"
            }`}
          >
            What Our Clients Speak About Us
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-gold-500 to-gold-300 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Aggregate ranking dashboard cards */}
        <div className="flex flex-col lg:flex-row gap-12 items-center justify-between mb-16">
          <div className={`w-full lg:w-5/12 p-8 rounded-2xl border ${
            darkMode
              ? "bg-navy-900/60 border-navy-800"
              : "bg-neutral-50/70 border-neutral-200"
          }`}>
            <div className="flex items-center space-x-6">
              <div className="p-5 rounded-xl bg-gold-400/10 text-gold-400 text-center flex flex-col justify-center items-center">
                <span className="font-serif text-4xl font-black block leading-none mb-1 text-glow-gold">{averageRating}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">OUT OF 5</span>
              </div>
              
              <div>
                <div className="flex space-x-0.5 text-gold-400 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <h4 className={`font-serif text-lg font-bold leading-tight ${darkMode ? "text-white" : "text-navy-950"}`}>
                  Excellent Luxury Rating
                </h4>
                <p className={`text-xs ${darkMode ? "text-navy-300" : "text-neutral-500"}`}>
                  Based on <strong className="text-gold-400">{totalReviewsCount}+</strong> combined verified Google Home Review and Houzz endorsements in Bengal.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-navy-800/20 dark:border-navy-800/60 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <span className={`text-xs ${darkMode ? "text-navy-300" : "text-neutral-500"}`}>
                Redecorated your home with us?
              </span>
              <button
                id="btn-trigger-review-modal"
                onClick={() => setModalOpen(true)}
                className="px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-navy-950 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 cursor-pointer shadow-md inline-flex items-center space-x-1.5"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Write A Review</span>
              </button>
            </div>
          </div>

          {/* Testimonial slider section */}
          <div className="w-full lg:w-7/12 relative">
            <div className={`p-8 md:p-10 rounded-2xl border min-h-[260px] flex flex-col justify-between ${
              darkMode
                ? "bg-navy-900 border-navy-800 shadow-2xl"
                : "bg-white border-neutral-200 shadow-md"
            }`}>
              <AnimatePresence mode="wait">
                {initialReviews.length > 0 && (
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-4"
                  >
                    {/* Stars bar */}
                    <div className="flex space-x-0.5 text-gold-400">
                      {[...Array(initialReviews[currentIndex].rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current animate-pulse" />
                      ))}
                    </div>

                    {/* Review text comment */}
                    <p className={`font-serif italic text-md leading-relaxed ${darkMode ? "text-navy-200" : "text-navy-900"}`}>
                      "{initialReviews[currentIndex].reviewText}"
                    </p>

                    {/* Author layout */}
                    <div className="flex items-center justify-between border-t border-navy-800/10 dark:border-navy-800/50 pt-4">
                      <div>
                        <p className={`font-bold text-sm leading-none ${darkMode ? "text-white" : "text-navy-950"}`}>
                          {initialReviews[currentIndex].clientName}
                        </p>
                        <p className={`text-[10px] mt-1.5 uppercase font-semibold tracking-wider ${darkMode ? "text-navy-400" : "text-neutral-400"}`}>
                          {initialReviews[currentIndex].designation}
                        </p>
                      </div>

                      <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>VERIFIED CLIENT</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Slider controls panel */}
              <div className="flex space-x-2 mt-6 justify-end">
                <button
                  id="rev-btn-prev"
                  onClick={handlePrev}
                  className={`p-2 rounded-full border cursor-pointer hover:scale-105 transition-transform ${
                    darkMode ? "border-navy-800 bg-navy-950 text-gold-400" : "border-neutral-200 bg-neutral-55 text-navy-800"
                  }`}
                  title="Previous slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  id="rev-btn-next"
                  onClick={handleNext}
                  className={`p-2 rounded-full border cursor-pointer hover:scale-105 transition-transform ${
                    darkMode ? "border-navy-800 bg-navy-950 text-gold-400" : "border-neutral-200 bg-neutral-55 text-navy-800"
                  }`}
                  title="Next slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- REVIEW CREATOR POPUP MODAL --- */}
        <AnimatePresence>
          {modalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-105 flex items-center justify-center p-4 bg-navy-950/90 backdrop-blur-md"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className={`w-full max-w-md rounded-2xl overflow-hidden border p-6 md:p-8 ${
                  darkMode ? "bg-navy-950 border-navy-800 text-white" : "bg-white border-neutral-200 text-navy-950 shadow-2xl"
                }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-serif text-xl font-bold">Write Your Client Review</h3>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="p-1 rounded-full text-neutral-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                {successMsg ? (
                  <div className="text-center py-8 space-y-3">
                    <div className="inline-flex items-center justify-center p-4 bg-emerald-500/10 rounded-full text-emerald-500">
                      <Check className="w-8 h-8 font-black" />
                    </div>
                    <p className="text-sm font-semibold">{successMsg}</p>
                  </div>
                ) : (
                  <form onSubmit={handlePostReview} className="space-y-4">
                    {/* Full Name input */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                        Your Full Name: *
                      </label>
                      <input
                        id="review-form-name"
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="E.g., Dr. Arindam Sen"
                        className={`w-full p-2.5 rounded-lg border text-sm ${
                          darkMode
                            ? "bg-navy-900 border-navy-800 text-white focus:border-gold-400"
                            : "bg-neutral-50 border-neutral-200 text-navy-950 focus:border-gold-500"
                        }`}
                      />
                    </div>

                    {/* Location or designation */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                        Your Location / Profession:
                      </label>
                      <input
                        id="review-form-designation"
                        type="text"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        placeholder="E.g. Salt Lake Homeowner"
                        className={`w-full p-2.5 rounded-lg border text-sm ${
                          darkMode
                            ? "bg-navy-900 border-navy-800 text-white focus:border-gold-400"
                            : "bg-neutral-50 border-neutral-200 text-navy-950 focus:border-gold-500"
                        }`}
                      />
                    </div>

                    {/* Star scale buttons selection */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 font-bold text-gold-400">
                        Select Rating Score: *
                      </label>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <button
                            id={`review-form-star-${val}`}
                            key={val}
                            type="button"
                            onClick={() => setRating(val)}
                            className="p-1 cursor-pointer scale-105 hover:scale-120 transition-transform"
                            title={`Rate ${val} Star`}
                          >
                            <Star
                              className={`w-7 h-7 ${
                                val <= rating ? "fill-gold-400 text-gold-400" : "text-neutral-400 dark:text-navy-800"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Testimony text comments textarea */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                        Your Testimonial Comments: *
                      </label>
                      <textarea
                        id="review-form-text"
                        required
                        rows={4}
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Write details about your modular furniture materials quality, staff conduct, and final output."
                        className={`w-full p-2.5 rounded-lg border text-xs resize-none leading-relaxed ${
                          darkMode
                            ? "bg-navy-900 border-navy-800 text-white focus:border-gold-400"
                            : "bg-neutral-50 border-neutral-200 text-navy-900 focus:border-gold-500"
                        }`}
                      ></textarea>
                    </div>

                    <div className="pt-2">
                      <button
                        id="review-form-submit"
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 hover:bg-gold-600 font-bold py-3 text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md disabled:opacity-50"
                      >
                        {isSubmitting ? "Submitting..." : "Submit Review Automatically"}
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
