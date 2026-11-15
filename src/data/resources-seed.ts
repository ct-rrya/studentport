import { ResourceItem } from "@/types/portal";

// official ctu web systems and campus emergency/registrar contact directory
// scraped pdf memos & forms from posts get appended to this list at render time
export const OFFICIAL_RESOURCES: ResourceItem[] = [
  {
    id: "sys-enrolment",
    title: "CTU Enrolment & Admission Portal",
    category: "Official Portal",
    url: "https://enrolment.ctu.edu.ph/",
    description:
      "Official online enrolment, admission application, and student registration system across CTU campuses.",
    campusSlugs: [],
  },
  {
    id: "sys-online",
    title: "CTU Online Learning Portal (LMS)",
    category: "Official Portal",
    url: "https://online.ctu.edu.ph/",
    description:
      "University Learning Management System for blended classes, course modules, quizzes, and faculty announcements.",
    campusSlugs: [],
  },
  {
    id: "sys-main-site",
    title: "Official CTU Website",
    category: "Official Portal",
    url: "https://www.ctu.edu.ph/",
    description:
      "Primary institutional WordPress site publishing university memoranda, board resolutions, and campus news.",
    campusSlugs: [],
  },
  {
    id: "sys-calendar",
    title: "CTU Academic Calendar & Announcements",
    category: "Official Portal",
    url: "https://www.ctu.edu.ph/category/announcements/",
    description:
      "Official academic calendar dates, semester opening schedules, and university-wide examination notices.",
    campusSlugs: [],
  },
  {
    id: "sys-library",
    title: "CTU University Library Services",
    category: "Official Portal",
    url: "https://www.ctu.edu.ph/",
    description:
      "Access digital research repositories, thesis archives, and campus library orientation guides.",
    campusSlugs: ["main"],
  },
  {
    id: "hotline-main",
    title: "CTU Main Campus Information & Trunkline",
    category: "Campus Hotline",
    phone: "(032) 402-4060",
    description:
      "General inquiries, university registrar, and administrative offices at Corner M.J. Cuenco Ave. & R. Palma St., Cebu City.",
    campusSlugs: ["main"],
  },
  {
    id: "hotline-danao",
    title: "CTU Danao Campus Administration",
    category: "Campus Hotline",
    phone: "(032) 354-3660",
    description:
      "Campus registrar, student affairs, and admissions desk for CTU Danao City.",
    campusSlugs: ["danao"],
  },
  {
    id: "hotline-argao",
    title: "CTU Argao Campus Administration",
    category: "Campus Hotline",
    phone: "(032) 485-8290",
    description:
      "Campus registrar and student support hotline for CTU Argao Campus.",
    campusSlugs: ["argao"],
  },
  {
    id: "hotline-daanbantayan",
    title: "CTU Daanbantayan Campus Administration",
    category: "Campus Hotline",
    phone: "(032) 437-8523",
    description:
      "Campus office and student affairs desk for CTU Daanbantayan and northern extension units.",
    campusSlugs: ["daanbantayan", "bantayan"],
  },
  {
    id: "hotline-cebu-emergency",
    title: "Cebu City Emergency & Disaster Hotline",
    category: "Campus Hotline",
    phone: "911 / (032) 255-0046",
    description:
      "24/7 emergency medical, fire, and disaster response for Metro Cebu campuses.",
    campusSlugs: ["main", "cebu-city-mountain", "guba", "consolacion", "liloan"],
  },
];
