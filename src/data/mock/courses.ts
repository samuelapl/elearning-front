import type { Course } from "@/types";

export const COURSE_CATEGORIES = ["Tax", "Customs", "Excise", "Compliance", "Systems"];

export const INITIAL_COURSES: Course[] = [
  {
    id: "c1",
    code: "VAT-101",
    title: "VAT Registration & Compliance",
    category: "Tax",
    description:
      "Covers VAT registration requirements, tax invoice rules, return filing, and record keeping obligations under Ethiopian tax law.",
    ownerId: "u1",
    trainerId: "u4",
    status: "approved",
    published: true,
    enrolledLearnerIds: ["u5", "u8", "u9", "u13"],
    progress: { u5: 45, u8: 62, u9: 30, u13: 80 },
    modules: [
      {
        id: "m1",
        title: "Module 1: Introduction to VAT",
        lessons: [
          { id: "l1", title: "What is VAT and who must register", durationMin: 15 },
          { id: "l2", title: "Registration threshold and process", durationMin: 20 },
        ],
      },
      {
        id: "m2",
        title: "Module 2: Invoicing & Returns",
        lessons: [
          { id: "l3", title: "Issuing compliant tax invoices", durationMin: 25 },
          { id: "l4", title: "Filing VAT returns monthly", durationMin: 20 },
        ],
      },
    ],
    quiz: {
      id: "q1",
      title: "VAT Fundamentals Quiz",
      passMark: 70,
      attemptsAllowed: 2,
      questions: [
        {
          id: "q1a",
          text: "Which rate applies to most supplies of goods and services in Ethiopia?",
          options: ["10%", "15%", "18%", "5%"],
          correctIndex: 1,
          points: 10,
        },
        {
          id: "q1b",
          text: "What is the annual turnover threshold for mandatory VAT registration?",
          options: ["ETB 500,000", "ETB 1,000,000", "ETB 2,000,000", "ETB 5,000,000"],
          correctIndex: 1,
          points: 10,
        },
        {
          id: "q1c",
          text: "VAT returns must be filed:",
          options: ["Monthly, by the 15th", "Monthly, by the 30th", "Quarterly", "Annually"],
          correctIndex: 0,
          points: 10,
        },
      ],
    },
  },
  {
    id: "c2",
    code: "CUS-201",
    title: "Customs Declaration Procedures",
    category: "Customs",
    description:
      "Step-by-step guide to lodging electronic customs declarations, required documents, and common clearance workflows.",
    ownerId: "u1",
    trainerId: null,
    status: "under_review",
    published: false,
    enrolledLearnerIds: [],
    progress: {},
    modules: [
      {
        id: "m3",
        title: "Module 1: The Declaration Process",
        lessons: [
          { id: "l5", title: "Overview of the customs declaration process", durationMin: 20 },
          { id: "l6", title: "Supported documents and data requirements", durationMin: 25 },
        ],
      },
      {
        id: "m4",
        title: "Module 2: Clearance & Payment",
        lessons: [
          { id: "l7", title: "Assessment, verification and clearance", durationMin: 25 },
          { id: "l8", title: "Duty payment and release orders", durationMin: 20 },
        ],
      },
    ],
  },
  {
    id: "c3",
    code: "INC-102",
    title: "Income Tax Basics for SMEs",
    category: "Tax",
    description:
      "An introduction to income, business profit and presumptive taxation for small and medium enterprises in Ethiopia.",
    ownerId: "u1",
    trainerId: "u4",
    status: "approved",
    published: true,
    enrolledLearnerIds: ["u5", "u9", "u13", "u14"],
    progress: { u5: 80, u9: 55, u13: 100, u14: 20 },
    modules: [
      {
        id: "m5",
        title: "Module 1: Income Taxation Basics",
        lessons: [
          { id: "l9", title: "Types of income and who pays", durationMin: 15 },
          { id: "l10", title: "Employment income and withholding", durationMin: 20 },
        ],
      },
      {
        id: "m6",
        title: "Module 2: Business Profit & Filing",
        lessons: [
          { id: "l11", title: "Business profit tax computations", durationMin: 30 },
          { id: "l12", title: "Filing deadlines and penalties", durationMin: 15 },
        ],
      },
    ],
    quiz: {
      id: "q3",
      title: "Income Tax Essentials Quiz",
      passMark: 60,
      attemptsAllowed: 3,
      questions: [
        {
          id: "q3a",
          text: "Employment income in Ethiopia is taxed on:",
          options: ["A progressive scale", "A flat 20%", "A flat 30%", "Exempt income"],
          correctIndex: 0,
          points: 10,
        },
        {
          id: "q3b",
          text: "The income tax fiscal year runs from:",
          options: ["January to December", "July to June (Sene 30)", "September to August", "October to September"],
          correctIndex: 1,
          points: 10,
        },
        {
          id: "q3c",
          text: "Presumptive taxation applies mainly to:",
          options: ["Large businesses", "Small businesses below the audit threshold", "Government bodies", "Importers only"],
          correctIndex: 1,
          points: 10,
        },
      ],
    },
  },
  {
    id: "c4",
    code: "TAR-301",
    title: "Import Duty & Tariff Classification",
    category: "Customs",
    description:
      "Understanding the Ethiopian Harmonized System, tariff classification methodology, and duty calculation for imports.",
    ownerId: "u1",
    trainerId: "u7",
    status: "approved",
    published: true,
    enrolledLearnerIds: ["u5", "u10", "u12"],
    progress: { u5: 15, u10: 100, u12: 70 },
    modules: [
      {
        id: "m7",
        title: "Module 1: The Harmonized System",
        lessons: [
          { id: "l13", title: "Structure of the Ethiopian HS code", durationMin: 25 },
          { id: "l14", title: "Rules for classification", durationMin: 30 },
        ],
      },
      {
        id: "m8",
        title: "Module 2: Valuation & Duty",
        lessons: [
          { id: "l15", title: "Customs valuation methods", durationMin: 20 },
          { id: "l16", title: "Calculating import duty and levies", durationMin: 25 },
        ],
      },
    ],
  },
  {
    id: "c5",
    code: "WHT-110",
    title: "Withholding Tax Essentials",
    category: "Tax",
    description:
      "Practical guide to withholding tax on payments, remittance schedules, and issuing withholding tax certificates.",
    ownerId: "u1",
    trainerId: "u4",
    status: "draft",
    published: false,
    enrolledLearnerIds: [],
    progress: {},
    modules: [
      {
        id: "m9",
        title: "Module 1: Scope of Withholding",
        lessons: [
          { id: "l17", title: "When withholding tax applies", durationMin: 20 },
          { id: "l18", title: "Rates and exemptions", durationMin: 15 },
        ],
      },
      {
        id: "m10",
        title: "Module 2: Remittance & Certificates",
        lessons: [
          { id: "l19", title: "Remitting withheld amounts", durationMin: 15 },
          { id: "l20", title: "Withholding tax certificates", durationMin: 20 },
        ],
      },
    ],
  },
  {
    id: "c6",
    code: "EXC-205",
    title: "Excise Tax on Alcohol & Tobacco",
    category: "Excise",
    description:
      "Excise tax liabilities on alcohol and tobacco products, licensing, and excise return filing for regulated industries.",
    ownerId: "u1",
    trainerId: "u4",
    status: "approved",
    published: false,
    enrolledLearnerIds: ["u11"],
    progress: { u11: 0 },
    modules: [
      {
        id: "m11",
        title: "Module 1: Excise Tax Scope",
        lessons: [
          { id: "l21", title: "Products subject to excise tax", durationMin: 15 },
          { id: "l22", title: "Rate schedule and computation", durationMin: 25 },
        ],
      },
      {
        id: "m12",
        title: "Module 2: Licensing & Returns",
        lessons: [
          { id: "l23", title: "Licensing requirements", durationMin: 20 },
          { id: "l24", title: "Excise returns and payments", durationMin: 15 },
        ],
      },
    ],
  },
  {
    id: "c7",
    code: "AUD-401",
    title: "Tax Audit Procedures",
    category: "Compliance",
    description:
      "How tax audits are planned and conducted, taxpayer rights, document preparation, and responding to audit findings.",
    ownerId: "u1",
    trainerId: "u4",
    status: "approved",
    published: true,
    enrolledLearnerIds: ["u5", "u8", "u14"],
    progress: { u5: 100, u8: 100, u14: 65 },
    modules: [
      {
        id: "m13",
        title: "Module 1: The Audit Cycle",
        lessons: [
          { id: "l25", title: "Risk selection and audit planning", durationMin: 20 },
          { id: "l26", title: "Fieldwork and evidence gathering", durationMin: 30 },
        ],
      },
      {
        id: "m14",
        title: "Module 2: Rights & Records",
        lessons: [
          { id: "l27", title: "Taxpayer rights during audit", durationMin: 15 },
          { id: "l28", title: "Preparing books and records", durationMin: 25 },
        ],
      },
    ],
  },
  {
    id: "c8",
    code: "ESV-001",
    title: "eServices Portal User Training",
    category: "Systems",
    description:
      "Hands-on training for the MoR eServices portal: account setup, online declarations, payments, and tracking applications.",
    ownerId: "u1",
    trainerId: "u7",
    status: "approved",
    published: true,
    enrolledLearnerIds: ["u5", "u10", "u11", "u12"],
    progress: { u5: 100, u10: 45, u11: 90, u12: 25 },
    modules: [
      {
        id: "m15",
        title: "Module 1: Getting Started",
        lessons: [
          { id: "l29", title: "Creating and verifying your account", durationMin: 15 },
          { id: "l30", title: "Navigating the eServices dashboard", durationMin: 20 },
        ],
      },
      {
        id: "m16",
        title: "Module 2: Transactions Online",
        lessons: [
          { id: "l31", title: "Filing declarations electronically", durationMin: 25 },
          { id: "l32", title: "Making payments and tracking status", durationMin: 15 },
        ],
      },
    ],
  },
];