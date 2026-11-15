import { Campus } from "@/types/portal";

export const CTU_OFFICIAL_FACEBOOK_URL = "https://www.facebook.com/ctuofficial";

// complete directory of all 29 ctu campuses (1 main, 16 satellite, 12 extension)
// every campus entry has facebookUrl + websiteUrl now — swap in campus ssg links as you verify them
export const CTU_CAMPUSES: Campus[] = [
  // --- MAIN CAMPUS (1) ---
  {
    slug: "main",
    name: "CTU Main Campus",
    shortName: "CTU Main",
    type: "main",
    location: "Cebu City",
    address: "Corner M.J. Cuenco Ave. & R. Palma St., Cebu City, 6000 Cebu",
    description:
      "The flagship campus and central administrative seat of Cebu Technological University, hosting flagship engineering, technology, education, arts, and graduate programs.",
    keywords: ["ctu main", "main campus", "m.j. cuenco", "r. palma", "cebu city main"],
    offeredPrograms: ["BSIT", "BSCE", "BSME", "BSEE", "BSIE", "BSHM", "BEEd", "BSEd", "BSBA", "BIT", "MIT", "PhD-TM"],
    hotline: "(032) 402-4060",
    email: "information@ctu.edu.ph",
    websiteUrl: "https://www.ctu.edu.ph/main/",
    facebookUrl: "https://www.facebook.com/SSGctu",
  },

  // --- SATELLITE CAMPUSES (16) ---
  {
    slug: "argao",
    name: "CTU Argao Campus",
    shortName: "CTU Argao",
    type: "satellite",
    location: "Argao, Cebu",
    address: "Ed Kintanar St., Lamacan, Argao, 6021 Cebu",
    description:
      "Southern Cebu satellite campus known for agriculture, forestry, hospitality, industrial technology, and teacher education programs.",
    keywords: ["argao", "ctu argao", "ctu-argao"],
    offeredPrograms: ["BSA", "BSF", "BSIT", "BSHM", "BEEd", "BSEd", "BIT"],
    hotline: "(032) 485-8290",
    email: "argao@ctu.edu.ph",
    websiteUrl: "https://www.ctu.edu.ph/argao/",
    facebookUrl: "https://www.facebook.com/SSGCTUArgao",
  },
  {
    slug: "asturias",
    name: "CTU Asturias Campus",
    shortName: "CTU Asturias",
    type: "satellite",
    location: "Asturias, Cebu",
    address: "Poblacion, Asturias, 6042 Cebu",
    description:
      "Mid-west Cebu satellite campus serving western municipalities with education, hospitality, and technology degree offerings.",
    keywords: ["asturias", "ctu asturias", "ctu-asturias"],
    offeredPrograms: ["BSIT", "BSHM", "BEEd", "BSEd", "BIT"],
    email: "asturias@ctu.edu.ph",
    websiteUrl: "https://www.ctu.edu.ph/asturias/",
    facebookUrl: "https://www.facebook.com/profile.php?id=61580222175072",
  },
  {
    slug: "balamban",
    name: "CTU Balamban Campus",
    shortName: "CTU Balamban",
    type: "satellite",
    location: "Balamban, Cebu",
    address: "Prenza, Balamban, 6041 Cebu",
    description:
      "Located in the shipbuilding hub of Cebu, offering engineering, industrial technology, IT, and teacher education aligned with maritime and manufacturing industries.",
    keywords: ["balamban", "ctu balamban", "ctu-balamban"],
    offeredPrograms: ["BSIT", "BSIE", "BSME", "BEEd", "BSEd", "BIT"],
    email: "balamban@ctu.edu.ph",
    websiteUrl: "https://www.ctu.edu.ph/balamban/",
    facebookUrl: "https://www.facebook.com/profile.php?id=61565739599114",
  },
  {
    slug: "barili",
    name: "CTU Barili Campus",
    shortName: "CTU Barili",
    type: "satellite",
    location: "Barili, Cebu",
    address: "Cagay, Barili, 6036 Cebu",
    description:
      "A premier agricultural and agribusiness campus in southwestern Cebu alongside IT, hospitality, and education tracks.",
    keywords: ["barili", "ctu barili", "ctu-barili"],
    offeredPrograms: ["BSA", "BSIT", "BSHM", "BEEd", "BSEd", "DAT-BAT"],
    email: "barili@ctu.edu.ph",
    websiteUrl: "https://www.ctu.edu.ph/barili/",
    facebookUrl: "https://www.facebook.com/SSGCTUBarili",
  },
  {
    slug: "borbon",
    name: "CTU Borbon Campus",
    shortName: "CTU Borbon",
    type: "satellite",
    location: "Borbon, Cebu",
    address: "Poblacion, Borbon, 6008 Cebu",
    description:
      "Northern Cebu satellite campus expanding access to teacher education, hospitality, and applied technology degrees.",
    keywords: ["borbon", "ctu borbon", "ctu-borbon"],
    offeredPrograms: ["BSIT", "BSHM", "BEEd", "BSEd"],
    email: "borbon@ctu.edu.ph",
    websiteUrl: "https://www.ctu.edu.ph/borbon/",
    facebookUrl: "CTU_OFFICIAL_FACEBOOK_URL",
  },
  {
    slug: "carmen",
    name: "CTU Carmen Campus",
    shortName: "CTU Carmen",
    type: "satellite",
    location: "Carmen, Cebu",
    address: "R.M. Durano Ave., Poblacion, Carmen, 6005 Cebu",
    description:
      "Northern Cebu campus recognized for fisheries, marine technology, hospitality, and education programs.",
    keywords: ["carmen", "ctu carmen", "ctu-carmen"],
    offeredPrograms: ["BSFi", "BSIT", "BSHM", "BEEd", "BSEd", "BIT"],
    email: "carmen@ctu.edu.ph",
    websiteUrl: "https://www.ctu.edu.ph/carmen/",
    facebookUrl: CTU_OFFICIAL_FACEBOOK_URL,
  },
  {
    slug: "cebu-city-mountain",
    name: "CTU Cebu City Mountain Campus",
    shortName: "CTU Mountain",
    type: "satellite",
    location: "Babag, Cebu City",
    address: "Brgy. Babag, Cebu City, 6000 Cebu",
    description:
      "Upland Cebu City satellite campus dedicated to sustainable agriculture, environmental stewardship, and community education.",
    keywords: ["cebu city mountain", "mountain campus", "babag", "ctu mountain", "ctu-mountain"],
    offeredPrograms: ["BSA", "BEEd", "BSEd", "BIT"],
    email: "mountain@ctu.edu.ph",
    websiteUrl: "https://www.ctu.edu.ph/cebu-city-mountain/",
    facebookUrl: CTU_OFFICIAL_FACEBOOK_URL,
  },
  {
    slug: "consolacion",
    name: "CTU Consolacion Campus",
    shortName: "CTU Consolacion",
    type: "satellite",
    location: "Consolacion, Cebu",
    address: "Laray, Nangka, Consolacion, 6001 Cebu",
    description:
      "Metro Cebu North campus offering information technology, hospitality management, business, and education programs.",
    keywords: ["consolacion", "ctu consolacion", "ctu-consolacion"],
    offeredPrograms: ["BSIT", "BSHM", "BEEd", "BSEd", "BIT"],
    email: "consolacion@ctu.edu.ph",
    websiteUrl: "https://www.ctu.edu.ph/consolacion/",
    facebookUrl: CTU_OFFICIAL_FACEBOOK_URL,
  },
  {
    slug: "daanbantayan",
    name: "CTU Daanbantayan Campus",
    shortName: "CTU Daanbantayan",
    type: "satellite",
    location: "Daanbantayan, Cebu",
    address: "Agujo, Daanbantayan, 6013 Cebu",
    description:
      "Northernmost mainland Cebu campus specializing in fisheries, industrial technology, hospitality, IT, and teacher education.",
    keywords: ["daanbantayan", "ctu daanbantayan", "ctu-daanbantayan"],
    offeredPrograms: ["BSIT", "BSHM", "BEEd", "BSEd", "BIT", "BSFi", "BSIE"],
    hotline: "(032) 437-8523",
    email: "daanbantayan@ctu.edu.ph",
    websiteUrl: "https://www.ctu.edu.ph/daanbantayan/",
    facebookUrl: "https://www.facebook.com/SSGCTUDB",
  },
  {
    slug: "danao",
    name: "CTU Danao Campus",
    shortName: "CTU Danao",
    type: "satellite",
    location: "Danao City, Cebu",
    address: "Sabang, Danao City, 6004 Cebu",
    description:
      "Major northern Metro Cebu satellite campus known for engineering, industrial technology, IT, business, and education programs.",
    keywords: ["danao", "danao city", "ctu danao", "ctu-danao"],
    offeredPrograms: ["BSIT", "BSCE", "BSME", "BSEE", "BSIE", "BSHM", "BEEd", "BSEd", "BSBA"],
    hotline: "(032) 354-3660",
    email: "danao@ctu.edu.ph",
    websiteUrl: "https://www.ctu.edu.ph/danao/",
    facebookUrl: CTU_OFFICIAL_FACEBOOK_URL,
  },
  {
    slug: "liloan",
    name: "CTU Liloan Campus",
    shortName: "CTU Liloan",
    type: "satellite",
    location: "Liloan, Cebu",
    address: "Poblacion, Liloan, 6002 Cebu",
    description:
      "Coastal northern Metro Cebu satellite campus delivering IT, hospitality, and education courses for learners in Liloan and neighboring towns.",
    keywords: ["liloan", "ctu liloan", "ctu-liloan"],
    offeredPrograms: ["BSIT", "BSHM", "BEEd", "BSEd"],
    email: "liloan@ctu.edu.ph",
    websiteUrl: "https://www.ctu.edu.ph/liloan/",
    facebookUrl: CTU_OFFICIAL_FACEBOOK_URL,
  },
  {
    slug: "moalboal",
    name: "CTU Moalboal Campus",
    shortName: "CTU Moalboal",
    type: "satellite",
    location: "Moalboal, Cebu",
    address: "Poblacion West, Moalboal, 6032 Cebu",
    description:
      "Southwestern Cebu campus strong in tourism, hospitality management, fisheries, IT, and teacher education.",
    keywords: ["moalboal", "ctu moalboal", "ctu-moalboal"],
    offeredPrograms: ["BSHM", "BSTM", "BSIT", "BSFi", "BEEd", "BSEd", "BIT"],
    email: "moalboal@ctu.edu.ph",
    websiteUrl: "https://www.ctu.edu.ph/moalboal/",
    facebookUrl: CTU_OFFICIAL_FACEBOOK_URL,
  },
  {
    slug: "pinamungajan",
    name: "CTU Pinamungajan Campus",
    shortName: "CTU Pinamungajan",
    type: "satellite",
    location: "Pinamungajan, Cebu",
    address: "Poblacion, Pinamungajan, 6039 Cebu",
    description:
      "Mid-west Cebu satellite campus supporting community-driven technology, hospitality, and education degrees.",
    keywords: ["pinamungajan", "ctu pinamungajan", "ctu-pinamungajan"],
    offeredPrograms: ["BSIT", "BSHM", "BEEd", "BSEd"],
    email: "pinamungajan@ctu.edu.ph",
    websiteUrl: "https://www.ctu.edu.ph/pinamungajan/",
    facebookUrl: CTU_OFFICIAL_FACEBOOK_URL,
  },
  {
    slug: "san-francisco",
    name: "CTU San Francisco Campus",
    shortName: "CTU San Francisco",
    type: "satellite",
    location: "San Francisco, Camotes Islands",
    address: "Northern Poblacion, San Francisco, Camotes, 6050 Cebu",
    description:
      "Island campus serving the Camotes archipelago with marine fisheries, tourism, hospitality, IT, and education programs.",
    keywords: ["san francisco", "camotes", "ctu san francisco", "ctu-san francisco"],
    offeredPrograms: ["BSIT", "BSHM", "BSTM", "BEEd", "BSEd", "BSFi", "BIT"],
    email: "sanfrancisco@ctu.edu.ph",
    websiteUrl: "https://www.ctu.edu.ph/san-francisco/",
    facebookUrl: CTU_OFFICIAL_FACEBOOK_URL,
  },
  {
    slug: "toledo",
    name: "CTU Toledo Campus",
    shortName: "CTU Toledo",
    type: "satellite",
    location: "Toledo City, Cebu",
    address: "Poblacion, Toledo City, 6038 Cebu",
    description:
      "Western Cebu city campus supporting industrial technology, engineering, IT, and education for Cebu's mining and energy corridor.",
    keywords: ["toledo", "toledo city", "ctu toledo", "ctu-toledo"],
    offeredPrograms: ["BSIT", "BIT", "BSHM", "BEEd", "BSEd"],
    email: "toledo@ctu.edu.ph",
    websiteUrl: "https://www.ctu.edu.ph/toledo/",
    facebookUrl: CTU_OFFICIAL_FACEBOOK_URL,
  },
  {
    slug: "tuburan",
    name: "CTU Tuburan Campus",
    shortName: "CTU Tuburan",
    type: "satellite",
    location: "Tuburan, Cebu",
    address: "Brgy. 8, Poblacion, Tuburan, 6043 Cebu",
    description:
      "Northwestern Cebu satellite campus recognized for engineering, agriculture, hospitality, IT, and education.",
    keywords: ["tuburan", "ctu tuburan", "ctu-tuburan"],
    offeredPrograms: ["BSIT", "BSCE", "BSME", "BSA", "BSHM", "BEEd", "BSEd", "BIT"],
    email: "tuburan@ctu.edu.ph",
    websiteUrl: "https://www.ctu.edu.ph/tuburan/",
    facebookUrl: CTU_OFFICIAL_FACEBOOK_URL,
  },

  // --- EXTENSION CAMPUSES (12) ---
  {
    slug: "bantayan",
    name: "CTU Bantayan Extension",
    shortName: "CTU Bantayan",
    type: "extension",
    location: "Bantayan Island, Cebu",
    address: "Ticad, Bantayan, Bantayan Island, 6052 Cebu",
    description:
      "Extension campus serving Bantayan Island learners under CTU Daanbantayan supervision, focusing on fisheries, hospitality, IT, and education.",
    keywords: ["bantayan", "bantayan island", "ctu bantayan"],
    offeredPrograms: ["BSIT", "BSHM", "BEEd", "BSEd", "BSFi"],
    websiteUrl: "https://www.ctu.edu.ph/bantayan/",
    facebookUrl: "https://www.facebook.com/CTUBANTAYANSSG",
  },
  {
    slug: "dumanjug",
    name: "CTU Dumanjug Extension",
    shortName: "CTU Dumanjug",
    type: "extension",
    location: "Dumanjug, Cebu",
    address: "Poblacion, Dumanjug, 6035 Cebu",
    description:
      "Southwestern Cebu extension campus expanding access to education, hospitality, and technology degree pathways.",
    keywords: ["dumanjug", "ctu dumanjug"],
    offeredPrograms: ["BSIT", "BSHM", "BEEd", "BSEd"],
    websiteUrl: "https://www.ctu.edu.ph/dumanjug/",
    facebookUrl: CTU_OFFICIAL_FACEBOOK_URL,
  },
  {
    slug: "ginatilan",
    name: "CTU Ginatilan Extension",
    shortName: "CTU Ginatilan",
    type: "extension",
    location: "Ginatilan, Cebu",
    address: "Poblacion, Ginatilan, 6028 Cebu",
    description:
      "Southern Cebu extension campus providing accessible higher education in teacher education, IT, and hospitality.",
    keywords: ["ginatilan", "ctu ginatilan"],
    offeredPrograms: ["BSIT", "BSHM", "BEEd", "BSEd"],
    websiteUrl: "https://www.ctu.edu.ph/ginatilan/",
    facebookUrl: CTU_OFFICIAL_FACEBOOK_URL,
  },
  {
    slug: "guba",
    name: "CTU Guba Extension",
    shortName: "CTU Guba",
    type: "extension",
    location: "Guba, Cebu City",
    address: "Brgy. Guba, Cebu City, 6000 Cebu",
    description:
      "Northern highland Cebu City extension campus supporting upland youth with agricultural and education degree programs.",
    keywords: ["guba", "ctu guba", "brgy. guba"],
    offeredPrograms: ["BSA", "BEEd", "BSEd", "BSIT"],
    websiteUrl: "https://www.ctu.edu.ph/guba/",
    facebookUrl: CTU_OFFICIAL_FACEBOOK_URL,
  },
  {
    slug: "malabuyoc",
    name: "CTU Malabuyoc Extension",
    shortName: "CTU Malabuyoc",
    type: "extension",
    location: "Malabuyoc, Cebu",
    address: "Poblacion, Malabuyoc, 6029 Cebu",
    description:
      "Southern coastal Cebu extension campus offering teacher education, hospitality, and technical programs.",
    keywords: ["malabuyoc", "ctu malabuyoc"],
    offeredPrograms: ["BEEd", "BSEd", "BSHM", "BSIT"],
    websiteUrl: "https://www.ctu.edu.ph/malabuyoc/",
    facebookUrl: CTU_OFFICIAL_FACEBOOK_URL,
  },
  {
    slug: "naga",
    name: "CTU Naga Extension",
    shortName: "CTU Naga",
    type: "extension",
    location: "City of Naga, Cebu",
    address: "Central Poblacion, City of Naga, 6037 Cebu",
    description:
      "Southern Metro Cebu extension campus serving City of Naga with IT, industrial technology, hospitality, and education tracks.",
    keywords: ["city of naga", "ctu naga", "naga extension", "naga, cebu"],
    offeredPrograms: ["BSIT", "BIT", "BSHM", "BEEd", "BSEd"],
    websiteUrl: "https://www.ctu.edu.ph/naga/",
    facebookUrl: CTU_OFFICIAL_FACEBOOK_URL,
  },
  {
    slug: "oslob",
    name: "CTU Oslob Extension",
    shortName: "CTU Oslob",
    type: "extension",
    location: "Oslob, Cebu",
    address: "Poblacion, Oslob, 6025 Cebu",
    description:
      "Southeastern Cebu extension campus aligned with eco-tourism, hospitality management, IT, and teacher education.",
    keywords: ["oslob", "ctu oslob"],
    offeredPrograms: ["BSHM", "BSTM", "BSIT", "BEEd", "BSEd"],
    websiteUrl: "https://www.ctu.edu.ph/oslob/",
    facebookUrl: CTU_OFFICIAL_FACEBOOK_URL,
  },
  {
    slug: "san-fernando",
    name: "CTU San Fernando Extension",
    shortName: "CTU San Fernando",
    type: "extension",
    location: "San Fernando, Cebu",
    address: "Poblacion South, San Fernando, 6018 Cebu",
    description:
      "Southern Cebu extension campus providing accessible technology, business, and teacher education programs.",
    keywords: ["san fernando", "ctu san fernando"],
    offeredPrograms: ["BSIT", "BSHM", "BEEd", "BSEd"],
    websiteUrl: "https://www.ctu.edu.ph/san-fernando/",
    facebookUrl: CTU_OFFICIAL_FACEBOOK_URL,
  },
  {
    slug: "san-remigio",
    name: "CTU San Remigio Extension",
    shortName: "CTU San Remigio",
    type: "extension",
    location: "San Remigio, Cebu",
    address: "Poblacion, San Remigio, 6011 Cebu",
    description:
      "Northern Cebu coastal extension campus delivering hospitality, fisheries, IT, and education courses.",
    keywords: ["san remigio", "ctu san remigio"],
    offeredPrograms: ["BSIT", "BSHM", "BEEd", "BSEd"],
    websiteUrl: "https://www.ctu.edu.ph/san-remigio/",
    facebookUrl: CTU_OFFICIAL_FACEBOOK_URL,
  },
  {
    slug: "sogod",
    name: "CTU Sogod Extension",
    shortName: "CTU Sogod",
    type: "extension",
    location: "Sogod, Cebu",
    address: "Poblacion, Sogod, 6007 Cebu",
    description:
      "Northern Cebu extension campus supporting local students in hospitality, IT, and education programs.",
    keywords: ["sogod", "ctu sogod"],
    offeredPrograms: ["BSIT", "BSHM", "BEEd", "BSEd"],
    websiteUrl: "https://www.ctu.edu.ph/sogod/",
    facebookUrl: CTU_OFFICIAL_FACEBOOK_URL,
  },
  {
    slug: "tabogon",
    name: "CTU Tabogon Extension",
    shortName: "CTU Tabogon",
    type: "extension",
    location: "Tabogon, Cebu",
    address: "Poblacion, Tabogon, 6009 Cebu",
    description:
      "Northern Cebu extension campus bringing degree programs in IT, hospitality, and education closer to Tabogon residents.",
    keywords: ["tabogon", "ctu tabogon"],
    offeredPrograms: ["BSIT", "BSHM", "BEEd", "BSEd"],
    websiteUrl: "https://www.ctu.edu.ph/tabogon/",
    facebookUrl: CTU_OFFICIAL_FACEBOOK_URL,
  },
  {
    slug: "tabuelan",
    name: "CTU Tabuelan Extension",
    shortName: "CTU Tabuelan",
    type: "extension",
    location: "Tabuelan, Cebu",
    address: "Poblacion, Tabuelan, 6044 Cebu",
    description:
      "Northwestern Cebu extension campus offering teacher education, hospitality, and technology courses.",
    keywords: ["tabuelan", "ctu tabuelan"],
    offeredPrograms: ["BSIT", "BSHM", "BEEd", "BSEd"],
    websiteUrl: "https://www.ctu.edu.ph/tabuelan/",
    facebookUrl: CTU_OFFICIAL_FACEBOOK_URL,
  },
];

// quick lookup map so we dont loop 29 times on every card render
export const CAMPUS_MAP: Record<string, Campus> = Object.fromEntries(
  CTU_CAMPUSES.map((c) => [c.slug, c])
);

export function getCampusBySlug(slug: string): Campus | undefined {
  return CAMPUS_MAP[slug];
}

// fallback to main ctu fb page if campus doesnt have its own ssg link yet
export function getCampusFacebookUrl(campus?: Campus): string {
  return campus?.facebookUrl || CTU_OFFICIAL_FACEBOOK_URL;
}

// matches campus names/keywords inside scraped post title, categories, or body text
// using word boundaries so e.g. "main" doesnt match "remain" or "domain"
export function matchCampusesInText(text: string): string[] {
  if (!text) return [];
  const normalized = text.toLowerCase();
  const matched = new Set<string>();

  for (const campus of CTU_CAMPUSES) {
    for (const kw of campus.keywords) {
      const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`\\b${escaped}\\b`, "i");
      if (regex.test(normalized)) {
        matched.add(campus.slug);
        break;
      }
    }
  }

  // also catch plain "Naga" when paired with CTU or Cebu context
  if (!matched.has("naga") && /\bctu[\s-]*naga\b|\bnaga\s+campus\b|\bnaga\s+extension\b/i.test(normalized)) {
    matched.add("naga");
  }

  return Array.from(matched);
}
