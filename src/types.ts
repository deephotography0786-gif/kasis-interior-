export interface Project {
  id: string;
  title: string;
  category: "bedroom" | "living" | "kitchen" | "office" | "furniture" | "dining";
  image: string;
  description: string;
  beforeImage?: string;
  clientName?: string;
  budget?: string;
  location?: string;
}

export interface Review {
  id: string;
  clientName: string;
  rating: number;
  reviewText: string;
  date: string;
  source: "Google Reviews" | "Direct";
  designation?: string;
}

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  status: "new" | "contacted" | "completed";
  timestamp: string;
  remarks?: string;
}

export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
}

export interface WebConfig {
  phone: string;
  whatsapp: string;
  address: string;
  email: string;
  googleMapEmbedUrl: string;
  experienceYears: number;
  consultationFee: string;
  warrantyYears: number;
}
