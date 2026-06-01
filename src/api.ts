import { Project, Review, Inquiry, Blog, WebConfig } from "./types.ts";
import { db, handleFirestoreError, OperationType } from "./firebase.ts";
import { doc, getDoc, getDocs, setDoc, deleteDoc, collection } from "firebase/firestore";

// High-end luxury seeded datasets as fallbacks when Firestore collections are empty
const defaultWebConfig: WebConfig = {
  phone: "+91 98040 42345",
  whatsapp: "919804042345",
  address: "Ariadaha, Shantikunj Apartment, 33 Bindhya Basini Tala Road, Near Zen Cable, Kolkata, West Bengal 700057",
  email: "kasisinterior@gmail.com",
  googleMapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3680.597652758231!2d88.35824557530438!3d22.68742887941094!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f89da7dc8a4e37%3A0xe54e601bfeb09b82!2s33%2C%20B.%20B.%20Tala%20Road%2C%20Ariadaha%2C%20Kolkata%2C%20West%20Bengal%20700057!5e0!3m2!1sen!2sin!4v1717080000000!5m2!1sen!2sin",
  experienceYears: 12,
  consultationFee: "Free Consultation",
  warrantyYears: 10
};

const defaultPortfolio: Project[] = [
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
];

const defaultReviews: Review[] = [
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
];

const defaultBlogs: Blog[] = [
  {
    id: "b1",
    title: "Top 5 Luxury Interior Design Schemes in Kolkata 2026",
    excerpt: "Discover how gold profiling and deep navy color schemes are redefining modern heritage homes in Kolkata.",
    content: `# Top 5 Luxury Interior Design Schemes in Kolkata\n\nInterior design in Kolkata has shifted towards high-end luxury, where modern aesthetics blend cohesively with classical styling. Below are the top trends dominating luxury renovations:\n\n### 1. Navy Blue & Gold Trim Profiles\nThere is a massive demand for royal navy walls accented with metallic gold geometric strips. It offers a majestic and warm vibe, especially under ambient 3000K LED lights.\n\n### 2. German Modular Kitchens with High Gloss Acrylic Shutters\nMarine-grade BWR plywood coupled with high-end, scratch-resistant acrylic and soft-close Tandem boxes is the standard choice in salt-air heavy environments.\n\n### 3. Smart Fluted Wall Panels\nAesthetic fluted patterns behind master-bed headboards or TV units provide vertical scale, making medium-height Kolkata apartments feel towering and grand.\n\n### 4. Custom Glassmorphic Room Partitions\nPartitioning spaces using tinted glass and sleek metal frames allows natural light to flow while keeping private functional zones separate.`,
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80",
    author: "Interior Lead Designers",
    date: "May 24, 2026"
  },
  {
    id: "b2",
    title: "Modular Kitchens: Marine Plywood vs MDF Layout",
    excerpt: "An essential architectural analysis of wood substrates perfect for West Bengal's relative humidity.",
    content: `# Modular Kitchen Substrates: Plywood vs MDF\n\nFor premium modular cabinets in highly humid areas like Kolkata and surrounding regions, choosing the right core substrate remains critical:\n\n* **BWR (Boiling Water Resistant) Plywood**: Ideal. Resists moisture, stands robust under water leaks, and handles weight load exceptionally well.\n* **MDF (Medium Density Fiberboard)**: Easily disintegrates in moisture-dense kitchen zones. Avoid for cabinets beneath the wash sink.\n\nAt **Kasis Interior**, we construct all modules using ISI-certified 100% boiling-waterproof marine plywood with premium German laminates and acrylic sheets.`,
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80",
    author: "Tech Consultant, Kasis",
    date: "April 15, 2026"
  }
];

export async function fetchConfig(): Promise<WebConfig> {
  const path = "config";
  try {
    const docRef = doc(db, path, "default");
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return defaultWebConfig;
    }
    return docSnap.data() as WebConfig;
  } catch (error) {
    console.warn("Using fallback local config due to error:", error);
    return defaultWebConfig;
  }
}

export async function updateConfig(config: Partial<WebConfig>, token: string): Promise<WebConfig> {
  const path = "config/default";
  try {
    const docRef = doc(db, "config", "default");
    await setDoc(docRef, config, { merge: true });
    return config as WebConfig;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fetchPortfolio(): Promise<Project[]> {
  const path = "portfolio";
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) {
      return defaultPortfolio;
    }
    return snap.docs.map(doc => doc.data() as Project);
  } catch (error) {
    console.warn("Using fallback portfolio due to error:", error);
    return defaultPortfolio;
  }
}

export async function createProject(project: Omit<Project, "id">): Promise<Project> {
  const id = "p_" + Date.now();
  const newProj: Project = { ...project, id };
  const path = `portfolio/${id}`;
  try {
    await setDoc(doc(db, "portfolio", id), newProj);
    return newProj;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateProject(id: string, project: Partial<Project>, token: string): Promise<Project> {
  const path = `portfolio/${id}`;
  try {
    const docRef = doc(db, "portfolio", id);
    await setDoc(docRef, project, { merge: true });
    const snap = await getDoc(docRef);
    return snap.data() as Project;
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteProject(id: string, token: string): Promise<boolean> {
  const path = `portfolio/${id}`;
  try {
    await deleteDoc(doc(db, "portfolio", id));
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function fetchReviews(): Promise<Review[]> {
  const path = "reviews";
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) {
      return defaultReviews;
    }
    return snap.docs.map(doc => doc.data() as Review);
  } catch (error) {
    console.warn("Using fallback reviews due to error:", error);
    return defaultReviews;
  }
}

export async function createReview(review: Omit<Review, "id" | "date">): Promise<Review> {
  const id = "r_" + Date.now();
  const dateStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const newRev: Review = { ...review, id, date: dateStr };
  const path = `reviews/${id}`;
  try {
    await setDoc(doc(db, "reviews", id), newRev);
    return newRev;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateReview(id: string, review: Partial<Review>, token: string): Promise<Review> {
  const path = `reviews/${id}`;
  try {
    const docRef = doc(db, "reviews", id);
    await setDoc(docRef, review, { merge: true });
    const snap = await getDoc(docRef);
    return snap.data() as Review;
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteReview(id: string, token: string): Promise<boolean> {
  const path = `reviews/${id}`;
  try {
    await deleteDoc(doc(db, "reviews", id));
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function fetchInquiries(token: string): Promise<Inquiry[]> {
  const path = "inquiries";
  try {
    const snap = await getDocs(collection(db, "inquiries"));
    const list = snap.docs.map(doc => doc.data() as Inquiry);
    return list.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function createInquiry(inquiry: Omit<Inquiry, "id" | "status" | "timestamp">): Promise<Inquiry> {
  const id = "i_" + Date.now();
  const newInq: Inquiry = {
    ...inquiry,
    id,
    status: "new",
    timestamp: new Date().toISOString()
  };
  const path = `inquiries/${id}`;
  try {
    await setDoc(doc(db, "inquiries", id), newInq);
    return newInq;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateInquiry(id: string, inquiry: Partial<Inquiry>, token: string): Promise<Inquiry> {
  const path = `inquiries/${id}`;
  try {
    const docRef = doc(db, "inquiries", id);
    await setDoc(docRef, inquiry, { merge: true });
    const snap = await getDoc(docRef);
    return snap.data() as Inquiry;
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteInquiry(id: string, token: string): Promise<boolean> {
  const path = `inquiries/${id}`;
  try {
    await deleteDoc(doc(db, "inquiries", id));
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function fetchBlogs(): Promise<Blog[]> {
  const path = "blogs";
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) {
      return defaultBlogs;
    }
    return snap.docs.map(doc => doc.data() as Blog);
  } catch (error) {
    console.warn("Using fallback blogs due to error:", error);
    return defaultBlogs;
  }
}

export async function createBlog(blog: Omit<Blog, "id" | "date">, token: string): Promise<Blog> {
  const id = "b_" + Date.now();
  const dateStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const newBlog: Blog = { ...blog, id, date: dateStr };
  const path = `blogs/${id}`;
  try {
    await setDoc(doc(db, "blogs", id), newBlog);
    return newBlog;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateBlog(id: string, blog: Partial<Blog>, token: string): Promise<Blog> {
  const path = `blogs/${id}`;
  try {
    const docRef = doc(db, "blogs", id);
    await setDoc(docRef, blog, { merge: true });
    const snap = await getDoc(docRef);
    return snap.data() as Blog;
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteBlog(id: string, token: string): Promise<boolean> {
  const path = `blogs/${id}`;
  try {
    await deleteDoc(doc(db, "blogs", id));
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
