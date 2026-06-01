import React, { useState, useEffect } from "react";
import {
  Phone,
  MessageCircle,
  MapPin,
  Lock,
  ChevronUp,
  Sparkles,
  ArrowUp,
  Mail,
  Loader2,
  AlertCircle
} from "lucide-react";
import { fetchConfig, fetchPortfolio, fetchReviews, fetchBlogs } from "./api.ts";
import { Project, Review, Blog, WebConfig } from "./types.ts";
import { auth } from "./firebase.ts";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

// Import custom sub-modules
import Navbar from "./components/Navbar.tsx";
import Hero from "./components/Hero.tsx";
import About from "./components/About.tsx";
import Services from "./components/Services.tsx";
import Portfolio from "./components/Portfolio.tsx";
import Reviews from "./components/Reviews.tsx";
import Blogs from "./components/Blogs.tsx";
import FAQ from "./components/FAQ.tsx";
import Contact from "./components/Contact.tsx";
import AdminPanel from "./components/AdminPanel.tsx";

export default function App() {
  // Global View Mode states
  const [darkMode, setDarkMode] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [adminToken, setAdminToken] = useState("");

  // Business state variables
  const [config, setConfig] = useState<WebConfig | null>(null);
  const [portfolio, setPortfolio] = useState<Project[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [preSelectedService, setPreSelectedService] = useState("");

  // Loading and Error boundaries
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState("");

  // Panel triggers & login forms
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    loadAllBusinessData();
    
    const handleScrollWatcher = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScrollWatcher);
    return () => window.removeEventListener("scroll", handleScrollWatcher);
  }, []);

  // Firebase auth state change listener to synchronize Admin modes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (user.email === "deephotography0786@gmail.com") {
          const token = await user.getIdToken();
          setAdminToken(token);
          setAdminLoggedIn(true);
        } else {
          console.warn("Signed-in Google account is not the registered admin:", user.email);
        }
      } else {
        // Only clear if the log-in is not a local passcode session (starts with kasis_tok_)
        if (!adminToken.startsWith("kasis_tok_")) {
          setAdminToken("");
          setAdminLoggedIn(false);
        }
      }
    });
    return () => unsubscribe();
  }, [adminToken]);

  const loadAllBusinessData = async () => {
    try {
      setLoading(true);
      const [cfg, port, revs, blg] = await Promise.all([
        fetchConfig(),
        fetchPortfolio(),
        fetchReviews(),
        fetchBlogs()
      ]);
      setConfig(cfg);
      setPortfolio(port);
      setReviews(revs);
      setBlogs(blg);
    } catch (err) {
      console.error("Critical error syncing dataset from server", err);
      setErrorStatus("Failed to establish secure handshake with data nodes.");
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In with Firebase helper
  const handleGoogleSignIn = async () => {
    setLoginError("");
    try {
      const provider = new GoogleAuthProvider();
      // Configure popup signIn inside preview frames or tab views
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (user.email === "deephotography0786@gmail.com") {
        if (!user.emailVerified) {
          setLoginError("Please verify your Google email address first.");
          await signOut(auth);
        }
      } else {
        setLoginError(`The email '${user.email}' is not registered as an administrator.`);
        await signOut(auth);
      }
    } catch (err: any) {
      console.error("Google login interaction cancelled or blocked", err);
      setLoginError("Google Authentication was unsuccessful.");
    }
  };

  // Safe login handling with Express JWT endpoints
  const handleAdminAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameInput, password: passwordInput })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdminToken(data.token);
        setAdminLoggedIn(true);
        setUsernameInput("");
        setPasswordInput("");
      } else {
        setLoginError(data.error || "Bad passcode parameters.");
      }
    } catch (e) {
      setLoginError("Could not connect to authentication portal.");
    }
  };

  const handleAdminLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Firebase Auth sign-out error:", e);
    }
    setAdminToken("");
    setAdminLoggedIn(false);
    setIsAdminMode(false);
  };

  // Helper scrolls consulting requests
  const triggerConsultingScroll = (servicePresetName?: string) => {
    if (servicePresetName) {
      setPreSelectedService(servicePresetName);
    }
    const target = document.getElementById("contact");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center text-white space-y-4">
        <Loader2 className="w-10 h-10 text-gold-400 animate-spin" />
        <p className="font-serif text-sm tracking-widest text-gold-300 uppercase">Kasis Interior Kolkata</p>
        <p className="text-[10px] text-neutral-400">Launching bespoke fullstack assets...</p>
      </div>
    );
  }

  const currentConfig = config || {
    phone: "+91 98040 42345",
    whatsapp: "919804042345",
    address: "Ariadaha, Shantikunj Apartment, 33 Bindhya Basini Tala Road, Near Zen Cable, Kolkata, West Bengal 700057",
    email: "kasisinterior@gmail.com",
    googleMapEmbedUrl: "",
    experienceYears: 12,
    consultationFee: "Free",
    warrantyYears: 10
  };

  return (
    <div className={`overflow-x-hidden ${darkMode ? "dark bg-navy-950 text-white" : "bg-neutral-50 text-navy-900"}`}>
      
      {/* Dynamic Header */}
      <Navbar
        config={currentConfig}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isAdmin={isAdminMode}
        setIsAdmin={setIsAdminMode}
        adminLoggedIn={adminLoggedIn}
        onAdminLogout={handleAdminLogout}
      />

      {/* ADMIN CONTROL PANEL BRANCH */}
      {isAdminMode ? (
        adminLoggedIn ? (
          <AdminPanel
            config={currentConfig}
            onRefreshConfig={loadAllBusinessData}
            projects={portfolio}
            onRefreshPortfolio={loadAllBusinessData}
            reviews={reviews}
            onRefreshReviews={loadAllBusinessData}
            blogs={blogs}
            onRefreshBlogs={loadAllBusinessData}
            onLogoutAdmin={handleAdminLogout}
            token={adminToken}
            darkMode={darkMode}
          />
        ) : (
          /* Locked gate page backdrop */
          <div className="min-h-screen pt-36 bg-navy-950 flex items-center justify-center px-4">
            <div className="w-full max-w-md p-6 md:p-8 rounded-2xl bg-navy-900/40 border border-navy-800/80 backdrop-blur-md shadow-2xl">
              <div className="text-center mb-6">
                <div className="inline-flex p-3 rounded-full bg-gold-400/10 text-gold-400 border border-gold-400/20 mb-3">
                  <Lock className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="font-serif text-xl font-bold text-white">Executive Login Portal</h3>
                <p className="text-[11px] text-[#A1B8D2] mt-1.5 uppercase tracking-wider">Access authorized for studio owners only</p>
              </div>

              {loginError && (
                <div className="mb-4 p-3 rounded-lg bg-red-600/10 border border-red-500/20 text-red-400 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleAdminAuthSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-xs text-neutral-400 font-bold uppercase tracking-wider mb-1.5">Username Name:</label>
                  <input
                    id="admin-username-input"
                    type="text"
                    required
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="Enter management username"
                    className="w-full p-2.5 rounded-lg border border-navy-800 bg-navy-950 text-white focus:border-gold-400 focus:outline-none"
                  />
                  <p className="text-[9px] text-[#555] mt-1">Hint: admin</p>
                </div>

                <div>
                  <label className="block text-xs text-neutral-400 font-bold uppercase tracking-wider mb-1.5">Secure Password/Passcode:</label>
                  <input
                    id="admin-password-input"
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter admin key"
                    className="w-full p-2.5 rounded-lg border border-navy-800 bg-navy-950 text-white focus:border-gold-400 focus:outline-none"
                  />
                  <p className="text-[9px] text-[#555] mt-1">Hint: kasis@700057</p>
                </div>

                <div className="pt-2">
                  <button
                    id="admin-login-submit"
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 rounded-xl font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 cursor-pointer shadow-lg active:scale-95"
                  >
                    Authenticate Identity
                  </button>
                </div>

                <div className="relative my-4 flex py-1 items-center">
                  <div className="flex-grow border-t border-navy-800/40"></div>
                  <span className="flex-shrink mx-3 text-[10px] text-neutral-400 uppercase tracking-widest">Or Google Account</span>
                  <div className="flex-grow border-t border-navy-800/40"></div>
                </div>

                <div>
                  <button
                    id="admin-google-login-btn"
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full py-3 bg-white hover:bg-neutral-100 text-navy-950 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all hover:scale-105 cursor-pointer shadow-lg active:scale-95 border border-neutral-200"
                  >
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.62-.62-1.07-1.37-1.21-2.62z" strokeWidth="0" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    Sign in with Google
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAdminMode(false)}
                  className="w-full text-center text-xs text-neutral-400 hover:text-white pt-2 block"
                >
                  ← Return to public website
                </button>
              </form>
            </div>
          </div>
        )
      ) : (
        /* PUBLIC ENTIRE PORTFOLIO PAGE SYSTEM */
        <main className="relative">
          
          {/* Main Hero slideshow slider */}
          <Hero config={currentConfig} darkMode={darkMode} onOpenConsultation={triggerConsultingScroll} />

          {/* About studio overview section */}
          <About config={currentConfig} darkMode={darkMode} onOpenConsultation={triggerConsultingScroll} />

          {/* Luxury core services list & dynamic budget calculator */}
          <Services darkMode={darkMode} onOpenConsultation={triggerConsultingScroll} />

          {/* Bespoke active portfolio & before/after sliders */}
          <Portfolio projects={portfolio} darkMode={darkMode} />

          {/* Google styled user-testimonials reviews manager */}
          <Reviews initialReviews={reviews} onRefreshReviews={loadAllBusinessData} darkMode={darkMode} />

          {/* Publications journal layout */}
          <Blogs blogs={blogs} darkMode={darkMode} />

          {/* Accordion FAQ sheets */}
          <FAQ darkMode={darkMode} />

          {/* Callbacks validator with Maps coordination */}
          <Contact
            config={currentConfig}
            preSelectedService={preSelectedService}
            onClearPreSelectedService={() => setPreSelectedService("")}
            darkMode={darkMode}
          />

          {/* --- BRAND FOOTER --- */}
          <footer className={`py-12 border-t transition-colors ${
            darkMode ? "bg-navy-950 border-navy-800/80 text-[#888]" : "bg-neutral-100 border-neutral-200 text-neutral-500"
          }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <h4 className="font-serif text-xl tracking-wider font-extrabold text-white gold-text-gradient">KASIS INTERIOR</h4>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-[#777] mt-1">Transforming spaces since 2014</p>
                </div>

                {/* Direct quick jumps */}
                <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
                  <a href="#about" className="hover:text-gold-300">Brand Portfolio</a>
                  <span>•</span>
                  <a href="#services" className="hover:text-gold-300">Package Estimates</a>
                  <span>•</span>
                  <a href="#portfolio" className="hover:text-gold-300">Gallery</a>
                  <span>•</span>
                  <a href="#reviews" className="hover:text-gold-300">Client Reviews</a>
                  <span>•</span>
                  <span
                    id="admin-gate-floor"
                    onClick={() => setIsAdminMode(true)}
                    className="text-gold-400 hover:underline cursor-pointer font-bold"
                  >
                    Portal Login
                  </span>
                </div>
              </div>

              <div className="border-t dark:border-navy-800/40 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-[11px] gap-2">
                <p>© {new Date().getFullYear()} Kasis Interior Kolkata. All rights reserved.</p>
                <div className="flex items-center space-x-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-semibold text-[10px]">VERIFIED KOLKATA INTERIOR SOLUTIONS</span>
                </div>
              </div>
            </div>
          </footer>

          {/* --- FLOATING CONTROLS: DESKTOP ONLY ON RIGHT SIDE --- */}
          <div className="hidden md:flex flex-col space-y-2.5 fixed bottom-10 right-6 z-45 items-end">
            
            {/* Quick directions */}
            <a
              id="fab-location"
              href="https://maps.app.goo.gl/yJbyTCEvMyVfS1UAA"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 bg-navy-950/90 text-gold-300 border border-gold-400/30 rounded-full hover:bg-gold-400 hover:text-navy-950 transition-all shadow-xl group flex items-center space-x-2"
              title="Get Directions"
            >
              <span className="max-w-0 overflow-hidden group-hover:max-w-[120px] transition-all duration-300 text-xs font-bold uppercase leading-none whitespace-nowrap">Directions</span>
              <MapPin className="w-5 h-5" />
            </a>

            {/* Quick whatsapp */}
            <a
              id="fab-whatsapp"
              href={`https://wa.me/${currentConfig.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition-all shadow-xl group flex items-center space-x-2"
              title="Chat over WhatsApp"
            >
              <span className="max-w-0 overflow-hidden group-hover:max-w-[120px] transition-all duration-300 text-xs font-bold uppercase leading-none whitespace-nowrap">WhatsApp</span>
              <MessageCircle className="w-5 h-5 shrink-0" />
            </a>

            {/* Calling button */}
            <a
              id="fab-call"
              href={`tel:${currentConfig.phone}`}
              className="p-3.5 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-navy-950 rounded-full transition-all shadow-xl group flex items-center space-x-2 border border-gold-400 scale-105 hover:scale-110"
              title="Call Us Now"
            >
              <span className="max-w-0 overflow-hidden group-hover:max-w-[120px] transition-all duration-300 text-xs font-bold uppercase leading-none whitespace-nowrap">Call +91 98040 42345</span>
              <Phone className="w-5 h-5 shrink-0 animate-bounce" />
            </a>

            {/* Return-To-Top button */}
            {showScrollTop && (
              <button
                id="fab-scroller-top"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="p-3 rounded-full bg-navy-900/60 text-gold-400 border border-navy-800 hover:bg-navy-800 transition-all cursor-pointer"
                title="Scroll To Top"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* --- FLOATING CONTROLS: MOBILE STICKY BOTTOM TOOLBAR BAR --- */}
          <div className="flex md:hidden fixed bottom-0 left-0 w-full z-45 bg-navy-950/95 backdrop-blur-md border-t border-navy-800/60 shadow-[0_-5px_20px_rgba(0,0,0,0.4)] grid grid-cols-3">
            <a
              id="mobile-sticky-call"
              href={`tel:${currentConfig.phone}`}
              className="flex flex-col items-center justify-center py-2.5 hover:text-gold-300 transition-colors border-r border-navy-800/30 text-white text-glow-gold"
            >
              <Phone className="w-5 h-5 shrink-0 mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Call Now</span>
            </a>
            <a
              id="mobile-sticky-wa"
              href={`https://wa.me/${currentConfig.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center py-2.5 bg-emerald-700/15 hover:text-emerald-400 hover:bg-emerald-700/20 text-emerald-400"
            >
              <MessageCircle className="w-5 h-5 shrink-0 mb-1 text-emerald-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider">WhatsApp</span>
            </a>
            <a
              id="mobile-sticky-loc"
              href="https://maps.app.goo.gl/yJbyTCEvMyVfS1UAA"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center py-2.5 hover:text-gold-300 text-white"
            >
              <MapPin className="w-5 h-5 shrink-0 mb-1 text-gold-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Location</span>
            </a>
          </div>

        </main>
      )}

    </div>
  );
}
