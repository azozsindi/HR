// src/data/industries.ts
import { Industry, Company } from "../types";

export const INDUSTRIES: Industry[] = [
  { id: "general",      label: "عام",                labelEn: "General",            icon: "🏢", color: "#7B2FBE" },
  { id: "medical",      label: "طبي / صحي",           labelEn: "Medical / Healthcare",icon: "🏥", color: "#0077B6" },
  { id: "financial",    label: "مالي / محاسبي",       labelEn: "Financial",           icon: "💰", color: "#2A9D8F" },
  { id: "construction", label: "مقاولات / هندسة",     labelEn: "Construction",        icon: "🏗️", color: "#E76F51" },
  { id: "retail",       label: "تجزئة / مطاعم",       labelEn: "Retail / F&B",        icon: "🛒", color: "#E63946" },
  { id: "tech",         label: "تقنية / برمجة",       labelEn: "Tech / Software",     icon: "💻", color: "#457B9D" },
  { id: "marketing",    label: "تسويق / إعلام",       labelEn: "Marketing / Media",   icon: "📢", color: "#F4A261" },
];

export const DEFAULT_COMPANY: Company = {
  name: "شركة كير فور يو المحدودة",
  nameEn: "Care4u KSA Limited",
  logo: null,
  primaryColor: "#7B2FBE",
  industry: "general",
  address: "طريق الكورنيش الفرعي، الشاطئ، جدة 23511",
  addressEn: "Corniche Road, Al-Shati, Jeddah 23511",
  phone: "+966530785500",
  email: "info@care4uksa.com",
  website: "www.care4uksa.com",
  tagline: "FOR ALL YOUR SUPPORT NEEDS",
  stampMode: "manual",
  stampImage: null,
};

export const CAT_LABELS: Record<string, { ar: string; en: string; icon: string }> = {
  onboarding:   { ar:"التوظيف والتعيين",       en:"Onboarding",       icon:"🚀" },
  operations:   { ar:"العمليات والطلبات",       en:"Operations",       icon:"⚙️" },
  discipline:   { ar:"التقييم والإنذارات",      en:"Performance & Discipline", icon:"📋" },
  offboarding:  { ar:"إنهاء الخدمات",           en:"Offboarding",      icon:"🚪" },
  medical:      { ar:"الطبي والصحي",            en:"Medical",          icon:"🏥" },
  financial:    { ar:"المالي والمحاسبي",         en:"Financial",        icon:"💰" },
  construction: { ar:"المقاولات والسلامة",       en:"Construction",     icon:"🏗️" },
  retail:       { ar:"التجزئة والمطاعم",         en:"Retail / F&B",     icon:"🛒" },
  tech:         { ar:"التقنية والبرمجة",         en:"Tech / Software",  icon:"💻" },
  marketing:    { ar:"التسويق والإعلام",         en:"Marketing / Media", icon:"📢" },
};
