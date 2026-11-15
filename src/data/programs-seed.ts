import { AcademicProgram } from "@/types/portal";
import { CTU_CAMPUSES } from "./campuses";

// helper so we can map program codes straight from the campus seed list
function campusesOffering(code: string): string[] {
  return CTU_CAMPUSES.filter((c) => c.offeredPrograms.includes(code)).map((c) => c.slug);
}

// baseline ctu degree catalog; gets merged with whatever programs we manage to scrape from wp pages
export const BASELINE_PROGRAMS: AcademicProgram[] = [
  {
    id: "prog-bsit",
    code: "BSIT",
    name: "Bachelor of Science in Information Technology",
    college: "College of Technology / Engineering & IT",
    level: "Undergraduate",
    description:
      "Covers software development, web & mobile systems, networking, database administration, and IT infrastructure management.",
    campusSlugs: campusesOffering("BSIT"),
    sourceUrl: "https://www.ctu.edu.ph/",
  },
  {
    id: "prog-bshm",
    code: "BSHM",
    name: "Bachelor of Science in Hospitality Management",
    college: "College of Management and Entrepreneurship",
    level: "Undergraduate",
    description:
      "Prepares students for hotel, resort, culinary, and food & beverage operations across Cebu's tourism and hospitality sector.",
    campusSlugs: campusesOffering("BSHM"),
    sourceUrl: "https://www.ctu.edu.ph/",
  },
  {
    id: "prog-bstm",
    code: "BSTM",
    name: "Bachelor of Science in Tourism Management",
    college: "College of Management and Entrepreneurship",
    level: "Undergraduate",
    description:
      "Focuses on sustainable tourism planning, travel operations, destination marketing, and eco-tourism management.",
    campusSlugs: campusesOffering("BSTM"),
    sourceUrl: "https://www.ctu.edu.ph/",
  },
  {
    id: "prog-beed",
    code: "BEEd",
    name: "Bachelor of Elementary Education",
    college: "College of Education",
    level: "Undergraduate",
    description:
      "Equips future elementary school educators with pedagogical foundations, curriculum design, and classroom practice.",
    campusSlugs: campusesOffering("BEEd"),
    sourceUrl: "https://www.ctu.edu.ph/",
  },
  {
    id: "prog-bsed",
    code: "BSEd",
    name: "Bachelor of Secondary Education",
    college: "College of Education",
    level: "Undergraduate",
    description:
      "Trains high school educators across majors including Mathematics, English, Science, Filipino, and Social Studies.",
    campusSlugs: campusesOffering("BSEd"),
    sourceUrl: "https://www.ctu.edu.ph/",
  },
  {
    id: "prog-bsce",
    code: "BSCE",
    name: "Bachelor of Science in Civil Engineering",
    college: "College of Engineering",
    level: "Undergraduate",
    description:
      "Focuses on structural design, geotechnical engineering, transportation systems, and public infrastructure construction.",
    campusSlugs: campusesOffering("BSCE"),
    sourceUrl: "https://www.ctu.edu.ph/",
  },
  {
    id: "prog-bsme",
    code: "BSME",
    name: "Bachelor of Science in Mechanical Engineering",
    college: "College of Engineering",
    level: "Undergraduate",
    description:
      "Covers thermodynamics, machine design, manufacturing systems, HVAC, and industrial energy conversion.",
    campusSlugs: campusesOffering("BSME"),
    sourceUrl: "https://www.ctu.edu.ph/",
  },
  {
    id: "prog-bsee",
    code: "BSEE",
    name: "Bachelor of Science in Electrical Engineering",
    college: "College of Engineering",
    level: "Undergraduate",
    description:
      "Addresses power systems, electrical machines, industrial automation, and renewable energy engineering.",
    campusSlugs: campusesOffering("BSEE"),
    sourceUrl: "https://www.ctu.edu.ph/",
  },
  {
    id: "prog-bsie",
    code: "BSIE",
    name: "Bachelor of Science in Industrial Engineering",
    college: "College of Engineering",
    level: "Undergraduate",
    description:
      "Optimizes complex manufacturing, supply chain, ergonomics, and quality assurance processes.",
    campusSlugs: campusesOffering("BSIE"),
    sourceUrl: "https://www.ctu.edu.ph/",
  },
  {
    id: "prog-bit",
    code: "BIT",
    name: "Bachelor of Industrial Technology",
    college: "College of Technology",
    level: "Undergraduate",
    description:
      "Hands-on technical degree with majors in Automotive, Electrical, Electronics, Drafting, Welding, and Food Technology.",
    campusSlugs: campusesOffering("BIT"),
    sourceUrl: "https://www.ctu.edu.ph/",
  },
  {
    id: "prog-bsba",
    code: "BSBA",
    name: "Bachelor of Science in Business Administration",
    college: "College of Management and Entrepreneurship",
    level: "Undergraduate",
    description:
      "Develops core competencies in financial management, marketing, human resources, and enterprise strategy.",
    campusSlugs: campusesOffering("BSBA"),
    sourceUrl: "https://www.ctu.edu.ph/",
  },
  {
    id: "prog-bsa",
    code: "BSA",
    name: "Bachelor of Science in Agriculture",
    college: "College of Agriculture, Forestry, and Environment",
    level: "Undergraduate",
    description:
      "Trains agricultural scientists and agripreneurs in crop science, animal husbandry, soil management, and sustainable farming.",
    campusSlugs: campusesOffering("BSA"),
    sourceUrl: "https://www.ctu.edu.ph/",
  },
  {
    id: "prog-bsfi",
    code: "BSFi",
    name: "Bachelor of Science in Fisheries",
    college: "College of Fisheries and Marine Sciences",
    level: "Undergraduate",
    description:
      "Specializes in aquaculture, marine biology, post-harvest fisheries technology, and coastal resource conservation.",
    campusSlugs: campusesOffering("BSFi"),
    sourceUrl: "https://www.ctu.edu.ph/",
  },
  {
    id: "prog-bsf",
    code: "BSF",
    name: "Bachelor of Science in Forestry",
    college: "College of Agriculture, Forestry, and Environment",
    level: "Undergraduate",
    description:
      "Focuses on forest conservation, watershed management, biodiversity, and agroforestry systems.",
    campusSlugs: campusesOffering("BSF"),
    sourceUrl: "https://www.ctu.edu.ph/",
  },
  {
    id: "prog-mit",
    code: "MIT",
    name: "Master in Information Technology",
    college: "Graduate School",
    level: "Graduate",
    description:
      "Advanced graduate track for IT practitioners focusing on enterprise architecture, data systems, and applied computing research.",
    campusSlugs: campusesOffering("MIT"),
    sourceUrl: "https://www.ctu.edu.ph/",
  },
  {
    id: "prog-phd-tm",
    code: "PhD-TM",
    name: "Doctor of Philosophy in Technology Management",
    college: "Graduate School",
    level: "Graduate",
    description:
      "Doctoral research program developing leaders in industrial innovation, engineering systems, and R&D management.",
    campusSlugs: campusesOffering("PhD-TM"),
    sourceUrl: "https://www.ctu.edu.ph/",
  },
];
