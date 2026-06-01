import { useState, useEffect } from "react";
import { Phone, Users, Shield, Calendar, ChevronLeft, ChevronRight, Award } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { WebConfig } from "../types.ts";

interface HeroProps {
  config: WebConfig;
  darkMode: boolean;
  onOpenConsultation: () => void;
}

const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&q=80",
    title: "Transforming Spaces Into Elegant Living Experiences",
    subtitle: "Premium Interior Design & Custom Furniture Solutions crafted beautifully in Kolkata.",
    tagline: "LUXURY RESIDENCES"
  },
  {
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1920&q=80",
    title: "Personalized Bedrooms Designed for Perfect Serenity",
    subtitle: "Tailor-made structural layouts, ambient warm LED designs, and custom wood dressers.",
    tagline: "INTERIOR MASTERCLASSES"
  },
  {
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1920&q=80",
    title: "German-Precision Intelligent Modular Kitchens",
    subtitle: "Boiling waterproof BWR marine plywood with sleek acrylic high-gloss setups.",
    tagline: "MODERN KITCHENS"
  },
  {
    image: "https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&w=1920&q=80",
    title: "Commercial & Office Redesigns That Drive Success",
    subtitle: "Smart functional reception lobbies, spacious setups, and pristine boardroom acoustic ceilings.",
    tagline: "COMMERCIAL & CORPORATE"
  }
];

export default function Hero({ config, darkMode, onOpenConsultation }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-navy-950">
      {/* Dynamic Background Slide Carousel */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${HERO_SLIDES[currentSlide].image}')`
            }}
          >
            {/* Split Vignette Shadows to make text highly readable */}
            <div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-950/70 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-orange-400/25 via-transparent to-orange-300/10"></div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Animated Spark Particles effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-navy-950/20 to-navy-950 opacity-60 pointer-events-none"></div>

      {/* Hero Core Content Layout */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 md:pb-32 flex flex-col justify-center min-h-screen">
        <div className="max-w-3xl">
          {/* Animated luxury Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gold-400/20 border border-gold-400/40 text-gold-200 text-xs font-bold tracking-[0.2em] uppercase mb-6"
          >
            <Award className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
            <span>{HERO_SLIDES[currentSlide].tagline}</span>
          </motion.div>

          {/* Large display headline */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-6"
          >
            {HERO_SLIDES[currentSlide].title}
          </motion.h1>

          {/* Subheadline detailing business benefits */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="font-sans text-lg sm:text-xl text-navy-200 font-light max-w-2xl leading-relaxed mb-10"
          >
            {HERO_SLIDES[currentSlide].subtitle}
          </motion.p>

          {/* CTA Action Controls */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center"
          >
            <button
              id="hero-cta-consult"
              onClick={onOpenConsultation}
              className="bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 active:scale-95 text-navy-950 font-bold px-8 py-4 rounded-xl text-md transition-all duration-300 shadow-xl shadow-gold-500/20 flex items-center justify-center space-x-2 border border-gold-400"
            >
              <span>Get Free Consultation</span>
              <span className="text-navy-950 text-xs py-0.5 px-1.5 rounded bg-white/20 font-black">FREE</span>
            </button>

            <a
              id="hero-cta-portfolio"
              href="#portfolio"
              className="px-8 py-4 rounded-xl font-bold text-md text-white border border-white/30 backdrop-blur-sm bg-white/5 hover:bg-white/15 hover:border-white transition-all duration-300 text-center flex items-center justify-center space-x-1.5"
            >
              <span>Explore Portfolio</span>
            </a>

            <a
              id="hero-cta-call"
              href={`tel:${config.phone}`}
              className="px-6 py-4 rounded-xl text-gold-300 hover:text-gold-200 transition-all duration-300 text-center flex items-center justify-center space-x-2 font-semibold text-sm group"
            >
              <Phone className="w-4 h-4 text-gold-400 group-hover:scale-125 transition-transform" />
              <span>Call +91 98040 42345</span>
            </a>
          </motion.div>
        </div>

        {/* Dynamic Highlight Stats Grid Banner (Bento-inspired footer stats) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 md:mt-24 p-6 rounded-2xl bg-navy-900/60 backdrop-blur-md border border-navy-800/80 shadow-2xl"
        >
          <div className="flex items-center space-x-3.5 border-r border-navy-800/80 pr-4 last:border-0">
            <div className="p-3 bg-gold-400/10 text-gold-300 rounded-xl">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="font-serif text-2xl font-bold text-white leading-none mb-1 text-glow-gold">{config.experienceYears}+ Years</p>
              <p className="text-[11px] uppercase tracking-wider text-navy-400 font-semibold">Of Excellence</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5 md:border-r border-navy-800/80 pr-4 last:border-0">
            <div className="p-3 bg-gold-400/10 text-gold-300 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="font-serif text-2xl font-bold text-white leading-none mb-1 text-glow-gold">500+ Homes</p>
              <p className="text-[11px] uppercase tracking-wider text-navy-400 font-semibold">Spaces Perfected</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5 border-r border-navy-800/80 pr-4 last:border-0">
            <div className="p-3 bg-gold-400/10 text-gold-300 rounded-xl">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <p className="font-serif text-2xl font-bold text-white leading-none mb-1 text-glow-gold">{config.warrantyYears} Years</p>
              <p className="text-[11px] uppercase tracking-wider text-navy-400 font-semibold">Structure Warranty</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5 last:border-0">
            <div className="p-3 bg-gold-400/10 text-gold-300 rounded-xl">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="font-serif text-2xl font-bold text-white leading-none mb-1 text-glow-gold">45 Days</p>
              <p className="text-[11px] uppercase tracking-wider text-navy-400 font-semibold">On-Time Delivery</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Manual Svg navigation buttons for slide controlling */}
      <button
        id="hero-slide-prev"
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-25 p-2.5 rounded-full border border-white/10 bg-black/20 hover:bg-black/50 hover:border-white/30 text-white transition-all hidden md:block"
        title="Prev"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        id="hero-slide-next"
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-25 p-2.5 rounded-full border border-white/10 bg-black/20 hover:bg-black/50 hover:border-white/30 text-white transition-all hidden md:block"
        title="Next"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Slide Indicators dot panel */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-25 flex space-x-2">
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              currentSlide === idx ? "bg-gold-400 w-8" : "bg-white/30 hover:bg-white/60"
            }`}
            title={`Slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Brand Signature Watermark from screenshot */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 select-none pointer-events-none">
        <span className="font-sans text-[13px] font-semibold text-white tracking-[0.2em] lowercase opacity-90 block">
          deep
        </span>
      </div>
    </section>
  );
}
