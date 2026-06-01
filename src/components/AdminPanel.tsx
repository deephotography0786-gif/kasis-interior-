import React, { useState, useEffect } from "react";
import { Project, Review, Inquiry, Blog, WebConfig } from "../types.ts";
import { motion, AnimatePresence } from "motion/react";
import {
  fetchInquiries,
  updateInquiry,
  deleteInquiry,
  createProject,
  updateProject,
  deleteProject,
  createReview,
  updateReview,
  deleteReview,
  updateConfig,
  createBlog,
  updateBlog,
  deleteBlog
} from "../api.ts";
import {
  TrendingUp,
  MessageSquare,
  Sparkles,
  Award,
  Settings,
  X,
  Plus,
  Trash2,
  Check,
  Edit,
  Power,
  Lock,
  Upload,
  Calendar,
  Layers,
  MapPin,
  Clock,
  Eye,
  FileText,
  Star
} from "lucide-react";

interface AdminPanelProps {
  config: WebConfig;
  onRefreshConfig: () => void;
  projects: Project[];
  onRefreshPortfolio: () => void;
  reviews: Review[];
  onRefreshReviews: () => void;
  blogs: Blog[];
  onRefreshBlogs: () => void;
  onLogoutAdmin: () => void;
  token: string;
  darkMode: boolean;
}

export default function AdminPanel({
  config,
  onRefreshConfig,
  projects,
  onRefreshPortfolio,
  reviews,
  onRefreshReviews,
  blogs,
  onRefreshBlogs,
  onLogoutAdmin,
  token,
  darkMode
}: AdminPanelProps) {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"inquiries" | "portfolio" | "reviews" | "blogs" | "config">("inquiries");

  // Inquiries collection state
  const [inquiriesList, setInquiriesList] = useState<Inquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [remarksInput, setRemarksInput] = useState("");
  const [loadingInquiries, setLoadingInquiries] = useState(false);

  // Form toggles
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showBlogModal, setShowBlogModal] = useState(false);

  // Editing pointers
  const [editProjectItem, setEditProjectItem] = useState<Project | null>(null);
  const [editReviewItem, setEditReviewItem] = useState<Review | null>(null);
  const [editBlogItem, setEditBlogItem] = useState<Blog | null>(null);

  // Project Form State
  const [projTitle, setProjTitle] = useState("");
  const [projCategory, setProjCategory] = useState<any>("bedroom");
  const [projImage, setProjImage] = useState("");
  const [projDescription, setProjDescription] = useState("");
  const [projBeforeImage, setProjBeforeImage] = useState("");
  const [projClientName, setProjClientName] = useState("");
  const [projBudget, setProjBudget] = useState("");
  const [projLocation, setProjLocation] = useState("");

  // Review Form State
  const [revClientName, setRevClientName] = useState("");
  const [revRating, setRevRating] = useState(5);
  const [revReviewText, setRevReviewText] = useState("");
  const [revDesignation, setRevDesignation] = useState("");
  const [revSource, setRevSource] = useState<"Google Reviews" | "Direct">("Direct");

  // Blog Form State
  const [blgTitle, setBlgTitle] = useState("");
  const [blgExcerpt, setBlgExcerpt] = useState("");
  const [blgContent, setBlgContent] = useState("");
  const [blgImage, setBlgImage] = useState("");
  const [blgAuthor, setBlgAuthor] = useState("");

  // Global Config form fields
  const [cfgPhone, setCfgPhone] = useState(config.phone);
  const [cfgWhatsapp, setCfgWhatsapp] = useState(config.whatsapp);
  const [cfgAddress, setCfgAddress] = useState(config.address);
  const [cfgEmail, setCfgEmail] = useState(config.email);
  const [cfgMapUrl, setCfgMapUrl] = useState(config.googleMapEmbedUrl);
  const [cfgExpYears, setCfgExpYears] = useState(config.experienceYears);
  const [cfgConsultFee, setCfgConsultFee] = useState(config.consultationFee);
  const [cfgWarranty, setCfgWarranty] = useState(config.warrantyYears);

  useEffect(() => {
    loadInquiries();
  }, [token]);

  const loadInquiries = async () => {
    if (!token) return;
    setLoadingInquiries(true);
    try {
      const data = await fetchInquiries(token);
      setInquiriesList(data);
    } catch (e) {
      console.error("Error loading inquiries", e);
    } finally {
      setLoadingInquiries(false);
    }
  };

  // Inquiry update methods
  const handleInquiryStatusChange = async (id: string, status: "new" | "contacted" | "completed") => {
    try {
      await updateInquiry(id, { status }, token);
      loadInquiries();
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry((prev) => prev ? { ...prev, status } : null);
      }
    } catch (e) {
      console.error("Failed status patch", e);
    }
  };

  const handleSaveInquiryRemarks = async (id: string) => {
    try {
      await updateInquiry(id, { remarks: remarksInput }, token);
      loadInquiries();
      setSelectedInquiry((prev) => prev ? { ...prev, remarks: remarksInput } : null);
      alert("Remarks updated successfully.");
    } catch (e) {
      console.error("Failed status remarks patch", e);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this customer inquiry permanently?")) return;
    try {
      await deleteInquiry(id, token);
      loadInquiries();
      setSelectedInquiry(null);
    } catch (e) {
      console.error("Inquiry deletion failed", e);
    }
  };

  // Image upload base64 converter helper
  const handleImageUploadReader = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setter(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Create or Update Projects
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle || !projCategory || !projImage) {
      alert("Please provide at least a title, category, and an image URL/File upload.");
      return;
    }
    const payload = {
      title: projTitle,
      category: projCategory,
      image: projImage,
      description: projDescription,
      beforeImage: projBeforeImage,
      clientName: projClientName || "Private Resident",
      budget: projBudget || "Custom Core",
      location: projLocation || "Kolkata"
    };

    try {
      if (editProjectItem) {
        await updateProject(editProjectItem.id, payload, token);
      } else {
        await createProject(payload);
      }
      onRefreshPortfolio();
      handleCloseProjectModal();
    } catch (err) {
      console.error("Project submission error", err);
    }
  };

  const handleEditProjectClick = (proj: Project) => {
    setEditProjectItem(proj);
    setProjTitle(proj.title);
    setProjCategory(proj.category);
    setProjImage(proj.image);
    setProjDescription(proj.description);
    setProjBeforeImage(proj.beforeImage || "");
    setProjClientName(proj.clientName || "");
    setProjBudget(proj.budget || "");
    setProjLocation(proj.location || "");
    setShowProjectModal(true);
  };

  const handleCloseProjectModal = () => {
    setEditProjectItem(null);
    setProjTitle("");
    setProjImage("");
    setProjDescription("");
    setProjBeforeImage("");
    setProjClientName("");
    setProjBudget("");
    setProjLocation("");
    setShowProjectModal(false);
  };

  const handleDeleteProjectClick = async (id: string) => {
    if (!window.confirm("Delete this portfolio project design?")) return;
    try {
      await deleteProject(id, token);
      onRefreshPortfolio();
    } catch (err) {
      console.error("Failed deleting index", err);
    }
  };

  // Create or Update Reviews
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revClientName || !revReviewText) return;
    const payload = {
      clientName: revClientName,
      rating: revRating,
      reviewText: revReviewText,
      designation: revDesignation || "Kolkata Client",
      source: revSource
    };

    try {
      if (editReviewItem) {
        await updateReview(editReviewItem.id, payload, token);
      } else {
        await createReview(payload);
      }
      onRefreshReviews();
      handleCloseReviewModal();
    } catch (err) {
      console.error("Review submission error", err);
    }
  };

  const handleEditReviewClick = (rev: Review) => {
    setEditReviewItem(rev);
    setRevClientName(rev.clientName);
    setRevRating(rev.rating);
    setRevReviewText(rev.reviewText);
    setRevDesignation(rev.designation || "");
    setRevSource(rev.source);
    setShowReviewModal(true);
  };

  const handleCloseReviewModal = () => {
    setEditReviewItem(null);
    setRevClientName("");
    setRevRating(5);
    setRevReviewText("");
    setRevDesignation("");
    setRevSource("Direct");
    setShowReviewModal(false);
  };

  const handleDeleteReviewClick = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this testmionial?")) return;
    try {
      await deleteReview(id, token);
      onRefreshReviews();
    } catch (err) {
      console.error("Review deletion error", err);
    }
  };

  // Create or Update Blogs
  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blgTitle || !blgContent) {
      alert("Missing Title or Body!");
      return;
    }
    const payload = {
      title: blgTitle,
      excerpt: blgExcerpt || "Luxury interior design review.",
      content: blgContent,
      image: blgImage || "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80",
      author: blgAuthor || "Lead Architect"
    };

    try {
      if (editBlogItem) {
        await updateBlog(editBlogItem.id, payload, token);
      } else {
        await createBlog(payload, token);
      }
      onRefreshBlogs();
      handleCloseBlogModal();
    } catch (err) {
      console.error("Blog submission error", err);
    }
  };

  const handleEditBlogClick = (b: Blog) => {
    setEditBlogItem(b);
    setBlgTitle(b.title);
    setBlgExcerpt(b.excerpt);
    setBlgContent(b.content);
    setBlgImage(b.image);
    setBlgAuthor(b.author);
    setShowBlogModal(true);
  };

  const handleCloseBlogModal = () => {
    setEditBlogItem(null);
    setBlgTitle("");
    setBlgExcerpt("");
    setBlgContent("");
    setBlgImage("");
    setBlgAuthor("");
    setShowBlogModal(false);
  };

  const handleDeleteBlogClick = async (id: string) => {
    if (!window.confirm("Do you want to delete this publication?")) return;
    try {
      await deleteBlog(id, token);
      onRefreshBlogs();
    } catch (err) {
      console.error("Blog removal error", err);
    }
  };

  // Global Config Submit
  const handleGlobalConfigSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateConfig(
        {
          phone: cfgPhone,
          whatsapp: cfgWhatsapp,
          address: cfgAddress,
          email: cfgEmail,
          googleMapEmbedUrl: cfgMapUrl,
          experienceYears: Number(cfgExpYears),
          consultationFee: cfgConsultFee,
          warrantyYears: Number(cfgWarranty)
        },
        token
      );
      onRefreshConfig();
      alert("Business brand details updated successfully across checkout panels!");
    } catch (err) {
      console.error("Configuration updates failed", err);
    }
  };

  // Metric summaries calculations
  const pendingInquiriesCount = inquiriesList.filter((i) => i.status === "new").length;
  const contactedInquiriesCount = inquiriesList.filter((i) => i.status === "contacted").length;
  const completedInquiriesCount = inquiriesList.filter((i) => i.status === "completed").length;

  return (
    <div
      id="admin-dashboard-container"
      className={`min-h-screen pt-24 pb-16 transition-colors duration-500 ${
        darkMode ? "bg-navy-950 text-white" : "bg-neutral-50 text-navy-950"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header summary panel */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b pb-6 mb-8 border-navy-800/10 dark:border-navy-800/40">
          <div>
            <div className="flex items-center space-x-2 text-gold-400 font-mono text-[11px] uppercase font-bold tracking-wider mb-1">
              <Lock className="w-3.5 h-3.5" />
              <span>Secure Executive Control center</span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-extrabold tracking-tight">
              Kasis Interior Admin Dashboard
            </h2>
          </div>

          <button
            id="admin-logout-trigger"
            onClick={onLogoutAdmin}
            className="mt-4 md:mt-0 px-4.5 py-2 rounded-xl bg-red-600/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all text-xs font-bold uppercase tracking-wider flex items-center space-x-1"
          >
            <Power className="w-4 h-4" />
            <span>Power Logout Session</span>
          </button>
        </div>

        {/* Bento analytical overview cards row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className={`p-4 rounded-xl border ${darkMode ? "bg-navy-900 border-navy-800" : "bg-white border-neutral-200"}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? "text-navy-400" : "text-neutral-500"}`}>
                Total Leads
              </span>
              <MessageSquare className="w-4.5 h-4.5 text-gold-400" />
            </div>
            <p className="text-2xl font-extrabold font-mono">{inquiriesList.length}</p>
            <span className="text-[9px] text-[#22c55e] font-bold">● {pendingInquiriesCount} New Callbacks pending</span>
          </div>

          <div className={`p-4 rounded-xl border ${darkMode ? "bg-navy-900 border-navy-800" : "bg-white border-neutral-200"}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? "text-navy-400" : "text-neutral-500"}`}>
                Studio Designs
              </span>
              <Layers className="w-4.5 h-4.5 text-gold-400" />
            </div>
            <p className="text-2xl font-extrabold font-mono">{projects.length}</p>
            <span className="text-[9px] text-gold-400 font-bold">Dynamic Portfolio assets</span>
          </div>

          <div className={`p-4 rounded-xl border ${darkMode ? "bg-navy-900 border-navy-800" : "bg-white border-neutral-200"}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? "text-navy-400" : "text-neutral-500"}`}>
                Reviews Active
              </span>
              <Award className="w-4.5 h-4.5 text-gold-400" />
            </div>
            <p className="text-2xl font-extrabold font-mono">{reviews.length}</p>
            <span className="text-[9px] text-emerald-500 font-bold">⭐ 4.9 Stars Average</span>
          </div>

          <div className={`p-4 rounded-xl border ${darkMode ? "bg-navy-900 border-navy-800" : "bg-white border-neutral-200"}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? "text-navy-400" : "text-neutral-500"}`}>
                Journal posts
              </span>
              <FileText className="w-4.5 h-4.5 text-gold-400" />
            </div>
            <p className="text-2xl font-extrabold font-mono">{blogs.length}</p>
            <span className="text-[9px] text-[#a1b8d2] font-mono">Blogs catalog</span>
          </div>
        </div>

        {/* Dynamic sub navigation tabs row */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-navy-800/10 dark:border-navy-800/40 pb-4 mb-8">
          {[
            { id: "inquiries", label: "Leads/Inquiries", count: pendingInquiriesCount },
            { id: "portfolio", label: "Project Gallery", count: null },
            { id: "reviews", label: "Client Reviews", count: null },
            { id: "blogs", label: "Blog Journal", count: null },
            { id: "config", label: "Site brand Setup", count: null }
          ].map((tab) => (
            <button
              id={`admin-tab-nav-${tab.id}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center space-x-1.5 transition-all ${
                activeTab === tab.id
                  ? "bg-navy-950 text-gold-300 border border-gold-400 font-extrabold"
                  : darkMode
                  ? "bg-navy-900 text-navy-300 border border-navy-800 hover:border-navy-700 hover:text-white"
                  : "bg-white text-navy-800 border border-neutral-200 hover:border-neutral-300"
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== null && tab.count > 0 && (
                <span className="h-4.5 min-w-4.5 px-1 py-0.5 rounded-full bg-gold-400 text-navy-950 text-[10px] flex items-center justify-center font-black">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB PANELS PORTAL RENDER CORE */}

        {/* --- 1. INQUIRIES MANAGEMENT LAYER --- */}
        {activeTab === "inquiries" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
            {/* List side */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="font-serif text-lg font-bold mb-4">Inbound Consultation Leads</h3>
              
              {loadingInquiries ? (
                <p className="text-xs text-neutral-400">Syncing live inquiries...</p>
              ) : inquiriesList.length === 0 ? (
                <div className={`p-8 rounded-xl text-center border ${darkMode ? "bg-navy-900 border-navy-800" : "bg-white border-neutral-200"}`}>
                  <p className="text-xs font-light text-neutral-400">Zero submission leads captured yet!</p>
                </div>
              ) : (
                inquiriesList.map((inq) => (
                  <div
                    key={inq.id}
                    onClick={() => {
                      setSelectedInquiry(inq);
                      setRemarksInput(inq.remarks || "");
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedInquiry?.id === inq.id
                        ? "border-gold-400 bg-gold-400/5 shadow"
                        : darkMode
                        ? "bg-navy-900 border-navy-800 hover:border-navy-700"
                        : "bg-white border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-serif text-sm font-bold text-glow-gold hover:underline">
                        {inq.name}
                      </span>
                      {/* Status indicator badge */}
                      <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-extrabold leading-none ${
                        inq.status === "new"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : inq.status === "contacted"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          : "bg-neutral-500/10 text-neutral-400 border border-neutral-300/20"
                      }`}>
                        {inq.status}
                      </span>
                    </div>

                    <p className="text-[11px] font-mono text-gold-400 leading-none mb-2">Requested: {inq.service}</p>
                    <p className={`text-xs truncate ${darkMode ? "text-navy-300" : "text-neutral-500"}`}>{inq.message}</p>
                  </div>
                ))
              )}
            </div>

            {/* Complete lead details review card */}
            <div className="lg:col-span-5">
              {selectedInquiry ? (
                <div className={`p-6 rounded-2xl border sticky top-28 ${
                  darkMode ? "bg-navy-900 border-navy-800" : "bg-white border-neutral-200 shadow-md"
                }`}>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-serif text-lg font-bold">{selectedInquiry.name}</h3>
                      <p className="text-[10px] text-neutral-400 mt-1 font-mono">Submit Timestamp: {new Date(selectedInquiry.timestamp).toLocaleString()}</p>
                    </div>
                    <button
                      id="lead-card-del"
                      onClick={() => handleDeleteInquiry(selectedInquiry.id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-red-500/25 shrink-0"
                      title="Decline/Delete Lead"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Info table list */}
                  <div className="space-y-4 mb-6 text-xs leading-normal">
                    <div className="grid grid-cols-12 border-b dark:border-navy-800/60 pb-2.5">
                      <span className="col-span-4 font-semibold text-neutral-400 uppercase tracking-wider text-[10px]">Phone Number:</span>
                      <a href={`tel:${selectedInquiry.phone}`} className="col-span-8 font-bold font-mono text-gold-300 hover:underline">
                        {selectedInquiry.phone}
                      </a>
                    </div>
                    <div className="grid grid-cols-12 border-b dark:border-navy-800/60 pb-2.5">
                      <span className="col-span-4 font-semibold text-neutral-400 uppercase tracking-wider text-[10px]">Email Inbox:</span>
                      <a href={`mailto:${selectedInquiry.email}`} className={`col-span-8 truncate hover:underline ${darkMode ? "text-navy-200" : "text-navy-950"}`}>
                        {selectedInquiry.email || "No email left"}
                      </a>
                    </div>
                    <div className="grid grid-cols-12 border-b dark:border-navy-800/60 pb-2.5">
                      <span className="col-span-4 font-semibold text-neutral-400 uppercase tracking-wider text-[10px]">Target Service:</span>
                      <span className={`col-span-8 font-extrabold ${darkMode ? "text-white" : "text-navy-950"}`}>{selectedInquiry.service}</span>
                    </div>
                    <div className="border-b dark:border-navy-800/60 pb-3">
                      <span className="block font-semibold text-neutral-400 uppercase tracking-wider text-[10px] mb-1">Message Comment:</span>
                      <p className={`p-3 rounded-lg text-xs leading-relaxed ${darkMode ? "bg-navy-950 text-navy-200" : "bg-neutral-50 text-neutral-600"}`}>
                        "{selectedInquiry.message}"
                      </p>
                    </div>
                  </div>

                  {/* Actions & Internal notes remarks */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] mb-2">Change Lead Status:</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: "new", val: "New" },
                          { id: "contacted", val: "Contacted" },
                          { id: "completed", val: "Completed" }
                        ].map((btn) => (
                          <button
                            id={`lead-status-btn-${btn.id}`}
                            key={btn.id}
                            onClick={() => handleInquiryStatusChange(selectedInquiry.id, btn.id as any)}
                            className={`py-1.5 text-xs rounded font-bold uppercase transition-all ${
                              selectedInquiry.status === btn.id
                                ? "bg-gold-400 text-navy-950 border-2 border-gold-400 font-extrabold"
                                : darkMode
                                ? "bg-navy-950 border border-navy-800 text-navy-400"
                                : "bg-neutral-50 border border-neutral-200 text-neutral-600"
                            }`}
                          >
                            {btn.val}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="border-t dark:border-navy-800/60 pt-4 mt-2">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1.5">Internal Designer Remarks:</label>
                      <textarea
                        id="lead-remarks-input"
                        rows={3}
                        value={remarksInput}
                        onChange={(e) => setRemarksInput(e.target.value)}
                        placeholder="E.g., Sent kitchen blueprints over WhatsApp on May 30th. Scheduled site visit on June 2nd."
                        className={`w-full p-2 rounded text-xs leading-relaxed resize-none ${
                          darkMode ? "bg-navy-950 border-navy-800 text-white" : "bg-neutral-50 border-neutral-200 text-navy-900"
                        }`}
                      ></textarea>
                      <button
                        id="lead-remarks-save"
                        onClick={() => handleSaveInquiryRemarks(selectedInquiry.id)}
                        className="mt-2 w-full py-2 rounded-lg bg-navy-950 text-xs font-bold uppercase tracking-wider text-gold-400 border border-navy-800 hover:text-white transition-all cursor-pointer"
                      >
                        Save Remarks/Notes
                      </button>
                    </div>
                  </div>

                </div>
              ) : (
                <div className={`p-8 text-center rounded-2xl border ${darkMode ? "bg-navy-900 border-navy-800 text-neutral-400" : "bg-white border-neutral-200 text-neutral-500 shadow-sm"}`}>
                  <span className="block text-2xl font-serif mb-2">🔍</span>
                  <p className="text-xs">Select any customer lead from the list on the left to edit statuses, add details, or delete.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- 2. MANAGE PORTFOLIO LOGICS --- */}
        {activeTab === "portfolio" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold">Manage Showcase Portfolio Projects</h3>
              <button
                id="admin-btn-add-project"
                onClick={() => {
                  setEditProjectItem(null);
                  setShowProjectModal(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center space-x-1 cursor-pointer"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span>Add Project Design</span>
              </button>
            </div>

            {/* List Table of Projects */}
            <div className={`overflow-x-auto rounded-xl border ${darkMode ? "bg-navy-900 border-navy-800" : "bg-white border-neutral-200"}`}>
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className={`uppercase tracking-wider font-extrabold text-[10px] ${darkMode ? "bg-navy-950 text-navy-400" : "bg-neutral-100 text-neutral-500"}`}>
                    <th className="p-4">Visual Panel</th>
                    <th className="p-4">Project Core</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Budget Spec</th>
                    <th className="p-4">Client Representative</th>
                    <th className="p-4 text-center">Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-navy-800/40">
                  {projects.map((proj) => (
                    <tr key={proj.id} className={darkMode ? "hover:bg-navy-950/20" : "hover:bg-neutral-50/50"}>
                      <td className="p-4">
                        <img src={proj.image} alt="" className="h-12 w-16 object-cover rounded border border-navy-800/45 shrink-0" />
                      </td>
                      <td className="p-4">
                        <div className="font-serif font-bold text-sm leading-tight">{proj.title}</div>
                        <div className="text-[10px] mt-1 text-neutral-400 flex items-center"><MapPin className="w-3 h-3 mr-0.5" />{proj.location || "Kolkata"}</div>
                      </td>
                      <td className="p-4 uppercase tracking-widest text-[#D4AF37] text-[10px] font-bold">{proj.category}</td>
                      <td className="p-4 font-mono font-bold text-gold-300 text-xs">{proj.budget || "Custom"}</td>
                      <td className="p-4 text-neutral-400">{proj.clientName || "Private"}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            id={`proj-edit-click-${proj.id}`}
                            onClick={() => handleEditProjectClick(proj)}
                            className="p-1.5 text-gold-400 hover:bg-gold-400/10 rounded-lg transition-all"
                            title="Edit project details"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            id={`proj-del-click-${proj.id}`}
                            onClick={() => handleDeleteProjectClick(proj.id)}
                            className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                            title="Delete project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Form Project Modal */}
            <AnimatePresence>
              {showProjectModal && (
                <div className="fixed inset-0 z-105 flex items-center justify-center p-4 bg-navy-950/90 backdrop-blur-sm overflow-y-auto">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`w-full max-w-2xl rounded-2xl overflow-hidden border p-6 md:p-8 max-h-[90vh] overflow-y-auto ${
                      darkMode ? "bg-navy-950 border-navy-800 text-white" : "bg-white border-neutral-200 text-navy-950 shadow-2xl"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-serif text-xl font-bold">{editProjectItem ? "Edit Project Blueprint" : "Upload New Design Project"}</h3>
                      <button onClick={handleCloseProjectModal} className="p-1.5 rounded-full text-neutral-400">✕</button>
                    </div>

                    <form onSubmit={handleProjectSubmit} className="space-y-4">
                      {/* Title & Category Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Project Title: *</label>
                          <input
                            id="pf-title"
                            type="text"
                            required
                            value={projTitle}
                            onChange={(e) => setProjTitle(e.target.value)}
                            placeholder="E.g., Premium Royal Bedroom design"
                            className={`w-full p-2.5 rounded-lg border text-xs ${
                              darkMode ? "bg-navy-900 border-navy-800 text-white" : "bg-neutral-50 border-neutral-200 text-navy-900"
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Project Category: *</label>
                          <select
                            id="pf-category"
                            value={projCategory}
                            onChange={(e) => setProjCategory(e.target.value as any)}
                            className={`w-full p-2.5 rounded-lg border text-xs ${
                              darkMode ? "bg-navy-900 border-navy-800 text-white" : "bg-neutral-50 border-neutral-200 text-navy-950"
                            }`}
                          >
                            <option value="bedroom">Bedroom</option>
                            <option value="living">Living Room</option>
                            <option value="kitchen">Modular Kitchen</option>
                            <option value="office">Office Interior</option>
                            <option value="furniture">Furniture</option>
                            <option value="dining">Dining Area</option>
                          </select>
                        </div>
                      </div>

                      {/* Image Upload Row (File inputs AND manual URL address) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border dark:border-navy-800 rounded-xl bg-navy-950/40">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-gold-400">Main Design Photo Upload: *</label>
                          <label className="flex flex-col items-center justify-center p-3 border-2 border-dashed dark:border-navy-800 hover:border-gold-400 rounded-lg cursor-pointer text-center bg-navy-900/60 select-none">
                            <Upload className="w-5 h-5 text-gold-400 mb-1.5 shrink-0" />
                            <span className="text-[10px] text-neutral-400 uppercase font-black uppercase tracking-wider">Choose File</span>
                            <span className="text-[9px] text-[#888]">JPEG/PNG up to 10MB</span>
                            <input
                              id="pf-file-upload"
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUploadReader(e, setProjImage)}
                              className="hidden"
                            />
                          </label>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider mb-2 font-bold text-neutral-400">Or Paste Image URL Address:</label>
                          <input
                            id="pf-image-url"
                            type="text"
                            value={projImage.startsWith("data:") ? "" : projImage}
                            onChange={(e) => setProjImage(e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                            className={`w-full p-2.5 rounded-lg border text-[10px] ${
                              darkMode ? "bg-navy-900 border-navy-800 text-white" : "bg-neutral-50 border-neutral-200 text-navy-950"
                            }`}
                          />
                        </div>
                        
                        {/* Live upload preview box */}
                        {projImage && (
                          <div className="col-span-2 flex items-center space-x-3 pt-2">
                            <img src={projImage} alt="Preview" className="h-[75px] w-[100px] object-cover rounded border border-gold-400" />
                            <span className="text-[10px] text-emerald-400 font-serif leading-normal uppercase font-bold">Image preloaded successfully!</span>
                          </div>
                        )}
                      </div>

                      {/* Before Transform Image Upload (Optional) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border dark:border-navy-800 rounded-xl bg-navy-950/20">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-widest text-[#a1b8d2] mb-1.5">(Optional) Before Area File:</label>
                          <label className="flex items-center justify-center space-x-2 py-2 border rounded-lg cursor-pointer bg-navy-900/40 select-none">
                            <Upload className="w-3.5 h-3.5 text-[#555] shrink-0" />
                            <span className="text-[9.5px] text-[#999] uppercase font-bold text-center">Before File Upload</span>
                            <input
                              id="pf-before-upload"
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUploadReader(e, setProjBeforeImage)}
                              className="hidden"
                            />
                          </label>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 shrink-0 text-neutral-400">Or Before Image Address URL:</label>
                          <input
                            id="pf-before-url"
                            type="text"
                            value={projBeforeImage.startsWith("data:") ? "" : projBeforeImage}
                            onChange={(e) => setProjBeforeImage(e.target.value)}
                            placeholder="Paste before-image URL"
                            className={`w-full p-2 rounded border text-[10px] ${
                              darkMode ? "bg-navy-900 border-navy-800 text-white" : "bg-neutral-50 border-neutral-200 text-navy-950"
                            }`}
                          />
                        </div>
                        {projBeforeImage && (
                          <div className="col-span-2 flex items-center space-x-2 pt-1 font-mono text-[9px] text-[#A1B8D2]">
                            <img src={projBeforeImage} alt="Before preview" className="h-6 w-9 object-cover rounded" />
                            <span>Before area photo preloaded!</span>
                          </div>
                        )}
                      </div>

                      {/* Description Area */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Project Description: *</label>
                        <textarea
                          id="pf-desc"
                          required
                          rows={3}
                          value={projDescription}
                          onChange={(e) => setProjDescription(e.target.value)}
                          placeholder="Tell us about plywood core grade, modular hinges brand, color pairings..."
                          className={`w-full p-2.5 rounded-lg border text-xs resize-none ${
                            darkMode ? "bg-navy-900 border-navy-800 text-white" : "bg-neutral-50 border-neutral-200"
                          }`}
                        ></textarea>
                      </div>

                      {/* Representative, Budget & Location details */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Client name Name:</label>
                          <input
                            id="pf-client"
                            type="text"
                            value={projClientName}
                            onChange={(e) => setProjClientName(e.target.value)}
                            placeholder="E.g. Mr. Somnath Ghosh"
                            className={`w-full p-2 rounded-lg border text-xs ${
                              darkMode ? "bg-navy-900 border-navy-800" : "bg-neutral-50 border-neutral-200"
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Budget Spec (₹):</label>
                          <input
                            id="pf-budget"
                            type="text"
                            value={projBudget}
                            onChange={(e) => setProjBudget(e.target.value)}
                            placeholder="E.g. ₹3,50,000"
                            className={`w-full p-2 rounded-lg border text-xs ${
                              darkMode ? "bg-navy-900 border-navy-800" : "bg-neutral-50 border-neutral-200"
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Site Location:</label>
                          <input
                            id="pf-location"
                            type="text"
                            value={projLocation}
                            onChange={(e) => setProjLocation(e.target.value)}
                            placeholder="E.g. Salt Lake, Kolkata"
                            className={`w-full p-2 rounded-lg border text-xs ${
                              darkMode ? "bg-navy-900 border-navy-800" : "bg-neutral-50 border-neutral-200"
                            }`}
                          />
                        </div>
                      </div>

                      <div className="pt-4 flex justify-end space-x-2.5">
                        <button
                          type="button"
                          onClick={handleCloseProjectModal}
                          className="px-6 py-3 rounded-lg border border-neutral-500 text-neutral-500 font-bold text-xs uppercase"
                        >
                          Cancel
                        </button>
                        <button
                          id="pf-submit-btn"
                          type="submit"
                          className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-navy-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-all"
                        >
                          {editProjectItem ? "Save Blueprint updates" : "Publish Project"}
                        </button>
                      </div>

                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* --- 3. REVIEWS MANAGEMENT LOGICS --- */}
        {activeTab === "reviews" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold">Manage Client Testimonials</h3>
              <button
                id="admin-btn-add-review"
                onClick={() => {
                  setEditReviewItem(null);
                  setShowReviewModal(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center space-x-1 cursor-pointer"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span>Add Testimonial</span>
              </button>
            </div>

            {/* List and editors of reviews */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className={`p-5 rounded-2xl border flex flex-col justify-between ${
                    darkMode ? "bg-navy-900 border-navy-800" : "bg-white border-neutral-200 shadow-sm"
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex text-gold-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <span className="text-[10px] font-mono text-neutral-400">{rev.date}</span>
                    </div>

                    <p className={`font-serif italic text-xs leading-relaxed mb-4 ${darkMode ? "text-navy-200" : "text-neutral-700"}`}>
                      "{rev.reviewText}"
                    </p>
                  </div>

                  <div className="flex justify-between items-center border-t dark:border-navy-800/40 pt-4 mt-2">
                    <div>
                      <p className="font-bold text-xs">{rev.clientName}</p>
                      <p className="text-[10px] text-neutral-400">{rev.designation || "Kolkata Resident"}</p>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        id={`rev-edit-${rev.id}`}
                        onClick={() => handleEditReviewClick(rev)}
                        className="p-1 text-gold-400 hover:bg-gold-500/10 rounded-md"
                        title="Edit testimonial"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        id={`rev-del-${rev.id}`}
                        onClick={() => handleDeleteReviewClick(rev.id)}
                        className="p-1 text-red-400 hover:bg-red-500/10 rounded-md"
                        title="Delete testimony"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Review manager modal popup */}
            <AnimatePresence>
              {showReviewModal && (
                <div className="fixed inset-0 z-105 flex items-center justify-center p-4 bg-navy-950/90 backdrop-blur-sm overflow-y-auto">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`w-full max-w-md rounded-2xl overflow-hidden border p-6 md:p-8 ${
                      darkMode ? "bg-navy-950 border-navy-800 text-white" : "bg-white border-neutral-200 text-navy-950 shadow-2xl"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-serif text-xl font-bold">{editReviewItem ? "Modify Client Testimonial" : "Log New Testimonial"}</h3>
                      <button onClick={handleCloseReviewModal} className="p-1.5 rounded-full text-neutral-400">✕</button>
                    </div>

                    <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Client Full Name: *</label>
                        <input
                          id="rf-name"
                          type="text"
                          required
                          value={revClientName}
                          onChange={(e) => setRevClientName(e.target.value)}
                          placeholder="E.g., Amit Roy"
                          className={`w-full p-2.5 rounded-lg border ${
                            darkMode ? "bg-navy-900 border-navy-800 text-white" : "bg-neutral-50 border-neutral-200 text-navy-900"
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Client Profession / Location:</label>
                        <input
                          id="rf-desg"
                          type="text"
                          value={revDesignation}
                          onChange={(e) => setRevDesignation(e.target.value)}
                          placeholder="E.g., Sector V IT Executive"
                          className={`w-full p-2.5 rounded-lg border ${
                            darkMode ? "bg-navy-900 border-navy-800 text-white" : "bg-neutral-50 border-neutral-200"
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Star Rating (1 to 5): *</label>
                        <select
                          id="rf-rating"
                          value={revRating}
                          onChange={(e) => setRevRating(Number(e.target.value))}
                          className={`w-full p-2.5 rounded-lg border ${
                            darkMode ? "bg-navy-900 border-navy-800 text-white" : "bg-neutral-50 border-neutral-200 text-navy-950"
                          }`}
                        >
                          <option value="5">5 Stars Premium Perfect</option>
                          <option value="4">4 Stars High Quality</option>
                          <option value="3">3 Stars Neutral</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Testimonial Description comment:</label>
                        <textarea
                          id="rf-text"
                          required
                          rows={4}
                          value={revReviewText}
                          onChange={(e) => setRevReviewText(e.target.value)}
                          placeholder="Enter comments details..."
                          className={`w-full p-2.5 rounded-lg border ${
                            darkMode ? "bg-navy-900 border-navy-800 text-white" : "bg-neutral-50 border-neutral-200"
                          }`}
                        ></textarea>
                      </div>

                      <div className="pt-4 flex justify-end space-x-2.5">
                        <button
                          type="button"
                          onClick={handleCloseReviewModal}
                          className="px-5 py-2.5 rounded-lg border border-neutral-500 text-neutral-500 font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          id="rf-submit-btn"
                          type="submit"
                          className="px-5 py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold tracking-wider uppercase rounded-lg"
                        >
                          Submit Testimonial
                        </button>
                      </div>

                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* --- 4. MANAGE BLOG ARCHIVES --- */}
        {activeTab === "blogs" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold">Manage Design Journal Articles</h3>
              <button
                id="admin-btn-add-blog"
                onClick={() => {
                  setEditBlogItem(null);
                  setShowBlogModal(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center space-x-1 cursor-pointer"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span>Publish New Post</span>
              </button>
            </div>

            {/* List and editors of blogs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogs.map((b) => (
                <div
                  key={b.id}
                  className={`p-5 rounded-2xl border flex flex-col justify-between ${
                    darkMode ? "bg-navy-900 border-navy-800" : "bg-white border-neutral-200 shadow-sm"
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-mono text-gold-400">{b.date} • {b.author}</span>
                    </div>

                    <h4 className="font-serif font-bold text-sm mb-2">{b.title}</h4>
                    <p className={`text-xs leading-normal mb-4 truncate ${darkMode ? "text-navy-300" : "text-neutral-500"}`}>
                      {b.excerpt}
                    </p>
                  </div>

                  <div className="flex justify-end items-center border-t dark:border-navy-800/40 pt-4 mt-2 space-x-2">
                    <button
                      id={`blog-edit-${b.id}`}
                      onClick={() => handleEditBlogClick(b)}
                      className="p-1 px-3 text-gold-400 hover:bg-gold-500/10 rounded-md border border-gold-400/20 text-[10px] font-bold"
                    >
                      Edit Post
                    </button>
                    <button
                      id={`blog-del-${b.id}`}
                      onClick={() => handleDeleteBlogClick(b.id)}
                      className="p-1 px-3 text-red-400 hover:bg-red-500/10 rounded-md border border-red-500/20 text-[10px] font-bold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Blog creation modal */}
            <AnimatePresence>
              {showBlogModal && (
                <div className="fixed inset-0 z-105 flex items-center justify-center p-4 bg-navy-950/90 backdrop-blur-sm overflow-y-auto">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`w-full max-w-2xl rounded-2xl overflow-hidden border p-6 md:p-8 max-h-[90vh] overflow-y-auto ${
                      darkMode ? "bg-navy-950 border-navy-800 text-white" : "bg-white border-neutral-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-serif text-xl font-bold">{editBlogItem ? "Edit Journal Article" : "Create Dynamic Post"}</h3>
                      <button onClick={handleCloseBlogModal} className="p-1.5 rounded-full text-neutral-400">✕</button>
                    </div>

                    <form onSubmit={handleBlogSubmit} className="space-y-4 text-xs">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Article Title: *</label>
                        <input
                          id="bf-title"
                          type="text"
                          required
                          value={blgTitle}
                          onChange={(e) => setBlgTitle(e.target.value)}
                          placeholder="5 modular kitchen secrets..."
                          className={`w-full p-2.5 rounded-lg border ${
                            darkMode ? "bg-navy-900 border-navy-800" : "bg-neutral-50 border-neutral-200"
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Excerpt: *</label>
                        <input
                          id="bf-excerpt"
                          type="text"
                          required
                          value={blgExcerpt}
                          onChange={(e) => setBlgExcerpt(e.target.value)}
                          placeholder="A quick summary for card preview..."
                          className={`w-full p-2.5 rounded-lg border ${
                            darkMode ? "bg-navy-900 border-navy-800" : "bg-neutral-50 border-neutral-200"
                          }`}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Cover Image URL:</label>
                          <input
                            id="bf-image"
                            type="text"
                            value={blgImage}
                            onChange={(e) => setCfgMapUrl(e.target.value)}
                            placeholder="https://..."
                            className={`w-full p-2.5 rounded-lg border ${
                              darkMode ? "bg-navy-900 border-navy-800" : "bg-neutral-50 border-neutral-200"
                            }`}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Author Column:</label>
                          <input
                            id="bf-author"
                            type="text"
                            value={blgAuthor}
                            onChange={(e) => setBlgAuthor(e.target.value)}
                            placeholder="E.g., Senior Architect, Kasis"
                            className={`w-full p-2.5 rounded-lg border ${
                              darkMode ? "bg-navy-900 border-navy-800" : "bg-neutral-50 border-neutral-200"
                            }`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Body Content Markup: *</label>
                        <p className="text-[10px] text-neutral-400 mb-1">Tip: Use empty lines to break paragraphs. Start lines with '#' for headings, '*' for list items.</p>
                        <textarea
                          id="bf-content"
                          required
                          rows={10}
                          value={blgContent}
                          onChange={(e) => setBlgContent(e.target.value)}
                          placeholder="# Top Materials... \n\nWe love using gold trims..."
                          className={`w-full p-2.5 rounded-lg border font-mono resize-none leading-relaxed ${
                            darkMode ? "bg-navy-900 border-navy-800" : "bg-neutral-50 border-neutral-200"
                          }`}
                        ></textarea>
                      </div>

                      <div className="pt-4 flex justify-end space-x-2.5">
                        <button
                          type="button"
                          onClick={handleCloseBlogModal}
                          className="px-5 py-2.5 rounded-lg border border-neutral-500 text-neutral-500 font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          id="bf-submit-btn"
                          type="submit"
                          className="px-5 py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold tracking-wider uppercase rounded-lg"
                        >
                          Publish Post
                        </button>
                      </div>

                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* --- 5. EDIT MAIN WEB SETTINGS AND PARAMETERS --- */}
        {activeTab === "config" && (
          <form
            id="admin-brand-config-form"
            onSubmit={handleGlobalConfigSubmit}
            className={`p-6 md:p-8 rounded-2xl border space-y-4 text-xs animate-fade-in ${
              darkMode ? "bg-navy-900 border-navy-800" : "bg-white border-neutral-200 shadow-sm"
            }`}
          >
            <h3 className="font-serif text-lg font-bold mb-4 border-b dark:border-navy-800/40 pb-3">
              Configure Global Brand Coordinates
            </h3>

            {/* Phone & Whatsapp row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-gold-400">Owner Phone Calling No: *</label>
                <input
                  id="cfg-phone"
                  type="text"
                  required
                  value={cfgPhone}
                  onChange={(e) => setCfgPhone(e.target.value)}
                  placeholder="+91 98040 42345"
                  className={`w-full p-2.5 rounded-lg border ${
                    darkMode ? "bg-navy-950 border-navy-800 text-white" : "bg-neutral-50 border-neutral-200 text-navy-950"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-[#52b788]">Numeric WhatsApp ID (no dashes): *</label>
                <input
                  id="cfg-whatsapp"
                  type="text"
                  required
                  value={cfgWhatsapp}
                  onChange={(e) => setCfgWhatsapp(e.target.value)}
                  placeholder="919804042345"
                  className={`w-full p-2.5 rounded-lg border ${
                    darkMode ? "bg-navy-950 border-navy-800 text-white" : "bg-neutral-50 border-neutral-200 text-navy-950"
                  }`}
                />
              </div>
            </div>

            {/* Email & Address row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Official Brand Email coordinates: *</label>
                <input
                  id="cfg-email"
                  type="email"
                  required
                  value={cfgEmail}
                  onChange={(e) => setCfgEmail(e.target.value)}
                  placeholder="kasisinterior@gmail.com"
                  className={`w-full p-2.5 rounded-lg border ${
                    darkMode ? "bg-navy-950 border-navy-800 text-white" : "bg-neutral-50 border-neutral-200 text-navy-950"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Physical Studio Address Desk: *</label>
                <input
                  id="cfg-address"
                  type="text"
                  required
                  value={cfgAddress}
                  onChange={(e) => setCfgAddress(e.target.value)}
                  placeholder="Enter full office landmark location"
                  className={`w-full p-2.5 rounded-lg border ${
                    darkMode ? "bg-navy-950 border-navy-800 text-white" : "bg-neutral-50 border-neutral-200 text-navy-950"
                  }`}
                />
              </div>
            </div>

            {/* Maps embed coordinate slider */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Google Maps Coordinate Embed / Address: *</label>
              <p className={`text-[10px] mb-1.5 ${darkMode ? "text-navy-400" : "text-neutral-500"}`}>
                Paste the entire Google Maps &lt;iframe&gt; code, a normal maps sharing URL, or simply type the text address. Our layout engine auto-extracts and formats it!
              </p>
              <textarea
                id="cfg-map"
                required
                rows={2}
                value={cfgMapUrl}
                onChange={(e) => setCfgMapUrl(e.target.value)}
                placeholder="Ariadaha, Shantikunj apartment, 33, Bindhya Basini Tala Rd, near zen cable, Kolkata, West Bengal 700057"
                className={`w-full p-2 rounded border font-mono text-xs ${
                  darkMode ? "bg-navy-950 border-navy-800" : "bg-neutral-50 border-neutral-200"
                }`}
              ></textarea>
            </div>

            {/* Metrics counter setters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t dark:border-navy-800/40 pt-4 mt-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Lineage Experience (Years):</label>
                <input
                  id="cfg-exp"
                  type="number"
                  value={cfgExpYears}
                  onChange={(e) => setCfgExpYears(Number(e.target.value))}
                  className={`w-full p-2.5 rounded-lg border ${
                    darkMode ? "bg-navy-950 border-navy-800" : "bg-neutral-50 border-neutral-200"
                  }`}
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Initial Consultation Pricing Tag:</label>
                <input
                  id="cfg-consult"
                  type="text"
                  value={cfgConsultFee}
                  onChange={(e) => setCfgConsultFee(e.target.value)}
                  className={`w-full p-2.5 rounded-lg border ${
                    darkMode ? "bg-navy-950 border-navy-800" : "bg-neutral-50 border-neutral-200"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Hardware Warranty Lifespan (Years):</label>
                <input
                  id="cfg-warranty"
                  type="number"
                  value={cfgWarranty}
                  onChange={(e) => setCfgWarranty(Number(e.target.value))}
                  className={`w-full p-2.5 rounded-lg border ${
                    darkMode ? "bg-navy-950 border-navy-800" : "bg-neutral-50 border-neutral-200"
                  }`}
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                id="cfg-submit-btn"
                type="submit"
                className="px-8 py-3.5 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold uppercase tracking-wider rounded-xl transition-all hover:scale-105 cursor-pointer shadow-lg"
              >
                Save Structural Brand configurations
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
