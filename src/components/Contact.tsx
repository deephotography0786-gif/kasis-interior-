import React, { useState, useEffect } from "react";
import { Phone, Mail, MapPin, MessageSquare, Send, CheckCircle, ExternalLink, ShieldCheck } from "lucide-react";
import { WebConfig } from "../types.ts";
import { createInquiry } from "../api.ts";

function getValidMapEmbedUrl(url: string | undefined, address: string): string {
  const fallbackUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address || "Ariadaha, Shantikunj Apartment, 33 Bindhya Basini Tala Road, Near Zen Cable, Kolkata, West Bengal 700057")}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  
  if (!url) {
    return fallbackUrl;
  }

  // 1. If it contains iframe tags, extract the src out of it
  const iframeSrcMatch = url.match(/src="([^"]+)"/i);
  if (iframeSrcMatch && iframeSrcMatch[1]) {
    url = iframeSrcMatch[1];
  }

  url = url.trim();

  // 2. If it is already a clean google map embed URL
  if (url.includes("google.com/maps/embed") && url.includes("pb=")) {
    return url;
  }

  // 3. Handle external maps links like maps.app.goo.gl or goo.gl/maps or google.com/maps/place
  if (url.includes("maps.app.goo.gl") || url.includes("goo.gl/maps") || url.includes("/maps/place/") || url.includes("/maps/dir/")) {
    return fallbackUrl;
  }

  // 4. If it is high-level HTTP but missing output=embed query parameter:
  if (url.startsWith("http://") || url.startsWith("https://")) {
    if (!url.includes("output=embed")) {
      const separator = url.includes("?") ? "&" : "?";
      return `${url}${separator}output=embed`;
    }
    return url;
  }

  // 5. If they just pasted some text, use it as a query for mapping
  return `https://maps.google.com/maps?q=${encodeURIComponent(url)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
}

interface ContactProps {
  config: WebConfig;
  preSelectedService?: string;
  onClearPreSelectedService?: () => void;
  onSubmitSuccess?: () => void;
  darkMode: boolean;
}

export default function Contact({
  config,
  preSelectedService = "",
  onClearPreSelectedService,
  onSubmitSuccess,
  darkMode
}: ContactProps) {
  // Form variables
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("General Design Consultancy");
  const [message, setMessage] = useState("");

  // UI state managers
  const [phoneError, setPhoneError] = useState("");
  const [success, setSuccess] = useState(false);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    if (preSelectedService) {
      setService(preSelectedService);
    }
  }, [preSelectedService]);

  const validatePhone = (val: string) => {
    // Standard Indian phone validation: E.g., 10 digits, optionally starting with +91 or 0
    const rawDigits = val.replace(/\D/g, "");
    if (rawDigits.length === 10) {
      setPhoneError("");
      return true;
    }
    setPhoneError("Please enter a valid 10-digit phone number.");
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    if (!validatePhone(phone)) return;

    setPosting(true);
    try {
      await createInquiry({
        name,
        phone,
        email,
        service,
        message: message || "callback requested"
      });
      setSuccess(true);
      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
      if (onClearPreSelectedService) onClearPreSelectedService();
      if (onSubmitSuccess) onSubmitSuccess();
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error("Inquiry submission error", err);
    } finally {
      setPosting(false);
    }
  };

  // Launch a structured, preloaded WhatsApp chat thread based on inputs
  const handleWhatsAppRedirectSubmit = () => {
    if (!name || !phone) {
      alert("Please fill your Name and Phone before clicking WhatsApp Submit!");
      return;
    }
    const textPattern = `Hello Kasis Interior Kolkata!%0A*Name*: ${name}%0A*Phone*: ${phone}%0A*Email*: ${email || "None"}%0A*Service Required*: ${service}%0A*My Message*: ${message || "I want a free space design review callback."}`;
    const uri = `https://wa.me/${config.whatsapp}?text=${textPattern}`;
    window.open(uri, "_blank");
  };

  return (
    <section
      id="contact"
      className={`py-24 transition-colors duration-500 ${
        darkMode ? "bg-navy-900 border-t border-navy-800" : "bg-neutral-50/50 border-t border-neutral-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-gold-400 block mb-3">
            GET A CALLBACK
          </span>
          <h2
            className={`font-serif text-3xl sm:text-4xl font-semibold tracking-tight ${
              darkMode ? "text-white" : "text-navy-950"
            }`}
          >
            Schedule Your Free Consultation Site Visit
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-gold-500 to-gold-300 mx-auto mt-4 rounded-full"></div>
          <p className={`mt-4 text-xs font-light max-w-lg mx-auto ${darkMode ? "text-navy-300" : "text-neutral-500"}`}>
            Our senior interior coordinator will call you back within 2 business hours to review layout templates.
          </p>
        </div>

        {/* Contact Layout Grid split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left panel: Info & Embedded map */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className={`p-6 md:p-8 rounded-2xl border ${
              darkMode ? "bg-navy-950 border-navy-800" : "bg-white border-neutral-200 shadow-sm"
            }`}>
              <h3 className={`font-serif text-lg font-bold mb-6 ${darkMode ? "text-white" : "text-navy-950"}`}>
                Corporate Office Credentials
              </h3>
              
              <div className="space-y-5">
                <div className="flex items-start space-x-3.5">
                  <div className="p-2 bg-gold-400/10 text-gold-400 rounded-lg mt-0.5">
                    <MapPin className="w-5 h-5 shrink-0" />
                  </div>
                  <div>
                    <h4 className={`text-xs uppercase tracking-wider font-bold mb-1 ${darkMode ? "text-navy-400" : "text-neutral-500"}`}>
                      Office Address:
                    </h4>
                    <p className={`text-xs md:text-sm leading-relaxed ${darkMode ? "text-navy-200" : "text-neutral-700"}`}>
                      {config.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="p-2 bg-gold-400/10 text-gold-400 rounded-lg mt-0.5">
                    <Phone className="w-5 h-5 shrink-0 animate-pulse" />
                  </div>
                  <div>
                    <h4 className={`text-xs uppercase tracking-wider font-bold mb-1 ${darkMode ? "text-navy-400" : "text-neutral-500"}`}>
                      Phone Call line:
                    </h4>
                    <a
                      id="contact-info-phone"
                      href={`tel:${config.phone}`}
                      className="text-xs md:text-sm font-bold text-gold-400 hover:underline"
                    >
                      {config.phone} (Call Now)
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="p-2 bg-gold-400/10 text-gold-400 rounded-lg mt-0.5">
                    <Mail className="w-5 h-5 shrink-0" />
                  </div>
                  <div>
                    <h4 className={`text-xs uppercase tracking-wider font-bold mb-1 ${darkMode ? "text-navy-400" : "text-neutral-500"}`}>
                      Email Coordinates:
                    </h4>
                    <a
                      id="contact-info-email"
                      href={`mailto:${config.email}`}
                      className={`text-xs md:text-sm hover:underline ${darkMode ? "text-navy-200" : "text-neutral-700"}`}
                    >
                      {config.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded maps location */}
            <div className="h-64 rounded-2xl overflow-hidden border-2 border-gold-400/30 relative group shadow-lg">
              <iframe
                title="Kasis Interior Google Map Location"
                src={getValidMapEmbedUrl(config.googleMapEmbedUrl, config.address)}
                className="w-full h-full border-0"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer"
              ></iframe>
              <a
                id="contact-map-directions"
                href="https://maps.app.goo.gl/yJbyTCEvMyVfS1UAA"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 bg-navy-950/90 text-gold-300 border border-gold-400/40 font-bold text-xs uppercase px-4 py-2 rounded-lg flex items-center space-x-1 hover:bg-gold-500 hover:text-navy-950 transition-all shadow"
              >
                <span>Get Directions</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right panel: validation Form */}
          <div className="lg:col-span-7">
            <div className={`p-6 md:p-10 rounded-2xl border h-full flex flex-col justify-between ${
              darkMode ? "bg-navy-950 border-navy-800" : "bg-white border-neutral-200 shadow-md"
            }`}>
              <div className="mb-6">
                <h3 className={`font-serif text-xl font-bold mb-1.5 ${darkMode ? "text-white" : "text-navy-950"}`}>
                  Submit Custom Estimate Inquiry
                </h3>
                <p className={`text-xs ${darkMode ? "text-navy-300" : "text-neutral-500"}`}>
                  Fill the fields below. You can also bypass direct database sync to immediately submit via WhatsApp.
                </p>
              </div>

              {success ? (
                <div className="flex-grow flex flex-col justify-center items-center text-center py-10 space-y-4">
                  <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    <CheckCircle className="w-10 h-10 animate-bounce" />
                  </div>
                  <div>
                    <h4 className="font-serif text-xl font-semibold text-emerald-500">Inquiry Captured Successfully!</h4>
                    <p className={`text-xs mt-1.5 leading-normal max-w-sm mx-auto ${darkMode ? "text-navy-300" : "text-neutral-500"}`}>
                      Our Bengal design director will get in touch with you shortly. Thank you for choosing Kasis!
                    </p>
                  </div>
                </div>
              ) : (
                <form id="lead-form" onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Name field */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                      Your Name: *
                    </label>
                    <input
                      id="contact-form-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="E.g., Amitava Banerjee"
                      className={`w-full p-2.5 rounded-lg border text-xs md:text-sm ${
                        darkMode
                          ? "bg-navy-900 border-navy-800 text-white focus:border-gold-400"
                          : "bg-neutral-50 border-neutral-200 text-navy-950 focus:border-gold-500"
                      }`}
                    />
                  </div>

                  {/* Phone and Email row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                        Phone (WhatsApp preferred): *
                      </label>
                      <input
                        id="contact-form-phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          validatePhone(e.target.value);
                        }}
                        placeholder="E.g., 98300 98300"
                        className={`w-full p-2.5 rounded-lg border text-xs md:text-sm ${
                          phoneError ? "border-red-500" : darkMode ? "border-navy-800" : "border-neutral-200"
                        } ${
                          darkMode ? "bg-navy-900 text-white focus:border-gold-400" : "bg-neutral-50 text-navy-950 focus:border-gold-500"
                        }`}
                      />
                      {phoneError && (
                        <p className="text-[10px] text-red-400 mt-1">{phoneError}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                        Email Address:
                      </label>
                      <input
                        id="contact-form-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yourname@domain.com"
                        className={`w-full p-2.5 rounded-lg border text-xs md:text-sm ${
                          darkMode
                            ? "bg-navy-900 border-navy-800 text-white focus:border-gold-400"
                            : "bg-neutral-50 border-neutral-200 text-navy-950 focus:border-gold-500"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Service dropdown options */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                      Interior Service Required:
                    </label>
                    <select
                      id="contact-form-service"
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className={`w-full p-2.5 rounded-lg border text-xs ${
                        darkMode
                          ? "bg-navy-900 border-navy-800 text-white focus:ring-gold-400"
                          : "bg-neutral-50 border-neutral-200 text-navy-950 focus:ring-gold-500"
                      }`}
                    >
                      <option value="General Design Consultancy">General Space Consulting</option>
                      <option value="Residential Interior">Complete Home Residential Interior</option>
                      <option value="Modular Kitchen">BWR Modular Kitchen Setup</option>
                      <option value="Bedroom Interior">Bedroom suite Wardrobes</option>
                      <option value="Living Room Interior">Living Lounge Wall Panels</option>
                      <option value="Custom Furniture">Bespoke Couch / Dining Seats</option>
                      <option value="Decor & False Ceilings">Gypsum Ceiling & Cove Profile Lights</option>
                      <option value="Commercial Office">High-End Office Workstations</option>
                    </select>
                  </div>

                  {/* Message Comments */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                      Tell Us About Your Space (BHK size, site address, etc.):
                    </label>
                    <textarea
                      id="contact-form-message"
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="E.g., REDESIGNING a 3BHK flat in Garia, need living room fluted backdrops, bedroom closets and Modular Kitchen package."
                      className={`w-full p-2.5 rounded-lg border text-xs resize-none leading-relaxed ${
                        darkMode
                          ? "bg-navy-900 border-navy-800 text-white focus:border-gold-400"
                          : "bg-neutral-50 border-neutral-200 text-navy-900 focus:border-gold-500"
                      }`}
                    ></textarea>
                  </div>

                  {/* Dynamic split CTA submit triggers */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
                    <button
                      id="contact-btn-submit"
                      type="submit"
                      disabled={posting}
                      className="w-full bg-navy-950 border-2 border-gold-400/80 hover:bg-gold-500 hover:text-navy-950 text-gold-300 font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg inline-flex items-center justify-center space-x-1.5"
                    >
                      <Send className="w-4 h-4 shrink-0" />
                      <span>{posting ? "Submitting..." : "Submit Inquiry"}</span>
                    </button>
                    
                    <button
                      id="contact-btn-whatsapp"
                      type="button"
                      onClick={handleWhatsAppRedirectSubmit}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg inline-flex items-center justify-center space-x-1.5"
                    >
                      <MessageSquare className="w-4 h-4 shrink-0" />
                      <span>WhatsApp Inquiry</span>
                    </button>
                  </div>

                </form>
              )}

              {/* Verified Trust mark */}
              <div className="mt-6 border-t border-navy-800/20 dark:border-navy-800/40 pt-4 flex items-center justify-center space-x-2.5 text-center">
                <ShieldCheck className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                <span className={`text-[10px] uppercase font-bold tracking-widest ${darkMode ? "text-navy-400" : "text-neutral-500"}`}>
                  Kasis 100% Privacy Secure Lead Vault
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
