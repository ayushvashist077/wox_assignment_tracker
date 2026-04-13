
// This is your super admin email — the ONLY hardcoded email
// Super admin can manage CRs from the admin panel
export const SUPER_ADMIN_EMAIL = "ayushvashist077@gmail.com"; // <-- Replace with YOUR email

export const SUBJECTS = [
  "Business Law, AI Ethics, Society & Sustainable Value Creation",
  "Digital Product Management & Human Experience",
  "Generative AI for Business & Workplace",
  "NLP for Customer & Market Insights",
  "Numerical Ability & Personality Refinement",
  "Managerial Accounting and Financial Decision-Making",
];

export const STATUS_OPTIONS = ["All", "Pending", "Completed"];

export const SORT_OPTIONS = [
  { value: "deadline-asc", label: "Deadline (Earliest First)" },
  { value: "deadline-desc", label: "Deadline (Latest First)" },
  { value: "uploaded-desc", label: "Recently Added" },
  { value: "subject-asc", label: "Subject (A-Z)" },
];