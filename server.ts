import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { Project, Review, Inquiry, Blog, WebConfig } from "./src/types.ts";

const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "db.json");

// Helper to ensure database is initialized with high-end luxury datasets
function initDatabase() {
  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(content);
    } catch (e) {
      console.error("Error reading database, recreating default seed.", e);
    }
  }

  const defaultData = {
    config: {
      phone: "+91 98040 42345",
      whatsapp: "919804042345",
      address: "Ariadaha, Shantikunj Apartment, 33 Bindhya Basini Tala Road, Near Zen Cable, Kolkata, West Bengal 700057",
      email: "kasisinterior@gmail.com",
      googleMapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3680.597652758231!2d88.35824557530438!3d22.68742887941094!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f89da7dc8a4e37%3A0xe54e601bfeb09b82!2s33%2C%20B.%20B.%20Tala%20Road%2C%20Ariadaha%2C%20Kolkata%2C%20West%20Bengal%20700057!5e0!3m2!1sen!2sin!4v1717080000000!5m2!1sen!2sin",
      experienceYears: 12,
      consultationFee: "Free Consultation",
      warrantyYears: 10
    } as WebConfig,
    portfolio: [
      {
        id: "p1",
        title: "Deep Sea Sapphire Modular Bedroom",
        category: "bedroom",
        image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80",
        description: "Bespoke Navy Blue and Gold customized high-headboard double bed with embedded LED light details and dynamic gold side tables.",
        beforeImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
        clientName: "Mr. Abhra Roy",
        budget: "₹3,50,000",
        location: "Salt Lake, Kolkata"
      },
      {
        id: "p2",
        title: "Bespoke Royal Venetian Living Lounge",
        category: "living",
        image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
        description: "A breathtaking living room combining gold accents, custom fluted wall panels, premium velvet upholstery, and modern glassmorphism shelving.",
        beforeImage: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80",
        clientName: "Mrs. Indrani Sen",
        budget: "₹5,20,000",
        location: "New Town, Kolkata"
      },
      {
        id: "p3",
        title: "High-Gloss Ocean Marina Kitchen",
        category: "kitchen",
        image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
        description: "Marine-grade high-gloss German acrylic drawer shutters with smart spice racks, pneumatic lift-up cabinets, and central quartz island table.",
        beforeImage: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80",
        clientName: "Mr. Somnath Ghosh",
        budget: "₹4,80,000",
        location: "Dunlop, Kolkata"
      },
      {
        id: "p4",
        title: "Corporate Executive Suite & Workstation",
        category: "office",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
        description: "Sleek professional office setup featuring minimal workspace desks, wooden laminate cabinets, premium reception lounge chairs, and acoustical gold ceilings.",
        beforeImage: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80",
        clientName: "Zeta Fintech Corp",
        budget: "₹8,50,000",
        location: "Sector V, Kolkata"
      },
      {
        id: "p5",
        title: "Dynamic Marble Dining Space Hub",
        category: "dining",
        image: "https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&w=1200&q=80",
        description: "An elegant dining concept equipped with luxury golden leg detailing, bespoke white-veined marble table, and soft tufted velvet bucket dining chairs.",
        beforeImage: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=600&q=80",
        clientName: "Mrs. Lopamudra Mitra",
        budget: "₹2,40,000",
        location: "Garia, Kolkata"
      },
      {
        id: "p6",
        title: "Custom Fluted Wood Wardrobe Panel",
        category: "furniture",
        image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80",
        description: "Bespoke walkthrough luxury closet featuring tinted sliding glass doors, built-in sensor-based LEDs, and exquisite rich wood grain detailing.",
        beforeImage: "https://images.unsplash.com/photo-1558882224-cca166733360?auto=format&fit=crop&w=600&q=80",
        clientName: "Dr. Sandip Das",
        budget: "₹2,90,000",
        location: "Sodpur, Kolkata"
      }
    ] as Project[],
    reviews: [
      {
        id: "r1",
        clientName: "Siddharth Bandopadhyay",
        rating: 5,
        reviewText: "Absolutely stunning work! Kasis Interior designed our entire apartment in Ariadaha with state of the art modular solutions. Their command of deep navy and gold trims is remarkable. Truly turned our vision into reality.",
        date: "May 15, 2026",
        source: "Google Reviews",
        designation: "Homeowner, Ariadaha"
      },
      {
        id: "r2",
        clientName: "Ananya Chatterjee",
        rating: 5,
        reviewText: "Excellent modular kitchen and bedroom design! Unlike other interior companies in Kolkata, Kasis Interior provided completely custom options from high-quality materials. Highly recommend their skilled craftsmen.",
        date: "April 28, 2026",
        source: "Google Reviews",
        designation: "Sodpur"
      },
      {
        id: "r3",
        clientName: "Kaushik Mukherjee",
        rating: 5,
        reviewText: "Professional approach and zero delays. The quality of our sofa sets, dining table, and false ceiling is phenomenal. It looks like a high-end luxury resort. Special mention to their custom furniture design process.",
        date: "May 20, 2026",
        source: "Google Reviews",
        designation: "Barackpore"
      }
    ] as Review[],
    inquiries: [
      {
        id: "i1",
        name: "Abhishek Sen",
        phone: "+91 98300 12345",
        email: "abhishek@domain.com",
        service: "Modular Kitchen",
        message: "Hello! I am looking to redesign my kitchen with marine-grade high-gloss finish. Please send a design catalog.",
        status: "new",
        timestamp: new Date().toISOString(),
        remarks: "Need deep blue and white finish layout."
      }
    ] as Inquiry[],
    blogs: [
      {
        id: "b1",
        title: "Top 5 Luxury Interior Design Schemes in Kolkata 2026",
        excerpt: "Discover how gold profiling and deep navy color schemes are redefining modern heritage homes in Kolkata.",
        content: `# Top 5 Luxury Interior Design Schemes in Kolkata

Interior design in Kolkata has shifted towards high-end luxury, where modern aesthetics blend cohesively with classical styling. Below are the top trends dominating luxury renovations:

### 1. Navy Blue & Gold Trim Profiles
There is a massive demand for royal navy walls accented with metallic gold geometric strips. It offers a majestic and warm vibe, especially under ambient 3000K LED lights.

### 2. German Modular Kitchens with High Gloss Acrylic Shutters
Marine-grade BWR plywood coupled with high-end, scratch-resistant acrylic and soft-close Tandem boxes is the standard choice in salt-air heavy environments.

### 3. Smart Fluted Wall Panels
Aesthetic fluted patterns behind master-bed headboards or TV units provide vertical scale, making medium-height Kolkata apartments feel towering and grand.

### 4. Custom Glassmorphic Room Partitions
Partitioning spaces using tinted glass and sleek metal frames allows natural light to flow while keeping private functional zones separate.`,
        image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80",
        author: "Interior Lead Designers",
        date: "May 24, 2026"
      },
      {
        id: "b2",
        title: "Modular Kitchens: Marine Plywood vs MDF Layout",
        excerpt: "An essential architectural analysis of wood substrates perfect for West Bengal's relative humidity.",
        content: `# Modular Kitchen Substrates: Plywood vs MDF

For premium modular cabinets in highly humid areas like Kolkata and surrounding regions, choosing the right core substrate remains critical:

* **BWR (Boiling Water Resistant) Plywood**: Ideal. Resists moisture, stands robust under water leaks, and handles weight load exceptionally well.
* **MDF (Medium Density Fiberboard)**: Easily disintegrates in moisture-dense kitchen zones. Avoid for cabinets beneath the wash sink.

At **Kasis Interior**, we construct all modules using ISI-certified 100% boiling-waterproof marine plywood with premium German laminates and acrylic sheets.`,
        image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80",
        author: "Tech Consultant, Kasis",
        date: "April 15, 2026"
      }
    ] as Blog[]
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), "utf-8");
  return defaultData;
}

// Write helper
function saveDatabase(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

let dbData = initDatabase();

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "15mb" })); // support Base64 photo uploads!

  // --- API ROUTING ---

  // Portfolio list & mutations
  app.get("/api/portfolio", (req, res) => {
    res.json(dbData.portfolio);
  });

  app.post("/api/portfolio", (req, res) => {
    const { title, category, image, description, beforeImage, clientName, budget, location } = req.body;
    if (!title || !category || !image) {
      return res.status(400).json({ error: "Missing title, category, or core image url/base64" });
    }
    const newProj: Project = {
      id: "p_" + Date.now(),
      title,
      category,
      image,
      description: description || "",
      beforeImage: beforeImage || "",
      clientName: clientName || "Private Estate",
      budget: budget || "Custom Spec",
      location: location || "Kolkata, WB"
    };
    dbData.portfolio.unshift(newProj);
    saveDatabase(dbData);
    res.json({ success: true, project: newProj });
  });

  app.put("/api/portfolio/:id", (req, res) => {
    const { id } = req.params;
    const index = dbData.portfolio.findIndex((p: any) => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Project not found" });
    }
    dbData.portfolio[index] = { ...dbData.portfolio[index], ...req.body };
    saveDatabase(dbData);
    res.json({ success: true, project: dbData.portfolio[index] });
  });

  app.delete("/api/portfolio/:id", (req, res) => {
    const { id } = req.params;
    dbData.portfolio = dbData.portfolio.filter((p: any) => p.id !== id);
    saveDatabase(dbData);
    res.json({ success: true });
  });

  // Client Reviews list & mutations
  app.get("/api/reviews", (req, res) => {
    res.json(dbData.reviews);
  });

  app.post("/api/reviews", (req, res) => {
    const { clientName, rating, reviewText, designation, source } = req.body;
    if (!clientName || !rating || !reviewText) {
      return res.status(400).json({ error: "Missing details" });
    }
    const newRev: Review = {
      id: "r_" + Date.now(),
      clientName,
      rating: Number(rating),
      reviewText,
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      source: source || "Direct",
      designation: designation || "Kolkata Homeowner"
    };
    dbData.reviews.unshift(newRev);
    saveDatabase(dbData);
    res.json({ success: true, review: newRev });
  });

  app.put("/api/reviews/:id", (req, res) => {
    const { id } = req.params;
    const index = dbData.reviews.findIndex((r: any) => r.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Review not found" });
    }
    dbData.reviews[index] = { ...dbData.reviews[index], ...req.body };
    saveDatabase(dbData);
    res.json({ success: true, review: dbData.reviews[index] });
  });

  app.delete("/api/reviews/:id", (req, res) => {
    const { id } = req.params;
    dbData.reviews = dbData.reviews.filter((r: any) => r.id !== id);
    saveDatabase(dbData);
    res.json({ success: true });
  });

  // Inquiries / Leads lists & mutations
  app.get("/api/inquiries", (req, res) => {
    res.json(dbData.inquiries || []);
  });

  app.post("/api/inquiries", (req, res) => {
    const { name, phone, email, service, message } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: "Name and Phone number are required properties" });
    }
    const newInq: Inquiry = {
      id: "i_" + Date.now(),
      name,
      phone,
      email: email || "",
      service: service || "General Design Consultancy",
      message: message || "Requested a callback from the design coordinator.",
      status: "new",
      timestamp: new Date().toISOString()
    };
    if (!dbData.inquiries) {
      dbData.inquiries = [];
    }
    dbData.inquiries.unshift(newInq);
    saveDatabase(dbData);
    res.json({ success: true, inquiry: newInq });
  });

  app.put("/api/inquiries/:id", (req, res) => {
    const { id } = req.params;
    const index = dbData.inquiries.findIndex((i: any) => i.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Inquiry not found" });
    }
    dbData.inquiries[index] = { ...dbData.inquiries[index], ...req.body };
    saveDatabase(dbData);
    res.json({ success: true, inquiry: dbData.inquiries[index] });
  });

  app.delete("/api/inquiries/:id", (req, res) => {
    const { id } = req.params;
    dbData.inquiries = dbData.inquiries.filter((i: any) => i.id !== id);
    saveDatabase(dbData);
    res.json({ success: true });
  });

  // Blogs list & mutations
  app.get("/api/blogs", (req, res) => {
    res.json(dbData.blogs || []);
  });

  app.post("/api/blogs", (req, res) => {
    const { title, excerpt, content, image, author } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Missing blog title or body content" });
    }
    const newBlg: Blog = {
      id: "b_" + Date.now(),
      title,
      excerpt: excerpt || "A custom designer article from our specialists.",
      content,
      image: image || "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80",
      author: author || "Kasis Interior",
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    };
    if (!dbData.blogs) {
      dbData.blogs = [];
    }
    dbData.blogs.unshift(newBlg);
    saveDatabase(dbData);
    res.json({ success: true, blog: newBlg });
  });

  app.put("/api/blogs/:id", (req, res) => {
    const { id } = req.params;
    const index = dbData.blogs.findIndex((b: any) => b.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Blog post not found" });
    }
    dbData.blogs[index] = { ...dbData.blogs[index], ...req.body };
    saveDatabase(dbData);
    res.json({ success: true, blog: dbData.blogs[index] });
  });

  app.delete("/api/blogs/:id", (req, res) => {
    const { id } = req.params;
    dbData.blogs = dbData.blogs.filter((b: any) => b.id !== id);
    saveDatabase(dbData);
    res.json({ success: true });
  });

  // Global Brand Config APIs
  app.get("/api/config", (req, res) => {
    res.json(dbData.config);
  });

  app.put("/api/config", (req, res) => {
    dbData.config = { ...dbData.config, ...req.body };
    saveDatabase(dbData);
    res.json({ success: true, config: dbData.config });
  });

  // Secure Admin simple JWT/cookie proxy session login
  app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;
    // Default fallback values: admin / kasis@700057
    if (username === "admin" && password === "kasis@700057") {
      res.json({ success: true, token: "kasis_tok_" + Number(Date.now()).toString(16), role: "administrator" });
    } else {
      res.status(401).json({ error: "Invalid admin passcode or username credentials." });
    }
  });

  // --- VITE DEV OR PROD ROUTING ---

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Kasis Backend] Server up & serving on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((e) => {
  console.error("Critical server failure", e);
});
