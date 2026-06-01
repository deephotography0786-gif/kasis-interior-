import { useState, useEffect } from "react";
import { Phone, MessageCircle, Menu, X, Sun, Moon, Sparkles, LogIn, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { WebConfig } from "../types.ts";

interface NavbarProps {
  config: WebConfig;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  adminLoggedIn: boolean;
  onAdminLogout: () => void;
}

export default function Navbar({
  config,
  darkMode,
  setDarkMode,
  isAdmin,
  setIsAdmin,
  adminLoggedIn,
  onAdminLogout
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About Us", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "Reviews", href: "#reviews" },
    { name: "Blog", href: "#blog" },
    { name: "FAQ", href: "#faq" },
    { name: "Contact", href: "#contact" }
  ];

  return (
    <nav
      id="main-nav"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? darkMode
            ? "bg-navy-950/85 backdrop-blur-md border-b border-navy-800/60 shadow-[0_10px_30px_rgb(0,0,0,0.3)] py-3"
            : "bg-white/85 backdrop-blur-md border-b border-navy-100 shadow-[0_10px_30px_rgba(0,0,0,0.05)] py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Brand Title */}
          <a href="#home" className="flex items-center space-x-2 group">
            <div className="relative">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-tr from-gold-500 via-gold-200 to-gold-600 flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
                <span className="font-serif font-black text-navy-950 text-xl">K</span>
              </div>
              <div className="absolute -inset-1 rounded-lg bg-gold-400 filter blur-sm opacity-30 group-hover:opacity-75 transition-opacity duration-300"></div>
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-wider block leading-none gold-text-gradient group-hover:text-glow-gold transition-all duration-300">
                KASIS
              </span>
              <span className="font-sans text-[10px] tracking-[0.25em] font-medium block text-gold-300 transition-colors duration-300 group-hover:text-gold-200 uppercase">
                Interior & Furniture
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {isAdmin ? (
              <button
                id="btn-return-client"
                onClick={() => setIsAdmin(false)}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-md border border-gold-400 bg-gold-400/10 text-gold-300 hover:bg-gold-400 hover:text-navy-950 transition-all duration-300 flex items-center space-x-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>Return to Website</span>
              </button>
            ) : (
              navLinks.map((link) => (
                <a
                  id={`nav-link-${link.name.toLowerCase().replace(/\s+/g, "-")}`}
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 text-sm font-medium rounded-md tracking-wide uppercase text-[12px] transition-all duration-300 ${
                    darkMode
                      ? "text-navy-200 hover:text-gold-300"
                      : "text-navy-800 hover:text-gold-500"
                  }`}
                >
                  {link.name}
                </a>
              ))
            )}
          </div>

          {/* Toolbar Utilities */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Theme Switcher Toggle */}
            <button
              id="theme-toggler"
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg border transition-all duration-300 ${
                darkMode
                  ? "bg-navy-900 border-navy-800 text-gold-300 hover:bg-navy-800"
                  : "bg-navy-50 border-navy-200 text-gold-600 hover:bg-navy-100"
              }`}
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* Admin Toggle Shortcut */}
            {adminLoggedIn ? (
              <button
                id="btn-quick-admin-toggle"
                onClick={() => setIsAdmin(!isAdmin)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-300 ${
                  isAdmin
                    ? "bg-gold-400 text-navy-950 border-gold-400"
                    : "bg-navy-900/60 text-gold-300 border-gold-400/40 hover:bg-gold-400/20"
                }`}
              >
                <span>Admin Panel</span> {isAdmin ? <LogOut className="w-3.5 h-3.5" /> : <LogIn className="w-3.5 h-3.5" />}
              </button>
            ) : (
              <a
                id="btn-admin-gate"
                href="#admin-floor"
                onClick={() => setIsAdmin(true)}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg border text-xs font-semibold text-navy-300 hover:text-gold-300 transition-all duration-300 ${
                  darkMode ? "border-navy-800" : "border-navy-200"
                }`}
              >
                <span>Portal Setup</span>
              </a>
            )}

            {/* Instant Phone Call Callout */}
            <a
              id="cta-nav-call"
              href={`tel:${config.phone.replace(/\s+/g, "")}`}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-navy-950 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 shadow-md shadow-gold-500/10 cursor-pointer hover:shadow-lg hover:shadow-gold-500/20 border border-gold-400 hover:scale-105"
            >
              <Phone className="w-4 w-4 animate-bounce" />
              <span>Call +91 98040 42345</span>
            </a>

            {/* Quick WhatsApp Inquiry */}
            <a
              id="cta-nav-whatsapp"
              href={`https://wa.me/${config.whatsapp}?text=Hello%20Kasis%20Interior%20Team!%20I'm%20visiting%20your%20website%20and%20interested%20in%20a%20luxury%20design%20consultation.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center p-2 rounded-lg bg-emerald-600/10 text-emerald-500 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white transition-all duration-300"
            >
              <MessageCircle className="w-4.5 h-4.5" />
            </a>
          </div>

          {/* Mobile responsive buttons */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              id="theme-toggler-mobile"
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-md ${
                darkMode ? "text-gold-300 bg-navy-900" : "text-gold-500 bg-navy-50"
              }`}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              id="mobile-drawer-trigger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-md ${
                darkMode ? "text-navy-200 hover:text-white bg-navy-900" : "text-navy-700 hover:text-navy-950 bg-navy-100"
              }`}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Dropdown Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`lg:hidden border-t ${
              darkMode ? "bg-navy-950 border-navy-800" : "bg-white border-navy-100"
            }`}
          >
            <div className="px-4 pt-3 pb-6 space-y-2">
              {isAdmin ? (
                <button
                  id="mobile-btn-return-client"
                  onClick={() => {
                    setIsAdmin(false);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center px-4 py-2.5 my-2 text-xs font-semibold uppercase tracking-wider rounded-md border border-gold-400 bg-gold-400/10 text-gold-300 hover:bg-gold-400 hover:text-navy-950"
                >
                  Return to Website View
                </button>
              ) : (
                navLinks.map((link) => (
                  <a
                    id={`mobile-nav-link-${link.name.toLowerCase().replace(/\s+/g, "-")}`}
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2.5 rounded-md text-base font-semibold ${
                      darkMode
                        ? "text-navy-200 hover:bg-navy-900 hover:text-gold-300"
                        : "text-navy-800 hover:bg-navy-50 hover:text-gold-500"
                    }`}
                  >
                    {link.name}
                  </a>
                ))
              )}

              {/* Admin shortcut in drawer */}
              {adminLoggedIn ? (
                <button
                  id="mobile-btn-admin"
                  onClick={() => {
                    setIsAdmin(!isAdmin);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 font-semibold text-gold-300 flex items-center justify-between"
                >
                  <span>Admin Interface Panel</span>
                  <Sparkles className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <a
                  id="mobile-btn-portal"
                  href="#admin-floor"
                  onClick={() => {
                    setIsAdmin(true);
                    setMobileMenuOpen(false);
                  }}
                  className="block px-3 py-2.5 text-base font-medium text-navy-400 hover:text-gold-300 border-t border-navy-800 mt-2"
                >
                  Manage/Portal Login
                </a>
              )}

              {/* Quick Callback CTAs in menu */}
              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-navy-800/20">
                <a
                  id="mobile-nav-call"
                  href={`tel:${config.phone}`}
                  className="flex items-center justify-center space-x-1 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 py-3 rounded-lg font-bold text-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Us</span>
                </a>
                <a
                  id="mobile-nav-wa"
                  href={`https://wa.me/${config.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-1 bg-emerald-600 text-white py-3 rounded-lg font-bold text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
